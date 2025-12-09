
# **A Strategic Blueprint for Automating Scheduling Infrastructure with the Cal.com API**

## **Strategic Foundations for API-Driven Automation**

### **Executive Summary: The "Configuration as Code" Imperative**

For a growing academic editing service, managing scheduling—coordinating editors, defining service offerings, and handling client bookings—can quickly become a significant source of administrative overhead. The traditional approach of manual configuration through a web-based user interface is prone to human error, lacks a verifiable history of changes, and is difficult to scale or replicate. This report outlines a strategic transition to a "Configuration as Code" (CaC) model for managing the Cal.com scheduling platform.

By leveraging Cal.com's comprehensive, API-driven architecture 1, this approach treats the entire scheduling configuration as a version-controlled codebase. Every element—from editor profiles and their availability to specific service types and automated reminders—is defined in scripts and configuration files. The strategic advantages of this model are substantial:

* **Repeatability:** In the event of an account issue or the need to establish a new team, the entire configuration can be redeployed programmatically in minutes, ensuring business continuity.  
* **Version Control:** Storing configuration in a Git repository provides a complete, auditable history of every change, detailing who made the change, when, and why.  
* **Quality Assurance:** Changes can be submitted through a formal review process (e.g., pull requests), allowing for peer review and validation before being applied to the live system.  
* **Scalability:** On-boarding new editors or launching new service lines becomes a matter of updating a configuration file and running a script, eliminating repetitive and error-prone manual tasks.

This blueprint transforms Cal.com from a simple SaaS tool into a programmable, auditable, and robust component of the business's operational infrastructure.

### **Navigating the Cal.com API Landscape: v1 vs. v2**

The Cal.com API is available in two major versions, v1 and v2. The documentation clearly indicates that v2 is the modern, feature-rich iteration, offering a wider array of endpoints, particularly for managing organizations, teams, and platform-specific features.2 While some v1 endpoints remain functional, a forward-looking strategy must be built exclusively on the v2 API. This ensures access to the latest capabilities, aligns with Cal.com's development trajectory, and avoids reliance on functionality that may be deprecated in the future. All subsequent recommendations and implementation details in this report will target the v2 API unless a specific, necessary function is only available in v1.

### **Foundational Architectural Decision: Authentication and User Model**

Before writing a single line of code, a critical architectural decision must be made regarding the user management model. The Cal.com API offers two distinct approaches, and selecting the correct one is paramount to avoiding unnecessary complexity.

* **Model A: Standard Organization/Team Model:** This model is designed for businesses managing their own internal staff. Editors are created as standard users within a Cal.com organization. All API interactions are authenticated using a single, long-lived API key generated from the Cal.com settings panel.4 This key grants broad permissions to manage the organization's resources. API interactions primarily use the /v2/organizations/{orgId}/users endpoints for user management.6  
* **Model B: The Platform Model:** This model is designed for developers building scheduling functionality *into their own multi-tenant software product*. It uses a more complex OAuth 2.0 flow with client IDs and secrets. The end-users of the software are represented in Cal.com as "managed users," who do not have their own Cal.com accounts.7 This model requires managing short-lived access tokens and refresh tokens for each managed user.9

For an academic editing service managing its own team of editors, **Model A is the unequivocally correct choice.** The business's use case directly maps to the concept of an organization with internal members. Adopting this model dramatically simplifies the entire implementation by allowing the use of a single, securely managed API key and focusing development on the more straightforward Orgs / Users API endpoints. The Platform model would introduce a significant and unnecessary layer of OAuth complexity designed for a completely different business context.

### **API Security and Key Management Principles**

The API key generated for the organization (cal\_live\_...) is a powerful credential that must be treated as a highly sensitive secret.5 The foundational principle for its management is that of **least privilege**. While the key itself has broad access, its exposure should be minimized at all costs. The security strategy, detailed further in Section 4, will be built on several core tenets: secure storage (never committing keys to source code), controlled access through secure environments, a policy for regular key rotation, and monitoring for anomalous usage.10

## **Phase 1: Architecting the Initial System Blueprint**

This phase involves creating a series of interdependent scripts to programmatically construct the entire scheduling infrastructure from the ground up. Each script should be designed to be run once for the initial setup, building upon the resources created by the previous script.

### **Provisioning the Organization and Team Structure**

