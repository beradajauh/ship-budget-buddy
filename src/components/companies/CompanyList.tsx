import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Company, FormMode } from '@/types';
import CompanyForm from './CompanyForm';

// Mock data
const mockCompanies: Company[] = [
  {
    id: '1',
    companyCode: 'PT001',
    companyName: 'PT Pelayaran Nusantara',
    address: 'Jl. Sudirman No. 123, Jakarta',
    contactPerson: 'Ahmad Susanto',
    currency: 'USD',
    status: 'Active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    companyCode: 'PT002',
    companyName: 'PT Samudera Jaya',
    address: 'Jl. Thamrin No. 456, Jakarta',
    contactPerson: 'Siti Rahayu',
    currency: 'IDR',
    status: 'Active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
];

export default function CompanyList() {
  const [companies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showForm, setShowForm] = useState(false);

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

  if (showForm) {
    return (
      <CompanyForm
        mode={formMode}
        company={selectedCompany}
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

      {/* Companies grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">{company.companyCode}</CardTitle>
                <Badge 
                  variant={company.status === 'Active' ? 'default' : 'secondary'}
                  className={company.status === 'Active' ? 'bg-success text-success-foreground' : ''}
                >
                  {company.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">{company.companyName}</h3>
                <p className="text-sm text-muted-foreground mt-1">{company.address}</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contact:</span>
                <span className="text-foreground font-medium">{company.contactPerson}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Currency:</span>
                <span className="text-foreground font-medium">{company.currency}</span>
              </div>
              
              <div className="flex justify-end space-x-2 pt-3">
                <Button variant="ghost" size="sm" onClick={() => handleView(company)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(company)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card className="border-border">
          <CardContent className="text-center py-10">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No companies found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first company.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}