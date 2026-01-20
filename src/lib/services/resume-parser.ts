/**
 * Resume Parser Service
 *
 * This service handles resume parsing. It can parse PDFs directly
 * or integrate with Affinda API when configured.
 */

export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  highlights?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree?: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer?: string;
  dateObtained?: string;
  expirationDate?: string;
}

export interface ParsedResume {
  personalInfo: PersonalInfo;
  summary?: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  rawText?: string;
}

export interface ParseResult {
  success: boolean;
  data?: ParsedResume;
  error?: string;
  source: "local" | "affinda";
}

/**
 * Parse PDF directly using Claude API with document support
 */
async function parsePDFWithClaude(buffer: Buffer): Promise<ParseResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "Claude API key not configured",
      source: "local",
    };
  }

  try {
    // Convert buffer to base64
    const base64Data = buffer.toString("base64");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: base64Data,
                },
              },
              {
                type: "text",
                text: `Parse this resume and extract structured information. Return ONLY valid JSON with no additional text or markdown formatting.

Return this exact JSON structure (fill in values from the resume, use empty strings if not found):
{
  "personalInfo": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedIn": ""
  },
  "summary": "",
  "skills": [],
  "experience": [
    {
      "company": "",
      "title": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "location": "",
      "endDate": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "dateObtained": ""
    }
  ]
}

Important:
- Extract the person's full name and split into firstName and lastName
- For phone, include country code if present
- For location, include city, state/country
- For LinkedIn, include the full URL
- For experience and education, extract ALL entries found
- For skills, list individual skills as separate array items
- Dates should be in format like "01/2024" or "2024" as shown in resume
- Set "current" to true if the job is current/present
- Return ONLY the JSON, no explanation or markdown`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Claude API error:", errorData);
      return {
        success: false,
        error: `Claude API error: ${errorData.error?.message || JSON.stringify(errorData)}`,
        source: "local",
      };
    }

    const result = await response.json();
    const content = result.content?.[0]?.text;

    if (!content) {
      return {
        success: false,
        error: "No response from Claude API",
        source: "local",
      };
    }

    // Parse the JSON response
    let parsed: Record<string, unknown>;
    try {
      // Remove any markdown code blocks if present
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse Claude response as JSON:", content);
      return {
        success: false,
        error: "Failed to parse Claude response",
        source: "local",
      };
    }

    // Transform to our format
    const personalInfo = parsed.personalInfo as PersonalInfo || {};
    const experience: WorkExperience[] = ((parsed.experience as unknown[]) || []).map((exp: unknown, idx: number) => {
      const e = exp as Record<string, unknown>;
      return {
        id: `exp-${idx}`,
        company: (e.company as string) || "",
        title: (e.title as string) || "",
        location: (e.location as string) || "",
        startDate: (e.startDate as string) || "",
        endDate: (e.endDate as string) || "",
        current: (e.current as boolean) || false,
        description: (e.description as string) || "",
      };
    });

    const education: Education[] = ((parsed.education as unknown[]) || []).map((edu: unknown, idx: number) => {
      const e = edu as Record<string, unknown>;
      return {
        id: `edu-${idx}`,
        institution: (e.institution as string) || "",
        degree: (e.degree as string) || "",
        field: (e.field as string) || "",
        location: (e.location as string) || "",
        endDate: (e.endDate as string) || "",
      };
    });

    const certifications: Certification[] = ((parsed.certifications as unknown[]) || []).map((cert: unknown, idx: number) => {
      const c = cert as Record<string, unknown>;
      return {
        id: `cert-${idx}`,
        name: (c.name as string) || "",
        issuer: (c.issuer as string) || "",
        dateObtained: (c.dateObtained as string) || "",
      };
    });

    return {
      success: true,
      source: "local",
      data: {
        personalInfo,
        summary: (parsed.summary as string) || "",
        experience,
        education,
        skills: (parsed.skills as string[]) || [],
        certifications,
      },
    };
  } catch (error) {
    console.error("Claude PDF parsing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse PDF with Claude",
      source: "local",
    };
  }
}

