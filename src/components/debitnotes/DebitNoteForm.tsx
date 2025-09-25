import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { DebitNoteHeader, DebitNoteDetail, FormMode, Company, Vessel, Vendor, ExpenseHeader, ExpenseDetail, ChartOfAccount } from '@/types';

interface DebitNoteFormProps {
  mode: FormMode;
  debitNote?: DebitNoteHeader | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

// Mock data
const mockCompanies: Company[] = [
  {
    id: 'comp-001',
    companyCode: 'SHIP001',
    companyName: 'Ocean Shipping Ltd',
    address: 'Jakarta',
    contactPerson: 'John Doe',
    currency: 'USD',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockVessels: Vessel[] = [
  {
    id: 'vessel-001',
    vesselCode: 'MV001',
    vesselName: 'MV Sinar Harapan',
    ownedByCompanyId: 'comp-001',
    vesselType: 'Container',
    buildYear: 2020,
    status: 'Active',
    vendors: [{ id: '1', vesselId: 'vessel-001', vendorId: 'vendor-001', isPrimary: true }] as any,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockVendors: Vendor[] = [
  {
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
];

const mockExpenses: ExpenseHeader[] = [
  {
    id: 'exp-001',
    companyId: 'comp-001',
    vesselId: 'vessel-001',
    vendorId: 'vendor-001',
    period: '2024-01',
    currency: 'USD',
    totalExpense: 150000,
    status: 'Approved',
    createdBy: 'user1',
    createdDate: '2024-01-15',
    expenseDetails: [
      {
        id: 'expd-001',
        expenseId: 'exp-001',
        coaId: 'coa-001',
        description: 'Fuel consumption January 2024',
        expenseDate: '2024-01-15',
        amount: 75000,
        budgetFlag: 'Out of Budget',
        coa: {
          id: 'coa-001',
          coaCode: 'FUEL001',
          coaName: 'Fuel Oil',
          companyId: 'comp-001',
          vendorCoaCode: 'VFUEL001',
          status: 'Active',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      }
    ]
  }
];

const mockCategories: ChartOfAccount[] = [
  {
    id: 'coa-001',
    coaCode: 'FUEL001',
    coaName: 'Fuel Oil',
    companyId: 'comp-001',
    vendorCoaCode: 'VFUEL001',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'coa-002',
    coaCode: 'CREW001',
    coaName: 'Crew Wages',
    companyId: 'comp-001',
    vendorCoaCode: 'VCREW001',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export default function DebitNoteForm({ mode, debitNote, onSave, onClose }: DebitNoteFormProps) {
  const [formData, setFormData] = useState({
    expenseId: debitNote?.expenseId || '',
    companyId: debitNote?.companyId || '',
    vesselId: debitNote?.vesselId || '',
    vendorId: debitNote?.vendorId || '',
    debitNoteDate: debitNote?.debitNoteDate || new Date().toISOString().split('T')[0],
    vendorInvoiceNo: debitNote?.vendorInvoiceNo || '',
    status: debitNote?.status || 'Draft',
    linkedAPDoc: debitNote?.linkedAPDoc || '',
  });

  const [existingInvoices, setExistingInvoices] = useState<string[]>([
    'INV-2024-001', 'INV-2024-002', 'INV-2024-003' // Mock existing invoices
  ]);

  const [debitNoteDetails, setDebitNoteDetails] = useState<DebitNoteDetail[]>(
    debitNote?.debitNoteDetails || []
  );

  const isReadonly = mode === 'view';

  const selectedExpense = mockExpenses.find(e => e.id === formData.expenseId);
  const overBudgetDetails = selectedExpense?.expenseDetails?.filter(d => d.budgetFlag === 'Out of Budget') || [];

  const totalAmount = debitNoteDetails.reduce((sum, detail) => sum + detail.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate invoice
    if (formData.vendorInvoiceNo && existingInvoices.includes(formData.vendorInvoiceNo)) {
      alert('Warning: This vendor invoice number already exists in the system!');
      return;
    }
    
    const debitNoteData = {
      ...formData,
      totalAmount,
      debitNoteDetails,
    };

    onSave(debitNoteData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-populate fields when expense is selected
      if (field === 'expenseId' && value) {
        const expense = mockExpenses.find(e => e.id === value);
        if (expense) {
          updated.companyId = expense.companyId;
          updated.vesselId = expense.vesselId;
          updated.vendorId = expense.vendorId;
          
          // Auto-populate details with over-budget items
          const overBudgetItems = expense.expenseDetails?.filter(d => d.budgetFlag === 'Out of Budget') || [];
          const newDetails: DebitNoteDetail[] = overBudgetItems.map(item => ({
            id: `detail-${Date.now()}-${Math.random()}`,
            debitNoteId: '',
            expenseDetailId: item.id,
            categoryId: item.coaId,
            description: item.description,
            amount: item.amount,
            expenseDetail: item,
            coa: item.coa
          }));
          setDebitNoteDetails(newDetails);
        }
      }
      
      return updated;
    });
  };

  const addDebitNoteDetail = () => {
    const newDetail: DebitNoteDetail = {
      id: `detail-${Date.now()}`,
      debitNoteId: '',
      expenseDetailId: '',
      categoryId: '',
      description: '',
      amount: 0,
    };
    setDebitNoteDetails([...debitNoteDetails, newDetail]);
  };

  const updateDebitNoteDetail = (index: number, field: string, value: any) => {
    const updated = [...debitNoteDetails];
    updated[index] = { ...updated[index], [field]: value };
    setDebitNoteDetails(updated);
  };

  const removeDebitNoteDetail = (index: number) => {
    setDebitNoteDetails(debitNoteDetails.filter((_, i) => i !== index));
  };

  const formatCurrency = (amount: number) => {
    const currency = mockCompanies.find(c => c.id === formData.companyId)?.currency || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {mode === 'create' ? 'Create' : mode === 'edit' ? 'Edit' : 'View'} Debit Note
          </h2>
          <p className="text-muted-foreground">
            {mode === 'create' ? 'Create a new debit note for over-budget expenses' : 
             mode === 'edit' ? 'Modify debit note information' : 
             'View debit note details'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Debit Note Information */}
        <Card>
          <CardHeader>
            <CardTitle>Debit Note Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense">Expense Reference *</Label>
                <Select 
                  value={formData.expenseId} 
                  onValueChange={(value) => handleChange('expenseId', value)}
                  disabled={isReadonly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expense" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockExpenses.map((expense) => (
                      <SelectItem key={expense.id} value={expense.id}>
                        {expense.period} - {mockVessels.find(v => v.id === expense.vesselId)?.vesselName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="debitNoteDate">Debit Note Date *</Label>
                <Input
                  id="debitNoteDate"
                  type="date"
                  value={formData.debitNoteDate}
                  onChange={(e) => handleChange('debitNoteDate', e.target.value)}
                  readOnly={isReadonly}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendorInvoiceNo">Vendor Invoice No *</Label>
                <Input
                  id="vendorInvoiceNo"
                  value={formData.vendorInvoiceNo}
                  onChange={(e) => handleChange('vendorInvoiceNo', e.target.value)}
                  placeholder="Enter vendor invoice number"
                  readOnly={isReadonly}
                  required
                  className={existingInvoices.includes(formData.vendorInvoiceNo) ? 'border-destructive' : ''}
                />
                {formData.vendorInvoiceNo && existingInvoices.includes(formData.vendorInvoiceNo) && (
                  <p className="text-sm text-destructive">
                    ⚠️ This invoice number already exists in the system
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleChange('status', value)}
                  disabled={isReadonly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedAPDoc">Linked AP Document</Label>
                <Input
                  id="linkedAPDoc"
                  value={formData.linkedAPDoc}
                  onChange={(e) => handleChange('linkedAPDoc', e.target.value)}
                  placeholder="SAP document reference"
                  readOnly={isReadonly}
                />
              </div>
            </div>

            {selectedExpense && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Company</Label>
                  <p className="text-sm">{mockCompanies.find(c => c.id === selectedExpense.companyId)?.companyName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Vessel</Label>
                  <p className="text-sm">{mockVessels.find(v => v.id === selectedExpense.vesselId)?.vesselName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Vendor</Label>
                  <p className="text-sm">{mockVendors.find(v => v.id === selectedExpense.vendorId)?.vendorName}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Over-Budget Items */}
        {overBudgetDetails.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Available Over-Budget Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>COA</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Budget Flag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overBudgetDetails.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.coa?.coaName}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{formatCurrency(item.amount)}</TableCell>
                      <TableCell>
                        <Badge className="bg-destructive text-destructive-foreground">
                          {item.budgetFlag}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Debit Note Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Debit Note Details</CardTitle>
            {!isReadonly && (
              <Button type="button" variant="outline" onClick={addDebitNoteDetail}>
                <Plus className="h-4 w-4 mr-2" />
                Add Detail
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  {!isReadonly && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {debitNoteDetails.map((detail, index) => (
                  <TableRow key={detail.id}>
                    <TableCell>
                      <Select 
                        value={detail.categoryId} 
                        onValueChange={(value) => updateDebitNoteDetail(index, 'categoryId', value)}
                        disabled={isReadonly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select COA" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCategories.map((coa) => (
                            <SelectItem key={coa.id} value={coa.id}>
                              {coa.coaName} ({coa.coaCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={detail.description}
                        onChange={(e) => updateDebitNoteDetail(index, 'description', e.target.value)}
                        placeholder="Detail description"
                        readOnly={isReadonly}
                        className="min-h-[60px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={detail.amount}
                        onChange={(e) => updateDebitNoteDetail(index, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        readOnly={isReadonly}
                      />
                    </TableCell>
                    {!isReadonly && (
                      <TableCell>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDebitNoteDetail(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {debitNoteDetails.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No details added yet. Click "Add Detail" to start.
              </div>
            )}

            {debitNoteDetails.length > 0 && (
              <div className="flex justify-end mt-4 p-4 bg-muted rounded-lg">
                <div className="text-right">
                  <Label className="text-sm font-medium">Total Amount</Label>
                  <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {!isReadonly && (
            <Button type="submit">
              {mode === 'create' ? 'Create Debit Note' : 'Update Debit Note'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}