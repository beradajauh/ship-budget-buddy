import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseHeader, FormMode } from '@/types';
import ExpenseForm from './ExpenseForm';

// Mock data
const mockExpenses: ExpenseHeader[] = [
  {
    id: '1',
    companyId: '1',
    vesselId: '1',
    vendorId: '1',
    period: '2024-03',
    currency: 'USD',
    totalExpense: 118500,
    status: 'Approved',
    createdBy: 'vendor_admin',
    createdDate: '2024-03-25',
    company: { id: '1', companyName: 'PT Pelayaran Nusantara' } as any,
    vessel: { id: '1', vesselName: 'MV Sinar Harapan', vesselCode: 'MV001' } as any,
    vendor: { id: '1', vendorName: 'PT Marina Services' } as any,
  },
  {
    id: '2',
    companyId: '2',
    vesselId: '2',
    vendorId: '2',
    period: '2024-03',
    currency: 'USD',
    totalExpense: 89750,
    status: 'Submitted',
    createdBy: 'vendor_admin',
    createdDate: '2024-03-20',
    company: { id: '2', companyName: 'PT Samudera Jaya' } as any,
    vessel: { id: '2', vesselName: 'TB Nusantara', vesselCode: 'TB002' } as any,
    vendor: { id: '2', vendorName: 'PT Ocean Management' } as any,
  },
  {
    id: '3',
    companyId: '1',
    vesselId: '1',
    vendorId: '1',
    period: '2024-04',
    currency: 'USD',
    totalExpense: 0,
    status: 'Draft',
    createdBy: 'vendor_admin',
    createdDate: '2024-04-15',
    company: { id: '1', companyName: 'PT Pelayaran Nusantara' } as any,
    vessel: { id: '1', vesselName: 'MV Sinar Harapan', vesselCode: 'MV001' } as any,
    vendor: { id: '1', vendorName: 'PT Marina Services' } as any,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-success text-success-foreground';
    case 'Reviewed':
      return 'bg-accent text-accent-foreground';
    case 'Submitted':
      return 'bg-warning text-warning-foreground';
    case 'Draft':
      return 'bg-muted text-muted-foreground';
    case 'Rejected':
      return 'bg-destructive text-destructive-foreground';
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

export default function ExpenseList() {
  const [expenses] = useState<ExpenseHeader[]>(mockExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedExpense, setSelectedExpense] = useState<ExpenseHeader | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredExpenses = expenses.filter(expense =>
    expense.vessel?.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.company?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.vendor?.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.period.includes(searchTerm)
  );

  const handleCreate = () => {
    setFormMode('create');
    setSelectedExpense(null);
    setShowForm(true);
  };

  const handleEdit = (expense: ExpenseHeader) => {
    setFormMode('edit');
    setSelectedExpense(expense);
    setShowForm(true);
  };

  const handleView = (expense: ExpenseHeader) => {
    setFormMode('view');
    setSelectedExpense(expense);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedExpense(null);
  };

  if (showForm) {
    return (
      <ExpenseForm
        mode={formMode}
        expense={selectedExpense}
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
          <h2 className="text-2xl font-bold text-foreground">Budget Realization</h2>
          <p className="text-muted-foreground">Manage vessel budget realization from vendors</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Submit Realization
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search realizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Expenses table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Budget Realizations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Vessel</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Total Realization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatPeriod(expense.period)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{expense.vessel?.vesselName}</div>
                      <div className="text-sm text-muted-foreground">{expense.vessel?.vesselCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>{expense.company?.companyName}</TableCell>
                  <TableCell>{expense.vendor?.vendorName}</TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(expense.totalExpense, expense.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(expense.status)}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(expense.createdDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(expense)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {expense.status === 'Draft' && (
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(expense)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-10">
              <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No realizations found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by submitting your first realization.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}