/**
 * Parse personal info from resume text
 */
function extractPersonalInfo(text: string): PersonalInfo {
  const info: PersonalInfo = {};

  // Extract email
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/i);
  if (emailMatch) {
    info.email = emailMatch[0].toLowerCase();
  }

  // Extract phone - various formats
  const phoneMatch = text.match(/(?:\+?1?\s*)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/);
  if (phoneMatch) {
    info.phone = phoneMatch[0].trim();
  }

  // Extract LinkedIn URL
  const linkedInMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+\/?/i);
  if (linkedInMatch) {
    let url = linkedInMatch[0];
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }
    info.linkedIn = url;
  }

  // Extract name - usually at the top, in caps or as first line
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  // Look for a name pattern in first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    // Skip lines that look like headers, emails, or contact info
    if (line.includes("@") || line.includes("http") || line.match(/^\d/) ||
        line.toLowerCase().includes("summary") || line.toLowerCase().includes("resume")) {
      continue;
    }
    // Name is usually 2-3 words, each capitalized
    const nameMatch = line.match(/^([A-Z][a-zA-Z]+)\s+([A-Z][a-zA-Z]+)(?:\s+([A-Z][a-zA-Z]+))?$/);
    if (nameMatch) {
      info.firstName = nameMatch[1];
      info.lastName = nameMatch[3] || nameMatch[2];
      break;
    }
    // Also check for ALL CAPS names
    const capsMatch = line.match(/^([A-Z]+)\s+([A-Z]+)$/);
    if (capsMatch) {
      info.firstName = capsMatch[1].charAt(0) + capsMatch[1].slice(1).toLowerCase();
      info.lastName = capsMatch[2].charAt(0) + capsMatch[2].slice(1).toLowerCase();
      break;
    }
  }

  // Extract location - look for city, state pattern
  const locationMatch = text.match(/([A-Z][a-zA-Z\s]+),\s*(?:USA|[A-Z]{2})\s*\d{5}/);
  if (locationMatch) {
    info.location = locationMatch[0];
  } else {
    // Try simpler pattern
    const simpleLocation = text.match(/([A-Z][a-zA-Z]+),\s*([A-Z]{2})/);
    if (simpleLocation) {
      info.location = simpleLocation[0];
    }
  }

  return info;
}

/**
 * Extract summary from resume text
 */
function extractSummary(text: string): string | undefined {
  // Look for summary section
  const summaryPatterns = [
    /(?:summary|profile|objective|about)\s*[:\-]?\s*\n([\s\S]*?)(?=\n\s*(?:skills|experience|education|work|employment|professional|technical|core competencies))/i,
    /(?:professional\s+summary|career\s+summary|executive\s+summary)\s*[:\-]?\s*\n([\s\S]*?)(?=\n\s*(?:skills|experience|education|work|employment))/i,
  ];

  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const summary = match[1].trim()
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (summary.length > 50) {
        return summary;
      }
    }
  }

  return undefined;
}

/**
 * Extract skills from resume text
 */
function extractSkills(text: string): string[] {
  const skills: Set<string> = new Set();

  // Look for skills section
  const skillsMatch = text.match(/(?:skills|core\s+competencies|technical\s+skills|expertise)\s*[:\-]?\s*\n([\s\S]*?)(?=\n\s*(?:experience|education|work|employment|summary|professional|certifications|projects)|\n\n\n)/i);

  if (skillsMatch && skillsMatch[1]) {
    const skillsText = skillsMatch[1];

    // Split by common delimiters
    const skillItems = skillsText.split(/[,•●\n|]/);

    for (const item of skillItems) {
      const skill = item.trim()
        .replace(/^\s*[-–—]\s*/, "")
        .replace(/\s+/g, " ")
        .trim();

      // Filter out non-skills (too long, too short, or contains certain words)
      if (skill.length > 2 && skill.length < 50 &&
          !skill.toLowerCase().includes("experience") &&
          !skill.toLowerCase().includes("education") &&
          !skill.match(/^\d+/)) {
        skills.add(skill);
      }
    }
  }

  return Array.from(skills).slice(0, 30); // Limit to 30 skills
}

