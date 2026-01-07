import { Page, Text, View, Document, StyleSheet, Image, Svg, Path } from '@react-pdf/renderer';
import { InvoiceDetails } from '../../types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingTop: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.4,
    color: '#000000',
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '15%',
    fontSize: 100,
    fontFamily: 'Helvetica-Bold',
    color: '#FF0000',
    opacity: 0.1,
    transform: 'rotate(-45deg)',
    borderWidth: 5,
    borderColor: '#FF0000',
    padding: 20,
    textTransform: 'uppercase'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logoMain: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold', 
    letterSpacing: 2.5,
    color: '#A6192E',
    textTransform: 'uppercase',
  },
  logoAmp: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#A6192E',
    marginHorizontal: 4,
    marginTop: 2,
  },
  companyDetails: {
    textAlign: 'right',
    fontSize: 8,
    color: '#000000',
  },
  statusBoxRevoked: {
    borderWidth: 2,
    borderColor: '#FF0000',
    color: '#FF0000',
    fontFamily: 'Helvetica-Bold',
    padding: 4,
    fontSize: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
    width: 100
  },
  tableHeader: {
    flexDirection: 'row',
    borderTopWidth: 0.7,
    borderBottomWidth: 0.7,
    borderColor: '#000000',
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: '#F9FAFB'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#000000',
  },
  colNo: { width: '8%', fontFamily: 'Helvetica-Bold' },
  colDesc: { width: '67%', fontFamily: 'Helvetica-Bold' },
  colAmount: { width: '25%', textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  qrImage: {
    width: 100,
    height: 100,
    marginTop: 5
  },
  dscStamp: {
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    padding: 5,
    width: 180,
    marginTop: 10
  }
});

interface InvoicePDFProps {
  data: InvoiceDetails;
  type?: 'invoice' | 'receipt';
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ data, type = 'invoice' }) => {
  const isReceipt = type === 'receipt';
  const upiId = "7541076176@ybl";
  const upiString = `upi://pay?pa=${upiId}&pn=AK%20Pandey%20Associates&am=${data.totalAmount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {data.isRevoked && <Text style={styles.watermark}>Canceled</Text>}
        
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.logoMain}>AK PANDEY</Text>
            <Text style={styles.logoAmp}>&</Text>
            <Text style={styles.logoMain}>ASSOCIATES</Text>
          </View>
          <View style={styles.companyDetails}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>AK Pandey & Associates</Text>
            <Text>High Court Chambers, New Delhi</Text>
            <Text>finance@anandpandey.in</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 5, marginBottom: 20 }}>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12 }}>{isReceipt ? 'PAYMENT RECEIPT' : 'PROFESSIONAL FEE INVOICE'}</Text>
          {data.isRevoked && <Text style={styles.statusBoxRevoked}>Canceled</Text>}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ width: '50%' }}>
            <Text>Invoice No: {data.invoiceNo}</Text>
            <Text>Client: {data.clientName}</Text>
            <Text>Address: {data.clientAddress}</Text>
          </View>
          <View style={{ width: '40%', textAlign: 'right' }}>
            <Text>Date: {new Date(data.date).toLocaleDateString('en-GB')}</Text>
            <Text>Attn: {data.kindAttn}</Text>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colNo}>S.No.</Text>
          <Text style={styles.colDesc}>Particulars</Text>
          <Text style={styles.colAmount}>Amount (INR)</Text>
        </View>
        
        {data.items.map((item, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.colNo}>{idx + 1}.</Text>
            <View style={{ width: '67%' }}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>{item.description}</Text>
              {item.itemCode && <Text style={{ fontSize: 7, color: '#666' }}>Code: {item.itemCode}</Text>}
            </View>
            <Text style={styles.colAmount}>{Number(item.amount).toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.totalContainer}>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 11 }}>TOTAL AMOUNT</Text>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 11 }}>INR {data.totalAmount.toLocaleString('en-IN')}</Text>
        </View>

        <Text style={{ fontFamily: 'Helvetica-Bold', marginTop: 10 }}>RUPEES {data.amountInWords}</Text>

        {/* Fix: Replaced undefined variable 'mode' with the destructured 'type' prop */}
        {!data.isRevoked && type === 'invoice' && (
          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <View style={{ width: '60%' }}>
              <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8 }}>TERMS:</Text>
              {data.terms.map((t, i) => <Text key={i} style={{ fontSize: 7 }}>- {t}</Text>)}
            </View>
            <View style={{ width: '40%', alignItems: 'center' }}>
              <Image src={qrUrl} style={styles.qrImage} />
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold' }}>SCAN TO PAY</Text>
            </View>
          </View>
        )}

        <View style={{ marginTop: 40 }}>
          {data.digitalSignature && (
            <View style={styles.dscStamp}>
              <Text style={{ fontFamily: 'Helvetica-Bold', color: '#008000' }}>Signature valid</Text>
              <Text style={{ fontSize: 7 }}>Digitally signed by {data.digitalSignature.signatoryName}</Text>
              <Text style={{ fontSize: 7 }}>Date: {new Date(data.digitalSignature.timestamp).toLocaleString()}</Text>
            </View>
          )}
          <Text style={{ fontFamily: 'Helvetica-Bold', marginTop: 10 }}>FOR AK PANDEY & ASSOCIATES</Text>
          <Text style={{ fontSize: 8 }}>Authorized Signatory</Text>
        </View>
      </Page>
    </Document>
  );
};