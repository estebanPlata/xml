const creditBill = require('../services/credit_note.service');
const nationalBill = require('../services/national_invoice.service');
const mainHelper = require('../helpers/main.helper');
const logger = require('../helpers/logger');

/**
 * Nota debito
 *
 * @param {object} document documento
 * @param {object} data datos
 */
let xml = (document, data) => {
  let i = 0;
  let max = 0;
  let clone = null;
  const invoice = document.getElementsByTagName('fe:DebitNote')[0];
  const discrepancyResponse = invoice.getElementsByTagName('cac:DiscrepancyResponse')[0];
  const billingReference = invoice.getElementsByTagName('cac:BillingReference')[0];
  const accountingSupplierParty = invoice.getElementsByTagName('fe:AccountingSupplierParty')[0];
  const accountingCustomerParty = invoice.getElementsByTagName('fe:AccountingCustomerParty')[0];
  const partyLegalEntityCustomer = accountingCustomerParty.getElementsByTagName('fe:PartyLegalEntity')[0];
  const personCustomer = accountingCustomerParty.getElementsByTagName('fe:Person')[0];
  const taxTotal = invoice.getElementsByTagName('fe:TaxTotal')[0];
  const legalMonetaryTotal = invoice.getElementsByTagName('fe:LegalMonetaryTotal')[0];
  const debitNoteLine = invoice.getElementsByTagName('cac:DebitNoteLine')[0];

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
      clone = debitNoteLine.cloneNode(true);
      clone.getElementsByTagName('cbc:ID')[0].textContent = data.InvoiceLine[i].IDInvoiceLine || '';
      clone.getElementsByTagName('cbc:UUID')[0].textContent = data.InvoiceLine[i].UUIDInvoiceLine || '';
      clone.getElementsByTagName('cbc:Note')[0].textContent = data.InvoiceLine[i].NoteInvoiceLine || '';
      clone.getElementsByTagName('cbc:DebitedQuantity')[0].textContent = data.InvoiceLine[i].InvoicedQuantity || '';
      clone.getElementsByTagName('cbc:LineExtensionAmount')[0].textContent = data.InvoiceLine[i].ExtensionAmountLine || '';
      clone.getElementsByTagName('cbc:AccountingCostCode')[0].textContent = data.InvoiceLine[i].AccountingCostCode || '';
      clone.getElementsByTagName('cbc:Description')[0].textContent = data.InvoiceLine[i].DescriptionLine || '';
      clone.getElementsByTagName('cbc:PriceAmount')[0].textContent = data.InvoiceLine[i].PriceAmount || '';

      invoice.appendChild(clone);
    }
  }

  clone = null;
  invoice.removeChild(debitNoteLine);
};

/**
 * Coloca los valores de los nodos en la cabecera
 * @param {*} debitNote Nodo de Nota Credito
 * @param {*} data Data proveniente de la peticion
 */
function setXMLHeader(debitNote, data) {
  try {
    debitNote.getElementsByTagName('sts:QRCode')[0].textContent = data.QRCode || '';
    debitNote.getElementsByTagName('cbc:UBLVersionID')[0].textContent = data.UBLVersionID || '';
    debitNote.getElementsByTagName('cbc:CustomizationID')[0].textContent = data.CustomizationID || '';
    debitNote.getElementsByTagName('cbc:ProfileID')[0].textContent = process.env.PROFILEID_DEBIT_NOTE || '';
    debitNote.getElementsByTagName('cbc:ProfileExecutionID')[0].textContent = data.ProfileExecutionID || '';
    debitNote.getElementsByTagName('cbc:IssueDate')[0].textContent = data.IssueDate || '';
    debitNote.getElementsByTagName('cbc:IssueTime')[0].textContent = data.IssueTime || '';
    debitNote.getElementsByTagName('cbc:Note')[0].textContent = data.Note || '';
    debitNote.getElementsByTagName('cbc:DocumentCurrencyCode')[0].textContent = data.DocumentCurrencyCode || '';
    debitNote.getElementsByTagName('cbc:LineCountNumeric')[0].textContent = data.LineCountNumeric || '';
    debitNote.getElementsByTagName('cbc:ID')[0].textContent = data.ID || '';

  } catch (error) {
    logger.error(`Ocurrio un error en setXMLHeader debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Construye el XML de factura nacional, para la version 2 de la DIAN
 * @param {Object} document XML parseado
 * @param {Object} data Data proveniente del request
 */
const xmlV2 = (document, data) => {
  try {
    const debitNote = document.getElementsByTagName('DebitNote')[0];
    const company = debitNote.getElementsByTagName('cac:AccountingSupplierParty')[0];
    const orderReference = debitNote.getElementsByTagName('cac:OrderReference')[0];
    const accountingCustomerParty = debitNote.getElementsByTagName('cac:AccountingCustomerParty')[0];
    const payment = debitNote.getElementsByTagName('cac:PaymentMeans')[0];
    const allowanceC = debitNote.getElementsByTagName('cac:AllowanceCharge')[0];
    const taxTotal = debitNote.getElementsByTagName('cac:TaxTotal')[0];
    const legalMonetaryTotal = document.getElementsByTagName('cac:RequestedMonetaryTotal')[0];
    const contingency = document.getElementsByTagName('cac:AdditionalDocumentReference')[0];
    const billingReference = debitNote.getElementsByTagName('cac:BillingReference')[0];

    nationalBill.setEbillInformation(debitNote, data);
    setXMLHeader(debitNote, data);
    nationalBill.setCUFEInformation(debitNote, data);
    creditBill.setDiscrepancy(debitNote, data);

    if (data.BillingReference.UUIDBillingRef) {
      creditBill.setBillingReference(debitNote, data);
    } else {
      debitNote.removeChild(billingReference);
    }

    if (!data.orderReferenceId) {
      debitNote.removeChild(orderReference);
    } else {
      orderReference.getElementsByTagName('cbc:ID')[0].textContent = data.orderReferenceId || '';
      orderReference.getElementsByTagName('cbc:IssueDate')[0].textContent = data.IssueDateOrder || '';
    }

    if (data.InvoiceTypeCode === '03') {
      nationalBill.setContingency(contingency, data);
    } else {
      debitNote.removeChild(contingency);
    }

    nationalBill.setCompanyInfo(company, data);
    nationalBill.setClientInformation(accountingCustomerParty, data);
    nationalBill.setPaymentMeans(payment, data);

    if (data.AllowanceCharge && data.AllowanceCharge.length > 0 && !mainHelper.emptyArray(data.AllowanceCharge)) {
      nationalBill.setDiscounts(debitNote, allowanceC, data.AllowanceCharge, taxTotal, data.DocumentCurrencyCode);
    } else {
      debitNote.removeChild(allowanceC);
    }
    if (data.TaxTotal && data.TaxTotal.length > 0 && !mainHelper.emptyArray(data.TaxTotal) && !nationalBill.existSubTotal(data.TaxTotal)) {
      nationalBill.setTaxTotal(debitNote, taxTotal, data.TaxTotal, legalMonetaryTotal, data.DocumentCurrencyCode, null, document);
    } else {
      debitNote.removeChild(taxTotal);
    }

    nationalBill.setLegalMonetary(legalMonetaryTotal, data);
    nationalBill.setInvoiceLines(debitNote, data, data.DocumentType, document);

  } catch (error) {
    logger.error(`Ocurrio un error en xmlV2 debido a: ${error.message}`);
    throw error;
  }
}
module.exports = {
  xml,
  xmlV2,
  setXMLHeader
};
