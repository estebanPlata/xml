// Libraries
const chai = require('chai');
const expect = chai.expect;
// Imports
const nationalServ = require('../api/services/national_invoice.service');
const DOMParser = require('xmldom').DOMParser;

describe('Test en removeChild', () => {
  let doc;
  let data;
  before(() => {
    doc = new DOMParser().parseFromString(
      '<xml xmlns="a" xmlns:c="./lite">\n' +
      '\t<node1>test</node1>\n' +
      '\t<node2></node2>\n' +
      '\t<node3/>\n' +
      '</xml>'
      , 'text/xml');
    data = {
      node1: 'test2',
      node2: 'hola',
    };
  });

  it('la data si contiene datos para la etiqueta node3, pero no tiene atributos', () => {
    data.node3 = 'Jota';
    nationalServ.removeChild(data.node3, 'node3', doc, []);
    expect(doc.getElementsByTagName('node3')[0].textContent).to.eqls('Jota');
  });

  it('la data si contiene datos para la etiqueta node3, y contiene atributos', () => {
    nationalServ.removeChild(data.node3, 'node3', doc, [{ value: 5, label: 'prueba' }, { value: 'hola', label: 'prueba1' }]);
    expect(doc.getElementsByTagName('node3')[0].textContent).to.eqls('Jota');
    expect(doc.getElementsByTagName('node3')[0].getAttribute('prueba')).to.eqls('5');
    expect(doc.getElementsByTagName('node3')[0].getAttribute('prueba1')).to.eqls('hola');
  });

  it('la data no contiene dato para la etiqueta node3', () => {
    delete data['node3'];
    nationalServ.removeChild(data.node3, 'node3', doc, null);
    expect(doc.getElementsByTagName('node3')[0]).to.eqls(undefined);
  });

  it('Capturando el error', () => {
    try {
      return nationalServ.removeChild(data.node2, 'node3', doc, null);
    } catch (error) {
      expect(error).to.be.instanceOf(Error)
    }
  });
});

