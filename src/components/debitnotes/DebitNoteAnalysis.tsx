import { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data for duplicate debit notes
const mockDuplicateDebitNotes = [
  {
    id: 'dn-001',
    debitNoteNo: 'DN-2024-001',
    vendorInvoiceNo: 'INV-001',
    vesselName: 'MV Sinar Harapan',
    vendorName: 'PT Marina Services',
    totalAmount: 5000,
    currency: 'USD',
    debitNoteDate: '2024-03-25',
    duplicateCount: 2,
  },
  {
    id: 'dn-005',
    debitNoteNo: 'DN-2024-005',
    vendorInvoiceNo: 'INV-003',
    vesselName: 'TB Nusantara',
    vendorName: 'PT Ocean Supply',
    totalAmount: 2500,
    currency: 'USD',
    debitNoteDate: '2024-03-22',
    duplicateCount: 3,
  },
];

// Mock data for payment status
const mockPaymentStatus = [
  {
    id: 'dn-001',
    debitNoteNo: 'DN-2024-001',
    vendorInvoiceNo: 'INV-001',
    vesselName: 'MV Sinar Harapan',
    vendorName: 'PT Marina Services',
    totalAmount: 5000,
    currency: 'USD',
    debitNoteDate: '2024-03-25',
    paymentStatus: 'Paid',
    paymentDate: '2024-03-26',
    referenceAPNo: 'AP-2024-001',
    outgoingPaymentNo: 'OP-2024-001',
  },
  {
    id: 'dn-002',
    debitNoteNo: 'DN-2024-002',
    vendorInvoiceNo: 'INV-002',
    vesselName: 'MV SRIWANGI II',
    vendorName: 'PT Supply Chain',
    totalAmount: 3500,
    currency: 'USD',
    debitNoteDate: '2024-03-24',
    paymentStatus: 'Unpaid',
    paymentDate: null,
    referenceAPNo: null,
    outgoingPaymentNo: null,
  },
  {
    id: 'dn-003',
    debitNoteNo: 'DN-2024-003',
    vendorInvoiceNo: 'INV-004',
    vesselName: 'TB Nusantara',
    vendorName: 'PT Ocean Management',
    totalAmount: 4200,
    currency: 'USD',
    debitNoteDate: '2024-03-20',
    paymentStatus: 'Paid',
    paymentDate: '2024-03-22',
    referenceAPNo: 'AP-2024-002',
    outgoingPaymentNo: 'OP-2024-002',
  },
  {
    id: 'dn-004',
    debitNoteNo: 'DN-2024-004',
    vendorInvoiceNo: 'INV-005',
    vesselName: 'MV Sinar Harapan',
    vendorName: 'PT Marina Services',
    totalAmount: 2800,
    currency: 'USD',
    debitNoteDate: '2024-03-18',
    paymentStatus: 'Unpaid',
    paymentDate: null,
    referenceAPNo: null,
    outgoingPaymentNo: null,
  },
];

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export default function DebitNoteAnalysis() {
  const [activeTab, setActiveTab] = useState('duplicates');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Debit Note Analysis</h2>
        <p className="text-muted-foreground">Monitor duplicate invoices and payment status</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="duplicates" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Duplicate Invoices
            {mockDuplicateDebitNotes.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {mockDuplicateDebitNotes.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="payment-status" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Payment Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="duplicates" className="mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Duplicate Vendor Invoice Numbers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockDuplicateDebitNotes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Debit Note No</TableHead>
                      <TableHead>Vendor Invoice No</TableHead>
                      <TableHead>Vessel</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Duplicate Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDuplicateDebitNotes.map((debitNote) => (
                      <TableRow key={debitNote.id} className="bg-destructive/10">
                        <TableCell className="font-medium">{debitNote.debitNoteNo}</TableCell>
                        <TableCell className="font-bold text-destructive">
                          {debitNote.vendorInvoiceNo}
                        </TableCell>
                        <TableCell>{debitNote.vesselName}</TableCell>
                        <TableCell>{debitNote.vendorName}</TableCell>
                        <TableCell>
                          {new Date(debitNote.debitNoteDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(debitNote.totalAmount, debitNote.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            {debitNote.duplicateCount} duplicates
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <CheckCircle className="mx-auto h-12 w-12 text-success mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Duplicates Found</h3>
                  <p className="text-muted-foreground">
                    All vendor invoice numbers are unique.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-status" className="mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Payment Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Debit Note No</TableHead>
                    <TableHead>Vendor Invoice No</TableHead>
                    <TableHead>Vessel</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>DN Date</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>AP Reference</TableHead>
                    <TableHead>Payment No</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPaymentStatus.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.debitNoteNo}</TableCell>
                      <TableCell>{item.vendorInvoiceNo}</TableCell>
                      <TableCell>{item.vesselName}</TableCell>
                      <TableCell>{item.vendorName}</TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(item.totalAmount, item.currency)}
                      </TableCell>
                      <TableCell>
                        {new Date(item.debitNoteDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {item.paymentStatus === 'Paid' ? (
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Paid
                          </Badge>
                        ) : (
                          <Badge className="bg-warning text-warning-foreground">
                            <XCircle className="h-3 w-3 mr-1" />
                            Unpaid
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.paymentDate
                          ? new Date(item.paymentDate).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>{item.referenceAPNo || '-'}</TableCell>
                      <TableCell>{item.outgoingPaymentNo || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
