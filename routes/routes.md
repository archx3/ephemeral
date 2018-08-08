## Main API structure documentation

This file describes the structure of the provided API, their usage, caveats and other information.
Mostly, the files in here just provide different API end point to clients and they can access it from any RESTful compliant client.
*notes*   
Something important to know is the protocol used by the services provided here.   
- `JSON` is used to exchange messages between the client and the server
- `error`. Error messages are communicated to the client in form of response status, with a message to indicate what is happening.
- `success` - Some success messages may include data, which is directly sent over JSON to the client, but some operations, like `insert`, where really, at a minimum level, the client is only interested in finding out if everything went well, or a problem was encountered, are also comminicated via `JSON statuses`.   
This is a standard I adapted just for the MVP, maybe after a few iterations, we'll get better.

[root]: https://github.com/shaddyshad/sharehouse-rc1.git/routes/routes.md

### [Files][root]
+ booking.js - Description of API found at `/warehouses/booking` responsible for processing booking
+ database.js - Common API used in establishing communication with the DB
+ index.js - Main root API rooted at `/`, has really no business logic associated.
+ [routes.md][root] - This file
+ users.js - Description of User related API's found at `/users` responsible for user processing functionalities
+ warehouse.js - Description of Warehouse related APIs and business logic rooted at `/warehouses`, responsible for processing warehouse

### Files    
*`users.js`*

 - Contains definitions of services regarding the manipulation of users to client. Mainly, it is heavily depended on by services like login, signup among other that rely on user data existence.   
For most listing services, they can be accessed via a `GET` request to the endpoint, but still requires to be a validated request. The system uses a very simple state machine to determine if a request is authenticated and authorized to access the data, and if not, returns an error message.

#### API endpoints
*get('/users')*   
__parameters__
* (<None>)[]

__Returns__
* [users] - A json compliant users objects is returned, potentially null, containing all the users currently in the DB.   

Returns a list of all users.  

When no user exist in the DB, the API returns an empty JSON object, else, returns a list of valid `User` instances.

__Errors__   

This API might fail due to connection errors, as such, the API depends on the built in Promise object to handle the errors. If an error happens, the API returns a json document with the status set to `error` and the appropriate `error message` set.


*`warehouse.js`*

Contains definitions for services relating to creation and manipulation of warehouse, listing, and all queries on the warehouse data store.

A warehouse is a central data object in sharehouse and the whole business is built around finding best fit for a search form. The location queries and posting impose the greatest business logic on the MVP.

#### API endpoints

*get('/warehouses')*

__parameters__

* None

__Returns__

A list of available warehouses.

When no warehouse exist, the API potentially returns an empty queryset.

__Errors__

Like all GET API's that get data from the database, database connection errors might affect the connection after which the client is notified with a json response with the error status code set and the appropriate error message set.

*post('/warehouse')*

Add a warehouse to the Database. Mostly, done during signup, as most operators will upload their warehouses during that period.

If the warehouse location match, or we suspect to be from the same person, will the same location, the application will reject the house.
Once a warehouse is added to the database, it is open for listing and booking.

__parameters__

The data to be added to the database is expected to be set on requests body structure. At the moment, the API expects the request body to have this formatting.
```javascript
  {"location": "long, lat"}
```
With more development, fields will be added. Currently, all other fields are ignored and only look for location.
When the location data exists just as it is, then the `Array.prototype.slice()` function can be used to convert it into an array of [longitude, latitude].
Currently, there are no means to do further validation of the location, but will be done in future releases. The only verification done however, is to make sure that the length of the array is 2.

If all the values are present, the warehouse creation is done.

This API has more work to be done, since every field that is introduced into the schema, alot of changes has to be made. It is not cohesive enough.

__Returns__

Casually, all the API's here return a json payload, the contents, which determine the context and the result of the output. In this case, it returns status messages indicating success or failures as convention.

*get('/warehouses/')*

Get a list of all warehouses.

Because there exists a variant of this API in the dashboard API's, this API is mostly restricted to depositors.

*get('/dashboard/warehouses')*

Operator side implementation of `get('/warehouses/')`

It returns a set of all warehouses that are managed by the current operator.

The authorization checks for this route includes checking whether the user requesting is an operator, if he/she is even authorized. If it is, then generate a query to get all their warehouses, else, redirect to the appropriate page.
