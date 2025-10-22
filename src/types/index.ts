export interface Company {
  id: string;
  companyCode: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CompanyCOA {
  id: string;
  companyId: string;
  coaCode: string;
  coaName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vessel {
  id: string;
  vesselCode: string;
  vesselName: string;
  imoNumber?: string;
  ownedByCompanyId: string;
  vesselType: string;
  buildYear: number;
  status: 'Active' | 'Inactive';
  company?: Company;
  vendors?: VesselVendor[]; // Many-to-many relationship
  createdAt: string;
  updatedAt: string;
}

export interface VesselVendor {
  id: string;
  vesselId: string;
  vendorId: string;
  isPrimary: boolean;
  vessel?: Vessel;
  vendor?: Vendor;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  vendorCode: string;
  vendorName: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface VendorCOA {
  id: string;
  vendorId: string;
  vendorCoaCode: string;
  vendorCoaName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface COAMapping {
  id: string;
  companyCoaId: string;
  vendorCoaId: string;
  companyId: string;
  vendorId: string;
  relationshipType: 'Equivalent' | 'Mapping';
  companyCOA?: CompanyCOA;
  vendorCOA?: VendorCOA;
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

export interface YearlyBudgetHeader {
  id: string;
  companyId: string;
  vesselId: string;
  year: string; // YYYY format
  currency: string;
  totalBudget: number;
  usedBudget: number; // Sum of all monthly budgets
  remainingBudget: number; // totalBudget - usedBudget
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Closed';
  createdBy: string;
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;
  company?: Company;
  vessel?: Vessel;
}

export interface BudgetHeader {
  id: string;
  yearlyBudgetId?: string; // Reference to yearly budget
  companyId: string;
  vesselId: string;
  period: string; // YYYY-MM format
  budgetType: 'Monthly';
  currency: string;
  totalBudget: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Closed';
  createdBy: string;
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;
  company?: Company;
  vessel?: Vessel;
  yearlyBudget?: YearlyBudgetHeader;
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
  vendorInvoiceNo: string; // vendor invoice number
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
  subVendor?: string;
  invoiceNo?: string;
  description: string;
  amount: number;
  expenseDetail?: ExpenseDetail;
  coa?: ChartOfAccount;
}

export interface DebitNotePayment {
  id: string;
  debitNoteId: string;
  paymentDate: string;
  referenceAPNo: string;
  outgoingPaymentNo: string;
  paymentAmount: number;
  currency: string;
  status: 'Pending' | 'Completed' | 'Failed';
  notes?: string;
  debitNote?: DebitNoteHeader;
  createdAt: string;
  updatedAt: string;
}

export type FormMode = 'create' | 'edit' | 'view';

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}