/**
 * Extract work experience from resume text
 */
function extractExperience(text: string): WorkExperience[] {
  const experiences: WorkExperience[] = [];

  // Look for experience section
  const expMatch = text.match(/(?:experience|work\s+history|employment|professional\s+experience)\s*[:\-]?\s*\n([\s\S]*?)(?=\n\s*(?:education|skills|certifications|projects|training|references)|\n\n\n|$)/i);

  if (!expMatch || !expMatch[1]) {
    return experiences;
  }

  const expText = expMatch[1];

  // Pattern to match job entries
  // Look for patterns like "Company | Location" followed by "Title" and dates
  const jobPattern = /([A-Z][^\n|]+?)(?:\s*\|\s*([A-Z][^\n]+))?\s*\n([A-Z][^\n]+?)\s*\n(\d{1,2}\/\d{4}|\d{4})\s*[-–—]\s*(Current|Present|\d{1,2}\/\d{4}|\d{4})/gi;

  let match;
  let idCounter = 0;

  while ((match = jobPattern.exec(expText)) !== null) {
    const company = match[1]?.trim() || "";
    const location = match[2]?.trim() || "";
    const title = match[3]?.trim() || "";
    const startDate = match[4]?.trim() || "";
    const endDateRaw = match[5]?.trim() || "";
    const isCurrent = endDateRaw.toLowerCase() === "current" || endDateRaw.toLowerCase() === "present";

    if (company && title) {
      experiences.push({
        id: `exp-${idCounter++}`,
        company,
        title,
        location,
        startDate,
        endDate: isCurrent ? "" : endDateRaw,
        current: isCurrent,
        description: "",
      });
    }
  }

  // If no matches with the strict pattern, try a simpler approach
  if (experiences.length === 0) {
    // Look for date patterns and work backwards to find company/title
    const datePattern = /(\d{1,2}\/\d{4}|\d{4})\s*[-–—]\s*(Current|Present|\d{1,2}\/\d{4}|\d{4})/gi;
    const lines = expText.split("\n").map(l => l.trim()).filter(l => l.length > 0);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const dateMatch = line.match(datePattern);

      if (dateMatch) {
        // Look at previous lines for company/title
        let company = "";
        let title = "";
        let location = "";

        for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
          const prevLine = lines[j];
          if (prevLine.includes("|")) {
            const parts = prevLine.split("|").map(p => p.trim());
            company = parts[0] || "";
            location = parts[1] || "";
          } else if (!company) {
            company = prevLine;
          } else if (!title) {
            title = prevLine;
          }
        }

        // Swap if needed (title is usually shorter)
        if (company && title && title.length > company.length) {
          [company, title] = [title, company];
        }

        const dates = line.match(/(\d{1,2}\/\d{4}|\d{4})\s*[-–—]\s*(Current|Present|\d{1,2}\/\d{4}|\d{4})/i);
        if (dates && company) {
          const isCurrent = dates[2]?.toLowerCase() === "current" || dates[2]?.toLowerCase() === "present";
          experiences.push({
            id: `exp-${idCounter++}`,
            company,
            title: title || "Position",
            location,
            startDate: dates[1] || "",
            endDate: isCurrent ? "" : (dates[2] || ""),
            current: isCurrent,
            description: "",
          });
        }
      }
    }
  }

  return experiences.slice(0, 10); // Limit to 10 experiences
}

/**
 * Extract education from resume text
 */
