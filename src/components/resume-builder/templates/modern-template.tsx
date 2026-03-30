"use client";

import { ResumeData } from "../types/resume-types";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface ModernTemplateProps {
  data: ResumeData;
}

// Modern template - Two-column header with teal accent color
// ATS-friendly with clean structure and semantic headings
export function ModernTemplate({ data }: ModernTemplateProps) {
  const { contactInfo, summary, experience, education, skills, certifications } =
    data;

  const hasContactInfo =
    contactInfo.firstName || contactInfo.lastName || contactInfo.email;
  const hasExperience =
    experience.length > 0 && experience.some((e) => e.jobTitle || e.company);
  const hasEducation =
    education.length > 0 && education.some((e) => e.school || e.degree);
  const hasSkills = skills.length > 0;
  const hasCertifications =
    certifications.length > 0 &&
    certifications.some((c) => c.name || c.issuer);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div
      className="min-h-full bg-white text-gray-900"
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "11pt",
        lineHeight: "1.4",
        padding: "40px 50px",
      }}
    >
      {/* Header */}
      {hasContactInfo && (
        <header style={{ marginBottom: "24px" }}>
          {/* Name */}
          <h1
            style={{
              fontSize: "28pt",
              fontWeight: "700",
              color: "#1a1a1a",
              marginBottom: "8px",
              letterSpacing: "-0.5px",
            }}
          >
            {contactInfo.firstName} {contactInfo.lastName}
          </h1>

          {/* Contact row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              fontSize: "10pt",
              color: "#555",
            }}
          >
            {contactInfo.email && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Mail size={12} color="#2B8A8A" />
                {contactInfo.email}
              </span>
            )}
            {contactInfo.phone && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Phone size={12} color="#2B8A8A" />
                {contactInfo.phone}
              </span>
            )}
            {(contactInfo.city || contactInfo.state) && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={12} color="#2B8A8A" />
                {[contactInfo.city, contactInfo.state].filter(Boolean).join(", ")}
              </span>
            )}
            {contactInfo.linkedinUrl && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Linkedin size={12} color="#2B8A8A" />
                {contactInfo.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            )}
            {contactInfo.portfolioUrl && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Globe size={12} color="#2B8A8A" />
                {contactInfo.portfolioUrl.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            )}
          </div>
        </header>
      )}

      {/* Divider line */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(to right, #2B8A8A, #4FD1C5)",
          marginBottom: "20px",
          borderRadius: "2px",
        }}
      />

      {/* Summary */}
      {summary && (
        <section style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "700",
              color: "#2B8A8A",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px",
              borderBottom: "1px solid #e5e5e5",
              paddingBottom: "4px",
            }}
          >
            Professional Summary
          </h2>
          <p style={{ color: "#333", textAlign: "justify" }}>{summary}</p>
        </section>
      )}

      {/* Experience */}
      {hasExperience && (
        <section style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "700",
              color: "#2B8A8A",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "12px",
              borderBottom: "1px solid #e5e5e5",
              paddingBottom: "4px",
            }}
          >
            Work Experience
          </h2>
          {experience.map(
            (exp, index) =>
              (exp.jobTitle || exp.company) && (
                <div
                  key={exp.id || index}
                  style={{ marginBottom: index < experience.length - 1 ? "16px" : "0" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "2px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "11pt",
                        fontWeight: "700",
                        color: "#1a1a1a",
                      }}
                    >
                      {exp.jobTitle}
                    </h3>
                    <span
                      style={{
                        fontSize: "10pt",
                        color: "#666",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(exp.startDate)}
                      {" - "}
                      {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "10pt",
                      color: "#555",
                      marginBottom: "6px",
                      fontStyle: "italic",
                    }}
                  >
                    {exp.company}
                    {(exp.city || exp.state) &&
                      ` | ${[exp.city, exp.state].filter(Boolean).join(", ")}`}
                  </p>
                  {exp.bullets.filter((b) => b.trim()).length > 0 && (
                    <ul
                      style={{
                        margin: "0",
                        paddingLeft: "18px",
                        listStyleType: "disc",
                      }}
                    >
                      {exp.bullets
                        .filter((b) => b.trim())
                        .map((bullet, bIndex) => (
                          <li
                            key={bIndex}
                            style={{
                              color: "#333",
                              marginBottom: "2px",
                            }}
                          >
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
        <section style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "700",
              color: "#2B8A8A",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "12px",
              borderBottom: "1px solid #e5e5e5",
              paddingBottom: "4px",
            }}
          >
            Education
          </h2>
          {education.map(
            (edu, index) =>
              (edu.school || edu.degree) && (
                <div
                  key={edu.id || index}
                  style={{ marginBottom: index < education.length - 1 ? "12px" : "0" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "2px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "11pt",
                        fontWeight: "700",
                        color: "#1a1a1a",
                      }}
                    >
                      {edu.degree}
                      {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                    </h3>
                    {edu.graduationDate && (
                      <span
                        style={{
                          fontSize: "10pt",
                          color: "#666",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDate(edu.graduationDate)}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "10pt",
                      color: "#555",
                      fontStyle: "italic",
                    }}
                  >
                    {edu.school}
                    {(edu.city || edu.state) &&
                      ` | ${[edu.city, edu.state].filter(Boolean).join(", ")}`}
                  </p>
                  {(edu.gpa || edu.honors) && (
                    <p
                      style={{
                        fontSize: "10pt",
                        color: "#333",
                        marginTop: "4px",
                      }}
                    >
                      {edu.gpa && `GPA: ${edu.gpa}`}
                      {edu.gpa && edu.honors && " | "}
                      {edu.honors}
                    </p>
                  )}
                </div>
              )
          )}
        </section>
      )}

      {/* Skills */}
      {hasSkills && (
        <section style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "700",
              color: "#2B8A8A",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px",
              borderBottom: "1px solid #e5e5e5",
              paddingBottom: "4px",
            }}
          >
            Skills
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {skills.map((skill, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: "#f0f9f9",
                  color: "#2B8A8A",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  fontSize: "10pt",
                  fontWeight: "500",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {hasCertifications && (
        <section>
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "700",
              color: "#2B8A8A",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "12px",
              borderBottom: "1px solid #e5e5e5",
              paddingBottom: "4px",
            }}
          >
            Certifications
          </h2>
          {certifications.map(
            (cert, index) =>
              (cert.name || cert.issuer) && (
                <div
                  key={cert.id || index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom:
                      index < certifications.length - 1 ? "8px" : "0",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#1a1a1a",
                      }}
                    >
                      {cert.name}
                    </span>
                    {cert.issuer && (
                      <span style={{ color: "#555" }}> - {cert.issuer}</span>
                    )}
                    {cert.credentialId && (
                      <span
                        style={{ color: "#888", fontSize: "9pt", marginLeft: "8px" }}
                      >
                        ID: {cert.credentialId}
                      </span>
                    )}
                  </div>
                  {cert.dateObtained && (
                    <span
                      style={{
                        fontSize: "10pt",
                        color: "#666",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(cert.dateObtained)}
                    </span>
                  )}
                </div>
              )
          )}
        </section>
      )}

      {/* Empty state */}
      {!hasContactInfo &&
        !summary &&
        !hasExperience &&
        !hasEducation &&
        !hasSkills &&
        !hasCertifications && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              color: "#aaa",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "14pt", marginBottom: "8px" }}>
              Your resume preview will appear here
            </p>
            <p style={{ fontSize: "10pt" }}>
              Start filling in your information to see it come to life
            </p>
          </div>
        )}
    </div>
  );
}
