module.exports = function (sails) {

  const responses = ['notFound', 'badRequest', 'forbidden'];

  const __exceptionHandling = (err, req, res) => {

    if (responses.indexOf(err) > -1) { return res[err](); }

    if (err.code === 'E_UNIQUE') { return res.status(409).json(err); }

    if (err.name === 'UsageError') { return res.status(400).send(err); }

    return res.serverError(err);
  };

  return {

    __configKey__: {
      name: 'error-handling'
    },

    initialize: (cb) => {

      sails.once('lifted', function () {

        sails.removeAllListeners('router:request:500');

        sails.on('router:request:500', __exceptionHandling);

      });

      return cb();

    }

  };

};