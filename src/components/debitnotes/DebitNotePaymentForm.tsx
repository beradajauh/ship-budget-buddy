import { useState } from 'react';
import { ArrowLeft, Save, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DebitNotePayment, FormMode } from '@/types';

interface DebitNotePaymentFormProps {
  mode: FormMode;
  payment: DebitNotePayment | null;
  onClose: () => void;
  onSave: (data: Partial<DebitNotePayment>) => void;
}

export default function DebitNotePaymentForm({ mode, payment, onClose, onSave }: DebitNotePaymentFormProps) {
  const [formData, setFormData] = useState({
    debitNoteId: payment?.debitNoteId || '',
    paymentDate: payment?.paymentDate || new Date().toISOString().split('T')[0],
    referenceAPNo: payment?.referenceAPNo || '',
    outgoingPaymentNo: payment?.outgoingPaymentNo || '',
    paymentAmount: payment?.paymentAmount || 0,
    currency: payment?.currency || 'USD',
    status: payment?.status || 'Pending',
    notes: payment?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isViewMode = mode === 'view';
  const title = mode === 'create' ? 'Record Debit Note Payment' : mode === 'edit' ? 'Edit Payment' : 'View Payment';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground">Record payment for debit note</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="debitNoteId">Debit Note *</Label>
                <Select
                  value={formData.debitNoteId}
                  onValueChange={(value) => setFormData({ ...formData, debitNoteId: value })}
                  disabled={isViewMode || mode === 'edit'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select debit note" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dn-001">DN-001 - $5,000.00</SelectItem>
                    <SelectItem value="dn-002">DN-002 - $3,500.00</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDate">Payment Date *</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  disabled={isViewMode}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceAPNo">Reference AP Number *</Label>
                <Input
                  id="referenceAPNo"
                  placeholder="Enter AP number"
                  value={formData.referenceAPNo}
                  onChange={(e) => setFormData({ ...formData, referenceAPNo: e.target.value })}
                  disabled={isViewMode}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outgoingPaymentNo">Outgoing Payment Number *</Label>
                <Input
                  id="outgoingPaymentNo"
                  placeholder="Enter payment number"
                  value={formData.outgoingPaymentNo}
                  onChange={(e) => setFormData({ ...formData, outgoingPaymentNo: e.target.value })}
                  disabled={isViewMode}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount *</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  value={formData.paymentAmount}
                  onChange={(e) => setFormData({ ...formData, paymentAmount: parseFloat(e.target.value) })}
                  disabled={isViewMode}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="IDR">IDR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter payment notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={isViewMode}
                  rows={3}
                />
              </div>
            </div>

            {!isViewMode && (
              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-dark">
                  <Save className="h-4 w-4 mr-2" />
                  Save Payment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
