/**
 * FAQ Data for Career Forward Platform
 * Structured data for use in React components
 * Last Updated: January 2026
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
}

export interface FAQCategory {
  id: string;
  title: string;
  description: string;
  icon?: string;
  items: FAQItem[];
}

export const faqData: FAQCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Everything you need to know to begin your Career Forward journey",
    icon: "rocket",
    items: [
      {
        id: "what-is-career-forward",
        question: "What is Career Forward?",
        answer: "Career Forward is a comprehensive workforce development platform designed to empower job seekers and support organizations in guiding talent toward meaningful employment. Launching in Q3 2026, it combines intelligent career tools, AI-powered coaching, and structured guidance to help you navigate every step of your career journey—from self-assessment to job placement and beyond.",
        tags: ["overview", "introduction"]
      },
      {
        id: "who-should-use",
        question: "Who should use Career Forward?",
        answer: "Career Forward serves two distinct audiences: job seekers looking for comprehensive career support (free access), and organizations and career coaches seeking to develop their workforce (paid subscriptions at $21/month or $18/month annually per seat). Whether you're exploring new career paths, preparing for interviews, or managing a team of job seekers, Career Forward provides the tools and guidance you need.",
        tags: ["overview", "audience"]
      },
      {
        id: "how-to-sign-up",
        question: "How do I sign up for Career Forward?",
        answer: "Head to our website and click 'Get Started' to create your account. If you're a job seeker, choose the job seeker option for instant free access. If you're an organization or coach, select the organization option and we'll guide you through setting up your subscription and connecting with clients.",
        tags: ["signup", "registration"]
      },
      {
        id: "create-account",
        question: "How do I create an account?",
        answer: "Creating your Career Forward account is simple and completely free for job seekers. Just visit our website and click the 'Sign Up' button, then provide your email address and create a password. You'll receive a confirmation email to verify your account. Once confirmed, you'll have access to all of our tools and resources. Getting started typically takes just a few minutes.",
        tags: ["signup", "registration"]
      },
      {
        id: "required-information",
        question: "What information do I need to provide to get started?",
        answer: "Job seekers need: a valid email address, password, full name, and basic profile information (location, target industry). Coaches and organizations need: business information, phone number, and billing details for subscription setup. You can expand your profile and add more details as you go.",
        tags: ["signup", "requirements"]
      },
      {
        id: "launch-date",
        question: "When is Career Forward launching?",
        answer: "Career Forward is launching in Q3 2026 (July-September 2026). We're currently in development and will announce early access opportunities for beta testers. Organizations interested in being early adopters or joining our launch partner program can reach out now to express interest and get special introductory pricing.",
        tags: ["launch", "timeline"]
      },
      {
        id: "get-most-out",
        question: "How do I get the most out of Career Forward?",
        answer: "Start by completing your profile and working through the career assessment to identify your strengths and interests. Build a strong resume using our guided builder. Then systematically use the Job Tracker to monitor all applications and follow-ups. Regularly watch interview prep videos relevant to your target roles, and use AI coaching to refine your approach. Finally, stay consistent—the more you engage with the platform, the better your results.",
        tags: ["tips", "best-practices"]
      },
      {
        id: "update-profile",
        question: "How do I update my profile information?",
        answer: "Updating your profile is easy. Log into Career Forward and click on your user menu in the top-right corner, then select 'Profile.' You can edit your personal information, contact details, career goals, and other settings. After making changes, click the 'Save' button to update your profile. Your profile information helps personalize your Career Forward experience and is only visible to you and your assigned career coach if you have one.",
        tags: ["profile", "settings"]
      }
    ]
  },
  {
    id: "job-seekers",
    title: "For Job Seekers",
    description: "Tools and features to help you land your dream job",
    icon: "briefcase",
    items: [
      {
        id: "is-it-free",
        question: "Is Career Forward really free for job seekers?",
        answer: "Yes, Career Forward is completely free for job seekers. You'll have full access to resume building, job application tracking, interview preparation, career assessments, and AI coaching without any fees or credit card required. Our mission is to empower everyone with the tools they need to succeed in their job search. There are no hidden costs, premium upgrades, or feature restrictions.",
        tags: ["free", "pricing"]
      },
      {
        id: "free-tier-features",
        question: "What's included in the free tier for job seekers?",
        answer: "Job seekers get access to the complete Career Forward platform at no cost, including: unlimited resume creation and storage (up to 3 resumes), AI-powered resume parsing from document uploads, job-matched cover letter generation, comprehensive job application tracking with a stoplight status system, progress tracking through the 5-stage Career Forward pathway, access to interview preparation videos and training resources, career assessments and labor market information, achievement badges and milestone tracking, and integration with the WorkSourceWA job board.",
        tags: ["free", "features"]
      },
      {
        id: "how-helps-find-job",
        question: "How does Career Forward help me find a job?",
        answer: "Career Forward guides you through a structured 5-stage career pathway: career discovery, resume building, interview preparation, job application tracking, and success celebration. We provide AI-powered coaching throughout each stage, help you build a compelling resume, guide you through interview preparation with video workshops, and give you tools to organize and track every application you submit.",
        tags: ["job-search", "features"]
      },
      {
        id: "resume-builder-overview",
        question: "What is the Resume Builder and how does it work?",
        answer: "Our Resume Builder provides professional templates with a side-by-side editing interface that makes creating a polished resume intuitive and fast. You can store up to 3 different resumes to tailor your application for different roles or industries. The builder includes guidance at every step, and you can export your resume as PDF or Word format to send to employers directly.",
        tags: ["resume", "tools"]
      },
      {
        id: "build-resume",
        question: "How do I build my resume?",
        answer: "Our Resume Builder makes creating a professional resume easy, even if you've never built one before. Start by clicking 'Resume Builder' in your dashboard and follow the simple step-by-step sections to enter your contact information, work experience, education, skills, and more. Our platform provides helpful prompts and templates so you don't have to start from scratch. You can preview your resume in real-time, make edits anytime, and download or share it directly with employers.",
        tags: ["resume", "how-to"]
      },
      {
        id: "multiple-resumes",
        question: "Can I create multiple versions of my resume?",
        answer: "Absolutely! You can create and store up to 3 different resume versions, allowing you to customize your application for different job types or industries. This flexibility helps you tailor your story to each opportunity while keeping all your versions organized in one place. Many successful job seekers customize their resume for different roles, and this is a smart strategy.",
        tags: ["resume", "customization"]
      },
      {
        id: "ai-resume-help",
        question: "Can my AI coach help me improve my resume?",
        answer: "Yes! Our AI coach is designed to provide feedback on your resume to help make it stronger and more competitive. The AI can suggest improvements to your wording, help you highlight key accomplishments, recommend stronger action verbs, and ensure your resume is optimized for both human recruiters and applicant tracking systems. Think of it as having a professional resume reviewer available 24/7.",
        tags: ["resume", "ai-coach"]
      },
      {
        id: "job-tracker-features",
        question: "What job application tracking features are available?",
        answer: "The Job Tracker uses a visual stoplight system (Green/Yellow/Red status) to help you monitor every application at a glance. You can track job details, application dates, follow-up dates, interview progress, and notes—all organized in a clean, easy-to-use dashboard. This keeps you accountable and helps you spot patterns in your job search.",
        tags: ["job-tracker", "features"]
      },
      {
        id: "job-tracker-how-works",
        question: "How does the job tracker work?",
        answer: "The Job Tracker is your personal command center for managing your entire job search. As you find positions on our job board or elsewhere, you can add them to your tracker and organize them by status: applied, interviewing, rejected, or bookmarked for later. You can add notes about each application, set reminders to follow up, track important deadlines, and monitor your progress over time. This keeps everything organized in one place.",
        tags: ["job-tracker", "how-to"]
      },
      {
        id: "track-job-info",
        question: "What information can I track for each job?",
        answer: "For each job in your tracker, you can record company name, position title, application date, application status, salary range, job description, contact information for hiring managers, interview dates, notes about the company or role, and follow-up reminders. You can also attach relevant documents like email confirmations or interview prep notes. This comprehensive tracking helps you remember important details.",
        tags: ["job-tracker", "features"]
      },
      {
        id: "when-follow-up",
        question: "How do I know when to follow up on applications?",
        answer: "A great follow-up strategy is to reach out 1-2 weeks after applying if you haven't heard back, and then again after 2-3 weeks. Use your Job Tracker to set reminders for these dates so you don't forget. When you follow up, reference the specific position and the date you applied, express continued interest, and briefly highlight why you're a strong fit.",
        tags: ["job-tracker", "tips"]
      },
      {
        id: "interview-prep-features",
        question: "How does the Interview Prep feature work?",
        answer: "We provide video workshops organized by topic—from answering common questions like 'Tell me about yourself' to industry-specific preparation. These expert-led sessions teach you practical strategies, show you real examples, and build your confidence before the big moment. You can watch at your own pace and revisit sessions as needed.",
        tags: ["interview-prep", "features"]
      },
      {
        id: "prepare-interviews",
        question: "How do I prepare for interviews with Career Forward?",
        answer: "We offer comprehensive interview preparation tools to help you walk into every interview with confidence. Start by exploring our interview prep resources, which include common interview questions, behavioral interview strategies, industry-specific tips, and best practices for different interview formats. You can practice answering questions using our interactive tools, get feedback from your AI coach, and review suggested answers.",
        tags: ["interview-prep", "how-to"]
      },
      {
        id: "specific-interview-types",
        question: "Can I practice specific types of interviews?",
        answer: "Yes! Different industries and positions require different interview approaches. Our interview prep covers phone/video interviews, in-person interviews, behavioral interviews (the STAR method), technical interviews, panel interviews, and one-on-one interviews. You can select the format relevant to your target roles and get customized practice and guidance.",
        tags: ["interview-prep", "types"]
      },
      {
        id: "interview-nervous",
        question: "What if I'm nervous about interviewing?",
        answer: "It's completely normal to feel nervous about interviews—most people do! The good news is that preparation and practice make a huge difference in building confidence. Use our interview prep tools to practice until answering questions feels natural. Our AI coach can provide supportive feedback and tips to help you manage interview anxiety. Remember, the interviewer wants you to succeed too.",
        tags: ["interview-prep", "support"]
      },
      {
        id: "ai-coach-overview",
        question: "What is the AI coach and how does it help?",
        answer: "Your AI coach is an intelligent, always-available career advisor tailored to help you succeed at every stage of your job search. The AI coach can review your resume and provide improvement suggestions, help you practice answering interview questions, give feedback on your cover letters, suggest relevant skills to develop, recommend jobs based on your profile, answer career-related questions, and provide encouragement and guidance. Unlike a human coach with limited availability, your AI coach is here 24/7.",
        tags: ["ai-coach", "features"]
      },
      {
        id: "career-assessments-overview",
        question: "What are the Career Assessments and how do they help me?",
        answer: "Career assessments guide you through external assessment recommendations that help you understand your strengths, interests, and career fit. These tools provide clarity on which career paths align with who you are, helping you make informed decisions about where to focus your job search and which roles to pursue.",
        tags: ["assessments", "features"]
      },
      {
        id: "assessments-help-find-job",
        question: "How will career assessments help me find the right job?",
        answer: "Career assessments provide data about yourself that helps you make smarter job choices. By understanding your strengths, you can focus your search on positions that leverage what you're naturally good at. By knowing your interests and values, you can target companies and roles with cultures and missions that align with what matters to you.",
        tags: ["assessments", "benefits"]
      },
      {
        id: "job-types-listed",
        question: "What types of jobs are listed on Career Forward?",
        answer: "Career Forward aggregates job listings across many industries, companies, and job levels. You'll find opportunities in virtually every field—from entry-level positions for those just starting their careers to executive roles for experienced professionals. Our job board includes positions in tech, healthcare, finance, education, retail, manufacturing, hospitality, nonprofit, government, and many other sectors.",
        tags: ["job-board", "features"]
      },
      {
        id: "search-jobs",
        question: "How do I search for jobs on Career Forward?",
        answer: "Our job board features powerful search tools that make finding relevant positions simple. Use the search bar to enter keywords (job title, company name, or skill), then refine your results using filters like location, salary range, job type (full-time, part-time, contract), experience level, and industry. You can also set up job alerts so you're notified when new positions matching your criteria become available.",
        tags: ["job-board", "how-to"]
      },
      {
        id: "entry-level-positions",
        question: "What if I want to focus on entry-level positions?",
        answer: "Career Forward is fantastic for entry-level job seekers! Our platform is designed with you in mind, offering tools that help you stand out without extensive experience. Use our resume builder to highlight your skills, education, and any relevant projects or volunteer work. Our career assessments can help you identify roles where you'll excel. Filter the job board for 'entry-level' or 'recent graduate' positions.",
        tags: ["job-board", "entry-level"]
      },
      {
        id: "connect-human-coach",
        question: "Can I connect with a real human coach?",
        answer: "Yes! While our AI coach is available 24/7 and provides immediate support, we understand that sometimes you want to talk with a real person. Career Forward connects you with professional workforce coaches who can provide personalized guidance, accountability, and human support. You can schedule one-on-one coaching sessions where a real coach can help you navigate specific challenges.",
        tags: ["coaching", "human-support"]
      },
      {
        id: "schedule-coach-session",
        question: "How do I schedule a session with a workforce coach?",
        answer: "Scheduling with a workforce coach is easy—just navigate to the 'Coaching' or 'Connect with a Coach' section in your dashboard and view available coaches and appointment times. You can see coach profiles, specialties, and availability to find someone who's a great fit for your needs. Once you select a coach and time, you'll receive confirmation details.",
        tags: ["coaching", "how-to"]
      },
      {
        id: "invite-coach",
        question: "Can I invite my career coach to view my progress?",
        answer: "Yes! You can invite your coach to connect with you on Career Forward. Once connected, they'll have read-only access to your progress, resume, and job tracking information. This creates a collaborative space where you and your coach can work together toward your career goals.",
        tags: ["coaching", "collaboration"]
      },
      {
        id: "use-while-employed",
        question: "Can I use Career Forward if I'm currently employed?",
        answer: "Yes! Career Forward welcomes job seekers at all career stages, whether you're actively looking to transition to a new role, exploring opportunities while employed, or considering a career change. Many employed professionals use our platform to improve their resume, practice interviewing skills, or stay prepared for future opportunities.",
        tags: ["eligibility"]
      },
      {
        id: "how-long-find-job",
        question: "How long does it take to find a job?",
        answer: "Job search timelines vary widely depending on your field, experience level, location, job market conditions, and how actively you're searching. Some people find positions within a few weeks, while others take several months—both are completely normal. What matters is that you're taking consistent, strategic action. Use Career Forward to apply regularly, prepare thoroughly, and track your progress.",
        tags: ["expectations", "timeline"]
      },
      {
        id: "job-search-not-going-well",
        question: "What should I do if my job search isn't going well?",
        answer: "If your search seems stalled, that's a great opportunity to get strategic support. Start by having a conversation with your AI coach or workforce coach about what might be happening—perhaps your resume needs strengthening, your job search strategy should be adjusted, or you need interview preparation. Take our career assessments to identify skills you could develop or different roles to consider.",
        tags: ["troubleshooting", "support"]
      },
      {
        id: "long-term-career-development",
        question: "How can I use Career Forward for long-term career development?",
        answer: "Career Forward is designed to support your entire career journey, not just your current job search. Use career assessments regularly to track your growth and identify future development areas. Build strong relationships with coaches who can help you with long-term career planning. Continuously develop your skills and update your resume as you grow professionally. Think of it as your long-term career partner.",
        tags: ["career-development", "long-term"]
      },
      {
        id: "mobile-access",
        question: "Can I use Career Forward on my phone?",
        answer: "Yes! Career Forward is mobile-friendly, so you can access the platform from your smartphone or tablet while on the go. This means you can update your job tracker while commuting, practice interview questions during lunch, search for jobs anytime you see an opportunity, and stay connected with your coaches wherever you are.",
        tags: ["mobile", "accessibility"]
      },
      {
        id: "mobile-app",
        question: "Will there be a mobile app for Career Forward?",
        answer: "Yes! A mobile app is coming soon after our Q3 2026 launch. This will allow you to access your profile, track applications, watch interview prep videos, and communicate with your coach on the go. We'll announce availability dates as we get closer to release.",
        tags: ["mobile", "roadmap"]
      }
    ]
  },
  {
    id: "coaches-organizations",
    title: "For Coaches & Organizations",
    description: "Powerful tools for workforce development professionals",
    icon: "users",
    items: [
      {
        id: "how-works-for-orgs",
        question: "How does Career Forward work for organizations and career coaches?",
        answer: "Career Forward provides coaches with powerful client management tools. You can search and connect with clients, view their progress through the career pathway, access their resume and application tracking data (read-only), add private notes, filter your caseload, and generate progress reports—all designed to help you support your clients more effectively.",
        tags: ["overview", "features"]
      },
      {
        id: "coach-subscription-features",
        question: "What features do career coaches get with a paid subscription?",
        answer: "Paid subscriptions include: unlimited client management, real-time progress visibility across all client profiles, read-only access to resumes and job logs, the ability to add private coaching notes, advanced filtering and sorting of your caseload, progress reporting tools, and system alerts when clients need attention. These tools help you manage caseloads efficiently and support better outcomes.",
        tags: ["features", "subscription"]
      },
      {
        id: "onboard-team",
        question: "How do I onboard my team to Career Forward?",
        answer: "Team onboarding is straightforward. First, an administrator creates coach accounts from the Admin Dashboard with their email addresses. Each coach receives an invitation email with setup instructions. Coaches then log in and complete their profile. We recommend setting up 2-3 pilot coaches first to test workflows, then scaling to your full team. Most organizations complete full team setup within 5-7 business days.",
        tags: ["onboarding", "setup"]
      },
      {
        id: "staff-training",
        question: "What training is available for my staff?",
        answer: "We provide comprehensive training including video tutorials, written guides, and live onboarding sessions. Each coach gets access to a dedicated Training Hub with modules covering caseload management, client progress tracking, outcome reporting, and platform features. We also offer quarterly webinars for ongoing professional development. New users can complete core training in 2-3 hours.",
        tags: ["training", "support"]
      },
      {
        id: "customize-branding",
        question: "Can I customize Career Forward for my organization's branding?",
        answer: "Yes. The platform supports organizational customization including your agency logo, primary and secondary colors, and organization name. These settings are configured through the Admin Dashboard under Organization Settings. Clients see your branding on their dashboards, creating a seamless experience aligned with your workforce development program. Custom branding takes effect immediately.",
        tags: ["customization", "branding"]
      },
      {
        id: "manage-permissions",
        question: "How do I manage user permissions and access levels?",
        answer: "The platform supports three role types: Admin (full system access), Coach (client caseload and reporting), and Client (job seeker). Administrators can assign and modify roles through the User Management section of the Admin Dashboard. You can granularly control which coaches see which clients, restrict access to reports, and set data export permissions.",
        tags: ["permissions", "admin"]
      },
      {
        id: "add-clients",
        question: "How do I add clients/job seekers to my caseload?",
        answer: "There are two methods. First, clients can self-register on the platform and send you a connection request through their profile. Second, you can proactively search for clients by email address from your 'Add Client' button on the Coach Dashboard. Once found, send a connection request that the client must accept. This two-way confirmation ensures consent while maintaining data privacy.",
        tags: ["caseload", "clients"]
      },
      {
        id: "multiple-coaches-one-client",
        question: "Can multiple coaches work with the same client?",
        answer: "Yes, multiple coaches can connect with one client simultaneously. This is ideal for co-coaching scenarios or when clients transition between coaches. Each coach maintains separate private notes, and all coaches view the same client progress data in real-time. Clients receive notifications when new coaches connect, maintaining transparency.",
        tags: ["caseload", "collaboration"]
      },
      {
        id: "communicate-with-clients",
        question: "How do I communicate with clients through the platform?",
        answer: "Career Forward includes an in-app messaging system allowing coaches to send direct messages to clients. Messages appear in clients' notification center and can trigger email notifications based on client preferences. Use messaging for quick check-ins, progress updates, and urgent communications. Messages are logged for compliance and accountability.",
        tags: ["messaging", "communication"]
      },
      {
        id: "track-client-progress",
        question: "How do I track client progress effectively?",
        answer: "The Client Detail View provides a comprehensive progress snapshot including current Career Forward stage (with percentage completion), completed assessments, resumes created, and job applications logged. The Activity Timeline shows exactly what actions clients took and when. Use filters to identify clients needing attention—those inactive 7+ days appear in your 'Needs Attention' dashboard.",
        tags: ["tracking", "progress"]
      },
      {
        id: "outcome-tracking",
        question: "How does outcome tracking work?",
        answer: "Career Forward automatically tracks five key outcomes: (1) Stage completion within the Career Forward pathway, (2) Resume creation, (3) Job applications logged, (4) Training video completion, and (5) Assessment participation. These metrics populate automatically as clients use the platform. You don't manually enter data—the system captures actions in real-time.",
        tags: ["outcomes", "tracking", "wioa"]
      },
      {
        id: "reports-for-funders",
        question: "What reports can I generate for funders?",
        answer: "Career Forward generates three primary report types. Individual client reports show progression through the Career Forward pathway, skills developed, job search activity, and outcomes achieved. Caseload overview reports aggregate statistics across all clients, showing participation rates, completion metrics, and demographic breakdowns. Custom date-range reports allow you to report on specific funding periods.",
        tags: ["reporting", "compliance"]
      },
      {
        id: "data-export",
        question: "What data can I export?",
        answer: "You can export comprehensive datasets including caseload demographics, progress metrics, outcome summaries, and detailed activity logs. Exports are available in CSV format for analysis in Excel or your data warehouse. You maintain full control—export only data you need for specific purposes. All data exports are timestamped and logged for compliance.",
        tags: ["export", "data"]
      },
      {
        id: "measure-roi",
        question: "How do I measure ROI (Return on Investment)?",
        answer: "Career Forward provides measurable ROI metrics including: (1) Time saved on administrative tasks (estimated 4-6 hours/week per coach), (2) Increased client engagement through real-time tracking, (3) Reduced time from intake to job application logging (typical 40% reduction), and (4) Improved outcome documentation. Most organizations see positive ROI within 90 days.",
        tags: ["roi", "metrics"]
      },
      {
        id: "system-integration",
        question: "How can Career Forward integrate with our existing systems?",
        answer: "Career Forward is built with integration in mind. We provide comprehensive API documentation and support data import/export capabilities. Our team is ready to discuss custom integration solutions for larger organizations with specific technical requirements. Contact our sales team to learn about integration options.",
        tags: ["integration", "api"]
      },
      {
        id: "available-integrations",
        question: "What integrations are available?",
        answer: "Career Forward integrates with WorkSourceWA job board for real-time job listings, the Affinda resume parser for automatic data extraction from uploaded resumes, and Resend for secure email delivery. These integrations work seamlessly—clients see no disruption while your team gets reliable, connected data flows.",
        tags: ["integration", "tools"]
      },
      {
        id: "special-populations",
        question: "Can the platform handle special populations (disabilities, ESL, barriers to employment)?",
        answer: "Yes. The platform is WCAG AA accessible for users with visual, auditory, and mobility disabilities. Multi-language support includes English, Spanish, Russian, and Ukrainian. The flexible pathway allows clients to progress at their own pace. Coaches can add extensive private notes documenting barriers and accommodations.",
        tags: ["accessibility", "special-populations"]
      },
      {
        id: "client-detail-view",
        question: "How does the Client Detail View help me manage my caseload?",
        answer: "The Client Detail View consolidates all essential client information in one location. Tabs show Overview (progress snapshot), Resumes (preview and download PDFs), Job Tracker (application history), Notes (your private coaching notes), and Activity (complete action timeline). This centralized view reduces time searching for information.",
        tags: ["caseload", "management"]
      },
      {
        id: "identify-clients-needing-attention",
        question: "How can I identify clients needing attention?",
        answer: "The Dashboard prominently displays 'Clients Needing Attention'—automatically flagged clients inactive 7+ days, 14+ days, or per your custom threshold. Filter your client list by status (Active, Inactive, At-Risk) to prioritize outreach. Yellow/Red status indicators visually identify at-risk clients.",
        tags: ["alerts", "tracking"]
      },
      {
        id: "automated-alerts",
        question: "Can I set automated reminders or alerts?",
        answer: "Yes. The notification system alerts you when: (1) A new client sends a connection request, (2) A client completes a Career Forward stage milestone, (3) A client reaches inactivity thresholds, (4) New job matches appear for a client's skills. You can customize alert preferences by notification type.",
        tags: ["alerts", "notifications"]
      },
      {
        id: "outcome-metrics",
        question: "What metrics does Career Forward track for outcome reporting?",
        answer: "The platform tracks: completion of Career Forward stages 1-5, resume creation, job application logging, interview training video viewing, career assessment completion, skills identified and developed, job placement (tracked via application status changes), and client engagement frequency. These directly correspond to WIOA performance metrics.",
        tags: ["metrics", "wioa", "compliance"]
      },
      {
        id: "download-reports",
        question: "How do I download reports for grant submissions?",
        answer: "From the Reports section, select your reporting period, choose Individual Client or Caseload Overview format, and click Generate. The system creates a professional PDF with your organization's branding, key metrics, outcome summaries, and demographic information. Most reports generate in under 30 seconds.",
        tags: ["reporting", "grants"]
      },
      {
        id: "implementation-timeline",
        question: "What's the implementation timeline?",
        answer: "Typical implementation takes 2-4 weeks. Week 1: Admin account setup and organization customization. Week 2: Team training and coach onboarding. Week 3: Pilot launch with 1-2 coaches and 20-30 clients. Week 4: Full rollout and refinement based on pilot feedback. Post-launch support ensures smooth adoption.",
        tags: ["implementation", "timeline"]
      }
    ]
  },
  {
    id: "pricing-billing",
    title: "Pricing & Billing",
    description: "Transparent pricing information and billing details",
    icon: "dollar-sign",
    items: [
      {
        id: "how-much-cost",
        question: "How much does Career Forward cost?",
        answer: "Career Forward is completely free for job seekers. For organizations and coaches, we offer flexible paid plans at $21 per seat per month or $18 per seat per month when billed annually. Annual plans provide 15-20% savings compared to monthly billing.",
        tags: ["pricing", "cost"]
      },
      {
        id: "org-pricing",
        question: "How much does Career Forward cost for organizations?",
        answer: "We offer flexible paid plans for organizations and workforce development centers on a per-seat basis at $21/month or $18/month annually per seat. Organizations can choose between monthly and annual billing options. Annual plans typically offer 15-20% savings compared to monthly billing.",
        tags: ["pricing", "organizations"]
      },
      {
        id: "payment-info-required",
        question: "Do I need to provide my payment information to use Career Forward?",
        answer: "Job seekers do not need to provide any payment information—Career Forward is completely free with no credit card required. Organizations and coaches subscribing to paid plans will need to provide billing information to set up their subscription.",
        tags: ["payment", "billing"]
      },
      {
        id: "hidden-fees",
        question: "Are there any hidden fees or surprise charges?",
        answer: "No. We believe in complete transparency with our pricing. For job seekers, all features are free with no hidden costs. For organizations, we clearly outline what's included in the plan and any additional services. There are no surprise setup fees, hidden monthly charges, or unexpected per-transaction costs.",
        tags: ["pricing", "transparency"]
      },
      {
        id: "org-billing",
        question: "How does billing work for organizations?",
        answer: "Organizations can choose between monthly or annual billing cycles. Billing is based on the number of active seats (users) in your organization. The per-seat rate is fixed at $21/month or $18/month annually—there are no overage charges or unexpected costs as your team grows. We provide itemized invoices at the start of each billing cycle.",
        tags: ["billing", "organizations"]
      },
      {
        id: "demo-trial",
        question: "Can organizations get a demo or trial before committing?",
        answer: "Absolutely. We strongly encourage organizations to experience Career Forward before purchasing. We offer guided demos where our team walks through platform features relevant to your needs. We also provide trial access so your coaches and administrators can explore the platform hands-on. Contact our sales team to schedule a demo—we typically enable trials within 1-2 business days.",
        tags: ["trial", "demo"]
      },
      {
        id: "nonprofit-discounts",
        question: "Do you offer discounts for nonprofits or government agencies?",
        answer: "Yes, we're committed to supporting workforce development across all sectors. Nonprofits and government agencies (including American Job Centers and state workforce boards) qualify for special pricing on organizational plans. Nonprofit and government discounts typically provide 20-30% off standard per-seat pricing.",
        tags: ["discounts", "nonprofit", "government"]
      },
      {
        id: "cancellation-policy",
        question: "What is your cancellation policy?",
        answer: "For month-to-month plans, organizations can cancel their subscription with 30 days' notice. No early termination fees apply. For annual plans, you're committed to the contract term, but if circumstances change, we're willing to discuss options on a case-by-case basis. Upon cancellation, job seekers retain access to their data for 30 days.",
        tags: ["cancellation", "policy"]
      },
      {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer: "We accept all major payment methods including credit cards (Visa, Mastercard, American Express), ACH bank transfers, and invoice-based billing for organizations. For government and nonprofit organizations, we can accommodate purchase orders and net-30/net-60 invoicing terms.",
        tags: ["payment", "methods"]
      },
      {
        id: "monthly-vs-annual",
        question: "Is there a price difference between monthly and annual billing?",
        answer: "Yes. Annual plans provide significant savings compared to month-to-month billing. Organizations that commit to annual billing at $18/month per seat save approximately 15% compared to monthly rates of $21/month per seat. This discount reflects the commitment and allows us to better forecast and plan resources.",
        tags: ["pricing", "billing"]
      },
      {
        id: "adjust-seats",
        question: "What happens if we need more or fewer seats during our billing cycle?",
        answer: "Seat adjustments are straightforward. If you need to add users during your billing cycle, you'll be billed prorated for the additional seats through the end of your current billing period. Reducing seats typically takes effect at the start of your next billing cycle. We provide a simple seat management dashboard where admins can add or remove users anytime.",
        tags: ["billing", "seats"]
      },
      {
        id: "enterprise-plan",
        question: "Can we get a custom enterprise plan?",
        answer: "Yes. For large-scale deployments, specialized implementations, or organizations with unique requirements, we offer custom enterprise arrangements. Enterprise plans may include dedicated support, custom integrations, advanced reporting, and priority feature development. Contact our enterprise sales team to discuss your specific needs.",
        tags: ["enterprise", "custom"]
      },
      {
        id: "support-included",
        question: "What support is included with organizational plans?",
        answer: "All organizational plans include email support during business hours and access to our help documentation. Standard plans typically include response times of 24-48 hours for non-urgent issues. We provide onboarding assistance for new organizations. Premium support options include priority support, phone support, and dedicated implementation specialists.",
        tags: ["support", "plans"]
      },
      {
        id: "volume-discount",
        question: "Is there a volume discount for very large organizations?",
        answer: "Yes. Organizations with 100+ seats may qualify for volume discounts beyond our standard per-seat pricing of $21/month or $18/month annually. The more seats you need, the lower the per-seat cost typically becomes. To discuss volume pricing, please contact our enterprise sales team.",
        tags: ["discounts", "volume"]
      },
      {
        id: "refund-policy",
        question: "Do you offer refunds if we're not satisfied?",
        answer: "We're confident in Career Forward's value, and we back that with our satisfaction guarantee. Organizations that cancel within their first 30 days of a paid plan receive a full refund. We're also happy to work with organizations to address concerns or adjust their implementation.",
        tags: ["refunds", "guarantee"]
      },
      {
        id: "data-after-cancel",
        question: "What happens to our data if we cancel our subscription?",
        answer: "Your data is yours. If you cancel, your organization maintains access to all your job seekers' profiles, resumes, job tracking records, and coaching notes for 30 days. This gives you time to export data in standard formats (CSV, PDF). After 30 days, accounts transition to read-only mode. Job seekers can still access their own accounts.",
        tags: ["data", "cancellation"]
      }
    ]
  },
  {
    id: "features-tools",
    title: "Features & Tools",
    description: "Detailed information about platform capabilities",
    icon: "tool",
    items: [
      {
        id: "resume-file-formats",
        question: "What file formats can I use for resume uploads?",
        answer: "You can upload and work with resumes in PDF, Word (.docx), and text formats. Our resume parser automatically extracts your information to prefill the resume builder, saving you time. You can also export your finished resume as PDF or Word.",
        tags: ["resume", "formats"]
      },
      {
        id: "language-support",
        question: "What languages does Career Forward support?",
        answer: "Career Forward is built with multilingual support in mind. At launch, we'll support English, Spanish, Russian, and Ukrainian. Additional language support is planned for future updates. We're committed to serving diverse populations and making career development accessible to everyone.",
        tags: ["languages", "accessibility"]
      },
      {
        id: "help-center",
        question: "Is there a help center or documentation?",
        answer: "Yes! We have a comprehensive Help Center available at support.careerforward.io with searchable articles covering all platform features. You'll find step-by-step guides for creating resumes, tracking job applications, using the career assessments, and much more. You can also access context-sensitive help directly within the platform.",
        tags: ["support", "documentation"]
      },
      {
        id: "request-feature",
        question: "Can I request a feature?",
        answer: "Absolutely! We value your feedback and ideas. To request a new feature, email support@careerforward.io with 'Feature Request:' in the subject line. Describe the feature you'd like, why it would be helpful, and how you'd use it. We review all feature requests and use them to guide our development roadmap.",
        tags: ["feedback", "features"]
      },
      {
        id: "badge-system",
        question: "How does the Achievement/Badge system work?",
        answer: "Badges automatically unlock when clients meet specific criteria—Profile Pro (100% profile complete), Resume Ready (first resume created), Active Seeker (10+ applications logged), and others. Badges appear on client profiles and in their dashboard, providing motivation and visual progress indicators. This gamification increases engagement.",
        tags: ["gamification", "achievements"]
      },
      {
        id: "export-data",
        question: "Can I export my data if I leave Career Forward?",
        answer: "Yes! You can export your profile data, resumes, and job tracking information at any time. This ensures your career data belongs to you. Simply request an export through your account settings, and we'll provide your information in accessible formats (PDF, CSV, or other formats as available).",
        tags: ["data", "export"]
      },
      {
        id: "local-resources",
        question: "How do I find local resources and support?",
        answer: "The Local Resources Finder is designed to connect you with workforce development services, training programs, job fairs, and support services in your area. Just enter your location, and we'll show you available resources including workforce development centers, training programs, job training opportunities, resume workshops, interview coaching, and financial assistance programs.",
        tags: ["resources", "local"]
      }
    ]
  },
  {
    id: "privacy-security",
    title: "Privacy & Security",
    description: "How we protect your data and maintain your privacy",
    icon: "shield",
    items: [
      {
        id: "data-security",
        question: "How secure is my personal information on Career Forward?",
        answer: "We take security seriously. Career Forward uses industry-standard encryption for data in transit and at rest, secure authentication with JWT tokens, role-based access controls, and comprehensive audit logging. Your personal information is protected under strict security protocols, and we comply with relevant privacy regulations including GDPR and CCPA.",
        tags: ["security", "privacy"]
      },
      {
        id: "data-protection",
        question: "How is my data protected?",
        answer: "We use industry-leading security measures to protect your data across multiple layers. All data transmitted between your device and our servers is encrypted using HTTPS (SSL/TLS protocol). Our database infrastructure employs encryption at rest, meaning sensitive personally identifiable information (PII) fields are encrypted when stored. We conduct regular security audits and implement strict input validation.",
        tags: ["security", "protection"]
      },
      {
        id: "data-encrypted",
        question: "Is my data encrypted?",
        answer: "Yes, absolutely. Your data is protected by multiple encryption standards. All communications between you and Career Forward use HTTPS encryption, which prevents anyone from intercepting your information while it travels over the internet. Additionally, sensitive personal information stored in our database is encrypted at rest, adding an extra layer of security.",
        tags: ["encryption", "security"]
      },
      {
        id: "data-storage",
        question: "Where is data stored?",
        answer: "Career Forward's servers and database are hosted on secure, enterprise-grade infrastructure. We use Vercel for our web application hosting and Vercel Postgres (or Supabase) for database hosting, both of which meet enterprise security and compliance standards. All facilities maintain continuous physical security, monitoring, and backups.",
        tags: ["infrastructure", "storage"]
      },
      {
        id: "who-sees-info",
        question: "Who can see my information?",
        answer: "Your information is strictly controlled and only accessible to authorized parties. If you connect with a career coach, that coach can view your profile information, resumes, job applications summary, and progress in read-only format—they cannot edit your data. Your employer, other job seekers, or unconnected third parties never have access to your personal information.",
        tags: ["privacy", "access"]
      },
      {
        id: "resume-shared-employers",
        question: "Is my resume shared with employers without consent?",
        answer: "No, your resume is never shared with employers without your explicit consent. You maintain complete control over your resume and when it's submitted to employers. When you log a job application through Career Forward, we don't automatically send anything to the employer—you decide when to apply and through which platform. We never sell, share, or distribute your resume data without your direct authorization.",
        tags: ["privacy", "resume"]
      },
      {
        id: "org-access-data",
        question: "Can organizations access my job seeker data?",
        answer: "Organizations do not have any access to your personal data through Career Forward. Your information is never shared with employers, recruitment agencies, or third-party organizations unless you explicitly choose to apply for a position. Career Forward is designed exclusively for your benefit as a job seeker—employers cannot search for, view, or access candidate information through our platform.",
        tags: ["privacy", "organizations"]
      },
      {
        id: "delete-account",
        question: "Can I delete my account and data?",
        answer: "Yes, you have complete control over your account and data. You can delete your account at any time through your settings page without providing a reason or waiting period. When you request account deletion, all your personal data is immediately removed from active systems. We maintain certain records only for legal compliance purposes for up to 12 months, but these are anonymized.",
        tags: ["privacy", "deletion"]
      },
      {
        id: "inactive-account",
        question: "What happens to my data if my account becomes inactive?",
        answer: "We respect inactive accounts with a compassionate approach. If your account shows no activity for 30 days, we send you an email reminder. At 5 months of inactivity, we send a final warning email. If your account remains inactive for 6 months, we archive your account and securely store your resumes, which are emailed to you. After 12 months from archival, anonymized data is deleted.",
        tags: ["retention", "inactive"]
      },
      {
        id: "retention-policy",
        question: "What is your data retention policy?",
        answer: "For active accounts, your data is retained indefinitely as long as your account remains active. For inactive accounts (6+ months), your account data is archived but resumes are preserved and sent to your email. Deleted accounts have their data permanently removed after 12 months, with the exception of anonymized audit logs kept for compliance purposes.",
        tags: ["retention", "policy"]
      },
      {
        id: "gdpr-ccpa-compliance",
        question: "Does Career Forward comply with GDPR and CCPA?",
        answer: "Yes, Career Forward is committed to compliance with both GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act). Under GDPR, EU residents have the right to access, correct, and delete their personal data, as well as the right to data portability. Under CCPA, California residents have the right to know what personal data we collect, delete personal information, and opt-out of data sales (which we don't do).",
        tags: ["compliance", "gdpr", "ccpa"]
      },
      {
        id: "third-party-integrations",
        question: "How does Career Forward handle third-party integrations?",
        answer: "Career Forward uses trusted, industry-standard third-party services to enhance your experience, but we maintain strict data governance. We integrate with Affinda for resume parsing, Resend for secure email delivery, and WorkSourceWA for job listings. These integrations only receive the minimum data necessary to provide their service. All third-party services are contractually bound to protect your data.",
        tags: ["integrations", "third-party"]
      },
      {
        id: "data-shared-third-parties",
        question: "Is my data shared with third parties?",
        answer: "Your data is not sold or shared with third parties for marketing, advertising, or commercial purposes. We only share data with essential service providers (like Affinda for resume parsing and Resend for emails) strictly to deliver the services you use. These providers are contractually obligated to use your data only for the specified purpose. We never sell your data under any circumstances.",
        tags: ["privacy", "third-party"]
      },
      {
        id: "login-credentials-protection",
        question: "How are my login credentials protected?",
        answer: "Your password is protected by industry-standard bcrypt hashing with a high security cost factor, meaning your actual password is never stored on our servers—only a mathematical hash of it exists. We enforce strong password requirements (minimum 12 characters, uppercase, lowercase, numbers, and symbols). We also implement rate limiting on login attempts to prevent brute-force attacks.",
        tags: ["security", "authentication"]
      },
      {
        id: "session-security",
        question: "What about session security and the 'Remember Me' option?",
        answer: "Career Forward provides two session options for your convenience and security. Standard sessions expire after 24 hours. The 'Remember Me' option extends your session to 30 days on trusted devices. Both options use HTTP-only secure session cookies that cannot be accessed by malicious scripts. Your session is immediately invalidated if you change your password.",
        tags: ["security", "sessions"]
      },
      {
        id: "data-access-monitoring",
        question: "How is my data access monitored?",
        answer: "Career Forward maintains comprehensive audit logs of all data access and modifications. We track every login, profile change, resume creation/edit, job application update, and admin action with timestamps, user information, and device details. Career coaches' access to your information is logged. You can access a summary of recent activity in your account's Activity Timeline.",
        tags: ["monitoring", "audit"]
      },
      {
        id: "data-collected",
        question: "What personal data does Career Forward collect?",
        answer: "We collect only the information necessary to help you advance your career. This includes your contact information (email, phone number), profile details (name, gender, years in industry, career goals), resume content (education, work experience, skills), job application records, career assessments and progress, video viewing history, and cover letters you create. You have control over this collection.",
        tags: ["privacy", "data-collection"]
      },
      {
        id: "security-breach",
        question: "What happens if there's a security breach?",
        answer: "While we maintain industry-leading security measures, we recognize that no system is 100% immune. If a security incident occurs, Career Forward is committed to transparency and rapid response. We will notify affected users within 24 hours of confirming a breach, explaining what information was potentially compromised and what steps we're taking. Our security incident response team is on standby 24/7.",
        tags: ["security", "incident-response"]
      },
      {
        id: "request-data",
        question: "How do I request my data or exercise my privacy rights?",
        answer: "Exercising your privacy rights is straightforward and free. Within Career Forward, you can download a complete copy of your personal data at any time through your Account Settings under 'Privacy & Data.' For GDPR/CCPA requests or complex data inquiries, contact our privacy team at privacy@careerforward.com. We'll respond within 30 days.",
        tags: ["privacy", "rights"]
      },
      {
        id: "data-privacy-responsibility",
        question: "Who is responsible for my data privacy?",
        answer: "Career Forward's Data Protection Officer (DPO) and Privacy team are responsible for ensuring compliance with all privacy regulations and maintaining the highest data protection standards. Our legal team reviews all data practices to ensure compliance with GDPR, CCPA, and other applicable laws. You can contact our privacy team at privacy@careerforward.com with any concerns.",
        tags: ["privacy", "responsibility"]
      },
      {
        id: "keep-account-secure",
        question: "What can I do to keep my account secure?",
        answer: "Create a strong, unique password that you don't use elsewhere. Enable account notifications to immediately learn about suspicious activity. Use secure, updated devices and avoid public Wi-Fi when accessing sensitive information. Never share your password with anyone, and log out after each session if using a shared device. If you suspect unauthorized access, change your password immediately.",
        tags: ["security", "best-practices"]
      },
      {
        id: "shared-devices",
        question: "Is my information safe on shared or public devices?",
        answer: "Career Forward is designed to work on shared devices, but extra caution is recommended. Always use a private browsing window (incognito mode) on shared devices. Do NOT enable the 'Remember Me' option on shared devices. Always manually log out after each session, and clear your browser cache and cookies.",
        tags: ["security", "shared-devices"]
      }
    ]
  },
  {
    id: "technical-support",
    title: "Technical Support",
    description: "Get help with technical issues and troubleshooting",
    icon: "help-circle",
    items: [
      {
        id: "contact-support",
        question: "How do I contact support?",
        answer: "We're here to help! You can reach our support team at support@careerforward.io. Please include as much detail as possible about your issue, including what you were trying to do, any error messages you received, and which browser you're using. We typically respond to support emails within 1-2 business days. For urgent issues, include 'URGENT' in your subject line.",
        tags: ["support", "contact"]
      },
      {
        id: "support-hours",
        question: "What are support hours?",
        answer: "Our support team is available Monday through Friday, 9:00 AM to 5:00 PM Pacific Time (PT). We do not provide support on weekends or federal holidays. For after-hours issues, please send an email to support@careerforward.io and we'll get back to you as soon as possible the next business day. You can also check our Help Center for self-service resources available 24/7.",
        tags: ["support", "hours"]
      },
      {
        id: "reset-password",
        question: "How do I reset my password?",
        answer: "To reset your password, go to the login page and click the 'Forgot password?' link. Enter the email address associated with your Career Forward account, and we'll send you an email with a secure password reset link. Click the link in the email and follow the prompts to create a new password. For security reasons, reset links expire after 24 hours.",
        tags: ["password", "account"]
      },
      {
        id: "forgot-email",
        question: "What if I forgot my email address?",
        answer: "If you can't remember the email address you used to create your account, contact our support team at support@careerforward.io. Please provide any information you remember about your account, such as your full name or phone number, and we'll help you locate your account or create a new one.",
        tags: ["email", "account"]
      },
      {
        id: "report-bug",
        question: "How do I report a bug?",
        answer: "We appreciate you reporting bugs! Please email support@careerforward.io with the subject line 'Bug Report:' and include the following information: what you were trying to do, what happened instead, any error messages displayed, your browser and operating system, and steps to reproduce the issue. Screenshots or videos are helpful too. We prioritize bug reports.",
        tags: ["bugs", "troubleshooting"]
      },
      {
        id: "site-slow",
        question: "Why is the site running slowly?",
        answer: "If you're experiencing slow performance, try these troubleshooting steps: first, clear your browser cache and cookies, then close and reopen your browser. If the issue persists, try a different browser. Check your internet connection by testing other websites, and restart your router if needed. We recommend using Chrome, Firefox, Safari, or Edge for the best experience.",
        tags: ["performance", "troubleshooting"]
      },
      {
        id: "supported-browsers",
        question: "What browsers are supported?",
        answer: "Career Forward works best on modern browsers: Chrome (version 90+), Firefox (version 88+), Safari (version 14+), and Edge (version 90+). We also support mobile browsers on iOS (Safari) and Android (Chrome). For the best experience, we recommend using the latest version of your preferred browser and enabling JavaScript.",
        tags: ["browsers", "compatibility"]
      },
      {
        id: "need-help-using",
        question: "What if I need help using the platform?",
        answer: "We're here to help! If you encounter technical issues or have questions about how to use specific features, several resources are available. First, check our in-app help documentation and tutorials for step-by-step guides. If you need more personalized assistance, you can reach out to our support team through the 'Help' or 'Contact Us' section in the platform.",
        tags: ["help", "support"]
      }
    ]
  }
];

// Helper functions for working with FAQ data

/**
 * Get all FAQ items across all categories
 */
export const getAllFAQItems = (): FAQItem[] => {
  return faqData.flatMap(category => category.items);
};

/**
 * Search FAQ items by keyword
 */
export const searchFAQs = (query: string): FAQItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllFAQItems().filter(
    item =>
      item.question.toLowerCase().includes(lowercaseQuery) ||
      item.answer.toLowerCase().includes(lowercaseQuery) ||
      item.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

/**
 * Get FAQ items by tag
 */
export const getFAQsByTag = (tag: string): FAQItem[] => {
  return getAllFAQItems().filter(item => item.tags?.includes(tag));
};

/**
 * Get FAQ category by ID
 */
export const getCategoryById = (categoryId: string): FAQCategory | undefined => {
  return faqData.find(category => category.id === categoryId);
};

/**
 * Get FAQ item by ID
 */
export const getFAQById = (faqId: string): FAQItem | undefined => {
  return getAllFAQItems().find(item => item.id === faqId);
};
