"use client";

import { ResumeData } from "../types/resume-types";

interface CleanTemplateProps {
  data: ResumeData;
}

// Clean template - Maximum whitespace, skills-first layout
// Best for tech, creative, and modern industries
export function CleanTemplate({ data }: CleanTemplateProps) {
  const { contactInfo, summary, experience, education, skills, certifications } = data;

  const hasContactInfo = contactInfo.firstName || contactInfo.lastName || contactInfo.email;
  const hasExperience = experience.length > 0 && experience.some((e) => e.jobTitle || e.company);
  const hasEducation = education.length > 0 && education.some((e) => e.school || e.degree);
  const hasSkills = skills.length > 0;
  const hasCertifications = certifications.length > 0 && certifications.some((c) => c.name || c.issuer);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return `${month}/${year}`;
  };

  return (
    <div
      className="min-h-full bg-white text-gray-900"
      style={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontSize: "10pt",
        lineHeight: "1.5",
        padding: "50px",
      }}
    >
      {/* Minimal Header */}
      {hasContactInfo && (
        <header style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "36pt",
              fontWeight: "300",
              color: "#111",
              marginBottom: "12px",
              letterSpacing: "-1px",
            }}
          >
            {contactInfo.firstName}{" "}
            <span style={{ fontWeight: "600" }}>{contactInfo.lastName}</span>
          </h1>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              fontSize: "9pt",
              color: "#666",
            }}
          >
            {contactInfo.email && <span>{contactInfo.email}</span>}
            {contactInfo.phone && <span>{contactInfo.phone}</span>}
            {(contactInfo.city || contactInfo.state) && (
              <span>{[contactInfo.city, contactInfo.state].filter(Boolean).join(", ")}</span>
            )}
            {contactInfo.linkedinUrl && (
              <span>{contactInfo.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
            )}
            {contactInfo.portfolioUrl && (
              <span>{contactInfo.portfolioUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
            )}
          </div>
        </header>
      )}

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: "50px" }}>
        {/* Left sidebar - Skills, Education, Certs */}
        <aside style={{ width: "200px", flexShrink: 0 }}>
          {/* Skills - Featured prominently */}
          {hasSkills && (
            <section style={{ marginBottom: "30px" }}>
              <h2 style={sectionHeaderStyle}>Skills</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: "9pt",
                      color: "#333",
                      padding: "4px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {hasEducation && (
            <section style={{ marginBottom: "30px" }}>
              <h2 style={sectionHeaderStyle}>Education</h2>
              {education.map(
                (edu, index) =>
                  (edu.school || edu.degree) && (
                    <div key={edu.id || index} style={{ marginBottom: "12px" }}>
                      <p style={{ fontWeight: "600", fontSize: "9pt", color: "#111", margin: 0 }}>
                        {edu.degree}
                      </p>
                      {edu.fieldOfStudy && (
                        <p style={{ fontSize: "9pt", color: "#444", margin: "2px 0" }}>
                          {edu.fieldOfStudy}
                        </p>
                      )}
                      <p style={{ fontSize: "8pt", color: "#666", margin: "2px 0" }}>
                        {edu.school}
                      </p>
                      {edu.graduationDate && (
                        <p style={{ fontSize: "8pt", color: "#888", margin: 0 }}>
                          {formatDate(edu.graduationDate)}
                        </p>
                      )}
                    </div>
                  )
              )}
            </section>
          )}

          {/* Certifications */}
          {hasCertifications && (
            <section>
              <h2 style={sectionHeaderStyle}>Certifications</h2>
              {certifications.map(
                (cert, index) =>
                  (cert.name || cert.issuer) && (
                    <div key={cert.id || index} style={{ marginBottom: "8px" }}>
                      <p style={{ fontSize: "9pt", fontWeight: "500", color: "#111", margin: 0 }}>
                        {cert.name}
                      </p>
                      {cert.issuer && (
                        <p style={{ fontSize: "8pt", color: "#666", margin: "2px 0" }}>
                          {cert.issuer}
                        </p>
                      )}
                    </div>
                  )
              )}
            </section>
          )}
        </aside>

        {/* Main content - Summary and Experience */}
        <main style={{ flex: 1 }}>
          {/* Summary */}
          {summary && (
            <section style={{ marginBottom: "30px" }}>
              <h2 style={sectionHeaderStyle}>About</h2>
              <p style={{ color: "#444", fontSize: "10pt", lineHeight: "1.6" }}>{summary}</p>
            </section>
          )}

          {/* Experience */}
          {hasExperience && (
            <section>
              <h2 style={sectionHeaderStyle}>Experience</h2>
              {experience.map(
                (exp, index) =>
                  (exp.jobTitle || exp.company) && (
                    <div
                      key={exp.id || index}
                      style={{
                        marginBottom: "24px",
                        paddingBottom: "24px",
                        borderBottom: index < experience.length - 1 ? "1px solid #eee" : "none",
                      }}
                    >
                      <div style={{ marginBottom: "8px" }}>
                        <h3
                          style={{
                            fontSize: "11pt",
                            fontWeight: "600",
                            color: "#111",
                            margin: 0,
                          }}
                        >
                          {exp.jobTitle}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "2px",
                          }}
                        >
                          <span style={{ fontSize: "9pt", color: "#666" }}>
                            {exp.company}
                            {(exp.city || exp.state) &&
                              ` — ${[exp.city, exp.state].filter(Boolean).join(", ")}`}
                          </span>
                          <span style={{ fontSize: "8pt", color: "#888" }}>
                            {formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                          </span>
                        </div>
                      </div>
                      {exp.bullets.filter((b) => b.trim()).length > 0 && (
                        <ul style={{ margin: 0, paddingLeft: "16px", listStyleType: "none" }}>
                          {exp.bullets
                            .filter((b) => b.trim())
                            .map((bullet, bIndex) => (
                              <li
                                key={bIndex}
                                style={{
                                  color: "#444",
                                  marginBottom: "4px",
                                  paddingLeft: "12px",
                                  position: "relative",
                                  fontSize: "9pt",
                                }}
                              >
                                <span
                                  style={{
                                    position: "absolute",
                                    left: 0,
                                    color: "#ccc",
                                  }}
                                >
                                  —
                                </span>
                                {bullet}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  )
              )}
            </section>
          )}
        </main>
      </div>

      {/* Empty state */}
      {!hasContactInfo && !summary && !hasExperience && !hasEducation && !hasSkills && !hasCertifications && (
        <div style={{ textAlign: "center", color: "#ccc", padding: "100px 0" }}>
          <p style={{ fontSize: "14pt", fontWeight: "300" }}>Your resume preview will appear here</p>
        </div>
      )}
    </div>
  );
}

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: "8pt",
  fontWeight: "600",
  color: "#999",
  textTransform: "uppercase",
  letterSpacing: "2px",
  marginBottom: "12px",
};
