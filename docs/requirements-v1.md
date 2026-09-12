# Requirements v1



### Date

7 September 2026



### Purpose



These are the initial requirements for the Cloud Application \& Infrastructure

personal project.



The requirements are expected to change as I learn more about the application,

EduCloud, infrastructure, and the technologies used in the project.



The application is intentionally small. The main purpose of the system is to

provide a realistic application that can be deployed, secured, automated,

monitored, and maintained.



\---



### Functional Requirements



#### FR-01 - View services



The user must be able to view the services being tracked by the application.



Validation:

Open the application and verify that stored services are displayed.



#### FR-02 - Create an incident



The user must be able to create an incident associated with a service.



Validation:

Create an incident and verify that it appears in the application.



#### FR-03 - Resolve an incident



The user must be able to mark an existing incident as resolved.



Validation:

Resolve an incident and verify that its status changes.



#### FR-04 - Persist data



Service and incident data must remain available after the application is restarted.



Validation:

Create data, restart the application, and verify that the data still exists.



#### FR-05 - Health endpoint



The application must expose a health endpoint that can be used to determine

whether the application is running.



Example:



GET /health



Validation:

Request the health endpoint and verify that a healthy running application

returns a successful response.



\---



### Non-Functional / Infrastructure Requirements



#### NFR-01 - External deployment



The application must run outside the development computer in an EduCloud

environment.



Validation:

Access the deployed application from another device or network.



#### NFR-02 - Containerised application



The application must be able to run inside a Docker container.



Validation:

Build the Docker image and start the application from the resulting container

without manually installing application dependencies inside the container.



#### NFR-03 - Automated testing



Core application functionality must have automated tests that can run without

manual interaction.



Validation:

Run the automated test suite and verify that it reports whether the tested

functionality passes or fails.



#### NFR-04 - Automated delivery



Changes to the application should eventually pass through an automated CI/CD

pipeline that can test and build the application.



Validation:

Push a change to the repository and verify that the pipeline starts

automatically and executes the configured stages.



#### NFR-05 - Controlled network exposure



Only services and ports that are required for the application or infrastructure

administration should be externally accessible.



Validation:

Inspect the configured firewall/network rules and test whether unnecessary

ports are inaccessible.



#### NFR-06 - HTTPS



Public application traffic should eventually use HTTPS instead of unencrypted

HTTP.



Validation:

Access the public application through HTTPS and verify that the connection uses

a valid TLS configuration.



#### NFR-07 - Secret management



Credentials and secrets must not be stored directly in the source code or

committed to the Git repository.



Validation:

Inspect the repository and configuration and verify that secrets are provided

through an appropriate configuration mechanism.



#### NFR-08 - Logging



The running application must produce logs that provide enough information to

investigate application failures.



Validation:

Cause a known error and determine whether useful information about the error

appears in the logs.



#### NFR-09 - Monitoring



The infrastructure should eventually provide enough monitoring information to

determine whether the application is healthy and identify basic resource

problems.



Validation:

Inspect monitoring information for application health and relevant system

resources and intentionally cause at least one detectable problem.



#### NFR-10 - Reproducibility



At least part of the infrastructure should eventually be reproducible through

configuration, scripts, or Infrastructure as Code instead of relying entirely

on manual setup.



Validation:

Use the created configuration or automation to recreate the relevant part of

the environment.



#### NFR-11 - Cost



The project infrastructure should not require paid cloud resources when a

suitable free educational alternative is available.



Validation:

Document the selected infrastructure platform and any costs associated with

running the project.



## Current Assumptions



\- The application will initially use a single EduCloud VM.

\- The application will remain small because infrastructure is the main learning focus.

\- EduCloud will be the primary hosting environment.

\- Docker will be used for application containerisation.

\- The exact CI/CD, reverse proxy, monitoring, and Infrastructure as Code solutions

&#x20; have not yet been selected.

\- Requirements may change after research, experiments, or coach feedback.

