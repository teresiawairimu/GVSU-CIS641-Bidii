# Software Requirement Specification

# Overview
<description>
# Software Requirements
<description>
## Functional Requirements

### User Management

- The app shall allow users to create an account when they click the sign-up link.

- The app shall allow users to log in when they enter a valid email and password and click submit button

- The app shall allow an admin to create an account when they provide a valid admin-code.

- The app shall allow an admin to login when they enter their email and password and click the submit button.

- The app shall allow an admin to create application slots and users to schedule appointments.

### Application Management

- The app shall allow users to add appointments by clicking the "Create Appointment" button.

- The app shall allow users to modify appointments by clicking the date and time section. 

- The app shall allow users to cancel appointments by clicking the delete icon and confirming with "Yes" in the confirmation message.

- The app shall allow users to view their booked appointments as upcoming appointment on the dashboard.

- The app shall display upcoming appointments only when their status changes to "Booked" upon confirmation of the payment.

- The app shall allow users to select services from a dropdown menu while scheduling an appointment.

### Application Slots Management

- The admin shall create appointment slots by clicking the "Add Appointment Slot" button.

- The app shall allow the admin to select a provider, service, date, start times, and duration of the service while creating an appointment slot.

- The app shall display appointment slots with the status, "Available" to users when they select a specific service.

- The app shall display available appointments on the admin's dashboard.

- The app must prevent double-booking by marking an appointment slot as "booked" once it is scheduled.

### Payment Integration

- The app creates payment intents using Stripe, with appointment fees fixed at $30.

- The app shall use Stripe's testmode in development, and live mode in production.

- The app shall inform users about the non-refundable application fee on the appointment creation page.

- The app shall only allow card payments as the method of payment for the application fee.

- An application's status shall be "pending" until payment is confirmed using Stripe's webhook.

### Service Management

- In development, services shall be defined in Firestore as documents.

- In production, the app shall allow admins to create, modify, and delete services.

- The app shall provide services in a dropdown menu for client bookings.

- Services are tied to appointments, with service IDs stored in paymnet metadata through stripe.

- The app shall provide services in a dropdown menu with details such as name, cost, and duration of the service for appointment slot creation.

## Non-functional Requirements

### User Management

- The user data must be encrypted both in transit using HTTPS and at rest in Firestore.

- The signup and login interfaces shall require no more than 5 clicks to complete the process.

- The app must comply with GDPR and other applicable data protection regulations.

- The app must  support scaling to accomodate a 10% monthly increase in user base.

- The app must handle up to 1,000 concurrent user signups and logins without noticeable latency.

### Application Management

- The app shall allow appointment bookings to be completed in under 3 seconds.

- App data must be encrypted both in transit and at rest in Firestore.

- New appointment features should be implemented with minimal code changes.

- Appointment management services should be accessible with an uptime of 99.9%.

- Appointment data must be accurately stored abd retrievable 99.9% of the time.

### Application Slots Management

- Appointment slot creation should be completed in under 2 seconds.

- The interface for managing appointment slots should require no more than 3 steps for actions such as adding an appointment slot.

- Slot management data should be accessible only to authorized admins, with audit trails for all changes.

- Slot management functionality must be accessible with an uptime of 99.9%.

- The app must adhere to relevant data privacy laws when managing provider-related data.

### Payment Integration

- Payment processing should be completed within 5 seconds after user submission.

- All payment data must be encrypted during transmission and comply with PCI DSSstandards.

- Payment management services shall be accessible with an uptime of 99.9%.

- The payment interface must provide clear feedback on payment status within 3 seconds.

- All payment transactions must be logged and stored securely for 12 months. 

### Service Management

- Service data must sync accurately across the system with 99.9% reliability.

- Admins should be able to manage services with no more than 3 clicks per operation.

- Only authorized admins can manage services, and all actions must be logged.

- Service management features must be accessible with an uptime of 99.9%.

- All changes to services must be logged and retained for at least 12 months.

# Change Management Plan

A change management plan is a document outlining the process for planning, implmenting, and monitoring changes within a project or organization. An effective change management plan helps to control the budget, schedule, scope and resources of the change process. It also ensures smooth transitions, minimizes disruptions, and supports the achievement of project goals while aligning with organizational objectives.

## Change Management Plan for the Application Management System

### 1.1 Training Plan

This training plan outlines how different user groups will undergo training regarding the use of the application management system.

#### 1.1.1 Identify User Roles

The initial phase of implementation involves clearly identifying the roles of system users, as the rollout will occur in multiple stages.

**Phase 1: Administrator training**

During the first release, administrators will be the primary users. They will be trained on data entry processes to input information about available services and service providers into the system.

