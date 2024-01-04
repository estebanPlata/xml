/**
 * Factura Mandato
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
  const physicalLocation = accountingSupplierParty.getElementsByTagName('fe:PhysicalLocation')[0];
  const partyTaxSchemeCompany = accountingSupplierParty.getElementsByTagName('fe:PartyTaxScheme')[0];
  const partyTaxScheme = accountingSupplierParty.getElementsByTagName('fe:PartyTaxScheme')[1];
  const partyLegalEntityCompany = accountingSupplierParty.getElementsByTagName('fe:PartyLegalEntity')[0];
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

  physicalLocation.getElementsByTagName('cbc:Department')[0].textContent = data.msgEmpresa.DepartmentEmpresa || '';
  physicalLocation.getElementsByTagName('cbc:CitySubdivisionName')[0].textContent = data.msgEmpresa.CitySubdivisionNameEmp || '';
  physicalLocation.getElementsByTagName('cbc:CityName')[0].textContent = data.msgEmpresa.CityNameEmpresa || '';
  physicalLocation.getElementsByTagName('cbc:Line')[0].textContent = data.msgEmpresa.LineEmpresa || '';
  physicalLocation.getElementsByTagName('cbc:IdentificationCode')[0].textContent = data.msgEmpresa.IdentificationCodeEmpresa || '';

  partyTaxSchemeCompany.getElementsByTagName('cbc:RegistrationName')[0].textContent = data.PartyTaxScheme[0].RegistrationName || '';
  partyTaxSchemeCompany.getElementsByTagName('cbc:CompanyID')[0].textContent = data.PartyTaxScheme[0].CompanyID || '';
  partyTaxSchemeCompany.getElementsByTagName('cbc:TaxLevelCode')[0].textContent = data.PartyTaxScheme[0].TaxLevelCode || '';
  partyTaxSchemeCompany.getElementsByTagName('cbc:TaxLevelCode')[0].attributes.getNamedItem('listName').textContent = data.PartyTaxScheme[0].listName || '';
  partyTaxSchemeCompany.getElementsByTagName('cbc:TaxLevelCode')[0].attributes.getNamedItem('name').textContent = data.PartyTaxScheme[0].name || '';
  partyTaxSchemeCompany.getElementsByTagName('cac:TaxScheme')[0].textContent = data.PartyTaxScheme[0].TaxScheme || '';

  i = 1;
  max = data.PartyTaxScheme.length;

  for (; i < max; i++) {
    if (data.PartyTaxScheme[i]) {
      clone = partyTaxScheme.cloneNode(true);
      clone.getElementsByTagName('cbc:TaxLevelCode')[0].textContent = data.PartyTaxScheme[i].TaxLevelCode || '';
      clone.getElementsByTagName('cbc:TaxLevelCode')[0].attributes.getNamedItem('listName').textContent = data.PartyTaxScheme[i].listName || '';
      clone.getElementsByTagName('cbc:TaxLevelCode')[0].attributes.getNamedItem('name').textContent = data.PartyTaxScheme[i].name || '';
      clone.getElementsByTagName('cac:TaxScheme')[0].textContent = data.PartyTaxScheme[i].TaxScheme || '';

      accountingSupplierParty.insertBefore(clone, partyLegalEntityCompany);
    }
  }

  clone = null;
  accountingSupplierParty.removeChild(partyTaxScheme);

  partyLegalEntityCompany.getElementsByTagName('cbc:RegistrationName')[0].textContent = data.msgEmpresa.RegistrationNameEmpresa || '';
  partyLegalEntityCompany.getElementsByTagName('cbc:CitySubdivisionName')[0].textContent = data.msgEmpresa.CitySubdivisionNameEmp || '';
  partyLegalEntityCompany.getElementsByTagName('cbc:CityName')[0].textContent = data.msgEmpresa.CityNameEmpresa || '';
  partyLegalEntityCompany.getElementsByTagName('cbc:PostalZone')[0].textContent = data.msgEmpresa.PostalZone || '';
  partyLegalEntityCompany.getElementsByTagName('cbc:CountrySubentity')[0].textContent = data.msgEmpresa.CountrySubentity || '';
  partyLegalEntityCompany.getElementsByTagName('cbc:Line')[0].textContent = data.msgEmpresa.LineEmpresa || '';

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
      clone.getElementsByTagName('cbc:Note')[0].textContent = data.InvoiceLine[i].NoteInvoiceLine || '';
      clone.getElementsByTagName('cbc:LineExtensionAmount')[0].textContent = data.InvoiceLine[i].ExtensionAmountLine || '';
      clone.getElementsByTagName('cbc:Description')[0].textContent = data.InvoiceLine[i].DescriptionLine || '';
      clone.getElementsByTagName('cbc:PriceAmount')[0].textContent = data.InvoiceLine[i].PriceAmount || '';
      clone.getElementsByTagName('cbc:ID')[1].textContent = data.InvoiceLine[i].IdMandato || '';
      clone.getElementsByTagName('cbc:ExtendedID')[0].textContent = data.InvoiceLine[i].ExtendedID || '';
      clone.getElementsByTagName('cbc:ID')[2].textContent = data.InvoiceLine[i].IdMandatoAdi || '';

      invoice.appendChild(clone);
    }
  }

  clone = null;
  invoice.removeChild(invoiceLine);
};

module.exports = {
  xml,
};
