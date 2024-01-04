/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
const mainHelper = require('../helpers/main.helper');
const logger = require('../helpers/logger');
/**
 * Factura Nacional
 *
 * @param {object} document documento
 * @param {object} data datos
 */
let xml = (document, data) => {
  let i = 0;
  let max = 0;
  let clone = null;
  const invoice = document.getElementsByTagName('fe:Invoice')[0];
  const accountingSupplierParty = invoice.getElementsByTagName('fe:AccountingSupplierParty')[0];
  const accountingCustomerParty = invoice.getElementsByTagName('fe:AccountingCustomerParty')[0];
  const partyLegalEntityCustomer = accountingCustomerParty.getElementsByTagName('fe:PartyLegalEntity')[0];
  const personCustomer = accountingCustomerParty.getElementsByTagName('fe:Person')[0];
  const taxTotal = document.getElementsByTagName('fe:TaxTotal')[0];
  const legalMonetaryTotal = document.getElementsByTagName('fe:LegalMonetaryTotal')[0];
  const invoiceLine = document.getElementsByTagName('fe:InvoiceLine')[0];

  invoice.getElementsByTagName('sts:InvoiceAuthorization')[0].textContent = data.InvoiceAuthorization || '';
  invoice.getElementsByTagName('cbc:StartDate')[0].textContent = data.StartDate || '';
  invoice.getElementsByTagName('cbc:EndDate')[0].textContent = data.EndDate || '';
  invoice.getElementsByTagName('sts:Prefix')[0].textContent = data.Prefix || '';
  invoice.getElementsByTagName('sts:From')[0].textContent = data.From || '';
  invoice.getElementsByTagName('sts:To')[0].textContent = data.To || '';
  invoice.getElementsByTagName('sts:ProviderID')[0].textContent = data.ProviderID || '';
  invoice.getElementsByTagName('sts:SoftwareID')[0].textContent = data.SoftwareID || '';
  invoice.getElementsByTagName('sts:SoftwareSecurityCode')[0].textContent = data.SoftwareSecurityCode || '';
  invoice.getElementsByTagName('cbc:UBLVersionID')[0].textContent = data.UBLVersionID || '';
  invoice.getElementsByTagName('cbc:ProfileID')[0].textContent = data.ProfileID || '';
  invoice.getElementsByTagName('cbc:ID')[0].textContent = data.ID || '';
  invoice.getElementsByTagName('cbc:UUID')[0].textContent = data.UUID || '';
  invoice.getElementsByTagName('cbc:IssueDate')[0].textContent = data.IssueDate || '';
  invoice.getElementsByTagName('cbc:IssueTime')[0].textContent = data.IssueTime || '';
  invoice.getElementsByTagName('cbc:InvoiceTypeCode')[0].textContent = data.InvoiceTypeCode || '';
  invoice.getElementsByTagName('cbc:Note')[0].textContent = data.Note || '';
  invoice.getElementsByTagName('cbc:DocumentCurrencyCode')[0].textContent = data.DocumentCurrencyCode || '';
  invoice.getElementsByTagName('cbc:CustomerAssignedAccountID')[0].textContent = data.CustomerAssignedAccountID || '';

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
      clone = invoiceLine.cloneNode(true);
      clone.getElementsByTagName('cbc:InvoicedQuantity')[0].textContent = data.InvoiceLine[i].InvoicedQuantity || '';
      clone.getElementsByTagName('cbc:LineExtensionAmount')[0].textContent = data.InvoiceLine[i].ExtensionAmountLine || '';
      clone.getElementsByTagName('cbc:Description')[0].textContent = data.InvoiceLine[i].DescriptionLine || '';
      clone.getElementsByTagName('cbc:PriceAmount')[0].textContent = data.InvoiceLine[i].PriceAmount || '';

      invoice.appendChild(clone);
    }
  }

  clone = null;
  invoice.removeChild(invoiceLine);
};

/**
 * Se coloca la informacion del Provedor tecnologico
 * @param {Object} invoice Objecto con el nodo principal de la factura
 * @param {Object} data Data proveniente de PS
 */
