# INTERHIVE
## Product Requirements Document (PRD)
### Student-to-PPO Talent Platform

| | |
|---|---|
| **Product** | InterHive |
| **Document Version** | v1.0 |
| **Product Type** | B2B2C Talent / Internship / Hiring Platform |
| **Core Journey** | Selection → 2-Month InterHive Training → 4-Month Company Internship → Performance Evaluation → PPO |
| **Primary Users** | Students, Partner Companies, InterHive Operations/Admin Team |

---

## 1. Executive Summary

InterHive is a structured talent platform designed to move students from assessment and selection to industry readiness, company internship, and a clearly defined path toward a Pre-Placement Offer (PPO).

The platform is not intended to operate only as an internship listing website. Its core value is a managed talent pipeline: companies share hiring requirements, InterHive sources and assesses students, delivers a structured pre-company training program, matches eligible students to companies, tracks internship performance, and supports the company's final hiring/PPO decision.

The initial program model is a six-month pathway: 2 months of InterHive-led training followed by 4 months of company internship. PPO eligibility must be governed by documented company-specific criteria rather than being presented as an unconditional guarantee unless a partner agreement explicitly provides one.

## 2. Product Vision

Build a trusted bridge between students and employers where students become industry-ready before entering a company, and companies receive assessed, trained, and measurable talent.

**Vision statement:** "From Selection to PPO — Train, Intern, Perform, Get Hired."

## 3. Problem Statement

- Students often enter internships without sufficient technical, project, communication, or workplace readiness.
- Companies spend significant time screening and training interns before they become productive.
- Internship portals often optimize for applications rather than measurable skill development and hiring outcomes.
- Students do not always know what they need to achieve to become eligible for full-time hiring.
- Companies lack a standardized way to compare intern readiness and internship performance across candidates.

## 4. Product Goals

1. Create a standardized student selection and assessment process.
2. Train selected students against industry and company-specific requirements.
3. Match trained students to partner-company internship requirements.
4. Provide students with a transparent, measurable PPO-readiness journey.
5. Give companies a structured pipeline of pre-assessed and trained interns.
6. Track projects, attendance, assessments, mentor feedback, and company performance in one system.
7. Create verified student profiles and evidence-based portfolios.
8. Provide dashboards and analytics for students, companies, and InterHive administrators.

## 5. Non-Goals for V1

- Being a general-purpose job board for every external job.
- Guaranteeing a PPO regardless of performance or company eligibility criteria.
- Replacing a company's HR/payroll system.
- Providing unrestricted access to confidential company evaluation data.
- Launching a full marketplace for digital products before the core talent pipeline is stable.

## 6. Target Users & Roles

| Role | Primary Need | Key Actions | Success Outcome |
|---|---|---|---|
| Student | Get trained, placed, and progress toward PPO | Apply, assess, train, complete projects, intern, track performance | Company internship and eligible PPO opportunity |
| Company HR / Recruiter | Access prepared talent | Define requirements, review candidates, select interns, evaluate | Reduced hiring/training friction and quality talent pipeline |
| Company Mentor | Manage intern performance | Assign/review work, give feedback, evaluate progress | Reliable performance evidence |
| InterHive Trainer | Prepare students | Deliver modules, mentor, assess, approve readiness | Industry-ready students |
| InterHive Admin | Operate the ecosystem | Manage students, companies, programs, matching, reports | Efficient and auditable operations |
| Super Admin | Govern platform | Permissions, configuration, audit, system settings | Secure platform governance |

## 7. Core Product Journey

1. **Application:** Student creates profile and applies to a PPO Track/program.
2. **AI + Skill Assessment:** Student completes aptitude, technical, communication and/or domain assessments.
3. **Selection:** InterHive evaluates results against program criteria and selects eligible students.
4. **2-Month InterHive Training:** Selected students complete structured technical, professional, project and company-readiness training.
5. **Company Matching:** The platform matches trained students with participating company requirements.
6. **4-Month Company Internship:** Students work on real company projects with mentor supervision and performance tracking.
7. **Performance Evaluation:** Company and InterHive review agreed performance, attendance, project delivery and other criteria.
8. **PPO Decision:** Students who satisfy the documented company-specific criteria become eligible for the company's PPO/hiring process.

