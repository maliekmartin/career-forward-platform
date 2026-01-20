/**
 * Career Forward Scoring Service
 *
 * Two-score system:
 * 1. Resume Quality Score (30 pts) - Formatting, grammar, length, clarity
 * 2. Job Seeker Score (70 pts) - Education, tenure, gaps, market match
 *
 * Total: 100 points
 */

import type { ParsedResume, WorkExperience, Education } from "./resume-parser";

// ============================================================================
// TYPES
// ============================================================================

export interface ResumeQualityBreakdown {
  formattingStructure: number;    // Max 10.5 pts (35% of 30)
  spellingGrammar: number;        // Max 7.5 pts (25% of 30)
  lengthBrevity: number;          // Max 6 pts (20% of 30)
  relevanceClarity: number;       // Max 6 pts (20% of 30)
  total: number;                  // Max 30 pts
}

export interface JobSeekerBreakdown {
  education: number;              // Max 15 pts
  tenure: number;                 // Max 20 pts
  gaps: number;                   // Max 15 pts
  marketMatch: number;            // Max 20 pts
  total: number;                  // Max 70 pts
}

export interface ScoreRecommendation {
  category: "resume" | "jobseeker";
  subcategory: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  potentialGain: number;  // Points they could gain
}

export interface ScoringResult {
  resumeQuality: ResumeQualityBreakdown;
  jobSeeker: JobSeekerBreakdown;
  totalScore: number;
  recommendations: ScoreRecommendation[];
  marketData?: MarketMatchData;
  calculatedAt: string;
}

export interface MarketMatchData {
  localScore: number;
  regionalScore: number;
  remoteScore: number;
  demandLevel: "high" | "medium" | "low";
  averageSalary?: number;
  jobPostings?: number;
}

// ============================================================================
// SCORING CONSTANTS
// ============================================================================

const EDUCATION_SCORES: Record<string, number> = {
  "phd": 1.0,
  "doctorate": 1.0,
  "md": 1.0,
  "jd": 1.0,
  "master": 0.9,
  "mba": 0.9,
  "bachelor": 0.75,
  "associate": 0.6,
  "high school": 0.4,
  "ged": 0.4,
  "none": 0.2,
};

// Trade certifications that equal or exceed degree value
const HIGH_VALUE_CERTIFICATIONS = [
  "cpa", "cfa", "pmp", "cissp", "aws", "azure", "gcp",
  "rn", "lpn", "cna", "emt", "paramedic",
  "cdl", "hvac", "electrician", "plumber",
  "real estate", "series 7", "series 65",
  "comptia", "cisco", "ccna", "ccnp",
];

// ============================================================================
// RESUME QUALITY SCORING (30 pts total)
// ============================================================================

interface ResumeAnalysis {
  hasConsistentFormatting: boolean;
  hasBulletPoints: boolean;
  hasActionVerbs: boolean;
  hasSections: boolean;
  spellingErrors: number;
  grammarIssues: number;
  pageCount: number;
  wordCount: number;
  hasQuantifiableAchievements: boolean;
  hasRelevantKeywords: boolean;
  experienceDescriptionsAvgLength: number;
}

/**
 * Analyze resume for quality metrics using Claude
 */
export async function analyzeResumeQuality(
  resumeText: string,
  parsedResume: ParsedResume
): Promise<ResumeAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Return default analysis if no API key
    return getDefaultAnalysis(parsedResume);
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Analyze this resume text for quality metrics. Return ONLY valid JSON.

Resume:
${resumeText?.substring(0, 3000) || JSON.stringify(parsedResume)}

Return this exact JSON structure:
{
  "hasConsistentFormatting": true/false,
  "hasBulletPoints": true/false,
  "hasActionVerbs": true/false,
  "hasSections": true/false,
  "spellingErrors": number (0-10),
  "grammarIssues": number (0-10),
  "pageCount": number (estimate based on content length),
  "wordCount": number,
  "hasQuantifiableAchievements": true/false,
  "hasRelevantKeywords": true/false,
  "experienceDescriptionsAvgLength": number (words per job description)
}

