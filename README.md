# Sharehouse clean project tree structure

[toc]: https://github.com/shaddyshad/sharehouse-rc1.git
[md]: https://github.com/shaddyshad/sharehouse-rc1.git/README.md
## [Table of Contents][toc]
+ Conventions
  - [API Conventions][md]
  - [Code conventions][md]
+ Project Structure
+ [Project Infrastructure][md]
+ File structure
+ Contributing
+ [Changelog][md]


### Conventions

#### [API Conventions][md]

The API's that are mostly found in [this][./routes] root, adopt a different convention that would be very important to talk about.

First
*Using JSON status payload to communicate results*

Since the API is fully a backend API, exposing just the API to be called by a client, communication of a request status is usually accomplished using a json payload of this structure.

```javascript
  {"status": "[error|success]", "message":"[More descriptive status of the request]"}
```
This means that, once a client makes a call to an API they should check the resulting payload and act accordingly.
But when they request for data, the json payload sent back is different, as it contains the actual results of the call. This can be anything like a list of all warehouses, e.t.c.

#### [Code Conventions][md]

Sections marked with *__FIXME__* indicate sections that need attention before the build is done. These are mostly internal or private function that have been used without being defined, or somewhere a mistake has been intentionally introduced, so as to not block the code flow.

Sections marked with *__TODO__*  indicate sections that will need revisiting in future. This include minor features that were ignored to save time for major features.
They include things like ignored error checking and handling, or trivial things like testing.

### [Project Structure]()

The project is divided into two logical segments:

 - The application core
 - API endpoints

The core, is responsible for setting up the application utilities, including loggers, database connection and all the middleware that the routing will need.

 `routing` and `endpoint` might be used interchangeably.

 The API points are registered by the core as event listeners, when a request is received and mounted on an endpoint, the endpoint code is run with it's sandbox context.
 A sandbox context means that related functionalities and APIs have access to shared resources, like database collection and no else. This means that code in the warehouse API cannot mess, or interact with data outside the warehouse db.

 *`Detailed documentation can be found inside the code files, one for every directory, and more if more detail is needed`*
