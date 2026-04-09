
### 🌐 SEAS Public (`seas-public`)
*Focus: Candidate lifecycle from registration to final results.*

#### **1. Authentication & Onboarding**
*   **Login**: JWT-based entry with "Keep me logged in" option.
*   **Register**: Identity creation (First Name, Last Name, Email, Phone, Password).
*   **OTP Verification**: 6-digit verification screen (triggered after registration).
*   **Password Recovery**: "Forgot Password" (Email) & "Reset Password" (Token + New Password).

#### **2. Candidate Workspace (The Hub)**
*   **Dashboard**: A high-fidelity dashboard featuring:
    *   **Application Stepper**: Visual timeline showing progress (Bio-data → Documents → Payment → Exam → Results).
    *   **Identity Card**: Displays `CandidateNumber` once generated.
    *   **Actionable Alerts**: "Your transcript was rejected. Re-upload here."
*   **Profile Management**: Update `Gender`, `DOB`, `Nationality`, and `Address`. Includes **Profile Photo upload**.

#### **3. The Application Journey (Multi-Step)**
*   **Program Selection**: Browse active `Programs` with details on requirements and duration.
*   **Academic Records**: Dynamic table to add multiple institutions (Institution Name, Degree, Field of Study, Grade, Dates).
*   **Supporting Documents**: Targeted upload slots for `ID_CARD`, `PASSPORT`, `PHOTO`, `CERTIFICATE`, and `TRANSCRIPT`.
*   **Personal Statement**: Markdown/RichText editor for the application's core letter.
*   **Submission Summary**: Final "Lock-in" page to verify all data before it hits the Admin queue.

#### **4. Finance & Logistics**
*   **Payment Hub**: View dynamic fees, upload bank receipts (`receiptFile`), and input `amount` and `date`.
*   **Exam Hub**: View assigned `ExamCenter` (Location mapped), `ExamSession` (Time), and `SeatNumber`.
*   **PDF Slip Downloader**: A dedicated view to generate and print the official Exam Entry Slip.

#### **5. Results & Notifications**
*   **Scorecard**: Subject-by-subject score breakdown (`ResultScore`) plus total `rank`.
*   **Notification Inbox**: Threaded view of all system-triggered messages.

---

### 🏛️ SEAS Admin (`seas-admin`)
*Focus: Governance, verification, and large-scale coordination.*

#### **1. Operations Center**
*   **Dashboard**: Data visualization of the intake (Total Revenue, Applicant count by Program, Document verification progress).
*   **Audit Logs**: (Optional but recommended) Viewing admin activities.

#### **2. Candidate & Identity Management**
*   **User Directory**: Master list of all registered identities.
*   **Candidate Search**: Deep filter by candidate number, email, or status.
*   **Detail View**: Full profile audit, with manual activation/deactivation toggles.

#### **3. Verification Queues (The "Work" Pages)**
*   **Application Review**: Queue of "Submitted" apps. Detail page allows "Approve" or "Reject" with typed notes.
*   **Document Verification**: specialized image viewer for verifying certified documents with status toggles.
*   **Payment Reconciliation**: Interface to verify uploaded receipts against bank statements and approve `Payment` status.

#### **4. Logistics & Exam Engine**
*   **Session Manager**: CRUD for `ExamSession` (scheduling dates/times).
*   **Center Manager**: Control seat capacities and physical coordinates of `ExamCenters`.
*   **Allocation Dashboard**: Control panel to trigger the "Seat Assignment" algorithm and view assignment statistics.

#### **5. Results Processing**
*   **Score Entry**: Individual candidate search-and-entry for subject marks.
*   **Bulk Import**: CSV listener to import marks for thousands of candidates simultaneously.
*   **Publication Control**: Master switch to set results to `PUBLISHED` status across the platform.

#### **6. System Configuration**
*   **Program Manager**: Manage available departments (Codes, Duration, Requirements).
*   **Global Notifications**: Form to broadcast alerts to specific candidate segments.

---

### 📐 Technical Layouts
Both apps will share a **Modern Sidebar Layout** with a collapsible menu, a top notification bar, and a responsive main container.

Would you like me to start by generating the **Tailwind CSS Config** and **Global Themes** for these two applications?