# EduCloud Docker Deployment



### Goal

Deploy the existing Dockerised application to the EduCloud VM and store the

SQLite database on the VM's persistent data disk.



### Starting point

\- Ubuntu VM is available in EduCloud.

\- VPN and SSH access work.

\- Docker image works locally.

\- `/srv/cloud-project` is mounted from the separate persistent data disk.

\- The application expects persistent data at `/app/data`.



### Deployment decision

For the local Docker setup I used a Docker named volume because I did not want

the setup to depend on a Windows filesystem path.



On the EduCloud VM I already had a separate persistent data disk mounted at

`/srv/cloud-project`. Because this disk was specifically prepared for persistent

project data, I decided to use it directly instead of creating another

Docker-managed volume.



I used a bind mount from:



`/srv/cloud-project/app-data`



to:



`/app/data`



inside the container.



The application already expected its SQLite database at `/app/data/app.db`, so

this did not require changes to the application.



### Implementation

Docker Engine was installed on the Ubuntu VM using Docker's official Ubuntu

repository and verified by successfully running a test container.



I cloned the project repository onto the VM and built the application image

from the existing Dockerfile.



The container runs as the non-root `node` user with UID/GID `1000:1000`.

I configured `/srv/cloud-project/app-data` so this user can write the SQLite

database to the persistent disk.



The application container was then started with port `3000` published and

`/srv/cloud-project/app-data` bind-mounted to `/app/data`.



### Validation

I tested that:



\- the container started successfully;

\- the application was reachable on port 3000;

\- the normal application functionality worked;

\- `app.db` was created in `/srv/cloud-project/app-data`;

\- the container could be stopped and completely removed;

\- `app.db` remained after the container was removed;

\- a new container could use the same bind mount;

\- the service and incident created before removing the container were still

&#x20; available in the new container.



This confirmed that the application data is stored separately from the

container and persists when the container is replaced.



### Result

The containerised application is now running successfully on the EduCloud VM

with its SQLite data stored on the separate persistent disk.



The application is currently exposed directly on port 3000. This is sufficient

for the current deployment test, but the networking setup will be improved

later when I work on the reverse proxy and security.

