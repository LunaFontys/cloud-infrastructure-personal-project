# Docker Fundamentals and Local Containerisation



### 1\. Context and Goal

The application currently runs directly on my development machine.

Before deploying it to EduCloud, I want to containerise the application so that

it runs reproducibly and so that its persistent SQLite data is not tied to the

lifecycle of an individual container.

This work unit focuses on understanding and applying the Docker fundamentals

needed for this project before deployment to EduCloud.



#### Main research / decision question

How can I containerise the Node.js/Express/SQLite application so that it runs

reproducibly in Docker while keeping persistent application data outside the

container lifecycle?



### 2\. Definition of Done

* I can explain the difference between a Docker image and container.
* I understand what the Dockerfile instructions used in this project do.
* The application image builds successfully.
* The application runs locally inside a Docker container.
* The browser can access the application through a published port.
* `/health` works from the containerised application.
* Application functionality still works inside the container.
* SQLite data is stored outside the disposable container filesystem.
* Data survives removing and recreating the application container.
* The container can be started using documented commands.



### 3\. Analysis

#### Goal of this activity

Understand the current application and investigate the technical requirements,

constraints and available Docker approaches before choosing a solution.



#### Current situation

The application currently runs directly on my Windows development machine using

Node.js 24.



The application consists of:



\- a Node.js/Express backend

\- a static HTML/JavaScript frontend served by Express

\- an SQLite database using the built-in `node:sqlite` module

\- automated tests using Node's built-in test runner



The application normally listens on port 3000.



The SQLite database path can be configured using the `DATABASE\\\\\\\_PATH`

environment variable. If this variable is not provided, the application uses

its normal local database path.



The application exposes a `/health` endpoint that can be used to verify that

the application is responding.



A `package-lock.json` file is available, so dependencies can be installed

reproducibly.



#### Relevant constraints

The containerisation approach should:



\- use a Node.js version compatible with the application's use of `node:sqlite`

\- include everything needed to run the application without depending on the

&#x20; Node.js installation on the host

\- make the Express application reachable from the host machine

\- preserve SQLite data independently from an individual container

\- remain simple enough for this project and later EduCloud deployment

\- support automated testing and later CI/CD

\- avoid unnecessary privileges where practical

\- avoid including development files and local data in the Docker image when

&#x20; they are not required



#### Questions to answer

* What parts of the current application need to be included in the image?
* Which Node.js base image should be used?
* How should the application's port be exposed and published?
* Where should the SQLite database be stored?
* What is the difference between a named volume and a bind mount for this use case?
* Which files should not be copied into the image?
* Which basic security practices are appropriate for this container?



#### DOT method

Library → Literature study

Use official Docker documentation and relevant Node.js documentation to

investigate:

* images and containers
* Dockerfiles
* base images and image tags
* build context
* `.dockerignore`
* port exposing and publishing
* volumes and bind mounts
* container lifecycle
* running containers as a non-root user.



#### Findings

##### Node.js base image research

The application currently depends on Node.js 24 because it uses the built-in `node:sqlite` module.



The official Node.js Docker images provide version-specific base images such as `node:24`, as well as variants such as Debian-based, slim and Alpine images



The normal Node image is the general-purpose option. Slim and Alpine images can reduce image size but also remove software or change the underlying Linux environment.



For this project, runtime compatibility and simplicity are currently more important than minimizing image size.



##### Persistent storage research

Three approaches were considered for the SQLite database.



###### Container writable layer

The database could be stored only inside the container.



This is simple, but data in the container's writable layer is tied to that

container. Removing the container would also remove the database.



This does not satisfy the persistence requirement.



###### Bind mount

A directory from the Docker host can be mounted directly into the container.



Advantages:

\- the database is directly accessible from the host;

\- the storage location can be explicitly controlled.



Disadvantages:

\- the configuration depends on a host filesystem path;

\- local Windows paths and later EduCloud Linux paths differ;

\- the container setup is therefore more coupled to the host environment.



###### Docker named volume

