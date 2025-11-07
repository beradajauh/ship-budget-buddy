import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Save, Copy, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { BudgetHeader, FormMode, CompanyCOA } from '@/types';
import { getPreviousMonth, formatPeriod } from '@/lib/utils';

interface BudgetFormProps {
  mode: FormMode;
  budget?: BudgetHeader | null;
  onSave: (budget: Partial<BudgetHeader>) => void;
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

const mockYearlyBudgets = [
  { id: 'yb1', year: '2024', companyId: '1', vesselId: '1', totalBudget: 1500000, usedBudget: 375000, remainingBudget: 1125000 },
  { id: 'yb2', year: '2024', companyId: '2', vesselId: '2', totalBudget: 1020000, usedBudget: 170000, remainingBudget: 850000 },
];

export default function BudgetForm({ mode, budget, onSave, onClose }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    yearlyBudgetId: budget?.yearlyBudgetId || '',
    companyId: budget?.companyId || '',
    vesselId: budget?.vesselId || '',
    period: budget?.period || '',
    currency: budget?.currency || 'USD',
    status: budget?.status || 'Draft',
  });

  const [allCompanyCOAs, setAllCompanyCOAs] = useState<CompanyCOA[]>([]);
  const [budgetAmounts, setBudgetAmounts] = useState<Record<string, number>>({});
  const [budgetNotes, setBudgetNotes] = useState<Record<string, string>>({});
  const [searchCOA, setSearchCOA] = useState('');
  const [showZeroAmounts, setShowZeroAmounts] = useState(true);
  const [selectedCopyMonth, setSelectedCopyMonth] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isReadonly = mode === 'view';
  const title = mode === 'create' ? 'Create Monthly Budget' : mode === 'edit' ? 'Edit Monthly Budget' : 'Monthly Budget Details';

  const selectedCompany = mockCompanies.find(c => c.id === formData.companyId);
  const availableVessels = mockVessels.filter(v => v.companyId === formData.companyId);
  
  const availableYearlyBudgets = mockYearlyBudgets.filter(
    yb => yb.companyId === formData.companyId && yb.vesselId === formData.vesselId
  );
  
  const selectedYearlyBudget = mockYearlyBudgets.find(yb => yb.id === formData.yearlyBudgetId);

  // Load Company COAs when company changes
  useEffect(() => {
    if (formData.companyId) {
      const companyCOAsKey = `companyCOA_${formData.companyId}`;
      const storedCOAs = localStorage.getItem(companyCOAsKey);
      
      if (storedCOAs) {
        const coas: CompanyCOA[] = JSON.parse(storedCOAs);
        setAllCompanyCOAs(coas);
        
        // Initialize with existing budget data if in edit/view mode
        if (budget?.budgetDetails) {
          const amounts: Record<string, number> = {};
          const notes: Record<string, string> = {};
          
          budget.budgetDetails.forEach(detail => {
            amounts[detail.coaId] = detail.budgetAmount;
            notes[detail.coaId] = detail.notes || '';
          });
          
          setBudgetAmounts(amounts);
          setBudgetNotes(notes);
        }
      } else {
        setAllCompanyCOAs([]);
        toast.warning('No Chart of Accounts found for this company. Please set up Master COA first.');
      }
    }
  }, [formData.companyId, budget]);

  // Filter COAs based on search
  const filteredCOAs = useMemo(() => {
    return allCompanyCOAs.filter(coa => {
      const searchLower = searchCOA.toLowerCase();
      return (
        coa.coaCode.toLowerCase().includes(searchLower) ||
        coa.coaName.toLowerCase().includes(searchLower)
      );
    });
  }, [allCompanyCOAs, searchCOA]);

  // Calculate summary stats
  const filledCount = useMemo(() => {
    return Object.values(budgetAmounts).filter(amount => amount > 0).length;
  }, [budgetAmounts]);

  const totalBudget = useMemo(() => {
    return Object.values(budgetAmounts).reduce((sum, amount) => sum + amount, 0);
  }, [budgetAmounts]);

  // Get available months to copy from
  const getAvailableMonths = useMemo(() => {
    if (!formData.companyId || !formData.vesselId) return [];
    
    const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    const availableBudgets = budgets
      .filter((b: BudgetHeader) => 
        b.companyId === formData.companyId &&
        b.vesselId === formData.vesselId &&
        b.period !== formData.period // Exclude current period
      )
      .map((b: BudgetHeader) => ({
        period: b.period,
        label: formatPeriod(b.period)
      }))
      .sort((a, b) => b.period.localeCompare(a.period)); // Sort descending (newest first)
    
    return availableBudgets;
  }, [formData.companyId, formData.vesselId, formData.period]);

  const handleCopyFromMonth = () => {
    if (!selectedCopyMonth) {
      toast.error('Please select a month to copy from');
      return;
    }

    const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    
    const sourceBudget = budgets.find((b: BudgetHeader) => 
      b.companyId === formData.companyId &&
      b.vesselId === formData.vesselId &&
      b.period === selectedCopyMonth
    );
    
    if (sourceBudget && sourceBudget.budgetDetails) {
      const amounts: Record<string, number> = {};
      const notes: Record<string, string> = {};
      
      sourceBudget.budgetDetails.forEach((detail: any) => {
        amounts[detail.coaId] = detail.budgetAmount;
        notes[detail.coaId] = detail.notes || '';
      });
      
      setBudgetAmounts(amounts);
      setBudgetNotes(notes);
      setIsPopoverOpen(false);
      setSelectedCopyMonth('');
      toast.success(`Budget copied from ${formatPeriod(selectedCopyMonth)}`);
    } else {
      toast.error(`No budget data found for ${formatPeriod(selectedCopyMonth)}`);
    }
  };

  const handleAmountChange = (coaId: string, value: string) => {
    const amount = parseFloat(value) || 0;
    setBudgetAmounts(prev => ({
      ...prev,
      [coaId]: amount
    }));
  };

  const handleNotesChange = (coaId: string, value: string) => {
    setBudgetNotes(prev => ({
      ...prev,
      [coaId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      // Convert budgetAmounts and budgetNotes to budgetDetails array
      const budgetDetails = allCompanyCOAs
        .filter(coa => budgetAmounts[coa.id] > 0) // Only include COAs with amounts
        .map(coa => ({
          id: `${coa.id}-${Date.now()}`,
          budgetId: budget?.id || '',
          coaId: coa.id,
          budgetAmount: budgetAmounts[coa.id] || 0,
          notes: budgetNotes[coa.id] || '',
        }));

      onSave({ ...formData, totalBudget, budgetDetails });
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
        // Reset budget data when company changes
        setBudgetAmounts({});
        setBudgetNotes({});
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
            {mode === 'create' ? 'Set up a new monthly budget linked to yearly budget' : 
             mode === 'edit' ? 'Update monthly budget information and allocations' : 
             'View monthly budget details and allocations'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Budget Header */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Budget Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <div className="space-y-2">
                <Label htmlFor="yearlyBudgetId">Yearly Budget Reference</Label>
                <Select 
                  value={formData.yearlyBudgetId} 
                  onValueChange={(value) => handleChange('yearlyBudgetId', value)}
                  disabled={isReadonly || !formData.vesselId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select yearly budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYearlyBudgets.map((yb) => (
                      <SelectItem key={yb.id} value={yb.id}>
                        {yb.year} - {formatCurrency(yb.remainingBudget)} available
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedYearlyBudget && (
                  <p className="text-xs text-muted-foreground">
                    Available: {formatCurrency(selectedYearlyBudget.remainingBudget)} of {formatCurrency(selectedYearlyBudget.totalBudget)}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  Auto-set based on selected company
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

        {/* Budget Details - Bulk Entry Table */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Budget Allocation</CardTitle>
              {!isReadonly && formData.period && formData.companyId && formData.vesselId && (
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy From
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Copy Budget From</h4>
                        <p className="text-xs text-muted-foreground">
                          Select a month to copy budget data from
                        </p>
                      </div>
                      
                      {getAvailableMonths.length > 0 ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="copy-month">Select Month</Label>
                            <Select 
                              value={selectedCopyMonth} 
                              onValueChange={setSelectedCopyMonth}
                            >
                              <SelectTrigger id="copy-month">
                                <SelectValue placeholder="Choose a month..." />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableMonths.map((month) => (
                                  <SelectItem key={month.period} value={month.period}>
                                    {month.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              type="button" 
                              onClick={handleCopyFromMonth}
                              disabled={!selectedCopyMonth}
                              className="flex-1"
                              size="sm"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                setIsPopoverOpen(false);
                                setSelectedCopyMonth('');
                              }}
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No previous budgets available for this company and vessel
                        </p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {allCompanyCOAs.length > 0 ? (
              <>
                {/* Search & Filter Bar */}
                <div className="mb-4 flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search COA by code or name..."
                      value={searchCOA}
                      onChange={(e) => setSearchCOA(e.target.value)}
                      className="pl-10"
                      disabled={isReadonly}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={showZeroAmounts}
                      onCheckedChange={setShowZeroAmounts}
                      disabled={isReadonly}
                    />
                    <Label className="text-sm">Show zero amounts</Label>
                  </div>
                </div>

                {/* Bulk Entry Table */}
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">COA Code</TableHead>
                        <TableHead>COA Name</TableHead>
                        <TableHead className="w-[160px]">Budget Amount</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCOAs.map((coa) => {
                        const amount = budgetAmounts[coa.id] || 0;
                        const notes = budgetNotes[coa.id] || '';
                        
                        // Skip if showZeroAmounts = false and amount = 0
                        if (!showZeroAmounts && amount === 0) return null;
                        
                        return (
                          <TableRow 
                            key={coa.id}
                            className={amount > 0 ? 'bg-accent/20' : ''}
                          >
                            <TableCell className="font-mono text-sm">{coa.coaCode}</TableCell>
                            <TableCell className="font-medium">{coa.coaName}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={amount || ''}
                                onChange={(e) => handleAmountChange(coa.id, e.target.value)}
                                placeholder="0"
                                readOnly={isReadonly}
                                className="w-full"
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={notes}
                                onChange={(e) => handleNotesChange(coa.id, e.target.value)}
                                placeholder="Optional notes"
                                readOnly={isReadonly}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {filteredCOAs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No COAs found matching your search
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Summary Section */}
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total COAs:</span>
                    <span className="font-medium">{allCompanyCOAs.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Filled:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {filledCount} / {allCompanyCOAs.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-semibold text-foreground">Total Budget:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(totalBudget)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Please select a company to load Chart of Accounts
              </div>
            )}
          </CardContent>
        </Card>

        {!isReadonly && (
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={allCompanyCOAs.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              {mode === 'create' ? 'Create Monthly Budget' : 'Update Monthly Budget'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}