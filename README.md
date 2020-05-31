# BookmarkProjectBackend
## Table of contents
* [Description](#description)
* [Dependencies](#dependencies)
* [Setup](#setup)
* [REST API](#rest-api)
* [License](#license)

## Description
Project is a simple Node.js REST backend for Bookmark application.
API supports numerous user interactions and easy retrieval of important data.

## Dependencies
Project uses
 * Node.js
 * bcrypt 4.0.1
 * body-parser 1.19.0
 * cors 2.8.5
 * express 4.17.1,
 * jsonwebtoken 8.5.1
 * mongoose 5.9.14
 * morgan 1.10.0
 * nodemon 2.0.4

## Setup
In order to install and run this project, type the following commands into terminal:
```
$ npm install
$ npm start
```
3001 is the default port, however you can easily change it in `server.js` file

## REST API
API offers following HTTP methods sorted by their type:

`POST domain/user/signup` for user registration which takes JSON:
```json
{
	"email": "test@example.com",
	"name": "user001",
	"password": "password1"
}
```

`POST domain/user/login` for user login which is sort of unique because may take one of three variants of payload:
```json
{
	"name": "user001",
	"password": "password1"
}
```
or
```json
{
	"email": "test@example.com",
	"password": "password1"
}
```
or
```json
{
	"nameOrEmail": "test@example.com",
	"password": "password1"
}
```
All inputs are recognized and validated by the server side.

`POST domain/opinion` for posting an user opinion where bookId is an id of a book from Google Books API
and rating is required to be a number in the range from 1 to 10.
Requires authorization in a form of bearer tokens.
```json
{
    "bookId": "String_123456",
    "userId": "objectId_123456",
    "rating": 5,
    "comment": "a comment"
}
```

`PATCH domain/opinion/:opinionId` for updating opinion value which takes JSON and a bearer token:
```json
{
    "rating": 8,
    "comment": "edited comment"
}
```

`GET domain/user/:userId` for getting specific user data by userId:
example response:
```json
{
    "info": {
        "_id": "objectId_123456",
        "email": "test@example.com",
        "name": "user001",
        "password": "s0m3C0mp1ic4t3dh4$h",
        "__v": 0
    }
}
```

`GET domain/user/:userId/opinions` for getting specific user opinions by userId:
example response:
```json
{
    "info": [
        {
            "_id": "objectId_123456",
            "bookId": "String_123456",
            "userId": "objectId_654321",
            "date": "2020-05-31T10:58:16.082Z",
            "rating": 8,
            "comment": "a comment",
            "__v": 0
        }, {
            "_id": "objectId_234567",
            "bookId": "String_234567",
            "userId": "objectId_765432",
            "date": "2020-05-30T21:53:39.924Z",
            "rating": 7,
            "comment": "another comment",
            "__v": 0
        }]
}
```

`GET domain/opinion/:opinionId` for getting specific opinion details by opinionId:
example response:
```json
{
    "info": {
        "_id": "objectId_123456",
        "bookId": "String_123456",
        "userId": "objectId_765432",
        "date": "2020-05-29T12:36:20.175Z",
        "rating": 7,
        "comment": "a comment",
        "__v": 0
    }
}
```

`GET domain/book/:bookId/opinions` for getting specific opinions about book of a following bookId (String):
example response:
```json
{
    "info": [
        {
            "_id": "objectId_123456",
            "bookId": "String_123456",
            "userId": "objectId_654321",
            "date": "2020-05-31T14:58:16.082Z",
            "rating": 8,
            "comment": "a comment",
            "__v": 0
        },
        {
            "_id": "objectId_234567",
            "bookId": "String_123456",
            "userId": "objectId_765432",
            "date": "2020-05-30T21:53:09.527Z",
            "rating": 9,
            "comment": "another comment",
            "__v": 0
        }]
}
```

`DELETE domain/user/:userId` for deleting specific user by userId, requires authorization in form of a bearer token.
 
`DELETE domain/opinion/:opinionId` for deleting specific opinion by opinionId, requires bearer token.

## License
This project is licensed under the MIT License.
