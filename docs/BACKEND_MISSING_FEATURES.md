# Backend Gap Analysis: Missing Features & Enhancements

This document identifies backend features required by the designed user interfaces that are currently missing or partially implemented in the SEAS backend.

---

## 1. Analytics & Dashboards
*The current backend has basic CRUD but lack aggregation logic for dashboards.*

- **[ ] Dashboard Stats Endpoint**: A centralized endpoint to return:
  - Total applicants vs. Active applicants.
  - Revenue summary (Sum of verified payments).
  - Document verification progress (%) for Admin.
- **[ ] Program-wise Distribution**: Aggregation query to show application volume per academic program.

## 2. Advanced Authentication
*The core auth is solid, but the recovery and verification flows need refinement.*

- **[ ] OTP Management**: Service to generate, store (with expiry), and verify 6-digit codes during candidate onboarding.
- **[ ] Password Reset Flow**: Token-based password reset logic with email integration.
- **[ ] Session Security**: Logic to invalidate old JWTs if a password is changed.

## 3. Exam & Logistics Engine
*The entities exist, but the "intelligence" layer is missing.*

- **[ ] Automated Allocation Algorithm**: Logic to fill `ExamCenters` based on their `capacity`, prioritizing by application date or proximity.
- **[ ] Adaptive Seat Numbering**: Logic to generate unique, sequential seat numbers within a session/center.
- **[ ] PDF Slip Generation**: Integration of a PDF library (`puppeteer` or `pdfkit`) to generate a print-ready Admission Slip containing the candidate's photo and exam details.

## 4. Results & Academic Processing
*Ranking and bulk handling are complex tasks not yet in the services.*

- **[ ] Ranking Logic**: A service to calculate `totalScore` and compute `rank` across all candidates in a specific program/session.
- **[ ] Bulk Result Importer**: A CSV/Excel parser that maps candidate numbers to subject scores (`ResultScore`) for massive data entry.
- **[ ] Results Lifecycle**: Logic to "Freeze" results and then "Publish" them globally (updating `publishedAt` and notifying candidates).

## 5. Communications & Audit
- **[ ] Smart Broadcasting**: Logic to target notifications by segment (e.g., "Send to all candidates in the Robotics program who haven't paid").
- **[ ] Admin Audit Logs**: A system-wide middleware to log sensitive admin actions (e.g., result publication, application deletion) for accountability.

## 6. Infrastructure Extras
- **[ ] System Health Check**: A public `/api/health` endpoint for uptime monitoring and CI/CD status indicators.
- **[ ] Public Statistics**: Aggregated public data (e.g., "300 seats available") for the Landing Page.
