\# Architecture v0



\## Date

7 September 2026



\## Purpose



This document describes the initial architecture for the Cloud Application \&

Infrastructure personal project.



This is not the final architecture. It represents my current understanding of

the system based on the initial requirements and is expected to change as I

research, build, and test the infrastructure.



\## Architecture Overview



```mermaid

flowchart TD

&#x20;   DEV\[Developer PC]

&#x20;   GIT\[GitHub Repository]

&#x20;   CI\[GitHub Actions<br/>CI pipeline]

&#x20;   REG\[Container Registry<br/>planned]

&#x20;   VM\[EduCloud Ubuntu VM]

&#x20;   DOCKER\[Docker Engine]

&#x20;   APP\[Node.js / Express Application<br/>Docker Container]

&#x20;   DATA\[(Persistent SQLite Data)]

&#x20;   LOGS\[Application / System Logs]

&#x20;   MON\[Monitoring<br/>planned]



&#x20;   DEV -->|git push| GIT

&#x20;   GIT -->|trigger| CI

&#x20;   CI -->|test + build| REG

&#x20;   REG -->|container image| DOCKER



&#x20;   VM --> DOCKER

&#x20;   DOCKER --> APP

&#x20;   APP --> DATA

&#x20;   APP --> LOGS

&#x20;   VM --> LOGS

&#x20;   LOGS --> MON

```



\## Public Access



```mermaid

flowchart LR

&#x20;   USER\[User / Browser]

&#x20;   NET\[EduCloud Network<br/>Firewall / Security Rules]

&#x20;   VM\[Ubuntu VM]

&#x20;   RP\[Reverse Proxy<br/>planned]

&#x20;   APP\[Application Container]



&#x20;   USER -->|HTTPS eventually| NET

&#x20;   NET --> VM

&#x20;   VM --> RP

&#x20;   RP --> APP

```



\## Components



\### Developer environment



Development takes place locally before changes are committed and pushed to GitHub.



\### GitHub



GitHub stores the source code, documentation and configuration for the project.

GitHub Actions is currently intended to provide CI/CD functionality.



\### EduCloud



EduCloud will be the primary hosting environment. Initially I expect to use a

single Ubuntu virtual machine.



\### Docker



Docker will run the application in a container on the EduCloud VM. This should

make the application environment more reproducible between development and

deployment environments.



\### Application



The application will initially be a small Node.js / Express service-status and

incident-tracking application.



\### Persistence



SQLite will initially be used for application data.



The database should be stored outside the disposable filesystem of the

application container so that the data survives container replacement.



\### Networking



EduCloud networking and firewall/security rules will control which services are

externally reachable.



A reverse proxy and HTTPS are planned, but the exact implementation has not yet

been selected.



\### Logging and monitoring



Application and infrastructure logs should eventually help investigate failures.



The exact monitoring solution has not yet been chosen.



\## Initial Assumptions



\- One EduCloud VM will initially be sufficient.

\- The application will run as a Docker container.

\- SQLite is sufficient for the first version of the application.

\- Application data must survive container replacement.

\- GitHub Actions will likely be used for CI/CD.

\- A container registry will probably be required.

\- A reverse proxy will eventually sit in front of the application.

\- Only necessary network services should be publicly reachable.

\- Monitoring and Infrastructure as Code will be added later if justified.

\- The architecture will change as I gain more knowledge and test these assumptions.



\## Requirements Mapping



| Requirement | Architecture response |

| --- | --- |

| FR-01–03 | Node.js / Express application |

| FR-04 | SQLite with persistent storage |

| FR-05 | Application health endpoint |

| NFR-01 | EduCloud VM |

| NFR-02 | Docker |

| NFR-03 | Automated tests |

| NFR-04 | GitHub Actions / build pipeline |

| NFR-05 | EduCloud networking and firewall rules |

| NFR-06 | Planned reverse proxy and HTTPS |

| NFR-07 | External configuration / secret handling, still to be designed |

| NFR-08 | Application and system logging |

| NFR-09 | Monitoring solution still to be selected |

| NFR-10 | Automation / Infrastructure as Code later |

| NFR-11 | EduCloud as the primary no-cost hosting platform |

