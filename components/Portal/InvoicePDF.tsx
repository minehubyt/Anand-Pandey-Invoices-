
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { InvoiceDetails } from '../../types';

// Standard PDF fonts: Helvetica (Sans) matches the Portal's "Inter/Sans" look better than Times.
// COLOR RULE: #000000 for everything. #A6192E for Logo.

const styles = StyleSheet.create({
  page: {
    padding: 30, // Reduced padding to ensure fit
    paddingTop: 40,
    fontFamily: 'Helvetica',
    fontSize: 9, // Slightly reduced base font size
    lineHeight: 1.4,
    color: '#000000', // Pure Black
  },
  // --- Header ---
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'column',
  },
  logoTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  // MATCHING PORTAL LOGO EXACTLY: Sans-Serif (Helvetica-Bold), Red, Wide Spacing
  logoMain: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold', 
    letterSpacing: 2.5,
    color: '#A6192E', // Brand Red
    textTransform: 'uppercase',
  },
  logoAmp: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#A6192E', // Brand Red
    marginHorizontal: 4,
    marginTop: 2,
  },
  companyDetails: {
    textAlign: 'right',
    fontSize: 8,
    color: '#000000',
  },
  companyNameBold: {
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  // --- Metadata Section ---
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaColumn: {
    flexDirection: 'column',
    width: '48%',
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaLabel: {
    width: 80,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#000000',
  },
  metaValue: {
    flex: 1,
    fontSize: 9,
    color: '#000000',
  },
  addressLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#000000',
    marginBottom: 2,
    marginTop: 8,
  },
  addressValue: {
    fontSize: 9,
    color: '#000000',
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  // --- Payment Receipt Box ---
  paymentBox: {
    borderWidth: 0.5, // Thinner
    borderColor: '#000000',
    padding: 8,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  paymentItem: {
    flexDirection: 'column',
  },
  paymentLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#000000',
    marginBottom: 2,
  },
  paymentVal: {
    fontSize: 9,
    color: '#000000',
  },

  // --- Table ---
  tableContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderTopWidth: 0.7, // Thinner lines
    borderBottomWidth: 0.7, // Thinner lines
    borderTopColor: '#000000',
    borderBottomColor: '#000000',
    paddingVertical: 6,
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
  },
  colNo: {
    width: '8%',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#000000',
  },
  colDesc: {
    width: '67%',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#000000',
  },
  colAmount: {
    width: '25%',
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#000000',
  },
  colAmountVal: {
    width: '25%',
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
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
    borderBottomWidth: 1, // Single line instead of double thickness
    borderBottomColor: '#000000',
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    textAlign: 'right',
    flex: 1,
    paddingRight: 20,
    textTransform: 'uppercase'
  },
  totalValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    textAlign: 'right',
    width: '25%', 
  },

  // --- Words Section ---
  amountWordsSection: {
    marginTop: 15,
    marginBottom: 20, 
    borderBottomWidth: 0.7, // Thinner
    borderBottomColor: '#000000',
    paddingBottom: 8,
  },
  amountWords: {
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    fontSize: 9,
    color: '#000000',
  },

  // --- Terms & QR Combined Section ---
  termsAndQrContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 10, 
    minHeight: 100, // Ensure space reserved
  },
  termsColumn: {
    width: '55%',
  },
  qrColumn: {
    width: '40%',
    alignItems: 'center',
    paddingTop: 5,
  },
  termsTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#000000',
    marginBottom: 6,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  termBullet: {
    width: 12,
    fontSize: 8,
    color: '#000000',
  },
  termText: {
    flex: 1,
    fontSize: 8,
    color: '#000000',
  },
  termTextBold: {
    flex: 1,
    fontSize: 8,
    color: '#000000',
    fontFamily: 'Helvetica-Bold',
  },

  // --- QR Specifics ---
  qrImage: {
    width: 110, // Slightly smaller to fit better if needed
    height: 110,
    marginBottom: 4,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
  },
  qrLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#000000',
    marginTop: 4,
  },
  qrSubLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica',
    color: '#666666',
    marginTop: 2,
  },

  // --- Signature ---
  footerSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start', // Signature on LEFT
    alignItems: 'flex-start',
  },
  signatureContainer: {
    textAlign: 'left', // Align Left
    marginTop: 10,
    minWidth: 200,
  },
  signImage: {
    height: 40,
    width: 120,
    objectFit: 'contain',
    marginBottom: 5,
    marginLeft: -10 
  },
  dscBox: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 8,
    marginTop: 5,
    marginBottom: 10,
    width: 180,
  },
  dscRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  dscText: {
    fontSize: 7,
    fontFamily: 'Helvetica',
    color: '#000000',
  },
  dscBold: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
  },
  signAuth: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    textTransform: 'uppercase',
    color: '#000000',
  }
});