describe('Tests en setCUFEInformation', () => {
  let doc;
  let data;
  before(() => {
    doc = new DOMParser().parseFromString(
      '<xml xmlns="a" xmlns:c="./lite">\n' +
      '\t<node1>test</node1>\n' +
      '\t<node2></node2>\n' +
      '\t<cbc:UUID/>\n' +
      '</xml>'
      , 'text/xml');
    data = {
      UUID: '1254622345452',
      ProfileExecutionID: '1',
      CUFEAlgorithm: 'CUFE-384'
    };
  });

  it('Se coloca el valor del campo del CUFE', () => {
    nationalServ.setCUFEInformation(doc, data);
    expect(doc.getElementsByTagName('cbc:UUID')[0].textContent).to.eqls('1254622345452');
    expect(doc.getElementsByTagName('cbc:UUID')[0].getAttribute('schemeID')).to.eqls('1');
  });

  it('Se captura el error', () => {
    try {
      nationalServ.setCUFEInformation(null, data);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  })
});
describe('Tests en setPaymentMeans', () => {
  let doc;
  let data;
  before(() => {
    doc = new DOMParser().parseFromString(
      '<xml xmlns="a" xmlns:c="./lite">\n' +
      '\t<cbc:PaymentMeansCode>test</cbc:PaymentMeansCode>\n' +
      '\t<cbc:PaymentDueDate>h</cbc:PaymentDueDate>\n' +
      '\t<cbc:ID/>\n' +
      '</xml>'
      , 'text/xml');
    data = {
      PaymentMeans: {
        ID: '5',
        PaymentMeansCode: '1',
      },
      DueDate: '2019-01-01'
    };
  });

  it('Se coloca los valores', () => {
    nationalServ.setPaymentMeans(doc, data);
    expect(doc.getElementsByTagName('cbc:PaymentMeansCode')[0].textContent).to.be.eqls('1');
    expect(doc.getElementsByTagName('cbc:PaymentDueDate')[0].textContent).to.be.eqls('2019-01-01');
    expect(doc.getElementsByTagName('cbc:ID')[0].textContent).to.be.eqls('5');
  });
  it('Se captura el error', () => {
    try {
      return nationalServ.setPaymentMeans(null, data);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  });
});

describe('Tests en setAditionalItemProperties', () => {
  let doc;
  let data;
  before(() => {
    doc = new DOMParser().parseFromString(
      '<xml xmlns="a" xmlns:c="./lite">\n' +
      '\t<cac:Properties>' +
      '\t<cbc:Name>test</cbc:Name>\n' +
      '\t<cbc:Value>h</cbc:Value>\n' +
      '\t<cbc:unitCode>KGM</cbc:unitCode>\n' +
      '\t<cbc:ValueQuantity>24350</cbc:ValueQuantity>\n' +
      '\t</cac:Properties>\n' +
      '\t<cac:Price></cac:Price>' +
      '</xml>'
      , 'text/xml');
    data = [{ Name: 'Peso', Value: '5' }, { Name: 'Longitud', Value: '100' }]
  });
  it('Existen atributos', () => {
    nationalServ.setAditionalItemProperties(doc, doc.getElementsByTagName('cac:Properties')[0], data,
      doc.getElementsByTagName('cac:Price')[0]);

    expect(doc.getElementsByTagName('cbc:Name')[0].textContent).to.be.equal('Peso')
    expect(doc.getElementsByTagName('cbc:Value')[0].textContent).to.be.equal('5')
  });

  it('No existen atributos', () => {
    nationalServ.setAditionalItemProperties(doc, doc.getElementsByTagName('cac:Properties')[0], [],
      doc.getElementsByTagName('cac:Price')[0]);
    expect(doc.getElementsByTagName('cbc:Properties')[0]).to.be.equal(undefined)
  });

  it('Se captura el error', () => {
    try {
      return nationalServ.setAditionalItemProperties(doc, doc.getElementsByTagName('cac:Properties')[0], null,
        doc.getElementsByTagName('cac:Price')[0]);
    } catch (error) {
      expect(error).to.be.instanceOf(Error)
    }
  });
});

describe('Tests en existSubTotal', () => {
  it('Se captura el error', () => {
    let existError = false;
    try {
      return nationalServ.existSubTotal(undefined);
    } catch (error) {
      existError = true;
      expect(error).to.be.instanceOf(Error);
    } finally {
      expect(existError).to.be.eqls(true);
    }
  });

  it('No existe subtotal', () => {
    const rs = nationalServ.existSubTotal([]);
    expect(rs).to.be.eqls(false);
  });

  it('Existe subtotal', () => {
    const rs = nationalServ.existSubTotal([{ TaxSubtotal: [{}] }]);
    expect(rs).to.be.eqls(true);
  });
});

describe('Tests en setContingency', () => {
  let data, doc;
  before(() => {
    doc = new DOMParser().parseFromString(
      '<xml xmlns="a" xmlns:c="./lite">\n' +
      '\t<cac:Properties>' +
      '\t<cbc:ID>test</cbc:ID>\n' +
      '\t<cbc:IssueDate>h</cbc:IssueDate>\n' +
      '\t</cac:Properties>\n' +
      '</xml>'
      , 'text/xml');
    data = { ID: '185974', IssueDate: '2018-01-01' };
  });

  it('Se captura el error', () => {
    let existError = false;
    try {
      return nationalServ.setContingency(undefined, null);
    } catch (error) {
      existError = true;
      expect(error).to.be.instanceOf(Error);
    } finally {
      expect(existError).to.be.eqls(true);
    }
  });

  it('Se establece la contigencia', () => {
    nationalServ.setContingency(doc, data);
    expect(doc.getElementsByTagName('cbc:ID')[0].textContent).to.be.equal('185974');
    expect(doc.getElementsByTagName('cbc:IssueDate')[0].textContent).to.be.equal('2018-01-01');
  });

  it('No se suminstran los valores', () => {
    nationalServ.setContingency(doc, {});
    expect(doc.getElementsByTagName('cbc:ID')[0].textContent).to.be.equal('');
    expect(doc.getElementsByTagName('cbc:IssueDate')[0].textContent).to.be.equal('');
  });
});

describe('Test en setXMLHeader', () => {
  before(() => {
    this.doc = new DOMParser().parseFromString(
      '<xml xmlns="a" xmlns:c="./lite">\n' +
      '\t<cac:Properties>' +
      '\t<sts:InvoiceAuthorization>test</sts:InvoiceAuthorization>\n' +
      '\t<cbc:StartDate>h</cbc:StartDate>\n' +
      '\t<cbc:EndDate>h</cbc:EndDate>\n' +
      '\t<sts:Prefix>h</sts:Prefix>\n' +
      '\t<sts:From>h</sts:From>\n' +
      '\t<sts:To>h</sts:To>\n' +
      '\t<sts:QRCode>h</sts:QRCode>\n' +
      '\t<cbc:UBLVersionID>h</cbc:UBLVersionID>\n' +
      '\t<cbc:CustomizationID>h</cbc:CustomizationID>\n' +
      '\t<cbc:ProfileID>h</cbc:ProfileID>\n' +
      '\t<cbc:ProfileExecutionID>h</cbc:ProfileExecutionID>\n' +
      '\t<cbc:ID>h</cbc:ID>\n' +
      '\t<cbc:IssueDate>h</cbc:IssueDate>\n' +
      '\t<cbc:IssueTime>h</cbc:IssueTime>\n' +
      '\t<cbc:DueDate>h</cbc:DueDate>\n' +
      '\t<cbc:InvoiceTypeCode>h</cbc:InvoiceTypeCode>\n' +
      '\t<cbc:DocumentCurrencyCode>h</cbc:DocumentCurrencyCode>\n' +
      '\t<cbc:LineCountNumeric>h</cbc:LineCountNumeric>\n' +
      '\t</cac:Properties>\n' +
      '</xml>'
      , 'text/xml');
    this.data = { ID: 1223456, ProfileID: 1, From: 'hola' }
  });

  it('Se captura el error', () => {
    let existError = false;
    try {
      return nationalServ.setXMLHeader(undefined, null);
    } catch (error) {
      existError = true;
      expect(error).to.be.instanceOf(Error);
    } finally {
      expect(existError).to.be.eqls(true);
    }
  });

  it('No se suministran valores', () => {
    nationalServ.setXMLHeader(this.doc, {});
    expect(this.doc.getElementsByTagName('cbc:ID')[0].textContent).to.be.equal('');
    expect(this.doc.getElementsByTagName('cbc:ProfileID')[0].textContent).to.be.equal('');
    expect(this.doc.getElementsByTagName('sts:From')[0].textContent).to.be.equal('');
  });

  it('Se suministran valores', () => {
    nationalServ.setXMLHeader(this.doc, this.data);
    expect(this.doc.getElementsByTagName('cbc:ID')[0].textContent).to.be.equal('1223456');
    expect(this.doc.getElementsByTagName('cbc:ProfileID')[0].textContent).to.be.equal('1');
    expect(this.doc.getElementsByTagName('sts:From')[0].textContent).to.be.equal('hola');
  })
});

describe('Test en setEbillInformation', () => {
  before(() => {
    this.doc = new DOMParser().parseFromString(
      '<xml xmlns="a" xmlns:c="./lite">\n' +
      '\t<cac:Properties>' +
      '\t<sts:ProviderID>test</sts:ProviderID>\n' +
      '\t<sts:SoftwareID>h</sts:SoftwareID>\n' +
      '\t<sts:SoftwareSecurityCode>h</sts:SoftwareSecurityCode>\n' +
      '\t</cac:Properties>\n' +
      '</xml>'
      , 'text/xml');
    this.data = { EbillCheckDigit: 2, EbillDocumentType: 'C', ProviderID: '7895', SoftwareID: '4741', SoftwareSecurityCode: '01' }
  });

  it('Se captura el error', () => {
    let existError = false;
    try {
      return nationalServ.setEbillInformation(undefined, null);
    } catch (error) {
      existError = true;
      expect(error).to.be.instanceOf(Error);
    } finally {
      expect(existError).to.be.eqls(true);
    }
  });

  it('No se suministran valores', () => {
    nationalServ.setEbillInformation(this.doc, {});
    expect(this.doc.getElementsByTagName('sts:ProviderID')[0].textContent).to.be.equal('');
    expect(this.doc.getElementsByTagName('sts:ProviderID')[0].getAttribute('schemeName')).to.be.equal('undefined');
    expect(this.doc.getElementsByTagName('sts:ProviderID')[0].getAttribute('schemeID')).to.be.equal('undefined');
    expect(this.doc.getElementsByTagName('sts:SoftwareID')[0].textContent).to.be.equal('');
    expect(this.doc.getElementsByTagName('sts:SoftwareSecurityCode')[0].textContent).to.be.equal('');
  });

  it('Se suministran valores', () => {
    nationalServ.setEbillInformation(this.doc, this.data);
    expect(this.doc.getElementsByTagName('sts:ProviderID')[0].textContent).to.be.equal('7895');
    expect(this.doc.getElementsByTagName('sts:ProviderID')[0].getAttribute('schemeName')).to.be.equal('C');
    expect(this.doc.getElementsByTagName('sts:ProviderID')[0].getAttribute('schemeID')).to.be.equal('2');
    expect(this.doc.getElementsByTagName('sts:SoftwareID')[0].textContent).to.be.equal('4741');
    expect(this.doc.getElementsByTagName('sts:SoftwareSecurityCode')[0].textContent).to.be.equal('01');
  });
});

describe('Tests en setRigthParams', () => {
  before(() => {
    this.data = { InvoiceTypeCode: "03", CUDEAlgorithm: 'ABD', CUFEAlgorithm: 'GHD' };
  });

  it('Es tipo 1 y el InvoiceTypeCode es "03" se retorna el CUDE', () => {
    const rs = nationalServ.setRigthParams('1', this.data);
    expect(rs).to.be.eql('ABD');
  });

  it('Es tipo 1 y el InvoiceTypeCode es "02" se retorna el CUFE', () => {
    this.data.InvoiceTypeCode = "02";
    const rs = nationalServ.setRigthParams('1', this.data);
    expect(rs).to.be.eql('GHD');
  });

  it('Es tipo 2 y el InvoiceTypeCode es "03" se retorna el CUDE', () => {
    this.data.InvoiceTypeCode = "03";
    const rs = nationalServ.setRigthParams('2', this.data);
    expect(rs).to.be.eql('ABD');
  });

  it('Es tipo 3 solo retorna CUDE ', () => {
    const rs = nationalServ.setRigthParams('3', this.data);
    expect(rs).to.be.eql('ABD');
  });

  it('Es tipo 4 solo retorna CUDE ', () => {
    const rs = nationalServ.setRigthParams('3', this.data);
    expect(rs).to.be.eql('ABD');
  });

  it('Es tipo 2 y el InvoiceTypeCode es "02" se retorna el CUFE', () => {
    this.data.InvoiceTypeCode = "02";
    const rs = nationalServ.setRigthParams('2', this.data);
    expect(rs).to.be.eql('GHD');
  });
});

describe('Tests en setClientInformation', () => {
  beforeEach(() => {
    this.doc = new DOMParser().parseFromString(
      "<?xml version='1.0' encoding='UTF-8'?> <Invoice xmlns='urn:oasis:names:specification:ubl:schema:xsd:Invoice-2' xmlns:cac='urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2' xmlns:cbc='urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2' xmlns:ext='urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2' xmlns:sts='dian:gov:co:facturaelectronica:Structures-2-1' xmlns:xades='http://uri.etsi.org/01903/v1.3.2#' xmlns:xades141='http://uri.etsi.org/01903/v1.4.1#' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='urn:oasis:names:specification:ubl:schema:xsd:Invoice-2     http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd'><cac:AccountingCustomerParty><cbc:AdditionalAccountID>1</cbc:AdditionalAccountID><cac:Party><cac:PartyIdentification><cbc:ID>8025877</cbc:ID></cac:PartyIdentification><cac:PartyName><cbc:Name>ADQUIRIENTE DE EJEMPLO</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>11001</cbc:ID><cbc:CityName>BOGOTA</cbc:CityName><cbc:PostalZone /><cbc:CountrySubentity>Districto Capital</cbc:CountrySubentity><cbc:CountrySubentityCode>11</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CR 9 A N0 99 - 07 OF 802</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name>Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>ADQUIRIENTE DE EJEMPLO</cbc:RegistrationName><cbc:CompanyID schemeAgencyID='195' schemeAgencyName='CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)' schemeID='dv3' schemeName='tipo adquiriente31'>900108281</cbc:CompanyID><cbc:TaxLevelCode listName='regimencliente05'>responsabilidadclienteO-99</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>11001</cbc:ID><cbc:CityName>BOGOTA</cbc:CityName><cbc:PostalZone /><cbc:CountrySubentity>Districto Capital</cbc:CountrySubentity><cbc:CountrySubentityCode>11</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CR 9 A N0 99 - 07 OF 802</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name>Colombia</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>ADQUIRIENTE DE EJEMPLO</cbc:RegistrationName><cbc:CompanyID schemeID='3' schemeName='31'>900108281</cbc:CompanyID></cac:PartyLegalEntity><cac:Contact><cbc:Name>Diana Cruz</cbc:Name><cbc:ElectronicMail>sd_fistrib_facturaelectronica@dian.gov.co</cbc:ElectronicMail></cac:Contact><cac:Person><cbc:FirstName>q</cbc:FirstName></cac:Person></cac:Party></cac:AccountingCustomerParty></Invoice>"
      , 'text/xml');

    this.data = {
      "msgCliente": {
        "AccountIdCliente": "2",
        "ID": "11001",
        "IdCliente": "900404985",
        "NameCliente": "CONSTRUCCIONES LUS F TOBON SAS",
        "CityNameCliente": "BOGOTÁ, D.C.",
        "PostalZone": "111611",
        "CountrySubentity": "SANTAFE DE BOGOTA",
        "CountrySubentityCode": "11",
        "LineCliente": "KR 30 A # 9 - 75",
        "IdentificationCode": "CO",
        "Name": "Colombia",
        "TaxLevelCode": "O-99",
        "RegimenClient": "05",
        "ContacNameCliente": "nels"
      },
      "msgEmpresa": {
        "schemeAgencyID": "1",
        "schemeAgencyName": "2",
      }
    }
  });

  it('Se captura el error', () => {
    let existError = false;
    try {
      return nationalServ.setClientInformation(undefined, null);
    } catch (error) {
      existError = true;
      expect(error).to.be.instanceOf(Error);
    } finally {
      expect(existError).to.be.eqls(true);
    }
  });

  it('El AccountIdCliente es igual a 2, el campo CompanySchemeName no esta definido ni el CompanySchemeID no esta definido', () => {
    nationalServ.setClientInformation(this.doc, this.data);

    expect(this.doc.getElementsByTagName('cac:PartyIdentification')[0]
      .getElementsByTagName('cbc:ID')[0]
      .getAttribute('schemeName')).to.be.eqls('');

    expect(this.doc.getElementsByTagName('cac:PartyIdentification')[0]
      .getElementsByTagName('cbc:ID')[0]
      .getAttribute('schemeID')).to.be.eqls('');

    expect(this.doc.getElementsByTagName('cac:PartyIdentification')[0]
      .getElementsByTagName('cbc:ID')[0].textContent).to.be.eql('900404985');

  });

  it('El AccountIdCliente es igual a 2 y el campo CompanySchemeName esta definido', () => {
    this.data.msgCliente.CompanySchemeName = "31";
    this.data.msgCliente.CompanySchemeID = "9";

    nationalServ.setClientInformation(this.doc, this.data);

    expect(this.doc.getElementsByTagName('cac:PartyIdentification')[0]
      .getElementsByTagName('cbc:ID')[0]
      .getAttribute('schemeName')).to.be.eqls("31");

    expect(this.doc.getElementsByTagName('cac:PartyIdentification')[0]
      .getElementsByTagName('cbc:ID')[0]
      .getAttribute('schemeID')).to.be.eqls("9");

    expect(this.doc.getElementsByTagName('cac:PartyIdentification')[0]
      .getElementsByTagName('cbc:ID')[0].textContent).to.be.eql('900404985');
  });

  it('El campo CompanySchemeID no se encuentran definidos', () => {
    nationalServ.setClientInformation(this.doc, this.data);
    expect(this.doc.getElementsByTagName('cbc:CompanyID')[0].getAttribute('schemeID')).to.be.eqls('');
  });

  it('El campo CompanySchemeID no se encuentran definidos', () => {
    this.data.msgCliente.CompanySchemeID = "79";
    nationalServ.setClientInformation(this.doc, this.data);
    expect(this.doc.getElementsByTagName('cbc:CompanyID')[0].getAttribute('schemeID')).to.be.eqls('79');
  });

  it('El campo TaxSchemeID no se encuentra definido', () => {
    nationalServ.setClientInformation(this.doc, this.data);
    expect(this.doc.getElementsByTagName('cac:PartyTaxScheme')[0].getElementsByTagName('cac:TaxScheme')[0]).to.be.an('undefined');
  });

  it('El campo TaxSchemeID se encuentra definido', () => {
    this.data.msgCliente.TaxSchemeID = "340";
    this.data.msgCliente.TaxSchemeName = "341";

    nationalServ.setClientInformation(this.doc, this.data);

    expect(this.doc.getElementsByTagName('cac:PartyTaxScheme')[0]
      .getElementsByTagName('cac:TaxScheme')[0].getElementsByTagName('cbc:ID')[0].textContent).to.be.eqls('340');

    expect(this.doc.getElementsByTagName('cac:PartyTaxScheme')[0]
      .getElementsByTagName('cac:TaxScheme')[0].getElementsByTagName('cbc:Name')[0].textContent).to.be.eqls('341');

  });

  it('El campo ElectronicMail no esta definido', () => {
    nationalServ.setClientInformation(this.doc, this.data);
    expect(this.doc.getElementsByTagName('cac:Contact')[0].getElementsByTagName('cbc:ElectronicMail')[0]).to.be.an('undefined');
  });

  it('El campo ElectronicMail esta definido', () => {
    this.data.msgCliente.ElectronicMail = "sincorreo@sincorreo.com";
    nationalServ.setClientInformation(this.doc, this.data);
    expect(this.doc.getElementsByTagName('cac:Contact')[0].getElementsByTagName('cbc:ElectronicMail')[0].textContent).to.be.equals("sincorreo@sincorreo.com");
  });

  it('El campo ContacNameCliente esta definido', () => {
    nationalServ.setClientInformation(this.doc, this.data);
    expect(this.doc.getElementsByTagName('cac:Contact')[0].getElementsByTagName('cbc:Name')[0].textContent).to.be.eqls("nels");
  });
});

describe('Tests en setDiscounts', () => {
  beforeEach(() => {
    this.doc = new DOMParser().parseFromString(
      "<Invoice xmlns='urn:oasis:names:specification:ubl:schema:xsd:Invoice-2' xmlns:cac='urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2' xmlns:cbc='urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2' xmlns:ext='urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2' xmlns:sts='dian:gov:co:facturaelectronica:Structures-2-1' xmlns:xades='http://uri.etsi.org/01903/v1.3.2#' xmlns:xades141='http://uri.etsi.org/01903/v1.4.1#' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='urn:oasis:names:specification:ubl:schema:xsd:Invoice-2     http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd'><cac:InvoiceLine><cbc:ID>1</cbc:ID><cbc:Note>Bienes Cubiertos</cbc:Note><cbc:InvoicedQuantity unitCode='unidad medida-EA'>cantidad-1.000000</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID='COP'>250000.00</cbc:LineExtensionAmount><cac:PricingReference><cac:AlternativeConditionPrice><cbc:PriceAmount currencyID='COP'>200.00</cbc:PriceAmount><cbc:PriceTypeCode>03</cbc:PriceTypeCode></cac:AlternativeConditionPrice></cac:PricingReference><cac:AllowanceCharge><cbc:ID>1</cbc:ID><cbc:ChargeIndicator>false</cbc:ChargeIndicator><cbc:AllowanceChargeReasonCode>11</cbc:AllowanceChargeReasonCode><cbc:AllowanceChargeReason>Discount</cbc:AllowanceChargeReason><cbc:MultiplierFactorNumeric>25.00</cbc:MultiplierFactorNumeric><cbc:Amount currencyID='COP'>50000.00</cbc:Amount><cbc:BaseAmount currencyID='COP'>300000.00</cbc:BaseAmount></cac:AllowanceCharge><cac:TaxTotal><cbc:TaxAmount currencyID='COP'>342000.00</cbc:TaxAmount><cbc:TaxEvidenceIndicator>false</cbc:TaxEvidenceIndicator><cac:TaxSubtotal><cbc:TaxableAmount currencyID='COP'>1800000.00</cbc:TaxableAmount><cbc:TaxAmount currencyID='COP'>342000.00</cbc:TaxAmount><cbc:BaseUnitMeasure unitCode='NIU'>1.000000</cbc:BaseUnitMeasure><cbc:PerUnitAmount currencyID='COP'>30.00</cbc:PerUnitAmount><cac:TaxCategory><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:Item><cbc:Description>Base para TV</cbc:Description><cac:StandardItemIdentification><cbc:ID schemeID='mongo-999'>18937100-7</cbc:ID></cac:StandardItemIdentification><cac:AdditionalItemProperty><cbc:Name /><cbc:Value /></cac:AdditionalItemProperty><cac:InformationContentProviderParty><cac:PowerOfAttorney><cac:AgentParty><cac:PartyIdentification><cbc:ID schemeAgencyID='195' schemeAgencyName='CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)' schemeID='8' schemeName='30'>8600299640</cbc:ID></cac:PartyIdentification></cac:AgentParty></cac:PowerOfAttorney></cac:InformationContentProviderParty></cac:Item><cac:Price><cbc:PriceAmount currencyID='COP'>300000.00</cbc:PriceAmount><cbc:BaseQuantity unitCode='unidad medida EA'>cantidad 1.000000</cbc:BaseQuantity></cac:Price></cac:InvoiceLine></Invoice>"
      , 'text/xml');

    this.data = {
      "InvoiceLine": [
        {
          "IDInvoiceLine": "1",
          "NoteInvoiceLine": "sjdhadifgrhfbcdhugcd",
          "UnitCode": "94",
          "InvoicedQuantity": "1.00",
          "LineExtensionAmount": "58259842.52",
          "PriceAmountReference": "",
          "AllowanceCharge": [],
          "TaxTotal": [
            {
              "TaxAmount": "11069370.08",
              "TaxSubtotal": [
                {
                  "TaxableAmount": "58259842.52",
                  "Percent": "19.00",
                  "IdTax": "01",
                  "NameTax": "IVA",
                  "SubTaxAmount": "11069370.08"
                }
              ]
            },
            {
              "TaxAmount": "4660787.40",
              "TaxSubtotal": [
                {
                  "TaxableAmount": "58259842.52",
                  "Percent": "8.00",
                  "IdTax": "04",
                  "NameTax": "INC",
                  "SubTaxAmount": "4660787.40"
                }
              ]
            }
          ],
          "DescriptionLine": "TL BJ2037 Plta4x4 18 REFULL PT",
          "StandardItemIdentificationID": "7705946238656",
          "AdditionalItemProperty": [
            {
              "Name": "MOTOR",
              "Value": "89444821"
            }
          ],
          "PriceAmount": "58259842.52",
          "BaseQuantity": "1.00",
          "UnitCodePrice": "94"
        }
      ]
    }
  });
  it('Se captura el error', () => {
    let existError = false;
    try {
      return nationalServ.setDiscounts(undefined, null, null, null, null, null);
    } catch (error) {
      existError = true;
      expect(error).to.be.instanceOf(Error);
    } finally {
      expect(existError).to.be.eqls(true);
    }
  });
});

describe('Tests en setvaluesInSubTotal', () => {
  beforeEach(() => {
    this.doc = new DOMParser().parseFromString(
      '<xml xmlns="a" xmlns:c="./lite">\n' +
      '\t<cac:TaxSubtotal>' +
      '\t<cbc:TaxableAmount currencyID="COP">test</cbc:TaxableAmoun>\n' +
      '\t<cbc:TaxAmount currencyID="COP">h</cbc:TaxAmount>\n' +
      '\t<cbc:BaseUnitMeasure unitCode="NIU">h</cbc:BaseUnitMeasure>\n' +
      '\t<cbc:PerUnitAmount currencyID="COP">h</cbc:PerUnitAmount>\n' +
      '\t<cac:TaxCategory>\n' +
      '\t<cac:TaxScheme>\n' +
      '\t<cbc:ID>h</cbc:ID>\n' +
      '\t<cbc:Name>h</cbc:Name>\n' +
      '\t</cac:TaxScheme>\n' +
      '\t</cac:TaxCategory>\n' +
      '\t</cac:TaxSubtotal>\n' +
      '</xml>'
      , 'text/xml');
    this.data = [
      {
        "TaxableAmount": "58259842.52",
        "Percent": "19.00",
        "IdTax": "01",
        "NameTax": "IVA",
        "SubTaxAmount": "11069370.08"
      }
    ]
  })

  it('El campo BaseUnitMeasure no viene definido', () => {
    nationalServ.setvaluesInSubTotal(this.doc, this.data, "COP");
    expect(this.doc.getElementsByTagName('cbc:BaseUnitMeasure')[0]).to.be.an('undefined')
  });

  it('Se captura el error', () => {
    let existError = false;
    try {
      return nationalServ.setvaluesInSubTotal(undefined, this.data, "COP");
    } catch (error) {
      existError = true;
      expect(error).to.be.instanceOf(Error);
    } finally {
      expect(existError).to.be.eqls(true);
    }
  });

  it('El campo BaseUnitMeasure viene definido', () => {
    this.data[0].BaseUnitMeasure = 500;
    this.data[0].UnitCode = "X";

    nationalServ.setvaluesInSubTotal(this.doc, this.data, "COP");
    expect(this.doc.getElementsByTagName('cbc:BaseUnitMeasure')[0].textContent).to.be.eqls('500');
    expect(this.doc.getElementsByTagName('cbc:BaseUnitMeasure')[0].getAttribute('unitCode')).to.be.eqls("X");
  });

  it('El campo PerUnitAmount no viene definido', () => {
    nationalServ.setvaluesInSubTotal(this.doc, this.data, "COP");
    expect(this.doc.getElementsByTagName('cbc:PerUnitAmount')[0]).to.be.an('undefined')
  });

  it('El campo PerUnitAmount viene definido', () => {
    this.data[0].PerUnitAmount = 51.2;

    nationalServ.setvaluesInSubTotal(this.doc, this.data, "EU");
    expect(this.doc.getElementsByTagName('cbc:PerUnitAmount')[0].textContent).to.be.eqls('51.2');
    expect(this.doc.getElementsByTagName('cbc:PerUnitAmount')[0].getAttribute('currencyID')).to.be.eqls("EU");
  });
});

describe('Test en setTaxSubTotal', () => {
  beforeEach(() => {
    this.doc = new DOMParser().parseFromString(
      "<xml><cac:TaxTotal><cbc:TaxAmount currencyID='COP'>342000.00</cbc:TaxAmount><cbc:TaxEvidenceIndicator>false</cbc:TaxEvidenceIndicator><cac:TaxSubtotal><cbc:TaxableAmount currencyID='COP'>1800000.00</cbc:TaxableAmount><cbc:TaxAmount currencyID='COP'>342000.00</cbc:TaxAmount><cbc:BaseUnitMeasure unitCode='NIU'>1.000000</cbc:BaseUnitMeasure><cbc:PerUnitAmount currencyID='COP'>30.00</cbc:PerUnitAmount><cac:TaxCategory><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal></xml>"
      , 'text/xml');
    this.data = [
      {
        "TaxAmount": "11069370.08",
        "TaxSubtotal": [
          {
            "TaxableAmount": "58259842.52",
            "IdTax": "01",
            "NameTax": "IVA",
            "SubTaxAmount": "11069370.08"
          }
        ]
      }]
  });

  it('Se captura el error', () => {
    let existError = false;
    try {
      return nationalServ.setTaxSubTotal(undefined, undefined, undefined, "COP", undefined);
    } catch (error) {
      existError = true;
      expect(error).to.be.instanceOf(Error);
    } finally {
      expect(existError).to.be.eqls(true);
    }
  });

  it('El campo de porcentaje no esta definido', () => {
    nationalServ.setTaxSubTotal(this.doc.getElementsByTagName('cac:TaxSubtotal')[0], this.doc.getElementsByTagName('cac:TaxTotal')[0], this.data[0].TaxSubtotal, "COP", this.doc);
    expect(this.doc.getElementsByTagName('cbc:Percent')[0]).to.be.an('undefined')
  });

  it('El campo de porcentaje no esta definido', () => {
    this.data[0].TaxSubtotal[0].Percent = "19.00";
    nationalServ.setTaxSubTotal(this.doc.getElementsByTagName('cac:TaxSubtotal')[0], this.doc.getElementsByTagName('cac:TaxTotal')[0], this.data[0].TaxSubtotal, "COP", this.doc);
    expect(this.doc.getElementsByTagName('cbc:Percent')[0].textContent).to.be.eqls('19.00')

  });
});

describe('Tests en setTaxTotal', () => {
  it('Se captura el error', () => {
    let existError = false;
    try {
      return nationalServ.setTaxTotal(undefined, undefined, undefined, "COP", undefined);
    } catch (error) {
      existError = true;
      expect(error).to.be.instanceOf(Error);
    } finally {
      expect(existError).to.be.eqls(true);
    }
  });
});

describe('Tests en setTypeLine', () => {
  it('El tipo es 1 o 2', () => {
    const rs = nationalServ.setTypeLine(1);
    expect(rs).to.be.eqls('cac:InvoiceLine');
  });

  it('El tipo es 1 o 2', () => {
    const rs = nationalServ.setTypeLine(2);
    expect(rs).to.be.eqls('cac:InvoiceLine');
  });

  it('El tipo es 3', () => {
    const rs = nationalServ.setTypeLine(3);
    expect(rs).to.be.eqls('cac:CreditNoteLine');
  });

  it('El tipo es 4', () => {
    const rs = nationalServ.setTypeLine(4);
    expect(rs).to.be.eqls('cac:DebitNoteLine');
  });
});

describe('Tests en setLineQuantity', () => {
  it('El tipo es 1 o 2', () => {
    const rs = nationalServ.setLineQuantity(1);
    expect(rs).to.be.eqls('cbc:InvoicedQuantity');
  });

  it('El tipo es 1 o 2', () => {
    const rs = nationalServ.setLineQuantity(2);
    expect(rs).to.be.eqls('cbc:InvoicedQuantity');
  });

  it('El tipo es 3', () => {
    const rs = nationalServ.setLineQuantity(3);
    expect(rs).to.be.eqls('cbc:CreditedQuantity');
  });

  it('El tipo es 4', () => {
    const rs = nationalServ.setLineQuantity(4);
    expect(rs).to.be.eqls('cbc:DebitedQuantity');
  });
});

describe('Tests setAddress', () => {
  beforeEach(() => {
    this.doc = new DOMParser().parseFromString(
      '<xml xmlns="a" xmlns:c="./lite">\n' +
      '\t<cbc:ID></cbc:ID>' +
      '\t<cbc:CityName>test</cbc:CityName>\n' +
      '\t<cbc:CountrySubentity>h</cbc:CountrySubentity>\n' +
      '\t<cbc:CountrySubentityCode>h</cbc:CountrySubentityCode>\n' +
      '\t<cbc:Line>h</cbc:Line>\n' +
      '\t<cbc:IdentificationCode>h</cbc:IdentificationCode>\n' +
      '\t<cbc:Name>h</cbc:Name>\n' +
      '</xml>'
      , 'text/xml');
    this.data = {
      msgEmpresa: {
        "CityName": "BOGOTÁ, D.C.",
        "CountrySubentity": "Bogotá, D.C.",
        "CountrySubentityCode": "11",
        "ID": "11001",
        "IdentificationCode": "CO",
        "Line": "CLl 11#31A -  42",
        "Name": "Colombia",
        "Nit": "890900943",
        "RegistrationName": "COLOMBIANA DE COMERCIO S.A.",
        "TaxLevelCode": "O-52",
        "TaxScheme": {
          "ID": "01",
          "Name": "IVA"
        },
        "__v": 0,
        "listName": "48",
        "schemeAgencyID": "195",
        "schemeAgencyName": "CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)",
        "schemeID": "1",
        "schemeName": "31",
        "AccountIdEmpresa": "1",
        "PostalZone": "111611"
      },
      languageID: 'es'
    }
  });

  it('Se captura el error', () => {
    let existError = false;
    try {
      return nationalServ.setAddress(undefined, {});
    } catch (error) {
      existError = true;
      expect(error).to.be.instanceOf(Error);
    } finally {
      expect(existError).to.be.eqls(true);
    }
  });

  it('No se suminstra datos', () => {
    nationalServ.setAddress(this.doc, { msgEmpresa: {} });
    expect(this.doc.getElementsByTagName('cbc:IdentificationCode')[0].textContent).to.be.eqls('');
    expect(this.doc.getElementsByTagName('cbc:Name')[0].textContent).to.be.eqls('');
    expect(this.doc.getElementsByTagName('cbc:Name')[0].getAttribute('languageID')).to.be.eqls('undefined');
  });

  it('Se suministran datos', () => {
    nationalServ.setAddress(this.doc, this.data);
    expect(this.doc.getElementsByTagName('cbc:IdentificationCode')[0].textContent).to.be.eqls('CO');
    expect(this.doc.getElementsByTagName('cbc:Name')[0].textContent).to.be.eqls('Colombia');
    expect(this.doc.getElementsByTagName('cbc:Name')[0].getAttribute('languageID')).to.be.eqls('es');
  });
});

describe('Tests en setCompanyInfo', function () {
  beforeEach(() => {
    this.doc = new DOMParser().parseFromString(
      "<cac:AccountingSupplierParty><cbc:AdditionalAccountID schemeAgencyID='195'>1</cbc:AdditionalAccountID><cac:Party><cac:PartyName><cbc:Name>COLOMBIANA DE COMERCIO S.A.</cbc:Name></cac:PartyName><cac:PhysicalLocation><cac:Address><cbc:ID>11001</cbc:ID><cbc:CityName>BOGOTÁ, D.C.</cbc:CityName><cbc:PostalZone /><cbc:CountrySubentity>Bogotá, D.C.</cbc:CountrySubentity><cbc:CountrySubentityCode>11</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CLl 11#31A - 42</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name>Colombia</cbc:Name></cac:Country></cac:Address></cac:PhysicalLocation><cac:PartyTaxScheme><cbc:RegistrationName>COLOMBIANA DE COMERCIO S.A.</cbc:RegistrationName><cbc:CompanyID schemeAgencyID='195' schemeAgencyName='CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)' schemeID='1' schemeName='31'>890900943</cbc:CompanyID><cbc:TaxLevelCode listName='05'>O-99</cbc:TaxLevelCode><cac:RegistrationAddress><cbc:ID>11001</cbc:ID><cbc:CityName>BOGOTÁ, D.C.</cbc:CityName><cbc:PostalZone /><cbc:CountrySubentity>Bogotá, D.C.</cbc:CountrySubentity><cbc:CountrySubentityCode>11</cbc:CountrySubentityCode><cac:AddressLine><cbc:Line>CLl 11#31A - 42</cbc:Line></cac:AddressLine><cac:Country><cbc:IdentificationCode>CO</cbc:IdentificationCode><cbc:Name>Colombia</cbc:Name></cac:Country></cac:RegistrationAddress><cac:TaxScheme><cbc:ID>01</cbc:ID><cbc:Name>IVA</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>COLOMBIANA DE COMERCIO S.A.</cbc:RegistrationName><cbc:CompanyID schemeAgencyID='195' schemeAgencyName='CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)' schemeID='1' schemeName='31'>890900943</cbc:CompanyID><cac:CorporateRegistrationScheme><cbc:ID>BC</cbc:ID></cac:CorporateRegistrationScheme></cac:PartyLegalEntity><cac:Contact><cbc:Name>Eric Valencia</cbc:Name><cbc:ElectronicMail>eric.valencia@ket.co</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingSupplierParty>"
      , 'text/xml');

    this.data = {
      msgEmpresa: {
        "CityName": "BOGOTÁ, D.C.",
        "CountrySubentity": "Bogotá, D.C.",
        "CountrySubentityCode": "11",
        "ID": "11001",
        "IdentificationCode": "CO",
        "Line": "CLl 11#31A -  42",
        "Name": "Colombia",
        "Nit": "890900943",
        "RegistrationName": "COLOMBIANA DE COMERCIO S.A.",
        "TaxLevelCode": "O-52",
        "TaxScheme": {
          "ID": "01",
          "Name": "IVA"
        },
        "__v": 0,
        "listName": "48",
        "schemeAgencyID": "195",
        "schemeAgencyName": "CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)",
        "schemeID": "1",
        "schemeName": "31",
        "AccountIdEmpresa": "1",
        "PostalZone": "111611"
      },
      languageID: 'es'
    }
  });

  it('Se captura el error', () => {
    let existError = false;
    try {
      return nationalServ.setCompanyInfo(undefined, {});
    } catch (error) {
      existError = true;
      expect(error).to.be.instanceOf(Error);
    } finally {
      expect(existError).to.be.eqls(true);
    }
  });
})
