
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { InvoiceDetails } from '../../types';

// Register a standard font to ensure consistent rendering
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Oblique.ttf', fontStyle: 'italic' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#000000',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'column',
  },
  logoTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  logoMain: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 3,
    color: '#A6192E',
    textTransform: 'uppercase',
  },
  logoAmp: {
    fontSize: 14,
    color: '#A6192E',
    marginHorizontal: 5,
  },
  companyDetails: {
    textAlign: 'right',
    fontSize: 9,
    color: '#475569', // slate-600
  },
  companyNameBold: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  titleContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#000000',
    paddingBottom: 8,
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  receiptStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#15803d', // green-700
    borderWidth: 1,
    borderColor: '#15803d',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  
  // New Payment Details Box for Receipt
  paymentBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentItem: {
    flexDirection: 'column',
  },
  paymentLabel: {
    fontSize: 8,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
    fontWeight: 'bold'
  },
  paymentValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000',
  },

  detailsGrid: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 40,
  },
  column: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 80,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addressLabel: {
    width: 80,
    fontWeight: 'bold',
  },
  addressValue: {
    flex: 1,
    textTransform: 'uppercase',
  },
  
  receiptAckText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#475569',
    marginBottom: 20,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#E2E8F0',
  },
  boldInline: {
    fontWeight: 'bold',
    color: '#000000',
    fontStyle: 'normal'
  },

  table: {
    width: '100%',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderTopColor: '#000000',
    borderBottomColor: '#000000',
    paddingVertical: 6,
    marginBottom: 0,
    backgroundColor: '#F8FAFC'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
  },
  colNo: {
    width: '10%',
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  colDesc: {
    width: '70%',
    fontWeight: 'bold',
  },
  colAmount: {
    width: '20%',
    textAlign: 'right',
    fontWeight: 'bold',
    paddingRight: 5,
  },
  colAmountVal: {
    width: '20%',
    textAlign: 'right',
    paddingRight: 5,
  },
  tableFooterLine: {
    borderTopWidth: 1.5,
    borderTopColor: '#000000',
    marginTop: 0,
    marginBottom: 20,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  totalContainer: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  amountWordsSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 15,
    marginBottom: 30,
  },
  amountWords: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 10,
  },
  termsSection: {
    fontSize: 8,
    color: '#334155', // slate-700
    marginBottom: 40,
  },
  termsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000000',
    marginBottom: 5,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  termBullet: {
    width: 15,
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrImage: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 2,
    marginBottom: 5,
  },
  qrText: {
    fontSize: 6,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#94A3B8',
  },
  signatureContainer: {
    textAlign: 'right',
  },
  signText: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#64748B',
    marginBottom: 30,
  },
  signCompany: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000000',
  },
  signAuth: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
  },
  pageFooter: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 6,
    color: '#94A3B8',
  }
});