The foundational container for all configuration is the Team. The first script in the sequence will create the primary team that will house all editors and their associated event types.

* **API Endpoint:** POST /v2/organizations/{orgId}/teams 3  
* **Process:** The script will execute a POST request with the team's name (e.g., "Academic Editors"). The response will contain a unique teamId. This ID is critical and must be captured and stored (e.g., in a configuration file or as an output variable) as it will be a required parameter for nearly all subsequent scripts.

### **On-boarding the Initial Cohort of Editors**

With the team structure in place, the next step is to provision user accounts for the initial group of editors. This process should be data-driven to ensure consistency and ease of management.

* **API Endpoint:** POST /v2/organizations/{orgId}/users 6  
* **Process:** A configuration file (e.g., editors.json or editors.yaml) should be created and stored in version control. This file will act as the source of truth for all personnel.  
  JSON

  The on-boarding script will read this file, iterate through the list of editors, and make a POST request for each one, configuring key parameters such as email, timeZone, and organizationRole.6

### **Engineering Complex Availability and Schedules**

Defining when editors are available is a multi-step process that involves a hierarchical relationship between Schedules and Availabilities. A Schedule is a named container for a working pattern (e.g., "Standard Hours"), while an Availability is a specific time block within that schedule (e.g., "Mondays from 9:00 to 17:00").

* **Step 1: Create Named Schedules:** The script will first create the reusable Schedule objects.  
  * **API Endpoint:** POST /v2/schedules 3  
  * **Process:** For each common working pattern (e.g., "Standard Weekday Hours," "Weekend-Only Hours"), a POST request is made with the schedule's name and default timeZone. The returned scheduleId for each is stored.  
* **Step 2: Add Availability to Schedules:** Next, these schedules are populated with specific time blocks.  
  * **API Endpoint:** POST /v1/availabilities 13  
  * **Process:** For each scheduleId created in Step 1, one or more POST requests are made to this endpoint. The request body specifies the scheduleId it belongs to, the days of the week (e.g., days: for Monday-Friday), and the startTime and endTime for that block. This allows for the creation of complex schedules, such as split days (e.g., 9:00-12:00 and 13:00-17:00).  
* **Step 3: Assign Default Schedules to Users:** Finally, each editor is linked to their primary working schedule.  
  * **API Endpoint:** PATCH /v2/organizations/{orgId}/users/{userId} 6  
  * **Process:** The script updates each user object, setting the defaultScheduleId field to the appropriate ID generated in Step 1\.

### **Defining Service Offerings as Event Types**

The business's services must be translated into Event Type objects in Cal.com. These represent the bookable appointments that clients will see.

* **API Endpoint:** POST /v2/teams/{teamId}/event-types 14  
* **Process:** Similar to editor on-boarding, this script will be data-driven, reading from a configuration file that defines each service (e.g., "30-Minute Proofreading," "1-Hour Dissertation Review"). The script will create each event type under the team, allowing for both individual assignment and round-robin scheduling where a client books with the next available editor.15  
* **Key Parameters:** The script will configure crucial fields like title, slug (the URL-friendly name), lengthInMinutes, description, and scheduleId (to link the service to a specific availability schedule). For paid services, it will also set the price and currency. Custom questions, such as a field for clients to provide a document link, can be added via the bookingFields parameter.14

### **Programmatic Integration Setup (Calendars, Conferencing, Payments)**

Automating the connection to external services like Google Calendar, Zoom, and Stripe is a hybrid process. The API can be used to generate the necessary authorization links, but a one-time manual user action (granting consent) is typically required for each editor.

* **Google Calendar & Video Conferencing (e.g., Zoom):**  
  * **API Endpoint:** GET /v2/oauth/connect or similar endpoints for specific conferencing apps.3  
  * **Process:** The setup script will generate a unique authorization URL for each editor. The administrator must then provide this URL to the editor, who must visit it, log in to their Google/Zoom account, and approve the connection. For self-hosted Cal.com instances, this process is more involved and requires setting Google API credentials as environment variables in the Cal.com server configuration.16  
* **Stripe for Payments:**  
  * **API Endpoint:** GET /v2/stripe/connect 3  
  * **Process:** A similar one-time process where the script generates a connection URL that the business owner must visit to link their Stripe account to Cal.com.  