function extractEducation(text: string): Education[] {
  const education: Education[] = [];

  // Look for education section
  const eduMatch = text.match(/(?:education|academic|training)\s*(?:and\s+training)?\s*[:\-]?\s*\n([\s\S]*?)(?=\n\s*(?:experience|skills|certifications|projects|references|websites)|\n\n\n|$)/i);

  if (!eduMatch || !eduMatch[1]) {
    return education;
  }

  const eduText = eduMatch[1];
  const lines = eduText.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  let idCounter = 0;
  let currentEdu: Partial<Education> = {};

  for (const line of lines) {
    // Check for institution (usually contains College, University, School, Institute)
    if (line.match(/(?:college|university|school|institute|academy)/i)) {
      if (currentEdu.institution) {
        education.push({
          id: `edu-${idCounter++}`,
          institution: currentEdu.institution,
          degree: currentEdu.degree,
          field: currentEdu.field,
          endDate: currentEdu.endDate,
        });
        currentEdu = {};
      }

      // Parse institution line - might contain location
      const parts = line.split("|").map(p => p.trim());
      currentEdu.institution = parts[0];
    }
    // Check for degree
    else if (line.match(/(?:bachelor|master|associate|doctor|phd|diploma|certificate|degree|b\.s\.|b\.a\.|m\.s\.|m\.a\.|mba)/i)) {
      const degreeMatch = line.match(/(bachelor|master|associate|doctor|phd|diploma|high school|certificate)(?:'s)?(?:\s+(?:of|in))?\s*(?:science|arts|business)?/i);
      if (degreeMatch) {
        currentEdu.degree = degreeMatch[0];
      }

      // Check if field is mentioned
      const fieldMatch = line.match(/(?:in|of)\s+([A-Z][A-Za-z\s]+?)(?:\s*$|\s*\|)/i);
      if (fieldMatch) {
        currentEdu.field = fieldMatch[1].trim();
      }
    }
    // Check for date
    else if (line.match(/\d{2}\/\d{4}|\d{4}/)) {
      const dateMatch = line.match(/(\d{2}\/\d{4}|\d{4})/);
      if (dateMatch) {
        currentEdu.endDate = dateMatch[1];
      }
    }
  }

  // Don't forget the last one
  if (currentEdu.institution) {
    education.push({
      id: `edu-${idCounter++}`,
      institution: currentEdu.institution,
      degree: currentEdu.degree,
      field: currentEdu.field,
      endDate: currentEdu.endDate,
    });
  }

  return education.slice(0, 5); // Limit to 5 education entries
}

/**
 * Parse resume using Claude API for intelligent extraction
 */
async function parseWithClaude(text: string): Promise<ParseResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "Claude API key not configured",
      source: "local",
    };
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
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `Parse this resume and extract structured information. Return ONLY valid JSON with no additional text or markdown formatting.

Resume text:
${text}

Return this exact JSON structure (fill in values from the resume, use empty strings if not found):
{
  "personalInfo": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedIn": ""
  },
  "summary": "",
  "skills": [],
  "experience": [
    {
      "company": "",
      "title": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "location": "",
      "endDate": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "dateObtained": ""
    }
  ]
}

Important:
- Extract the person's full name and split into firstName and lastName
- For phone, include country code if present
- For location, include city, state/country
- For LinkedIn, include the full URL
- For experience and education, extract ALL entries found
- For skills, list individual skills as separate array items
- Dates should be in format like "01/2024" or "2024" as shown in resume
- Set "current" to true if the job is current/present
- Return ONLY the JSON, no explanation or markdown`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Claude API error:", errorData);
      return {
        success: false,
        error: `Claude API error: ${errorData.error?.message || "Unknown error"}`,
        source: "local",
      };
    }

    const result = await response.json();
    const content = result.content?.[0]?.text;

    if (!content) {
      return {
        success: false,
        error: "No response from Claude API",
        source: "local",
      };
    }

    // Parse the JSON response
    let parsed: Record<string, unknown>;
    try {
      // Remove any markdown code blocks if present
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse Claude response as JSON:", content);
      return {
        success: false,
        error: "Failed to parse Claude response",
        source: "local",
      };
    }

    // Transform to our format
    const personalInfo = parsed.personalInfo as PersonalInfo || {};
    const experience: WorkExperience[] = ((parsed.experience as unknown[]) || []).map((exp: unknown, idx: number) => {
      const e = exp as Record<string, unknown>;
      return {
        id: `exp-${idx}`,
        company: (e.company as string) || "",
        title: (e.title as string) || "",
        location: (e.location as string) || "",
        startDate: (e.startDate as string) || "",
        endDate: (e.endDate as string) || "",
        current: (e.current as boolean) || false,
        description: (e.description as string) || "",
      };
    });

    const education: Education[] = ((parsed.education as unknown[]) || []).map((edu: unknown, idx: number) => {
      const e = edu as Record<string, unknown>;
      return {
        id: `edu-${idx}`,
        institution: (e.institution as string) || "",
        degree: (e.degree as string) || "",
        field: (e.field as string) || "",
        location: (e.location as string) || "",
        endDate: (e.endDate as string) || "",
      };
    });

    const certifications: Certification[] = ((parsed.certifications as unknown[]) || []).map((cert: unknown, idx: number) => {
      const c = cert as Record<string, unknown>;
      return {
        id: `cert-${idx}`,
        name: (c.name as string) || "",
        issuer: (c.issuer as string) || "",
        dateObtained: (c.dateObtained as string) || "",
      };
    });

    return {
      success: true,
      source: "local",
      data: {
        personalInfo,
        summary: (parsed.summary as string) || "",
        experience,
        education,
        skills: (parsed.skills as string[]) || [],
        certifications,
        rawText: text,
      },
    };
  } catch (error) {
    console.error("Claude parsing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse with Claude",
      source: "local",
    };
  }
}