interface InvoicePDFProps {
  data: InvoiceDetails;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ data }) => {
  // Determine mode based on payment existence
  const isReceipt = !!data.payment;
  
  const securePayload = btoa(`AKP_${isReceipt ? 'RECEIPT' : 'INVOICE'}_V1::${data.invoiceNo}::${data.totalAmount}::${data.clientName}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${securePayload}&bgcolor=ffffff`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logoTextRow}>
              <Text style={styles.logoMain}>AK PANDEY</Text>
              <Text style={styles.logoAmp}>&</Text>
              <Text style={styles.logoMain}>ASSOCIATES</Text>
            </View>
          </View>
          <View style={styles.companyDetails}>
            <Text style={styles.companyNameBold}>AK Pandey & Associates</Text>
            <Text>High Court Chambers, Shanti Path</Text>
            <Text>New Delhi, 110001, India</Text>
            <Text>Tel: +91 11 2345 6789</Text>
            <Text>Email: finance@anandpandey.in</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{isReceipt ? 'PAYMENT RECEIPT' : 'PROFESSIONAL FEE INVOICE'}</Text>
          {isReceipt && <Text style={styles.receiptStatus}>PAID IN FULL</Text>}
        </View>

        {/* Receipt Specific Payment Box */}
        {isReceipt && data.payment && (
           <View style={styles.paymentBox}>
              <View style={styles.paymentItem}>
                 <Text style={styles.paymentLabel}>Receipt No</Text>
                 <Text style={styles.paymentValue}>RCP-{data.invoiceNo}</Text>
              </View>
              <View style={styles.paymentItem}>
                 <Text style={styles.paymentLabel}>Date Paid</Text>
                 <Text style={styles.paymentValue}>{new Date(data.payment.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.paymentItem}>
                 <Text style={styles.paymentLabel}>Mode</Text>
                 <Text style={styles.paymentValue}>{data.payment.mode}</Text>
              </View>
              <View style={styles.paymentItem}>
                 <Text style={styles.paymentLabel}>Reference</Text>
                 <Text style={styles.paymentValue}>{data.payment.transactionReference || 'N/A'}</Text>
              </View>
           </View>
        )}

        {/* Details Grid (Compact Metadata) */}
        <View style={styles.detailsGrid}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.label}>Invoice No.</Text>
              <Text style={styles.value}>:  {data.invoiceNo}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Kind Attn.</Text>
              <Text style={styles.value}>:  {data.kindAttn}</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.label}>Invoice Date</Text>
              <Text style={styles.value}>:  {new Date(data.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Client Name</Text>
              <Text style={styles.value}>:  {data.clientName}</Text>
            </View>
          </View>
        </View>

        {/* Address Row (Full Width for Proper Alignment) */}
        <View style={styles.addressRow}>
           <Text style={styles.addressLabel}>Address</Text>
           <Text style={styles.addressValue}>:  {data.clientAddress}</Text>
        </View>

        {isReceipt && (
           <Text style={styles.receiptAckText}>
              Received with thanks from <Text style={styles.boldInline}>{data.clientName}</Text> a sum of <Text style={styles.boldInline}>INR {data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text> towards the full and final settlement of Invoice No. {data.invoiceNo}.
           </Text>
        )}

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colNo}>S.No.</Text>
            <Text style={styles.colDesc}>Particulars</Text>
            <Text style={styles.colAmount}>Amount (INR)</Text>
          </View>
          {data.items.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.colNo}>{idx + 1}.</Text>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colAmountVal}>{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
          ))}
        </View>
        <View style={styles.tableFooterLine} />

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>{isReceipt ? 'Amount Received' : 'Gross Amount'}</Text>
            <Text style={styles.totalValue}>{data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          </View>
        </View>

        {/* Amount Words */}
        <View style={styles.amountWordsSection}>
          <Text style={styles.amountWords}>RUPEES {data.amountInWords}</Text>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          {isReceipt ? (
             <View>
                <Text style={styles.termsTitle}>Payment Acknowledgement</Text>
                <Text>This is a computer generated receipt. The payment has been credited to the account of AK Pandey & Associates. Subject to realization of Cheques/Drafts.</Text>
             </View>
          ) : (
             <View>
                <Text style={styles.termsTitle}>Terms and Conditions</Text>
                {data.terms.map((term, i) => (
                  <View key={i} style={styles.termItem}>
                    <Text style={styles.termBullet}>{String.fromCharCode(97 + i)})</Text>
                    <Text style={{ flex: 1 }}>{term}</Text>
                  </View>
                ))}
             </View>
          )}
        </View>

        {/* Footer Signatures */}
        <View style={styles.footerSection}>
          <View style={styles.qrContainer}>
             <Image src={qrUrl} style={styles.qrImage} />
             <Text style={styles.qrText}>Secure Verification ID</Text>
          </View>
          <View style={styles.signatureContainer}>
             <Text style={styles.signText}>This document is digitally signed</Text>
             <Text style={styles.signCompany}>For AK Pandey & Associates</Text>
             <Text style={styles.signAuth}>Authorized Signatory</Text>
          </View>
        </View>

        {/* Fixed Footer */}
        <Text style={styles.pageFooter}>
           Computer Generated {isReceipt ? 'Receipt' : 'Invoice'} • {data.invoiceNo} • Page 1 of 1
        </Text>

      </Page>
    </Document>
  );
};
