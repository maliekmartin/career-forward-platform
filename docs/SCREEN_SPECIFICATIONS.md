# Career Quest Platform - Screen Specifications

This document provides detailed specifications for each screen in the Career Quest platform, suitable for creating Figma designs.

---

## Design System Reference

### Color Palette
```
Primary Teal:     #2B8A8A
Secondary Slate:  #5A6A72
Background:       #FFFFFF
Surface:          #F8FAFB
Border:           #E2E8F0
Text Primary:     #1A202C
Text Secondary:   #718096
Success Green:    #38A169
Warning Yellow:   #D69E2E
Error Red:        #E53E3E
```

### Typography
- **Font:** Inter (Google Fonts)
- **H1:** 36px / Bold
- **H2:** 30px / Semibold
- **H3:** 24px / Semibold
- **H4:** 20px / Semibold
- **Body:** 16px / Regular
- **Small:** 14px / Regular
- **Caption:** 12px / Regular

### Spacing
- Base unit: 4px
- Common spacings: 8px, 12px, 16px, 24px, 32px, 48px

### Border Radius
- Buttons: 8px
- Cards: 12px
- Inputs: 8px
- Badges: 16px (pill shape)

---

## Public Pages

### 1. Landing Page

**URL:** `/`

**Layout:** Full-width, single column, centered content

**Sections:**

**Navigation Bar (Fixed)**
- Height: 64px
- Background: White with subtle shadow
- Left: Career Quest logo (from logo file)
- Right: "Sign In" button (secondary style), "Get Started" button (primary)