* **Verification:** After the manual consent step, a verification script can be run to confirm the integrations are active for each user by calling endpoints like GET /v2/credentials (v1) or GET /v2/conferencing (v2).3

### **Establishing Core Automation Rules: Workflows & Webhooks**

The final step in the initial blueprint is to codify the business's communication and automation logic.

* **Workflows (Internal Automation):** These are rules that run within Cal.com, such as sending reminder emails.  
  * **API Endpoint:** POST /v2/organizations/{orgId}/teams/{teamId}/workflows 2  
  * **Process:** The script will create standard workflows, such as a "24-Hour Email Reminder." The request body will define the trigger (e.g., BEFORE\_EVENT) and the action (e.g., EMAIL\_ATTENDEE).17 While the API documentation lacks detailed parameter schemas for this endpoint, the conceptual structure allows for scripting based on the patterns observed in the UI.18  
* **Webhooks (External Automation):** These notify external systems of events happening within Cal.com.  
  * **API Endpoint:** POST /v2/webhooks 19  
  * **Process:** The script will create subscriptions to key events. For example, it can subscribe to the BOOKING\_CREATED event and provide a subscriberUrl pointing to an external automation platform (like Make or Zapier) or a custom serverless function.21 The payloadTemplate can be used to customize the data sent in the webhook.

The following table summarizes the primary API endpoints used to construct the initial system blueprint.

| Resource | HTTP Method | Endpoint Path | Purpose in Setup |
| :---- | :---- | :---- | :---- |
| Team | POST | /v2/organizations/{orgId}/teams | Create the main container for all editors and services. |
| User | POST | /v2/organizations/{orgId}/users | On-board the initial set of editors from a config file. |
| Schedule | POST | /v2/schedules | Create named containers for availability patterns (e.g., "Standard Week"). |
| Availability | POST | /v1/availabilities | Populate schedules with specific, bookable time blocks for each day. |
| Event Type | POST | /v2/teams/{teamId}/event-types | Define the bookable services offered by the business. |
| Workflow | POST | /v2/organizations/{orgId}/teams/{teamId}/workflows | Set up automated internal reminders and notifications. |
| Webhook | POST | /v2/webhooks | Subscribe to events to trigger external automations. |

## **Phase 2: The Operational Maintenance Playbook**

Once the initial system is deployed, the focus shifts from creation to ongoing maintenance. The "Configuration as Code" approach provides a robust framework for managing day-to-day operational tasks through a series of targeted, idempotent scripts.

### **User Lifecycle Management (On-boarding & Off-boarding)**

* **On-boarding a New Editor:** A single, comprehensive script should handle the entire on-boarding process. This script would:  
  1. Create the user account via POST /v2/organizations/{orgId}/users.6  
  2. Assign the user to the main team.  
  3. Assign a default working schedule by updating the user object via PATCH /v2/organizations/{orgId}/users/{userId} with the defaultScheduleId.6  
  4. Generate and output the one-time manual authorization links for their Google Calendar and any other required integrations.  
* **Off-boarding a Departing Editor:** A clean-up script is essential for security and operational integrity. This script must:  
  1. Query for all future bookings assigned to the departing editor using GET /v2/bookings.  
  2. Iterate through these bookings and reassign them to another editor or a team round-robin pool using POST /v2/bookings/{bookingId}/reassign/....2  
  3. Remove the user from the team.  
  4. Finally, delete the user account entirely via DELETE /v2/organizations/{orgId}/users/{userId}.6

### **Dynamic Configuration Management**

* **Managing Time Off:** A common operational task is managing editor vacations, sick leave, or other absences. A dedicated script can automate this, replacing manual UI clicks.  
  * **API Endpoints:** POST, PATCH, and DELETE on the /v2/organizations/{orgId}/users/{userId}/ooo/{oooId} endpoint are used to manage Out of Office entries.3  
  * **Process:** The script can be run from the command line, taking arguments for the editor's ID, a start date, an end date, and a reason (e.g., vacation, sick\_leave).25 This creates an OOO entry that automatically blocks the editor's availability for the specified period.  
* **Updating Service Offerings:** Changes to services—such as price adjustments, duration changes, or new offerings—should be managed through the version-controlled configuration file for event types.  
  * **API Endpoint:** PATCH /v2/event-types/{eventTypeId} 3  
  * **Process:** After updating the local configuration file, the setup script is re-run. This script must be idempotent; it should check if an event type with a given slug already exists. If it does, the script should perform a PATCH request to update it rather than a POST request, which would create a duplicate.

