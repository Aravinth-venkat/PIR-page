# RED PIF Requirement Intake – Progressive V4

This version changes the interaction model based on feedback:

## No Next / Back / Save Draft buttons
The form is progressive. The user makes a selection or enters the required information, and the next relevant section automatically appears.

Example:
1. Select Approval
2. Business Requirement appears
3. Complete the business requirement
4. Current & Future Process appears
5. Complete the process
6. Approval-specific questions appear
7. Integration question appears
8. Technical/Security/Project sections progressively appear
9. Review is generated automatically

## Conditional behavior
- Approval has separate proactive and reminder requirements.
- Alert/Notification supports Proactive, Reminder, or Both.
- Guided Path only shows external handoff questions when Yes is selected.
- Business Query requires 7–10 utterances.
- Enhancement requires 3–5 existing utterances.
- Integration supports ServiceNow, SAP, ETR, other third parties, internal applications, databases, and multiple systems.
- Technical owner becomes mandatory when integration is Yes.
- API/APIGEE details are captured when integration is required.
- Result/action buttons are captured for Business Query and enhancement requirements.
- Approval includes action-button preview.

## Prototype
No backend, ServiceNow record creation, real API calls, real notifications, authentication, or remote file storage are included.