## 8. Student Experience Requirements

### 8.1 Student Registration & Profile

- Email/mobile registration and secure login.
- Student profile: name, college, degree, branch, graduation year, location, resume, portfolio links.
- Skills matrix with self-declared and verified skills.
- Preferred roles, domains, work mode, location and internship preferences.
- Resume upload and profile completion score.

### 8.2 Assessment Center

- Aptitude assessment: quantitative, logical, verbal and/or role-specific sections.
- Technical assessment based on selected role/stack.
- Communication/behavioral assessment where required.
- Assessment timer, question bank, attempt rules and scoring.
- Results dashboard with strengths, gaps and recommended training.
- Admin-configurable pass criteria.

### 8.3 Selection

- Application status: Applied → Assessment → Under Review → Selected / Not Selected / Waitlisted.
- Automated notifications for important status changes.
- Selection letter/program invitation.
- Digital acceptance of program terms.

### 8.4 Two-Month Training

- Cohort-based learning with role-specific curriculum.
- Video/reading content, live sessions, assignments and quizzes.
- Hands-on projects and simulated company tasks.
- Mentor assignment and mentor feedback.
- Attendance and module completion tracking.
- Weekly assessments and readiness score.
- Final InterHive readiness assessment before company matching.

### 8.5 PPO Readiness Dashboard

- Overall readiness score.
- Technical score.
- Project score.
- Communication/professional score.
- Training completion.
- Attendance.
- Mentor rating.
- Company performance once the student enters internship.
- Clear display of completed, pending and at-risk criteria.
- Company-specific PPO criteria should be visible to the student where contractually appropriate.

## 9. Company Experience Requirements

### 9.1 Company Onboarding

- Company registration and verification.
- Company profile and authorized users.
- MOU / partnership record and program details.
- Hiring requirements and expected intake.
- Role templates for recurring internship needs.

### 9.2 Requirement Creation

- Role title and department.
- Required skills and proficiency levels.
- Preferred education/experience.
- Internship duration.
- Location/work mode.
- Number of openings.
- Expected project scope.
- Mentor details.
- PPO criteria and decision process, where applicable.

### 9.3 Candidate Matching

- Skill-match percentage.
- Assessment performance.
- Training completion.
- Project performance.
- Availability.
- Role/location preferences.
- Company-specific readiness score.
- Company can shortlist, reject, interview, or request additional evidence.

### 9.4 Company Internship Workspace

- Intern roster.
- Task/project assignment.
- Milestones and deadlines.
- Mentor feedback.
- Attendance/engagement records.
- Monthly performance review.
- Final evaluation and PPO recommendation workflow.

## 10. Company-Specific Training Engine

A major differentiator should be the ability to map company requirements to the InterHive curriculum.

- Company submits a role requirement.
- InterHive maps required skills to existing training modules.
- Missing skills trigger additional modules or assessments.
- Student receives a company-readiness plan.
- Final readiness assessment determines whether the student can enter the company internship.
- Training content should remain reusable across companies while allowing company-specific modules.

## 11. Matching Engine

The matching engine should generate a transparent compatibility score rather than a black-box recommendation.

- Skills match.
- Assessment match.
- Training/readiness match.
- Project experience.
- Role preference.
- Location/work-mode compatibility.
- Availability.
- Company-specific mandatory criteria.

The system should clearly show why a student matched a role and which requirements remain unmet.

## 12. Internship Workspace

- Student task list.
- Project board.
- Documents/resources.
- Meetings and mentor sessions.
- Submission and review workflow.
- Feedback history.
- Performance timeline.
- Issue/escalation mechanism.
- Company announcements.
- Internship completion status.

## 13. PPO Management

### 13.1 PPO Criteria

