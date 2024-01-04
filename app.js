const utilsCtrl = require('./api/controllers/util.controller');
const mainHelper = require('./api/helpers/main.helper');
const Prometheus = require('prom-client');
const cron = require('node-cron');

let SwaggerUi = require('swagger-tools/middleware/swagger-ui');
let SwaggerExpress = require('swagger-express-mw');
let express = require('express');
let app = express();
let http = require('http');

require('./config/express')(app);
require('./api/routes')(app, express);

cron.schedule('59 59 23 * * *', () => {
  if (process.env.METRICS === 'Y') {
    mainHelper.counterSucess.reset();
    mainHelper.counterError.reset();
  }
});

module.exports = app; // for testing

let config = {
  appRoot: __dirname, // required config
};

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) {
    throw err;
  }

  swaggerExpress.runner.swagger.basePath = process.env.ROUTE;

  app.use(SwaggerUi(swaggerExpress.runner.swagger, {
    apiDocs: '/api-docs',
    swaggerUi: process.env.DOCS,
  }));

  // install middleware
  swaggerExpress.register(app);

  app.route('/*').all(utilsCtrl.notFound);

  const port = process.env.PORT || 80;
  const host = process.env.HOSTT || 'localhost';

  app.listen(port, () => {
    console.log(`Api is running on http://${host}:${port}`);
  });

  http.globalAgent.maxSockets = 50;

  const collectDefaultMetrics = Prometheus.collectDefaultMetrics;
  // Probe every 5th second.
  collectDefaultMetrics({
    timeout: 1000,
  });

});
