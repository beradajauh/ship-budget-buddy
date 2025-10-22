import { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { YearlyBudgetHeader, YearlyBudgetDetail, FormMode } from '@/types';

interface YearlyBudgetFormProps {
  mode: FormMode;
  budget?: YearlyBudgetHeader | null;
  onSave: (budget: Partial<YearlyBudgetHeader>) => void;
  onClose: () => void;
}

const mockCompanies = [
  { id: '1', name: 'PT Pelayaran Nusantara', currency: 'USD' },
  { id: '2', name: 'PT Samudera Jaya', currency: 'IDR' },
];

const mockVessels = [
  { id: '1', name: 'MV Sinar Harapan', code: 'MV001', companyId: '1' },
  { id: '2', name: 'TB Nusantara', code: 'TB002', companyId: '2' },
];

const mockCategories = [
  { id: '11', name: 'Marine Diesel Oil', code: 'FUEL-MDO' },
  { id: '12', name: 'Lubricating Oil', code: 'FUEL-LUB' },
  { id: '21', name: 'Crew Salaries', code: 'CREW-SAL' },
  { id: '22', name: 'Crew Food & Provisions', code: 'CREW-FOD' },
  { id: '3', name: 'Maintenance', code: 'MAINT' },
  { id: '4', name: 'Insurance', code: 'INS' },
];

export default function YearlyBudgetForm({ mode, budget, onSave, onClose }: YearlyBudgetFormProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const [formData, setFormData] = useState({
    companyId: budget?.companyId || '',
    vesselId: budget?.vesselId || '',
    year: budget?.year || currentYear.toString(),
    currency: budget?.currency || 'USD',
    status: budget?.status || 'Draft',
  });

  const [budgetDetails, setBudgetDetails] = useState<YearlyBudgetDetail[]>(
    budget?.yearlyBudgetDetails || []
  );

  const isReadonly = mode === 'view';
  const title = mode === 'create' ? 'Create Yearly Budget' : mode === 'edit' ? 'Edit Yearly Budget' : 'Yearly Budget Details';

  const availableVessels = mockVessels.filter(v => v.companyId === formData.companyId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      const totalBudget = budgetDetails.reduce((sum, detail) => sum + detail.budgetAmount, 0);
      const usedBudget = budgetDetails.reduce((sum, detail) => sum + detail.usedAmount, 0);
      onSave({ 
        ...formData, 
        totalBudget, 
        usedBudget,
        remainingBudget: totalBudget - usedBudget,
        yearlyBudgetDetails: budgetDetails 
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'companyId') {
        const company = mockCompanies.find(c => c.id === value);
        if (company) {
          newData.currency = company.currency;
        }
        newData.vesselId = '';
      }
      
      return newData;
    });
  };

  const addBudgetDetail = () => {
    const newDetail: YearlyBudgetDetail = {
      id: Date.now().toString(),
      yearlyBudgetId: budget?.id || '',
      coaId: '',
      budgetAmount: 0,
      usedAmount: 0,
      remainingAmount: 0,
      notes: '',
    };
    setBudgetDetails([...budgetDetails, newDetail]);
  };

  const updateBudgetDetail = (index: number, field: keyof YearlyBudgetDetail, value: string | number) => {
    const updated = [...budgetDetails];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'budgetAmount' || field === 'usedAmount') {
      const budgetAmount = field === 'budgetAmount' ? Number(value) : updated[index].budgetAmount;
      const usedAmount = field === 'usedAmount' ? Number(value) : updated[index].usedAmount;
      updated[index].remainingAmount = budgetAmount - usedAmount;
    }
    
    setBudgetDetails(updated);
  };

  const removeBudgetDetail = (index: number) => {
    setBudgetDetails(budgetDetails.filter((_, i) => i !== index));
  };

  const totalBudget = budgetDetails.reduce((sum, detail) => sum + detail.budgetAmount, 0);
  const totalUsed = budgetDetails.reduce((sum, detail) => sum + detail.usedAmount, 0);
  const totalRemaining = totalBudget - totalUsed;

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
            {mode === 'create' ? 'Set up a new yearly budget for a vessel' : 
             mode === 'edit' ? 'Update yearly budget information and allocations' : 
             'View yearly budget details and monthly utilization'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Budget Information</CardTitle>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Select 
                  value={formData.year} 
                  onValueChange={(value) => handleChange('year', value)}
                  disabled={isReadonly}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Budget Allocation</CardTitle>
              {!isReadonly && (
                <Button type="button" onClick={addBudgetDetail} size="sm" className="bg-primary hover:bg-primary-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>COA</TableHead>
                  <TableHead>Yearly Budget</TableHead>
                  <TableHead>Used (Monthly)</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Notes</TableHead>
                  {!isReadonly && <TableHead className="w-16">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetDetails.map((detail, index) => (
                  <TableRow key={detail.id}>
                    <TableCell>
                      <Select
                        value={detail.coaId}
                        onValueChange={(value) => updateBudgetDetail(index, 'coaId', value)}
                        disabled={isReadonly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select COA" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.code} - {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={detail.budgetAmount}
                        onChange={(e) => updateBudgetDetail(index, 'budgetAmount', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        readOnly={isReadonly}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={detail.usedAmount}
                        readOnly
                        className="bg-muted text-warning"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={detail.remainingAmount}
                        readOnly
                        className="bg-muted font-semibold text-success"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={detail.notes || ''}
                        onChange={(e) => updateBudgetDetail(index, 'notes', e.target.value)}
                        placeholder="Optional notes"
                        readOnly={isReadonly}
                      />
                    </TableCell>
                    {!isReadonly && (
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBudgetDetail(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {budgetDetails.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isReadonly ? 5 : 6} className="text-center text-muted-foreground py-8">
                      No budget categories added yet. Click "Add Category" to start.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {budgetDetails.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-foreground">Total Yearly Budget:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(totalBudget)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-foreground">Total Used:</span>
                  <span className="text-lg font-semibold text-warning">
                    {formatCurrency(totalUsed)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-lg font-semibold text-foreground">Remaining Budget:</span>
                  <span className="text-xl font-bold text-success">
                    {formatCurrency(totalRemaining)}
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
              {mode === 'create' ? 'Create Yearly Budget' : 'Update Yearly Budget'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
