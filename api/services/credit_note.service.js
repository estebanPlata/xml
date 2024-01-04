/* eslint-disable require-jsdoc */
const nationalBill = require('./national_invoice.service');
const mainHelper = require('../helpers/main.helper');
const logger = require('../helpers/logger');

/**
 * Nota credito
 *
 * @param {object} document documento
 * @param {object} data datos
 */
let xml = (document, data) => {
  let i = 0;
  let max = 0;
  let clone = null;
  const invoice = document.getElementsByTagName('fe:CreditNote')[0];
  const discrepancyResponse = invoice.getElementsByTagName('cac:DiscrepancyResponse')[0];
  const billingReference = invoice.getElementsByTagName('cac:BillingReference')[0];
  const accountingSupplierParty = invoice.getElementsByTagName('fe:AccountingSupplierParty')[0];
  const accountingCustomerParty = invoice.getElementsByTagName('fe:AccountingCustomerParty')[0];
  const partyLegalEntityCustomer = accountingCustomerParty.getElementsByTagName('fe:PartyLegalEntity')[0];
  const personCustomer = accountingCustomerParty.getElementsByTagName('fe:Person')[0];
  const taxTotal = invoice.getElementsByTagName('fe:TaxTotal')[0];
  const legalMonetaryTotal = invoice.getElementsByTagName('fe:LegalMonetaryTotal')[0];
  const creditNoteLine = invoice.getElementsByTagName('cac:CreditNoteLine')[0];

  invoice.getElementsByTagName('sts:ProviderID')[0].textContent = data.ProviderID || '';
  invoice.getElementsByTagName('sts:SoftwareID')[0].textContent = data.SoftwareID || '';
  invoice.getElementsByTagName('sts:SoftwareSecurityCode')[0].textContent = data.SoftwareSecurityCode || '';
  invoice.getElementsByTagName('cbc:UBLVersionID')[0].textContent = data.UBLVersionID || '';
  invoice.getElementsByTagName('cbc:ProfileID')[0].textContent = data.ProfileID || '';
  invoice.getElementsByTagName('cbc:ID')[0].textContent = data.ID || '';
  invoice.getElementsByTagName('cbc:UUID')[0].textContent = data.UUID || '';
  invoice.getElementsByTagName('cbc:IssueDate')[0].textContent = data.IssueDate || '';
  invoice.getElementsByTagName('cbc:IssueTime')[0].textContent = data.IssueTime || '';
  invoice.getElementsByTagName('cbc:Note')[0].textContent = data.Note || '';
  invoice.getElementsByTagName('cbc:DocumentCurrencyCode')[0].textContent = data.DocumentCurrencyCode || '';

  discrepancyResponse.getElementsByTagName('cbc:ReferenceID')[0].textContent = data.DiscrepancyResponse.ReferenceID || '';
  discrepancyResponse.getElementsByTagName('cbc:ResponseCode')[0].textContent = data.DiscrepancyResponse.ResponseCode || '';

    billingReference.getElementsByTagName('cbc:ID')[0].textContent = data.BillingReference.IDBillingRef || '';
    billingReference.getElementsByTagName('cbc:UUID')[0].textContent = data.BillingReference.UUIDBillingRef || '';

  accountingSupplierParty.getElementsByTagName('cbc:AdditionalAccountID')[0].textContent = data.msgEmpresa.AccountIdEmpresa || '';
  accountingSupplierParty.getElementsByTagName('cbc:ID')[0].attributes.getNamedItem('schemeID').textContent = data.msgEmpresa.schemeIdEmpresa || '';
  accountingSupplierParty.getElementsByTagName('cbc:ID')[0].textContent = data.msgEmpresa.IdEmpresa || '';
  accountingSupplierParty.getElementsByTagName('cbc:Name')[0].textContent = data.msgEmpresa.NameEmpresa || '';
  accountingSupplierParty.getElementsByTagName('cbc:Department')[0].textContent = data.msgEmpresa.DepartmentEmpresa || '';
  accountingSupplierParty.getElementsByTagName('cbc:CitySubdivisionName')[0].textContent = data.msgEmpresa.CitySubdivisionNameEmp || '';
  accountingSupplierParty.getElementsByTagName('cbc:CityName')[0].textContent = data.msgEmpresa.CityNameEmpresa || '';
  accountingSupplierParty.getElementsByTagName('cbc:Line')[0].textContent = data.msgEmpresa.LineEmpresa || '';
  accountingSupplierParty.getElementsByTagName('cbc:IdentificationCode')[0].textContent = data.msgEmpresa.IdentificationCodeEmpresa || '';
  accountingSupplierParty.getElementsByTagName('cbc:TaxLevelCode')[0].textContent = data.msgEmpresa.TaxLevelCodeEmpresa || '';
  accountingSupplierParty.getElementsByTagName('cbc:RegistrationName')[0].textContent = data.msgEmpresa.RegistrationNameEmpresa || '';

  accountingCustomerParty.getElementsByTagName('cbc:AdditionalAccountID')[0].textContent = data.msgCliente.AccountIdCliente || '';
  accountingCustomerParty.getElementsByTagName('cbc:ID')[0].attributes.getNamedItem('schemeID').textContent = data.msgCliente.schemeIdCliente || '';
  accountingCustomerParty.getElementsByTagName('cbc:ID')[0].textContent = data.msgCliente.IdCliente || '';
  accountingCustomerParty.getElementsByTagName('cbc:Name')[0].textContent = data.msgCliente.NameCliente || '';
  accountingCustomerParty.getElementsByTagName('cbc:Department')[0].textContent = data.msgCliente.DepartmentCliente || '';
  accountingCustomerParty.getElementsByTagName('cbc:CitySubdivisionName')[0].textContent = data.msgCliente.CitySubdivisionNameCli || '';
  accountingCustomerParty.getElementsByTagName('cbc:CityName')[0].textContent = data.msgCliente.CityNameCliente || '';
  accountingCustomerParty.getElementsByTagName('cbc:Line')[0].textContent = data.msgCliente.LineCliente || '';
  accountingCustomerParty.getElementsByTagName('cbc:IdentificationCode')[0].textContent = data.msgCliente.IdentificationCodeCliente || '';
  accountingCustomerParty.getElementsByTagName('cbc:TaxLevelCode')[0].textContent = data.msgCliente.TaxLevelCodeCliente || '';

  if (data.msgCliente.AccountIdCliente === '1') {
    partyLegalEntityCustomer.getElementsByTagName('cbc:RegistrationName')[0].textContent = data.msgCliente.RegistrationNameCliente || '';
    accountingCustomerParty.removeChild(personCustomer);
  } else if (data.msgCliente.AccountIdCliente === '2') {
    personCustomer.getElementsByTagName('cbc:FirstName')[0].textContent = data.msgCliente.RegistrationNameCliente || '';
    personCustomer.getElementsByTagName('cbc:FamilyName')[0].textContent = data.msgCliente.RegistrationNameCliente || '';
    personCustomer.getElementsByTagName('cbc:MiddleName')[0].textContent = data.msgCliente.RegistrationNameCliente || '';
    accountingCustomerParty.removeChild(partyLegalEntityCustomer);
  }

  i = 0;
  max = data.TaxTotal.length;

  for (; i < max; i++) {
    if (data.TaxTotal[i]) {
      clone = taxTotal.cloneNode(true);
      clone.getElementsByTagName('cbc:TaxAmount')[0].textContent = data.TaxTotal[i].TaxAmount || '';
      clone.getElementsByTagName('cbc:TaxEvidenceIndicator')[0].textContent = data.TaxTotal[i].TaxEvidenceIndicator || '';
      clone.getElementsByTagName('cbc:TaxableAmount')[0].textContent = data.TaxTotal[i].TaxableAmount || '';
      clone.getElementsByTagName('cbc:TaxAmount')[1].textContent = data.TaxTotal[i].TaxAmount || '';
      clone.getElementsByTagName('cbc:Percent')[0].textContent = data.TaxTotal[i].Percent || '';
      clone.getElementsByTagName('cbc:ID')[0].textContent = data.TaxTotal[i].IdTax || '';

      invoice.insertBefore(clone, legalMonetaryTotal);
    }
  }

  clone = null;
  invoice.removeChild(taxTotal);

  legalMonetaryTotal.getElementsByTagName('cbc:LineExtensionAmount')[0].textContent = data.LineExtensionAmount || '';
  legalMonetaryTotal.getElementsByTagName('cbc:TaxExclusiveAmount')[0].textContent = data.TaxExclusiveAmount || '';
  legalMonetaryTotal.getElementsByTagName('cbc:AllowanceTotalAmount')[0].textContent = data.AllowanceTotalAmount || '';
  legalMonetaryTotal.getElementsByTagName('cbc:ChargeTotalAmount')[0].textContent = data.ChargeTotalAmount || '';
  legalMonetaryTotal.getElementsByTagName('cbc:PayableAmount')[0].textContent = data.PayableAmount || '';

  i = 0;
  max = data.InvoiceLine.length;

  for (; i < max; i++) {
    if (data.InvoiceLine[i]) {
      clone = creditNoteLine.cloneNode(true);
      clone.getElementsByTagName('cbc:ID')[0].textContent = data.InvoiceLine[i].IDInvoiceLine || '';
      clone.getElementsByTagName('cbc:UUID')[0].textContent = data.InvoiceLine[i].UUIDInvoiceLine || '';
      clone.getElementsByTagName('cbc:CreditedQuantity')[0].textContent = data.InvoiceLine[i].InvoicedQuantity || '';
      clone.getElementsByTagName('cbc:LineExtensionAmount')[0].textContent = data.InvoiceLine[i].ExtensionAmountLine || '';
      clone.getElementsByTagName('cbc:AccountingCostCode')[0].textContent = data.InvoiceLine[i].AccountingCostCode || '';
      clone.getElementsByTagName('cbc:Description')[0].textContent = data.InvoiceLine[i].DescriptionLine || '';
      clone.getElementsByTagName('cbc:PriceAmount')[0].textContent = data.InvoiceLine[i].PriceAmount || '';

      invoice.appendChild(clone);
    }
  }

  clone = null;
  invoice.removeChild(creditNoteLine);
};

