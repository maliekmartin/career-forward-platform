# Career Forward Platform - Project Specification

## Executive Summary

Career Forward is a comprehensive workforce development platform designed to guide job seekers through the employment journey. The platform serves as a tool for individuals working with career coaches in American Job Center workforce development offices, providing a structured pathway from career assessment through job placement.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technical Stack](#technical-stack)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Core Features](#core-features)
5. [User Journey & Flows](#user-journey--flows)
6. [Screen Specifications](#screen-specifications)
7. [Database Schema](#database-schema)
8. [API Integrations](#api-integrations)
9. [Branding & Design System](#branding--design-system)
10. [Accessibility & Internationalization](#accessibility--internationalization)
11. [Security & Compliance](#security--compliance)
12. [Future Scalability](#future-scalability)

---

## Project Overview

### Mission Statement
Career Forward provides job seekers with a guided pathway that starts with profile creation, moves through career assessments, resume building, interview preparation, and culminates in job tracking - all while working alongside a career coach.

### Key Objectives
- Streamline the job search process for workforce development clients
- Provide professional-grade resume building tools
- Enable career coaches to effectively support their clients
- Track job search progress and outcomes
- Support diverse populations with multi-language accessibility

---

## Technical Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **UI Library:** shadcn/ui
- **Styling:** Tailwind CSS
- **State Management:** React Context + React Query
- **Form Handling:** React Hook Form + Zod validation

### Backend
- **Runtime:** Node.js (via Next.js API Routes)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js (Email/Password)
- **File Storage:** Vercel Blob or AWS S3

### External Services
- **Resume Parsing:** Affinda API
- **Email:** Resend
- **Job Board Data:** WorkSourceWA API/Feed
- **PDF Generation:** React-PDF or Puppeteer
- **Document Export:** docx library for Word files

### Deployment
- **Platform:** Vercel
- **Database Hosting:** Vercel Postgres or Supabase
- **CDN:** Vercel Edge Network

### Desktop/Web Strategy
- **Primary:** Desktop-first responsive web application
- **Design:** Optimized for desktop browsers (1280px+ screens)
- **Responsive:** Gracefully adapts to tablet and mobile browsers
- **Future:** Native mobile app (iOS/Android) as potential Phase 2 expansion

### Budget Considerations
- Target: <$50/month for external services
- Leverage free tiers where possible (Vercel, Resend, etc.)
- Affinda API: Pay-per-document model

---

## User Roles & Permissions

### 1. Job Seeker (Client)
- Create and manage their profile
- Build and store up to 3 resumes
- Create job-matched cover letters
- Track job applications
- Access training resources and assessments
- View their progress through Career Forward pathway

### 2. Career Coach
- Search and add clients to their caseload
- View client profiles, resumes, and job logs (read-only)
- Add private notes to client profiles
- Filter and sort client list
- Generate client progress reports
- Receive alerts when clients need attention

### 3. Administrator
- Manage all users (clients and coaches)
- Add/edit/remove content (videos, resources, templates)
- Configure workforce center branding
- View platform analytics
- Manage resume templates
- Access full audit logs

---

## Core Features

### 1. User Authentication & Profile

#### Registration
- Email/password authentication
- Strong password requirements:
  - Minimum 12 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special symbol
- Email verification required

#### Profile Fields
| Field | Type | Required |
|-------|------|----------|
| First Name | Text | Yes |
| Last Name | Text | Yes |
| Email | Email | Yes |
| Phone Number | Phone | Yes |
| Gender | Select | Yes |
| Years in Industry | Number | Yes |
| Career Goal | Select | Yes |

**Career Goal Options:**
- Stay in same industry
- Transition to new industry
- Seek certification/education

#### Resume Parsing
- Upload existing resume (PDF, DOCX)
- Affinda API extracts structured data
- Auto-populates profile fields
- User can review and edit extracted data

#### Session Management
- "Remember me" option: 30 days on trusted devices
- Standard session: 24 hours
- Secure session tokens with HTTP-only cookies

---

### 2. Career Forward Pathway (Vertical Timeline)

#### Stage 1: Research & Discovery
- Set career goals
- Complete guided career assessments
- Explore labor market information
- Access digital literacy resources

#### Stage 2: Prepare for Success
- Build professional resume
- Create job-matched cover letters
- Watch interview preparation videos
- Develop personal presentation skills

#### Stage 3: Start the Job Search
- Access WorkSourceWA job board
- Learn strategic job search techniques
- Apply to positions (with quick logging)
- Network on LinkedIn

#### Stage 4: Ace the Interview
- Watch interviewing workshops
- Practice mock interview techniques
- Learn about professional attire
- Prepare thank-you communications

#### Stage 5: Stay Connected
- Share success stories
- Access ongoing resources
- Maintain profile for future needs

#### Navigation Behavior
- All sections accessible from start (fully flexible)
- Visual indicators encourage linear progression
- Progress tracked per section
- Badges awarded for section completion

---

### 3. Resume Builder

#### Template System
- 10+ professional templates at launch
- Categories: Chronological, Functional, Combination
- Industry variations available
- Clean, ATS-friendly designs

#### Editor Experience
- **Layout:** Side-by-side (form left, preview right)
- **Real-time preview:** Updates as user types
- **Section management:** Add, remove, reorder sections

#### Standard Sections
- Contact Information
- Professional Summary
- Work Experience
- Education
- Skills

#### Optional Sections
- Certifications
- Volunteer Experience
- Projects
- Awards & Achievements
- Languages
- Custom sections (user-defined)

#### Section Features
- Rich text editing within sections (bold, italic, bullets)
- Drag-and-drop reordering
- Duplicate entries (for multiple jobs, schools, etc.)
- Date range pickers

#### Storage Limits
- Maximum 3 resumes per user
- Clear indication of slots used/available
- Option to delete existing to create new

#### Export Formats
- **PDF:** Clean, print-ready format
- **DOCX:** Editable Word document
- Both formats maintain formatting fidelity

---

### 4. Cover Letter Builder

#### Job-Matched Functionality
- User pastes job posting URL or description
- System extracts key requirements
- Suggests relevant content from user's profile
- Pre-fills template with matched skills/experience

#### Editor Features
- Template selection
- Rich text editing
- Real-time preview
- Export to PDF/DOCX

#### Storage
- Saved with associated resume
- Can be edited and reused

---

### 5. Job Tracker

#### Application Entry Fields
| Field | Type | Description |
|-------|------|-------------|
| Company Name | Text | Name of employer |
| Industry | Select | Industry category |
| Platform | Select | Where applied (Indeed, LinkedIn, Company site, etc.) |
| Date Applied | Date | When application submitted |
| Alignment Score | Slider (0-10) | How well job aligns with user's goals |
| Notes | Text | Additional details |

#### Status System (Stoplight)
- **Green:** Application received, next steps assigned
- **Yellow:** Awaiting review/response
- **Red:** Rejected (auto-archives)

#### Features
- Filter by status, date, industry
- Search by company name
- Sort by date, alignment score, status
- Archived view for rejected applications
- Quick-add from job board

---

### 6. Interview Training

#### Content Organization (By Topic)
1. Introduction to Interviewing
2. Behavioral Interview Questions
3. The STAR Method
4. Common Interview Questions
5. Salary Negotiation
6. Virtual Interview Tips
7. Follow-up & Thank You Notes

#### Video Integration
- YouTube video embeds
- Curated playlists per topic
- Progress tracking (watched/not watched)
- Bookmarking capability

#### Resource Downloads
- Tip sheets (PDF)
- Checklists
- Sample questions

---

### 7. Career Assessments

#### Guided Selection
Users answer brief questions to determine recommended assessments:
- "What do you want to learn about yourself?"
  - My interests → Interest assessments
  - My skills → Skills assessments
  - My work style → Personality assessments
  - Career matches → Career exploration tools

#### External Assessment Links
| Assessment | Provider | Purpose |
|------------|----------|---------|
| Interest Profiler | O*NET | Career interests |
| Skills Matcher | CareerOneStop | Skills inventory |
| Work Values | O*NET | Work priorities |
| Career Explorer | Career Bridge | WA-specific pathways |

#### Progress Tracking
- Mark assessments as completed
- Optional: Save assessment results/notes
- Recommended next steps based on completion

---

### 8. Job Board Integration (WorkSourceWA)

#### Display
- Simple searchable list
- Fields: Job Title, Company, Location, Posted Date
- Click to view details

#### Search & Filter
- Keyword search
- Location filter
- Industry filter
- Date posted filter

#### Data Sync
- Automatic updates every 1-2 hours
- Background job fetches latest listings
- Cache for performance

#### Quick Log Feature
When user clicks "Apply":
1. Modal appears with pre-filled job info
2. User confirms or edits details
3. Job added to their tracker as "Yellow" status
4. External link opens in new tab

---

### 9. Coach Portal

#### Client Management
- **Add clients:** Search by email, send connection request
- **Client list:** Filterable, sortable table view
- **Filters:** Status, last active, completion stage, alphabetical

#### Client View
- Profile summary
- Current Career Forward stage
- Resume previews (view, not edit)
- Job tracker summary
- Activity timeline

#### Coach Notes
- Private notes per client (not visible to client)
- Timestamped entries
- Rich text support

#### Reports
- Individual client progress reports
- Caseload overview statistics
- Export to PDF

#### Alerts & Notifications
- New client connections
- Client milestone completions
- Inactivity warnings (configurable threshold)

---

### 10. Achievement System

#### Badge Categories
- **Journey Badges:** Stage completions
- **Activity Badges:** Actions taken
- **Streak Badges:** Consistent engagement

#### Example Badges
| Badge | Criteria |
|-------|----------|
| Profile Pro | Complete profile 100% |
| Resume Ready | Create first resume |
| Assessment Ace | Complete 3+ assessments |
| Active Seeker | Log 10+ applications |
| Interview Prep | Watch all interview videos |
| Weekly Warrior | Log in 7 days in a row |

#### Display
- Badge showcase on profile
- Progress indicators for in-progress badges
- Celebration animations on unlock

---

### 11. Notification System

#### Email Notifications
| Trigger | Recipient | Content |
|---------|-----------|---------|
| Account created | User | Welcome email with getting started guide |
| Password reset | User | Reset link |
| Inactivity (30 days) | User | Reminder to continue job search |
| Inactivity (5 months) | User | Account termination warning |
| Account termination | User | Final email with saved resumes attached |
| Client milestone | Coach | Alert that client completed stage |
| New client | Coach | Connection request notification |

#### In-App Notifications
- Bell icon with unread count
- Notification center dropdown
- Mark as read/unread
- Clear all option

---

### 12. Admin CMS

#### Content Management
- **Videos:** Add/edit YouTube embed links, titles, descriptions
- **Resources:** Upload PDFs, manage download links
- **Assessment links:** Update external URLs
- **Resume templates:** Upload/manage template files

#### User Management
- View all users (clients, coaches, admins)
- Search and filter
- Deactivate/reactivate accounts
- Assign roles

#### Audit Log
- Track all data access and changes
- Filter by user, action type, date
- Export capability

---

## User Journey & Flows

### New User Registration Flow

```
1. Landing Page
   └── Click "Get Started"

2. Registration Form
   ├── Enter email
   ├── Create password (with strength meter)
   └── Submit

3. Email Verification
   ├── Check email
   └── Click verification link

4. Profile Completion
   ├── Option A: Upload resume for parsing
   │   ├── Upload file
   │   ├── Review extracted data
   │   └── Confirm/edit fields
   └── Option B: Manual entry
       └── Fill out profile form

5. Welcome Tour
   ├── Dashboard overview
   ├── Career Forward pathway explanation
   ├── Resume builder highlight
   ├── Job tracker intro
   └── Coach connection info

6. Dashboard (Career Forward Pathway)
   └── Begin at Stage 1 or choose starting point
```

### Resume Creation Flow

```
1. Resume Section
   └── Click "Create New Resume"

2. Template Selection
   ├── Browse 10+ templates
   ├── Preview each template
   └── Select template

3. Editor (Side-by-Side)
   ├── Left panel: Form sections
   │   ├── Contact info (pre-filled from profile)
   │   ├── Summary
   │   ├── Experience
   │   ├── Education
   │   ├── Skills
   │   └── + Add custom section
   └── Right panel: Live preview

4. Section Editing
   ├── Click section to expand
   ├── Fill in/edit fields
   ├── Add multiple entries (jobs, schools)
   └── Reorder via drag-drop

5. Review & Save
   ├── Full preview mode
   ├── Name the resume
   └── Save

6. Export (optional)
   ├── Download PDF
   └── Download DOCX
```

### Job Application Tracking Flow

```
1. Job Board
   └── Browse/search jobs

2. Find Interesting Job
   └── Click "Apply"

3. Quick Log Modal
   ├── Pre-filled fields:
   │   ├── Company name
   │   ├── Job title
   │   └── Platform (WorkSourceWA)
   ├── User enters:
   │   ├── Alignment score (0-10 slider)
   │   └── Notes (optional)
   └── Confirm

4. Application Saved
   ├── Added to Job Tracker (Yellow status)
   └── External job posting opens in new tab

5. Later: Update Status
   ├── Access Job Tracker
   ├── Find application
   └── Click status toggle:
       ├── Green = Moving forward
       ├── Yellow = Still waiting
       └── Red = Rejected (auto-archives)
```

### Coach-Client Connection Flow

```
Coach Side:
1. Coach Dashboard
   └── Click "Add Client"

2. Search Modal
   ├── Enter client email
   └── Search

3. Results
   ├── Client found → Send connection request
   └── Not found → "Client not registered" message

4. Request Sent
   └── Await client acceptance

Client Side:
1. Notification Received
   ├── Email notification
   └── In-app notification

2. Review Request
   ├── See coach name/organization
   └── Accept or decline

3. Connected
   └── Coach now appears in client's profile
   └── Client appears in coach's caseload
```

---

## Screen Specifications

### Public Pages

#### Landing Page
- Hero section with Career Forward branding
- Value proposition (3-4 bullet points)
- "Get Started" CTA button
- "Sign In" link for existing users
- Brief feature overview
- Footer with links

#### Sign In Page
- Email field
- Password field
- "Remember me" checkbox
- "Forgot password?" link
- Sign in button
- Link to registration

#### Registration Page
- Email field
- Password field with strength meter
- Confirm password field
- Terms acceptance checkbox
- Register button
- Link to sign in

#### Password Reset
- Email entry form
- Confirmation message
- Reset form (new password + confirm)

---

### User Dashboard

#### Main Dashboard
**Header:**
- Career Forward logo
- Navigation: Dashboard, Resumes, Job Tracker, Training, Profile
- Notification bell
- User menu (profile, settings, sign out)

**Content:**
- Welcome message with user's name
- Progress summary card
- Vertical timeline showing Career Forward stages
- Current stage highlighted
- Completion badges displayed
- Quick actions (Create Resume, Log Job, Watch Training)

#### Career Forward Pathway (Vertical Timeline)
- 5 stages displayed vertically
- Each stage shows:
  - Stage number and title
  - Brief description
  - Completion percentage
  - Badge (if earned)
  - Expand/collapse for details
- Current stage visually emphasized
- Checkmarks on completed items within stages

---

### Resume Builder

#### Template Selection Screen
- Grid of template thumbnails
- Template names
- Preview on hover/click
- "Use This Template" button
- Filter by style (if applicable)

#### Editor Screen
**Layout:** Two-column, responsive

**Left Panel (Form):**
- Collapsible sections accordion
- Contact Information (locked at top)
- Professional Summary
- Work Experience
  - Add entry button
  - Each entry: job title, company, dates, description
  - Delete/reorder buttons
- Education
  - Similar entry structure
- Skills
  - Tag-style input
- Custom sections
  - Add section button
  - Name the section
  - Add content

**Right Panel (Preview):**
- Selected template with user data
- Zoom controls
- Page navigation (if multi-page)
- Full-screen preview button

**Actions Bar:**
- Save button
- Export dropdown (PDF, DOCX)
- Change template
- Resume name/rename

---

### Cover Letter Builder

#### Job Input Screen
- Paste job URL field
- OR paste job description text area
- "Analyze" button
- Loading state while processing

#### Editor Screen
- Similar side-by-side layout
- Pre-filled content based on job analysis
- Editable sections
- Live preview
- Export options

---

### Job Tracker

#### List View
**Filters Bar:**
- Status filter (All, Green, Yellow, Red, Archived)
- Date range picker
- Industry dropdown
- Search field

**Table/Cards:**
- Company name
- Position
- Date applied
- Alignment score (visual)
- Status indicator (color dot)
- Actions (Edit, Delete)

**Add Application:**
- Floating action button or top action
- Opens modal form

#### Application Detail/Edit Modal
- All fields editable
- Status toggle (prominent)
- Save/Cancel buttons
- Delete option

---

### Interview Training

#### Training Hub
- Topic cards in grid
- Each card shows:
  - Topic title
  - Number of videos
  - Completion status
  - Thumbnail image

#### Topic Detail
- Topic title and description
- Video list
- Each video: thumbnail, title, duration, watched indicator
- Resources section (downloadable PDFs)

#### Video Player View
- Embedded YouTube player
- Video title
- Description
- "Mark as Watched" button
- Next/Previous navigation
- Related resources

---

### Career Assessments

#### Assessment Selection
- Brief intro explaining assessments
- Guided selector:
  - Question: "What would you like to explore?"
  - Options with icons
  - Recommendation based on selection

#### Assessment List
- Cards for each assessment
- Provider logo
- Brief description
- "Take Assessment" button (external link)
- "Mark Complete" button
- Notes field (optional)

---

### Job Board

#### Browse Jobs
**Search Bar:**
- Keyword input
- Location input
- Search button

**Filters:**
- Industry dropdown
- Posted date
- Job type

**Results List:**
- Job title
- Company
- Location
- Posted date
- Brief description preview
- "Apply" button

#### Job Detail Modal
- Full job description
- Requirements
- Company info
- "Apply Now" button (triggers quick log + external link)

---

### User Profile

#### Profile View/Edit
- Profile photo placeholder
- Personal information section
- Contact information
- Employment information
- Career goals
- Edit buttons per section

#### Settings
- Email preferences
- Notification settings
- Language selection
- Change password
- Delete account option

---

### Coach Dashboard

#### Caseload Overview
**Stats Cards:**
- Total clients
- Active this week
- Completed journey
- Need attention

**Client List:**
- Filterable table
- Columns: Name, Email, Stage, Last Active, Status
- Sortable columns
- Row click → Client detail

**Actions:**
- Add Client button
- Export caseload button

#### Client Detail View
**Header:**
- Client name
- Contact info
- Connection date

**Tabs:**
- Overview (current stage, progress)
- Resumes (view PDFs)
- Job Tracker (summary view)
- Notes (coach's private notes)
- Activity (timeline of actions)

**Notes Section:**
- Add note form
- Chronological note list
- Timestamps
- Edit/delete own notes

#### Reports
- Generate individual client report
- Select report type
- Preview
- Export to PDF

---

### Admin Dashboard

#### Overview
- User statistics
- Activity graphs
- System health

#### Content Management
- Video library (CRUD)
- Resources library (CRUD)
- Assessment links (CRUD)
- Resume templates (CRUD)

#### User Management
- User list with search/filter
- User detail view
- Role assignment
- Account actions (deactivate, delete)

#### Audit Log
- Searchable log entries
- Filters by type, user, date
- Export capability

---

## Database Schema

### Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  role VARCHAR(50) DEFAULT 'client', -- client, coach, admin
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- User Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  gender VARCHAR(50),
  years_in_industry INTEGER,
  career_goal VARCHAR(100), -- same_industry, new_industry, certification
  profile_photo_url VARCHAR(500),
  preferred_language VARCHAR(10) DEFAULT 'en',
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resumes
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  template_id VARCHAR(100),
  content JSONB NOT NULL, -- structured resume data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cover Letters
CREATE TABLE cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  name VARCHAR(255),
  job_title VARCHAR(255),
  company VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Applications
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255),
  industry VARCHAR(100),
  platform VARCHAR(100), -- indeed, linkedin, company_site, worksourcewa
  applied_date DATE NOT NULL,
  alignment_score INTEGER CHECK (alignment_score >= 0 AND alignment_score <= 10),
  status VARCHAR(20) DEFAULT 'yellow', -- green, yellow, red
  notes TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  external_job_id VARCHAR(255), -- for WorkSourceWA integration
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coach-Client Relationships
CREATE TABLE coach_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, ended
  connected_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(coach_id, client_id)
);

-- Coach Notes
CREATE TABLE coach_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stage INTEGER NOT NULL, -- 1-5
  item_key VARCHAR(100) NOT NULL, -- unique identifier for trackable item
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, stage, item_key)
);

-- Achievements/Badges
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id VARCHAR(100) NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_id)
);

-- Assessment Completions
CREATE TABLE assessment_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assessment_id VARCHAR(100) NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  UNIQUE(user_id, assessment_id)
);

-- Video Watch Progress
CREATE TABLE video_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_id VARCHAR(100) NOT NULL,
  watched BOOLEAN DEFAULT FALSE,
  watched_at TIMESTAMP,
  bookmarked BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, video_id)
);

-- Uploaded Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- resume_upload, cover_letter_upload
  filename VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session Tracking (for "Remember Me")
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  device_info TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CMS Content
CREATE TABLE cms_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_url VARCHAR(500) NOT NULL,
  duration_minutes INTEGER,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cms_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(500),
  external_url VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cms_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(255),
  description TEXT,
  external_url VARCHAR(500) NOT NULL,
  category VARCHAR(100), -- interests, skills, personality, values
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resume_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- chronological, functional, combination
  thumbnail_url VARCHAR(500),
  template_data JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workforce Center Configuration (for future multi-tenancy)
CREATE TABLE workforce_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url VARCHAR(500),
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cached Job Listings (from WorkSourceWA)
CREATE TABLE job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  location VARCHAR(255),
  description TEXT,
  job_type VARCHAR(100),
  industry VARCHAR(100),
  salary_range VARCHAR(100),
  external_url VARCHAR(500) NOT NULL,
  posted_date DATE,
  fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_coach_clients_coach_id ON coach_clients(coach_id);
CREATE INDEX idx_coach_clients_client_id ON coach_clients(client_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX idx_job_listings_external_id ON job_listings(external_id);
CREATE INDEX idx_job_listings_posted_date ON job_listings(posted_date);
```

---

## API Integrations

### 1. Affinda Resume Parser

**Purpose:** Extract structured data from uploaded resumes

**Implementation:**
```typescript
// POST https://api.affinda.com/v2/resumes
// Upload resume file, receive structured JSON

interface AffindaResponse {
  data: {
    name: { first: string; last: string };
    emails: string[];
    phoneNumbers: string[];
    workExperience: Array<{
      jobTitle: string;
      organization: string;
      dates: { startDate: string; endDate: string };
      description: string;
    }>;
    education: Array<{
      organization: string;
      degree: string;
      dates: { completionDate: string };
    }>;
    skills: Array<{ name: string }>;
  };
}
```

**Cost Consideration:** Per-document pricing; batch during off-peak if needed

### 2. Resend Email Service

**Purpose:** Transactional emails (verification, notifications, alerts)

**Email Templates Needed:**
- Welcome email
- Email verification
- Password reset
- Inactivity reminder (30 days)
- Account termination warning (5 months)
- Final termination (with resume attachments)
- Coach: New client connection
- Coach: Client milestone alert

### 3. WorkSourceWA Job Feed

**Purpose:** Display local job listings

**Implementation Options:**
1. RSS/XML feed parsing
2. API integration (if available)
3. Web scraping (last resort, with permission)

**Sync Schedule:** Every 1-2 hours via cron job

**Data Mapping:**
```typescript
interface JobListing {
  externalId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedDate: Date;
  externalUrl: string;
}
```

### 4. PDF Generation

**Library:** React-PDF or @react-pdf/renderer

**Use Cases:**
- Resume export
- Cover letter export
- Coach reports

### 5. DOCX Generation

**Library:** docx (npm package)

**Use Cases:**
- Resume export to Word
- Cover letter export to Word

---

## Branding & Design System

### Colors

Based on the Career Forward logo:

| Name | Hex | Usage |
|------|-----|-------|
| Primary (Teal) | #2B8A8A | Buttons, links, accents |
| Secondary (Slate) | #5A6A72 | Headers, text |
| Background | #FFFFFF | Main background |
| Surface | #F8FAFB | Cards, sections |
| Border | #E2E8F0 | Borders, dividers |
| Text Primary | #1A202C | Body text |
| Text Secondary | #718096 | Muted text |
| Success (Green) | #38A169 | Status indicators |
| Warning (Yellow) | #D69E2E | Status indicators |
| Error (Red) | #E53E3E | Status indicators |

### Typography

**Font Family:** Inter (or system fonts fallback)

| Element | Size | Weight |
|---------|------|--------|
| H1 | 2.25rem (36px) | 700 |
| H2 | 1.875rem (30px) | 600 |
| H3 | 1.5rem (24px) | 600 |
| H4 | 1.25rem (20px) | 600 |
| Body | 1rem (16px) | 400 |
| Small | 0.875rem (14px) | 400 |
| Caption | 0.75rem (12px) | 400 |

### Spacing Scale

Using Tailwind's default scale:
- 4px increments (1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24...)

### Component Styles

**Buttons:**
- Primary: Teal background, white text
- Secondary: White background, teal border, teal text
- Danger: Red background, white text
- Border radius: 8px
- Padding: 12px 24px

**Cards:**
- White background
- Subtle shadow
- Border radius: 12px
- Padding: 24px

**Forms:**
- Input border radius: 8px
- Input padding: 12px 16px
- Label above input
- Error messages below in red

**Status Indicators (Stoplight):**
- Green: #38A169
- Yellow: #D69E2E
- Red: #E53E3E
- Circular dots or pills

### Logo Usage

- Primary logo for header and main branding
- Minimum clear space around logo
- Don't stretch or distort

---

## Accessibility & Internationalization

### WCAG AA Compliance

**Requirements:**
- Color contrast ratio minimum 4.5:1 for text
- All interactive elements keyboard accessible
- Focus indicators visible
- Form labels associated with inputs
- Error messages announced to screen readers
- Images have alt text
- Skip navigation link
- Semantic HTML structure
- ARIA labels where needed

**Implementation:**
- Use shadcn/ui components (accessibility built-in)
- Test with axe-core
- Manual screen reader testing
- Keyboard navigation testing

### Multi-Language Support

**Languages:**
1. English (en) - Default
2. Spanish (es)
3. Russian (ru)
4. Ukrainian (uk)
5. Marshallese (mh) - If resources available

**Implementation:**
- next-intl or next-i18next
- Translation files per language
- Language selector in settings and footer
- Store preference in user profile
- RTL support not needed for these languages

**Translation Scope:**
- All UI text
- Email templates
- System messages
- Help content

**Considerations for Marshallese:**
- Limited professional translation resources
- May need community assistance
- Start with core UI, expand based on need

---

## Security & Compliance

### Authentication Security

- Passwords hashed with bcrypt (cost factor 12+)
- Strong password requirements enforced
- Email verification required
- Rate limiting on login attempts
- Account lockout after failed attempts
- Secure session management (HTTP-only cookies)
- CSRF protection

### Data Protection

- All data transmitted over HTTPS
- Database encryption at rest
- PII fields encrypted in database
- Regular security audits
- Input sanitization
- SQL injection prevention (via Prisma)
- XSS prevention

### Audit Trail

**Logged Events:**
- User login/logout
- Profile changes
- Resume creation/edit/delete
- Job application changes
- Coach-client connections
- Admin actions
- Data exports
- Account deletion

**Log Format:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "userId": "uuid",
  "action": "resume.create",
  "entityType": "resume",
  "entityId": "uuid",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "metadata": {}
}
```

### Data Retention

- Active accounts: Indefinite
- Inactive accounts (6 months):
  1. Warning email sent
  2. 30-day grace period
  3. Account archived (resumes emailed to user)
  4. Data anonymized or deleted after 12 months
- User can delete account anytime
- GDPR-style data export on request

### Session Security

- JWT or secure session cookies
- 24-hour default expiration
- 30-day "remember me" option
- Session invalidation on password change
- Single session or multi-session configurable

---

## Future Scalability

### Multi-Tenant Architecture

**Phase 1 (Current):** Single workforce center
- All configuration hardcoded or in environment
- Single database

**Phase 2:** Multiple centers, shared infrastructure
- Add workforce_center_id to relevant tables
- Center-specific branding (logo, colors)
- Center-specific content optional
- Shared resume templates and core content

**Phase 3:** Statewide deployment
- Full multi-tenancy
- Center admin roles
- Center-specific reporting
- Potential separate databases per center

### Database Preparation

- All tables include workforce_center_id (nullable initially)
- Queries can be scoped to center when needed
- Migrations in place to add center association

### Configuration

- Environment variables for single-center mode
- Database-driven config for multi-center
- Feature flags for gradual rollout

---

## Development Phases

### Phase 1: Foundation & Core
1. Project setup (Next.js, Prisma, shadcn/ui)
2. Authentication system
3. User profile with resume parsing
4. Database schema implementation
5. Basic dashboard layout

### Phase 2: Resume Builder
1. Template system
2. Side-by-side editor
3. Section management
4. PDF/DOCX export

### Phase 3: Job Tracker & Board
1. Job tracker CRUD
2. Status system (stoplight)
3. WorkSourceWA integration
4. Quick-log feature

### Phase 4: Training & Assessments
1. Video content management
2. Progress tracking
3. Assessment links with guided selection
4. Achievement system

### Phase 5: Coach Portal
1. Client management
2. Client search and connection
3. Read-only client views
4. Coach notes
5. Reports

### Phase 6: Admin & Polish
1. Admin CMS
2. User management
3. Notification system
4. Multi-language support
5. Accessibility audit
6. Performance optimization

---

## Appendix

### Resume Content JSON Structure

```json
{
  "contact": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string"
  },
  "summary": "string",
  "experience": [
    {
      "id": "uuid",
      "jobTitle": "string",
      "company": "string",
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM | present",
      "description": "string (with bullet points)"
    }
  ],
  "education": [
    {
      "id": "uuid",
      "degree": "string",
      "institution": "string",
      "location": "string",
      "graduationDate": "YYYY-MM",
      "gpa": "string",
      "honors": "string"
    }
  ],
  "skills": ["string"],
  "certifications": [
    {
      "id": "uuid",
      "name": "string",
      "issuer": "string",
      "date": "YYYY-MM",
      "expires": "YYYY-MM"
    }
  ],
  "customSections": [
    {
      "id": "uuid",
      "title": "string",
      "content": "string"
    }
  ]
}
```

### Badge Definitions

```json
{
  "badges": [
    {
      "id": "profile_complete",
      "name": "Profile Pro",
      "description": "Complete your profile 100%",
      "icon": "user-check",
      "criteria": { "type": "profile_completion", "threshold": 100 }
    },
    {
      "id": "first_resume",
      "name": "Resume Ready",
      "description": "Create your first resume",
      "icon": "file-text",
      "criteria": { "type": "resume_count", "threshold": 1 }
    },
    {
      "id": "three_assessments",
      "name": "Assessment Ace",
      "description": "Complete 3 career assessments",
      "icon": "clipboard-check",
      "criteria": { "type": "assessment_count", "threshold": 3 }
    },
    {
      "id": "ten_applications",
      "name": "Active Seeker",
      "description": "Log 10 job applications",
      "icon": "briefcase",
      "criteria": { "type": "application_count", "threshold": 10 }
    },
    {
      "id": "interview_prep",
      "name": "Interview Ready",
      "description": "Watch all interview training videos",
      "icon": "video",
      "criteria": { "type": "videos_watched", "category": "interview", "threshold": "all" }
    },
    {
      "id": "weekly_streak",
      "name": "Weekly Warrior",
      "description": "Log in 7 days in a row",
      "icon": "flame",
      "criteria": { "type": "login_streak", "threshold": 7 }
    }
  ]
}
```

---

*Document Version: 1.0*
*Last Updated: January 2025*
*Project: Career Forward Platform*
