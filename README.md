[![Build Status](https://semaphoreci.com/api/v1/filleduchaos/libre-dms/branches/development/badge.svg)](https://semaphoreci.com/filleduchaos/libre-dms) [![Client Coverage](https://codecov.io/gh/andela-pessien/libre-dms/branch/development/graph/badge.svg)](https://codecov.io/gh/andela-pessien/libre-dms) [![Server Coverage](https://coveralls.io/repos/github/andela-pessien/libre-dms/badge.svg?branch=development)](https://coveralls.io/github/andela-pessien/libre-dms?branch=development) [![Code Climate](https://codeclimate.com/github/andela-pessien/libre-dms/badges/gpa.svg)](https://codeclimate.com/github/andela-pessien/libre-dms) [![Issue Count](https://codeclimate.com/github/andela-pessien/libre-dms/badges/issue_count.svg)](https://codeclimate.com/github/andela-pessien/libre-dms)

# LibreDMS
A free and open-source document management system implemented in Javascript.
Check it out on [Heroku](https://libre-dms-staging.herokuapp.com))

### Features
  LibreDMS is used to track, manage and store documents.
  - Stateless authentication with JSON web tokens
  - Create, edit and delete documents
  - Different document access levels:
    - **Private** documents can only be accessed by their owner and the administrators/superadministrator
    - **Role access** documents can only be accessed by their owner, other users with the same privilege level and the administrators/superadministrator
    - **Public** documents can be accessed by every registered user
  - Different privilege levels:
    - The **superadministrator** has view access to all the documents in the system (including the documents of deleted users) and has the ability to delete them. They can promote and demote users to any privilege level except superadministrator (of which there can be only one)
    - **Administrators** have view access to all documents excluding those of deleted users. They can promote and demote regular users and reviewers but cannot demote fellow administrators
    - **Reviewers** are a step below administrators and have the (*coming soon*) ability to leave review comments on users' documents. They can access
    - **Regular users** 

### Technologies
  This project uses a [NodeJS](https://nodejs.org) server with [Express](https://expressjs.com/) as its web application framework. It uses a [PostgreSQL](https://www.postgresql.org) database with models managed with [Sequelize](docs.sequelizejs.com).
  Its frontend is a [React](https://facebook.github.io/react/) app with its state managed by [Redux](http://redux.js.org/). It follows material design principles using the [Materialize](http://materializecss.com) CSS framework and own styling in [Sass](http://sass-lang.com/).
  Some other technologies used include [Webpack](https://webpack.js.org) to transpile and bundle client code, [Babel](https://babeljs.io) for transpiling ES6 to ES5, [Nodemon](https://nodemon.io/) for hot-reloading the server during development and [NPM scripts](https://docs.npmjs.com/misc/scripts) for running various tasks.

### How can you get started?
  Fouille is hosted on [Heroku](https://fouille.herokuapp.com), so you can just visit and
  use that. However, if you want to get a bit hands-on:
  - Clone the repo with the link Github provides.
  - Change directory to `inverted-index` and run `npm install` to install the app.
  - Make sure you have MongoDB installed and an instance of mongod running.
  - Create a .env file in the root of the folder following the format in the provided
  sample.env file.
  - Run `npm start` to launch the app.
  - You can now use Fouille by visiting http://localhost:port (where `port` is the PORT environment variable in your .env file).
  3000 with).
  - To launch the app in a development-optimized environment, run `npm run start:dev`. Visit http://localhost:port (where `port` is the DEVPORT environment variable) to take advantage of both [nodemon](https://nodemon.io/) and [Browsersync](https://www.browsersync.io/).
  - You can test the app by running `npm test`.

### Limitations
  LibreDMS' current limitations (aka features in development) include:
  - Handles only text documents
  - Documents cannot be shared with specific other users
  - Reviewers cannot currently leave reviews on documents
  - Lack of email verification and notifications
  - Users cannot download their documents
  - Users cannot upload documents to the system
  - Lack of refresh tokens for continued authentication

### Contributing to the project
  If you want to contribute to this project, you can fork it, clone it and create a pull request against the development branch once you've pushed your changes to your fork. For branch naming conventions, please use `feat/short-feature-description` for new features, `chore/short-chore-description` for chores, and `bug/short-bug-description` for bugs.

### License
  This project is available for use and modification under the MIT License. See the LICENSE file for more details.
