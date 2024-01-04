const _const = require('../../config/constant');
const mainHelp = require('../helpers/main.helper');
const mainServ = require('../services/main.service');
const logger = require('../helpers/logger');

/**
 * Agrega datos a una plantilla xml dependiendo del tipo de factura
 *
 * 1. Validar la peticion
 * 2. Construir xml en base 64
 *
 * @author COLCOMERCIO <miguel.caro@colcomercio.com.co> [cambiar]
 * @param {object} req request
 * @param {object} res response
 * @param {object} next middleware
 * @return {*}
 */
let transform = async (req, res, next) => {
  try {
    // 1. Validar la peticion
    const request = mainHelp.validateRequest(req.body);
    console.log(request)
    // 2. Construir xml en base 64
    const xml = await mainServ.buildXML(request);

    logger.info(`Petición ${req.method} : ${process.env.ROUTE}${req.url} 200`);
    
    req.data = {
      status: 200,
      success: true,
      level: _const.level.info,
      message: process.env.MSG_200,
      data: {
        xml,
      },
    };

    if (process.env.METRICS === 'Y') mainHelp.counterSucess.inc();

    return next();
  } catch (error) {

    if (process.env.METRICS === 'Y') mainHelp.counterError.inc();

    logger.info(`Petición ${req.method} : ${process.env.ROUTE}${req.url} ${error.status || 500}`);

    req.data = {
      status: error.status || 500,
      success: error.success || false,
      level: error.level || _const.level.error,
      message: error.message || process.env.MSG_500,
    };

    return next();
  }
};

module.exports = {
  transform,
};
