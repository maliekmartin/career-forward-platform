#!/usr/bin/env tsx

/**
 * Lightcast Data Import Script
 *
 * Processes Lightcast Excel exports and generates market-data.json
 *
 * Usage: npm run import-lightcast
 */

import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

// Type definitions
interface OccupationData {
  socCode: string;
  title: string;
  salary: {
    median: number;
    average?: number;
    hourly?: {
      median?: number;
      average?: number;
    };
  };
  employment: {
    current: number;
    projected: number;
    change: number;
    changePercent: number;
  };
  demand: {
    avgAnnualOpenings: number;
    uniquePostings?: number;
    hires?: number;
  };
}

interface RegionData {
  occupations: OccupationData[];
  topGrowing: OccupationData[];
  topPaying: OccupationData[];
  topDemand: OccupationData[];
  summary: {
    totalOccupations: number;
    totalJobs: number;
    totalOpenings: number;
    avgMedianSalary: number;
  };
}

interface MarketData {
  lastUpdated: string;
  dataVersion: string;
  regions: {
    us: RegionData;
    washington: RegionData;
    spokane: RegionData;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data', 'lightcast', 'raw');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'market-data.json');

/**
 * Parse Lightcast Excel file
 */
function parseExcel(filePath: string): OccupationData[] {
  console.log(`📊 Parsing: ${path.basename(filePath)}`);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return [];
  }

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['Occs'];

  if (!worksheet) {
    console.error(`❌ "Occs" sheet not found in ${filePath}`);
    return [];
  }

  const data = XLSX.utils.sheet_to_json(worksheet, { defval: null });

  const occupations = data.map((row: any) => {
    const socCode = String(row['SOC'] || '').trim();
    const title = String(row['Description'] || '').trim();
    const medianAnnual = parseFloat(row['Median Annual Earnings'] || row['Median Annual Salary'] || '0');
    const avgHourly = parseFloat(row['Avg. Hourly Earnings'] || '0');
    const medianHourly = parseFloat(row['Median Hourly Earnings'] || '0');
    const jobs2025 = parseFloat(row['2025 Jobs'] || row['Current Jobs'] || '0');
    const jobs2026 = parseFloat(row['2026 Jobs'] || row['Projected Jobs'] || '0');
    const change = parseFloat(row['2025 - 2026 Change'] || '0');
    const changePercent = parseFloat(row['2025 - 2026 % Change'] || '0') * 100; // Convert to percentage
    const openings = parseFloat(row['Avg. Annual Openings'] || row['Annual Openings'] || '0');
    const hires2026 = parseFloat(row['2026 Hires'] || '0');

    return {
      socCode,
      title,
      salary: {
        median: Math.round(medianAnnual),
        average: avgHourly > 0 ? Math.round(avgHourly * 2080) : undefined, // Convert hourly to annual
        hourly: {
          median: medianHourly > 0 ? Math.round(medianHourly * 100) / 100 : undefined,
          average: avgHourly > 0 ? Math.round(avgHourly * 100) / 100 : undefined,
        },
      },
      employment: {
        current: Math.round(jobs2025),
        projected: Math.round(jobs2026),
        change: Math.round(change),
        changePercent: Math.round(changePercent * 10) / 10, // Round to 1 decimal
      },
      demand: {
        avgAnnualOpenings: Math.round(openings),
        hires: hires2026 > 0 ? Math.round(hires2026) : undefined,
      },
    };
  }).filter((occ: OccupationData) =>
    occ.socCode &&
    occ.title &&
    occ.salary.median > 0 &&
    occ.employment.current > 0
  );

  console.log(`✅ Parsed ${occupations.length} occupations`);
  return occupations;
}

/**
 * Process region data
 */
function processRegion(occupations: OccupationData[], regionName: string): RegionData {
  console.log(`⚙️  Processing ${regionName}...`);

  // Top paying occupations
  const topPaying = [...occupations]
    .sort((a, b) => b.salary.median - a.salary.median)
    .slice(0, 20);

  // Top demand (by annual openings)
  const topDemand = [...occupations]
    .sort((a, b) => b.demand.avgAnnualOpenings - a.demand.avgAnnualOpenings)
    .slice(0, 20);

  // Top growing (by % change)
  const topGrowing = [...occupations]
    .filter(o => o.employment.changePercent > 0)
    .sort((a, b) => b.employment.changePercent - a.employment.changePercent)
    .slice(0, 20);

  // Calculate summary stats
  const totalJobs = occupations.reduce((sum, o) => sum + o.employment.current, 0);
  const totalOpenings = occupations.reduce((sum, o) => sum + o.demand.avgAnnualOpenings, 0);
  const avgMedianSalary = Math.round(
    occupations.reduce((sum, o) => sum + o.salary.median, 0) / occupations.length
  );

  console.log(`  📈 ${occupations.length} occupations, ${Math.round(totalJobs).toLocaleString()} jobs, ${Math.round(totalOpenings).toLocaleString()} annual openings`);

  return {
    occupations: occupations.slice(0, 100), // Store top 100 for now to keep file size manageable
    topGrowing,
    topPaying,
    topDemand,
    summary: {
      totalOccupations: occupations.length,
      totalJobs: Math.round(totalJobs),
      totalOpenings: Math.round(totalOpenings),
      avgMedianSalary,
    },
  };
}

/**
 * Main import function
 */
async function importLightcastData() {
  console.log('🚀 Starting Lightcast data import...\n');

  // Find Excel files
  const files = {
    us: path.join(DATA_DIR, 'Occupation_Table_All_Occupations_in_United_States_26d92ea5a8ec6a25.xlsx'),
    wa: path.join(DATA_DIR, 'Occupation_Table_All_Occupations_in_Washington_8a753f06940899d3.xlsx'),
    spokane: path.join(DATA_DIR, 'Occupation_Table_All_Occupations_in_Spokane_County_WA_cdcd7f803271dcc2.xlsx'),
  };

  console.log('📂 Reading Excel files...\n');

  const usOccupations = parseExcel(files.us);
  const waOccupations = parseExcel(files.wa);
  const spokaneOccupations = parseExcel(files.spokane);

  if (usOccupations.length === 0 && waOccupations.length === 0 && spokaneOccupations.length === 0) {
    console.error('\n❌ No data found. Check that Excel files are in data/lightcast/raw/');
    process.exit(1);
  }

  console.log('\n⚙️  Processing regional data...\n');

  const marketData: MarketData = {
    lastUpdated: new Date().toISOString(),
    dataVersion: '2027-Q2',
    regions: {
      us: usOccupations.length > 0 ? processRegion(usOccupations, 'United States') : {
        occupations: [],
        topGrowing: [],
        topPaying: [],
        topDemand: [],
        summary: { totalOccupations: 0, totalJobs: 0, totalOpenings: 0, avgMedianSalary: 0 },
      },
      washington: waOccupations.length > 0 ? processRegion(waOccupations, 'Washington State') : {
        occupations: [],
        topGrowing: [],
        topPaying: [],
        topDemand: [],
        summary: { totalOccupations: 0, totalJobs: 0, totalOpenings: 0, avgMedianSalary: 0 },
      },
      spokane: spokaneOccupations.length > 0 ? processRegion(spokaneOccupations, 'Spokane County') : {
        occupations: [],
        topGrowing: [],
        topPaying: [],
        topDemand: [],
        summary: { totalOccupations: 0, totalJobs: 0, totalOpenings: 0, avgMedianSalary: 0 },
      },
    },
  };

  // Create output directory if needed
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(marketData, null, 2));

