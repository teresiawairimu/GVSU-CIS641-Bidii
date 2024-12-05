# Software Requirement Specification

# Overview

# Software Requirements

## Functional Requirements

### User Management

- The app shall allow users to create an account when they click the sign-up link.

- The app shall allow users to log in when they enter a valid email and password and click submit button

- The app shall allow an admin to create an account when they provide a valid admin-code.

- The app shall allow an admin to login when they enter their email and password and click the submit button.

- The app shall allow an admin to create application slots and users to schedule appointments.

**Application Management**

- The app shall allow users to add appointments by clicking the "Create Appointment" button.

- The app shall allow users to modify appointments by clicking the date and time section. 

- The app shall allow users to cancel appointments by clicking the delete icon and confirming with "Yes" in the confirmation message.

- The app shall allow users to view their booked appointments as upcoming appointment on the dashboard.

- The app shall display upcoming appointments only when their status changes to "Booked" upon confirmation of the payment.

- The app shall allow users to select services from a dropdown menu while scheduling an appointment.

**Application Slots Management**

- The admin shall create appointment slots by clicking the "Add Appointment Slot" button.

- The app shall allow the admin to select a provider, service, date, start times, and duration of the service while creating an appointment slot.

- The app shall display appointment slots with the status, "Available" to users when they select a specific service.

- The app shall display available appointments on the admin's dashboard.

- The app must prevent double-booking by marking an appointment slot as "booked" once it is scheduled.

**Payment Integration**

- The app creates payment intents using Stripe, with appointment fees fixed at $30.

- The app shall use Stripe's testmode in development, and live mode in production.

- The app shall inform users about the non-refundable application fee on the appointment creation page.

- The app shall only allow card payments as the method of payment for the application fee.

- An application's status shall be "pending" until payment is confirmed using Stripe's webhook.

**Service Management**

- In development, services shall be defined in Firestore as documents.

- In production, the app shall allow admins to create, modify, and delete services.

- The app shall provide services in a dropdown menu for client bookings.

- Services are tied to appointments, with service IDs stored in paymnet metadata through stripe.

- The app shall provide services in a dropdown menu with details such as name, cost, and duration of the service for appointment slot creation.

## Non-functional Requirements

**User Management**

- The user data must be encrypted both in transit using HTTPS and at rest in Firestore.

- The signup and login interfaces shall require no more than 5 clicks to complete the process.

- The app must comply with GDPR and other applicable data protection regulations.

- The app must  support scaling to accomodate a 10% monthly increase in user base.

- The app must handle up to 1,000 concurrent user signups and logins without noticeable latency.

**Application Management**

- The app shall allow appointment bookings to be completed in under 3 seconds.

- App data must be encrypted both in transit and at rest in Firestore.

- New appointment features should be implemented with minimal code changes.

- Appointment management services should be accessible with an uptime of 99.9%.

- Appointment data must be accurately stored abd retrievable 99.9% of the time.

**Application Slots Management**

- Appointment slot creation should be completed in under 2 seconds.

- The interface for managing appointment slots should require no more than 3 steps for actions such as adding an appointment slot.

- Slot management data should be accessible only to authorized admins, with audit trails for all changes.

- Slot management functionality must be accessible with an uptime of 99.9%.

- The app must adhere to relevant data privacy laws when managing provider-related data.

**Payment Integration**

- Payment processing should be completed within 5 seconds after user submission.

- All payment data must be encrypted during transmission and comply with PCI DSSstandards.

- Payment management services shall be accessible with an uptime of 99.9%.

- The payment interface must provide clear feedback on payment status within 3 seconds.

- All payment transactions must be logged and stored securely for 12 months. 

**Service Management**

- Service data must sync accurately across the system with 99.9% reliability.

- Admins should be able to manage services with no more than 3 clicks per operation.

- Only authorized admins can manage services, and all actions must be logged.

- Service management features must be accessible with an uptime of 99.9%.

- All changes to services must be logged and retained for at least 12 months.
