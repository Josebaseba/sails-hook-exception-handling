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
await User.update({ email: 'foo@foo.com' }, { email: 'alreadyTakenEmail@foo.com' }) // throws {code: E_UNIQUE} error
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

Check [.tolerate()](https://sailsjs.com/documentation/reference/waterline-orm/queries/tolerate) and [.intercept()](https://sailsjs.com/documentation/reference/waterline-orm/queries/intercept) for advanced use.

```javascript
// Customize errors
await User.update({ email: 'foo@foo.com' }, { username: 'alreadyTakenEmail@foo.com' }).intercept('E_UNIQUE', (err) => {
  err.text = 'Email already taken';
  return err;
});

// Don't throw the error
let user = await User.create({ email: 'foo@foo.com', name: 'Joe' }).tolerate('E_UNIQUE').fetch();

if (!user) { 
  user = (await User.update({ email: 'foo@foo.com'}, { name: 'Joe' }).fetch())[0];
}

```

## Test

```javascript
// mocha required: npm i -g mocha

npm test
```

## Author

[@josebaseba](https://github.com/Josebaseba)