Be strict but fair. Only JSON, no explanation.`
          }
        ],
      }),
    });

    if (!response.ok) {
      return getDefaultAnalysis(parsedResume);
    }

    const result = await response.json();
    const content = result.content?.[0]?.text;

    if (!content) {
      return getDefaultAnalysis(parsedResume);
    }

    const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(jsonStr) as ResumeAnalysis;
  } catch (error) {
    console.error("Resume analysis error:", error);
    return getDefaultAnalysis(parsedResume);
  }
}

function getDefaultAnalysis(parsedResume: ParsedResume): ResumeAnalysis {
  const totalDescLength = parsedResume.experience.reduce(
    (sum, exp) => sum + (exp.description?.length || 0), 0
  );
  const avgDescLength = parsedResume.experience.length > 0
    ? totalDescLength / parsedResume.experience.length / 5 // rough word estimate
    : 0;

  return {
    hasConsistentFormatting: true,
    hasBulletPoints: true,
    hasActionVerbs: parsedResume.experience.length > 0,
    hasSections: true,
    spellingErrors: 0,
    grammarIssues: 0,
    pageCount: 1,
    wordCount: 300,
    hasQuantifiableAchievements: false,
    hasRelevantKeywords: parsedResume.skills.length > 5,
    experienceDescriptionsAvgLength: avgDescLength,
  };
}

/**
 * Calculate Resume Quality Score (30 pts max)
 */
export function calculateResumeQualityScore(
  analysis: ResumeAnalysis
): { breakdown: ResumeQualityBreakdown; recommendations: ScoreRecommendation[] } {
  const recommendations: ScoreRecommendation[] = [];

  // Formatting & Structure (10.5 pts / 35%)
  let formattingScore = 10.5;
  if (!analysis.hasConsistentFormatting) {
    formattingScore -= 3;
    recommendations.push({
      category: "resume",
      subcategory: "formatting",
      priority: "high",
      title: "Improve formatting consistency",
      description: "Use consistent fonts, spacing, and alignment throughout your resume.",
      potentialGain: 3,
    });
  }
  if (!analysis.hasBulletPoints) {
    formattingScore -= 2;
    recommendations.push({
      category: "resume",
      subcategory: "formatting",
      priority: "medium",
      title: "Add bullet points",
      description: "Use bullet points to make your experience easier to scan.",
      potentialGain: 2,
    });
  }
  if (!analysis.hasSections) {
    formattingScore -= 3;
    recommendations.push({
      category: "resume",
      subcategory: "formatting",
      priority: "high",
      title: "Add clear sections",
      description: "Organize your resume with clear section headers (Experience, Education, Skills).",
      potentialGain: 3,
    });
  }
  if (!analysis.hasActionVerbs) {
    formattingScore -= 2.5;
    recommendations.push({
      category: "resume",
      subcategory: "formatting",
      priority: "medium",
      title: "Use action verbs",
      description: "Start bullet points with strong action verbs (Led, Developed, Managed, etc.).",
      potentialGain: 2.5,
    });
  }
  formattingScore = Math.max(0, formattingScore);

  // Spelling & Grammar (7.5 pts / 25%)
  let spellingScore = 7.5;
  const errorPenalty = (analysis.spellingErrors + analysis.grammarIssues) * 0.75;
  spellingScore = Math.max(0, spellingScore - errorPenalty);
  if (analysis.spellingErrors > 0 || analysis.grammarIssues > 0) {
    recommendations.push({
      category: "resume",
      subcategory: "spelling",
      priority: analysis.spellingErrors + analysis.grammarIssues > 3 ? "high" : "medium",
      title: "Fix spelling and grammar errors",
      description: `Found ${analysis.spellingErrors} spelling and ${analysis.grammarIssues} grammar issues. Proofread carefully or use a grammar tool.`,
      potentialGain: errorPenalty,
    });
  }

  // Length & Brevity (6 pts / 20%)
  let lengthScore = 6;
  if (analysis.pageCount > 2) {
    lengthScore -= 3;
    recommendations.push({
      category: "resume",
      subcategory: "length",
      priority: "high",
      title: "Reduce resume length",
      description: "Your resume exceeds 2 pages. Focus on your most recent and relevant experience.",
      potentialGain: 3,
    });
  } else if (analysis.pageCount > 2.5) {
    lengthScore -= 5;
  }
  if (analysis.wordCount < 150) {
    lengthScore -= 2;
    recommendations.push({
      category: "resume",
      subcategory: "length",
      priority: "medium",
      title: "Add more detail",
      description: "Your resume is too brief. Add more details about your accomplishments.",
      potentialGain: 2,
    });
  }
  lengthScore = Math.max(0, lengthScore);

  // Relevance & Clarity (6 pts / 20%)
  let relevanceScore = 6;
  if (!analysis.hasQuantifiableAchievements) {
    relevanceScore -= 2;
    recommendations.push({
      category: "resume",
      subcategory: "relevance",
      priority: "high",
      title: "Add quantifiable achievements",
      description: "Include numbers and metrics (e.g., 'Increased sales by 25%', 'Managed team of 10').",
      potentialGain: 2,
    });
  }
  if (!analysis.hasRelevantKeywords) {
    relevanceScore -= 2;
    recommendations.push({
      category: "resume",
      subcategory: "relevance",
      priority: "medium",
      title: "Add industry keywords",
      description: "Include relevant skills and keywords that match your target roles.",
      potentialGain: 2,
    });
  }
  if (analysis.experienceDescriptionsAvgLength < 15) {
    relevanceScore -= 2;
    recommendations.push({
      category: "resume",
      subcategory: "relevance",
      priority: "medium",
      title: "Expand job descriptions",
      description: "Your job descriptions are brief. Add more detail about responsibilities and achievements.",
      potentialGain: 2,
    });
  }
  relevanceScore = Math.max(0, relevanceScore);

  return {
    breakdown: {
      formattingStructure: Math.round(formattingScore * 10) / 10,
      spellingGrammar: Math.round(spellingScore * 10) / 10,
      lengthBrevity: Math.round(lengthScore * 10) / 10,
      relevanceClarity: Math.round(relevanceScore * 10) / 10,
      total: Math.round((formattingScore + spellingScore + lengthScore + relevanceScore) * 10) / 10,
    },
    recommendations,
  };
}

// ============================================================================
// JOB SEEKER SCORING (70 pts total)
// ============================================================================

/**
 * Calculate Education Score (15 pts max)
 */
function calculateEducationScore(
  education: Education[],
  certifications: string[]
): { score: number; recommendations: ScoreRecommendation[] } {
  const recommendations: ScoreRecommendation[] = [];

  if (education.length === 0 && certifications.length === 0) {
    recommendations.push({
      category: "jobseeker",
      subcategory: "education",
      priority: "medium",
      title: "Add education or certifications",
      description: "Include your educational background or professional certifications.",
      potentialGain: 10,
    });
    return { score: 3, recommendations }; // 20% = 3 pts
  }

  // Find highest education level
  let highestScore = 0.2;
  for (const edu of education) {
    const degree = (edu.degree || "").toLowerCase();
    for (const [key, value] of Object.entries(EDUCATION_SCORES)) {
      if (degree.includes(key) && value > highestScore) {
        highestScore = value;
      }
    }
  }

  // Check for high-value certifications
  const certText = certifications.join(" ").toLowerCase();
  for (const cert of HIGH_VALUE_CERTIFICATIONS) {
    if (certText.includes(cert)) {
      highestScore = Math.max(highestScore, 0.85); // Certs can boost to 85%
      break;
    }
  }

  const score = Math.round(highestScore * 15 * 10) / 10;

  if (highestScore < 0.75) {
    recommendations.push({
      category: "jobseeker",
      subcategory: "education",
      priority: "low",
      title: "Consider additional education or certifications",
      description: "Industry certifications or continuing education can boost your marketability.",
      potentialGain: Math.round((0.75 - highestScore) * 15),
    });
  }

  return { score, recommendations };
}

/**
 * Calculate Tenure/Stability Score (20 pts max)
 */
function calculateTenureScore(
  experience: WorkExperience[]
): { score: number; recommendations: ScoreRecommendation[] } {
  const recommendations: ScoreRecommendation[] = [];

  if (experience.length === 0) {
    recommendations.push({
      category: "jobseeker",
      subcategory: "tenure",
      priority: "high",
      title: "Add work experience",
      description: "Include your work history to demonstrate your professional background.",
      potentialGain: 15,
    });
    return { score: 5, recommendations };
  }

  let totalScore = 20;
  let shortStints = 0;
  let longStints = 0;

  for (let i = 0; i < experience.length; i++) {
    const exp = experience[i];
    const tenure = calculateTenureMonths(exp.startDate, exp.endDate, exp.current);

    // Short stint penalty (< 12 months)
    if (tenure < 12 && tenure > 0) {
      // Soften for first 2 roles (younger workers)
      const penalty = i < 2 ? 2 : 4;
      totalScore -= penalty;
      shortStints++;
    }

    // Stagnation penalty (6+ years same role without promotion indication)
    if (tenure > 72) {
      totalScore -= 2;
      longStints++;
    }

    // Bonus for good tenure (2-5 years)
    if (tenure >= 24 && tenure <= 60) {
      totalScore += 1;
    }
  }

  totalScore = Math.min(20, Math.max(0, totalScore));

  if (shortStints >= 2) {
    recommendations.push({
      category: "jobseeker",
      subcategory: "tenure",
      priority: "medium",
      title: "Address short job tenures",
      description: "Multiple short stints may concern employers. Consider explaining transitions or focusing on contract/project work.",
      potentialGain: shortStints * 2,
    });
  }

  if (longStints > 0) {
    recommendations.push({
      category: "jobseeker",
      subcategory: "tenure",
      priority: "low",
      title: "Highlight growth in long-term roles",
      description: "For roles held 6+ years, emphasize promotions, expanded responsibilities, or skill development.",
      potentialGain: 2,
    });
  }

  return { score: Math.round(totalScore * 10) / 10, recommendations };
}

/**
 * Calculate tenure in months between two dates
 */
function calculateTenureMonths(startDate?: string, endDate?: string, current?: boolean): number {
  if (!startDate) return 0;

  const start = parseDate(startDate);
  const end = current ? new Date() : parseDate(endDate || "");

  if (!start || !end) return 0;

  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return Math.max(0, months);
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Handle formats like "01/2024", "2024", "January 2024"
  const parts = dateStr.match(/(\d{1,2})?[\/\-]?(\d{4})/);
  if (parts) {
    const month = parts[1] ? parseInt(parts[1]) - 1 : 0;
    const year = parseInt(parts[2]);
    return new Date(year, month);
  }

  return null;
}

/**
 * Calculate Gap Score (15 pts max)
 */
function calculateGapScore(
  experience: WorkExperience[]
): { score: number; recommendations: ScoreRecommendation[] } {
  const recommendations: ScoreRecommendation[] = [];

  if (experience.length <= 1) {
    return { score: 15, recommendations }; // Can't have gaps with 0-1 jobs
  }

  // Sort by start date
  const sorted = [...experience].sort((a, b) => {
    const dateA = parseDate(a.startDate || "");
    const dateB = parseDate(b.startDate || "");
    if (!dateA || !dateB) return 0;
    return dateB.getTime() - dateA.getTime(); // Most recent first
  });

  let score = 15;
  let majorGaps = 0;
  let mediumGaps = 0;

  for (let i = 0; i < sorted.length - 1; i++) {
    const currentEnd = parseDate(sorted[i].endDate || "");
    const previousStart = parseDate(sorted[i + 1].startDate || "");

    if (!currentEnd || !previousStart) continue;

    const gapMonths = (currentEnd.getFullYear() - previousStart.getFullYear()) * 12 +
                      (currentEnd.getMonth() - previousStart.getMonth());

    if (gapMonths >= 12) {
      score -= 5;
      majorGaps++;
    } else if (gapMonths >= 6) {
      score -= 3;
      mediumGaps++;
    } else if (gapMonths >= 3) {
      score -= 1;
    }
  }

  score = Math.max(0, score);

  if (majorGaps > 0) {
    recommendations.push({
      category: "jobseeker",
      subcategory: "gaps",
      priority: "high",
      title: "Address employment gaps",
      description: `You have ${majorGaps} gap(s) of 12+ months. Consider explaining these (education, caregiving, freelance work).`,
      potentialGain: majorGaps * 5,
    });
  } else if (mediumGaps > 0) {
    recommendations.push({
      category: "jobseeker",
      subcategory: "gaps",
      priority: "medium",
      title: "Address employment gaps",
      description: `You have ${mediumGaps} gap(s) of 6+ months. Brief explanations can help recruiters understand your journey.`,
      potentialGain: mediumGaps * 3,
    });
  }

  return { score: Math.round(score * 10) / 10, recommendations };
}

/**
 * Calculate Market Match Score (20 pts max)
 * Uses BLS data and job market trends
 */
export async function calculateMarketMatchScore(
  skills: string[],
  targetRole?: string,
  location?: string,
  industry?: string
): Promise<{ score: number; marketData: MarketMatchData; recommendations: ScoreRecommendation[] }> {
  const recommendations: ScoreRecommendation[] = [];

  // Default market data (will be enhanced with BLS API)
  let marketData: MarketMatchData = {
    localScore: 70,
    regionalScore: 75,
    remoteScore: 80,
    demandLevel: "medium",
  };

  // Try to get real BLS data
  try {
    const blsData = await fetchBLSData(industry, location);
    if (blsData) {
      marketData = {
        ...marketData,
        ...blsData,
      };
    }
  } catch (error) {
    console.error("BLS API error:", error);
  }

  // Calculate score based on market match
  const avgMarketScore = (marketData.localScore + marketData.regionalScore + marketData.remoteScore) / 3;
  const score = Math.round((avgMarketScore / 100) * 20 * 10) / 10;

  // Skills-based adjustments
  const inDemandSkills = getInDemandSkills(industry);
  const matchingSkills = skills.filter(s =>
    inDemandSkills.some(d => s.toLowerCase().includes(d.toLowerCase()))
  );

  if (matchingSkills.length === 0 && skills.length > 0) {
    recommendations.push({
      category: "jobseeker",
      subcategory: "market",
      priority: "high",
      title: "Add in-demand skills",
      description: `Consider developing skills in: ${inDemandSkills.slice(0, 5).join(", ")}`,
      potentialGain: 5,
    });
  }

  if (marketData.demandLevel === "low") {
    recommendations.push({
      category: "jobseeker",
      subcategory: "market",
      priority: "medium",
      title: "Expand your job search",
      description: "Demand in your local market is lower. Consider remote opportunities or nearby regions.",
      potentialGain: 3,
    });
  }

  return { score, marketData, recommendations };
}

/**
 * Fetch data from BLS API
 */
async function fetchBLSData(
  industry?: string,
  location?: string
): Promise<Partial<MarketMatchData> | null> {
  const apiKey = process.env.BLS_API_KEY;

  // BLS API V2 requires registration for higher limits
  // For now, return estimated data based on industry
  // TODO: Implement full BLS API integration

  const industryDemand: Record<string, MarketMatchData> = {
    "technology": { localScore: 85, regionalScore: 88, remoteScore: 95, demandLevel: "high" },
    "healthcare": { localScore: 90, regionalScore: 92, remoteScore: 70, demandLevel: "high" },
    "finance": { localScore: 80, regionalScore: 85, remoteScore: 85, demandLevel: "high" },
    "manufacturing": { localScore: 75, regionalScore: 78, remoteScore: 50, demandLevel: "medium" },
    "retail": { localScore: 70, regionalScore: 72, remoteScore: 40, demandLevel: "medium" },
    "hospitality": { localScore: 75, regionalScore: 78, remoteScore: 30, demandLevel: "medium" },
    "education": { localScore: 70, regionalScore: 75, remoteScore: 60, demandLevel: "medium" },
    "construction": { localScore: 80, regionalScore: 82, remoteScore: 20, demandLevel: "high" },
  };

  const normalizedIndustry = (industry || "").toLowerCase();
  for (const [key, data] of Object.entries(industryDemand)) {
    if (normalizedIndustry.includes(key)) {
      return data;
    }
  }

  return null;
}

/**
 * Get in-demand skills for an industry
 */
function getInDemandSkills(industry?: string): string[] {
  const skillsByIndustry: Record<string, string[]> = {
    "technology": ["Python", "JavaScript", "AWS", "Cloud", "AI", "Machine Learning", "React", "SQL", "DevOps", "Kubernetes"],
    "healthcare": ["EMR", "Patient Care", "HIPAA", "Clinical", "Medical Terminology", "CPR", "Nursing", "Phlebotomy"],
    "finance": ["Excel", "Financial Analysis", "SQL", "Risk Management", "Compliance", "CPA", "Bloomberg", "Python"],
    "manufacturing": ["Lean", "Six Sigma", "CAD", "Quality Control", "Safety", "PLC", "Supply Chain", "CNC"],
    "retail": ["Customer Service", "POS", "Inventory", "Sales", "Merchandising", "Loss Prevention"],
    "default": ["Communication", "Problem Solving", "Leadership", "Project Management", "Microsoft Office", "Data Analysis"],
  };

  const normalizedIndustry = (industry || "").toLowerCase();
  for (const [key, skills] of Object.entries(skillsByIndustry)) {
    if (normalizedIndustry.includes(key)) {
      return skills;
    }
  }

  return skillsByIndustry["default"];
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================

/**
 * Calculate complete scores for a job seeker
 */
export async function calculateScores(
  parsedResume: ParsedResume,
  rawText?: string,
  targetRole?: string,
  location?: string,
  industry?: string
): Promise<ScoringResult> {
  const allRecommendations: ScoreRecommendation[] = [];

  // 1. Analyze resume quality
  const analysis = await analyzeResumeQuality(rawText || "", parsedResume);

  // 2. Calculate Resume Quality Score (30 pts)
  const { breakdown: resumeBreakdown, recommendations: resumeRecs } =
    calculateResumeQualityScore(analysis);
  allRecommendations.push(...resumeRecs);

  // 3. Calculate Education Score (15 pts)
  const certNames = parsedResume.certifications?.map(c => c.name) || [];
  const { score: educationScore, recommendations: eduRecs } =
    calculateEducationScore(parsedResume.education, certNames);
  allRecommendations.push(...eduRecs);

  // 4. Calculate Tenure Score (20 pts)
  const { score: tenureScore, recommendations: tenureRecs } =
    calculateTenureScore(parsedResume.experience);
  allRecommendations.push(...tenureRecs);

  // 5. Calculate Gap Score (15 pts)
  const { score: gapScore, recommendations: gapRecs } =
    calculateGapScore(parsedResume.experience);
  allRecommendations.push(...gapRecs);

  // 6. Calculate Market Match Score (20 pts)
  const { score: marketScore, marketData, recommendations: marketRecs } =
    await calculateMarketMatchScore(parsedResume.skills, targetRole, location, industry);
  allRecommendations.push(...marketRecs);

  // Compile Job Seeker breakdown
  const jobSeekerBreakdown: JobSeekerBreakdown = {
    education: educationScore,
    tenure: tenureScore,
    gaps: gapScore,
    marketMatch: marketScore,
    total: Math.round((educationScore + tenureScore + gapScore + marketScore) * 10) / 10,
  };

  // Sort recommendations by priority and potential gain
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  allRecommendations.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.potentialGain - a.potentialGain;
  });

  return {
    resumeQuality: resumeBreakdown,
    jobSeeker: jobSeekerBreakdown,
    totalScore: Math.round((resumeBreakdown.total + jobSeekerBreakdown.total) * 10) / 10,
    recommendations: allRecommendations,
    marketData,
    calculatedAt: new Date().toISOString(),
  };
}
