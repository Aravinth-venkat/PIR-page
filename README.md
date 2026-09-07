# RED – PIF Requirement Intake – Enhanced V3

Frontend-only ServiceNow-style prototype.

## What is enhanced in this version

### Approval
- Identifies the current approval-owning system.
- Supports ServiceNow, SAP, ETR, and other applications.
- Captures approval levels, approvers, information, and actions.
- Captures what should happen in the source system after Approve/Reject/etc.
- Separately captures proactive approval notification requirements.
- Separately captures reminder requirements and supported reminder schedules.
- Includes a suggested action-button preview.

### Alert / Notification
- Supports Proactive, Reminder, or Both through checkbox selection.
- Proactive details appear only when selected.
- Reminder details appear only when selected.
- Captures source system/event and templates.

### Business Query
- Requires 7–10 example utterances.
- Captures source system.
- Captures retrieved data and displayed fields.
- Captures result display format.
- Captures optional action buttons such as View Details, Open Record, Approve, Reject, Submit, Retry, Refresh, Back, Cancel.

### Guided Path
- Captures the process and question sequence.
- Captures the final action/button.
- If redirected outside Red, captures target application, reason, and data passed.

### Enhancement
- Captures existing Red IDs and utterances.
- Supports multiple change areas.
- Includes Buttons / Actions as an enhancement category.
- Captures affected source system.

### Integration
- Explicitly asks whether integration is required.
- Captures system type:
  - ServiceNow
  - SAP
  - ETR
  - Other third-party application
  - Internal application
  - Database
  - Multiple systems
- Captures system name.
- Captures whether Red gets data, sends data, updates data, or triggers an action.
- Captures data sent and received.
- Captures API/Postman/documentation details.
- Captures APIGEE/wrapper details.
- Captures requirements from the application/third-party team.

### Technical owner
Becomes mandatory when integration is required.

## Deployment
This package is static HTML/CSS/JavaScript and can be hosted using GitHub Pages.

If the repository is `Aravinth-venkat/PIR-page`, the normal GitHub Pages project URL is:
`https://aravinth-venkat.github.io/PIR-page/`

A genuinely different public website hostname requires either:
1. a separate GitHub repository with its own Pages URL, or
2. a custom domain/subdomain configured to GitHub Pages.

Changing the ZIP/package does not by itself create a new public URL.

## No backend
This version does not:
- create ServiceNow records
- call ServiceNow/SAP/ETR APIs
- store uploaded files remotely
- authenticate users
- send real notifications
- send real approval/reminder messages

It is intentionally a frontend prototype for validating the question/form design.
