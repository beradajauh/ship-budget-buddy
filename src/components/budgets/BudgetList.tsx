import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BudgetHeader, FormMode } from '@/types';
import BudgetForm from './BudgetForm';

// Mock data
const mockBudgets: BudgetHeader[] = [
  {
    id: '1',
    companyId: '1',
    vesselId: '1',
    period: '2024-03',
    currency: 'USD',
    totalBudget: 125000,
    status: 'Approved',
    createdBy: 'admin',
    createdDate: '2024-02-25',
    approvedBy: 'manager',
    approvedDate: '2024-02-28',
    company: { id: '1', companyName: 'PT Pelayaran Nusantara' } as any,
    vessel: { id: '1', vesselName: 'MV Sinar Harapan', vesselCode: 'MV001' } as any,
  },
  {
    id: '2',
    companyId: '2',
    vesselId: '2',
    period: '2024-03',
    currency: 'USD',
    totalBudget: 85000,
    status: 'Submitted',
    createdBy: 'admin',
    createdDate: '2024-02-20',
    company: { id: '2', companyName: 'PT Samudera Jaya' } as any,
    vessel: { id: '2', vesselName: 'TB Nusantara', vesselCode: 'TB002' } as any,
  },
  {
    id: '3',
    companyId: '1',
    vesselId: '1',
    period: '2024-04',
    currency: 'USD',
    totalBudget: 0,
    status: 'Draft',
    createdBy: 'admin',
    createdDate: '2024-03-15',
    company: { id: '1', companyName: 'PT Pelayaran Nusantara' } as any,
    vessel: { id: '1', vesselName: 'MV Sinar Harapan', vesselCode: 'MV001' } as any,
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
  const [budgets] = useState<BudgetHeader[]>(mockBudgets);
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

  if (showForm) {
    return (
      <BudgetForm
        mode={formMode}
        budget={selectedBudget}
        onClose={handleFormClose}
        onSave={() => {
          // Handle save logic here
          handleFormClose();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Budget Management</h2>
          <p className="text-muted-foreground">Manage monthly vessel budgets</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
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

      {/* Budgets grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBudgets.map((budget) => (
          <Card key={budget.id} className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-lg text-foreground">
                    {formatPeriod(budget.period)}
                  </CardTitle>
                </div>
                <Badge className={getStatusColor(budget.status)}>
                  {budget.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">{budget.vessel?.vesselName}</h3>
                <p className="text-sm text-muted-foreground">{budget.vessel?.vesselCode}</p>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Company:</span>
                <span className="text-foreground font-medium text-right flex-1 ml-2">
                  {budget.company?.companyName}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Budget:</span>
                <span className="text-foreground font-bold">
                  {formatCurrency(budget.totalBudget, budget.currency)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created:</span>
                <span className="text-foreground font-medium">
                  {new Date(budget.createdDate).toLocaleDateString()}
                </span>
              </div>

              {budget.approvedDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Approved:</span>
                  <span className="text-foreground font-medium">
                    {new Date(budget.approvedDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-3">
                <Button variant="ghost" size="sm" onClick={() => handleView(budget)}>
                  <Eye className="h-4 w-4" />
                </Button>
                {budget.status === 'Draft' && (
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(budget)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBudgets.length === 0 && (
        <Card className="border-border">
          <CardContent className="text-center py-10">
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No budgets found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first budget.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}