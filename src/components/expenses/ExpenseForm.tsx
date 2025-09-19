import { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ExpenseHeader, ExpenseDetail, FormMode } from '@/types';

interface ExpenseFormProps {
  mode: FormMode;
  expense?: ExpenseHeader | null;
  onSave: (expense: Partial<ExpenseHeader>) => void;
  onClose: () => void;
}

// Mock data for dropdowns
const mockCompanies = [
  { id: '1', name: 'PT Pelayaran Nusantara', currency: 'USD' },
  { id: '2', name: 'PT Samudera Jaya', currency: 'IDR' },
];

const mockVessels = [
  { id: '1', name: 'MV Sinar Harapan', code: 'MV001', companyId: '1' },
  { id: '2', name: 'TB Nusantara', code: 'TB002', companyId: '2' },
];

const mockVendors = [
  { id: '1', name: 'PT Marina Services', code: 'VD001' },
  { id: '2', name: 'PT Ocean Management', code: 'VD002' },
];

const mockCOAs = [
  { id: '11', name: 'Marine Diesel Oil', code: 'FUEL-MDO' },
  { id: '12', name: 'Lubricating Oil', code: 'FUEL-LUB' },
  { id: '21', name: 'Crew Salaries', code: 'CREW-SAL' },
  { id: '22', name: 'Crew Food & Provisions', code: 'CREW-FOD' },
  { id: '3', name: 'Maintenance', code: 'MAINT' },
  { id: '4', name: 'Insurance', code: 'INS' },
];

// Mock budget data to check budget flags
const mockBudgets = [
  { vesselId: '1', period: '2024-03', coaId: '11', budgetAmount: 50000 },
  { vesselId: '1', period: '2024-03', coaId: '21', budgetAmount: 25000 },
  { vesselId: '2', period: '2024-03', coaId: '11', budgetAmount: 30000 },
];

