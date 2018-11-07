sails-hook-exception-handling
====================

Capture all the errors that are thrown from the middlewares without adding try/catch in all of them.

## Installation
```js
$ npm install --save sails-hook-exception-handling
```

Sails v1.0 >= required, responses hook must be enabled.

## Usage

```javascript
await User.update({ email: 'foo@foo.com' }, { username: 'alreadyTakenEmail@foo.com' }) // throws {code: E_UNIQUE} error
```

```javascript
await User.findOne({ invalidAttr: 'foo@foo.com' }) // throws {name: UsageError} error
```

This hooks will manage al the Waterline errors, sending to the user the error with the pertinent status. [More info about Waterline errors.](https://sailsjs.com/documentation/concepts/models-and-orm/errors)

```javascript
  'get /not-found': (req, res) => {
    throw 'notFound'; // sends res.notFound()
  },
  'get /bad-request': (req, res) => {
    throw 'badRequest'; // sends res.badRequest()
  },
  'get /forbidden': (req, res) => {
    throw 'forbidden'; // sends res.forbidden()
  },
```

All the unnexpected errors will be handled as status 500, with res.serverError(err) default method.

## Test

```javascript
// mocha required: npm i -g mocha

npm test
```

## Author

[@josebaseba](https://github.com/Josebaseba)