### **Auditing and Configuration Drift Detection**

A key benefit of the CaC model is the ability to detect "configuration drift"—changes made manually in the UI that deviate from the version-controlled source of truth.

* **API Endpoints:** GET /v2/event-types, GET /v2/schedules, GET /v2/organizations/{orgId}/teams/{teamId}/workflows, etc. 3  
* **Process:** An auditing script should be run on a regular schedule (e.g., weekly or as part of a CI/CD pipeline). This script fetches all key configuration objects from the Cal.com API and performs a deep comparison against the local configuration files. Any discrepancies are flagged for review, ensuring the Git repository remains the single source of truth.

### **Booking Administration and Reporting**

Scripts can be developed for various administrative tasks related to bookings.

* **API Endpoints:** GET /v2/bookings and POST /v2/bookings/{bookingId}/cancel 2  
* **Process:** A reporting script can use the GET /v2/bookings endpoint with query parameters to filter bookings by date range, editor ID, or status, exporting the data for invoicing or performance analysis. An administrative script can use the cancellation endpoint to programmatically cancel bookings when necessary.

The following table summarizes the primary API endpoints used for ongoing operational maintenance.

| Operational Task | HTTP Method | Endpoint Path | Business Use Case |
| :---- | :---- | :---- | :---- |
| On-board New Editor | POST | /v2/organizations/{orgId}/users | Add a new editor to the system. |
| Off-board Editor | DELETE | /v2/organizations/{orgId}/users/{userId} | Securely remove a departing editor after reassigning their work. |
| Mark Editor on Vacation | POST | /v2/organizations/{orgId}/users/{userId}/ooo | Block an editor's availability for a specified period of time off. |
| Update Service Price | PATCH | /v2/event-types/{eventTypeId} | Modify the details of an existing service offering. |
| Detect Manual Changes | GET | /v2/event-types, /v2/schedules, etc. | Audit the live configuration against the version-controlled files. |
| Generate Monthly Report | GET | /v2/bookings | Retrieve booking data for invoicing and business analysis. |

## **Implementation Architecture and Best Practices**

### **A Multi-Layered Strategy for Secure Secrets Management**

The Cal.com API key is the most critical secret in this entire infrastructure and must be managed with extreme care. Hardcoding the key directly into source code is a severe security vulnerability and must be avoided at all costs.11 A tiered approach to secrets management allows security practices to mature alongside the business.

* **Level 1 (Local Development):** For an individual developer's machine, the simplest secure method is to use environment variables. A .env file in the project's root directory can store the key (e.g., CAL\_API\_KEY="cal\_live\_..."). This file must be explicitly listed in the project's .gitignore file to prevent it from ever being committed to the Git repository.26  
* **Level 2 (CI/CD & Simple Production):** For automated workflows, the CI/CD platform's built-in secrets management is the appropriate choice. In GitHub Actions, for example, the API key should be stored as an encrypted "Repository Secret" or "Organization Secret".27 The workflow can then securely access this secret at runtime without exposing it in logs or source code.27  
* **Level 3 (Mature Production/High Security):** As the business scales, migrating to a dedicated secrets management platform like HashiCorp Vault 28 or Doppler 31 is the recommended best practice. These tools provide a centralized, encrypted vault for all secrets, offering advanced features like granular access control, detailed audit logs, and automated secret rotation.

The following table provides a comparative analysis of these strategies.

| Method | Pros | Cons | Recommended Environment(s) |
| :---- | :---- | :---- | :---- |
| **.env File** | Simple to set up for local work; language-agnostic. | Prone to accidental commits if .gitignore is misconfigured; not suitable for shared environments. | Local Development |
| **GitHub Actions Secrets** | Tightly integrated with CI/CD; encrypted at rest; easy to use in workflows. | Tied to the GitHub platform; access controls are repository/org-level. | CI/CD, Simple Production |
| **HashiCorp Vault / Doppler** | Centralized control; strong encryption; detailed audit logs; dynamic secrets; platform-agnostic. | Requires separate infrastructure and setup; can be complex for a small team to manage initially. | Mature Production, High-Security |

### **A Practical CI/CD Workflow with Git and GitHub Actions**