**Hero Section**
- Height: ~500px
- Background: Light gradient (white to #F8FAFB)
- Content (centered, max-width 800px):
  - H1: "Your Career Journey Starts Here"
  - Subtitle (Text Secondary): "Career Quest guides you through every step of your job search - from discovering your strengths to landing your dream job."
  - CTA Button (Primary, Large): "Start Your Quest"
  - Secondary link: "Already have an account? Sign In"

**Features Section**
- Background: White
- 4-column grid (on desktop)
- Section title: "How Career Quest Helps You"
- Feature cards (icon + title + description):
  1. Icon: Compass | "Career Discovery" | "Explore your interests and skills with guided assessments"
  2. Icon: FileText | "Resume Builder" | "Create professional resumes with our easy-to-use builder"
  3. Icon: Video | "Interview Prep" | "Learn winning interview techniques from expert videos"
  4. Icon: Briefcase | "Job Tracking" | "Keep organized with our built-in application tracker"

**Process Section**
- Background: #F8FAFB
- Title: "Your 5-Step Career Quest"
- Vertical timeline preview showing 5 stages with icons:
  1. Research & Discovery
  2. Prepare for Success
  3. Start Your Job Search
  4. Ace the Interview
  5. Stay Connected

**CTA Section**
- Background: Primary Teal
- Text: White
- "Ready to Begin?" + "Get Started Free" button (white background, teal text)

**Footer**
- Background: Slate (#5A6A72)
- Text: White/Light gray
- Links: About, Privacy Policy, Terms of Service, Contact
- WorkSource branding/attribution
- Language selector dropdown

---

### 2. Sign In Page

**URL:** `/signin`

**Layout:** Centered card on light background

**Page Structure:**
- Background: #F8FAFB
- Card (centered, max-width 400px):
  - Career Quest logo (centered, smaller)
  - H2: "Welcome Back"
  - Subtitle: "Sign in to continue your career journey"

**Form:**
- Email input
  - Label: "Email Address"
  - Placeholder: "you@example.com"
- Password input
  - Label: "Password"
  - Type: password with show/hide toggle
- Checkbox: "Remember me for 30 days"
- Link (right-aligned): "Forgot password?"
- Button (full-width, primary): "Sign In"

**Footer of card:**
- Text: "Don't have an account?"
- Link: "Create one here"

---

### 3. Registration Page

**URL:** `/register`

**Layout:** Centered card on light background

**Card (max-width 400px):**
- Career Quest logo (centered)
- H2: "Create Your Account"
- Subtitle: "Start your journey to career success"

**Form:**
- Email input
  - Label: "Email Address"
  - Placeholder: "you@example.com"
- Password input
  - Label: "Create Password"
  - Password strength meter below (bar with 4 segments)
  - Helper text: "Min 12 characters with uppercase, lowercase, number, and symbol"
- Confirm Password input
  - Label: "Confirm Password"
  - Validation: Must match
- Checkbox (required): "I agree to the Terms of Service and Privacy Policy"
- Button (full-width, primary): "Create Account"

**Footer:**
- Text: "Already have an account?"
- Link: "Sign in"

---

### 4. Password Reset Pages

**Request Reset (`/forgot-password`):**
- Card with email input
- H2: "Reset Your Password"
- Text: "Enter your email and we'll send you a reset link"
- Email input + Submit button

**Reset Confirmation:**
- Success message with email icon
- Text: "Check your inbox for reset instructions"

**New Password (`/reset-password`):**
- Card with new password + confirm fields
- Same validation as registration

---

## User Dashboard

### 5. Main Dashboard

**URL:** `/dashboard`

**Layout:**
- Sidebar (240px) + Main content area
- Desktop: Side-by-side
- Tablet: Collapsible sidebar

**Sidebar:**
- Background: White
- Border-right: 1px #E2E8F0
- Top: Career Quest logo
- Navigation items (icons + labels):
  - Dashboard (Home icon) - Active state: teal background, teal text
  - My Resumes (FileText icon)
  - Cover Letters (File icon)
  - Job Tracker (Briefcase icon)
  - Training (Video icon)
  - Assessments (Clipboard icon)
  - Job Board (Search icon)
  - Profile (User icon)
  - Settings (Gear icon)
- Bottom: User avatar + name + "Sign Out" link

**Top Bar:**
- Height: 64px
- Left: Page title ("Dashboard")
- Right:
  - Notification bell (with red badge count if unread)
  - User dropdown (avatar + name + arrow)

**Main Content:**

**Welcome Section:**
- H2: "Welcome back, [First Name]!"
- Progress summary: "You're [X]% through your Career Quest"
- Horizontal progress bar

**Quick Actions Row (3 cards):**
1. "Create Resume" - Icon + brief text + button
2. "Log Application" - Icon + brief text + button
3. "Watch Training" - Icon + brief text + button

**Career Quest Pathway (Main Feature):**
- Title: "Your Career Quest Journey"
- Vertical timeline visualization:

  For each stage (1-5):
  - Circle indicator (left side of timeline)
    - Completed: Teal with checkmark
    - In Progress: Teal outline
    - Not started: Gray outline
  - Stage card (right side):
    - Stage number + title
    - Progress bar (X% complete)
    - Brief description
    - Expand/collapse arrow
    - When expanded: List of sub-items with checkboxes

**Stage 1 Example (Expanded):**
```
[1] Research & Discovery          [===========      ] 65%
    Set career goals and explore your options

    [ ] Complete your profile
    [x] Take interest assessment
    [x] Explore labor market info
    [ ] Review career pathways
```

**Achievements Section:**
- Title: "Your Achievements"
- Horizontal scroll of badge cards
- Each badge: Icon + name + earned date (or "Locked" with progress)

---

### 6. Profile Completion (First Login)

**URL:** `/onboarding`

**Layout:** Full-width centered content, stepped wizard

**Progress Bar (top):**
- 3 steps: Upload Resume → Complete Profile → Welcome Tour
- Visual step indicator

**Step 1: Resume Upload**
- H2: "Let's Speed Things Up"
- Text: "Upload your existing resume and we'll fill in your profile automatically"
- Upload zone (dashed border, drag-and-drop):
  - Icon: Upload cloud
  - Text: "Drag and drop your resume here"
  - Text: "or"
  - Button: "Browse Files"
  - Supported formats: PDF, DOCX
- OR divider
- Link: "Skip this step and enter manually"

**Step 2: Profile Form**
- If resume uploaded: Fields pre-filled, user reviews
- If manual: Empty fields

**Form Sections:**
- Personal Information
  - First Name* (text)
  - Last Name* (text)
  - Gender* (select: Male, Female, Non-binary, Prefer not to say)
  - Phone Number* (tel input with formatting)

- Employment Background
  - Years in Industry* (number input or dropdown: 0-1, 2-5, 6-10, 11-20, 20+)
  - Current/Most Recent Industry (dropdown with industries)

- Career Goals*
  - Radio buttons:
    - "Stay in my current industry"
    - "Transition to a new industry"
    - "Pursue certification or education"
  - If "new industry": Show industry dropdown

- Button: "Continue"

**Step 3: Welcome Tour**
- Interactive tour overlay
- Spotlight on different sections with explanatory tooltips
- Steps: Dashboard → Resume Builder → Job Tracker → Training → Assessments
- "Next" / "Skip Tour" buttons

**Final Screen:**
- Success message
- "Your Career Quest Begins Now!"
- Button: "Go to Dashboard"

---

### 7. Resume Builder - Template Selection

**URL:** `/resumes/new`

**Layout:** Grid gallery

**Header:**
- H2: "Choose Your Resume Template"
- Text: "Select a professional template to get started"

**Filter Tabs:**
- All | Chronological | Functional | Combination

**Template Grid:**
- 3 columns on desktop
- Each template card:
  - Thumbnail image (resume preview)
  - Template name below
  - Hover state: Slight scale + shadow + "Use Template" button overlay
  - Click: Opens editor with template

**Templates to show (10+):**
1. Classic Professional
2. Modern Minimal
3. Executive
4. Creative
5. Technical
6. Healthcare
7. Education
8. Trades & Labor
9. Entry Level
10. Career Change

---

### 8. Resume Builder - Editor

**URL:** `/resumes/[id]/edit`

**Layout:** Two-panel (50/50 split on desktop)

**Left Panel - Form:**
- Background: White
- Scrollable independently
- Accordion sections:

**Contact Information (Always visible at top):**
- First Name, Last Name
- Email, Phone
- City, State
- LinkedIn URL (optional)

**Professional Summary:**
- Textarea (rich text: bold, italic)
- Character count
- AI suggestion button (future)

**Work Experience:**
- "Add Experience" button
- Each entry (collapsible card):
  - Job Title*
  - Company Name*
  - Location
  - Start Date (month/year picker)
  - End Date (month/year or "Present" checkbox)
  - Description (rich text with bullet support)
  - Delete button (trash icon)
- Drag handle for reordering

**Education:**
- Similar structure to Experience
- Fields: Degree, Institution, Location, Graduation Date, GPA, Honors

**Skills:**
- Tag input (type + enter to add)
- Existing tags shown as pills with X to remove
- Suggestions dropdown as user types

**Additional Sections (expandable):**
- "+ Add Section" dropdown:
  - Certifications
  - Volunteer Experience
  - Projects
  - Awards
  - Languages
  - Custom Section

**Right Panel - Preview:**
- Background: #F8FAFB
- Scrollable paper preview
- Selected template rendered with user data
- Real-time updates as user types
- Zoom controls (75%, 100%, 125%)
- Full-screen preview button

**Action Bar (bottom, fixed):**
- Left: "Back to Resumes"
- Center: Resume name (editable inline)
- Right:
  - "Save Draft" (secondary)
  - "Export" dropdown (PDF, DOCX)

---

### 9. Resume Builder - My Resumes List

**URL:** `/resumes`

**Header:**
- H2: "My Resumes"
- Right: "Create New Resume" button (primary)
- Counter: "2 of 3 slots used"

**Resume Cards (grid, 3 columns):**
- Card for each saved resume:
  - Thumbnail preview (scaled down)
  - Resume name
  - Last edited date
  - Actions: Edit | Duplicate | Download | Delete

**Empty State (if no resumes):**
- Illustration
- "Create your first resume"
- CTA button

**Slot Limit Warning (if 3/3 used):**
- Alert banner: "You've reached your resume limit. Delete one to create a new resume."

---

### 10. Cover Letter Builder

**URL:** `/cover-letters/new`

**Step 1 - Job Information:**
- H2: "Create a Job-Matched Cover Letter"
- Text: "Paste the job posting to customize your cover letter"
- Large textarea: "Paste job description here..."
- OR: URL input: "Or enter the job posting URL"
- Button: "Analyze Job"

**Step 2 - Editor (after analysis):**
- Two-panel layout similar to resume editor
- Left: Form with pre-filled suggestions
  - Recipient info
  - Opening paragraph
  - Body paragraphs (highlighting matching skills)
  - Closing paragraph
- Right: Live preview
- Highlighted sections show "matched" from job posting

---

### 11. Job Tracker

**URL:** `/jobs`

**Header:**
- H2: "Job Tracker"
- Right: "Add Application" button (primary)

**Filter Bar:**
- Status filter: All | Active | Archived
- Dropdown: Status (Green/Yellow/Red)
- Date range picker
- Industry dropdown
- Search input (by company name)

**Applications Table/Cards:**

**Table View (desktop):**
| Company | Position | Industry | Applied | Alignment | Status | Actions |
|---------|----------|----------|---------|-----------|--------|---------|
| Acme Co | Designer | Tech | Jan 5 | 8/10 | [Yellow dot] | [...] |

**Status indicators:**
- Green dot: "Next Steps" - bright green
- Yellow dot: "Awaiting" - amber
- Red dot: "Rejected" - red (shown in archived)

**Actions menu (...):**
- Edit
- Change Status
- Archive
- Delete

**Empty State:**
- "No applications tracked yet"
- "Start tracking your job search"
- Button: "Add Your First Application"

---

### 12. Add/Edit Job Application Modal

**Triggered by:** "Add Application" or "Edit" action

**Modal (500px wide):**

**Form Fields:**
- Company Name* (text)
- Position/Job Title (text)
- Industry* (dropdown)
- Application Platform* (dropdown):
  - WorkSourceWA
  - Indeed
  - LinkedIn
  - Company Website
  - Referral
  - Job Fair
  - Other
- Date Applied* (date picker, defaults to today)
- Alignment Score* (slider 0-10 with emoji indicators)
  - 0-3: "Not ideal"
  - 4-6: "Good fit"
  - 7-10: "Great match!"
- Notes (textarea, optional)

**Status Selection (for edit mode):**
- Three large toggle buttons:
  - [Green] "Moving Forward"
  - [Yellow] "Awaiting Response" (default for new)
  - [Red] "Not Selected"

Note: Selecting Red moves to Archived automatically

**Buttons:**
- Cancel | Save Application

---

### 13. Interview Training Hub

**URL:** `/training`

**Header:**
- H2: "Interview Training"
- Progress: "X of Y videos watched"

**Topic Grid (2 columns):**
- Card for each topic:
  - Topic icon
  - Topic title
  - "X videos" subtitle
  - Progress bar
  - Completion badge (if all watched)

**Topics:**
1. Introduction to Interviewing
2. Behavioral Questions
3. The STAR Method
4. Common Interview Questions
5. Salary Negotiation
6. Virtual Interview Tips
7. Follow-up & Thank You Notes

---

### 14. Training Topic Detail

**URL:** `/training/[topic-slug]`

**Header:**
- Back link: "< Back to Training"
- Topic title (H2)
- Topic description

**Video List:**
- Each video card:
  - YouTube thumbnail
  - Video title
  - Duration
  - Watched indicator (checkmark badge)
  - "Watch" button

**Resources Section:**
- Downloadable PDFs
- Checklists
- External links

---

### 15. Video Player View

**URL:** `/training/[topic-slug]/[video-id]`

**Layout:**
- Embedded YouTube player (responsive, 16:9)
- Below player:
  - Video title (H3)
  - Description
  - "Mark as Watched" button (toggleable)
  - Navigation: "Previous" | "Next" buttons
- Sidebar (on desktop): Related videos list

---

### 16. Career Assessments

**URL:** `/assessments`

**Header:**
- H2: "Career Assessments"
- Text: "Discover your interests, skills, and ideal career paths"

**Guided Selector Section:**
- "What would you like to explore?"
- 4 clickable cards:
  1. "My Interests" - icon: heart
  2. "My Skills" - icon: tools
  3. "My Work Style" - icon: user
  4. "Career Matches" - icon: target

Clicking shows filtered assessments below

**Assessment List:**
- Cards for each assessment:
  - Provider logo (O*NET, CareerOneStop, etc.)
  - Assessment name
  - Brief description
  - "Take Assessment" button (opens external link)
  - "Mark Complete" checkbox
  - If completed: Notes field appears

**Completed Section:**
- List of completed assessments with dates
- Expandable notes

---

### 17. Job Board (WorkSourceWA Integration)

**URL:** `/job-board`

**Header:**
- H2: "Job Opportunities"
- "Powered by WorkSourceWA" badge
- Last updated timestamp

**Search Bar:**
- Keyword input (with search icon)
- Location input
- "Search" button

**Filters:**
- Industry dropdown
- Posted within: Any | Today | This Week | This Month
- Job type: All | Full-time | Part-time | Contract

**Results List:**
- Each job card:
  - Job title (link)
  - Company name
  - Location
  - Posted date
  - Brief description (truncated)
  - "Apply" button

**Job Click → Quick Log Modal:**
- Pre-filled: Company, Position, Platform (WorkSourceWA)
- User adds: Alignment score, Notes
- "Save & Apply" → Saves to tracker + Opens external link

---

### 18. User Profile

**URL:** `/profile`

**Layout:** Single column, max-width 800px, centered

**Profile Header:**
- Avatar placeholder (with upload option)
- Name (H2)
- Email
- Member since date

**Sections (cards):**

**Personal Information:**
- View/Edit toggle
- First Name, Last Name, Gender
- Edit mode: Form fields

**Contact Information:**
- Email, Phone
- Edit mode: Form fields

**Employment Background:**
- Years in Industry
- Career Goal
- Edit mode: Dropdowns/radios

**Connected Coach:**
- If connected: Coach name, organization
- If not: "Not connected to a coach"

**My Achievements:**
- Badge display grid
- Earned badges highlighted
- Locked badges grayed with progress

---

### 19. Settings

**URL:** `/settings`

**Sections:**

**Language Preferences:**
- Language dropdown: English, Spanish, Russian, Ukrainian, Marshallese

**Email Notifications:**
- Toggles for each notification type:
  - Progress reminders
  - Job matches
  - System updates

**Account:**
- Change password button → Modal
- Download my data button
- Delete account button (danger style) → Confirmation modal

---

## Coach Portal

### 20. Coach Dashboard

**URL:** `/coach`

**Sidebar (same structure as user, different items):**
- Dashboard
- My Clients
- Reports
- Settings

**Dashboard Content:**

**Stats Cards Row:**
- Total Clients | Active This Week | Need Attention | Completed Journey

**Client Activity Feed:**
- Recent client actions
- "John D. completed their resume"
- "Sarah M. logged 5 new applications"

**Clients Needing Attention:**
- List of clients inactive 7+ days
- Quick link to their profile

---

### 21. Coach Client List

**URL:** `/coach/clients`

**Header:**
- H2: "My Clients"
- "Add Client" button

**Filter Bar:**
- Search by name/email
- Status: All | Active | Inactive
- Stage dropdown: All | Stage 1 | Stage 2 | etc.
- Sort: Name | Last Active | Stage

**Client Table:**
| Client Name | Email | Current Stage | Last Active | Status | Actions |
|-------------|-------|---------------|-------------|--------|---------|
| John Doe | john@... | Stage 3 | 2 days ago | Active | View |

**Status indicators:**
- Green: Active (logged in within 7 days)
- Yellow: Inactive (7-30 days)
- Red: At risk (30+ days)

---

### 22. Add Client Modal

**Triggered by:** "Add Client" button

**Modal:**
- H3: "Add a Client"
- Text: "Search for a client by their email address"
- Email search input
- "Search" button

**Results:**
- If found: Client name + email + "Send Connection Request" button
- If not found: "No user found with this email. They may need to register first."

**Confirmation:**
- "Connection request sent to [email]"
- Client will see notification to accept

---

### 23. Coach Client Detail View

**URL:** `/coach/clients/[client-id]`

**Header:**
- Back link: "< My Clients"
- Client name (H2)
- Contact info (email, phone)
- Connection date
- Status badge

**Tabs:**

**Overview Tab:**
- Current Career Quest stage visualization
- Progress percentage
- Recent activity list
- Quick stats: Resumes created, Applications logged, Videos watched

**Resumes Tab:**
- List of client's resumes
- Preview button (opens read-only PDF view)
- Download button

**Job Tracker Tab:**
- Read-only view of client's applications
- Filter by status
- Summary stats: Total apps, Active, Success rate

**Notes Tab:**
- Add note form (textarea + save button)
- Chronological list of coach notes
- Each note: Content, timestamp, edit/delete buttons

**Activity Tab:**
- Full timeline of client actions
- Dates and action descriptions

---

### 24. Coach Reports

**URL:** `/coach/reports`

**Options:**

**Individual Client Report:**
- Select client dropdown
- Date range picker
- "Generate Report" button
- Preview shown in modal
- Export to PDF button

**Report Contents:**
- Client name and contact
- Overall progress summary
- Stage-by-stage completion
- Resume summary
- Job application summary
- Activity timeline

**Caseload Overview:**
- Aggregate stats for all clients
- Chart: Stage distribution
- Table: Client progress summary

---

## Admin Portal

### 25. Admin Dashboard

**URL:** `/admin`

**Stats Overview:**
- Total Users | Active Users (30 days) | New This Month
- Coaches | Clients

**Quick Links:**
- Manage Content
- Manage Users
- View Audit Log

---

### 26. Admin Content Management

**URL:** `/admin/content`

**Tabs:** Videos | Resources | Assessments | Templates

**Videos Tab:**
- Table: Title, Topic, YouTube URL, Status, Actions
- Add Video modal: Title, Topic (dropdown), YouTube URL, Description
- Edit/Delete actions

**Resources Tab:**
- Similar table structure
- Upload PDF option

**Assessments Tab:**
- Manage external assessment links
- Category assignment

**Templates Tab:**
- Resume template management
- Upload template files
- Set active/inactive

---

### 27. Admin User Management

**URL:** `/admin/users`

**Filters:**
- Role: All | Clients | Coaches | Admins
- Status: All | Active | Inactive
- Search

**User Table:**
| Name | Email | Role | Registered | Last Login | Status | Actions |

**Actions:**
- View Details
- Change Role
- Deactivate/Reactivate
- Delete (with confirmation)

---

### 28. Admin Audit Log

**URL:** `/admin/audit`

**Filters:**
- User (search)
- Action type dropdown
- Date range

**Log Table:**
| Timestamp | User | Action | Entity | Details |

**Export button:** Download CSV

---

## Components Library

### Navigation Components

**Primary Button**
- Background: #2B8A8A
- Text: White
- Padding: 12px 24px
- Border radius: 8px
- Hover: Darken 10%

**Secondary Button**
- Background: White
- Border: 2px #2B8A8A
- Text: #2B8A8A
- Same padding/radius

**Danger Button**
- Background: #E53E3E
- Text: White

**Ghost Button**
- Background: Transparent
- Text: #2B8A8A
- Hover: Light teal background

### Form Components

**Text Input**
- Border: 1px #E2E8F0
- Border radius: 8px
- Padding: 12px 16px
- Focus: Border #2B8A8A
- Error: Border #E53E3E + error message below

**Select Dropdown**
- Same styling as text input
- Chevron icon right

**Textarea**
- Same styling, auto-grow or fixed height

**Checkbox**
- Custom styled
- Checked: Teal background with white check

**Radio Buttons**
- Custom styled circles
- Selected: Teal fill

**Toggle/Switch**
- Pill shape
- Off: Gray background
- On: Teal background

### Feedback Components

**Alert/Banner**
- Success: Light green background, dark green text, green left border
- Warning: Light yellow, amber
- Error: Light red, dark red
- Info: Light blue, dark blue

**Toast Notifications**
- Bottom-right corner
- Auto-dismiss
- Close button

**Badge**
- Pill shape
- Status colors for context

**Progress Bar**
- Track: #E2E8F0
- Fill: #2B8A8A
- Height: 8px
- Border radius: 4px

### Layout Components

**Card**
- Background: White
- Border radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 24px

**Modal**
- Centered overlay
- Background: White
- Border radius: 16px
- Shadow: Large
- Close button top-right
- Overlay: Semi-transparent black

**Sidebar**
- Width: 240px
- Collapsible on smaller screens

**Data Table**
- Alternating row colors (white / #F8FAFB)
- Hover highlight
- Sortable column headers

---

## Responsive Breakpoints

- **Desktop:** 1280px+ (full layout)
- **Laptop:** 1024px - 1279px (slightly compressed)
- **Tablet:** 768px - 1023px (sidebar collapses, stack layouts)
- **Mobile:** < 768px (single column, hamburger menu)

Note: Design desktop-first, ensure all features accessible on tablet/mobile via responsive adaptation.

---

## Icon Reference

Using Lucide Icons (shadcn/ui default):

- Home
- FileText (resumes)
- File (cover letters)
- Briefcase (jobs)
- Video (training)
- ClipboardCheck (assessments)
- Search
- User
- Settings
- Bell (notifications)
- Plus
- Edit
- Trash
- Download
- Upload
- ChevronDown
- ChevronRight
- Check
- X
- Menu (hamburger)

---

*Document Version: 1.0*
*For: Figma Design Reference*
