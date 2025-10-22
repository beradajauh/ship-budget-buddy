import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { YearlyBudgetHeader, FormMode } from '@/types';
import YearlyBudgetForm from './YearlyBudgetForm';
import { Progress } from '@/components/ui/progress';

// Mock data
const mockYearlyBudgets: YearlyBudgetHeader[] = [
  {
    id: '1',
    companyId: '1',
    vesselId: '1',
    year: '2024',
    currency: 'USD',
    totalBudget: 1500000,
    usedBudget: 375000,
    remainingBudget: 1125000,
    status: 'Approved',
    createdBy: 'admin',
    createdDate: '2023-12-15',
    approvedBy: 'manager',
    approvedDate: '2023-12-20',
    company: { id: '1', companyName: 'PT Pelayaran Nusantara' } as any,
    vessel: { id: '1', vesselName: 'MV Sinar Harapan', vesselCode: 'MV001' } as any,
  },
  {
    id: '2',
    companyId: '2',
    vesselId: '2',
    year: '2024',
    currency: 'USD',
    totalBudget: 1020000,
    usedBudget: 170000,
    remainingBudget: 850000,
    status: 'Approved',
    createdBy: 'admin',
    createdDate: '2023-12-10',
    approvedBy: 'manager',
    approvedDate: '2023-12-18',
    company: { id: '2', companyName: 'PT Samudera Jaya' } as any,
    vessel: { id: '2', vesselName: 'TB Nusantara', vesselCode: 'TB002' } as any,
  },
  {
    id: '3',
    companyId: '1',
    vesselId: '1',
    year: '2025',
    currency: 'USD',
    totalBudget: 1800000,
    usedBudget: 0,
    remainingBudget: 1800000,
    status: 'Draft',
    createdBy: 'admin',
    createdDate: '2024-11-01',
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

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function YearlyBudgetList() {
  const [budgets] = useState<YearlyBudgetHeader[]>(mockYearlyBudgets);
  const [searchTerm, setSearchTerm] = useState('');
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedBudget, setSelectedBudget] = useState<YearlyBudgetHeader | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredBudgets = budgets.filter(budget =>
    budget.vessel?.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.company?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.year.includes(searchTerm)
  );

  const handleCreate = () => {
    setFormMode('create');
    setSelectedBudget(null);
    setShowForm(true);
  };

  const handleEdit = (budget: YearlyBudgetHeader) => {
    setFormMode('edit');
    setSelectedBudget(budget);
    setShowForm(true);
  };

  const handleView = (budget: YearlyBudgetHeader) => {
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
      <YearlyBudgetForm
        mode={formMode}
        budget={selectedBudget}
        onClose={handleFormClose}
        onSave={() => {
          handleFormClose();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Yearly Budget Management</h2>
          <p className="text-muted-foreground">Manage annual vessel budgets and track monthly allocations</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Create Yearly Budget
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search yearly budgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Yearly Budget List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Vessel</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Total Budget</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => {
                const utilizationPercent = budget.totalBudget > 0 
                  ? (budget.usedBudget / budget.totalBudget) * 100 
                  : 0;
                
                return (
                  <TableRow key={budget.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold text-lg">{budget.year}</span>
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
                    <TableCell className="text-warning">
                      {formatCurrency(budget.usedBudget, budget.currency)}
                    </TableCell>
                    <TableCell className="text-success font-semibold">
                      {formatCurrency(budget.remainingBudget, budget.currency)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={utilizationPercent} className="h-2" />
                        <span className="text-xs text-muted-foreground">
                          {utilizationPercent.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(budget.status)}>
                        {budget.status}
                      </Badge>
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
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredBudgets.length === 0 && (
            <div className="text-center py-10">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No yearly budgets found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first yearly budget.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