**Phase 2: Provider Onboarding**

The second release will focus on enabling service providers to manage data entry related to their own services and availability. This phase ensures providers can directly update their schedules and service offerings in the system.

**Administrator Support Role**

Throughout both phases, administrators will play a critical role in supporting clients who prefer to book appointments over the phone, ensuring a smooth transition and consistent customer experience.

**Client Role**

Clients are a vital user group and the training will be commence during phase 2 when the system is fully functional. The application will be designed with clients in mind, featuring a user-friendly interface that minimizes the need for formal training. Key features, such as booking appointments and viewing schedules, will be self-explanatory with clear instructions and tooltips.

### 1.2 Create Role-Specific Training Materials 

#### 1.2.1 Administrator Role

User Guides: Create comprehensive written guides tailored to administrator tasks, such as adding service providers, managing services, updating schedules, and assisting clients with bookings. These guides should include clear screenshots for each step.

Video Tutorials: Develop concise video tutorials that demonstrate common administrator workflows, such as creating and editing services, monitoring bookings, and handling client inquiries. Use real-world scenarios for better context.

FAQs: Include a section addressing frequent questions, such as "How do I update provider availability?" or "What should I do if a client encounters an issue with booking?"

Virtual or On-Site Workshops: Conduct workshops to introduce administrators to the system. Cover key topics like data entry, managing services and providers, and troubleshooting client issues.

Hands-on Sandbox Environment: Provide a sandbox version of the application where administrators can practice entering data, simulating bookings, and managing schedules without affecting live data. Use realistic scenarios to reinforce training.

Ongoing Support: Establish a helpdesk or designate a support team to address post-training questions or technical issues. Ensure administrators have easy access to this resource.

Integrate a feedback feature within the application specifically for administrators to report usability challenges, suggest improvements, or flag technical issues. Regularly review this feedback to refine the application and training materials.

#### 1.2.2 Service Provider Role

User Guides: Develop clear, concise guides tailored to service provider responsibilities, such as updating availability, managing bookings, and communicating with administrators. Include annotated screenshots to guide users through each task.

Video Tutorials: Create short, scenario-based video tutorials covering essential workflows, such as setting up and modifying service availability, and viewing and managing appointments.

FAQs: Address common concerns, such as: "How do I update my availability?" and "What should I do if I can’t accommodate a client at a booked time?"

Workshops: Conduct workshops to introduce service providers to their tools, focusing on navigating their dashboard and updating schedules in real-time.

Sandbox Environment: Provide access to a test environment where providers can practice updating schedules, simulating bookings, and resolving mock client requests. Use real-life scenarios to build confidence and familiarity.

Dedicated Support Channel: Establish a support team or point of contact for service providers to resolve technical issues or answer questions about the system.

Feedback Mechanism: Include a feedback tool specifically for service providers to report usability challenges, suggest new features, or flag errors. Use this feedback to make iterative improvements to the system.

#### 1.2.3 Client Role

Guided Tutorials: Interactive tutorials or walkthroughs will be provided within the application to guide new users through the booking process. These tutorials will be designed to highlight key actions, such as selecting a service, choosing a time slot, and confirming appointments.

Help Center Resources: A dedicated help center will be available, offering FAQs, video guides, and troubleshooting tips tailored for clients. This ensures they have access to self-help resources whenever needed.

Customer Support Assistance: Administrators will be trained to assist clients who require help booking appointments. Support will be provided through multiple channels, including telephone, email, and live chat, ensuring that clients with varying levels of tech-savviness are accommodated.

Feedback Mechanism: A feedback feature will allow clients to report issues or suggest improvements. This will help refine the user experience and address common pain points promptly.

### 2.1 Integration into Business Ecosystem

Seamless integration of the application scheduling system into the business’s existing operations is critical for its success. This involves ensuring compatibility with current tools, implementing the system gradually to minimize disruptions, and addressing technical challenges collaboratively with IT staff. A well-planned approach will enhance efficiency and streamline workflows across departments.

**Assess Compatibility with Existing Systems**

Begin with a comprehensive assessment of the business's existing systems, such as customer relationship management (CRM) tools, billing software, and communication platforms, such as  email or chat services. Identify any dependencies or overlapping functionalities.

Analyze how the new scheduling application can interface with existing systems to enhance functionality. For instance, integration with a CRM system ensures that appointment data is seamlessly logged into client records, improving record-keeping and client management. Compatibility with billing software is essential to streamline invoicing and payment tracking, ensuring accurate and efficient financial processes. Additionally, the application should integrate with communication tools, such as email or SMS systems, to automate appointment confirmations and reminders, enhancing communication and reducing no-shows.

