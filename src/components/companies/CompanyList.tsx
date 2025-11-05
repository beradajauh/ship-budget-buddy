import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Building2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Company, FormMode } from '@/types';
import CompanyForm from './CompanyForm';
import CompanyCOAManagementDialog from './CompanyCOAManagementDialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock data
const mockCompanies: Company[] = [
  {
    id: '1',
    companyCode: 'PT001',
    companyName: 'PT Pelayaran Nusantara',
    address: 'Jl. Sudirman No. 123, Jakarta',
    phone: '+62 21 1234567',
    email: 'contact@pelayaran.com',
    status: 'Active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    companyCode: 'PT002',
    companyName: 'PT Samudera Jaya',
    address: 'Jl. Thamrin No. 456, Jakarta',
    phone: '+62 21 7654321',
    email: 'info@samudera.com',
    status: 'Active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
];

export default function CompanyList() {
  const [companies, setCompanies] = useLocalStorage<Company[]>('companies', mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showCoaManagement, setShowCoaManagement] = useState(false);
  const [selectedCompanyForCoa, setSelectedCompanyForCoa] = useState<Company | null>(null);

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.companyCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormMode('create');
    setSelectedCompany(null);
    setShowForm(true);
  };

  const handleEdit = (company: Company) => {
    setFormMode('edit');
    setSelectedCompany(company);
    setShowForm(true);
  };

  const handleView = (company: Company) => {
    setFormMode('view');
    setSelectedCompany(company);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedCompany(null);
  };

  const handleManageCoa = (company: Company) => {
    setSelectedCompanyForCoa(company);
    setShowCoaManagement(true);
  };

  const handleSave = (companyData: Company) => {
    if (formMode === 'create') {
      const newCompany: Company = {
        ...companyData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCompanies([...companies, newCompany]);
    } else if (formMode === 'edit' && selectedCompany) {
      setCompanies(companies.map(c => 
        c.id === selectedCompany.id 
          ? { ...companyData, id: selectedCompany.id, updatedAt: new Date().toISOString() }
          : c
      ));
    }
    handleFormClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      setCompanies(companies.filter(c => c.id !== id));
    }
  };

  if (showForm) {
    return (
      <CompanyForm
        mode={formMode}
        company={selectedCompany}
        onClose={handleFormClose}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Companies</h2>
          <p className="text-muted-foreground">Manage your subsidiary companies</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Companies table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Company List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Code</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.companyCode}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{company.companyName}</div>
                      <div className="text-sm text-muted-foreground">{company.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>{company.phone}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={company.status === 'Active' ? 'default' : 'secondary'}
                      className={company.status === 'Active' ? 'bg-success text-success-foreground' : ''}
                    >
                      {company.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleManageCoa(company)}
                        title="Master COA Company"
                      >
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleView(company)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(company)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(company.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-10">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No companies found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first company.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* COA Management Dialog */}
      {showCoaManagement && selectedCompanyForCoa && (
        <CompanyCOAManagementDialog
          companyId={selectedCompanyForCoa.id}
          companyName={selectedCompanyForCoa.companyName}
          open={showCoaManagement}
          onClose={() => {
            setShowCoaManagement(false);
            setSelectedCompanyForCoa(null);
          }}
        />
      )}
    </div>
  );
}