- Each company defines its own measurable criteria.
- Criteria may include technical performance, project delivery, attendance, communication, mentor rating, final assessment and business requirements.
- Criteria and thresholds should be versioned and auditable.
- Students should see the criteria that apply to them.

### 13.2 PPO Workflow

1. Company defines PPO criteria during partnership/program setup.
2. Student enters company internship.
3. Performance evidence is collected throughout the internship.
4. System calculates progress against criteria.
5. Final company evaluation is completed.
6. InterHive marks the student as Eligible / Not Eligible / Pending Review.
7. Company makes the final offer decision according to its agreement and hiring process.
8. PPO document/status is recorded in the student's profile when issued.

## 14. Verified Talent Profile / PPO Passport

- Verified identity and education information.
- Assessment results.
- Training certifications.
- Projects with evidence and mentor/company verification.
- Internship history.
- Skill proficiency.
- Performance history visible only to authorized parties.
- PPO status and relevant offer documentation.
- Shareable public profile with privacy controls.

## 15. Admin / Operations Dashboard

- Student pipeline: applications, assessments, selections, training, matching, internships, PPO.
- Cohort management.
- Training module management.
- Trainer/mentor assignment.
- Company and MOU management.
- Role requirement management.
- Matching review and override.
- Internship monitoring.
- PPO tracking.
- Reports and exports.
- Notifications.
- Audit logs.
- Role-based permissions.

## 16. Notifications

- Application received.
- Assessment scheduled.
- Assessment result.
- Selection/rejection.
- Training reminder.
- Assignment deadline.
- Mentor feedback.
- Company match.
- Interview invitation.
- Internship start/end reminders.
- Performance review.
- PPO eligibility update.
- PPO/offer notification.

**Channels:** in-app first; email and WhatsApp/SMS can be added through approved integrations.

## 17. Core Data Entities

- User
- Student Profile
- Company
- Company User
- MOU / Partnership
- Program
- Cohort
- Role Requirement
- Application
- Assessment
- Question
- Assessment Attempt
- Training Module
- Course
- Assignment
- Project
- Mentor
- Company Match
- Internship
- Performance Review
- PPO Criteria
- PPO Decision
- Certificate
- Notification
- Audit Log

## 18. Key Screens / Information Architecture

| Area | Primary Screens | Priority |
|---|---|---|
| Public | Home, About, PPO Program, For Interns, For Companies, Partners, FAQs, Contact | P0 |
| Student | Dashboard, Profile, Assessments, Training, Projects, Company Matching, Internship, Performance, PPO Passport, Certificates | P0 |
| Company | Dashboard, Company Profile, Requirements, Candidates, Matching, Interns, Projects, Evaluations, PPO | P0 |
| Admin | Dashboard, Students, Companies, Programs, Cohorts, Training, Matching, Internships, PPO, Reports, Settings | P0 |
| Trainer/Mentor | Assigned Students, Curriculum, Reviews, Attendance, Projects, Feedback | P1 |

## 19. MVP Scope (Phase 1)

- Student registration/profile.
- Company registration/profile.
- Program and cohort management.
- Assessment engine.
- Selection workflow.
- 2-month training LMS basics.
- Student readiness dashboard.
- Company role requirements.
- Basic rule-based candidate matching.
- Company internship tracking.
- Performance reviews.
- PPO criteria and eligibility tracking.
- Admin dashboard.
- Email/in-app notifications.
- Basic reporting.

## 20. Phase 2

- AI-assisted resume/profile analysis.
- AI-assisted skill-gap analysis.
- Advanced matching engine.
- Company-specific curriculum generation.
- Coding assessment environment.
- Advanced project management.
- Verified public talent profiles.
- WhatsApp notifications.
- College/institution partnerships.
- Analytics and benchmarking.

## 21. Phase 3

- Mobile/PWA experience.
- Advanced AI career coach.
- Predictive risk alerts for internship completion (decision support only).
- Automated portfolio generation.
- Digital product marketplace.
- Multi-company talent pools.
- API integrations with ATS/HR systems.
- Advanced enterprise analytics.

