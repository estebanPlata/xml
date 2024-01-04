const bodyParser = require('body-parser');

/**
 * Export api's modules from express framework
 *
 * @author COLCOMERCIO <Miguel.Caro@colcomercio.com.co>
 * @param {object} app
 */
module.exports = (app) => {
  app.use(bodyParser.urlencoded({
    limit: `${process.env.SIZE_JSON}`,
    parameterLimit: 1000000,
    extended: false,
  }));

  app.use(bodyParser.json({
    limit: `${process.env.SIZE_JSON}`,
  }));
};
