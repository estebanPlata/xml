const fs = require('fs');
const moment = require('moment');
const _package = require('../../package.json');
const path = require('path');
const needle = require('needle');
const uuidv1 = require('uuid/v1');
const winston = require('winston');

/**
 * Generate a unique id
 *
 * @author COLCOMERCIO <miguel.caro@colcomercio.com.co>
 * @return {string}
 */
let uuid = () => uuidv1();

let fnSubject = (req) => {
  const subject = req.data.level + ' registered on ' +
    process.env.APP + ' (' + process.env.ENVIRONMENT + ')';

  return subject.toUpperCase().trim();
};

/**
 * To send mail via microservice ck-sendmail
 *
 * @author COLCOMERCIO <miguel.caro@colcomercio.com.co>
 * @param {object} json {to, subject, text, html}
 * @param {object} req request
 * @return {Promise}
 */
let sendMail = (json, req) => {
  return new Promise((resolve, reject) => {
    try {
      json['to'] = process.env.MAIL_TO;
      json['subject'] = fnSubject(req);
      json.text.status = req.data.status || '';
      json.text.message = req.data.message || '';
      json.text.error = req.data.error || '';
      json.text.stack = req.data.stack || '';
      json.text.uri = req.originalUrl || req.baseUrl || '';
      json.text.protocol = req.protocol || '';
      json.text.method = req.method || '';
      json.text.host = req.hostname || '';
      json.text = JSON.stringify(json.text, null, 2);
      json.html = `<pre>${json.text}</pre>`;

      needle.post(
        `${process.env.MAIL_URI}`,
        json,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          open_timeout: 5000,
        },
        (error, response) => {
          return resolve(true);
        });
    } catch (error) {
      return resolve(true);
    }
  });
};

let pgData = () => _package;

/**
 * Record a log
 *
 * @author COLCOMERCIO <Miguel.Caro@colcomercio.com.co>
 * @param {string} level stress
 * @param {string} message logs description
 * @param {object} data log documentation
 * @return {Promise}
 */
let logRec = (level, message, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let logger = getNewLogger(level);
      data = data || {
        microservice: process.env.APP,
        esTrackTime: '',
        transactionDate: data.transactionDate,
      };

      data.microservice = data.microservice || process.env.APP;
      data['transactionDate'] = data.transactionDate;

      logger.log(level, message, data);

      return resolve({
        success: true,
      });
    } catch (error) {
      message = 'The log hasn\'t been registered. ' +
        'Please, verify elasticsearch connection.';

      reject({
        success: false,
        message,
        error,
      });
    }
  });
};

/**
 * Create a instans of elasticsearc client
 *
 * @author COLCOMERCIO <miguel.caro@colcomercio.com.co>
 * @param {string} level of log
 * @return {*}
 */
let getNewLogger = (level) => {
  const logDir = process.env.LOG_DIR || 'log';

  // let esTransportOpts = {
  //   level,
  //   client: new es.Client({
  //     host: `${process.env.ES_HOST}:${process.env.ES_PORT}`,
  //   }),
  // };

  if (process.env.DEBUG === true) {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    return new (winston.Logger)({
      transports: [
        new (winston.transports.File)({
          filename: path.join(
            logDir,
            `${process.env.APP}_${moment().format('YYYY-MM-DD')}.log`
          ),
          timestamp: () => moment().format(),
        }),
        // new Wes(esTransportOpts),
      ],
    });
  } else {
    return new (winston.Logger)({
      transports: [
        // new Wes(esTransportOpts),
      ],
    });
  }
};

module.exports = {
  logRec,
  pgData,
  sendMail,
  uuid,
};
