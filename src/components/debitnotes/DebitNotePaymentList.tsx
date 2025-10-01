import { useState } from 'react';
import { Plus, Search, Edit, Eye, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DebitNotePayment, FormMode } from '@/types';
import DebitNotePaymentForm from './DebitNotePaymentForm';

// Mock data
const mockPayments: DebitNotePayment[] = [
  {
    id: '1',
    debitNoteId: 'dn-001',
    paymentDate: '2024-03-25',
    referenceAPNo: 'AP-2024-001',
    outgoingPaymentNo: 'OP-2024-001',
    paymentAmount: 5000,
    currency: 'USD',
    status: 'Completed',
    notes: 'Payment processed successfully',
    createdAt: '2024-03-25T10:00:00',
    updatedAt: '2024-03-25T10:00:00',
  },
  {
    id: '2',
    debitNoteId: 'dn-002',
    paymentDate: '2024-03-20',
    referenceAPNo: 'AP-2024-002',
    outgoingPaymentNo: 'OP-2024-002',
    paymentAmount: 3500,
    currency: 'USD',
    status: 'Pending',
    createdAt: '2024-03-20T10:00:00',
    updatedAt: '2024-03-20T10:00:00',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-success text-success-foreground';
    case 'Pending':
      return 'bg-warning text-warning-foreground';
    case 'Failed':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export default function DebitNotePaymentList() {
  const [payments] = useState<DebitNotePayment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedPayment, setSelectedPayment] = useState<DebitNotePayment | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredPayments = payments.filter(payment =>
    payment.referenceAPNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.outgoingPaymentNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormMode('create');
    setSelectedPayment(null);
    setShowForm(true);
  };

  const handleEdit = (payment: DebitNotePayment) => {
    setFormMode('edit');
    setSelectedPayment(payment);
    setShowForm(true);
  };

  const handleView = (payment: DebitNotePayment) => {
    setFormMode('view');
    setSelectedPayment(payment);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedPayment(null);
  };

  if (showForm) {
    return (
      <DebitNotePaymentForm
        mode={formMode}
        payment={selectedPayment}
        onClose={handleFormClose}
        onSave={() => {
          handleFormClose();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Debit Note Payments</h2>
          <p className="text-muted-foreground">Manage payments for debit notes</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Record Payment
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Payments table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment Date</TableHead>
                <TableHead>Reference AP No</TableHead>
                <TableHead>Outgoing Payment No</TableHead>
                <TableHead>Payment Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{payment.referenceAPNo}</TableCell>
                  <TableCell className="font-medium">{payment.outgoingPaymentNo}</TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(payment.paymentAmount, payment.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(payment)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {payment.status === 'Pending' && (
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(payment)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-10">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No payments found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by recording your first payment.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
