import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Check, X, Eye } from 'lucide-react';
import { DebitNoteHeader } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import DebitNoteForm from './DebitNoteForm';
import { toast } from 'sonner';

// Mock data for debit notes pending approval
const mockDebitNotesForApproval: DebitNoteHeader[] = [
  {
    id: 'dn-001',
    expenseId: 'exp-001',
    companyId: 'comp-001',
    vesselId: 'vessel-001',
    vendorId: 'vendor-001',
    debitNoteNo: 'DN-2024-001',
    debitNoteDate: '2024-01-15',
    vendorInvoiceNo: 'INV-2024-001',
    totalAmount: 75000,
    status: 'Submitted',
    company: {
      id: 'comp-001',
      companyCode: 'SHIP001',
      companyName: 'Ocean Shipping Ltd',
      address: 'Jakarta',
      phone: '+62 21 1234567',
      email: 'contact@oceanshipping.com',
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    vessel: {
      id: 'vessel-001',
      vesselCode: 'MV001',
      vesselName: 'MV Sinar Harapan',
      ownedByCompanyId: 'comp-001',
      vesselType: 'Container',
      buildYear: 2020,
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    vendor: {
      id: 'vendor-001',
      vendorCode: 'V001',
      vendorName: 'Marine Services Co',
      address: 'Surabaya',
      phone: '+62 31 1234567',
      email: 'contact@marine.com',
      taxId: 'TAX001',
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'dn-002',
    expenseId: 'exp-002',
    companyId: 'comp-001',
    vesselId: 'vessel-001',
    vendorId: 'vendor-001',
    debitNoteNo: 'DN-2024-002',
    debitNoteDate: '2024-01-20',
    vendorInvoiceNo: 'INV-2024-001', // Duplicate invoice number
    totalAmount: 45000,
    status: 'Submitted',
    company: {
      id: 'comp-001',
      companyCode: 'SHIP001',
      companyName: 'Ocean Shipping Ltd',
      address: 'Jakarta',
      phone: '+62 21 1234567',
      email: 'contact@oceanshipping.com',
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    vessel: {
      id: 'vessel-001',
      vesselCode: 'MV001',
      vesselName: 'MV Sinar Harapan',
      ownedByCompanyId: 'comp-001',
      vesselType: 'Container',
      buildYear: 2020,
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    vendor: {
      id: 'vendor-001',
      vendorCode: 'V001',
      vendorName: 'Marine Services Co',
      address: 'Surabaya',
      phone: '+62 31 1234567',
      email: 'contact@marine.com',
      taxId: 'TAX001',
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 'dn-003',
    expenseId: 'exp-003',
    companyId: 'comp-001',
    vesselId: 'vessel-001',
    vendorId: 'vendor-002',
    debitNoteNo: 'DN-2024-003',
    debitNoteDate: '2024-02-01',
    vendorInvoiceNo: 'INV-2024-005',
    totalAmount: 60000,
    status: 'Submitted',
    company: {
      id: 'comp-001',
      companyCode: 'SHIP001',
      companyName: 'Ocean Shipping Ltd',
      address: 'Jakarta',
      phone: '+62 21 1234567',
      email: 'contact@oceanshipping.com',
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    vessel: {
      id: 'vessel-001',
      vesselCode: 'MV001',
      vesselName: 'MV Sinar Harapan',
      ownedByCompanyId: 'comp-001',
      vesselType: 'Container',
      buildYear: 2020,
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    vendor: {
      id: 'vendor-002',
      vendorCode: 'V002',
      vendorName: 'Shipping Supplies Inc',
      address: 'Singapore',
      phone: '+65 1234567',
      email: 'contact@shipping.com',
      taxId: 'TAX002',
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  }
];

export default function DebitNoteApproval() {
  const [debitNotes, setDebitNotes] = useState<DebitNoteHeader[]>(mockDebitNotesForApproval);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedDebitNote, setSelectedDebitNote] = useState<DebitNoteHeader | null>(null);
  const [showRemarksDialog, setShowRemarksDialog] = useState(false);
  const [remarksAction, setRemarksAction] = useState<'approve' | 'reject' | null>(null);
  const [currentDebitNoteId, setCurrentDebitNoteId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');

  // Find duplicates based on vendor invoice number OR invoice number + sub vendor combination
  const findDuplicates = () => {
    const invoiceMap = new Map<string, number>();
    const invoiceSubVendorMap = new Map<string, number>();
    
    debitNotes.forEach(dn => {
      // Count invoice numbers
      invoiceMap.set(dn.vendorInvoiceNo, (invoiceMap.get(dn.vendorInvoiceNo) || 0) + 1);
      
      // Count invoice + sub vendor combinations from details
      if (dn.debitNoteDetails) {
        dn.debitNoteDetails.forEach(detail => {
          if (detail.invoiceNo && detail.subVendor) {
            const key = `${detail.invoiceNo}-${detail.subVendor}`;
            invoiceSubVendorMap.set(key, (invoiceSubVendorMap.get(key) || 0) + 1);
          }
        });
      }
    });
    
    return { invoiceMap, invoiceSubVendorMap };
  };
  
  const { invoiceMap, invoiceSubVendorMap } = findDuplicates();

  const filteredDebitNotes = debitNotes.filter(dn =>
    dn.debitNoteNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dn.vendorInvoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dn.vessel?.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dn.vendor?.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (debitNote: DebitNoteHeader) => {
    setSelectedDebitNote(debitNote);
    setShowForm(true);
  };

  const handleApproveClick = (id: string) => {
    setCurrentDebitNoteId(id);
    setRemarksAction('approve');
    setRemarks('');
    setShowRemarksDialog(true);
  };

  const handleRejectClick = (id: string) => {
    setCurrentDebitNoteId(id);
    setRemarksAction('reject');
    setRemarks('');
    setShowRemarksDialog(true);
  };

  const handleRemarksSubmit = () => {
    if (!currentDebitNoteId || !remarksAction) return;
    
    if (!remarks.trim()) {
      toast.error('Please enter remarks');
      return;
    }

    const newStatus: 'Approved' | 'Rejected' = remarksAction === 'approve' ? 'Approved' : 'Rejected';
    setDebitNotes(debitNotes.map(dn => 
      dn.id === currentDebitNoteId ? { ...dn, status: newStatus } : dn
    ));
    
    toast.success(`Debit note ${remarksAction === 'approve' ? 'approved' : 'rejected'} successfully`);
    setShowRemarksDialog(false);
    setCurrentDebitNoteId(null);
    setRemarksAction(null);
    setRemarks('');
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedDebitNote(null);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setSelectedDebitNote(null);
  };

  const formatCurrency = (amount: number, currency?: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-warning text-warning-foreground';
      case 'Approved': return 'bg-success text-success-foreground';
      case 'Rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const isDuplicate = (debitNote: DebitNoteHeader) => {
    // Check if invoice number is duplicated
    if ((invoiceMap.get(debitNote.vendorInvoiceNo) || 0) > 1) {
      return true;
    }
    
    // Check if any detail has duplicated invoice + sub vendor combination
    if (debitNote.debitNoteDetails) {
      return debitNote.debitNoteDetails.some(detail => {
        if (detail.invoiceNo && detail.subVendor) {
          const key = `${detail.invoiceNo}-${detail.subVendor}`;
          return (invoiceSubVendorMap.get(key) || 0) > 1;
        }
        return false;
      });
    }
    
    return false;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Debit Note Approval</h2>
        <p className="text-muted-foreground">Review and approve submitted debit notes</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending Approval</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search debit notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Debit Note No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Invoice No</TableHead>
                <TableHead>Vessel</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDebitNotes.map((debitNote) => {
                const hasDuplicate = isDuplicate(debitNote);
                return (
                  <TableRow 
                    key={debitNote.id}
                    className={hasDuplicate ? 'bg-destructive/10' : ''}
                  >
                    <TableCell className="font-medium">
                      {debitNote.debitNoteNo}
                    </TableCell>
                    <TableCell>{formatDate(debitNote.debitNoteDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {debitNote.vendorInvoiceNo}
                        {hasDuplicate && (
                          <Badge variant="destructive" className="text-xs">
                            Duplicate
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{debitNote.vessel?.vesselName}</TableCell>
                    <TableCell>{debitNote.vendor?.vendorName}</TableCell>
                    <TableCell>{formatCurrency(debitNote.totalAmount, 'USD')}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(debitNote.status)}>
                        {debitNote.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(debitNote)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {debitNote.status === 'Submitted' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveClick(debitNote.id)}
                              className="text-success hover:text-success"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectClick(debitNote.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredDebitNotes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No debit notes found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedDebitNote && (
            <DebitNoteForm
              mode="view"
              debitNote={selectedDebitNote}
              onSave={handleFormSave}
              onClose={handleFormClose}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showRemarksDialog} onOpenChange={setShowRemarksDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {remarksAction === 'approve' ? 'Approve' : 'Reject'} Debit Note
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks *</Label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter approval/rejection remarks..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemarksDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRemarksSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
