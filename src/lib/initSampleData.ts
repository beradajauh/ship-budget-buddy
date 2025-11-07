import { Vendor, VendorCOA, CompanyCOA } from '@/types';

export const initSampleData = () => {
  // Sample Vendors
  const vendors: Vendor[] = [
    {
      id: 'vendor-1',
      vendorCode: 'VND001',
      vendorName: 'PT Sumber Jaya Marine',
      address: 'Jl. Pelabuhan No. 45, Surabaya',
      phone: '+62 31 8888888',
      email: 'info@sumberjaya.com',
      taxId: '01.234.567.8-901.000',
      status: 'Active',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
    },
    {
      id: 'vendor-2',
      vendorCode: 'VND002',
      vendorName: 'PT MBS',
      address: 'Jl. Laut No. 78, Jakarta',
      phone: '+62 21 9999999',
      email: 'contact@mbs.com',
      taxId: '02.345.678.9-012.000',
      status: 'Active',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12',
    },
    {
      id: 'vendor-3',
      vendorCode: 'VND003',
      vendorName: 'PT Bahari Sejahtera',
      address: 'Jl. Pantai No. 12, Makassar',
      phone: '+62 411 7777777',
      email: 'admin@baharisejahtera.com',
      taxId: '03.456.789.0-123.000',
      status: 'Active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
  ];

  // Sample Vendor COAs for Vendor 1
  const vendorCOAs1: VendorCOA[] = [
    {
      id: 'vcoa-1-1',
      vendorId: 'vendor-1',
      vendorCoaCode: 'V-4100',
      vendorCoaName: 'Fuel & Lubricants',
      description: 'Biaya bahan bakar dan pelumas',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
    },
    {
      id: 'vcoa-1-2',
      vendorId: 'vendor-1',
      vendorCoaCode: 'V-4200',
      vendorCoaName: 'Spare Parts',
      description: 'Biaya suku cadang kapal',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
    },
    {
      id: 'vcoa-1-3',
      vendorId: 'vendor-1',
      vendorCoaCode: 'V-4300',
      vendorCoaName: 'Maintenance Services',
      description: 'Jasa perawatan dan perbaikan',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
    },
  ];

  // Sample Vendor COAs for Vendor 2
  const vendorCOAs2: VendorCOA[] = [
    {
      id: 'vcoa-2-1',
      vendorId: 'vendor-2',
      vendorCoaCode: 'V-5100',
      vendorCoaName: 'Crew Provisions',
      description: 'Biaya logistik kru kapal',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12',
    },
    {
      id: 'vcoa-2-2',
      vendorId: 'vendor-2',
      vendorCoaCode: 'V-5200',
      vendorCoaName: 'Safety Equipment',
      description: 'Peralatan keselamatan kapal',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12',
    },
  ];

  // Sample Vendor COAs for Vendor 3
  const vendorCOAs3: VendorCOA[] = [
    {
      id: 'vcoa-3-1',
      vendorId: 'vendor-3',
      vendorCoaCode: 'V-6100',
      vendorCoaName: 'Port Services',
      description: 'Biaya jasa pelabuhan',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
    {
      id: 'vcoa-3-2',
      vendorId: 'vendor-3',
      vendorCoaCode: 'V-6200',
      vendorCoaName: 'Insurance',
      description: 'Biaya asuransi kapal',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
  ];

  // Sample Company COAs (default for any company)
  const getDefaultCompanyCOAs = (companyId: string): CompanyCOA[] => [
    {
      id: `ccoa-${companyId}-1`,
      companyId: companyId,
      coaCode: 'C-5100',
      coaName: 'Operating Expenses - Fuel',
      description: 'Biaya operasional bahan bakar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: `ccoa-${companyId}-2`,
      companyId: companyId,
      coaCode: 'C-5200',
      coaName: 'Operating Expenses - Maintenance',
      description: 'Biaya operasional perawatan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: `ccoa-${companyId}-3`,
      companyId: companyId,
      coaCode: 'C-5300',
      coaName: 'Operating Expenses - Crew',
      description: 'Biaya operasional kru',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: `ccoa-${companyId}-4`,
      companyId: companyId,
      coaCode: 'C-5400',
      coaName: 'Operating Expenses - Port',
      description: 'Biaya operasional pelabuhan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: `ccoa-${companyId}-5`,
      companyId: companyId,
      coaCode: 'C-5500',
      coaName: 'Operating Expenses - Insurance',
      description: 'Biaya operasional asuransi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: `ccoa-${companyId}-6`,
      companyId: companyId,
      coaCode: 'C-6100',
      coaName: 'Spare Parts & Equipment',
      description: 'Biaya suku cadang dan peralatan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Check if data already exists
  const existingVendors = localStorage.getItem('vendors');
  if (!existingVendors) {
    localStorage.setItem('vendors', JSON.stringify(vendors));
    console.log('✓ Vendors data initialized');
  } else {
    // Update existing vendors data to ensure consistency
    localStorage.setItem('vendors', JSON.stringify(vendors));
    console.log('✓ Vendors data updated');
  }

  // Initialize vendor COAs - ALWAYS update to ensure fresh data
  localStorage.setItem('vendorCOA_vendor-1', JSON.stringify(vendorCOAs1));
  localStorage.setItem('vendorCOA_vendor-2', JSON.stringify(vendorCOAs2));
  localStorage.setItem('vendorCOA_vendor-3', JSON.stringify(vendorCOAs3));
  console.log('✓ Vendor COAs initialized for all vendors');
  console.log('  - vendorCOA_vendor-1 (PT Sumber Jaya Marine):', vendorCOAs1.length, 'items');
  console.log('  - vendorCOA_vendor-2 (PT MBS):', vendorCOAs2.length, 'items');
  console.log('  - vendorCOA_vendor-3 (PT Bahari Sejahtera):', vendorCOAs3.length, 'items');

  // Initialize company COAs - ALWAYS setup for mock companies used in Budget Form
  const mockCompanyIds = ['1', '2']; // IDs from mockCompanies in BudgetForm
  mockCompanyIds.forEach(companyId => {
    const coaKey = `companyCOA_${companyId}`;
    localStorage.setItem(coaKey, JSON.stringify(getDefaultCompanyCOAs(companyId)));
  });
  console.log('✓ Company COAs initialized for mock companies');
  console.log('  - companyCOA_1 (PT Pelayaran Nusantara):', getDefaultCompanyCOAs('1').length, 'items');
  console.log('  - companyCOA_2 (PT Samudera Jaya):', getDefaultCompanyCOAs('2').length, 'items');

  // Initialize company COAs for any other existing companies in localStorage
  const existingCompanies = localStorage.getItem('companies');
  if (existingCompanies) {
    const companies = JSON.parse(existingCompanies);
    companies.forEach((company: any) => {
      // Skip if already initialized above
      if (!mockCompanyIds.includes(company.id)) {
        const coaKey = `companyCOA_${company.id}`;
        localStorage.setItem(coaKey, JSON.stringify(getDefaultCompanyCOAs(company.id)));
        console.log(`  - companyCOA_${company.id}:`, getDefaultCompanyCOAs(company.id).length, 'items');
      }
    });
  }

  console.log('Sample data initialized successfully!');
};
