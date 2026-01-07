# Career Quest Platform - API Specification

This document outlines all API endpoints for the Career Quest platform.

---

## Base URL

**Development:** `http://localhost:3000/api`
**Production:** `https://career-quest-platform.vercel.app/api`

## Authentication

All authenticated endpoints require a valid session cookie or Authorization header.

```
Authorization: Bearer <session_token>
```

---

## API Endpoints

### Authentication

#### POST /api/auth/register
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Verification email sent",
  "userId": "uuid"
}
```

**Errors:**
- 400: Invalid email format
- 400: Password doesn't meet requirements
- 409: Email already registered

---

#### POST /api/auth/verify-email
Verify user email with token.

**Request Body:**
```json
{
  "token": "verification_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

#### POST /api/auth/login
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "client",
    "profileCompleted": false
  }
}
```

Sets HTTP-only session cookie.

---

#### POST /api/auth/logout
End user session.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### POST /api/auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If an account exists, a reset email has been sent"
}
```

---

#### POST /api/auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "NewSecurePass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### User Profile

#### GET /api/profile
Get current user's profile.

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "gender": "male",
  "yearsInIndustry": 5,
  "careerGoal": "same_industry",
  "profilePhotoUrl": null,
  "preferredLanguage": "en",
  "profileCompleted": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

