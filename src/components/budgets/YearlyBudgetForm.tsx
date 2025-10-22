import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { YearlyBudgetHeader, FormMode } from '@/types';

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

export default function YearlyBudgetForm({ mode, budget, onSave, onClose }: YearlyBudgetFormProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const [formData, setFormData] = useState({
    companyId: budget?.companyId || '',
    vesselId: budget?.vesselId || '',
    year: budget?.year || currentYear.toString(),
    currency: budget?.currency || 'USD',
    totalBudget: budget?.totalBudget || 0,
    status: budget?.status || 'Draft',
  });

  const isReadonly = mode === 'view';
  const title = mode === 'create' ? 'Create Yearly Budget' : mode === 'edit' ? 'Edit Yearly Budget' : 'Yearly Budget Details';

  const availableVessels = mockVessels.filter(v => v.companyId === formData.companyId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave({ 
        ...formData,
        usedBudget: budget?.usedBudget || 0,
        remainingBudget: formData.totalBudget - (budget?.usedBudget || 0),
      });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'companyId') {
        const company = mockCompanies.find(c => c.id === String(value));
        if (company) {
          newData.currency = company.currency;
        }
        newData.vesselId = '';
      }
      
      return newData;
    });
  };

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

            <div className="space-y-2">
              <Label htmlFor="totalBudget">Total Yearly Budget ({formData.currency}) *</Label>
              <Input
                id="totalBudget"
                type="number"
                value={formData.totalBudget}
                onChange={(e) => handleChange('totalBudget', parseFloat(e.target.value) || 0)}
                placeholder="0"
                required
                readOnly={isReadonly}
                className="text-lg font-semibold"
              />
              <p className="text-sm text-muted-foreground">
                This budget will be allocated across monthly budgets throughout the year
              </p>
            </div>

            {mode === 'view' && budget && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(budget.totalBudget)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Used in Monthly Budgets</p>
                  <p className="text-xl font-semibold text-warning">{formatCurrency(budget.usedBudget)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Remaining Available</p>
                  <p className="text-xl font-bold text-success">{formatCurrency(budget.remainingBudget)}</p>
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