/**
 * Parse resume from file buffer
 */
async function parseFromBuffer(buffer: Buffer, mimeType: string): Promise<ParseResult> {
  try {
    // For PDFs, try Claude API with direct document upload first (best accuracy)
    if (mimeType === "application/pdf" && process.env.ANTHROPIC_API_KEY) {
      console.log("Parsing PDF directly with Claude API...");
      const claudeResult = await parsePDFWithClaude(buffer);
      if (claudeResult.success) {
        return claudeResult;
      }
      console.warn("Claude PDF parsing failed:", claudeResult.error);
      // Return the error - don't try fallback since text extraction doesn't work
      return claudeResult;
    }

    // For Word docs or if Claude not configured
    if (mimeType !== "application/pdf") {
      return {
        success: false,
        error: "Word document parsing not yet implemented. Please upload a PDF.",
        source: "local",
      };
    }

    // If Claude not configured
    return {
      success: false,
      error: "Resume parsing requires Claude API. Please configure ANTHROPIC_API_KEY.",
      source: "local",
    };
  } catch (error) {
    console.error("Local parse error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse resume",
      source: "local",
    };
  }
}

/**
 * Parse resume using Affinda API
 */
async function affinadaParse(fileUrl: string): Promise<ParseResult> {
  const apiKey = process.env.AFFINDA_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "Affinda API key not configured",
      source: "affinda",
    };
  }

  try {
    const response = await fetch("https://api.affinda.com/v3/documents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: fileUrl,
        collection: "resumes",
        wait: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to parse resume",
        source: "affinda",
      };
    }

    const result = await response.json();
    const parsed = transformAffindaResponse(result);

    return {
      success: true,
      data: parsed,
      source: "affinda",
    };
  } catch (error) {
    console.error("Affinda parse error:", error);
    return {
      success: false,
      error: "Failed to connect to parsing service",
      source: "affinda",
    };
  }
}

/**
 * Transform Affinda API response to our ParsedResume format
 */
