const errorHelp = require('./error.helper');
const Prometheus = require('prom-client');

const counterSucess = new Prometheus.Counter({
  name: `${process.env.ENVIRONMENT}_nodejs_http_sucess_request_total`,
  help: 'Contador de los HTTP request exitosos '
});

const counterError = new Prometheus.Counter({
  name: `${process.env.ENVIRONMENT}_nodejs_http_error_request_total`,
  help: 'Contador de los HTTP request erroneos'
});

/**
 * Valida peticion entrante
 *
 * @param {*} request peticion
 * @return {object} peticion valida
 */
let validateRequest = (request) => {
  if (
    !request.DocumentType ||
    typeof request.DocumentType !== 'string' ||
    request.DocumentType.trim() === ''
  ) {
    throw new errorHelp.BadRequest(
      'Verifique el valor del campo tipo de documento (DocumentType).'
    );
  } else {
    return request;
  }
};

let emptyArray = (array) => {
  let result;
  if (array.length === 1 && Object.keys(array[0]).length === 0) {
    result = true;
  } else {
    result = false;
  }
  return result;
}

module.exports = {
  validateRequest,
  counterError,
  counterSucess,
  emptyArray,
};
