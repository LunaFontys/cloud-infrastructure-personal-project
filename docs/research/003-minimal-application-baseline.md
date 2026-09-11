Research / decision question:



What is the smallest application architecture that gives the infrastructure project enough functionality to test deployment, persistence, health checking, containerisation and CI without application development becoming the main focus?



Why:



The infrastructure later needs a real application to deploy and operate. If the application is too simple, we cannot meaningfully test persistence, health checks or deployment. If it becomes too complex, software development will take time away from the infrastructure learning goals.



DOT strategy and method:



Workshop → Decomposition



Break the application into only the components required by the infrastructure goals and deliberately exclude unnecessary functionality.



Library → Documentation / best practices



Use official documentation where needed to determine appropriate basic usage of Node.js, Express and SQLite rather than guessing implementation details.



Lab → System test



Expected result:



A small local application that is sufficiently realistic for the later infrastructure work while remaining quick to understand and maintain.



How it will be documented:

research note

application source code

README/run instructions

automated test results

selected screenshots

Git commits

later evidence document when this becomes a meaningful completed work unit



Definition of done:

Application can be started locally with a documented command

Browser can access the application

/health reports the application as healthy

Application reads/writes actual persistent data

Data survives application restart

Frontend communicates with backend

At least one automated test exists

Another developer could understand how to run it