A simple and effective continuous deployment workflow can be established using Git and GitHub Actions.

1. **Git Strategy:** A main/develop branching model is sufficient. All configuration changes are made on feature branches, reviewed via pull requests, and merged into develop. When ready for deployment, develop is merged into main.  
2. **GitHub Actions Workflow:** A workflow file (e.g., .github/workflows/deploy-cal-config.yml) is configured to trigger on every push to the main branch.  
3. **Workflow Steps:**  
   * The job checks out the repository's code, which includes the configuration files (e.g., editors.json) and the deployment scripts.  
   * It sets up the required runtime environment (e.g., Node.js or Python).  
   * It retrieves the Cal.com API key from GitHub Actions Secrets and sets it as an environment variable for the script.  
   * It executes the idempotent deployment scripts (e.g., node scripts/sync-event-types.js), which apply the configuration changes to the production Cal.com account.

### **Ensuring Reliability: Idempotency in API Scripting**

Idempotency is the property of an operation where it can be applied multiple times without changing the result beyond the initial application.33 This is not merely a technical curiosity; it is the cornerstone of a reliable "Configuration as Code" system. An idempotent deployment script can be run safely at any time, and it will only apply the necessary changes to bring the live system into sync with the configuration files. It will not create duplicate users, event types, or schedules on subsequent runs.

Achieving idempotency in scripts requires a specific pattern:

1. **Check for Existence:** Before creating a new resource (a POST operation), the script must first query the API (GET) to see if a resource with a unique identifier already exists. For users, the unique identifier is their email address. For event types, it is the slug.  
2. **Update if Exists:** If the resource already exists, the script should switch to an update (PATCH) operation, applying any changes defined in the configuration file.  
3. **Create if Not Exists:** Only if the resource does not exist should the script proceed with the creation (POST) operation.

This "get-then-patch-or-post" logic ensures that the script is safe to re-run, making the entire deployment process robust and predictable.

### **Reference Implementation Snippets (TypeScript & Python)**

To facilitate the development of these scripts, here are foundational client snippets in both TypeScript and Python.

**TypeScript with Axios:** This snippet creates a reusable API client that centralizes authentication and error handling.

TypeScript

import axios, { AxiosInstance, AxiosError } from 'axios';

const CAL\_API\_KEY \= process.env.CAL\_API\_KEY;  
const API\_BASE\_URL \= 'https://api.cal.com/v2';

if (\!CAL\_API\_KEY) {  
  throw new Error('CAL\_API\_KEY environment variable is not set.');  
}