Identify APIs provided by existing tools to determine how data can flow between systems. Plan for potential middleware to bridge compatibility gaps.

**Plan Incremental Rollouts**

Begin implementation with a pilot test in a limited service category to assess real-world usage and gather feedback. For example, the system could be rolled out to a specific location or service, such as the massage therapy, allowing for a focused evaluation of its functionality. Initial training should be provided to administrators and service providers within the pilot group to ensure they are familiar with the system and can provide valuable insights for further improvements before a broader rollout.

Collect feedback during the pilot phase from all user roles. Address issues related to usability, functionality, and data integration before expanding further.

Expand implementation in phases based on the success of the pilot. Avoid introducing the application to all departments simultaneously to minimize risks.

**Develop Integration Interfaces**

API integration should be utilized to enable seamless data exchange between the scheduling application and external systems, enhancing its functionality and usability. Additionally, appointment data can be exported to reporting tools, enabling analytics and data-driven decision-making to optimize operations and improve service delivery.

In cases where direct API integration is not feasible, middleware solutions should be developed to ensure smooth data flow between systems. For example, a middleware tool could be created to aggregate appointment data for use in dashboards, providing centralized insights and streamlined reporting. Additionally, a synchronization process could be designed to update client or provider information across platforms, ensuring data consistency and reducing manual effort. These solutions bridge gaps in integration, enhancing the overall functionality and reliability of the system.

Standardize appointment data formats (e.g., JSON or XML) to ensure compatibility with third-party systems like billing or customer analytics tools.

**Collaborate with IT Staff**

Effective technical support is essential for the successful implementation and operation of the scheduling application. Collaboration with the IT team is crucial to handle critical technical tasks, such as configuring networks to ensure secure and reliable access to the system. Integration with existing authentication systems, such as single sign-on or role-based access control, is vital for maintaining security and streamlining user access. Additionally, synchronizing data between the new application and legacy databases is necessary to ensure consistency and continuity, enabling a smooth transition and uninterrupted operations.

Collaborate on rigorous testing to confirm that integration workflows function as intended. Test scenarios should include high-usage conditions, edge cases, and failover procedures.

Maintain a strong partnership with IT staff post-deployment to address unforeseen technical issues, optimize performance, and support scaling efforts as the business grows.

### 3.1 Issue Resolution

**Set Up Monitoring System**

Implement tools like Firebase, New Relic, or Datadog to track application performance metrics, such as uptime, response times, and error rates. Real-time monitoring helps identify issues before they escalate, ensuring consistent application performance. Additionally, set up alerts and notifications for critical incidents, such as system outages or significant performance degradation. These automated alerts enable the IT team to respond promptly, minimizing downtime and ensuring a seamless user experience.

Utilizing analytics tools is essential for gaining insights into how users interact with the application and identifying areas for improvement. By tracking frequent error messages or failed actions, potential technical issues or usability challenges can be pinpointed and addressed promptly. Additionally, monitoring sections where users spend excessive time can highlight areas of confusion or inefficiency, providing opportunities to refine workflows and enhance the user experience. These insights enable data-driven decisions to optimize the application’s functionality and usability.

**Establish an Issue Reporting Process**

Integrate an in-app "Report Issue" feature that allows users to describe problems and attach screenshots if needed. Provide clear confirmation when reports are submitted.

Route reported issues to a tracking tool like Jira, Trello, or GitHub Issues for easy prioritization and resolution tracking. Include metadata such as time of occurrence and user role to help triage efficiently.

Define escalation paths for critical issues, ensuring severe problems are addressed promptly by senior technical staff or management.

**Develop an Incident Response Plan**

Assign a response team trained to handle different categories of issues, from minor bugs to system-wide outages. Provide them with tools and processes for efficient problem-solving.

Define Service Level Agreements (SLAs) to ensure timely resolution of issues based on their severity. High-priority issues, such as system crashes or outages, require immediate attention, with a response time within 1 hour and resolution within 24 hours to minimize disruptions. Medium-priority issues, such as non-critical bugs, should have a response time within 8 hours and a resolution timeframe of 3 business days to maintain functionality without compromising ongoing operations. Low-priority issues, such as minor feature enhancements, can be addressed during scheduled updates, ensuring continuous improvement without disrupting the system’s stability. These SLAs provide a structured approach to issue resolution, fostering user confidence and maintaining system reliability.

# Traceability links

This section demonstrates the relationship between requirements and other artifacts. Traceability ensures that requirements are fulfilled and provides evidence of their completion.

## Use Case Diagram Traceability

|Artifact ID | Artifact Name | Requirement ID|
|------------|---------------|---------------|
|            |               |               |

