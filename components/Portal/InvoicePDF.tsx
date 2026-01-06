
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { InvoiceDetails } from '../../types';

// Standard PDF fonts: Helvetica (Sans) and Times-Roman (Serif)
// STRICT COLOR RULE: #000000 for everything except Logo.

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#000000', // Global black
  },
  // --- Header ---
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
    fontFamily: 'Times-Bold', 
    letterSpacing: 2,
    color: '#A6192E', // ONLY EXCEPTION: Brand Red
    textTransform: 'uppercase',
  },
  logoAmp: {
    fontSize: 14,
    fontFamily: 'Times-Roman',
    color: '#A6192E', // ONLY EXCEPTION: Brand Red
    marginHorizontal: 5,
  },
  companyDetails: {
    textAlign: 'right',
    fontSize: 9,
    color: '#000000', // Black
  },
  companyNameBold: {
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  // --- Metadata Section ---
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  metaColumn: {
    flexDirection: 'column',
    width: '48%',
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  metaLabel: {
    width: 90,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#000000',
  },
  metaValue: {
    flex: 1,
    fontSize: 10,
    color: '#000000',
  },
  addressLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#000000',
    marginBottom: 2,
    marginTop: 10,
  },
  addressValue: {
    fontSize: 10,
    color: '#000000',
    textTransform: 'uppercase',
    marginBottom: 20,
  },

  // --- Payment Receipt Box ---
  paymentBox: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  paymentItem: {
    flexDirection: 'column',
  },
  paymentLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#000000',
    marginBottom: 2,
  },
  paymentVal: {
    fontSize: 10,
    color: '#000000',
  },

  // --- Table ---
  tableContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderTopWidth: 2, // Thick top line
    borderBottomWidth: 2, // Thick bottom line
    borderTopColor: '#000000',
    borderBottomColor: '#000000',
    paddingVertical: 8,
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5, // Thin separator line
    borderBottomColor: '#000000',
  },
  colNo: {
    width: '10%',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#000000',
  },
  colDesc: {
    width: '65%',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#000000',
  },
  colAmount: {
    width: '25%',
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#000000',
  },
  colAmountVal: {
    width: '25%',
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#000000',
  },

  // --- Total Section ---
  totalSection: {
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2, // Thick line below total
    borderBottomColor: '#000000',
    paddingVertical: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    textAlign: 'right',
    flex: 1,
    paddingRight: 20,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    textAlign: 'right',
    width: '25%', // Matches colAmount width
  },

  // --- Words Section ---
  amountWordsSection: {
    marginTop: 20,
    marginBottom: 40,
    borderBottomWidth: 1.5,
    borderBottomColor: '#000000',
    paddingBottom: 10,
  },
  amountWords: {
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    fontSize: 10,
    color: '#000000',
  },

  // --- Terms ---
  termsContainer: {
    marginBottom: 20,
  },
  termsTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#000000',
    marginBottom: 8,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  termBullet: {
    width: 15,
    fontSize: 9,
    color: '#000000',
  },
  termText: {
    flex: 1,
    fontSize: 9,
    color: '#000000',
  },

  // --- Signature ---
  signatureContainer: {
    marginTop: 40,
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  signText: {
    fontFamily: 'Times-Italic',
    fontSize: 9,
    color: '#000000',
    marginBottom: 30,
  },
  signAuth: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#000000',
  }
});

