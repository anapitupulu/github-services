# GitHub Services

* Author: Alex Nico Napitupulu
* Date: August 17, 2019

## Overview

This project is a REST service that interacts with GitHub API. Two main functionalities are:

1. Add / read / delete comments that belong to an organization
2. Gather statistics of organization's members, including number of followers and following

## REST API

### Comments

This is an endpoint to add / read / delete comments of an organization

### URL
`/orgs/<organization id>/comments` (e.g.: /orgs/xendit/comments)

### Method
####  `GET`
*Note: `GET` does not return comments that are soft-deleted by `DELETE` request.*

##### Success Response

* Code: 200
* Content:
  ```json
   {
    "status": "OK",
    "data": [
      {
        "organization": "amazon",
        "message": "foo",
      },
      {
        "organization": "amazon",
        "message": "bar",
      }
    ]
  }   

  ```

##### Example

`curl -X GET -H "Content-Type: application/json" http://localhost:8080/orgs/amazon/comments`

####  `POST`

##### Success Response

* Code: 200
* Content:
  ```json
  {
    "status": "OK",
    "id": "db1eccc1-61dd-4ad4-ac13-d48998b2c5b9"
  }

  ```

*Note: `id` is a unique generated identifier for that comment in order to locate that comment in the database.*

##### Error Response

Error can happen if `comment` is not provided in the `POST` body or the request is not in `application/json` format.

* Code: 400
* Content:
  ```json
  {
    "status": "FAIL",
    "message": "notNull Violation: Comment.message cannot be null"
  }

  ```


##### Example

`curl -XPOST -d '{"comment": "bar"}' -H "Content-Type: application/json" http://localhost:8080/orgs/amazon/comments`

####  `DELETE`

##### Success Response

It will return the number of deleted comments from the operation. This operation soft-deletes the comment and the comment can still be found in the database.

* Code: 200
* Content:
  ```json
  {
    "status": "OK",
    "data": {
      "numOfDeletedComments": 0
    }
  }

  ```

##### Example

`curl -XDELETE http://localhost:8080/orgs/amazon/comments`

## Members

This is an endpoint to the get statistic of an organization's members. The result is sorted (descending) by the number of followers

### URL

`/orgs/<organization id>/members` (e.g.: /orgs/xendit/members)

### Method

####  `GET`

##### Success Response

* Code: 200
* Content:
  ```json
  {
    "status":"OK",
    "data":[
      {
        "login":"jsundquist",
        "avatarUrl":"https://avatars2.githubusercontent.com/u/536405?v=4",
        "numOfFollowers":19,
        "numOfFollowing":18
      },
      {
        "login":"blaskovicz",
        "avatarUrl":"https://avatars0.githubusercontent.com/u/10687433?v=4",
        "numOfFollowers":16,
        "numOfFollowing":30
      }
    ]
  }
  ```

##### Error Response

Error can happen if, for example, GitHub credentials are invalid or it hits the rate-limit set by GitHub (60 requests / hour for unauthenticated request and 5000 requests / hour authenticated requests). See [GitHub doc](https://developer.github.com/v3/#rate-limiting) for more detail.
* Code: 500
* Content:
  ```json
  {
    "status": "FAIL",
    "message": "Error processing request: API rate limit exceeded for xxx.xxx.xxx.xxx, ..."
  }

  ```

##### Example

`curl -i -X GET -H "Content-Type: application/json" http://localhost:8080/orgs/xendit/members`

# Build and run

## Prequisites

* Node v10 or above
* Yarn

## Build

[Yarn](https://yarnpkg.com/) is used to managed and pull in dependencies. To build the project, you need to run:

1. `yarn`
2. `yarn build`

## Run

In order to run the services, these variables *have to be defined* in `.env` file in the root folder (or these can be set as environment variables):

1. `GITHUB_USERNAME` - your GitHub's username
1. `GITHUB_PASSWORD` - your GitHub's password
1. `DATABASE_URL` - the connection string for your Postgres database, e.g. `postgresql://user:password@localhost:5432/github`
1. `PORT` - the port to be used for your service or 8080 if not provided

GitHub's credentials are needed because GitHub limits unauthenticated request to its API.

If for some reason it's not able to connect to the database, the service will quit immediately. See the error log (in console) to debug database connection issue.

To run, you can execute: `yarn start`

## Run in development mode

To run the web services in development mode, which supports [hot-reloading](https://nodemon.io/), you can execute: `yarn dev`.


## Docker

`Dockerfile` and `docker-compose.yml` are provided to deploy the services in a Docker container. To run the service in a Docker container, you can run:

1. `docker build --tag=githubservices .` - to build a Docker image
1. `docker run -p 4000:8080 githubservices` - to run the Docker image

*Note: I am very new to Docker and may not necessarily use all the best practices to set up Docker container*

# Directories

## src/

This is where all the source code files are located:

- app.ts - the main file to setup the Express server, Router and logger  
- database.ts - the file to setup Postgres database
- logger.ts - the file to setup adhoc logger
- server.ts - the file that bootstrap the Express server

## src/\_\_tests\_\_

E2E test files are located here.

### src/routers

All Router / endpoint code is located here. There are two endpoints:

1. /orgs/&lt;organization name&gt;/comments
1. /orgs/&lt;organization name&gt;/members

### src/models

All the interface and class files to model an entity like Comment, MemberStats or Member.

### src/utils

All the helper functions are located here.

### src/utils/\_\_tests\_\_

Unit tests for files in `utils` folder.

## build/

All the files that are generated by the build process is located here.

# Implementation

## TypeScript

The project is written in [TypeScript](https://www.typescriptlang.org/). In addition to the compile-time and static-type checking, TypeScript is a modern language that is easy to use.

The code is also linted with [TSLint](https://palantir.github.io/tslint/) to maintain the consistency of style throughout the code.

## Express

[Express](https://expressjs.com/) is the main framework to build the web services.

## Sequelize

[Sequelize](https://sequelize.org/) is the library used to interact with Postgres database. Sequelize abstracts out access to database so we don't have to write any single SQL query and it also gives static-type checking during development.

## Winston

[Winston](https://github.com/winstonjs/winston) is the libary used for logging. [express-winston](https://www.npmjs.com/package/express-winston) is used to log Express activities (request and response). All logs currently are written to the console but can easily be configured to the other mediums (e.g. file).

# Testing

## Jest

[Jest](https://jestjs.io/) is the testing framework used as it's modern and simple. It works really well with TypeScript/JavaScript. All the tests are located in `__tests__` folder with filenames `*.spec.ts`.

To run the test, you can execute `yarn test`. To watch all the test files while developing, you can execute `yarn test -w`.

## Unit tests

Unit tests can be found in `src/utils/__tests__/index.spec.ts`.

## E2E tests

Unit tests can be found in `src/__tests__/e2e.spec.ts`. In order to run E2E tests, please make sure your server is running (either in production or development mode).
