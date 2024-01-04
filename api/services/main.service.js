const fs = require('fs');
const path = require('path');
const xmldom = require('xmldom');
const DOMParser = xmldom.DOMParser;
const XMLSerializer = xmldom.XMLSerializer;
const errorHelp = require('../helpers/error.helper');
const creditNoteServ = require('./credit_note.service');
const debitNoteServ = require('./debit_note.service');
const mandateInvoiceServ = require('./mandate_invoice.service');
const nationalInvoiceServ = require('./national_invoice.service');
const logger = require('../helpers/logger');

/**
 * Construir xml en base 64
 *
 * @param {object} invoice peticion
 * @return {string} xml
 */
let buildXML = (invoice) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await readFile(getFile(invoice.DocumentType));
      let document = xmlParse(data);
      insertDataIntoDocument(document, invoice);
      let xmlBase64 = xmlSerialize(document);

      return resolve(xmlBase64);
    } catch (error) {
      logger.error(`Ocurrio un error en buildXML debido a: ${error.message}`);
      reject(error);
    }
  });
};

let xmlSerialize = (document) => {
  let xmlserializer = new XMLSerializer();
  const pattern = /(\r\n|\n|\r|\t)/g;
  let xml = xmlserializer.serializeToString(document).replace(pattern, '');

  return Buffer.from(xml.trim()).toString('base64');
};

let xmlParse = (data) => {
  let domparser = new DOMParser();

  return domparser.parseFromString(data, 'text/xml');
};

let readFile = (file) => {
  return fs.readFileSync(file, {encoding: 'utf-8'});
};

let getFile = (documentType) => {
  let file = path.join(__dirname, '../../assets');
  let documentTypes = {};

  documentTypes[process.env.DOCTYPE_01] = `/${process.env.FILE_01}`;
  documentTypes[process.env.DOCTYPE_02] = `/${process.env.FILE_01}`;
  documentTypes[process.env.DOCTYPE_03] = `/${process.env.FILE_03}`;
  documentTypes[process.env.DOCTYPE_04] = `/${process.env.FILE_04}`;

  if (documentTypes[documentType]) {
    file += documentTypes[documentType];
  } else {
    logger.error('El tipo de documento solicitado no existe.');
    throw new errorHelp.BadRequest(
      'El tipo de documento solicitado no existe.'
    );
  }

  return file;
};

let insertDataIntoDocument = (document, invoice) => {
  let documentService = {};

  documentService[process.env.DOCTYPE_01] = nationalInvoiceServ;
  documentService[process.env.DOCTYPE_02] = nationalInvoiceServ;
  documentService[process.env.DOCTYPE_03] = creditNoteServ;
  documentService[process.env.DOCTYPE_04] = debitNoteServ;

  documentService[invoice.DocumentType].xmlV2(document, invoice);
};

module.exports = {
  buildXML, // Construir xml en base 64
};
