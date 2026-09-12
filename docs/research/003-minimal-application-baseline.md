\## Research / decision question:



What is the smallest application architecture that gives the infrastructure project enough functionality to test deployment, persistence, health checking, containerisation and CI without application development becoming the main focus?



\### Why:



The infrastructure later needs a real application to deploy and operate. If the application is too simple, we cannot meaningfully test persistence, health checks or deployment. If it becomes too complex, software development will take time away from the infrastructure learning goals.



\### DOT strategy and method:



Workshop → Decomposition



Break the application into only the components required by the infrastructure goals and deliberately exclude unnecessary functionality.



Library → Documentation / best practices



Use official documentation where needed to determine appropriate basic usage of Node.js, Express and SQLite rather than guessing implementation details.



Lab → System test



\### Expected result:



A small local application that is sufficiently realistic for the later infrastructure work while remaining quick to understand and maintain.



\### How it will be documented:

research note

application source code

README/run instructions

automated test results

selected screenshots

Git commits

later evidence document when this becomes a meaningful completed work unit



\### Definition of done:

Application can be started locally with a documented command

Browser can access the application

/health reports the application as healthy

Application reads/writes actual persistent data

Data survives application restart

Frontend communicates with backend

At least one automated test exists

Another developer could understand how to run it





\## SQLite Approach Research



\### Research question



Which SQLite approach should be used for this Node.js application, considering

simplicity, maintainability, Docker compatibility, and the deliberately limited

scope of the application?



\### DOT strategy and method



\*\*Strategy:\*\* Library



\*\*Methods:\*\* Literature study and comparison of available Node.js SQLite

approaches.



I compared Node.js' built-in `node:sqlite` module, `better-sqlite3`, and

`node-sqlite3`.



\### Findings



\#### node:sqlite



Node.js 24 includes built-in SQLite support through `node:sqlite`. It provides

database files, prepared statements, parameter binding, and the basic operations

required by this project without requiring another npm dependency.



The API I intend to use is synchronous. This can block the Node.js event loop

during database operations, but the expected workload of this small application

is low enough that this is not currently a relevant limitation.



The module is currently classified by Node.js as a Release Candidate rather than

fully stable.

https://nodejs.org/download/release/latest-v24.x/docs/api/sqlite.html



\#### better-sqlite3



`better-sqlite3` is a mature external SQLite package with a simple synchronous

API and prebuilt binaries for common platforms.



It would meet the project's requirements, but it introduces an additional native

dependency. This creates some additional installation and container environment

complexity that is not necessary for this small application.

https://www.npmjs.com/package/better-sqlite3



\#### node-sqlite3



`node-sqlite3` was not selected because the package is currently deprecated and

unmaintained.

https://www.npmjs.com/package/sqlite3?activeTab=versions



\### Decision



Use the built-in `node:sqlite` module with `DatabaseSync`.



For the current project it provides the required functionality with the least

additional dependency complexity. This also keeps the application simple so that

the main project effort can remain focused on infrastructure.



A compatible Node.js version will need to be used later in the Docker image.



\### Accepted trade-off



`node:sqlite` is currently a Release Candidate API. This is acceptable for this

learning project, but would need to be reconsidered for a larger or long-lived

production system if API stability became an important requirement.



\## Implementation



The application baseline was implemented as a small Node.js application using

Express and SQLite.



The final local application consists of:



\- a static HTML/JavaScript frontend served by Express;

\- an Express REST API;

\- a `/health` endpoint;

\- SQLite persistence using the built-in `node:sqlite` module;

\- a `services` table for service names and statuses;

\- an `incidents` table linked to services;

\- automated tests using Node.js' built-in test runner.



The application deliberately remains small because its main purpose is to provide

a realistic workload for the infrastructure part of the project.



\### Application structure



The application is separated into several responsibilities:



`public/`

contains the browser frontend.



`src/app.js`

defines the Express application, middleware and API routes.



`src/server.js`

starts the Express server.



`src/database.js`

opens the SQLite database and creates the required tables.



`test/app.test.js`

contains automated application tests.



Separating the Express application from `server.js` allows the application to be

loaded by automated tests without automatically starting the normal server on

port 3000.



\### Implemented functionality



The application currently supports:



\- viewing services;

\- creating services;

\- changing a service status between `operational`, `degraded` and `outage`;

\- viewing incidents;

\- creating an incident for an existing service;

\- persistent SQLite storage;

\- a health endpoint for later deployment and monitoring checks.



Incidents are linked to services through a SQLite foreign key.



The application validates service statuses and rejects unsupported values rather

than storing arbitrary status data.



\## Validation



The completed application baseline was validated using both manual system testing

and automated tests.



\### Manual system test



The application was started locally and accessed through the browser.



The following flow was tested:



1\. Create a service through the browser.

2\. Change the service status.

3\. Create an incident for the service.

4\. Refresh the browser and confirm the changes still exist.

5\. Stop the Node.js server.

6\. Start the server again.

7\. Confirm that the service, changed status and incident still exist.



The test succeeded.



This validated the complete local flow:



Browser → Express API → SQLite → persistent storage



It also demonstrated that application data survives an application restart.



The `/health` endpoint was manually checked and returned:



`{"status":"healthy"}`



\### Automated tests



Automated tests were implemented using Node.js' built-in test runner.



The test environment uses a temporary SQLite database by setting a separate

`DATABASE\_PATH`. This prevents test data from modifying the normal development

database.



Three automated tests currently verify:



\- `GET /health` returns HTTP 200 and a healthy status;

\- `POST /services` successfully creates a service;

\- an invalid service status is rejected with HTTP 400.



Final automated test result:



\- tests: 3

\- passed: 3

\- failed: 0



During the first test run, all three application tests passed but the cleanup step

failed on Windows because the temporary SQLite database was still open when the

test directory was deleted.



The test cleanup was changed so that the Express server and SQLite database are

explicitly closed before the temporary directory is removed.



After this change, the complete test run finished with 3 passed tests and 0

failures.



\## Findings



The decomposition kept the application small while still providing the behaviour

needed for later infrastructure work.



The application now provides:



\- a real HTTP service that can be deployed;

\- a health endpoint that can later be used by containers, reverse proxies and

&#x20; monitoring;

\- persistent application data that can later be used to validate Docker volume

&#x20; behaviour;

\- API and frontend communication;

\- predictable failure behaviour that can be tested automatically;

\- automated tests that can later be executed by CI.



The SQLite research also prevented an unnecessary external database dependency.

The built-in `node:sqlite` implementation is sufficient for the current workload

and keeps the application runtime relatively simple.



\## Conclusion



The research question was:



> What is the smallest application architecture that gives the infrastructure project enough functionality to test deployment, persistence, health checking, containerisation and CI without application development becoming the main focus?



The implemented application satisfies this goal.



It is more than a static example because it contains persistent data, API

behaviour, validation, related database entities and automated tests. At the same

time, it deliberately avoids features such as authentication, complex user

interfaces and extensive business logic that would shift the project focus toward

software development.



The application baseline is therefore sufficient for the next infrastructure

experiments.



\## Consequence for the project



Application development will now stop at this baseline unless a later

infrastructure requirement reveals that additional application behaviour is

needed.



The next work unit will use this application to investigate Docker

containerisation.



The application provides several concrete behaviours that can be validated during

that work:



\- the HTTP server must remain reachable;

\- `/health` must continue to work;

\- automated tests must still pass;

\- SQLite data must persist independently of the container lifecycle;

\- the selected Docker Node.js runtime must support `node:sqlite`.