export default function ExpenseForm({ mode, expense, onSave, onClose }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    companyId: expense?.companyId || '',
    vesselId: expense?.vesselId || '',
    vendorId: expense?.vendorId || '',
    period: expense?.period || '',
    currency: expense?.currency || 'USD',
    status: expense?.status || 'Draft',
  });

  const [expenseDetails, setExpenseDetails] = useState<ExpenseDetail[]>(
    expense?.expenseDetails || []
  );

  const isReadonly = mode === 'view';
  const title = mode === 'create' ? 'Submit New Expenses' : mode === 'edit' ? 'Edit Expense Submission' : 'Expense Details';

  const selectedCompany = mockCompanies.find(c => c.id === formData.companyId);
  const availableVessels = mockVessels.filter(v => v.companyId === formData.companyId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      const totalExpense = expenseDetails.reduce((sum, detail) => sum + detail.amount, 0);
      onSave({ ...formData, totalExpense, expenseDetails });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-set currency when company changes
      if (field === 'companyId') {
        const company = mockCompanies.find(c => c.id === value);
        if (company) {
          newData.currency = company.currency;
        }
        // Reset vessel when company changes
        newData.vesselId = '';
      }
      
      return newData;
    });
  };

  const getBudgetFlag = (coaId: string, amount: number): 'Within Budget' | 'Out of Budget' => {
    const budget = mockBudgets.find(b => 
      b.vesselId === formData.vesselId && 
      b.period === formData.period && 
      b.coaId === coaId
    );
    
    if (!budget) return 'Out of Budget';
    return amount <= budget.budgetAmount ? 'Within Budget' : 'Out of Budget';
  };

  const addExpenseDetail = () => {
    const newDetail: ExpenseDetail = {
      id: Date.now().toString(),
      expenseId: expense?.id || '',
      coaId: '',
      description: '',
      expenseDate: new Date().toISOString().split('T')[0],
      amount: 0,
      budgetFlag: 'Within Budget',
    };
    setExpenseDetails([...expenseDetails, newDetail]);
  };

  const updateExpenseDetail = (index: number, field: keyof ExpenseDetail, value: string | number) => {
    const updated = [...expenseDetails];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-update budget flag when COA or amount changes
    if (field === 'coaId' || field === 'amount') {
      const detail = updated[index];
      updated[index].budgetFlag = getBudgetFlag(detail.coaId, detail.amount);
    }
    
    setExpenseDetails(updated);
  };

  const removeExpenseDetail = (index: number) => {
    setExpenseDetails(expenseDetails.filter((_, i) => i !== index));
  };

  const totalExpense = expenseDetails.reduce((sum, detail) => sum + detail.amount, 0);
  const outOfBudgetCount = expenseDetails.filter(d => d.budgetFlag === 'Out of Budget').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onClose} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground">
            {mode === 'create' ? 'Submit vessel expense details with supporting documents' : 
             mode === 'edit' ? 'Update expense submission details' : 
             'View expense submission and supporting documents'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Expense Header */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Expense Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyId">Company *</Label>
                <Select 
                  value={formData.companyId} 
                  onValueChange={(value) => handleChange('companyId', value)}
                  disabled={isReadonly}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vesselId">Vessel *</Label>
                <Select 
                  value={formData.vesselId} 
                  onValueChange={(value) => handleChange('vesselId', value)}
                  disabled={isReadonly || !formData.companyId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vessel" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVessels.map((vessel) => (
                      <SelectItem key={vessel.id} value={vessel.id}>
                        {vessel.code} - {vessel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vendorId">Vendor *</Label>
                <Select 
                  value={formData.vendorId} 
                  onValueChange={(value) => handleChange('vendorId', value)}
                  disabled={isReadonly}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockVendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.code} - {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period (YYYY-MM) *</Label>
                <Input
                  id="period"
                  type="month"
                  value={formData.period}
                  onChange={(e) => handleChange('period', e.target.value)}
                  required
                  readOnly={isReadonly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Auto-set based on company
                </p>
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
                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Details */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Expense Details</CardTitle>
                {outOfBudgetCount > 0 && (
                  <p className="text-sm text-destructive mt-1">
                    ⚠️ {outOfBudgetCount} item(s) are over budget and will generate debit note
                  </p>
                )}
              </div>
              {!isReadonly && (
                <Button type="button" onClick={addExpenseDetail} size="sm" className="bg-primary hover:bg-primary-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>COA</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Budget Flag</TableHead>
                  <TableHead>Supporting Doc</TableHead>
                  {!isReadonly && <TableHead className="w-16">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseDetails.map((detail, index) => (
                  <TableRow key={detail.id}>
                    <TableCell>
                      <Select
                        value={detail.coaId}
                        onValueChange={(value) => updateExpenseDetail(index, 'coaId', value)}
                        disabled={isReadonly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select COA" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCOAs.map((coa) => (
                            <SelectItem key={coa.id} value={coa.id}>
                              {coa.code} - {coa.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={detail.description}
                        onChange={(e) => updateExpenseDetail(index, 'description', e.target.value)}
                        placeholder="e.g., Gaji ABK September 2024"
                        readOnly={isReadonly}
                        rows={2}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={detail.expenseDate}
                        onChange={(e) => updateExpenseDetail(index, 'expenseDate', e.target.value)}
                        readOnly={isReadonly}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={detail.amount}
                        onChange={(e) => updateExpenseDetail(index, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        readOnly={isReadonly}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={detail.budgetFlag === 'Within Budget' ? 'default' : 'destructive'}
                        className={detail.budgetFlag === 'Within Budget' ? 'bg-success text-success-foreground' : ''}
                      >
                        {detail.budgetFlag}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {detail.supportingDoc ? (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-primary">Document attached</span>
                        </div>
                      ) : !isReadonly ? (
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">No document</span>
                      )}
                    </TableCell>
                    {!isReadonly && (
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExpenseDetail(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {expenseDetails.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isReadonly ? 6 : 7} className="text-center text-muted-foreground py-8">
                      No expense items added yet. Click "Add Expense" to start.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {expenseDetails.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total Expense:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(totalExpense)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {!isReadonly && (
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark">
              <Save className="h-4 w-4 mr-2" />
              {mode === 'create' ? 'Submit Expenses' : 'Update Submission'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}