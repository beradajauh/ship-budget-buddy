export interface Company {
  id: string;
  companyCode: string;
  companyName: string;
  address: string;
  contactPerson: string;
  currency: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Vessel {
  id: string;
  vesselCode: string;
  vesselName: string;
  imoNumber?: string;
  ownedByCompanyId: string;
  managedByVendorId: string;
  vesselType: string;
  buildYear: number;
  status: 'Active' | 'Inactive';
  company?: Company;
  vendor?: Vendor;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  vendorCode: string;
  vendorName: string;
  address: string;
  contactPerson: string;
  bankAccountInfo: string;
  taxId: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ChartOfAccount {
  id: string;
  categoryCode: string;
  categoryName: string;
  parentCategoryId?: string;
  status: 'Active' | 'Inactive';
  children?: ChartOfAccount[];
  parent?: ChartOfAccount;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetHeader {
  id: string;
  companyId: string;
  vesselId: string;
  period: string; // YYYY-MM format
  currency: string;
  totalBudget: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Closed';
  createdBy: string;
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;
  company?: Company;
  vessel?: Vessel;
  budgetDetails?: BudgetDetail[];
}

export interface BudgetDetail {
  id: string;
  budgetId: string;
  categoryId: string;
  budgetAmount: number;
  notes?: string;
  category?: ChartOfAccount;
}

export type FormMode = 'create' | 'edit' | 'view';

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}