function transformAffindaResponse(affindaData: Record<string, unknown>): ParsedResume {
  const data = affindaData.data as Record<string, unknown> || {};

  const name = data.name as Record<string, string> | undefined;
  const personalInfo: PersonalInfo = {
    firstName: name?.first || "",
    lastName: name?.last || "",
    email: (data.emails as string[])?.[0] || "",
    phone: (data.phoneNumbers as string[])?.[0] || "",
    location: formatLocation(data.location as Record<string, string> | undefined),
    linkedIn: (data.linkedin as string) || "",
  };

  const experience: WorkExperience[] = ((data.workExperience as unknown[]) || []).map((exp: unknown, index: number) => {
    const e = exp as Record<string, unknown>;
    return {
      id: `exp-${index}`,
      company: (e.organization as string) || "",
      title: (e.jobTitle as string) || "",
      location: formatLocation(e.location as Record<string, string> | undefined),
      startDate: formatDate(e.dates as Record<string, string> | undefined, "start"),
      endDate: formatDate(e.dates as Record<string, string> | undefined, "end"),
      current: (e.dates as Record<string, unknown>)?.isCurrent as boolean || false,
      description: (e.jobDescription as string) || "",
    };
  });

  const education: Education[] = ((data.education as unknown[]) || []).map((edu: unknown, index: number) => {
    const e = edu as Record<string, unknown>;
    return {
      id: `edu-${index}`,
      institution: (e.organization as string) || "",
      degree: (e.accreditation as Record<string, string>)?.education || "",
      field: (e.accreditation as Record<string, string>)?.inputStr || "",
      location: formatLocation(e.location as Record<string, string> | undefined),
      startDate: formatDate(e.dates as Record<string, string> | undefined, "start"),
      endDate: formatDate(e.dates as Record<string, string> | undefined, "end"),
    };
  });

  const skills: string[] = ((data.skills as unknown[]) || []).map((skill: unknown) => {
    const s = skill as Record<string, string>;
    return s.name || "";
  }).filter(Boolean);

  const certifications: Certification[] = ((data.certifications as unknown[]) || []).map((cert: unknown, index: number) => {
    const c = cert as Record<string, string>;
    return {
      id: `cert-${index}`,
      name: c.name || "",
      issuer: c.issuer || "",
      dateObtained: c.dateObtained || "",
    };
  });

  return {
    personalInfo,
    summary: (data.summary as string) || (data.objective as string) || "",
    experience,
    education,
    skills,
    certifications,
  };
}

function formatLocation(location: Record<string, string> | undefined): string {
  if (!location) return "";
  const parts = [location.city, location.state, location.country].filter(Boolean);
  return parts.join(", ");
}

function formatDate(dates: Record<string, string> | undefined, type: "start" | "end"): string {
  if (!dates) return "";
  const dateStr = type === "start" ? dates.startDate : dates.endDate;
  if (!dateStr) return "";
  return dateStr;
}

/**
 * Main parse function - fetches file and parses it
 */
export async function parseResume(fileUrl: string, mimeType: string): Promise<ParseResult> {
  // If Affinda is configured, use it
  const useAffinda = process.env.AFFINDA_API_KEY && process.env.AFFINDA_API_KEY.length > 0;

  if (useAffinda && !fileUrl.includes("placeholder.dev")) {
    const result = await affinadaParse(fileUrl);
    if (result.success) {
      return result;
    }
    console.warn("Affinda parsing failed, falling back to local:", result.error);
  }

  // For local parsing, we need to fetch the file
  try {
    // If it's a placeholder URL (local dev), we can't fetch it
    if (fileUrl.includes("placeholder.dev")) {
      return {
        success: false,
        error: "File storage not configured. Please set up Vercel Blob storage for resume uploads.",
        source: "local",
      };
    }

    const response = await fetch(fileUrl);
    if (!response.ok) {
      return {
        success: false,
        error: "Failed to download resume file",
        source: "local",
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return parseFromBuffer(buffer, mimeType);
  } catch (error) {
    console.error("Parse error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse resume",
      source: "local",
    };
  }
}

/**
 * Parse resume directly from buffer (for server-side use)
 */
export async function parseResumeFromBuffer(buffer: Buffer, mimeType: string): Promise<ParseResult> {
  return parseFromBuffer(buffer, mimeType);
}
