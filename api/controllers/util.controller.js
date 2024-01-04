const _const = require('../../config/constant');
const utilServ = require('../services/util.service');

/**
 * Peticion mal definida
 *
 * @author COLCOMERCIO <miguel.caro@colcomercio.com.co>
 * @param {*} req request
 * @param {*} res response
 * @param {*} next middleware
 */
let notFound = (req, res, next) => {
  req.data = {
    status: 404,
    level: _const.level.warn,
    message: process.env.MSG_404,
  };

  log(req, res, next);
};

/**
 * Registro de eventos y respuesta
 *
 * @author COLCOMERCIO <miguel.caro@colcomercio.com.co>
 * @param {object} req peticion
 * @param {object} res respuesta
 * @param {object} next intermediario
 * @return {*} respuesta
 */
let log = (req, res, next) => {
  const status = req.data.status || 500;

  if (req.data.success) {
    return res.status(status).send({
      success: req.data.success,
      message: req.data.message,
      data: req.data.data,
    });
  } else {
    if (status === 500) {
      const subject = `${req.data.level} registered on ` +
        `${process.env.APP} (${process.env.ENVIRONMENT})`;

      utilServ.sendMail({
        to: process.env.MAIL_TO,
        subject: subject.trim().toUpperCase(),
        text: {},
      }, req);
    }

    return res.status(status).send({
      success: req.data.success || false,
      message: req.data.message || process.env.MSG_500,
    });
  }
};

module.exports = {
  log,
  notFound,
};