## 22. Non-Functional Requirements

- Responsive web application with mobile-first student experience.
- Secure authentication and role-based authorization.
- Encryption in transit and at rest for sensitive information.
- Auditability of selection, evaluation and PPO decisions.
- Scalable architecture for multiple cohorts and companies.
- Accessible UI and clear status communication.
- Reliable backups and disaster recovery.
- Privacy controls for student/company data.
- Performance target: key dashboard pages should load quickly under normal network conditions.
- Observability: application logs, errors, uptime and critical workflow monitoring.

## 23. Suggested Technical Architecture

- **Frontend:** Next.js / React.
- **Backend:** FastAPI or Node.js service layer.
- **Database:** PostgreSQL.
- **Authentication:** secure session/OAuth/JWT architecture depending on deployment.
- **Object storage:** S3-compatible storage for resumes, certificates and project evidence.
- **Background jobs:** Redis + worker queue where required.
- **Analytics:** event tracking + product analytics dashboard.
- **Deployment:** cloud infrastructure with CI/CD and environment separation.
- **AI services:** isolated service layer so AI recommendations can be audited and overridden by authorized staff.

## 24. Security & Privacy

- Role-based access control for student, company, mentor, trainer and admin data.
- Students should not see private evaluations intended only for company/admin users.
- Companies should only access candidates and interns associated with their programs.
- Resume and identity documents require controlled access.
- Maintain audit logs for changes to selection, scores, evaluation and PPO status.
- Provide data retention and deletion policies consistent with applicable law and contractual obligations.

## 25. Success Metrics / KPIs

| Metric | Definition | Why It Matters |
|---|---|---|
| Assessment Completion Rate | Selected applicants completing required assessments | Measures funnel engagement |
| Training Completion Rate | Students completing the 2-month program | Measures readiness program execution |
| Company Match Rate | Eligible students matched to a company role | Measures supply-demand fit |
| Internship Start Rate | Matched students who actually start internships | Measures operational conversion |
| Internship Completion Rate | Students completing the company internship | Measures program quality |
| PPO Eligibility Rate | Interns meeting documented PPO criteria | Measures readiness/performance |
| PPO Offer Rate | Eligible students receiving offers from partner companies | Measures hiring outcome |
| Company Satisfaction | Company rating/feedback after program | Measures B2B value |
| Student Satisfaction | Student feedback/NPS-style measure | Measures B2C value |
| Time-to-Fill | Days from company requirement to accepted intern | Measures employer efficiency |

## 26. Critical Product Principles

- **Transparent:** students should understand where they stand and what remains.
- **Evidence-based:** scores and status should be backed by assessments, projects and reviews.
- **Company-specific:** training and evaluation should map to actual employer requirements.
- **Outcome-oriented:** measure internship and hiring outcomes, not only registrations.
- **Human-controlled:** AI may assist assessment/matching, but authorized humans must be able to review and override important decisions.
- **Fair:** selection criteria should be documented, consistently applied and monitored for unintended bias.
- **Trustworthy:** never represent a company partnership, job, PPO guarantee, salary or placement outcome unless it is actually secured and documented.

## 27. Example Student Dashboard

**Header:** "Welcome back, [Student]"
**Program:** PPO Track — [Role]
**Progress:** 60%
**Journey:** Selected → Training → Company Match → Company Internship → Evaluation → PPO

- Current Stage card.
- Training completion card.
- Company match card.
- Performance overview.
- Tasks and deadlines.
- PPO readiness / criteria tracker.
- Mentor feedback.
- Verified projects.

## 28. Example Company Dashboard

**Header:** "Talent Pipeline — [Company]"

- Open requirements.
- Candidates recommended.
- Match scores.
- Training/readiness status.
- Selected interns.
- Current intern performance.
- Upcoming reviews.
- PPO decisions due.
- Hiring analytics.

## 29. Example User Stories