interface InvoicePDFProps {
  data: InvoiceDetails;
  type?: 'invoice' | 'receipt';
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ data, type = 'invoice' }) => {
  const isReceipt = type === 'receipt';
  
  // UPI PAYMENT QR LOGIC
  const upiId = "7541076176@ybl";
  const payeeName = "AK Pandey Associates";
  const note = `Inv ${data.invoiceNo}`;
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${Number(data.totalAmount).toFixed(2)}&tn=${encodeURIComponent(note)}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encodeURIComponent(upiString)}&bgcolor=ffffff`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header - Portal Logo Replica */}
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

        {/* Title Block */}
        <View style={{ marginBottom: 15, borderBottomWidth: 0.7, borderBottomColor: '#000000', paddingBottom: 4 }}>
           <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12, textTransform: 'uppercase', color: '#000000' }}>
              {isReceipt ? 'PAYMENT RECEIPT' : 'PROFESSIONAL FEE INVOICE'}
           </Text>
        </View>

        {/* Receipt Details Box (Only for Receipts) */}
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
           <Text style={{ fontFamily: 'Helvetica-Oblique', fontSize: 9, marginBottom: 15, color: '#000000' }}>
              Received with thanks from {data.clientName} a sum of INR {Number(data.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} towards full and final settlement.
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
                 <Text style={styles.colAmountVal}>{Number(item.amount).toFixed(2)}</Text>
              </View>
           ))}
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
           <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>{isReceipt ? 'Amount Received' : 'Gross Amount'}</Text>
              <Text style={styles.totalValue}>{Number(data.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
           </View>
        </View>

        {/* Amount in Words */}
        <View style={styles.amountWordsSection}>
           <Text style={styles.amountWords}>RUPEES {data.amountInWords}</Text>
        </View>

        {/* Terms & QR Code (Side by Side) - Explicit Ordering */}
        <View style={styles.termsAndQrContainer}>
           
           {/* Terms Column */}
           <View style={isReceipt ? {width: '100%'} : styles.termsColumn}>
              <Text style={styles.termsTitle}>{isReceipt ? 'PAYMENT ACKNOWLEDGEMENT' : 'TERMS AND CONDITIONS'}</Text>
              {isReceipt ? (
                 <Text style={{ fontSize: 8, color: '#000000' }}>
                    This receipt is computer generated and valid without signature. The payment has been credited to AK Pandey & Associates.
                 </Text>
              ) : (
                 data.terms.map((term, i) => {
                    // Logic to detect Bank Details string and bold it
                    const isBankDetails = term.toLowerCase().includes('bank details') || term.toLowerCase().includes('ifsc') || term.toLowerCase().includes('account number');
                    return (
                       <View key={i} style={styles.termItem}>
                          <Text style={styles.termBullet}>{String.fromCharCode(97 + i)})</Text>
                          <Text style={isBankDetails ? styles.termTextBold : styles.termText}>{term}</Text>
                       </View>
                    );
                 })
              )}
           </View>

           {/* QR Column - ONLY FOR INVOICES */}
           {!isReceipt && (
               <View style={styles.qrColumn}>
                  <Image style={styles.qrImage} src={qrUrl} />
                  <Text style={styles.qrLabel}>SCAN TO PAY VIA UPI</Text>
                  <Text style={styles.qrSubLabel}>GPay • PhonePe • Paytm</Text>
                  <Text style={{ fontSize: 6, fontFamily: 'Helvetica', color: '#999', marginTop: 1 }}>{upiId}</Text>
               </View>
           )}

        </View>

        {/* Footer Signature Area - Explicitly Below Terms */}
        <View style={styles.footerSection}>
           {/* Signature - ONLY FOR INVOICES */}
           {!isReceipt && (
              <View style={styles.signatureContainer}>
                 
                 {data.digitalSignature ? (
                    <View style={styles.dscBox}>
                       <View style={styles.dscRow}>
                          <Text style={{...styles.dscBold, fontSize: 8}}>DIGITALLY SIGNED BY:</Text>
                       </View>
                       <Text style={{...styles.dscBold, fontSize: 9, marginBottom: 2}}>{data.digitalSignature.signatoryName}</Text>
                       <Text style={styles.dscText}>Date: {new Date(data.digitalSignature.timestamp).toLocaleString()}</Text>
                       <Text style={styles.dscText}>Reason: Authorized Signatory</Text>
                       <Text style={styles.dscText}>Location: New Delhi</Text>
                       <Text style={{...styles.dscText, marginTop: 2, color: '#666'}}>Token: {data.digitalSignature.tokenDevice}</Text>
                    </View>
                 ) : (
                    data.signatureImage && (
                       <Image src={data.signatureImage} style={styles.signImage} />
                    )
                 )}

                 <Text style={styles.signAuth}>FOR AK PANDEY & ASSOCIATES</Text>
                 <Text style={{ fontSize: 9, color: '#000000', marginTop: 2 }}>Authorized Signatory</Text>
              </View>
           )}
        </View>

      </Page>
    </Document>
  );
};
