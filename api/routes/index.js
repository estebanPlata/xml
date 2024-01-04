const mainCtrl = require('../controllers/main.controller');
const utilCtrl = require('../controllers/util.controller');
const Prometheus = require('prom-client');

const path = require('path');
// const favicon = require('serve-favicon');

module.exports = (app, express) => {
  let main = express.Router();
  const coverageDir = path.join(__dirname, '../../coverage');

  main.route('/').post(mainCtrl.transform, utilCtrl.log);
  app.use(`${process.env.ROUTE}/main`, main);

  app.get('/metrics', (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end(Prometheus.register.metrics());
  });

  app.use(`${process.env.ROUTE}/`, main);
  app.use('/coverage', express.static(coverageDir));
  // app.use(favicon(path.join(coverageDir, 'favicon.ico')));
};
