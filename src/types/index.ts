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
  coaCode: string;
  coaName: string;
  companyId: string;
  vendorCoaCode: string;
  parentCOAId?: string;
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
  coaId: string;
  budgetAmount: number;
  notes?: string;
  coa?: ChartOfAccount;
}

export interface ExpenseHeader {
  id: string;
  companyId: string;
  vesselId: string;
  vendorId: string;
  period: string; // YYYY-MM format
  currency: string;
  totalExpense: number;
  status: 'Draft' | 'Submitted' | 'Reviewed' | 'Approved' | 'Rejected';
  createdBy: string;
  createdDate: string;
  company?: Company;
  vessel?: Vessel;
  vendor?: Vendor;
  expenseDetails?: ExpenseDetail[];
}

export interface ExpenseDetail {
  id: string;
  expenseId: string;
  coaId: string;
  description: string;
  expenseDate: string;
  amount: number;
  supportingDoc?: string; // URL/link to supporting document
  budgetFlag: 'Within Budget' | 'Out of Budget';
  coa?: ChartOfAccount;
}

export interface DebitNoteHeader {
  id: string;
  expenseId: string;
  companyId: string;
  vesselId: string;
  vendorId: string;
  debitNoteNo: string; // auto generate
  debitNoteDate: string;
  totalAmount: number; // over budget amount
  status: 'Draft' | 'Submitted' | 'Approved' | 'Paid' | 'Rejected';
  linkedAPDoc?: string; // SAP connection
  company?: Company;
  vessel?: Vessel;
  vendor?: Vendor;
  expense?: ExpenseHeader;
  debitNoteDetails?: DebitNoteDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface DebitNoteDetail {
  id: string;
  debitNoteId: string;
  expenseDetailId: string;
  categoryId: string;
  description: string;
  amount: number;
  expenseDetail?: ExpenseDetail;
  coa?: ChartOfAccount;
}

export type FormMode = 'create' | 'edit' | 'view';

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}