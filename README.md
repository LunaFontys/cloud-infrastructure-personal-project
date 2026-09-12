# cloud-infrastructure-personal-project

This project explores how to design, deploy, and operate a small cloud application in a reliable, secure, maintainable, and affordable way.

Main research question:

How can I design, deploy, and operate a small cloud application in a reliable, secure, maintainable, and affordable way using modern infrastructure practices?

Current intended direction:

* Small web application
* Node.js / Express
* SQLite
* Docker
* GitHub Actions
* EduCloud
* Monitoring and infrastructure automation later

Status:
~~Sprint 0 - project foundation and environment exploration.~~

Sprint 1 - Build a minimal working application, containerise it, and deploy it to the EduCloud VM, with a basic CI pipeline checking the project.





### Running the application locally



#### Requirements



\- Node.js 24

\- npm



#### Installation



From the `app` directory:



```bash

npm install



#### Start the application

```bash
npm start



The application is then available at:



http://localhost:3000



The health endpoint is available at:



http://localhost:3000/health



#### Run automated tests

From the app directory:

```bash

npm test



The tests use a temporary SQLite database and do not modify the normal

development database.