Docker can create and manage persistent storage independently from the

container.



Advantages:

\- lifecycle is independent from the application container;

\- does not require choosing a normal host directory;

\- suitable for persistent application-generated data;

\- portable between container recreations on the same Docker host.



Disadvantage:

\- the files are less convenient to directly inspect or edit from the host.





Both bind mounts and named volumes can provide persistence, but they serve

somewhat different purposes.



##### Build context analysis

The image needs the application source code and dependency definitions, but it

does not need every file from the development environment.



Files such as local `node\\\\\\\_modules`, Git metadata and the local SQLite database

should not be copied into the application image.



In particular, dependencies installed on the Windows development machine

should not be reused directly inside the Linux container. The image should

install its own dependencies based on `package.json` and `package-lock.json`.



A `.dockerignore` file will therefore be required.



##### Container user / privilege research

Containers run as root by default unless another user is configured.



The official Node.js image includes a non-root `node` user. The Node Docker

documentation recommends running the application as an unprivileged user when

root permissions are not required.



The application itself does not appear to require root privileges.



File ownership and write permissions for the SQLite storage must still be

considered when designing this.



##### Port and networking research

The application currently listens on TCP port 3000.



A container has its own network environment, so a port used by an application

inside the container is not automatically available through the same port on

the Docker host.



Docker port publishing creates a mapping between a host port and a container

port.



For example:



`-p 8080:3000`



would forward traffic received on port 8080 of the Docker host to port 3000

inside the container.



The host and container port numbers do not need to be the same.



###### EXPOSE

A Dockerfile can contain:



`EXPOSE 3000`



This indicates that the application in the image is intended to listen on port

3000\.



`EXPOSE` does not itself make the application accessible from the Docker host.

The port must still be published when the container is created, for example

with the `-p` option.



###### Local accessibility

Publishing a port without specifying a host IP normally makes it available on

all network interfaces of the Docker host.



For local development, the application only needs to be accessible from my own

computer.



Docker supports binding the published port specifically to localhost, for

example:



`-p 127.0.0.1:3000:3000`



This maps localhost port 3000 on the development machine to port 3000 inside

the container without deliberately publishing the application on all host

interfaces.



###### Future deployment

For local containerisation, the browser will communicate directly with the

published application port.



The later EduCloud architecture may differ. A reverse proxy could become the

externally reachable component and communicate with the application through a

Docker network instead of exposing the application container directly.



The container should continue to listen internally on port 3000. For local testing, the port can be published to localhost rather than deliberately exposing it on every host interface.



### 4\. Advice / Technical Decisions



#### Goal of this activity

Turn the analysis findings into justified recommendations for how this

application should be containerised.



#### Decisions to make

Examples:

* Which Node.js image/tag should be used?
* Should persistent SQLite data use a named volume or bind mount?
* Which port should the application use?
* Should the container run as root or as a non-root user?
* Which files should be excluded from the build context?



#### DOT method

The advice will primarily be based on the findings from the Library research.

Where multiple reasonable options exist, compare them using criteria such as:

* simplicity
* maintainability
* security
* reproducibility
* compatibility with the existing application;
* suitability for later EduCloud deployment.



#### Recommendations

Based on the analysis, the following recommendations were made before designing

and implementing the container.



Use the official Debian Bookworm-based Node.js 24 image because it matches the application's runtime requirement while keeping the container environment conventional and easy to understand. Avoid Alpine/slim optimisation until there is an actual requirement for smaller images.



Install dependencies with npm ci based on the committed lockfile to make container builds more predictable. The runtime image should contain only runtime dependencies where practical.



Use a Docker named volume for local SQLite persistence because the data is application-generated, should survive container replacement, and does not need to depend on a Windows-specific host path. Re-evaluate the storage mechanism for EduCloud, where an explicit persistent host directory already exists.



Keep Express listening on container port 3000, declare that port with EXPOSE 3000, and bind it only to localhost during local testing. External exposure on EduCloud should be designed separately rather than copied from the local configuration.



