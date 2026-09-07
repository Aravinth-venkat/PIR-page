# RED – PIF Requirement Intake V5

## Interaction model
This is a progressive frontend-only requirement form. It does not use Next, Back or Save Draft buttons.

The next section becomes available when the preceding required information is complete. Within each section, conditional questions appear immediately when the user changes a selection.

## Integration/API coverage
The integration section specifically captures:

- System type: ServiceNow, SAP, ETR, other third-party, internal application, database, or multiple systems.
- System/application name.
- Integration direction: GET/Fetch, POST/Create, PUT/Update, PATCH, DELETE, or trigger action.
- Number of planned API methods/endpoints.
- Method-level details for each planned method:
  - operation name
  - HTTP method
  - endpoint
  - purpose
  - parameters
  - request body
  - expected response
  - errors
- Postman collection availability.
- Postman collection upload when available.
- API documentation availability and upload.
- APIGEE/API wrapper status.
- Existing APIGEE/wrapper URL and details when it exists.
- A creation/provisioning plan when no wrapper exists.
- Technical confirmation contact when wrapper status is not known.
- Authentication.
- Headers.
- Environment.
- Request/response examples.
- Error handling.
- What the application/third-party team needs from Red.

## Approval
Approval captures the source approval system, levels, approvers, actions and the source-system outcome. Proactive notification and reminder requirements are captured separately.

## Alert / Notification
Users can select Proactive, Reminder, or Both. Only the relevant follow-up fields are displayed.

## Business Query
Requires 7–10 example user questions/utterances.

## Guided Path
External application handoff fields appear only when redirection is Yes.

## Enhancement
Requires 3–5 existing utterances and captures every affected area including APIs, data, notifications, approval logic and buttons/actions.

## Validation
Required fields are enforced before submission. Postman upload becomes required when the user says a Postman collection is available. APIGEE wrapper details/creation plan are required according to the selected wrapper status. Technical owner is required when integration is Yes.

## Prototype limitation
No real ServiceNow record creation, API calls, APIGEE calls, notifications, authentication, backend storage or file upload to a server are implemented. Uploaded files remain local to the browser during the session.
