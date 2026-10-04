# Basic CI with GitHub Action



### Goal

Automatically validate the application when changes are pushed to GitHub.



The CI workflow should:



\- install the application dependencies;

\- run the automated tests;

\- verify that the Docker image can still be built.



### Starting point

The application already has automated tests and a working Dockerfile, but these

checks currently have to be run manually.



### CI design

I used GitHub Actions because the project is already hosted on GitHub and it can

automatically run checks when code is pushed or when a pull request is opened.



The workflow uses one job on an Ubuntu runner and performs these steps:



1\. Check out the repository.

2\. Set up Node.js 24.

3\. Install the application dependencies with `npm ci`.

4\. Run the automated tests with `npm test`.

5\. Build the Docker image.



I used `npm ci` instead of `npm install` because CI should install the exact

dependencies from `package-lock.json`.



The Docker image is only built during this workflow. It is not deployed yet.



### Implementation

I created:



`.github/workflows/ci.yml`



The workflow runs on:



\- pushes;

\- pull requests.



The application is inside the `app` directory, so the dependency installation,

tests and Docker build all run from that directory.



The first successful workflow used older versions of `actions/checkout` and

`actions/setup-node`, but GitHub showed a Node.js 20 deprecation warning for

those Actions.



I updated them to the newer versions and ran the workflow again.



### Validation

The workflow was triggered by pushing the changes to GitHub.



The final run completed successfully without errors or warnings.



This confirmed that GitHub Actions can automatically:



\- check out the project;

\- use Node.js 24;

\- install the dependencies;

\- run the automated tests;

\- build the Docker image.



### Result

The project now has a basic CI pipeline.



Changes pushed to GitHub are automatically checked before I continue with later

deployment and infrastructure work.



This is only CI for now. Automatic deployment to EduCloud is not included yet.