Run the application as the built-in non-root node user because the application does not require root privileges. The persistent SQLite directory must be designed so that this user has the required write permissions.



Use .dockerignore to keep local/development data out of the build context, and copy only the files needed to run the application into the final image.



Start with a clear single-stage Dockerfile. Reconsider multi-stage builds if later requirements, image scanning, build tooling or CI provide a concrete benefit.







### 5\. Design



#### Goal of this activity

Translate the recommendations into a concrete container design before

implementation.



#### Design to define

* application image structure
* Node.js runtime version
* working directory
* dependency installation
* application start command
* container port
* host-to-container port mapping
* persistent database location
* volume/mount relationship
* user permissions
* files excluded through `.dockerignore`.



#### DOT method

Workshop → Prototyping / technical design

Create a concrete container design based on the recommendations.

A diagram can be added here once the design has been chosen.



##### Container architecture

The application will run as a single Node.js container based on

`node:24-bookworm`.



The container will run the Express application on port 3000.



For local development, host port 3000 will be mapped to container port 3000

through the localhost interface.



Architecture:



Browser

→ 127.0.0.1:3000

→ Docker port mapping

→ application container :3000

→ Express application

→ SQLite

→ persistent Docker volume



##### Repository and build context

The `Dockerfile` and `.dockerignore` will be stored inside the `app/`

directory.



The application directory will be used as the Docker build context so that

project documentation and unrelated infrastructure files are not included in

the image build.



##### Container filesystem

The application will be stored at:



`/app`



Runtime application files will include:



\- `/app/src`

\- `/app/public`

\- `/app/package.json`

\- `/app/package-lock.json`

\- `/app/node\\\_modules`



Persistent application data will be stored separately at:



`/app/data`



##### Runtime configuration

The container will use:



`NODE\\\_ENV=production`



`PORT=3000`



`DATABASE\\\_PATH=/app/data/app.db`



This allows the existing application to use its configurable database path

without requiring Docker-specific changes to the application source code.



##### Persistent storage

A Docker named volume called:



`cloud-project-data`



will be mounted at:



`/app/data`



The SQLite database will therefore be stored at:



`/app/data/app.db`



The volume lifecycle will be independent from the lifecycle of an individual

application container.



##### Permissions

The application will run as the non-root `node` user provided by the official

Node.js image.



The `/app/data` directory must be writable by this user so that SQLite can

create and modify the database.



This will be explicitly tested during validation.





##### Dependency installation

`package.json` and `package-lock.json` will be copied before the application

source.



Dependencies will then be installed using:



`npm ci --omit=dev`



Application source files will be copied afterwards.



This structure also allows Docker's build cache to reuse the dependency layer

when the application source changes but dependencies do not.



##### Application startup

The container will start the application directly with:



`node src/server.js`



rather than adding an unnecessary npm process between Docker and the Node.js

application.



##### Networking

The image will declare:



`EXPOSE 3000`



During local testing the container will be published through:



`127.0.0.1:3000:3000`



The later EduCloud networking and reverse proxy configuration will be designed

separately.



##### Build exclusions

A `.dockerignore` file will exclude development and local files that are not

required by the runtime image, including:



\- local `node\\\_modules`;

\- local SQLite databases/data;

\- Git metadata;

\- test files;

\- temporary/log files;

\- non-runtime documentation.



##### Scope

The first implementation will use:



\- one application container;

\- one named volume;

\- one published local port;

\- one single-stage Dockerfile.



Docker Compose, multi-stage builds and reverse proxy configuration are outside

the scope of this local containerisation work unit and will only be introduced

when they solve a concrete later requirement.



### 6\. Realisation



#### Goal of this activity

Implement the chosen container design.



#### Expected implementation

* create `.dockerignore`
* create `Dockerfile`
* build the Docker image
* run the application container locally
* configure the required port mapping
* configure persistent SQLite storage



#### DOT method

Workshop → Prototyping

Implement the container design incrementally and adjust the prototype where

technical issues are discovered.



#### Implementation notes

