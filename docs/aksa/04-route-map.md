# Target Route Map

Routing is implemented in B1. This document defines the target contract only.

## Public

```text
/
/programs
/programs/:programId
/mentors/:mentorId
/blog
/blog/:slug
/contact
/login
/register
```

## Learner

```text
/app
/app/learn
/app/learn/:lessonId
/app/path
/app/labs
/app/labs/:labId
/app/practice
/app/projects
/app/projects/:projectId
/app/assessment
/app/ai
/app/mentors
/app/live
/app/progress
/app/portfolio
/app/passport
/app/career
/app/calendar
/app/wallet
/app/downloads
/app/profile
/app/settings
```

## Educator

```text
/educator
/educator/students
/educator/classes
/educator/questions
/educator/sessions
/educator/calendar
/educator/materials
/educator/assessments
/educator/reviews
/educator/earnings
/educator/settings
```

## AKSA Studio

```text
/studio
/studio/editor/:contentId
/studio/templates
/studio/media
/studio/factory
/studio/validation
/studio/review
/studio/published
/studio/analytics
/studio/settings
```

## Academic / platform administration

```text
/admin
/admin/curriculum
/admin/skills
/admin/sources
/admin/assessment-bank
/admin/educators
/admin/institutions
/admin/partners
/admin/credentials
/admin/access-fund
/admin/audit
/admin/settings
```

## Guard model

Routes must use role/capability guards, not scattered `if (user.role === ...)` checks.
