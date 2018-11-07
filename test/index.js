var Sails = require('sails').Sails;

describe('Testing error-handle hook ::', function () {

  // Before running any tests, attempt to lift Sails
  before(function (done) {

    // Hook will timeout in 10 seconds
    this.timeout(11000);

    Sails().lift({
      hooks: {
        // Load the hook
        'exception-handling': require('../'),
        // Skip grunt (unless your hook uses it)
        'grunt': false
      },
      log: { level: 'silent', noShip: true },
      routes: {
        'get /not-found': (req, res) => {
          throw 'notFound';
        },
        'get /bad-request': (req, res) => {
          throw 'badRequest';
        },
        'get /forbidden': (req, res) => {
          throw 'forbidden';
        },
        'get /e-unique': (req, res) => {
          throw { code: 'E_UNIQUE' };
        },
        'get /usage-error': (req, res) => {
          throw { name: 'UsageError' };
        },
        'get /500': (req, res) => {
          throw { code: 'UNEXPECTED_ERROR' };
        },
        'get /random-500': (req, res) => {
          return x + y;
        },
        'get /default-500': (req, res) => {
          return res.serverError('Default 500 error');
        }
      }
    }, function (err, _sails) {
      if (err) return done(err);
      sails = _sails;
      return done();
    });

  });

  // After tests are complete, lower Sails
  after(function (done) {
    // Lower Sails (if it successfully lifted)
    if (sails) { return sails.lower(done); }
    // Otherwise just return
    return done();
  });

  // Test that Sails can lift with the hook in place
  it('sails does not crash', function () {
    return true;
  });

  it('throw error 400 badRequest', function (done) {
    sails.request('/bad-request', (err) => {
      if (err.status === 400) { return done(); }
      return done(err);
    });
  });

  it('throw error 403 forbidden', function (done) {
    sails.request('/forbidden', (err) => {
      if (err.status === 403) { return done(); }
      return done(err);
    });
  });

  it('throw error 404 notFound', function (done) {
    sails.request('/not-found', (err) => {
      if (err.status === 404) { return done(); }
      return done(err);
    });
  });

  it('throw error 409 E_UNIQUE', function (done) {
    sails.request('/e-unique', (err) => {
      if (err.status === 409) { return done(); }
      return done(err);
    });
  });

  it('throw error 400 UsageError', function (done) {
    sails.request('/usage-error', (err) => {
      if (err.status === 400) { return done(); }
      return done(err);
    });
  });

  it('throw error 500 UNEXPECTED_ERROR', function (done) {
    sails.request('/500', (err) => {
      if (err.status === 500) { return done(); }
      return done(err);
    });
  });

  it('500 random error', function (done) {
    sails.request('/random-500', (err) => {
      if (err.status === 500) { return done(); }
      return done(err);
    });
  });

  it('default 500 error', function (done) {
    sails.request('/default-500', (err) => {
      if (err.status === 500 && err.body === 'Default 500 error') { return done(); }
      return done(err);
    });
  });

});