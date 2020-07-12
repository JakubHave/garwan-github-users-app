# garwan-github-users-app
This application displays information about GitHub users (e.g. repositories, followers).
There is also a possibility to log in with GitHub token and see private information (e.g. issues)

To run this application:
* clone this repository
* install [NodeJS](https://nodejs.org/)
* navigate to project folder (garwan-github-users-app) and run `npm install`
* for running locally, run `ng serve` (or `ng s`) and you can see the application on http://localhost:4200
* for building a deployable artefact run `ng build --aot --prod` which creates an artefact under `/dist` folder
   (btw. `npm install` creates the artefact already as it runs postinstall script `ng build --aot --prod`)
* you can test the artefact locally by running `node server.js`, which starts ExpressJS server with the artefact on http://localhost:8080