/**
 * Coloca los valores de los nodos en la cabecera
 * @param {*} creditNote Nodo de Nota Credito
 * @param {*} data Data proveniente de la peticion
 */
function setXMLHeader(creditNote, data) {
  try {
    creditNote.getElementsByTagName('sts:QRCode')[0].textContent = data.QRCode || '';
    creditNote.getElementsByTagName('cbc:UBLVersionID')[0].textContent = data.UBLVersionID || '';
    creditNote.getElementsByTagName('cbc:CustomizationID')[0].textContent = data.CustomizationID || '';
    creditNote.getElementsByTagName('cbc:ProfileID')[0].textContent = process.env.PROFILEID_CREDIT_NOTE || '';
    creditNote.getElementsByTagName('cbc:ProfileExecutionID')[0].textContent = data.ProfileExecutionID || '';
    creditNote.getElementsByTagName('cbc:IssueDate')[0].textContent = data.IssueDate || '';
    creditNote.getElementsByTagName('cbc:IssueTime')[0].textContent = data.IssueTime || '';
    creditNote.getElementsByTagName('cbc:CreditNoteTypeCode')[0].textContent = data.InvoiceTypeCode || '';
    creditNote.getElementsByTagName('cbc:Note')[0].textContent = data.Note || '';
    creditNote.getElementsByTagName('cbc:DocumentCurrencyCode')[0].textContent = data.DocumentCurrencyCode || '';
    creditNote.getElementsByTagName('cbc:LineCountNumeric')[0].textContent = data.LineCountNumeric || '';
    creditNote.getElementsByTagName('cbc:ID')[0].textContent = data.ID || '';

  } catch (error) {
    logger.error(`Ocurrio un error en setXMLHeader debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Funcion que coloca la infomacion en el nodo cac:DiscrepancyResponse
 * @param {*} creditNote Credit Note nodo
 * @param {*} data Data del request
 */
function setDiscrepancy(creditNote, data) {
  try {
    const discrepancy = creditNote.getElementsByTagName('cac:DiscrepancyResponse')[0];
    discrepancy.getElementsByTagName('cbc:ReferenceID')[0].textContent = data.DiscrepancyResponse.ReferenceID || '';
    discrepancy.getElementsByTagName('cbc:ResponseCode')[0].textContent = data.DiscrepancyResponse.ResponseCode || '';
    discrepancy.getElementsByTagName('cbc:Description')[0].textContent = data.DiscrepancyResponse.Description || '';
  } catch (error) {
    logger.error(`Ocurrio un error en setDiscrepancy debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Coloca el verdado valor de CUFE o CUDE
 * @param {*} type
 * @param {*} data
 */
function setRigthParams(type, data) {
  try {
    let schemeName;
    if (type == 1) {
      schemeName = data.CUFEAlgorithm;
    } else if (type == 3) {
      schemeName = data.CUDEAlgorithm;
    } else if (type == 4) {
      schemeName = data.CUDEAlgorithm;
    }
    return schemeName;
  } catch (error) {
    logger.error(`Ocurrio un error en setRigthParams debido a: ${error.message}`);
    throw error;
  }
}

function setBillingReference(creditNote, data) {
  try {
    const schemeName = setRigthParams(data.BillingReference.SchemeName, data);
    const invoiceDocumemnt = creditNote.getElementsByTagName('cac:InvoiceDocumentReference')[0];

    invoiceDocumemnt.getElementsByTagName('cbc:ID')[0].textContent = data.BillingReference.IDBillingRef || '';

    invoiceDocumemnt.getElementsByTagName('cbc:UUID')[0].textContent = data.BillingReference.UUIDBillingRef || '';
    invoiceDocumemnt.getElementsByTagName('cbc:UUID')[0].setAttribute('schemeName', schemeName);

    invoiceDocumemnt.getElementsByTagName('cbc:IssueDate')[0].textContent = data.BillingReference.IssueDate || '';
  } catch (error) {
    logger.error(`Ocurrio un error en setBillingReference debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Funcion que genera el XML V2 de la DIAN (Nota Credito)
 * @param {*} document XML
 * @param {*} data Data del request
 */
const xmlV2 = (document, data) => {
  try {
    const creditNote = document.getElementsByTagName('CreditNote')[0];
    const company = creditNote.getElementsByTagName('cac:AccountingSupplierParty')[0];
    const orderReference = creditNote.getElementsByTagName('cac:OrderReference')[0];
    const accountingCustomerParty = creditNote.getElementsByTagName('cac:AccountingCustomerParty')[0];
    const payment = creditNote.getElementsByTagName('cac:PaymentMeans')[0];
    const allowanceC = creditNote.getElementsByTagName('cac:AllowanceCharge')[0];
    const taxTotal = creditNote.getElementsByTagName('cac:TaxTotal')[0];
    const legalMonetaryTotal = document.getElementsByTagName('cac:LegalMonetaryTotal')[0];
    const contingency = document.getElementsByTagName('cac:AdditionalDocumentReference')[0];
    const billingReference = creditNote.getElementsByTagName('cac:BillingReference')[0];

    nationalBill.setEbillInformation(creditNote, data);
    nationalBill.setCUFEInformation(creditNote, data);
    setXMLHeader(creditNote, data);
    setDiscrepancy(creditNote, data);

    if (data.BillingReference.UUIDBillingRef) {
      setBillingReference(creditNote, data);
    } else {
      creditNote.removeChild(billingReference);
    }

    if (!data.orderReferenceId) {
      creditNote.removeChild(orderReference);
    } else {
      orderReference.getElementsByTagName('cbc:ID')[0].textContent = data.orderReferenceId || '';
      orderReference.getElementsByTagName('cbc:IssueDate')[0].textContent = data.IssueDateOrder || '';
    }
    nationalBill.setCompanyInfo(company, data);
    nationalBill.setClientInformation(accountingCustomerParty, data);
    nationalBill.setPaymentMeans(payment, data);

    if (data.AllowanceCharge && data.AllowanceCharge.length > 0 && !mainHelper.emptyArray(data.AllowanceCharge)) {
      nationalBill.setDiscounts(creditNote, allowanceC, data.AllowanceCharge, taxTotal, data.DocumentCurrencyCode);
    } else {
      creditNote.removeChild(allowanceC);
    }
    if (data.TaxTotal && data.TaxTotal.length > 0 && !mainHelper.emptyArray(data.TaxTotal) && !nationalBill.existSubTotal(data.TaxTotal)) {
      nationalBill.setTaxTotal(creditNote, taxTotal, data.TaxTotal, legalMonetaryTotal, data.DocumentCurrencyCode, null, document);
    } else {
      creditNote.removeChild(taxTotal);
    }

    if (data.InvoiceTypeCode === '03') {
      nationalBill.setContingency(contingency, data);
    } else {
      creditNote.removeChild(contingency);
    }

    nationalBill.setLegalMonetary(legalMonetaryTotal, data);
    nationalBill.setInvoiceLines(creditNote, data, data.DocumentType, document);

  } catch (error) {
    logger.error(`Ocurrio un error en xmlV2 debido a: ${error.message}`);
    throw error;
  }
}

module.exports = {
  xml,
  xmlV2,
  setXMLHeader,
  setDiscrepancy,
  setBillingReference,
  setRigthParams,
};