const apiClient: AxiosInstance \= axios.create({  
  baseURL: API\_BASE\_URL,  
  headers: {  
    'Authorization': \`Bearer ${CAL\_API\_KEY}\`,  
    'Content-Type': 'application/json',  
  },  
});

apiClient.interceptors.response.use(  
  (response) \=\> response,  
  (error: AxiosError) \=\> {  
    console.error(\`API Error: ${error.response?.status} \- ${error.message}\`);  
    if (error.response?.data) {  
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));  
    }  
    return Promise.reject(error);  
  }  
);

export default apiClient;

Sources: 35

**Python with requests:** A similar client implementation for a Python-based scripting environment.

Python

import os  
import requests

CAL\_API\_KEY \= os.getenv('CAL\_API\_KEY')  
API\_BASE\_URL \= 'https://api.cal.com/v1' \# Note: Base URL may differ for v2

if not CAL\_API\_KEY:  
    raise ValueError('CAL\_API\_KEY environment variable is not set.')

class CalApiClient:  
    def \_\_init\_\_(self):  
        self.base\_url \= 'https://api.cal.com/v2'  
        self.headers \= {  
            'Authorization': f'Bearer {CAL\_API\_KEY}',  
            'Content-Type': 'application/json'  
        }

    def \_handle\_response(self, response):  
        try:  
            response.raise\_for\_status()  
            return response.json()  
        except requests.exceptions.HTTPError as err:  
            print(f"HTTP Error: {err}")  
            print(f"Response Body: {response.text}")  
            raise  
        except requests.exceptions.RequestException as err:  
            print(f"Request Error: {err}")  
            raise

    def get(self, endpoint, params=None):  
        response \= requests.get(f"{self.base\_url}/{endpoint}", headers=self.headers, params=params)  
        return self.\_handle\_response(response)

    def post(self, endpoint, data):  
        response \= requests.post(f"{self.base\_url}/{endpoint}", headers=self.headers, json=data)  
        return self.\_handle\_response(response)

    def patch(self, endpoint, data):  
        response \= requests.patch(f"{self.base\_url}/{endpoint}", headers=self.headers, json=data)  
        return self.\_handle\_response(response)

api\_client \= CalApiClient()

Source: 38

## **Strategic Recommendations and Future Roadmap**

### **Summary of Recommendations and Implementation Checklist**

This report advocates for a fundamental shift in managing the Cal.com scheduling infrastructure, moving from manual UI-based configuration to a programmatic, version-controlled "Configuration as Code" model. The key strategic recommendations are:

1. **Adopt "Configuration as Code":** Treat all scheduling logic, user data, and service definitions as a codebase stored in a Git repository.  
2. **Standardize on API v2:** Build all automation exclusively against the v2 API to ensure future compatibility and access to the most powerful features.  
3. **Use the Standard Organization User Model:** Avoid the unnecessary complexity of the Platform/Managed User model by treating editors as standard members of a Cal.com organization.  
4. **Implement a Phased Secrets Management Strategy:** Start with environment variables and CI/CD secrets, with a long-term plan to migrate to a dedicated secrets management platform like HashiCorp Vault.  
5. **Write Idempotent Scripts:** Ensure all deployment and maintenance scripts can be run repeatedly without causing unintended side effects, forming the foundation of a reliable automation pipeline.

### **Advanced Automation: Serverless Webhook Processing**

While simple webhook integrations can be handled by platforms like Zapier or Make, more complex business logic warrants a custom, serverless approach.22 Using a service like AWS Lambda, a function can be created to act as a webhook receiver.

For example, upon receiving a BOOKING\_CREATED webhook from Cal.com, an AWS Lambda function could execute a sophisticated workflow:

* Parse the incoming booking data (editor, client, service type, date).  
* Create a new project folder in a shared drive (e.g., Google Drive or Dropbox).  
* Create a task in a project management tool (e.g., Asana or Jira), assigning it to the correct editor with a deadline calculated from the booking date.  
* Log the booking details in a centralized database or spreadsheet for advanced analytics.

This level of custom integration unlocks automation tailored precisely to the business's unique operational needs. The serverless function should always include logic to verify the webhook's signature, if provided by Cal.com, to ensure the request is authentic and secure.39

### **The Path to True Infrastructure as Code: Terraform & Pulumi**

The script-based "Configuration as Code" approach detailed in this report is the most effective and flexible method currently available for managing Cal.com's internal resources. However, the broader software industry is standardizing on declarative Infrastructure as Code (IaC) tools like Terraform and Pulumi for managing cloud resources.40

An investigation into the current IaC landscape reveals a third-party Terraform provider for Cal.com published by Elestio.42 A careful analysis of this provider shows that its primary function is to deploy and manage a self-hosted *instance* of the Cal.com application itself (e.g., specifying the datacenter, server type, and software version). It does not currently provide resources for managing the application's internal business logic, such as EventType, Schedule, or Workflow objects.

Therefore, the recommended strategy is to proceed with the robust, script-based approach outlined herein. This provides complete control over the application's configuration. Concurrently, the business should monitor the Terraform and Pulumi ecosystems for the future development of a comprehensive Cal.com provider. The emergence of such a tool would represent the final evolution of this strategy, allowing the entire scheduling infrastructure—from the application instance down to the individual event type—to be managed in a single, declarative IaC workflow.

#### **Works cited**

1. calcom/cal.com: Scheduling infrastructure for absolutely everyone. \- GitHub, accessed October 16, 2025, [https://github.com/calcom/cal.com](https://github.com/calcom/cal.com)  
2. Create a booking \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/api-reference/v2/bookings/create-a-booking](https://cal.com/docs/api-reference/v2/bookings/create-a-booking)  
3. Introduction to API v2 \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/api-reference/v2/introduction](https://cal.com/docs/api-reference/v2/introduction)  
4. Quick start \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/api-reference/v1/introduction?utm\_source=chatgpt.com](https://cal.com/docs/api-reference/v1/introduction?utm_source=chatgpt.com)  
5. Authentication \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/api-reference/v1/authentication](https://cal.com/docs/api-reference/v1/authentication)  
6. Create a user \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/api-reference/v2/orgs-users/create-a-user](https://cal.com/docs/api-reference/v2/orgs-users/create-a-user)  
7. Introduction \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/platform](https://cal.com/docs/platform)  
8. FAQ \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/platform/faq](https://cal.com/docs/platform/faq)  
9. Create a managed user \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/api-reference/v2/platform-managed-users/create-a-managed-user](https://cal.com/docs/api-reference/v2/platform-managed-users/create-a-managed-user)  
10. 10 API Key Management Best Practices \- Serverion, accessed October 16, 2025, [https://www.serverion.com/uncategorized/10-api-key-management-best-practices/](https://www.serverion.com/uncategorized/10-api-key-management-best-practices/)  
11. API Key Security Best Practices: Secure Sensitive Data, accessed October 16, 2025, [https://www.legitsecurity.com/aspm-knowledge-base/api-key-security-best-practices](https://www.legitsecurity.com/aspm-knowledge-base/api-key-security-best-practices)  
12. Create organization team workflow \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/api-reference/v2/orgs-teams-workflows/create-organization-team-workflow](https://cal.com/docs/api-reference/v2/orgs-teams-workflows/create-organization-team-workflow)  
13. Creates a new availability \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/api-reference/v1/availabilities/creates-a-new-availability](https://cal.com/docs/api-reference/v1/availabilities/creates-a-new-availability)  
14. Create an event type \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/api-reference/v2/event-types/create-an-event-type](https://cal.com/docs/api-reference/v2/event-types/create-an-event-type)  
15. Learn how to set up your event types in Cal.com, accessed October 16, 2025, [https://cal.com/blog/event-types-guide-calcom](https://cal.com/blog/event-types-guide-calcom)  
16. Google \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/self-hosting/apps/install-apps/google](https://cal.com/docs/self-hosting/apps/install-apps/google)  
17. Workflows | Cal.com, accessed October 16, 2025, [https://cal.com/features/workflows](https://cal.com/features/workflows)  
18. Cal.com Workflows \- Cal.com Help, accessed October 16, 2025, [https://cal.com/help/workflows/workflowsoverview](https://cal.com/help/workflows/workflowsoverview)  
19. Get a webhook \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/api-reference/v2/webhooks/get-a-webhook](https://cal.com/docs/api-reference/v2/webhooks/get-a-webhook)  
20. Create a webhook \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/api-reference/v2/platform-webhooks/create-a-webhook](https://cal.com/docs/api-reference/v2/platform-webhooks/create-a-webhook)  
21. How to Set up Webhooks in Cal.com? \- OttoKit, accessed October 16, 2025, [https://ottokit.com/docs/how-to-set-up-webhooks-in-cal-com/](https://ottokit.com/docs/how-to-set-up-webhooks-in-cal-com/)  
22. What are webhooks and how can they be used for automating workflows \- Cal.com, accessed October 16, 2025, [https://cal.com/blog/webhooks-automate-workflows](https://cal.com/blog/webhooks-automate-workflows)  
23. Reassign a booking to a specific host \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/api-reference/v2/bookings/reassign-a-booking-to-a-specific-host](https://cal.com/docs/api-reference/v2/bookings/reassign-a-booking-to-a-specific-host)  
24. Update an out-of-office entry for a user \- Cal.com Docs, accessed October 16, 2025, [https://cal.com/docs/api-reference/v2/orgs-users-ooo/update-an-out-of-office-entry-for-a-user](https://cal.com/docs/api-reference/v2/orgs-users-ooo/update-an-out-of-office-entry-for-a-user)  
25. Manage Team Time Off with Out of Office | Cal.com \- Open Scheduling Infrastructure, accessed October 16, 2025, [https://cal.com/blog/out-of-office-scheduling](https://cal.com/blog/out-of-office-scheduling)  
26. Guide and Cheatsheet for the best practices for managing and storing secrets like API keys and credentials. : r/learnprogramming \- Reddit, accessed October 16, 2025, [https://www.reddit.com/r/learnprogramming/comments/h7kt1t/guide\_and\_cheatsheet\_for\_the\_best\_practices\_for/](https://www.reddit.com/r/learnprogramming/comments/h7kt1t/guide_and_cheatsheet_for_the_best_practices_for/)  
27. Using secrets in GitHub Actions \- GitHub Docs, accessed October 16, 2025, [https://docs.github.com/actions/security-guides/using-secrets-in-github-actions](https://docs.github.com/actions/security-guides/using-secrets-in-github-actions)  
28. hashicorp/vault: A tool for secrets management, encryption as a service, and privileged access management \- GitHub, accessed October 16, 2025, [https://github.com/hashicorp/vault](https://github.com/hashicorp/vault)  
29. Understanding HashiCorp Vault: 5 Key Features, Pricing & Alternatives \- Configu, accessed October 16, 2025, [https://configu.com/blog/understanding-hashicorp-vault-5-key-features-pricing-alternatives/](https://configu.com/blog/understanding-hashicorp-vault-5-key-features-pricing-alternatives/)  
30. How to Successfully Manage Secrets with HashiCorp Vault \- SPR, accessed October 16, 2025, [https://spr.com/how-to-successfully-manage-secrets-with-hashicorp-vault/](https://spr.com/how-to-successfully-manage-secrets-with-hashicorp-vault/)  
31. API Reference | Doppler Docs, accessed October 16, 2025, [https://docs.doppler.com/reference/api](https://docs.doppler.com/reference/api)  
32. Doppler \- Relevance AI, accessed October 16, 2025, [https://relevanceai.com/agent-templates-software/doppler](https://relevanceai.com/agent-templates-software/doppler)  
33. Idempotency \- What is an Idempotent REST API? \- REST API Tutorial, accessed October 16, 2025, [https://restfulapi.net/idempotent-rest-apis/](https://restfulapi.net/idempotent-rest-apis/)  
34. REST API Design: What is Idempotency? | by Reetesh Kumar \- Medium, accessed October 16, 2025, [https://medium.com/@reetesh043/rest-api-design-what-is-idempotency-18218e1ff73c](https://medium.com/@reetesh043/rest-api-design-what-is-idempotency-18218e1ff73c)  
35. Example of Axios with TypeScript \- Discover gists · GitHub, accessed October 16, 2025, [https://gist.github.com/JaysonChiang/fa704307bacffe0f17d51acf6b1292fc](https://gist.github.com/JaysonChiang/fa704307bacffe0f17d51acf6b1292fc)  
36. Your First API Call: GET Requests in Typescript using Axios | by Daniel Wilkinson | Medium, accessed October 16, 2025, [https://dpw-developer.medium.com/your-first-api-call-get-requests-in-typescript-using-axios-b374be0479b6](https://dpw-developer.medium.com/your-first-api-call-get-requests-in-typescript-using-axios-b374be0479b6)  
37. Centralizing Your API Calls with Axios: TypeScript Example \- DEV Community, accessed October 16, 2025, [https://dev.to/jionnlol/centralizing-your-api-calls-with-axios-typescript-example-an8](https://dev.to/jionnlol/centralizing-your-api-calls-with-axios-typescript-example-an8)  
38. Step by Step Guide to Building a Cal.com API Integration in Python \- Rollout, accessed October 16, 2025, [https://rollout.com/integration-guides/cal.com/sdk/step-by-step-guide-to-building-a-cal.com-api-integration-in-python](https://rollout.com/integration-guides/cal.com/sdk/step-by-step-guide-to-building-a-cal.com-api-integration-in-python)  
39. Tutorial: Creating a webhook endpoint using a Lambda function URL, accessed October 16, 2025, [https://docs.aws.amazon.com/lambda/latest/dg/urls-webhook-tutorial.html](https://docs.aws.amazon.com/lambda/latest/dg/urls-webhook-tutorial.html)  
40. Providers \- Configuration Language | Terraform \- HashiCorp Developer, accessed October 16, 2025, [https://developer.hashicorp.com/terraform/language/providers](https://developer.hashicorp.com/terraform/language/providers)  
41. Pulumi \- Infrastructure as Code in Any Programming Language, accessed October 16, 2025, [https://www.pulumi.com/](https://www.pulumi.com/)  
42. elestio\_cal\_com | Resources | elestio/elestio | Terraform \- Terraform Registry, accessed October 16, 2025, [https://registry.terraform.io/providers/elestio/elestio/latest/docs/resources/cal\_com](https://registry.terraform.io/providers/elestio/elestio/latest/docs/resources/cal_com)