  console.log('\n✅ Market data generated successfully!\n');
  console.log(`📍 Output: ${OUTPUT_FILE}`);
  console.log(`\n📊 Summary:`);
  console.log(`   US: ${marketData.regions.us.summary.totalOccupations} occupations, ${marketData.regions.us.summary.totalJobs.toLocaleString()} jobs`);
  console.log(`   WA: ${marketData.regions.washington.summary.totalOccupations} occupations, ${marketData.regions.washington.summary.totalJobs.toLocaleString()} jobs`);
  console.log(`   Spokane: ${marketData.regions.spokane.summary.totalOccupations} occupations, ${marketData.regions.spokane.summary.totalJobs.toLocaleString()} jobs`);
  console.log(`\n💰 Average median salaries:`);
  console.log(`   US: $${marketData.regions.us.summary.avgMedianSalary.toLocaleString()}`);
  console.log(`   WA: $${marketData.regions.washington.summary.avgMedianSalary.toLocaleString()}`);
  console.log(`   Spokane: $${marketData.regions.spokane.summary.avgMedianSalary.toLocaleString()}`);
  console.log(`\n🔥 Top 3 fastest-growing occupations (US):`);
  marketData.regions.us.topGrowing.slice(0, 3).forEach((occ, i) => {
    console.log(`   ${i + 1}. ${occ.title} (+${occ.employment.changePercent}%)`);
  });
}

// Run import
importLightcastData().catch(console.error);