- As a student, I want to complete an assessment so that I can know whether I qualify for a PPO Track.
- As a selected student, I want a training plan so that I know what I need to learn before joining a company.
- As a student, I want to see my readiness score so that I know where I need improvement.
- As a company, I want to submit role requirements so that InterHive can provide relevant candidates.
- As a company mentor, I want to review projects and provide feedback so that intern performance is documented.
- As a student, I want to know the PPO criteria applicable to my program so that there are no surprises at the end.
- As an admin, I want to track every cohort from selection through PPO so that I can identify bottlenecks.
- As a recruiter, I want verified project and assessment evidence so that I can evaluate candidates faster.

## 30. MVP Acceptance Criteria

- A student can register, complete a profile, apply to a program, and complete assigned assessments.
- Admin can configure pass criteria and move students through selection states.
- Selected students can access the training curriculum and completion tracking.
- Admin/trainers can assign mentors, projects and assessments.
- Company users can create requirements and view eligible/matched candidates.
- The platform can record company internship start/end dates and performance reviews.
- PPO criteria can be configured per company/program and progress can be calculated.
- Authorized users can record the final PPO decision.
- Students can view their journey, current stage and relevant progress.
- All critical status changes are timestamped and auditable.

## 31. Launch Roadmap

| Stage | Focus | Deliverables |
|---|---|---|
| Stage 1 | Foundation | Auth, profiles, roles, company onboarding, database, admin. |
| Stage 2 | Selection | Applications, assessments, scoring, selection workflow. |
| Stage 3 | Training | LMS, curriculum, projects, mentors, readiness score. |
| Stage 4 | Matching | Company requirements, candidate matching, shortlist. |
| Stage 5 | Internship | Workspace, tasks, reviews, attendance, performance. |
| Stage 6 | PPO | Criteria, eligibility, decision workflow, offer records. |
| Stage 7 | Scale | AI assistance, mobile/PWA, analytics, ATS/HR integrations. |

## 32. Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| PPO expectation mismatch | Publish company-specific criteria and clearly distinguish eligibility from an unconditional guarantee. |
| Weak company demand | Secure signed partnerships/MOUs and role forecasts before scaling student intake. |
| Training not aligned with roles | Map curricula to company requirements and refresh modules regularly. |
| Subjective evaluation | Use measurable rubrics, multiple evidence sources and auditable reviews. |
| Students drop during training | Use milestone tracking, mentor support, reminders and clear expectations. |
| Data/privacy risk | Implement RBAC, encryption, audit logs and controlled sharing. |
| AI bias or incorrect recommendations | Keep human review/override and monitor outcomes. |
| Overpromising employer names/outcomes | Show only verified partnerships and documented outcomes. |

## 33. Recommended Homepage Messaging

**Hero:** "From Selection to PPO."

**Subheadline:** "Train for 2 months with InterHive. Intern for 4 months with a partner company. Track your performance. Build a clear path toward full-time hiring."

**Primary CTA:** "Join the PPO Track"

**Secondary CTA:** "Partner With InterHive"

**Core visual:** a seven-step journey — Apply & Assess → Selection → 2-Month Training → Company Matching → 4-Month Internship → Performance Evaluation → PPO.

## 34. Definition of Done for the Core Product

- Student, company, mentor/trainer and admin roles work end-to-end.
- A real student can complete the entire selection-to-internship journey without manual database edits.
- A real company can submit a requirement and review a controlled candidate pool.
- Training progress and internship performance are recorded as structured data.
- PPO criteria are visible and traceable.
- Every final status can be explained using evidence and audit history.
- The platform is ready for a controlled pilot with at least one verified company partnership and one student cohort.

## 35. Final Product Statement

InterHive should be positioned as a structured student-to-employer talent pipeline: students are assessed and selected, trained before entering the company, matched to relevant roles, evaluated during real industry work, and given a transparent path toward PPO based on documented criteria.

The product's strongest differentiator is not the internship listing itself; it is the combination of pre-company training, company-specific matching, measurable performance, and an auditable transition from internship to full-time hiring.

---

*InterHive PRD v1.0*
