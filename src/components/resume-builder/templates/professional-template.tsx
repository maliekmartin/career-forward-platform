"use client";

import { ResumeData } from "../types/resume-types";

interface ProfessionalTemplateProps {
  data: ResumeData;
  accentColor?: string;
}

// Professional template - Bold headers with blue accents
// Best for corporate roles, management positions
export function ProfessionalTemplate({ data, accentColor = "#1e40af" }: ProfessionalTemplateProps) {
  const { contactInfo, summary, experience, education, skills, certifications } = data;

  const hasContactInfo = contactInfo.firstName || contactInfo.lastName || contactInfo.email;
  const hasExperience = experience.length > 0 && experience.some((e) => e.jobTitle || e.company);
  const hasEducation = education.length > 0 && education.some((e) => e.school || e.degree);
  const hasSkills = skills.length > 0;
  const hasCertifications = certifications.length > 0 && certifications.some((c) => c.name || c.issuer);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div
      className="min-h-full bg-white text-[#0F172A]"
      style={{
        fontFamily: "Calibri, Arial, sans-serif",
        fontSize: "11pt",
        lineHeight: "1.4",
      }}
    >
      {/* Header with accent background */}
      {hasContactInfo && (
        <header
          style={{
            backgroundColor: accentColor,
            color: "white",
            padding: "30px 50px",
          }}
        >
          <h1
            style={{
              fontSize: "32pt",
              fontWeight: "700",
              marginBottom: "8px",
              letterSpacing: "-0.5px",
            }}
          >
            {contactInfo.firstName} {contactInfo.lastName}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "10pt", opacity: 0.9 }}>
            {contactInfo.email && <span>{contactInfo.email}</span>}
            {contactInfo.phone && <span>{contactInfo.phone}</span>}
            {(contactInfo.city || contactInfo.state) && (
              <span>{[contactInfo.city, contactInfo.state].filter(Boolean).join(", ")}</span>
            )}
            {contactInfo.linkedinUrl && <span>{contactInfo.linkedinUrl}</span>}
          </div>
        </header>
      )}

      {/* Body content */}
      <div style={{ padding: "30px 50px" }}>
        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: "24px" }}>
            <h2 style={getSectionHeaderStyle(accentColor)}>PROFESSIONAL SUMMARY</h2>
            <p style={{ color: "#333" }}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {hasExperience && (
          <section style={{ marginBottom: "24px" }}>
            <h2 style={getSectionHeaderStyle(accentColor)}>WORK EXPERIENCE</h2>
            {experience.map(
              (exp, index) =>
                (exp.jobTitle || exp.company) && (
                  <div key={exp.id || index} style={{ marginBottom: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h3 style={{ fontSize: "12pt", fontWeight: "700", color: accentColor, margin: 0 }}>
                        {exp.jobTitle}
                      </h3>
                      <span style={{ fontSize: "10pt", color: "#666", fontWeight: "500" }}>
                        {formatDate(exp.startDate)} - {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p style={{ fontSize: "11pt", color: "#444", margin: "2px 0 8px", fontWeight: "500" }}>
                      {exp.company}
                      {(exp.city || exp.state) && ` | ${[exp.city, exp.state].filter(Boolean).join(", ")}`}
                    </p>
                    {exp.bullets.filter((b) => b.trim()).length > 0 && (
                      <ul style={{ margin: 0, paddingLeft: "18px", listStyleType: "square" }}>
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

        {/* Two column layout for Education and Skills */}
        <div style={{ display: "flex", gap: "40px" }}>
          {/* Education */}
          {hasEducation && (
            <section style={{ flex: 1, marginBottom: "24px" }}>
              <h2 style={getSectionHeaderStyle(accentColor)}>EDUCATION</h2>
              {education.map(
                (edu, index) =>
                  (edu.school || edu.degree) && (
                    <div key={edu.id || index} style={{ marginBottom: "12px" }}>
                      <p style={{ fontWeight: "700", color: "#333", margin: 0 }}>
                        {edu.degree}
                        {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                      </p>
                      <p style={{ color: "#555", fontSize: "10pt", margin: "2px 0" }}>
                        {edu.school}
                      </p>
                      {edu.graduationDate && (
                        <p style={{ color: "#777", fontSize: "9pt", margin: 0 }}>
                          {formatDate(edu.graduationDate)}
                        </p>
                      )}
                      {edu.gpa && (
                        <p style={{ color: "#555", fontSize: "9pt", margin: "2px 0" }}>GPA: {edu.gpa}</p>
                      )}
                    </div>
                  )
              )}
            </section>
          )}

          {/* Skills */}
          {hasSkills && (
            <section style={{ flex: 1, marginBottom: "24px" }}>
              <h2 style={getSectionHeaderStyle(accentColor)}>SKILLS</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "9pt",
                      fontWeight: "500",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Certifications */}
        {hasCertifications && (
          <section>
            <h2 style={getSectionHeaderStyle(accentColor)}>CERTIFICATIONS</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {certifications.map(
                (cert, index) =>
                  (cert.name || cert.issuer) && (
                    <div
                      key={cert.id || index}
                      style={{
                        padding: "8px 12px",
                        border: `1px solid ${accentColor}30`,
                        borderRadius: "6px",
                        backgroundColor: `${accentColor}05`,
                      }}
                    >
                      <p style={{ fontWeight: "600", color: "#333", margin: 0, fontSize: "10pt" }}>
                        {cert.name}
                      </p>
                      {cert.issuer && (
                        <p style={{ color: "#666", fontSize: "9pt", margin: "2px 0 0" }}>{cert.issuer}</p>
                      )}
                    </div>
                  )
              )}
            </div>
          </section>
        )}
      </div>

      {/* Empty state */}
      {!hasContactInfo && !summary && !hasExperience && !hasEducation && !hasSkills && !hasCertifications && (
        <div style={{ textAlign: "center", color: "#aaa", padding: "100px 0" }}>
          <p style={{ fontSize: "14pt" }}>Your resume preview will appear here</p>
        </div>
      )}
    </div>
  );
}

const getSectionHeaderStyle = (accentColor: string): React.CSSProperties => ({
  fontSize: "11pt",
  fontWeight: "700",
  color: accentColor,
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "12px",
  paddingBottom: "6px",
  borderBottom: `2px solid ${accentColor}`,
});
