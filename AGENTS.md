# AGENTS.md — Session Log

## Goal
Fix and stabilise the multi-step application portal, admin candidate management, manual score entry, and dashboard visibility across both portals and backend.

## Constraints & Preferences
- Backend runs in Docker `app` container; compiled JS in `/app/dist/` must be updated directly or image rebuilt.
- TypeORM `synchronize: true` in development handles schema changes.
- All validation changes must allow empty strings (`allow('')`) on optional fields and nullable columns on entities.
- Step order on public portal: BioData(1) → ProgramSelection(2) → AcademicRecords(3) → DocumentCenter(4) → Payment(5) → ReviewSubmit(6).

## Progress
### Done
- **ApplicationsQueue names fixed** – `getInitials`, name/email display now read from `candidate.user.firstName`/`lastName`/`email` (nested) with fallback to flat fields.
- **ResetPasswordPage wired to API** – Now reads `token` from URL query params and calls `adminAuthApi.resetPassword()` instead of just showing a toast.
- **SetupPasswordPage uses API module** – Replaced hardcoded `fetch('http://localhost:3000/...')` with `useSetupPassword` mutation hook and toast error handling.
- **API consistency fixed** – `notificationsApi`, `usersApi`, `systemApi` all return `response.data.data` consistently with other API modules.
- **ConfirmSubmissionModal dynamic** – Candidate count and subject list now come from actual pending scores data instead of hardcoded "Advanced Thermodynamics (ME-305)" / "114 Students".
- **ScoreEntry per-row error reporting** – `handleConfirmSubmission` catches individual failures and reports which rows failed instead of generic "Failed to commit changes".
- **ADD ROW candidate picker** – Replaced text-input modal with a searchable list of approved candidates. Click a name to add their row with correct UUID.
- **Docker container restarted** – Container had crashed from corrupted JS; fixed the file and restarted.
- *(Earlier: Candidates/AcademicRecords validation, step order swap, PaymentStep fix, CandidatesPage fixes, candidate types, ProfilePage, chart colors, subject rename, manual score entry 400 fix, results publish 404 fix, candidate names in score entry, score minimum threshold, NotificationStatusCard warning removed, add row candidate picker)*

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- Swap step 2 and 3 rather than create the application earlier, because program selection is the natural step to initialise the application record.
- Allow pending payment in PaymentStep because only the final submit needs verified payment; admin verification can happen later.
- Remove Program column from CandidatesPage (instead of adding a backend join) because the info is available on the Applications Queue page.
- Subject names updated to Mathematics, Case Study, English Language to match the user's curriculum.

## Next Steps
- Verify candidate can complete the full application flow → submit → admin approval → exam assignment → score publication.
- If manual score entry still fails, check the `ScoreEntry.tsx` parent component to ensure `handleCommitScores` passes the correct data shape to the API.
- Verify that `POST /api/results/scores` works end-to-end with Docker backend logs.

## Critical Context
- Docker `app` container runs production build (`node dist/server.js`); edits to `.ts` source files alone have no effect until recompiled or the compiled `.js` is manually patched in `/app/dist/`.
- The `handleAddRow` in ManualScoreTable creates entries with `applicationId: ''` — these are display-only rows and must be filtered out before committing.
- `candidates.list` API returns `CandidateProfile` with nested `user` object; frontend types originally lacked the `user` property.
- `AcademicRecord` entity's `start_date` column was `NOT NULL` — made nullable to accept empty forms.

## Relevant Files
- `seas-backend/src/modules/candidates/candidates.validation.ts`
- `seas-backend/src/modules/academic-records/academic-records.validation.ts`
- `seas-backend/src/database/entities/AcademicRecord.ts`
- `seas-public/src/pages/application/ApplicationPage.tsx` (step order)
- `seas-public/src/pages/application/components/PaymentStep.tsx`
- `seas-admin/src/pages/CandidatesPage.tsx`
- `seas-admin/src/types/entities.ts` / `seas-public/src/types/entities.ts`
- `seas-public/src/pages/profile/ProfilePage.tsx`
- `seas-admin/src/pages/DashboardPage.tsx` (chart colors)
- `seas-admin/src/components/score-entry/ManualScoreTable.tsx`
- `seas-admin/src/pages/ScoreEntry.tsx`
- `seas-backend/src/modules/results/results.validation.ts`
- `seas-backend/src/modules/results/results.routes.ts`
- `seas-backend/src/modules/results/results.repository.ts`
- `seas-backend/src/database/entities/Result.ts`
