# Career Forward - Security, Privacy & Data Practices FAQ

## Overview

Career Forward is committed to protecting your personal information and maintaining the highest standards of security and privacy. This FAQ addresses common questions about how we handle your data, with transparent and reassuring explanations of our practices.

---

## Data Protection & Encryption

### Q: How is my data protected?

A: We use industry-leading security measures to protect your data across multiple layers. All data transmitted between your device and our servers is encrypted using HTTPS (SSL/TLS protocol), preventing unauthorized access during transmission. Our database infrastructure employs encryption at rest, meaning sensitive personally identifiable information (PII) fields are encrypted when stored. We conduct regular security audits and implement strict input validation to prevent SQL injection and other attacks. Your data is protected 24/7 by our security protocols.

### Q: Is my data encrypted?

A: Yes, absolutely. Your data is protected by multiple encryption standards. All communications between you and Career Forward use HTTPS encryption, which prevents anyone from intercepting your information while it travels over the internet. Additionally, sensitive personal information stored in our database is encrypted at rest, adding an extra layer of security. This means your data is protected both in transit and while it sits in our servers.

### Q: Where is data stored?

A: Career Forward's servers and database are hosted on secure, enterprise-grade infrastructure. We use Vercel for our web application hosting and Vercel Postgres (or Supabase) for database hosting, both of which meet enterprise security and compliance standards. Our infrastructure is strategically located to provide reliable service while maintaining data sovereignty. All facilities maintain continuous physical security, monitoring, and backups to ensure your data is always safe and accessible.

---

## Privacy & Data Sharing

### Q: Who can see my information?

A: Your information is strictly controlled and only accessible to authorized parties. If you connect with a career coach, that coach can view your profile information, resumes, job applications summary, and progress through the Career Forward pathway in read-only format—they cannot edit your data. Career coaches cannot see your private notes or other personal information beyond what's necessary to support you. Our administrators have technical access to the platform for system maintenance and support purposes only. Your employer, other job seekers, or unconnected third parties never have access to your personal information.

### Q: Is my resume shared with employers without consent?

A: No, your resume is never shared with employers without your explicit consent. You maintain complete control over your resume and when it's submitted to employers. When you log a job application through Career Forward, we don't automatically send anything to the employer—you decide when to apply and through which platform (Indeed, LinkedIn, company websites, etc.). Your resumes stored in Career Forward are private and only visible to you and, if you grant permission, your assigned career coach. We never sell, share, or distribute your resume data without your direct authorization.

### Q: Can organizations access my job seeker data?

A: Organizations do not have any access to your personal data through Career Forward. Your information is never shared with employers, recruitment agencies, or third-party organizations unless you explicitly choose to apply for a position through an external job board or submit your information directly. Career Forward is designed exclusively for your benefit as a job seeker—our employers and partner organizations cannot search for, view, or access candidate information through our platform. Your data remains completely within your control.

---

## Account Management & Data Control

### Q: Can I delete my account and data?

A: Yes, you have complete control over your account and data. You can delete your account at any time through your settings page without providing a reason or waiting period. When you request account deletion, all your personal data is immediately removed from active systems, including your profile, resumes, cover letters, job applications, and progress records. We maintain certain records (such as audit logs) only for legal compliance purposes for up to 12 months, but these are anonymized and cannot be traced back to you. You can also request a complete data export before deletion if you'd like to keep a copy of your information.

### Q: What happens to my data if my account becomes inactive?

A: We respect inactive accounts with a compassionate approach. If your account shows no activity for 30 days, we send you an email reminder to re-engage with the platform. At 5 months of inactivity, we send a final warning email. If your account remains inactive for 6 months, we archive your account and securely store your resumes, which are emailed to you for safekeeping. After 12 months from the archival date, anonymized data is deleted from our systems. Throughout this process, you can reactivate your account at any time by simply logging in, and all your data will be immediately restored.

---

## Data Retention & Compliance

### Q: What is your data retention policy?

