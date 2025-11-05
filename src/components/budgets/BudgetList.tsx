import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetHeader, FormMode } from '@/types';
import BudgetForm from './BudgetForm';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock data
const mockBudgets: BudgetHeader[] = [
  {
    id: '1',
    yearlyBudgetId: 'yb1',
    companyId: '1',
    vesselId: '1',
    period: '2024-03',
    budgetType: 'Monthly',
    currency: 'USD',
    totalBudget: 125000,
    status: 'Approved',
    createdBy: 'admin',
    createdDate: '2024-02-25',
    approvedBy: 'manager',
    approvedDate: '2024-02-28',
    company: { id: '1', companyName: 'PT Pelayaran Nusantara' } as any,
    vessel: { id: '1', vesselName: 'MV Sinar Harapan', vesselCode: 'MV001' } as any,
    yearlyBudget: { id: 'yb1', year: '2024', totalBudget: 1500000, usedBudget: 375000, remainingBudget: 1125000 } as any,
  },
  {
    id: '2',
    yearlyBudgetId: 'yb2',
    companyId: '2',
    vesselId: '2',
    period: '2024-03',
    budgetType: 'Monthly',
    currency: 'USD',
    totalBudget: 85000,
    status: 'Submitted',
    createdBy: 'admin',
    createdDate: '2024-02-20',
    company: { id: '2', companyName: 'PT Samudera Jaya' } as any,
    vessel: { id: '2', vesselName: 'TB Nusantara', vesselCode: 'TB002' } as any,
    yearlyBudget: { id: 'yb2', year: '2024', totalBudget: 1020000, usedBudget: 170000, remainingBudget: 850000 } as any,
  },
  {
    id: '3',
    yearlyBudgetId: 'yb1',
    companyId: '1',
    vesselId: '1',
    period: '2024-04',
    budgetType: 'Monthly',
    currency: 'USD',
    totalBudget: 0,
    status: 'Draft',
    createdBy: 'admin',
    createdDate: '2024-03-15',
    company: { id: '1', companyName: 'PT Pelayaran Nusantara' } as any,
    vessel: { id: '1', vesselName: 'MV Sinar Harapan', vesselCode: 'MV001' } as any,
    yearlyBudget: { id: 'yb1', year: '2024', totalBudget: 1500000, usedBudget: 375000, remainingBudget: 1125000 } as any,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-success text-success-foreground';
    case 'Submitted':
      return 'bg-accent text-accent-foreground';
    case 'Draft':
      return 'bg-muted text-muted-foreground';
    case 'Rejected':
      return 'bg-destructive text-destructive-foreground';
    case 'Closed':
      return 'bg-secondary text-secondary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const formatPeriod = (period: string) => {
  const [year, month] = period.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function BudgetList() {
  const [budgets, setBudgets] = useLocalStorage<BudgetHeader[]>('budgets', mockBudgets);
  const [searchTerm, setSearchTerm] = useState('');
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedBudget, setSelectedBudget] = useState<BudgetHeader | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredBudgets = budgets.filter(budget =>
    budget.vessel?.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.company?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.period.includes(searchTerm)
  );

  const handleCreate = () => {
    setFormMode('create');
    setSelectedBudget(null);
    setShowForm(true);
  };

  const handleEdit = (budget: BudgetHeader) => {
    setFormMode('edit');
    setSelectedBudget(budget);
    setShowForm(true);
  };

  const handleView = (budget: BudgetHeader) => {
    setFormMode('view');
    setSelectedBudget(budget);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedBudget(null);
  };

  const handleSave = (budgetData: BudgetHeader) => {
    if (formMode === 'create') {
      const newBudget: BudgetHeader = {
        ...budgetData,
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0],
      };
      setBudgets([...budgets, newBudget]);
    } else if (formMode === 'edit' && selectedBudget) {
      setBudgets(budgets.map(b => 
        b.id === selectedBudget.id 
          ? { ...budgetData, id: selectedBudget.id }
          : b
      ));
    }
    handleFormClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      setBudgets(budgets.filter(b => b.id !== id));
    }
  };

  if (showForm) {
    return (
      <BudgetForm
        mode={formMode}
        budget={selectedBudget}
        onClose={handleFormClose}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Monthly Budget Management</h2>
          <p className="text-muted-foreground">Manage monthly vessel budgets linked to yearly allocations</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Create Monthly Budget
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search budgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Budgets table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly Budget List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Vessel</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Total Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatPeriod(budget.period)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{budget.vessel?.vesselName}</div>
                      <div className="text-sm text-muted-foreground">{budget.vessel?.vesselCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>{budget.company?.companyName}</TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(budget.totalBudget, budget.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(budget.status)}>
                      {budget.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(budget.createdDate).toLocaleDateString()}</div>
                      {budget.approvedDate && (
                        <div className="text-muted-foreground">
                          Approved: {new Date(budget.approvedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(budget)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {budget.status === 'Draft' && (
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(budget)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(budget.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredBudgets.length === 0 && (
            <div className="text-center py-10">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No budgets found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first budget.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}