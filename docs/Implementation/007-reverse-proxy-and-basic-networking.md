# Reverse Proxy and Basic Networking



### Goal



Put a reverse proxy in front of the application so that the application

container is no longer the main entry point.



### Starting point



\- The application runs in Docker on the EduCloud VM.

\- The application is currently published directly on port 3000.

\- Persistent application data is stored on the separate data disk.



### Analysis



Compare the suitable reverse proxy setups for this project.



Questions:



\- What does the reverse proxy need to do?

\- Should NGINX run directly on the VM or in Docker?

\- How should the reverse proxy communicate with the application container?

\- What are the advantages and disadvantages of each option for this project?



The purpose of a reverse proxy is to act as an entry point between clients and the services behind it. Instead of accessing the application directly, HTTP traffic first reaches the reverse proxy, which then forwards the request to the correct service.

This gives one place where rules can be applied to incoming traffic, for example requiring HTTPS. A reverse proxy can also handle TLS termination, where HTTPS traffic is decrypted by the proxy before being forwarded to the application. It also hides the internal IP addresses and ports of the services behind it from the client.

For this project the reverse proxy should become the main entry point for HTTP traffic to the application. The application should then no longer need to be directly reachable from outside the Docker environment.

NGINX can either run directly on the Ubuntu VM or inside Docker.

Running NGINX directly on the VM is the simpler and more traditional setup and requires one less container. NGINX could communicate with the application through a port that is only exposed locally on the VM. This does mean that the backend must no longer be reachable externally. A disadvantage is that part of the application infrastructure would then be managed directly on the host while the application itself is managed through Docker.

Running NGINX in Docker means that both the application and reverse proxy can be managed as part of the container environment. Their configuration can be kept together with the rest of the project and the setup is easier to reproduce on another machine. The containers can communicate over a Docker network without exposing the application's port directly to the host. This does introduce Docker networking and potentially Docker Compose as additional concepts that need to be managed.

If NGINX runs in Docker, NGINX and the application container can be connected to the same user-defined Docker network. Docker provides DNS resolution inside this network, which means NGINX can forward requests to the application using its container or service name instead of relying on a host IP address.



### Advice



Based on the analysis, recommend the reverse proxy setup that is most suitable

for this project.



The advice should explain:



\- which option I recommend;

\- why it fits the current EduCloud setup;

\- how it supports later security, HTTPS, logging and monitoring work;

\- which trade-offs I am accepting;

\- why I do not recommend the alternative option.



Based on the analysis, I recommend running NGINX inside Docker together with the application.

The VM-hosted option would be slightly simpler, but the Docker option fits this project better because the application is already containerised and I want the infrastructure setup to be reproducible. It also allows the application port to remain inside the Docker network instead of being directly exposed on the VM.

Docker networking is an extra concept that I will have to learn, but this is also relevant to the learning goal of the Personal Project rather than unnecessary complexity.

This setup also gives me a better base for later work on HTTPS, security, logging and monitoring.



### Design





Include:



\- where NGINX runs;

\- where the application container runs;

\- how traffic moves between them;

\- which ports are exposed;

\- which ports should no longer be directly accessible;

\- how this fits into the existing EduCloud architecture.



Based on the advice, NGINX will run as a separate container together with the application container.

Both containers will be connected to the same Docker network. NGINX will be the only container with a port published to the VM. The application will continue listening on port 3000, but this port will only be available inside the Docker network.

NGINX will forward incoming requests to the application using the application's Docker network name.

The existing persistent storage setup will remain unchanged. The application container will continue to use:

/srv/cloud-project/app-data → /app/data



### Implementation



Implement the chosen reverse proxy setup.



### Validation



Verify that:



\- the application is reachable through the reverse proxy;

\- the proxy correctly forwards requests to the application;

\- `/health` works through the proxy;

\- normal application functionality still works;

\- direct access to the application port is removed or restricted.



### Result



Summarise what was implemented, whether it worked, and what this enables next.