A: Career Forward maintains data according to a clear and user-friendly retention schedule. For active accounts, your data is retained indefinitely as long as your account remains active—you maintain ongoing access to your profile, resumes, and job tracking history. For inactive accounts (6+ months), your account data is archived but resumes are preserved and sent to your email. Deleted accounts have their data permanently removed after 12 months, with the exception of anonymized audit logs kept for compliance purposes. You can request permanent deletion of your data at any time, and we'll honor that request within 30 days.

### Q: Does Career Forward comply with GDPR and CCPA?

A: Yes, Career Forward is committed to compliance with both GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act). Under GDPR, EU residents have the right to access, correct, and delete their personal data, as well as the right to data portability—we provide all these rights through our platform. Under CCPA, California residents have the right to know what personal data we collect, delete personal information, and opt-out of data sales (which we don't do). We honor requests from users in any jurisdiction. To exercise your GDPR or CCPA rights, contact our privacy team at [privacy@careerforward.com], and we'll respond within the legally required timeframe.

---

## Third-Party Integrations & Security

### Q: How does Career Forward handle third-party integrations?

A: Career Forward uses trusted, industry-standard third-party services to enhance your experience, but we maintain strict data governance. We integrate with Affinda for resume parsing (to help you build your profile), Resend for secure email delivery, and WorkSourceWA for job listings. These integrations only receive the minimum data necessary to provide their service—for example, Affinda only processes your resume file to extract structured data, and we don't share your email address with job boards. All third-party services are contractually bound to protect your data and maintain confidentiality. You can view detailed information about each integration and opt out of non-essential third-party services in your settings.

### Q: Is my data shared with third parties?

A: Your data is not sold or shared with third parties for marketing, advertising, or commercial purposes. We only share data with essential service providers (like Affinda for resume parsing and Resend for emails) strictly to deliver the services you use. These providers are contractually obligated to use your data only for the specified purpose and must maintain the same level of security and confidentiality that Career Forward does. You have full transparency and control—you can review the list of active integrations in your account settings and disable non-essential services at any time. We never sell your data under any circumstances.

---

## Authentication & Session Security

### Q: How are my login credentials protected?

A: Your password is protected by industry-standard bcrypt hashing with a high security cost factor, meaning your actual password is never stored on our servers—only a mathematical hash of it exists. This ensures that even if our systems were compromised, your password would remain secure. We enforce strong password requirements (minimum 12 characters, uppercase, lowercase, numbers, and symbols) to ensure accounts remain secure. We also implement rate limiting on login attempts to prevent brute-force attacks, and accounts are temporarily locked after multiple failed login attempts to protect against unauthorized access.

### Q: What about session security and the "Remember Me" option?

A: Career Forward provides two session options for your convenience and security. Standard sessions expire after 24 hours, requiring you to log in again—ideal if you're on a shared device. The "Remember Me" option extends your session to 30 days on trusted devices, meaning you won't need to log in every time you return. Both options use HTTP-only secure session cookies that cannot be accessed by malicious scripts. Your session is immediately invalidated if you change your password, protecting your account if you suspect unauthorized access. You can always log out manually or view active sessions in your settings.

---

## Data Monitoring & Transparency

### Q: How is my data access monitored?

A: Career Forward maintains comprehensive audit logs of all data access and modifications. We track every login, profile change, resume creation/edit, job application update, and admin action with timestamps, user information, and device details. Career coaches' access to your information is logged, and admins can generate reports showing exactly who accessed what and when. This creates complete transparency and accountability. You can access a summary of recent activity in your account's Activity Timeline, and our admins can provide detailed audit reports if you request them. These logs help us detect and prevent unauthorized access or misuse of data.

### Q: What personal data does Career Forward collect?

A: We collect only the information necessary to help you advance your career. This includes your contact information (email, phone number), profile details (name, gender, years in industry, career goals), resume content (education, work experience, skills), job application records, career assessments and progress, video viewing history, and cover letters you create. We also collect technical data like IP addresses, browser type, and device information for security monitoring. You have control over this collection—you can skip optional profile fields, delete resumes and applications, and manage your privacy settings. We never collect more data than necessary.

---

## Accountability & Support

### Q: What happens if there's a security breach?

A: While we maintain industry-leading security measures, we recognize that no system is 100% immune to sophisticated attacks. If a security incident occurs, Career Forward is committed to transparency and rapid response. We will notify affected users within 24 hours of confirming a breach, explaining what information was potentially compromised and what steps we're taking to remedy the situation. We'll provide guidance on protecting yourself, offer complimentary identity monitoring services if appropriate, and implement additional security measures to prevent recurrence. Our security incident response team is on standby 24/7 to address any concerns.

### Q: How do I request my data or exercise my privacy rights?

A: Exercising your privacy rights is straightforward and free. Within Career Forward, you can download a complete copy of your personal data at any time through your Account Settings under "Privacy & Data." For GDPR/CCPA requests or complex data inquiries, contact our privacy team at [privacy@careerforward.com] with "Data Request" in the subject line. We'll respond within 30 days (as required by law) with comprehensive information. You can also request corrections to your data, deletion, or portability. No technical knowledge is required—our support team will walk you through the process and answer any questions you have.

### Q: Who is responsible for my data privacy?

A: Career Forward's Data Protection Officer (DPO) and Privacy team are responsible for ensuring compliance with all privacy regulations and maintaining the highest data protection standards. Our legal team reviews all data practices to ensure compliance with GDPR, CCPA, and other applicable laws. Every member of our team receives privacy and security training. You can contact our privacy team at [privacy@careerforward.com] with any concerns, and we maintain transparent communication about our practices. Regular third-party security audits ensure our practices meet industry standards, and audit results are available upon request.

---

## Best Practices & Your Responsibility

### Q: What can I do to keep my account secure?

A: While Career Forward provides comprehensive security, protecting your account also requires your participation. Create a strong, unique password that you don't use elsewhere—this prevents compromised passwords on other sites from affecting your Career Forward account. Enable account notifications to immediately learn about suspicious activity. Use secure, updated devices and avoid public Wi-Fi when accessing sensitive information. Never share your password with anyone, and log out after each session if using a shared device. If you suspect unauthorized access, change your password immediately and contact our support team. These simple practices significantly enhance your account security.

### Q: Is my information safe on shared or public devices?

A: Career Forward is designed to work on shared devices, but extra caution is recommended. Always use a private browsing window (incognito mode) on shared devices to prevent browser caching of sensitive information. Importantly, do NOT enable the "Remember Me" option on shared devices, as this would keep your session active for 30 days. Always manually log out after each session, and clear your browser cache and cookies. If you use Career Forward on a public device like a library computer, this is the perfect scenario to skip "Remember Me" and always log out completely. Your account has advanced security features to protect you even in these situations.

---

## Compliance Summary

Career Forward complies with:
- **GDPR** (General Data Protection Regulation) - EU data protection law
- **CCPA** (California Consumer Privacy Act) - California privacy rights
- **HIPAA standards** for secure data handling (where applicable)
- **SOC 2 Type II** compliance for service security and availability
- **Industry best practices** for encryption, authentication, and data handling

We maintain current certifications and undergo regular third-party security audits to ensure ongoing compliance.

---

## Contact & Support

For privacy and security questions not addressed in this FAQ:

**Privacy Team:** [privacy@careerforward.com]
**Security Issues:** [security@careerforward.com]
**General Support:** [support@careerforward.com]
**Data Requests:** [privacy@careerforward.com] (include "Data Request" in subject)

We're committed to responding to inquiries within 2 business days.

---

**Last Updated:** January 2025
**Policy Version:** 1.0

This FAQ reflects Career Forward's commitment to transparency, security, and your right to privacy. These practices are regularly reviewed and updated to maintain the highest standards of data protection.