To be completed during implementation.



### 7\. Validation



#### Goal of this activity

Verify that the realised container satisfies the requirements and design.



#### DOT method

Lab → System test

Validate the complete containerised application.



#### Planned tests



###### Application test

start the container;

open the application in the browser;

verify normal application functionality.



###### Health test

request `/health`;

verify that the application reports a healthy response.



###### Persistence test

Start a container with persistent storage.

Create application data.

Verify that the data exists.

Stop the container.

Remove the container completely.

Create a new container from the same image.

Attach the same persistent storage.

Verify that the original data still exists.

This test is important because restarting the same container alone does not

prove that the data is independent from the container lifecycle.



#### Results

##### Persistent storage system test

The main persistence requirement was tested by storing application data,

removing the application container completely, and creating a new container

using the same Docker named volume.



###### Test procedure

1\. Started the application container with the `cloud-project-data` named volume

&#x20;  mounted at `/app/data`.

2\. Created a service called `Persistence test`.

3\. Created an incident with the message `Container persistence test`.

4\. Verified that both appeared in the application.

5\. Stopped the application container.

6\. Removed the container using `docker rm`.

7\. Used `docker ps -a` to verify that the original container no longer existed.

8\. Used `docker volume ls` to verify that `cloud-project-data` still existed.

9\. Created a new container from `cloud-project-app:local` and mounted the same

&#x20;  volume at `/app/data`.

10\. Opened the application again and verified that the previously created

&#x20;   service and incident were still present.



###### Result

The test passed.

The original application container was completely removed while the

`cloud-project-data` volume remained. After creating a new container and

mounting the same volume, the previously created service and incident were

still available.



This demonstrates that the SQLite database is stored independently from the

lifecycle of an individual application container.



###### Conclusion

Using a Docker named volume successfully provides persistent SQLite storage for

the local containerised application. Replacing the application container does

not remove the application's stored data as long as the persistent volume is

retained.



##### Application functionality test

The application was also tested after containerisation to verify that the

container environment did not break the existing application functionality.



The following actions were successfully tested:



\- loading the frontend through the published Docker port;

\- creating a service;

\- changing a service status;

\- creating an incident;

\- refreshing the page and retrieving the stored data;

\- accessing the `/health` endpoint.



###### Result

Passed. 

The existing application functionality continued to work when the application

was executed inside the Docker container.





### 8\. Conclusion and Reflection

The Node.js/Express/SQLite application was successfully containerised and run

locally using Docker.



The implementation uses a Node.js 24 Debian-based image, installs dependencies

inside the image, runs the application as a non-root user, publishes the

application only through localhost for local testing, and stores SQLite data

in a Docker named volume.



The most important validation was the persistence test. Application data was

created, the original container was stopped and completely removed, and a new

container was created using the same named volume. The previously created data

was still available. This confirmed that persistent application data is

independent from the lifecycle of an individual container.



During setup, Docker Desktop initially could not start because the required

WSL 2 environment was not fully configured. Hardware virtualization was

confirmed to be enabled, after which WSL 2 was installed/configured and Docker

was successfully validated using `docker info` and the `hello-world`

container.



This work improved my understanding of the difference between images,

containers and volumes, Docker networking and port publishing, build contexts,

container filesystem permissions, non-root execution, and persistent storage.



The local Docker configuration is intentionally simple. Decisions about

EduCloud storage, external networking, reverse proxying and deployment will be

handled separately because the deployment environment has different

requirements from the local development environment.



### 9\. Feedback

Expert feedback

Feedback provider:

Date:

Feedback:

My interpretation:

Changes made:

Remaining actions:



### 10\. Source Artifacts

Dockerfile

.dockerignore

research sources

Git commits

selected screenshots

persistence test results



### 11\. AI Use

ChatGPT was used as a learning and troubleshooting assistant to explain Docker

concepts, help structure the research process, discuss technical options and

support troubleshooting.

I performed the implementation and testing myself, interpreted the results and

made the project decisions based on the research and validation performed.