interface InvoicePDFProps {
  data: InvoiceDetails;
  type?: 'invoice' | 'receipt';
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ data, type = 'invoice' }) => {
  // STRICTLY use the 'type' prop to decide layout. 
  // This allows printing an original invoice even if payment is already recorded.
  const isReceipt = type === 'receipt';
  
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
        <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#000000', paddingBottom: 5 }}>
           <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 14, textTransform: 'uppercase' }}>
              {isReceipt ? 'PAYMENT RECEIPT' : 'PROFESSIONAL FEE INVOICE'}
           </Text>
        </View>

        {/* Receipt Details Box */}
        {isReceipt && data.payment && (
           <View style={styles.paymentBox}>
              <View style={styles.paymentItem}>
                 <Text style={styles.paymentLabel}>Receipt No</Text>
                 <Text style={styles.paymentVal}>RCP-{data.invoiceNo}</Text>
              </View>
              <View style={styles.paymentItem}>
                 <Text style={styles.paymentLabel}>Date</Text>
                 <Text style={styles.paymentVal}>{new Date(data.payment.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.paymentItem}>
                 <Text style={styles.paymentLabel}>Mode</Text>
                 <Text style={styles.paymentVal}>{data.payment.mode}</Text>
              </View>
              <View style={styles.paymentItem}>
                 <Text style={styles.paymentLabel}>Ref No</Text>
                 <Text style={styles.paymentVal}>{data.payment.transactionReference}</Text>
              </View>
           </View>
        )}

        {/* Info Grid */}
        <View style={styles.gridContainer}>
           <View style={styles.metaColumn}>
              <View style={styles.metaRow}>
                 <Text style={styles.metaLabel}>Invoice No.</Text>
                 <Text style={styles.metaValue}>:  {data.invoiceNo}</Text>
              </View>
              <View style={styles.metaRow}>
                 <Text style={styles.metaLabel}>Client Name</Text>
                 <Text style={styles.metaValue}>:  {data.clientName}</Text>
              </View>
              <Text style={styles.addressLabel}>Billing Address:</Text>
              <Text style={styles.addressValue}>{data.clientAddress}</Text>
           </View>

           <View style={styles.metaColumn}>
              <View style={styles.metaRow}>
                 <Text style={styles.metaLabel}>Invoice Date</Text>
                 <Text style={styles.metaValue}>:  {new Date(data.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</Text>
              </View>
              <View style={styles.metaRow}>
                 <Text style={styles.metaLabel}>Kind Attn.</Text>
                 <Text style={styles.metaValue}>:  {data.kindAttn}</Text>
              </View>
           </View>
        </View>

        {/* Receipt Acknowledgement Text */}
        {isReceipt && (
           <Text style={{ fontFamily: 'Times-Italic', fontSize: 10, marginBottom: 20 }}>
              Received with thanks from {data.clientName} a sum of INR {data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} towards full and final settlement.
           </Text>
        )}

        {/* Main Table */}
        <View style={styles.tableContainer}>
           <View style={styles.tableHeader}>
              <Text style={styles.colNo}>S.No.</Text>
              <Text style={styles.colDesc}>Particulars</Text>
              <Text style={styles.colAmount}>Amount (INR)</Text>
           </View>
           
           {data.items.map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                 <Text style={styles.colNo}>{idx + 1}.</Text>
                 <Text style={styles.colDesc}>{item.description}</Text>
                 <Text style={styles.colAmountVal}>{item.amount.toFixed(0)}</Text>
              </View>
           ))}
        </View>

        {/* Total Section with Lines */}
        <View style={styles.totalSection}>
           <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>{isReceipt ? 'Amount Received' : 'Gross Amount'}</Text>
              <Text style={styles.totalValue}>{data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
           </View>
        </View>

        {/* Amount in Words */}
        <View style={styles.amountWordsSection}>
           <Text style={styles.amountWords}>RUPEES {data.amountInWords}</Text>
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
           <Text style={styles.termsTitle}>{isReceipt ? 'PAYMENT ACKNOWLEDGEMENT' : 'TERMS AND CONDITIONS'}</Text>
           {isReceipt ? (
              <Text style={{ fontSize: 9 }}>
                 This receipt is computer generated and valid without signature. The payment has been credited to AK Pandey & Associates.
              </Text>
           ) : (
              data.terms.map((term, i) => (
                 <View key={i} style={styles.termItem}>
                    <Text style={styles.termBullet}>{String.fromCharCode(97 + i)})</Text>
                    <Text style={styles.termText}>{term}</Text>
                 </View>
              ))
           )}
        </View>

        {/* Signature - ONLY FOR INVOICES */}
        {!isReceipt && (
           <View style={styles.signatureContainer}>
              <Text style={styles.signText}>This document is digitally signed</Text>
              <Text style={styles.signAuth}>FOR AK PANDEY & ASSOCIATES</Text>
              <Text style={{ fontSize: 9, color: '#64748B', marginTop: 2 }}>Authorized Signatory</Text>
           </View>
        )}

      </Page>
    </Document>
  );
};
