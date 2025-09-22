import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { DebitNoteHeader, FormMode } from '@/types';
import DebitNoteForm from './DebitNoteForm';

// Mock data
const mockDebitNotes: DebitNoteHeader[] = [
  {
    id: '1',
    expenseId: 'exp-001',
    companyId: 'comp-001',
    vesselId: 'vessel-001',
    vendorId: 'vendor-001',
    debitNoteNo: 'DN-2024-001',
    debitNoteDate: '2024-01-15',
    totalAmount: 50000,
    status: 'Draft',
    linkedAPDoc: '',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    company: {
      id: 'comp-001',
      companyCode: 'SHIP001',
      companyName: 'Ocean Shipping Ltd',
      address: 'Jakarta',
      contactPerson: 'John Doe',
      currency: 'USD',
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    vessel: {
      id: 'vessel-001',
      vesselCode: 'MV001',
      vesselName: 'MV Sinar Harapan',
      ownedByCompanyId: 'comp-001',
      managedByVendorId: 'vendor-001',
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
      contactPerson: 'Jane Smith',
      bankAccountInfo: 'BCA 123456789',
      taxId: 'TAX001',
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  },
  {
    id: '2',
    expenseId: 'exp-002',
    companyId: 'comp-001',
    vesselId: 'vessel-002',
    vendorId: 'vendor-002',
    debitNoteNo: 'DN-2024-002',
    debitNoteDate: '2024-01-20',
    totalAmount: 75000,
    status: 'Submitted',
    linkedAPDoc: 'SAP-12345',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    company: {
      id: 'comp-001',
      companyCode: 'SHIP001',
      companyName: 'Ocean Shipping Ltd',
      address: 'Jakarta',
      contactPerson: 'John Doe',
      currency: 'USD',
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    vessel: {
      id: 'vessel-002',
      vesselCode: 'TB001',
      vesselName: 'TB Nusantara',
      ownedByCompanyId: 'comp-001',
      managedByVendorId: 'vendor-002',
      vesselType: 'Tugboat',
      buildYear: 2019,
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    vendor: {
      id: 'vendor-002',
      vendorCode: 'V002',
      vendorName: 'Port Services Ltd',
      address: 'Batam',
      contactPerson: 'Mike Wilson',
      bankAccountInfo: 'BNI 987654321',
      taxId: 'TAX002',
      status: 'Active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Draft': return 'bg-secondary text-secondary-foreground';
    case 'Submitted': return 'bg-warning text-warning-foreground';
    case 'Approved': return 'bg-success text-success-foreground';
    case 'Paid': return 'bg-primary text-primary-foreground';
    case 'Rejected': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
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

export default function DebitNoteList() {
  const [debitNotes, setDebitNotes] = useState<DebitNoteHeader[]>(mockDebitNotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedDebitNote, setSelectedDebitNote] = useState<DebitNoteHeader | null>(null);

  const filteredDebitNotes = debitNotes.filter(debitNote =>
    debitNote.debitNoteNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debitNote.vessel?.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debitNote.company?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debitNote.vendor?.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormMode('create');
    setSelectedDebitNote(null);
    setShowForm(true);
  };

  const handleEdit = (debitNote: DebitNoteHeader) => {
    setFormMode('edit');
    setSelectedDebitNote(debitNote);
    setShowForm(true);
  };

  const handleView = (debitNote: DebitNoteHeader) => {
    setFormMode('view');
    setSelectedDebitNote(debitNote);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedDebitNote(null);
    setFormMode('create');
  };

  const handleFormSave = (debitNoteData: any) => {
    if (formMode === 'create') {
      const newDebitNote: DebitNoteHeader = {
        ...debitNoteData,
        id: `dn-${Date.now()}`,
        debitNoteNo: `DN-${new Date().getFullYear()}-${String(debitNotes.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDebitNotes([...debitNotes, newDebitNote]);
    } else if (formMode === 'edit' && selectedDebitNote) {
      setDebitNotes(debitNotes.map(d => 
        d.id === selectedDebitNote.id 
          ? { ...debitNoteData, id: selectedDebitNote.id, updatedAt: new Date().toISOString() }
          : d
      ));
    }
    handleFormClose();
  };

  if (showForm) {
    return (
      <DebitNoteForm
        mode={formMode}
        debitNote={selectedDebitNote}
        onSave={handleFormSave}
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Debit Notes</h2>
          <p className="text-muted-foreground">Manage debit notes for over-budget expenses</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Debit Note
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Debit Notes List</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search debit notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
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
                <TableHead>Company</TableHead>
                <TableHead>Vessel</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AP Doc</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDebitNotes.map((debitNote) => (
                <TableRow key={debitNote.id}>
                  <TableCell className="font-medium">{debitNote.debitNoteNo}</TableCell>
                  <TableCell>{formatDate(debitNote.debitNoteDate)}</TableCell>
                  <TableCell>{debitNote.company?.companyName}</TableCell>
                  <TableCell>{debitNote.vessel?.vesselName}</TableCell>
                  <TableCell>{debitNote.vendor?.vendorName}</TableCell>
                  <TableCell>{formatCurrency(debitNote.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(debitNote.status)}>
                      {debitNote.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{debitNote.linkedAPDoc || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(debitNote)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(debitNote)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredDebitNotes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No debit notes found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}