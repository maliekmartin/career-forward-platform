#!/usr/bin/env tsx

import * as XLSX from 'xlsx';
import path from 'path';

const file = process.argv[2] || path.join(process.cwd(), 'data', 'lightcast', 'raw', 'Occupation_Table_All_Occupations_in_Spokane_County_WA_cdcd7f803271dcc2.xlsx');

console.log(`Reading: ${file}\n`);

const workbook = XLSX.readFile(file);
console.log(`Sheets: ${workbook.SheetNames.join(', ')}\n`);

// Read the "Occs" sheet
const sheetName = 'Occs';
console.log(`Reading sheet: ${sheetName}\n`);

const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { defval: null });

console.log(`Total rows: ${data.length}\n`);
console.log('Columns:');
if (data.length > 0) {
  const firstRow = data[0] as any;
  Object.keys(firstRow).forEach((key, i) => {
    const value = firstRow[key];
    const preview = value !== null ? String(value).substring(0, 60) : 'null';
    console.log(`  ${i + 1}. "${key}": ${preview}`);
  });
}

console.log('\nFirst 2 rows:');
console.log(JSON.stringify(data.slice(0, 2), null, 2));
