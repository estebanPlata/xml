// Libraries
const chai = require('chai');
const expect = chai.expect;
// Imports
const debtServ = require('../api/services/debit_note.service');
const DOMParser = require('xmldom').DOMParser;

describe('Tests en Debit Invoice Service', () => {
    describe('Test en setXMLHeader', function () {
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
                return debtServ.setXMLHeader(undefined, null);
            } catch (error) {
                existError = true;
                expect(error).to.be.instanceOf(Error);
            } finally {
                expect(existError).to.be.eqls(true);
            }
        });

        it('No se suministran valores', () => {
            debtServ.setXMLHeader(this.doc, {});
            expect(this.doc.getElementsByTagName('cbc:ID')[0].textContent).to.be.equal('');
            expect(this.doc.getElementsByTagName('cbc:LineCountNumeric')[0].textContent).to.be.equal('');
        });

        it('Se suministran valores', () => {
            debtServ.setXMLHeader(this.doc, this.data);
            expect(this.doc.getElementsByTagName('cbc:ID')[0].textContent).to.be.equal('1223456');
            expect(this.doc.getElementsByTagName('cbc:ProfileID')[0].textContent).to.be.equal('1');
        })
    });
});