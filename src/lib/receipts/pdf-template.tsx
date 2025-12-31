import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: '2px solid #10b981',
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 5,
  },
  receiptNumber: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  statusBadge: {
    padding: '4 12',
    borderRadius: 4,
    backgroundColor: '#dcfce7',
    color: '#166534',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 100,
    color: '#666',
  },
  value: {
    flex: 1,
    color: '#333',
  },
  divider: {
    borderBottom: '1px solid #e5e7eb',
    marginVertical: 15,
  },
  paymentBox: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  paymentAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 5,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#999',
    fontSize: 8,
    borderTop: '1px solid #e5e7eb',
    paddingTop: 15,
  },
  itemsTable: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: '8 10',
    borderRadius: 4,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: '6 10',
    borderBottom: '1px solid #f3f4f6',
  },
  colDescription: {
    flex: 3,
  },
  colQty: {
    flex: 1,
    textAlign: 'center',
  },
  colPrice: {
    flex: 1,
    textAlign: 'right',
  },
  colTotal: {
    flex: 1,
    textAlign: 'right',
  },
  totalsSection: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    width: 200,
    marginBottom: 4,
  },
  totalLabel: {
    flex: 1,
    textAlign: 'right',
    paddingRight: 10,
    color: '#666',
  },
  totalValue: {
    width: 80,
    textAlign: 'right',
  },
  grandTotal: {
    fontWeight: 'bold',
    fontSize: 14,
    borderTop: '2px solid #333',
    paddingTop: 5,
    marginTop: 5,
  },
});

interface ReceiptPDFProps {
  receipt: {
    receipt_number: string;
    created_at: string;
    payment: {
      amount: number;
      currency: string;
      method: string;
      date: string;
      payer_name?: string | null;
      payer_email?: string | null;
    };
    invoice?: {
      invoice_number: string;
      issue_date: string;
      due_date?: string | null;
      subtotal: number;
      discount: number;
      tax: number;
      total: number;
      status: string | null;
      notes?: string | null;
      currency?: string;
    } | null;
    customer?: {
      name: string;
      email?: string | null;
      phone?: string | null;
      company?: string | null;
    } | null;
    snapshot_data?: {
      line_items?: Array<{
        label: string;
        description?: string;
        quantity: number;
        unit_price: number;
        line_total: number;
      }>;
      verification?: {
        tail?: string;
      };
    };
  };
  business: {
    name: string;
    email?: string | null;
    address?: string | null;
  };
}

function formatCurrency(amount: number, currency: string): string {
  const symbol = currency === 'USD' ? '$' : currency === 'GHS' ? 'GH₵' : `${currency} `;
  return `${symbol}${amount.toFixed(2)}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatPaymentMethod(method: string): string {
  const methods: Record<string, string> = {
    mobile_money: 'Mobile Money',
    card: 'Card Payment',
    bank_transfer: 'Bank Transfer',
    cash: 'Cash',
    crypto: 'Cryptocurrency',
  };
  return methods[method] || method;
}

export function ReceiptPDF({ receipt, business }: ReceiptPDFProps) {
  const currency = receipt.payment.currency || receipt.invoice?.currency || 'GHS';
  const lineItems = receipt.snapshot_data?.line_items || [];
  const verificationTail = receipt.snapshot_data?.verification?.tail;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>RECEIPT</Text>
            <Text style={styles.receiptNumber}>{receipt.receipt_number}</Text>
            <Text style={{ color: '#666', fontSize: 9 }}>
              Issued: {formatDate(receipt.created_at)}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 3 }}>
              {business.name}
            </Text>
            {business.email && (
              <Text style={{ fontSize: 9, color: '#666' }}>{business.email}</Text>
            )}
            {business.address && (
              <Text style={{ fontSize: 9, color: '#666' }}>{business.address}</Text>
            )}
            <View style={styles.statusBadge}>
              <Text>PAID</Text>
            </View>
          </View>
        </View>

        {/* Payment Summary Box */}
        <View style={styles.paymentBox}>
          <Text style={styles.paymentAmount}>
            {formatCurrency(receipt.payment.amount, currency)}
          </Text>
          <Text style={styles.paymentMethod}>
            {formatPaymentMethod(receipt.payment.method)} • {formatDate(receipt.payment.date)}
          </Text>
          {verificationTail && (
            <Text style={{ fontSize: 9, color: '#666', marginTop: 4 }}>
              Verification hash tail: {verificationTail}
            </Text>
          )}
        </View>

        {/* Bill To & Invoice Info */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Received From</Text>
            {receipt.customer ? (
              <>
                <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>
                  {receipt.customer.name}
                </Text>
                {receipt.customer.company && (
                  <Text style={{ color: '#666', fontSize: 9 }}>{receipt.customer.company}</Text>
                )}
                {receipt.customer.email && (
                  <Text style={{ color: '#666', fontSize: 9 }}>{receipt.customer.email}</Text>
                )}
                {receipt.customer.phone && (
                  <Text style={{ color: '#666', fontSize: 9 }}>{receipt.customer.phone}</Text>
                )}
              </>
            ) : receipt.payment.payer_name ? (
              <>
                <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>
                  {receipt.payment.payer_name}
                </Text>
                {receipt.payment.payer_email && (
                  <Text style={{ color: '#666', fontSize: 9 }}>{receipt.payment.payer_email}</Text>
                )}
              </>
            ) : (
              <Text style={{ color: '#999' }}>Anonymous Payer</Text>
            )}
          </View>
          {receipt.invoice && (
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>For Invoice</Text>
              <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>
                {receipt.invoice.invoice_number}
              </Text>
              <Text style={{ color: '#666', fontSize: 9 }}>
                Issued: {formatDate(receipt.invoice.issue_date)}
              </Text>
              {receipt.invoice.due_date && (
                <Text style={{ color: '#666', fontSize: 9 }}>
                  Due: {formatDate(receipt.invoice.due_date)}
                </Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Line Items (if available) */}
        {lineItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items</Text>
            <View style={styles.itemsTable}>
              <View style={styles.tableHeader}>
                <Text style={styles.colDescription}>Description</Text>
                <Text style={styles.colQty}>Qty</Text>
                <Text style={styles.colPrice}>Price</Text>
                <Text style={styles.colTotal}>Total</Text>
              </View>
              {lineItems.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.colDescription}>
                    <Text>{item.label}</Text>
                    {item.description && (
                      <Text style={{ fontSize: 8, color: '#666' }}>{item.description}</Text>
                    )}
                  </View>
                  <Text style={styles.colQty}>{item.quantity}</Text>
                  <Text style={styles.colPrice}>{formatCurrency(item.unit_price, currency)}</Text>
                  <Text style={styles.colTotal}>{formatCurrency(item.line_total, currency)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Totals */}
        {receipt.invoice && (
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(receipt.invoice.subtotal, currency)}
              </Text>
            </View>
            {receipt.invoice.discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount</Text>
                <Text style={styles.totalValue}>
                  -{formatCurrency(receipt.invoice.discount, currency)}
                </Text>
              </View>
            )}
            {receipt.invoice.tax > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(receipt.invoice.tax, currency)}
                </Text>
              </View>
            )}
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(receipt.payment.amount, currency)}
              </Text>
            </View>
          </View>
        )}

        {/* Notes */}
        {receipt.invoice?.notes && (
          <View style={[styles.section, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={{ color: '#666' }}>{receipt.invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This is an official receipt generated by Plaen</Text>
          <Text style={{ marginTop: 3 }}>
            Receipt #{receipt.receipt_number} • Generated on {formatDate(new Date().toISOString())}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