#### PUT /api/profile
Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "555-123-4567",
  "gender": "male",
  "yearsInIndustry": 5,
  "careerGoal": "new_industry",
  "preferredLanguage": "es"
}
```

**Response (200):**
```json
{
  "success": true,
  "profile": { ... }
}
```

---

#### POST /api/profile/parse-resume
Upload resume for parsing and profile auto-fill.

**Request:** `multipart/form-data`
- file: Resume file (PDF, DOCX)

**Response (200):**
```json
{
  "success": true,
  "parsedData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-123-4567",
    "workExperience": [...],
    "education": [...],
    "skills": [...]
  }
}
```

---

### Resumes

#### GET /api/resumes
Get all resumes for current user.

**Response (200):**
```json
{
  "resumes": [
    {
      "id": "uuid",
      "name": "Software Developer Resume",
      "templateId": "modern-minimal",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 2,
  "maxAllowed": 3
}
```

---

#### GET /api/resumes/:id
Get specific resume details.

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Software Developer Resume",
  "templateId": "modern-minimal",
  "content": {
    "contact": {...},
    "summary": "...",
    "experience": [...],
    "education": [...],
    "skills": [...],
    "customSections": [...]
  },
  "createdAt": "2024-01-10T08:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

#### POST /api/resumes
Create new resume.

**Request Body:**
```json
{
  "name": "New Resume",
  "templateId": "classic-professional",
  "content": {
    "contact": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "555-123-4567",
      "location": "Spokane, WA"
    },
    "summary": "",
    "experience": [],
    "education": [],
    "skills": []
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "resume": { ... }
}
```

**Errors:**
- 403: Maximum resume limit reached (3)

---

#### PUT /api/resumes/:id
Update resume.

**Request Body:** (partial updates allowed)
```json
{
  "name": "Updated Name",
  "content": { ... }
}
```

**Response (200):**
```json
{
  "success": true,
  "resume": { ... }
}
```

---

#### DELETE /api/resumes/:id
Delete resume.

**Response (200):**
```json
{
  "success": true,
  "message": "Resume deleted"
}
```

---

#### GET /api/resumes/:id/export
Export resume as PDF or DOCX.

**Query Parameters:**
- format: `pdf` | `docx`

**Response:**
- Content-Type: application/pdf or application/vnd.openxmlformats-officedocument.wordprocessingml.document
- Content-Disposition: attachment; filename="resume.pdf"

---

### Cover Letters

#### GET /api/cover-letters
Get all cover letters.

---

#### POST /api/cover-letters
Create cover letter.

**Request Body:**
```json
{
  "resumeId": "uuid",
  "name": "Cover Letter for Acme",
  "jobTitle": "Software Developer",
  "company": "Acme Corp",
  "content": "..."
}
```

---

#### POST /api/cover-letters/analyze-job
Analyze job posting for cover letter suggestions.

**Request Body:**
```json
{
  "jobDescription": "Full job posting text..."
}
```

**Response (200):**
```json
{
  "analysis": {
    "keyRequirements": [...],
    "suggestedSkills": [...],
    "matchedExperience": [...],
    "suggestedContent": {
      "opening": "...",
      "body": "...",
      "closing": "..."
    }
  }
}
```

---

### Job Applications

#### GET /api/job-applications
Get all job applications.

**Query Parameters:**
- status: `green` | `yellow` | `red` | `all`
- archived: `true` | `false`
- industry: string
- startDate: ISO date
- endDate: ISO date
- search: company name search

**Response (200):**
```json
{
  "applications": [
    {
      "id": "uuid",
      "companyName": "Acme Corp",
      "jobTitle": "Developer",
      "industry": "Technology",
      "platform": "linkedin",
      "appliedDate": "2024-01-15",
      "alignmentScore": 8,
      "status": "yellow",
      "notes": "Referred by friend",
      "isArchived": false
    }
  ],
  "total": 15,
  "stats": {
    "green": 3,
    "yellow": 10,
    "red": 2
  }
}
```

---

#### POST /api/job-applications
Create job application.

**Request Body:**
```json
{
  "companyName": "Acme Corp",
  "jobTitle": "Software Developer",
  "industry": "Technology",
  "platform": "worksourcewa",
  "appliedDate": "2024-01-15",
  "alignmentScore": 8,
  "notes": "Great company culture",
  "externalJobId": "ws-12345"
}
```

---

#### PUT /api/job-applications/:id
Update job application.

**Request Body:** (partial updates)
```json
{
  "status": "green",
  "notes": "Interview scheduled for Jan 20"
}
```

---

#### PUT /api/job-applications/:id/status
Quick status update.

**Request Body:**
```json
{
  "status": "red"
}
```

Note: Setting status to "red" automatically sets `isArchived: true`

---

#### DELETE /api/job-applications/:id
Delete job application.

---

### Training & Progress

#### GET /api/training/topics
Get all training topics.

**Response (200):**
```json
{
  "topics": [
    {
      "id": "behavioral-questions",
      "title": "Behavioral Interview Questions",
      "description": "...",
      "videoCount": 5,
      "watchedCount": 2
    }
  ]
}
```

---

#### GET /api/training/topics/:slug/videos
Get videos for a topic.

**Response (200):**
```json
{
  "topic": {...},
  "videos": [
    {
      "id": "uuid",
      "title": "STAR Method Explained",
      "youtubeUrl": "https://youtube.com/...",
      "duration": 12,
      "watched": false,
      "bookmarked": true
    }
  ],
  "resources": [...]
}
```

---

#### POST /api/training/videos/:id/watch
Mark video as watched.

**Response (200):**
```json
{
  "success": true,
  "watched": true,
  "watchedAt": "2024-01-15T10:30:00Z"
}
```

---

#### POST /api/training/videos/:id/bookmark
Toggle video bookmark.

---

### Assessments

#### GET /api/assessments
Get all assessments.

**Query Parameters:**
- category: `interests` | `skills` | `personality` | `values`

**Response (200):**
```json
{
  "assessments": [
    {
      "id": "uuid",
      "name": "O*NET Interest Profiler",
      "provider": "O*NET",
      "description": "...",
      "externalUrl": "https://...",
      "category": "interests",
      "completed": false,
      "completedAt": null,
      "notes": null
    }
  ]
}
```

---

#### POST /api/assessments/:id/complete
Mark assessment as completed.

**Request Body:**
```json
{
  "notes": "Scored high in artistic interests"
}
```

---

### Job Board (WorkSourceWA)

#### GET /api/jobs
Get job listings.

**Query Parameters:**
- search: keyword
- location: string
- industry: string
- postedWithin: `1` | `7` | `30` (days)
- page: number
- limit: number

**Response (200):**
```json
{
  "jobs": [
    {
      "id": "uuid",
      "externalId": "ws-12345",
      "title": "Software Developer",
      "company": "Acme Corp",
      "location": "Spokane, WA",
      "description": "...",
      "postedDate": "2024-01-14",
      "externalUrl": "https://worksourcewa.com/..."
    }
  ],
  "total": 150,
  "page": 1,
  "totalPages": 15,
  "lastUpdated": "2024-01-15T08:00:00Z"
}
```

---

### User Progress & Achievements

#### GET /api/progress
Get user's Career Quest progress.

**Response (200):**
```json
{
  "overallProgress": 45,
  "stages": [
    {
      "stage": 1,
      "title": "Research & Discovery",
      "progress": 75,
      "items": [
        { "key": "profile_complete", "label": "Complete profile", "completed": true },
        { "key": "assessment_1", "label": "Take interest assessment", "completed": true },
        { "key": "labor_market", "label": "Review labor market info", "completed": false }
      ]
    }
  ],
  "currentStage": 2
}
```

---

#### POST /api/progress/:stage/:itemKey
Mark progress item complete.

**Response (200):**
```json
{
  "success": true,
  "completed": true,
  "completedAt": "2024-01-15T10:30:00Z"
}
```

---

#### GET /api/achievements
Get user achievements.

**Response (200):**
```json
{
  "achievements": [
    {
      "id": "profile_complete",
      "name": "Profile Pro",
      "description": "Complete your profile 100%",
      "icon": "user-check",
      "earned": true,
      "earnedAt": "2024-01-10T08:00:00Z"
    },
    {
      "id": "first_resume",
      "name": "Resume Ready",
      "earned": false,
      "progress": 0
    }
  ]
}
```

---

### Notifications

#### GET /api/notifications
Get user notifications.

**Query Parameters:**
- unreadOnly: boolean
- limit: number

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "milestone",
      "title": "Achievement Unlocked!",
      "message": "You earned the Profile Pro badge",
      "read": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "unreadCount": 3
}
```

---

#### PUT /api/notifications/:id/read
Mark notification as read.

---

#### PUT /api/notifications/read-all
Mark all notifications as read.

---

### Documents

#### POST /api/documents/upload
Upload document (resume or cover letter file).

**Request:** `multipart/form-data`
- file: File
- type: `resume_upload` | `cover_letter_upload`

**Response (201):**
```json
{
  "success": true,
  "document": {
    "id": "uuid",
    "filename": "resume.pdf",
    "fileUrl": "https://...",
    "type": "resume_upload"
  }
}
```

---

#### GET /api/documents
Get user's uploaded documents.

---

#### DELETE /api/documents/:id
Delete uploaded document.

---

## Coach API Endpoints

### Client Management

#### GET /api/coach/clients
Get coach's client list.

**Query Parameters:**
- status: `active` | `inactive` | `all`
- stage: number (1-5)
- search: name/email
- sort: `name` | `lastActive` | `stage`
- order: `asc` | `desc`

**Response (200):**
```json
{
  "clients": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "currentStage": 2,
      "overallProgress": 45,
      "lastActive": "2024-01-14T15:30:00Z",
      "status": "active",
      "connectedAt": "2024-01-01T08:00:00Z"
    }
  ],
  "total": 25,
  "stats": {
    "total": 25,
    "active": 20,
    "inactive": 5,
    "needAttention": 3
  }
}
```

---

#### POST /api/coach/clients/search
Search for client to add.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "found": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

#### POST /api/coach/clients/connect
Send connection request to client.

**Request Body:**
```json
{
  "clientId": "uuid"
}
```

---

#### GET /api/coach/clients/:clientId
Get detailed client view.

**Response (200):**
```json
{
  "client": {
    "id": "uuid",
    "profile": {...},
    "progress": {...},
    "resumes": [
      { "id": "uuid", "name": "...", "updatedAt": "..." }
    ],
    "jobApplicationsSummary": {
      "total": 15,
      "active": 10,
      "successRate": 0.2
    },
    "recentActivity": [...]
  }
}
```

---

#### GET /api/coach/clients/:clientId/resumes
Get client's resumes (read-only).

---

#### GET /api/coach/clients/:clientId/resumes/:resumeId/preview
Get resume PDF preview.

---

#### GET /api/coach/clients/:clientId/applications
Get client's job applications (read-only).

---

### Coach Notes

#### GET /api/coach/clients/:clientId/notes
Get notes for a client.

**Response (200):**
```json
{
  "notes": [
    {
      "id": "uuid",
      "content": "Discussed career goals...",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

#### POST /api/coach/clients/:clientId/notes
Add note for client.

**Request Body:**
```json
{
  "content": "Client expressed interest in IT certification"
}
```

---

#### PUT /api/coach/clients/:clientId/notes/:noteId
Update note.

---

#### DELETE /api/coach/clients/:clientId/notes/:noteId
Delete note.

---

### Coach Reports

#### POST /api/coach/reports/client
Generate individual client report.

**Request Body:**
```json
{
  "clientId": "uuid",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

**Response:**
- Content-Type: application/pdf

---

#### GET /api/coach/reports/caseload
Get caseload overview data.

**Response (200):**
```json
{
  "stats": {
    "totalClients": 25,
    "avgProgress": 52,
    "stageDistribution": [
      { "stage": 1, "count": 5 },
      { "stage": 2, "count": 8 }
    ],
    "completedJourney": 3
  }
}
```

---

## Admin API Endpoints

### Content Management

#### GET /api/admin/content/videos
Get all videos for admin.

---

#### POST /api/admin/content/videos
Add new video.

**Request Body:**
```json
{
  "title": "New Interview Video",
  "topic": "behavioral-questions",
  "youtubeUrl": "https://youtube.com/...",
  "description": "...",
  "durationMinutes": 15
}
```

---

#### PUT /api/admin/content/videos/:id
Update video.

---

#### DELETE /api/admin/content/videos/:id
Delete video.

---

Similar CRUD endpoints for:
- `/api/admin/content/resources`
- `/api/admin/content/assessments`
- `/api/admin/content/templates`

---

### User Management

#### GET /api/admin/users
Get all users.

**Query Parameters:**
- role: `client` | `coach` | `admin`
- status: `active` | `inactive`
- search: name/email
- page, limit

---

#### PUT /api/admin/users/:id/role
Change user role.

**Request Body:**
```json
{
  "role": "coach"
}
```

---

#### PUT /api/admin/users/:id/status
Activate/deactivate user.

**Request Body:**
```json
{
  "active": false
}
```

---

#### DELETE /api/admin/users/:id
Delete user (with confirmation).

---

### Audit Log

#### GET /api/admin/audit
Get audit log entries.

**Query Parameters:**
- userId: uuid
- action: string
- startDate: ISO date
- endDate: ISO date
- page, limit

**Response (200):**
```json
{
  "entries": [
    {
      "id": "uuid",
      "userId": "uuid",
      "userEmail": "user@example.com",
      "action": "resume.create",
      "entityType": "resume",
      "entityId": "uuid",
      "metadata": {...},
      "ipAddress": "192.168.1.1",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1500,
  "page": 1
}
```

---

#### GET /api/admin/audit/export
Export audit log as CSV.

**Query Parameters:** Same filters as GET

---

## Webhook Endpoints

### Email Events (from Resend)

#### POST /api/webhooks/email
Handle email delivery events.

**Headers:**
- X-Resend-Signature: signature

---

## Scheduled Jobs

These are cron jobs, not direct API endpoints:

### Job Sync (every 1-2 hours)
`/api/cron/sync-jobs`
- Fetches latest jobs from WorkSourceWA
- Updates job_listings table

### Inactivity Check (daily)
`/api/cron/check-inactivity`
- Identifies users inactive 30 days → sends reminder
- Identifies users inactive 5 months → sends warning
- Archives accounts at 6 months

### Achievement Check (on user action)
Internal function triggered by user actions to check and award achievements.

---

## Error Response Format

All errors follow this format:

```json
{
  "error": true,
  "code": "ERROR_CODE",
  "message": "Human readable message",
  "details": {} // Optional additional info
}
```

### Common Error Codes:
- `UNAUTHORIZED`: Not logged in
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource doesn't exist
- `VALIDATION_ERROR`: Invalid request data
- `LIMIT_EXCEEDED`: Quota exceeded (e.g., resume limit)
- `INTERNAL_ERROR`: Server error

---

## Rate Limiting

- Auth endpoints: 5 requests/minute
- General API: 100 requests/minute
- File uploads: 10/minute
- Resume parsing: 5/minute

Rate limit headers included in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705312800
```

---

*Document Version: 1.0*
