import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartOfAccount, FormMode } from '@/types';
import AccountForm from './AccountForm';
import { cn } from '@/lib/utils';

// Mock data with hierarchy
const mockAccounts: ChartOfAccount[] = [
  {
    id: '1',
    coaCode: 'FUEL',
    coaName: 'Fuel & Lubricants',
    companyId: '1',
    vendorCoaCode: 'VND-FUEL',
    status: 'Active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    children: [
      {
        id: '11',
        coaCode: 'FUEL-MDO',
        coaName: 'Marine Diesel Oil',
        companyId: '1',
        vendorCoaCode: 'VND-MDO',
        parentCOAId: '1',
        status: 'Active',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
      },
      {
        id: '12',
        coaCode: 'FUEL-LUB',
        coaName: 'Lubricating Oil',
        companyId: '1',
        vendorCoaCode: 'VND-LUB',
        parentCOAId: '1',
        status: 'Active',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
      },
    ],
  },
  {
    id: '2',
    coaCode: 'CREW',
    coaName: 'Crew Expenses',
    companyId: '1',
    vendorCoaCode: 'VND-CREW',
    status: 'Active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    children: [
      {
        id: '21',
        coaCode: 'CREW-SAL',
        coaName: 'Crew Salaries',
        companyId: '1',
        vendorCoaCode: 'VND-SAL',
        parentCOAId: '2',
        status: 'Active',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10',
      },
      {
        id: '22',
        coaCode: 'CREW-FOD',
        coaName: 'Crew Food & Provisions',
        companyId: '1',
        vendorCoaCode: 'VND-FOD',
        parentCOAId: '2',
        status: 'Active',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10',
      },
    ],
  },
  {
    id: '3',
    coaCode: 'MAINT',
    coaName: 'Maintenance',
    companyId: '1',
    vendorCoaCode: 'VND-MAINT',
    status: 'Active',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
  },
  {
    id: '4',
    coaCode: 'INS',
    coaName: 'Insurance',
    companyId: '1',
    vendorCoaCode: 'VND-INS',
    status: 'Active',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
  },
];

interface AccountItemProps {
  account: ChartOfAccount;
  level: number;
  onEdit: (account: ChartOfAccount) => void;
  onView: (account: ChartOfAccount) => void;
  onDelete: (account: ChartOfAccount) => void;
}

function AccountItem({ account, level, onEdit, onView, onDelete }: AccountItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = account.children && account.children.length > 0;

  return (
    <>
      <Card className={cn("border-border hover:shadow-sm transition-shadow", level > 0 && "ml-6")}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 h-6 w-6"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <div className="w-6" />
              )}
              
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {account.coaCode}
                  </span>
                  <span className="font-semibold text-foreground">{account.coaName}</span>
                  <Badge 
                    variant={account.status === 'Active' ? 'default' : 'secondary'}
                    className={account.status === 'Active' ? 'bg-success text-success-foreground' : ''}
                  >
                    {account.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => onView(account)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(account)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(account)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Render children */}
      {hasChildren && isExpanded && (
        <div className="space-y-2 mt-2">
          {account.children!.map((child) => (
            <AccountItem
              key={child.id}
              account={child}
              level={level + 1}
              onEdit={onEdit}
              onView={onView}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function AccountList() {
  const [accounts] = useState<ChartOfAccount[]>(mockAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = (acc: ChartOfAccount): boolean => {
      const matches = acc.coaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     acc.coaCode.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (matches) return true;
      
      // Check children
      if (acc.children) {
        return acc.children.some(child => matchesSearch(child));
      }
      
      return false;
    };
    
    return searchTerm === '' || matchesSearch(account);
  });

  const handleCreate = () => {
    setFormMode('create');
    setSelectedAccount(null);
    setShowForm(true);
  };

  const handleEdit = (account: ChartOfAccount) => {
    setFormMode('edit');
    setSelectedAccount(account);
    setShowForm(true);
  };

  const handleView = (account: ChartOfAccount) => {
    setFormMode('view');
    setSelectedAccount(account);
    setShowForm(true);
  };

  const handleDelete = (account: ChartOfAccount) => {
    // Handle delete logic here
    console.log('Delete account:', account);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedAccount(null);
  };

  if (showForm) {
    return (
      <AccountForm
        mode={formMode}
        account={selectedAccount}
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
          <h2 className="text-2xl font-bold text-foreground">Chart of Accounts</h2>
          <p className="text-muted-foreground">Manage expense categories for budgeting</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Accounts hierarchy */}
      <div className="space-y-3">
        {filteredAccounts.map((account) => (
          <AccountItem
            key={account.id}
            account={account}
            level={0}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <Card className="border-border">
          <CardContent className="text-center py-10">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first expense category.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}