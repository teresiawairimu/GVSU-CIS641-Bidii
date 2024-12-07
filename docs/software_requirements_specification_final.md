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

##### Phase 1: Administrator training

During the first release, administrators will be the primary users. They will be trained on data entry processes to input information about available services and service providers into the system.

##### Phase 2: Provider Onboarding

The second release will focus on enabling service providers to manage data entry related to their own services and availability. This phase ensures providers can directly update their schedules and service offerings in the system.

##### Administrator Support Role

Throughout both phases, administrators will play a critical role in supporting clients who prefer to book appointments over the phone, ensuring a smooth transition and consistent customer experience.

##### Client Role

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