function setEbillInformation(invoice, data) {
  try {
    invoice.getElementsByTagName('sts:ProviderID')[0].setAttribute('schemeID', data.EbillCheckDigit);
    invoice.getElementsByTagName('sts:ProviderID')[0].setAttribute('schemeName', data.EbillDocumentType);
    invoice.getElementsByTagName('sts:ProviderID')[0].textContent = data.ProviderID || '';
    invoice.getElementsByTagName('sts:SoftwareID')[0].textContent = data.SoftwareID || '';
    invoice.getElementsByTagName('sts:SoftwareSecurityCode')[0].textContent = data.SoftwareSecurityCode || '';

  } catch (error) {
    logger.error(`Ocurrio un error en setEbillInformation debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Coloca el verdado valor de CUFE o CUDE
 *
 * Asignacion de algoritmo
 * @param {*} type
 * @param {*} data
 */
function setRigthParams(type, data) {
  try {
    let schemeName;
    if (type == 1) {
      schemeName = data.InvoiceTypeCode === '03' ? data.CUDEAlgorithm : data.CUFEAlgorithm;
    } else if (type == 2) {
      //schemeName = data.CUFEAlgorithm;
      schemeName = data.InvoiceTypeCode === '03' ? data.CUDEAlgorithm : data.CUFEAlgorithm;
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

/**
 * Se coloca la informacion del CUFE generado
 * @param {Object} invoice Objecto con el nodo principal de la factura
 * @param {Object} data Data proveniente de PS
 */
function setCUFEInformation(invoice, data) {
  try {
    const schemeName = setRigthParams(data.DocumentType, data);

    invoice.getElementsByTagName('cbc:UUID')[0].textContent = data.UUID || '';
    invoice.getElementsByTagName('cbc:UUID')[0].setAttribute("schemeID", data.ProfileExecutionID);
    invoice.getElementsByTagName('cbc:UUID')[0].setAttribute("schemeName", schemeName);

  } catch (error) {
    logger.error(`Ocurrio un error en setCUFEInformation debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Coloca la informacion de los clientes
 * @param {Object} accountingCustomerParty Nodo cac:AccountingCustomerParty
 * @param {Object} data Data proveniente de PS
 */
function setClientInformation(accountingCustomerParty, data) {
  try {
    accountingCustomerParty.getElementsByTagName('cbc:AdditionalAccountID')[0].textContent = data.msgCliente.AccountIdCliente || '';
    const party = accountingCustomerParty.getElementsByTagName('cac:Party')[0];

    party.getElementsByTagName('cac:PartyIdentification')[0].getElementsByTagName('cbc:ID')[0].textContent = data.msgCliente.IdCliente;

    if (data.msgCliente.AccountIdCliente == '2') {
      if (data.msgCliente.CompanySchemeName) {
        party.getElementsByTagName('cac:PartyIdentification')[0].getElementsByTagName('cbc:ID')[0].setAttribute('schemeName', data.msgCliente.CompanySchemeName);
      } else {
        party.getElementsByTagName('cac:PartyIdentification')[0].getElementsByTagName('cbc:ID')[0].removeAttribute('schemeName');
      }

      if (data.msgCliente.CompanySchemeID) {
        party.getElementsByTagName('cac:PartyIdentification')[0].getElementsByTagName('cbc:ID')[0].setAttribute('schemeID', data.msgCliente.CompanySchemeID);
      } else {
        party.getElementsByTagName('cac:PartyIdentification')[0].getElementsByTagName('cbc:ID')[0].removeAttribute('schemeID');
      }
    }

    party.getElementsByTagName('cac:PartyName')[0].getElementsByTagName('cbc:Name')[0].textContent = data.msgCliente.NameCliente || '';
    const address = party.getElementsByTagName('cac:Address')[0];
    address.getElementsByTagName('cbc:ID')[0].textContent = data.msgCliente.ID || '';
    address.getElementsByTagName('cbc:CityName')[0].textContent = data.msgCliente.CityNameCliente || '';
    address.getElementsByTagName('cbc:PostalZone')[0].textContent = data.msgCliente.PostalZone || '';
    address.getElementsByTagName('cbc:CountrySubentity')[0].textContent = data.msgCliente.CountrySubentity || '';
    address.getElementsByTagName('cbc:CountrySubentityCode')[0].textContent = data.msgCliente.CountrySubentityCode || '';
    address.getElementsByTagName('cbc:Line')[0].textContent = data.msgCliente.LineCliente || '';
    address.getElementsByTagName('cbc:IdentificationCode')[0].textContent = data.msgCliente.IdentificationCode || '';
    address.getElementsByTagName('cbc:Name')[0].textContent = data.msgCliente.Name || '';
    address.getElementsByTagName('cbc:Name')[0].setAttribute('languageID', data.languageID);

    if (data.msgCliente.CompanySchemeID) {
      party.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeID', data.msgCliente.CompanySchemeID);
    } else {
      party.getElementsByTagName('cbc:CompanyID')[0].removeAttribute('schemeID');
    }
    party.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeName', data.msgCliente.CompanySchemeName);
    party.getElementsByTagName('cbc:CompanyID')[0].textContent = data.msgCliente.IdCliente || '';
    party.getElementsByTagName('cbc:RegistrationName')[0].textContent = data.msgCliente.NameCliente || '';
    party.getElementsByTagName('cbc:TaxLevelCode')[0].textContent = data.msgCliente.TaxLevelCode || '';
    party.getElementsByTagName('cbc:TaxLevelCode')[0].setAttribute('listName', data.msgCliente.RegimenClient);

    const registrationAddress = party.getElementsByTagName('cac:RegistrationAddress')[0];

    registrationAddress.getElementsByTagName('cbc:ID')[0].textContent = data.msgCliente.ID || ' ';
    registrationAddress.getElementsByTagName('cbc:CityName')[0].textContent = data.msgCliente.CityNameCliente || '';
    registrationAddress.getElementsByTagName('cbc:PostalZone')[0].textContent = data.msgCliente.PostalZone || '';
    registrationAddress.getElementsByTagName('cbc:CountrySubentity')[0].textContent = data.msgCliente.CountrySubentity || '';
    registrationAddress.getElementsByTagName('cbc:CountrySubentityCode')[0].textContent = data.msgCliente.CountrySubentityCode || '';
    registrationAddress.getElementsByTagName('cbc:Line')[0].textContent = data.msgCliente.LineCliente || '';
    registrationAddress.getElementsByTagName('cbc:IdentificationCode')[0].textContent = data.msgCliente.IdentificationCode || '';
    registrationAddress.getElementsByTagName('cbc:Name')[0].textContent = data.msgCliente.Name || '';
    registrationAddress.getElementsByTagName('cbc:Name')[0].setAttribute('languageID', data.languageID);

    const taxScheme = party.getElementsByTagName('cac:PartyTaxScheme')[0].getElementsByTagName('cac:TaxScheme')[0]

    if (!data.msgCliente.TaxSchemeID) {
      party.removeChild(taxScheme);
    } else {
      taxScheme.getElementsByTagName('cbc:ID')[0].textContent = data.msgCliente.TaxSchemeID || '';
      taxScheme.getElementsByTagName('cbc:Name')[0].textContent = data.msgCliente.TaxSchemeName || '';
    }

    const partyLegalEntity = party.getElementsByTagName('cac:PartyLegalEntity')[0];
    partyLegalEntity.getElementsByTagName('cbc:RegistrationName')[0].textContent = data.msgCliente.NameCliente || '';
    partyLegalEntity.getElementsByTagName('cbc:CompanyID')[0].textContent = data.msgCliente.IdCliente || '';
    if (data.msgCliente.CompanySchemeID) {
      partyLegalEntity.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeID', data.msgCliente.CompanySchemeID);
    } else {
      partyLegalEntity.getElementsByTagName('cbc:CompanyID')[0].removeAttribute('schemeID');
    }
    partyLegalEntity.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeName', data.msgCliente.CompanySchemeName);
    partyLegalEntity.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeAgencyID', data.msgEmpresa.schemeAgencyID)
    partyLegalEntity.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeAgencyName', data.msgEmpresa.schemeAgencyName)

    if (!data.msgCliente.ElectronicMail) {
      party.removeChild(party.getElementsByTagName('cac:Contact')[0].getElementsByTagName('cbc:ElectronicMail')[0]);
    } else {
      party.getElementsByTagName('cbc:ElectronicMail')[0].textContent = data.msgCliente.ElectronicMail;
      party.getElementsByTagName('cac:Contact')[0].getElementsByTagName('cbc:Name')[0].textContent = data.msgCliente.ContacNameCliente;
    }

    if (!data.msgCliente.ContacNameCliente) {
      party.removeChild(party.getElementsByTagName('cac:Contact')[0].getElementsByTagName('cbc:Name')[0]);
    } else {
      party.getElementsByTagName('cac:Contact')[0].getElementsByTagName('cbc:Name')[0].textContent = data.msgCliente.ContacNameCliente;
    }

    party.getElementsByTagName('cac:Person')[0].getElementsByTagName('cbc:FirstName')[0].textContent = data.msgCliente.NameCliente;
  } catch (error) {
    logger.error(`Ocurrio un error en setClientInformation debido a: ${error.message}`);
    throw error;
  }
}

function setContingency(contingency, data) {
  try {
    contingency.getElementsByTagName('cbc:ID')[0].textContent = data.ID || '';
    contingency.getElementsByTagName('cbc:IssueDate')[0].textContent = data.IssueDate || '';
  } catch (error) {
    logger.error(`Ocurrio un error en setContingency debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Coloca los valores en los nodos principales
 * @param {Object} invoice Objecto con el nodo principal de la factura
 * @param {Object} data Data proveniente de PS
 */
function setXMLHeader(invoice, data) {
  try {
    invoice.getElementsByTagName('sts:InvoiceAuthorization')[0].textContent = data.InvoiceAuthorization || '';
    invoice.getElementsByTagName('cbc:StartDate')[0].textContent = data.StartDate || '';
    invoice.getElementsByTagName('cbc:EndDate')[0].textContent = data.EndDate || '';
    invoice.getElementsByTagName('sts:Prefix')[0].textContent = data.Prefix || '';
    invoice.getElementsByTagName('sts:From')[0].textContent = data.From || '';
    invoice.getElementsByTagName('sts:To')[0].textContent = data.To || '';
    invoice.getElementsByTagName('sts:QRCode')[0].textContent = data.QRCode;
    invoice.getElementsByTagName('cbc:UBLVersionID')[0].textContent = data.UBLVersionID;
    invoice.getElementsByTagName('cbc:CustomizationID')[0].textContent = data.CustomizationID;
    invoice.getElementsByTagName('cbc:ProfileID')[0].textContent = process.env.PROFILEID_INVOICE || '';
    invoice.getElementsByTagName('cbc:ProfileExecutionID')[0].textContent = data.ProfileExecutionID || '';
    invoice.getElementsByTagName('cbc:ID')[0].textContent = data.ID || '';

    invoice.getElementsByTagName('cbc:IssueDate')[0].textContent = data.IssueDate || '';
    invoice.getElementsByTagName('cbc:IssueTime')[0].textContent = data.IssueTime || '';
    invoice.getElementsByTagName('cbc:DueDate')[0].textContent = data.DueDate || '';
    invoice.getElementsByTagName('cbc:InvoiceTypeCode')[0].textContent = data.InvoiceTypeCode || '';
    invoice.getElementsByTagName('cbc:Note')[0].textContent = data.Note || '';
    invoice.getElementsByTagName('cbc:DocumentCurrencyCode')[0].textContent = data.DocumentCurrencyCode || '';
    invoice.getElementsByTagName('cbc:LineCountNumeric')[0].textContent = data.LineCountNumeric || '';

  } catch (error) {
    logger.error(`Ocurrio un error en setXMLHeader debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Se coloca la informacion del nodo PaymentMeans
 * @param {Object} payment Nodo cac:PaymentMeans
 * @param {Object} data Data proveniente de PS
 */
function setPaymentMeans(payment, data) {
  try {
    payment.getElementsByTagName('cbc:ID')[0].textContent = data.PaymentMeans.ID || '';
    payment.getElementsByTagName('cbc:PaymentMeansCode')[0].textContent = data.PaymentMeans.PaymentMeansCode || '';
    payment.getElementsByTagName('cbc:PaymentDueDate')[0].textContent = data.DueDate;
  } catch (error) {
    logger.error(`Ocurrio un error en setPaymentMeans debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Coloca la informacion de los descuentos
 * @param {Object} invoice Objecto con el nodo principal de la factura
 * @param {Object} allowanceC Nodo donde se va colocar la informacion de los descuentos cac:AllowanceCharge
 * @param {Object} data Data proveniente de PS o request
 * @param {Object} taxTotal Nodo donde se va a insertar el nodo de descuento antes cac:TaxTotal
 * @param {String} currency Moneda
 */
function setDiscounts(invoice, allowanceC, data, taxTotal, currency) {
  try {
    let clone;

    if (data && data.length > 0) {
      for (const charge of data) {
        clone = allowanceC.cloneNode(true);

        clone.getElementsByTagName('cbc:ID')[0].textContent = charge.ID;
        clone.getElementsByTagName('cbc:ChargeIndicator')[0].textContent = charge.ChargeIndicator || '';

        if (charge.AllowanceChargeReasonCode) {
          clone.getElementsByTagName('cbc:AllowanceChargeReasonCode')[0].textContent = charge.AllowanceChargeReasonCode || '';
        } else {
          clone.removeChild(clone.getElementsByTagName('cbc:AllowanceChargeReasonCode')[0]);
        }

        if (charge.AllowanceChargeReason) {
          clone.getElementsByTagName('cbc:AllowanceChargeReason')[0].textContent = charge.AllowanceChargeReason || '';
        } else {
          clone.removeChild(clone.getElementsByTagName('cbc:AllowanceChargeReason')[0]);
        }

        clone.getElementsByTagName('cbc:MultiplierFactorNumeric')[0].textContent = charge.MultiplierFactorNumeric || '';

        clone.getElementsByTagName('cbc:Amount')[0].setAttribute('currencyID', currency);
        clone.getElementsByTagName('cbc:Amount')[0].textContent = charge.Amount || '';

        clone.getElementsByTagName('cbc:BaseAmount')[0].setAttribute('currencyID', currency);
        clone.getElementsByTagName('cbc:BaseAmount')[0].textContent = charge.BaseAmount || '';

        invoice.insertBefore(clone, taxTotal);
      }

      clone = null;
      invoice.removeChild(allowanceC);
    } else {
      invoice.removeChild(allowanceC);
    }
  } catch (error) {
    logger.error(`Ocurrio un error en setDiscounts debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Funcion generica para eliminar un nodo si no envian la data que deberia contener
 * @param {*} data La data a verificar si colocar o no
 * @param {String} tag Etiqueta del nodo a consultar
 * @param {Object} clone Padre del nodo con posibilidad de eliminarse
 * @param {Array} attributes Lista de atributos a colocar en el nodo
 */
function removeChild(data, tag, clone, attributes) {
  try {
    const node = clone.getElementsByTagName(tag)[0];
    if (data) {
      node.textContent = data;
      if (attributes.length > 0) {
        for (attribute of attributes) {
          node.setAttribute(attribute.label, attribute.value);
        }
      }
    } else {
      clone.removeChild(node)
    }
  } catch (error) {
    logger.error(`Ocurrio un error en removeChild debido a: ${error.message}`);
    throw error;
  }
}

function setvaluesInSubTotal(taxTotal, data, currency) {
  try {
    let iterator = 0;
    const subTotals = taxTotal.getElementsByTagName('cac:TaxSubtotal');
    size = subTotals.length;

    for (iterator; iterator < size; iterator++) {
      const subTotal = subTotals[iterator];
      const tax = data[iterator];
      if (tax.BaseUnitMeasure) {
        subTotal.getElementsByTagName('cbc:BaseUnitMeasure')[0].textContent = tax.BaseUnitMeasure
        subTotal.getElementsByTagName('cbc:BaseUnitMeasure')[0].setAttribute('unitCode', tax.UnitCode);
      } else {
        subTotal.removeChild(subTotal.getElementsByTagName('cbc:BaseUnitMeasure')[0]);
      }

      if (tax.PerUnitAmount) {
        subTotal.getElementsByTagName('cbc:PerUnitAmount')[0].textContent = tax.PerUnitAmount
        subTotal.getElementsByTagName('cbc:PerUnitAmount')[0].setAttribute('currencyID', currency);
      } else {
        subTotal.removeChild(subTotal.getElementsByTagName('cbc:PerUnitAmount')[0]);
      }
    }
  } catch (error) {
    logger.error(`Ocurrio un error en setvaluesInSubTotal debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Inserta los diferentes subtotales para los impuestos de cabecera
 * @param {Object} subTotal Objecto del XML donde se deben colocar los sub totales
 * @param {Object} father Padre del nodo cac:TaxSubtotal
 * @param {Array} taxSubTotals Arreglo con la data de los subtotals
 * @param {String} currency Moneda
 * @param {number} TaxAmount Informacion del impuesto general
 */
function setTaxSubTotal(subTotal, father, taxSubTotals, currency, document) {
  try {
    let clone = null;

    for (const tax of taxSubTotals) {
      clone = subTotal.cloneNode(true);

      clone.getElementsByTagName('cbc:TaxableAmount')[0].textContent = tax.TaxableAmount || '';
      clone.getElementsByTagName('cbc:TaxableAmount')[0].setAttribute('currencyID', currency);

      clone.getElementsByTagName('cbc:TaxAmount')[0].textContent = tax.SubTaxAmount || '';
      clone.getElementsByTagName('cbc:TaxAmount')[0].setAttribute('currencyID', currency);


      if (tax.Percent) {
        const percent = document.createElement('cbc:Percent');
        percent.textContent = tax.Percent;
        clone.insertBefore(percent, clone.getElementsByTagName('cac:TaxScheme')[0]);
      }

      clone.getElementsByTagName('cbc:ID')[0].textContent = tax.IdTax || '';
      clone.getElementsByTagName('cbc:Name')[0].textContent = tax.NameTax || '';

      father.appendChild(clone);
    }
  } catch (error) {
    logger.error(`Ocurrio un error en setTaxSubTotal debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Coloca la informacion de los impuestos
 * @param {Object} invoice Objecto con el nodo principal de la factura
 * @param {Array} taxTotal Nodo cac:TaxTotal
 * @param {Object} data Data de los impuestos
 * @param {Object} legalMonetaryTotal Nodo cac:LegalMonetaryTotal (para se insetado antes que el)
 * @param {String} currency Moneda
 */
function setTaxTotal(invoice, taxTotal, data, legalMonetaryTotal, currency, subTotal, document) {
  try {
    let clone = null;
    if (!subTotal) {
      subTotal = taxTotal.getElementsByTagName('cac:TaxSubtotal')[0];
      taxTotal.removeChild(subTotal);
    }

    for (tax of data) {
      clone = taxTotal.cloneNode(true);

      clone.getElementsByTagName('cbc:TaxAmount')[0].textContent = tax.TaxAmount || '';
      clone.getElementsByTagName('cbc:TaxAmount')[0].setAttribute('currencyID', currency);

      removeChild(tax.TaxEvidenceIndicator, 'cbc:TaxEvidenceIndicator', clone, []);

      if (tax.TaxSubtotal && tax.TaxSubtotal.length > 0 && !mainHelper.emptyArray(tax.TaxSubtotal)) {
        setTaxSubTotal(subTotal, clone, tax.TaxSubtotal, currency, document);
        setvaluesInSubTotal(clone, tax.TaxSubtotal, currency)
      }

      invoice.insertBefore(clone, legalMonetaryTotal);
    }
    clone = null;
    invoice.removeChild(taxTotal);

  } catch (error) {
    logger.error(`Ocurrio un error en setTaxTotal debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Se coloca la informacion del nodo cac:LegalMonetaryTotal
 * @param {object} legalMonetaryTotal Nodo cac:LegalMonetaryTotal
 * @param {object} data objeto con la informacion que debe contener el nodo cac:LegalMonetaryTotal
 */
function setLegalMonetary(legalMonetaryTotal, data) {
  try {
    legalMonetaryTotal.getElementsByTagName('cbc:LineExtensionAmount')[0].textContent = data.LineExtensionAmount || '';
    legalMonetaryTotal.getElementsByTagName('cbc:TaxExclusiveAmount')[0].textContent = data.TaxExclusiveAmount || '';
    legalMonetaryTotal.getElementsByTagName('cbc:TaxInclusiveAmount')[0].textContent = data.TaxInclusiveAmount || '';
    legalMonetaryTotal.getElementsByTagName('cbc:AllowanceTotalAmount')[0].textContent = data.AllowanceTotalAmount || '';
    legalMonetaryTotal.getElementsByTagName('cbc:ChargeTotalAmount')[0].textContent = data.ChargeTotalAmount || '';
    legalMonetaryTotal.getElementsByTagName('cbc:PayableAmount')[0].textContent = data.PayableAmount || '';

    legalMonetaryTotal.getElementsByTagName('cbc:LineExtensionAmount')[0].setAttribute('currencyID', data.DocumentCurrencyCode);
    legalMonetaryTotal.getElementsByTagName('cbc:TaxExclusiveAmount')[0].setAttribute('currencyID', data.DocumentCurrencyCode);
    legalMonetaryTotal.getElementsByTagName('cbc:AllowanceTotalAmount')[0].setAttribute('currencyID', data.DocumentCurrencyCode);
    legalMonetaryTotal.getElementsByTagName('cbc:ChargeTotalAmount')[0].setAttribute('currencyID', data.DocumentCurrencyCode);
    legalMonetaryTotal.getElementsByTagName('cbc:PayableAmount')[0].setAttribute('currencyID', data.DocumentCurrencyCode);

  } catch (error) {
    logger.error(`Ocurrio un error en setLegalMonetary debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Se encarga de colocar las propiedades adicionales que puede contener el objecto
 * en la linea de la factura
 * @param {Object} line Linea de la factura cac:InvoiceLine
 * @param {Object} property Nodo con la estructura de los items adicionales cac:AdditionalItemProperty
 * @param {Array} data Lista de las propiedades adicionales
 * @param {Object} price Nodo cac:Price donde se va a insertar antes
 */
function setAditionalItemProperties(line, property, data, Item) {
  if (data && data.length > 0) {
    let clone = null;
    for (const value of data) {
      clone = property.cloneNode(true);
      clone.getElementsByTagName('cbc:Name')[0].textContent = value.Name || '';
      clone.getElementsByTagName('cbc:Value')[0].textContent = value.Value || '';
      if (value.ValueQuantity) {
        clone.getElementsByTagName('cbc:ValueQuantity')[0].textContent = value.ValueQuantity;
        clone.getElementsByTagName('cbc:ValueQuantity')[0].setAttribute('unitCode', value.unitCode);
      } else {
        logger.error('borra');
        clone.removeChild(clone.getElementsByTagName('cbc:ValueQuantity')[0]);
      }
      Item.appendChild(clone);
    }
    line.removeChild(property);
  } else {
    line.removeChild(property);
  }
}

/**
 * Se encarga de colocar las propiedades que puede contener el objecto
 * en la linea de la factura
 * @param {Object} line Linea de la factura cac:InvoiceLine
 * @param {Object} property Nodo con la estructura de los items adicionales cac:InformationContentProviderParty
 * @param {Array} data Objeto con la informacion
 * @param {Object} Item Nodo cac:Item donde se va a insertar antes
 */
function setInformationContentProviderParty(line, property, data, Item) {
  if (validateInformationContentProviderParty(data)) {
    let clone = null;
    clone = property.cloneNode(true);
    const PowerOfAttorney = clone.getElementsByTagName('cac:PowerOfAttorney')[0];
    const AgentParty = PowerOfAttorney.getElementsByTagName('cac:AgentParty')[0];
    const PartyIdentification = AgentParty.getElementsByTagName('cac:PartyIdentification')[0];

    PartyIdentification.getElementsByTagName('cbc:ID')[0].setAttribute('schemeID', data.schemeIDProviderParty || '');
    PartyIdentification.getElementsByTagName('cbc:ID')[0].setAttribute('schemeName', data.schemeNameProviderParty || '');
    PartyIdentification.getElementsByTagName('cbc:ID')[0].textContent = data.IDProviderParty || '';

    Item.appendChild(clone);
    line.removeChild(property);
  } else {
    line.removeChild(property);
  }
}

/**
 * Valida si el objecto no esta vacio
 *
 * @param {*} data informacion del proveedor
 * @return {Boolean}
 */
function validateInformationContentProviderParty(data) {
  return data && Object.keys(data).length === 3;
}

/**
 * Establece el nombre de la etiqueta
 *
 * @param {*} type tipo de documento
 * @return {String} nombre de la etiqueta
 */
function setTypeLine(type) {
  try {
    let label;
    if (type == 1 || type == 2) {
      label = 'cac:InvoiceLine';
    } else if (type == 3) {
      label = 'cac:CreditNoteLine';
    } else if (type == 4) {
      label = 'cac:DebitNoteLine';
    }

    return label;
  } catch (error) {
    logger.error(`Ocurrio un error en setTypeLine debido a: ${error.message}`);
    throw error;
  }
}

/**
 *
 * @param {*} type
 * @return {String}
 */
function setLineQuantity(type) {
  try {
    let label;
    if (type == 1 || type == 2) {
      label = 'cbc:InvoicedQuantity';
    } else if (type == 3) {
      label = 'cbc:CreditedQuantity';
    } else if (type == 4) {
      label = 'cbc:DebitedQuantity'
    }
    return label;
  } catch (error) {
    logger.error(`Ocurrio un error en setLineQuantity debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Procesa las lineas de la factura
 * @param {Object} invoice Nodo principal de la factura
 * @param {Object} data Data enviada por PS
 */
function setInvoiceLines(invoice, data, type, document) {
  try {
    let clone = null;
    const label = setTypeLine(type);
    line = invoice.getElementsByTagName(label)[0];
    const linesWithoutNotes = [];

    const labelQuantity = setLineQuantity(type);

    /** Se elimina los nodos dinamicos para crearlos de acuerdo a la data */
    const allowanceC = line.getElementsByTagName('cac:AllowanceCharge')[0];
    line.removeChild(allowanceC);

    const taxTotal = line.getElementsByTagName('cac:TaxTotal')[0];
    line.removeChild(taxTotal);

    const subTotal = taxTotal.getElementsByTagName('cac:TaxSubtotal')[0];
    if (subTotal) taxTotal.removeChild(subTotal);

    const additionalItemProperty = line.getElementsByTagName('cac:AdditionalItemProperty')[0];
    line.removeChild(additionalItemProperty);

    const informationContentProviderParty = line.getElementsByTagName('cac:InformationContentProviderParty')[0];
    if (informationContentProviderParty) line.removeChild(informationContentProviderParty);

    let iterator = 0;

    for (const item of data.InvoiceLine) {
      clone = line.cloneNode(true);
      clone.getElementsByTagName('cbc:ID')[0].textContent = item.IDInvoiceLine || '';
      if (item.schemeIdLine) { clone.getElementsByTagName('cbc:ID')[0].setAttribute('schemeID', item.schemeIdLine); }

      clone.getElementsByTagName('cbc:Note')[0].textContent = item.NoteInvoiceLine || '';
      if (!item.NoteInvoiceLine || item.NoteInvoiceLine == ' ') linesWithoutNotes.push(iterator);

      const quantityTag = clone.getElementsByTagName(labelQuantity)[0];

      quantityTag.setAttribute('unitCode', item.UnitCode)
      quantityTag.textContent = item.InvoicedQuantity || '';

      clone.getElementsByTagName('cbc:LineExtensionAmount')[0].textContent = item.LineExtensionAmount || '';
      clone.getElementsByTagName('cbc:LineExtensionAmount')[0].setAttribute('currencyID', data.DocumentCurrencyCode);

      const Item = clone.getElementsByTagName('cac:Item')[0];

      // si tipo es 3 o 4 cambiar el orden de los nodos
      if (type == 3 || type == 4) {
        if (item.TaxTotal && item.TaxTotal.length > 0 && !mainHelper.emptyArray(item.TaxTotal) && !existSubTotal(item.TaxTotal)) setTaxTotal(clone, taxTotal, item.TaxTotal, Item, data.DocumentCurrencyCode, subTotal, document);
        if (item.AllowanceCharge && item.AllowanceCharge.length > 0 && !mainHelper.emptyArray(item.AllowanceCharge)) setDiscounts(clone, allowanceC, item.AllowanceCharge, Item, data.DocumentCurrencyCode)
      } else {
        if (item.AllowanceCharge && item.AllowanceCharge.length > 0 && !mainHelper.emptyArray(item.AllowanceCharge)) setDiscounts(clone, allowanceC, item.AllowanceCharge, Item, data.DocumentCurrencyCode)
        if (item.TaxTotal && item.TaxTotal.length > 0 && !mainHelper.emptyArray(item.TaxTotal) && !existSubTotal(item.TaxTotal)) setTaxTotal(clone, taxTotal, item.TaxTotal, Item, data.DocumentCurrencyCode, subTotal, document);
      }

      Item.getElementsByTagName('cbc:Description')[0].textContent = item.DescriptionLine || '';
      Item.getElementsByTagName('cbc:ID')[0].textContent = item.StandardItemIdentificationID || '';
      Item.getElementsByTagName('cbc:ID')[0].setAttribute('schemeID', item.SchemeID);

      const price = clone.getElementsByTagName('cac:Price')[0];
      if (item.AdditionalItemProperty && item.AdditionalItemProperty.length > 0 && !mainHelper.emptyArray(item.AdditionalItemProperty)) setAditionalItemProperties(clone, additionalItemProperty, item.AdditionalItemProperty, Item);
      if (item.InformationContentProviderParty && Object.keys(item.InformationContentProviderParty).length > 0) setInformationContentProviderParty(clone, informationContentProviderParty, item.InformationContentProviderParty, Item);

      price.getElementsByTagName('cbc:PriceAmount')[0].textContent = item.PriceAmount || '';
      price.getElementsByTagName('cbc:PriceAmount')[0].setAttribute('currencyID', data.DocumentCurrencyCode);
      price.getElementsByTagName('cbc:BaseQuantity')[0].textContent = item.BaseQuantity || '';
      price.getElementsByTagName('cbc:BaseQuantity')[0].setAttribute('unitCode', item.UnitCodePrice);

      invoice.appendChild(clone);
      clone = null;

      iterator++;
    }
    invoice.removeChild(line);

    for (let i = 0; i < linesWithoutNotes.length; i++) {
      const line = invoice.getElementsByTagName(label)[linesWithoutNotes[i]];
      const note = line.getElementsByTagName('cbc:Note')[0];
      line.removeChild(note);
    }

    setPricingReference(invoice, data);

  } catch (error) {
    console.log(error);
    logger.error(`Ocurrio un error en setInvoiceLines debido a: ${error.message}`);
    throw error;
  }
}

function setPricingReference(invoice, data) {
  try {
    let index = 0;
    for (const item of data.InvoiceLine) {
      if (item.PriceAmountReference && item.PriceTypeCodeReference) {
        const pricingReference = invoice.getElementsByTagName('cac:PricingReference')[index].getElementsByTagName('cac:AlternativeConditionPrice')[0];

        pricingReference.getElementsByTagName('cbc:PriceAmount')[0]
          .textContent = item.PriceAmountReference || ' ';

        pricingReference.getElementsByTagName('cbc:PriceTypeCode')[0]
          .textContent = item.PriceTypeCodeReference || ' ';

        pricingReference.getElementsByTagName('cbc:PriceAmount')[0].setAttribute('currencyID', data.DocumentCurrencyCode);
        index++;

      } else {
        invoice.removeChild(invoice.getElementsByTagName('cac:PricingReference')[index]);
      }
    }
  } catch (error) {
    logger.error(`Ocurrio un error en setPricingReference debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Procesa la estructura de la direccion tanto para emisor como receptor
 * @param {Object} address Nodo de la direccion
 * @param {Object} data Data proveniente de PS
 */
function setAddress(address, data) {
  try {
    address.getElementsByTagName('cbc:ID')[0].textContent = data.msgEmpresa.ID || '';
    address.getElementsByTagName('cbc:CityName')[0].textContent = data.msgEmpresa.CityName || '';
    address.getElementsByTagName('cbc:CountrySubentity')[0].textContent = data.msgEmpresa.CountrySubentity || '';
    address.getElementsByTagName('cbc:CountrySubentityCode')[0].textContent = data.msgEmpresa.CountrySubentityCode || '';
    address.getElementsByTagName('cbc:Line')[0].textContent = data.msgEmpresa.Line || '';

    address.getElementsByTagName('cbc:IdentificationCode')[0].textContent = data.msgEmpresa.IdentificationCode || '';
    address.getElementsByTagName('cbc:Name')[0].textContent = data.msgEmpresa.Name || '';
    address.getElementsByTagName('cbc:Name')[0].setAttribute('languageID', data.languageID);

  } catch (error) {
    logger.error(`Ocurrio un error en setAddress debido a: ${error.message}`);
    throw error;
  }
}

/**
 * Procesa la informacion del emisor, en este caso CORBETA SA
 * @param {Object} company Nodo donde se debe colocar la informacion
 * @param {Object} data Informacion parametrizada desde mongodb
 */
function setCompanyInfo(company, data) {
  try {
    company.getElementsByTagName('cbc:AdditionalAccountID')[0].textContent = data.msgEmpresa.AccountIdEmpresa || '';
    company.getElementsByTagName('cbc:AdditionalAccountID')[0].setAttribute('schemeAgencyID', data.msgEmpresa.schemeAgencyID) || '';

    company.getElementsByTagName('cac:Party')[0].getElementsByTagName('cac:PartyName')[0]
      .getElementsByTagName('cbc:Name')[0].textContent = data.msgEmpresa.RegistrationName || '';

    const address = company.getElementsByTagName('cac:Party')[0].getElementsByTagName('cac:PhysicalLocation')[0]
      .getElementsByTagName('cac:Address')[0];

    address.getElementsByTagName('cbc:PostalZone')[0].textContent = data.msgEmpresa.PostalZone || '';

    setAddress(address, data);

    const partyTaxScheme = company.getElementsByTagName('cac:Party')[0].getElementsByTagName('cac:PartyTaxScheme')[0];

    partyTaxScheme.getElementsByTagName('cbc:RegistrationName')[0].textContent = data.msgEmpresa.RegistrationName || '';

    partyTaxScheme.getElementsByTagName('cbc:CompanyID')[0].textContent = data.msgEmpresa.Nit || '';
    partyTaxScheme.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeAgencyID', data.msgEmpresa.schemeAgencyID)
    partyTaxScheme.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeAgencyName', data.msgEmpresa.schemeAgencyName)
    partyTaxScheme.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeID', data.msgEmpresa.schemeID)
    partyTaxScheme.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeName', data.msgEmpresa.schemeName)

    partyTaxScheme.getElementsByTagName('cbc:TaxLevelCode')[0].textContent = data.msgEmpresa.TaxLevelCode || '';
    partyTaxScheme.getElementsByTagName('cbc:TaxLevelCode')[0].setAttribute('listName', data.msgEmpresa.listName)

    const registrationAddress = partyTaxScheme.getElementsByTagName('cac:RegistrationAddress')[0];
    registrationAddress.getElementsByTagName('cbc:PostalZone')[0].textContent = data.msgEmpresa.PostalZone || '';
    setAddress(registrationAddress, data);

    partyTaxScheme.getElementsByTagName('cac:TaxScheme')[0].getElementsByTagName('cbc:ID')[0].textContent = data.msgEmpresa.TaxScheme.ID || '';
    partyTaxScheme.getElementsByTagName('cac:TaxScheme')[0].getElementsByTagName('cbc:Name')[0].textContent = data.msgEmpresa.TaxScheme.Name || '';

    const partyLegalEntity = company.getElementsByTagName('cac:Party')[0].getElementsByTagName('cac:PartyLegalEntity')[0];
    partyLegalEntity.getElementsByTagName('cbc:RegistrationName')[0].textContent = data.msgEmpresa.RegistrationName;

    partyLegalEntity.getElementsByTagName('cbc:CompanyID')[0].textContent = data.msgEmpresa.RegistrationName || '';

    partyLegalEntity.getElementsByTagName('cbc:CompanyID')[0].textContent = data.msgEmpresa.Nit || '';
    partyLegalEntity.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeAgencyID', data.msgEmpresa.schemeAgencyID)
    partyLegalEntity.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeAgencyName', data.msgEmpresa.schemeAgencyName)
    partyLegalEntity.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeID', data.msgEmpresa.schemeID)
    partyLegalEntity.getElementsByTagName('cbc:CompanyID')[0].setAttribute('schemeName', data.msgEmpresa.schemeName)

    partyLegalEntity.getElementsByTagName('cac:CorporateRegistrationScheme')[0].getElementsByTagName('cbc:ID')[0].textContent = data.Prefix || '';

    if (!data.msgEmpresa.ElectronicMailEmp) {
      company.removeChild(company.getElementsByTagName('cac:Party')[0].getElementsByTagName('cac:Contact')[0].getElementsByTagName('cbc:ElectronicMail')[0]);
    } else {
      company.getElementsByTagName('cac:Party')[0].getElementsByTagName('cbc:ElectronicMail')[0].textContent = data.msgEmpresa.ElectronicMailEmp;
    }

    if (!data.msgEmpresa.NameContacEmp) {
      company.removeChild(company.getElementsByTagName('cac:Party')[0].getElementsByTagName('cac:Contact')[0].getElementsByTagName('cbc:Name')[0]);
    } else {
      company.getElementsByTagName('cac:Party')[0].getElementsByTagName('cac:Contact')[0].getElementsByTagName('cbc:Name')[0].textContent = data.msgEmpresa.NameContacEmp;
    }

  } catch (error) {
    logger.error(`Ocurrio un error en setCompanyInfo debido a: ${error.message}`);
    throw error;
  }
}

function existSubTotal(taxTotal) {
  try {
    const result = taxTotal.length === 1 && Object.keys(taxTotal[0]).length === 1 && Object.keys(taxTotal[0].TaxSubtotal).length === 1 && mainHelper.emptyArray(taxTotal[0].TaxSubtotal)
      ? true : false;
    return result;
  } catch (error) {
    logger.error(`Ocurrio un error en existSubTotal debido a: ${error.message}`);
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
    const invoice = document.getElementsByTagName('Invoice')[0];
    const orderReference = document.getElementsByTagName('cac:OrderReference')[0];
    const accountingCustomerParty = document.getElementsByTagName('cac:AccountingCustomerParty')[0];
    const payment = document.getElementsByTagName('cac:PaymentMeans')[0];
    const allowanceC = invoice.getElementsByTagName('cac:AllowanceCharge')[0];
    const taxTotal = invoice.getElementsByTagName('cac:TaxTotal')[0];
    const legalMonetaryTotal = document.getElementsByTagName('cac:LegalMonetaryTotal')[0];
    const company = document.getElementsByTagName('cac:AccountingSupplierParty')[0];
    const contingency = document.getElementsByTagName('cac:AdditionalDocumentReference')[0];

    setXMLHeader(invoice, data);
    setEbillInformation(invoice, data);
    setCUFEInformation(invoice, data);

    if (data.InvoiceTypeCode === '03') {
      setContingency(contingency, data);
    } else {
      invoice.removeChild(contingency);
    }

    if (!data.orderReferenceId) {
      invoice.removeChild(orderReference);
    } else {
      orderReference.getElementsByTagName('cbc:ID')[0].textContent = data.orderReferenceId || '';
      orderReference.getElementsByTagName('cbc:IssueDate')[0].textContent = data.IssueDateOrder || '';
    }

    setClientInformation(accountingCustomerParty, data);

    setPaymentMeans(payment, data);

    if (data.AllowanceCharge && data.AllowanceCharge.length > 0 && !mainHelper.emptyArray(data.AllowanceCharge)) {
      setDiscounts(invoice, allowanceC, data.AllowanceCharge, taxTotal, data.DocumentCurrencyCode);
    } else {
      invoice.removeChild(allowanceC);
    }

    if (data.TaxTotal && data.TaxTotal.length > 0 && !mainHelper.emptyArray(data.TaxTotal) && !existSubTotal(data.TaxTotal)) {
      setTaxTotal(invoice, taxTotal, data.TaxTotal, legalMonetaryTotal, data.DocumentCurrencyCode, null, document);
    } else {
      invoice.removeChild(taxTotal);
    }

    setLegalMonetary(legalMonetaryTotal, data);
    setInvoiceLines(invoice, data, data.DocumentType, document);
    setCompanyInfo(company, data);
  } catch (error) {
    logger.error(`Ocurrio un error en xmlV2 debido a: ${error.message}`);
    throw error;
  }
}

module.exports = {
  xml,
  xmlV2,
  removeChild,
  setCUFEInformation,
  setPaymentMeans,
  setAditionalItemProperties,
  setInformationContentProviderParty,
  setInvoiceLines,
  setEbillInformation,
  setCompanyInfo,
  setClientInformation,
  setDiscounts,
  setTaxTotal,
  setLegalMonetary,
  existSubTotal,
  setContingency,
  setXMLHeader,
  setRigthParams,
  setvaluesInSubTotal,
  setTaxSubTotal,
  setTypeLine,
  setLineQuantity,
  setAddress
};
