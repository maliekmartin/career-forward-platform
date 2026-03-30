"use client";

import { ResumeData } from "../types/resume-types";

interface ClassicTemplateProps {
  data: ResumeData;
}

// Classic template - Traditional single-column layout
// Best for conservative industries (finance, law, government)
export function ClassicTemplate({ data }: ClassicTemplateProps) {
  const { contactInfo, summary, experience, education, skills, certifications } = data;

  const hasContactInfo = contactInfo.firstName || contactInfo.lastName || contactInfo.email;
  const hasExperience = experience.length > 0 && experience.some((e) => e.jobTitle || e.company);
  const hasEducation = education.length > 0 && education.some((e) => e.school || e.degree);
  const hasSkills = skills.length > 0;
  const hasCertifications = certifications.length > 0 && certifications.some((c) => c.name || c.issuer);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div
      className="min-h-full bg-white text-gray-900"
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "11pt",
        lineHeight: "1.5",
        padding: "50px 60px",
      }}
    >
      {/* Header - Centered */}
      {hasContactInfo && (
        <header style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "24pt",
              fontWeight: "400",
              color: "#1a1a1a",
              marginBottom: "8px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            {contactInfo.firstName} {contactInfo.lastName}
          </h1>
          <div
            style={{
              fontSize: "10pt",
              color: "#444",
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {contactInfo.email && <span>{contactInfo.email}</span>}
            {contactInfo.email && contactInfo.phone && <span>|</span>}
            {contactInfo.phone && <span>{contactInfo.phone}</span>}
            {contactInfo.phone && (contactInfo.city || contactInfo.state) && <span>|</span>}
            {(contactInfo.city || contactInfo.state) && (
              <span>{[contactInfo.city, contactInfo.state].filter(Boolean).join(", ")}</span>
            )}
          </div>
          {(contactInfo.linkedinUrl || contactInfo.portfolioUrl) && (
            <div style={{ fontSize: "9pt", color: "#666", marginTop: "4px" }}>
              {contactInfo.linkedinUrl && <span>{contactInfo.linkedinUrl}</span>}
              {contactInfo.linkedinUrl && contactInfo.portfolioUrl && <span> | </span>}
              {contactInfo.portfolioUrl && <span>{contactInfo.portfolioUrl}</span>}
            </div>
          )}
        </header>
      )}

      {/* Horizontal line */}
      <hr style={{ border: "none", borderTop: "1px solid #333", marginBottom: "20px" }} />

      {/* Summary */}
      {summary && (
        <section style={{ marginBottom: "24px" }}>
          <h2 style={sectionHeaderStyle}>Professional Summary</h2>
          <p style={{ color: "#333", textAlign: "justify" }}>{summary}</p>
        </section>
      )}

      {/* Experience */}
      {hasExperience && (
        <section style={{ marginBottom: "24px" }}>
          <h2 style={sectionHeaderStyle}>Professional Experience</h2>
          {experience.map(
            (exp, index) =>
              (exp.jobTitle || exp.company) && (
                <div key={exp.id || index} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                    <strong style={{ fontSize: "11pt" }}>{exp.jobTitle}</strong>
                    <span style={{ fontSize: "10pt", color: "#555" }}>
                      {formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div style={{ fontSize: "10pt", color: "#555", marginBottom: "6px", fontStyle: "italic" }}>
                    {exp.company}
                    {(exp.city || exp.state) && `, ${[exp.city, exp.state].filter(Boolean).join(", ")}`}
                  </div>
                  {exp.bullets.filter((b) => b.trim()).length > 0 && (
                    <ul style={{ margin: "0", paddingLeft: "20px", listStyleType: "disc" }}>
                      {exp.bullets
                        .filter((b) => b.trim())
                        .map((bullet, bIndex) => (
                          <li key={bIndex} style={{ color: "#333", marginBottom: "3px" }}>
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

      {/* Education */}
      {hasEducation && (
        <section style={{ marginBottom: "24px" }}>
          <h2 style={sectionHeaderStyle}>Education</h2>
          {education.map(
            (edu, index) =>
              (edu.school || edu.degree) && (
                <div key={edu.id || index} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</strong>
                    {edu.graduationDate && (
                      <span style={{ fontSize: "10pt", color: "#555" }}>{formatDate(edu.graduationDate)}</span>
                    )}
                  </div>
                  <div style={{ fontSize: "10pt", color: "#555", fontStyle: "italic" }}>
                    {edu.school}
                    {(edu.city || edu.state) && `, ${[edu.city, edu.state].filter(Boolean).join(", ")}`}
                  </div>
                  {(edu.gpa || edu.honors) && (
                    <div style={{ fontSize: "10pt", color: "#333", marginTop: "2px" }}>
                      {edu.gpa && `GPA: ${edu.gpa}`}
                      {edu.gpa && edu.honors && " • "}
                      {edu.honors}
                    </div>
                  )}
                </div>
              )
          )}
        </section>
      )}

      {/* Skills */}
      {hasSkills && (
        <section style={{ marginBottom: "24px" }}>
          <h2 style={sectionHeaderStyle}>Skills</h2>
          <p style={{ color: "#333" }}>{skills.join(" • ")}</p>
        </section>
      )}

      {/* Certifications */}
      {hasCertifications && (
        <section>
          <h2 style={sectionHeaderStyle}>Certifications</h2>
          {certifications.map(
            (cert, index) =>
              (cert.name || cert.issuer) && (
                <div key={cert.id || index} style={{ marginBottom: "6px" }}>
                  <span style={{ fontWeight: "600" }}>{cert.name}</span>
                  {cert.issuer && <span style={{ color: "#555" }}> – {cert.issuer}</span>}
                  {cert.dateObtained && (
                    <span style={{ color: "#777", fontSize: "10pt" }}> ({formatDate(cert.dateObtained)})</span>
                  )}
                </div>
              )
          )}
        </section>
      )}

      {/* Empty state */}
      {!hasContactInfo && !summary && !hasExperience && !hasEducation && !hasSkills && !hasCertifications && (
        <div style={{ textAlign: "center", color: "#aaa", padding: "60px 0" }}>
          <p style={{ fontSize: "14pt" }}>Your resume preview will appear here</p>
        </div>
      )}
    </div>
  );
}

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: "12pt",
  fontWeight: "700",
  color: "#1a1a1a",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  marginBottom: "10px",
  paddingBottom: "4px",
  borderBottom: "1px solid #ccc",
};
