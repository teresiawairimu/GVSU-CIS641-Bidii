# Requirements

## User Management

**Functional Requirements**

- The app shall allow users to create an account when they click the sign-up link.

- The app shall allow users to log in when they enter a valid email and password and click submit button

- The app shall allow an admin to create an account when they provide a valid admin-code.

- The app shall allow an admin to login when they enter their email and password and click the submit button.

- The app shall allow an admin to create application slots and users to schedule appointments.

**Non-functional Requirements**

- The user data must be encrypted both in transit using HTTPS and at rest in Firestore.

- The signup and login interfaces shall require no more than 5 clicks to complete the process.

- The app must comply with GDPR and other applicable data protection regulations.

- The app must  support scaling to accomodate a 10% monthly increase in user base.

- The app must handle up to 1,000 concurrent user signups and logins without noticeable latency.

## Application Management

**Functional Requirements**

- The app shall allow users to add appointments by clicking the "Create Appointment" button.

- The app shall allow users to modify appointments by clicking the date and time section. 

- The app shall allow users to cancel appointments by clicking the delete icon and confirming with "Yes" in the confirmation message.

- The app shall allow an admin to view the available appointments by clicking the "Appointment" link.

- The app shall allow users to view their booked appointments as upcoming appointment on the dashboard.

- The app shall allow users to select services from a dropdown menu while scheduling an appointment.

**Non-functional Requirements**

- The app shall allow appointment bookings to be completed in under 3 seconds.

- App data must be encrypted both in transit and at rest in Firestore.

- New appointment features should be implemented with minimal code changes.

- Appointment management services should be accessible with an uptime of 99.9%.

- Appointment data must be accurately stored abd retrievable 99.9% of the time.

## Application Slots Management

**Functional Requirements**

- The admin shall create appointment slot by clicking the "Add Appointment Slot" button.


## Payment Integration

## Service Management
