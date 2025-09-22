import { Building2, Ship, Users, FileText, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data for budget details with hierarchical COA
const mockBudgetDetails = [
  {
    budgetId: 'budget-001',
    period: '2024-01',
    companyName: 'Ocean Shipping Ltd',
    vesselName: 'MV Sinar Harapan',
    totalBudget: 500000,
    totalRealized: 450000,
    variance: 50000,
    status: 'Active',
    coaDetails: [
      {
        id: 'fuel-main',
        coaCode: 'FUEL',
        coaName: 'Fuel Costs',
        level: 1,
        budgetAmount: 200000,
        realizedAmount: 185000,
        variance: 15000,
        children: [
          {
            id: 'fuel-oil',
            coaCode: 'FUEL-001',
            coaName: 'Fuel Oil',
            level: 2,
            budgetAmount: 150000,
            realizedAmount: 140000,
            variance: 10000,
            children: []
          },
          {
            id: 'gas-oil',
            coaCode: 'FUEL-002',
            coaName: 'Gas Oil',
            level: 2,
            budgetAmount: 50000,
            realizedAmount: 45000,
            variance: 5000,
            children: []
          }
        ]
      },
      {
        id: 'crew-main',
        coaCode: 'CREW',
        coaName: 'Crew Expenses',
        level: 1,
        budgetAmount: 150000,
        realizedAmount: 155000,
        variance: -5000,
        children: [
          {
            id: 'crew-salary',
            coaCode: 'CREW-001',
            coaName: 'Basic Salary',
            level: 2,
            budgetAmount: 100000,
            realizedAmount: 100000,
            variance: 0,
            children: []
          },
          {
            id: 'crew-overtime',
            coaCode: 'CREW-002',
            coaName: 'Overtime Pay',
            level: 2,
            budgetAmount: 50000,
            realizedAmount: 55000,
            variance: -5000,
            children: []
          }
        ]
      },
      {
        id: 'maintenance',
        coaCode: 'MAINT',
        coaName: 'Maintenance',
        level: 1,
        budgetAmount: 100000,
        realizedAmount: 75000,
        variance: 25000,
        children: [
          {
            id: 'engine-maint',
            coaCode: 'MAINT-001',
            coaName: 'Engine Maintenance',
            level: 2,
            budgetAmount: 70000,
            realizedAmount: 50000,
            variance: 20000,
            children: []
          },
          {
            id: 'hull-maint',
            coaCode: 'MAINT-002',
            coaName: 'Hull Maintenance',
            level: 2,
            budgetAmount: 30000,
            realizedAmount: 25000,
            variance: 5000,
            children: []
          }
        ]
      }
    ]
  },
  {
    budgetId: 'budget-002',
    period: '2024-01',
    companyName: 'Ocean Shipping Ltd',
    vesselName: 'TB Nusantara',
    totalBudget: 300000,
    totalRealized: 320000,
    variance: -20000,
    status: 'Over Budget',
    coaDetails: [
      {
        id: 'fuel-main-2',
        coaCode: 'FUEL',
        coaName: 'Fuel Costs',
        level: 1,
        budgetAmount: 120000,
        realizedAmount: 135000,
        variance: -15000,
        children: [
          {
            id: 'fuel-oil-2',
            coaCode: 'FUEL-001',
            coaName: 'Fuel Oil',
            level: 2,
            budgetAmount: 90000,
            realizedAmount: 100000,
            variance: -10000,
            children: []
          },
          {
            id: 'gas-oil-2',
            coaCode: 'FUEL-002',
            coaName: 'Gas Oil',
            level: 2,
            budgetAmount: 30000,
            realizedAmount: 35000,
            variance: -5000,
            children: []
          }
        ]
      }
    ]
  }
];

const stats = [
  {
    name: 'Total Companies',
    value: '8',
    icon: Building2,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    name: 'Active Vessels',
    value: '12',
    icon: Ship,
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    name: 'Total Budget This Month',
    value: '$800K',
    icon: DollarSign,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    name: 'Budget Variance',
    value: '+$30K',
    icon: TrendingUp,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getVarianceColor = (variance: number) => {
  if (variance > 0) return 'text-success';
  if (variance < 0) return 'text-destructive';
  return 'text-muted-foreground';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-success text-success-foreground';
    case 'Over Budget': return 'bg-destructive text-destructive-foreground';
    case 'Under Budget': return 'bg-warning text-warning-foreground';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

const renderCoaRow = (coa: any, budgetId: string) => {
  const rows = [];
  
  // Main COA row
  rows.push(
    <TableRow key={`${budgetId}-${coa.id}`} className={coa.level === 1 ? 'font-medium bg-muted/50' : ''}>
      <TableCell style={{ paddingLeft: `${(coa.level - 1) * 20 + 16}px` }}>
        {coa.coaCode} - {coa.coaName}
      </TableCell>
      <TableCell>{formatCurrency(coa.budgetAmount)}</TableCell>
      <TableCell>{formatCurrency(coa.realizedAmount)}</TableCell>
      <TableCell className={getVarianceColor(coa.variance)}>
        {formatCurrency(Math.abs(coa.variance))} {coa.variance >= 0 ? '(Under)' : '(Over)'}
      </TableCell>
    </TableRow>
  );
  
  // Children rows
  coa.children?.forEach((child: any) => {
    rows.push(...renderCoaRow(child, budgetId));
  });
  
  return rows;
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your ship management system</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Budget Details */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Monthly Budget Details - January 2024
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockBudgetDetails.map((budget) => (
              <div key={budget.budgetId} className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">{budget.vesselName}</h4>
                    <p className="text-sm text-muted-foreground">{budget.companyName}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Budget</p>
                      <p className="font-semibold">{formatCurrency(budget.totalBudget)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Realized</p>
                      <p className="font-semibold">{formatCurrency(budget.totalRealized)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Variance</p>
                      <p className={`font-semibold ${getVarianceColor(budget.variance)}`}>
                        {formatCurrency(Math.abs(budget.variance))} {budget.variance >= 0 ? '(Under)' : '(Over)'}
                      </p>
                    </div>
                    <Badge className={getStatusColor(budget.status)}>
                      {budget.status}
                    </Badge>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chart of Account</TableHead>
                      <TableHead>Budget Amount</TableHead>
                      <TableHead>Realized Amount</TableHead>
                      <TableHead>Variance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budget.coaDetails.map((coa) => renderCoaRow(coa, budget.budgetId))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Budget approved for MV Sinar Harapan</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Debit note created for TB Nusantara</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Over-budget alert: Crew expenses</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Monthly report submitted</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">TB Nusantara - Fuel Costs</p>
                  <p className="text-xs text-muted-foreground">11% over budget</p>
                </div>
                <Badge className="bg-destructive text-destructive-foreground">
                  Over Budget
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">MV Sinar Harapan - Crew Overtime</p>
                  <p className="text-xs text-muted-foreground">10% over budget</p>
                </div>
                <Badge className="bg-warning text-warning-foreground">
                  Warning
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">MV Sinar Harapan - Maintenance</p>
                  <p className="text-xs text-muted-foreground">25% under budget</p>
                </div>
                <Badge className="bg-success text-success-foreground">
                  Under Budget
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}