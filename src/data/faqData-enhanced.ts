/**
 * ENHANCED FAQ Data for Career Forward Platform
 * Comprehensive FAQ covering all platform features and use cases
 * Last Updated: January 2026
 *
 * This is an ENHANCED version with additional questions based on workforce development best practices.
 * To use: Review additions, then merge desired questions into faqData.ts
 */

import { FAQCategory } from './faqData';

/**
 * ADDITIONAL QUESTIONS TO CONSIDER ADDING TO EXISTING CATEGORIES
 * These complement the existing 108 questions with 35+ new questions
 */

export const enhancedFAQAdditions: FAQCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started - ADDITIONS",
    description: "Additional questions for getting started",
    icon: "rocket",
    items: [
      {
        id: "system-requirements",
        question: "What are the system requirements to use Career Forward?",
        answer: "Career Forward is a web-based platform that works on any modern device with an internet connection. For the best experience, we recommend: a stable internet connection (minimum 1 Mbps), a modern web browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+), JavaScript enabled, and cookies enabled for login functionality. The platform is optimized for desktop, tablet, and mobile devices. No software installation is required.",
        tags: ["requirements", "technical", "setup"]
      },
      {
        id: "demo-account",
        question: "Can I try Career Forward with a demo account before signing up?",
        answer: "Yes! We offer a demo mode that lets you explore Career Forward's features without creating an account. Click 'View Demo' on our homepage to see sample dashboards, resume builder, job tracker, and reporting features. For organizations considering Career Forward for their team, we also offer personalized guided demos and trial periods. Contact our sales team at hello@careerforward.io to schedule a demo.",
        tags: ["demo", "trial", "testing"]
      },
      {
        id: "first-steps-job-seeker",
        question: "What should I do first as a new job seeker on Career Forward?",
        answer: "Welcome! Here's your recommended first-day checklist: (1) Complete your profile with your contact information and career goals, (2) Take the career assessment to identify your strengths and interests, (3) Build your first resume using our guided Resume Builder, (4) Explore the job board and save 3-5 positions that interest you, (5) Watch at least one interview prep video, and (6) Add your first job application to the Job Tracker. This foundation will set you up for success!",
        tags: ["onboarding", "first-steps", "job-seeker"]
      }
    ]
  },
  {
    id: "job-seekers",
    title: "For Job Seekers - ADDITIONS",
    description: "Additional job seeker questions",
    icon: "briefcase",
    items: [
      {
        id: "application-reminders",
        question: "Can I set up automatic reminders for job application follow-ups?",
        answer: "Yes! The Job Tracker includes a built-in reminder system. When you log a job application, you can set custom follow-up reminders (e.g., 'Follow up in 1 week' or 'Check status in 2 weeks'). Career Forward will send you email notifications and in-app alerts when it's time to take action. This ensures you never miss an opportunity to follow up with employers at the right time.",
        tags: ["reminders", "job-tracker", "notifications"]
      },
      {
        id: "cover-letter-help",
        question: "Does Career Forward help me write cover letters?",
        answer: "Absolutely! Career Forward includes AI-powered cover letter assistance. When you're ready to apply for a job, our AI coach can help you draft a tailored cover letter based on the job description and your resume. The AI suggests strong opening lines, highlights relevant experiences, and ensures your cover letter aligns with the specific role. You can save and edit multiple cover letters for different applications.",
        tags: ["cover-letter", "ai-coach", "writing"]
      },
      {
        id: "skill-assessments",
        question: "Can Career Forward help me identify skill gaps for my target jobs?",
        answer: "Yes! Our career assessment tools help you identify both your current strengths and areas for development. When you view jobs on our board, we show you which skills you already have and which skills the employer is seeking that you might want to develop. Your AI coach can recommend training resources, certifications, or experiences to help you build those missing skills and become a stronger candidate.",
        tags: ["skills", "assessments", "career-development"]
      },
      {
        id: "job-board-filters",
        question: "What filtering options are available on the job board?",
        answer: "Our job board offers comprehensive filtering to help you find the right opportunities: filter by location (city, state, remote options), salary range (minimum and maximum), job type (full-time, part-time, contract, temporary), experience level (entry-level, mid-level, senior), industry and occupation, company size, and posting date. You can also save your favorite filter combinations and set up job alerts for new postings matching your criteria.",
        tags: ["job-board", "filters", "search"]
      },
      {
        id: "networking-features",
        question: "Does Career Forward offer any networking or connection features?",
        answer: "While Career Forward focuses primarily on your personal job search journey and coaching support, we do facilitate professional connections. You can connect with career coaches and workforce development professionals who can support your search. We're exploring additional networking features for future releases. For now, we recommend using Career Forward to prepare your materials and strategy, then leveraging platforms like LinkedIn for professional networking.",
        tags: ["networking", "connections", "features"]
      },
      {
        id: "application-statistics",
        question: "Can I see statistics about my job search progress?",
        answer: "Yes! Your dashboard displays comprehensive job search analytics including: total applications submitted, interview requests received, response rate from employers, average time between application and response, applications by status (pending, interviewing, rejected, offered), and activity trends over time. These metrics help you understand your job search patterns, identify what's working, and adjust your strategy for better results.",
        tags: ["analytics", "statistics", "progress"]
      },
      {
        id: "application-materials-organization",
        question: "How can I organize different versions of my resume and cover letters?",
        answer: "Career Forward provides a document library where you can store up to 3 different resume versions and unlimited cover letters. You can name each version (e.g., 'Resume - Marketing Roles', 'Resume - Sales Positions') to keep them organized. Each document can be tagged with relevant job types or industries. When logging a job application, you can specify which resume and cover letter version you used, creating a complete record of your application materials.",
        tags: ["organization", "resumes", "documents"]
      }
    ]
  },
  {
    id: "coaches-organizations",
    title: "For Coaches & Organizations - ADDITIONS",
    description: "Additional questions for workforce professionals",
    icon: "users",
    items: [
      {
        id: "wioa-specific-reporting",
        question: "What WIOA-specific reports and metrics does Career Forward track?",
        answer: "Career Forward is designed with WIOA compliance in mind and tracks key performance indicators including: participant enrollment and demographics, measurable skill gains (tracked through assessment completion and credential attainment), employment outcomes (job placement, retention at 2nd and 4th quarters), median earnings, credential attainment, and training completion rates. All data can be exported in formats compatible with state workforce systems. The platform maintains audit trails for all participant activities to support monitoring visits.",
        tags: ["wioa", "compliance", "reporting", "grants"]
      },
      {
        id: "tanf-snap-grant-reporting",
        question: "Can Career Forward support reporting for TANF, SNAP E&T, or other grant programs?",
        answer: "Yes. While Career Forward is optimized for WIOA reporting, the flexible outcome tracking system supports various workforce development grants including TANF (Temporary Assistance for Needy Families), SNAP E&T (Employment & Training), DOL grants, and state-specific workforce initiatives. You can customize tracked outcomes, set program-specific milestones, and generate reports with custom date ranges. For specialized grant requirements, contact our team to discuss custom reporting configurations.",
        tags: ["grants", "tanf", "snap", "reporting", "compliance"]
      },
      {
        id: "coach-performance-metrics",
        question: "Can administrators track individual coach performance and productivity?",
        answer: "Yes. The Admin Dashboard provides coach-level analytics including: number of active clients per coach, client engagement rates, average time to job placement for each coach's caseload, client satisfaction indicators, message response times, and caseload progression through career pathway stages. These metrics help identify high-performing coaches, ensure equitable caseload distribution, and provide targeted professional development. All metrics respect client privacy and focus on aggregate performance.",
        tags: ["admin", "coach-performance", "metrics", "management"]
      },
      {
        id: "bulk-client-import",
        question: "Can we import existing clients in bulk rather than adding them individually?",
        answer: "Yes! Administrators can use our bulk import feature to onboard multiple clients at once. Upload a CSV file with client information (name, email, phone, demographics) and Career Forward will create accounts and send welcome emails automatically. We provide a template CSV file with required fields. For large migrations (100+ clients), our team can assist with data mapping and import validation. This significantly reduces onboarding time when transitioning from another system.",
        tags: ["import", "bulk", "onboarding", "admin"]
      },
      {
        id: "custom-fields-tracking",
        question: "Can we add custom data fields to track program-specific information?",
        answer: "Custom field functionality is available for Enterprise plans. Organizations can add custom fields to client profiles, application records, and outcome tracking to capture program-specific data (e.g., barrier types, referral sources, specific grant program identifiers, supportive services provided). Custom fields can be configured as text, dropdowns, checkboxes, or dates. For standard plans, we recommend using the Notes field to document custom information. Contact our enterprise team to discuss custom field requirements.",
        tags: ["customization", "enterprise", "tracking", "fields"]
      },
      {
        id: "data-migration-assistance",
        question: "Will Career Forward help us migrate data from our current system?",
        answer: "Yes! We provide data migration support for organizations transitioning from another case management system. Our team will work with you to map your existing data structure to Career Forward's format, validate data integrity, and perform test imports before going live. For large organizations (50+ coaches), we assign a dedicated implementation specialist to ensure smooth migration. Data migration services are included for annual plans and available as an add-on for monthly plans.",
        tags: ["migration", "implementation", "data-import", "support"]
      },
      {
        id: "multi-location-organizations",
        question: "How does Career Forward handle organizations with multiple office locations?",
        answer: "Career Forward supports multi-location organizations through location-based user groups. Administrators can create location tags (e.g., 'Spokane Office', 'Seattle Office') and assign coaches and clients to specific locations. This enables location-specific reporting, allows regional managers to view their location's data, and helps track performance across different sites. You can also filter dashboards and reports by location to understand regional variations in outcomes.",
        tags: ["multi-location", "organization", "locations", "admin"]
      },
      {
        id: "client-consent-privacy",
        question: "How does Career Forward handle client consent and data sharing permissions?",
        answer: "Client privacy is central to Career Forward's design. When a client creates an account, they agree to our Terms of Service and Privacy Policy. Clients must explicitly accept connection requests from coaches before any coach can view their information. Clients control what data coaches can see through privacy settings. All data sharing is logged in audit trails. For organizations with specific consent requirements (e.g., signed release forms), you can upload consent documents to client profiles and restrict coach access until consent is documented.",
        tags: ["consent", "privacy", "compliance", "data-sharing"]
      },
      {
        id: "coach-messaging-templates",
        question: "Can coaches create message templates for common communications?",
        answer: "Yes! Coaches can create and save message templates for frequent communications like welcome messages, follow-up reminders, job search tips, or interview preparation guidance. Templates can include dynamic fields (client name, upcoming appointment date) that auto-populate when you send the message. This saves time while maintaining personalized, professional communication. Administrators can also create organization-wide templates to ensure consistent messaging across the team.",
        tags: ["messaging", "templates", "communication", "efficiency"]
      },
      {
        id: "waitlist-management",
        question: "Can Career Forward help manage waitlists when we're at capacity?",
        answer: "Yes. Administrators can enable a waitlist feature when your program reaches capacity. Prospective clients can join the waitlist by providing their contact information and basic demographics. You can set custom intake criteria, prioritize waitlist members based on urgency or program eligibility, and automatically notify them when spots become available. Waitlist analytics help you forecast staffing needs and demonstrate demand to funders.",
        tags: ["waitlist", "capacity", "management", "intake"]
      }
    ]
  },
  {
    id: "pricing-billing",
    title: "Pricing & Billing - ADDITIONS",
    description: "Additional pricing and billing questions",
    icon: "dollar-sign",
    items: [
      {
        id: "grant-funded-payment",
        question: "Can we pay for Career Forward using grant funds?",
        answer: "Yes, many workforce development organizations successfully use WIOA, TANF, SNAP E&T, and other grant funds to pay for Career Forward subscriptions. Our platform qualifies as an allowable expense under most workforce development grants as it directly supports case management, participant tracking, and outcome reporting. We provide detailed invoices with line-item descriptions that meet grantor requirements. For specific grant compliance questions, consult your grant administrator or contact our team for supporting documentation.",
        tags: ["grants", "payment", "funding", "wioa"]
      },
      {
        id: "quarterly-billing",
        question: "Do you offer quarterly billing instead of monthly or annual?",
        answer: "Currently, Career Forward offers monthly and annual billing cycles. However, for organizations with specific fiscal requirements or quarterly grant cycles, we can discuss flexible billing arrangements. Contact our sales team at hello@careerforward.io to explore custom billing schedules that align with your organization's budget and grant funding cycles.",
        tags: ["billing", "payment", "flexibility"]
      },
      {
        id: "academic-institutions",
        question: "Do educational institutions qualify for special pricing?",
        answer: "Yes! Career Forward offers education pricing for colleges, universities, community colleges, and vocational schools using the platform for career services, workforce training programs, or adult education. Educational institutions typically receive 20-30% off standard pricing. To qualify, you'll need to verify your institution status with an .edu email address or official documentation. Contact our education sales team for a custom quote tailored to your institution.",
        tags: ["education", "academic", "discounts", "pricing"]
      },
      {
        id: "invoice-po-payment",
        question: "Our organization requires purchase orders and invoices. Can you accommodate this?",
        answer: "Absolutely. Career Forward works with government agencies, nonprofits, and large organizations that use purchase order (PO) workflows. We can issue quotes for your PO process, provide W-9 documentation, and send invoices with NET-30 or NET-60 payment terms as required. We also support ACH/wire transfers for invoice-based payments. Contact our billing team at billing@careerforward.io to set up invoice-based billing.",
        tags: ["invoices", "purchase-orders", "payment", "organizations"]
      },
      {
        id: "pricing-increase-policy",
        question: "Will my pricing increase over time?",
        answer: "We're committed to transparent, predictable pricing. Annual plan customers lock in their per-seat rate for the duration of their contract—your price won't increase during your contract term. For month-to-month plans, we provide 60 days advance notice of any pricing changes, giving you time to adjust your budget or lock in annual pricing at current rates. Historically, we've kept pricing stable for existing customers even when list prices change for new customers.",
        tags: ["pricing", "increases", "transparency", "contracts"]
      }
    ]
  },
  {
    id: "features-tools",
    title: "Features & Tools - ADDITIONS",
    description: "Additional feature questions",
    icon: "tool",
    items: [
      {
        id: "offline-access",
        question: "Can I access Career Forward offline or does it require internet?",
        answer: "Career Forward is a cloud-based platform that requires an internet connection to access your account and sync data. However, you can work on your resume offline by downloading it as a PDF or Word document, and you can review downloaded reports without internet access. We're exploring offline functionality for our future mobile app, which would allow you to draft resumes and log job applications offline, then sync when you reconnect.",
        tags: ["offline", "internet", "access", "technical"]
      },
      {
        id: "api-access",
        question: "Does Career Forward provide API access for integrations?",
        answer: "Yes! Career Forward offers API access for Enterprise customers who want to integrate with existing systems like HMIS (Homeless Management Information Systems), state workforce databases, or internal CRM platforms. Our RESTful API supports secure data exchange, single sign-on (SSO) integration, and automated reporting workflows. API documentation and sandbox access are provided to technical teams. Contact our enterprise team to discuss API access and integration requirements.",
        tags: ["api", "integration", "enterprise", "technical"]
      },
      {
        id: "white-label-option",
        question: "Can we white-label Career Forward with our organization's brand?",
        answer: "Career Forward supports organizational branding including your logo, color scheme, and organization name throughout the platform. While not a full white-label solution (Career Forward branding remains in footers and login pages), clients see your organization's visual identity prominently displayed. Full white-label options with custom domains and complete brand replacement are available for Enterprise plans with 50+ seats. Contact our enterprise team to learn more.",
        tags: ["white-label", "branding", "customization", "enterprise"]
      },
      {
        id: "video-conferencing",
        question: "Does Career Forward include video conferencing for remote coaching sessions?",
        answer: "Career Forward's current version includes in-app messaging and scheduling tools, but does not include built-in video conferencing. Coaches can schedule appointments and include video meeting links (Zoom, Teams, Google Meet) in appointment details. We recommend using your existing video conferencing tools for virtual sessions while using Career Forward to track appointment outcomes and client progress. Integrated video functionality is on our product roadmap for future releases.",
        tags: ["video", "conferencing", "coaching", "remote"]
      },
      {
        id: "resume-scoring",
        question: "Does the AI provide a score or rating for my resume?",
        answer: "While Career Forward's AI coach doesn't assign a numeric score to your resume, it does provide comprehensive qualitative feedback. The AI analyzes your resume for: ATS (Applicant Tracking System) compatibility, keyword optimization for your target roles, clear formatting and readability, strong action verbs and quantified achievements, and completeness of key sections. Instead of a score, you receive specific, actionable suggestions to strengthen your resume for each job you're targeting.",
        tags: ["resume", "ai-coach", "scoring", "feedback"]
      }
    ]
  },
  {
    id: "privacy-security",
    title: "Privacy & Security - ADDITIONS",
    description: "Additional privacy and security questions",
    icon: "shield",
    items: [
      {
        id: "soc2-compliance",
        question: "Is Career Forward SOC 2 compliant?",
        answer: "Career Forward is currently working toward SOC 2 Type II certification, with an expected completion date in Q4 2026. We've implemented SOC 2-aligned security controls including encryption, access management, change management, and incident response procedures. For organizations with SOC 2 requirements, we can provide our current security documentation and roadmap. Enterprise customers can request security questionnaires and participate in vendor security assessments.",
        tags: ["soc2", "compliance", "security", "certification"]
      },
      {
        id: "data-residency",
        question: "Where is my data physically stored? Can we choose data residency location?",
        answer: "Career Forward data is stored on secure servers located in the United States (primarily US-East and US-West regions) through our cloud infrastructure providers (Vercel and Supabase). For most customers, data residency is automatically handled within the US. Organizations with specific data residency requirements (e.g., EU data must stay in EU) should contact our enterprise team. We're expanding international data center options for global organizations and can discuss custom hosting arrangements for Enterprise plans.",
        tags: ["data-residency", "storage", "location", "compliance"]
      },
      {
        id: "penetration-testing",
        question: "Does Career Forward conduct regular security testing and penetration testing?",
        answer: "Yes. Career Forward undergoes quarterly security assessments including automated vulnerability scans and annual third-party penetration testing. We follow OWASP Top 10 guidelines and maintain a responsible disclosure program for security researchers. Critical vulnerabilities are patched within 24-48 hours; high-priority issues within 7 days. We can provide security assessment summaries to Enterprise customers under NDA. If your organization requires evidence of security testing, contact our security team.",
        tags: ["security", "penetration-testing", "vulnerability", "testing"]
      },
      {
        id: "user-authentication-options",
        question: "What authentication options are available beyond standard login?",
        answer: "Career Forward supports multiple authentication methods: standard email/password with strong password requirements, 'Remember Me' trusted device sessions (up to 30 days), and password reset via email verification. For Enterprise customers, we offer Single Sign-On (SSO) integration with SAML 2.0-compatible identity providers (Okta, Azure AD, Google Workspace). Multi-factor authentication (MFA) via SMS or authenticator apps is on our roadmap for 2026. Contact our team to enable SSO for your organization.",
        tags: ["authentication", "sso", "mfa", "security", "enterprise"]
      },
      {
        id: "subprocessors-vendors",
        question: "What third-party vendors (subprocessors) does Career Forward use?",
        answer: "Career Forward uses carefully vetted third-party services: Vercel (application hosting), Supabase/Vercel Postgres (database), Affinda (resume parsing), Resend (email delivery), partner job boards (job board data), and Stripe (payment processing). All vendors are contractually bound to data protection standards equivalent to our own Privacy Policy. We maintain a current list of subprocessors and will notify Enterprise customers 30 days before adding new subprocessors. Contact privacy@careerforward.com for our complete subprocessor list.",
        tags: ["subprocessors", "vendors", "third-party", "privacy"]
      }
    ]
  },
  {
    id: "technical-support",
    title: "Technical Support - ADDITIONS",
    description: "Additional technical support questions",
    icon: "help-circle",
    items: [
      {
        id: "emergency-support",
        question: "What if we have a critical issue outside of business hours?",
        answer: "For standard plans, emergency support outside of business hours (M-F, 9am-5pm PT) is handled via email at support@careerforward.io with response the next business day. For Enterprise customers, we offer Priority Support add-ons that include 24/7 emergency contact for critical issues (system outages, security incidents, data access problems) via a dedicated support phone line and email. Critical issues are addressed within 2 hours. Contact our sales team to add Priority Support to your plan.",
        tags: ["emergency", "support", "hours", "enterprise"]
      },
      {
        id: "training-resources",
        question: "What training resources are available for new users?",
        answer: "Career Forward provides comprehensive training resources: video tutorials (5-10 minutes each) covering every platform feature, written step-by-step guides with screenshots, interactive platform tours for new users, live onboarding webinars (weekly for job seekers, monthly for coaches), a searchable knowledge base with 200+ articles, and downloadable PDF quick-start guides. For organizations, we offer custom training sessions for your team during implementation. All resources are available 24/7 in our Help Center.",
        tags: ["training", "tutorials", "onboarding", "resources"]
      },
      {
        id: "feature-requests-roadmap",
        question: "How can I see what features are coming next? Can I vote on feature requests?",
        answer: "We maintain a public product roadmap showing features currently in development and planned for upcoming releases. You can view the roadmap at roadmap.careerforward.io to see what's next. Users can submit feature requests via our feedback form, and Enterprise customers can participate in our Product Advisory Board that helps prioritize development. While we don't currently have public voting on features, we carefully track request frequency and use it to inform our roadmap.",
        tags: ["roadmap", "features", "feedback", "development"]
      },
      {
        id: "downtime-sla",
        question: "What is Career Forward's uptime guarantee and SLA?",
        answer: "Career Forward targets 99.5% uptime for our platform. While standard plans do not include a formal SLA (Service Level Agreement), our infrastructure is designed for high availability with automatic failover and redundancy. For Enterprise customers, we offer SLA agreements guaranteeing 99.9% uptime with credits for any downtime exceeding our commitment. We schedule maintenance during low-usage windows (typically Saturday nights 10pm-2am PT) with 7 days advance notice. Check status.careerforward.io for real-time system status.",
        tags: ["uptime", "sla", "reliability", "enterprise"]
      }
    ]
  }
];

/**
 * USAGE INSTRUCTIONS:
 *
 * 1. Review each category of additions above
 * 2. Identify questions that add value for your target audience
 * 3. Merge selected questions into the main faqData.ts file
 * 4. Update question IDs to ensure no duplicates
 * 5. Adjust answers to match your specific implementation details
 * 6. Update tags for better searchability
 *
 * TOTAL ADDITIONS: 35 new questions
 * - Getting Started: +3 questions (total would be 10)
 * - For Job Seekers: +7 questions (total would be 35)
 * - For Coaches & Organizations: +10 questions (total would be 30)
 * - Pricing & Billing: +5 questions (total would be 21)
 * - Features & Tools: +5 questions (total would be 12)
 * - Privacy & Security: +5 questions (total would be 27)
 * - Technical Support: +4 questions (total would be 12)
 *
 * COMBINED TOTAL: 143 questions (existing 108 + new 35)
 */
