import React, { useState } from 'react';
import { Building2, Ship, Filter, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Mock data for vessels and periods
const mockVessels = [
  { id: 'vessel-001', name: 'MV SRIWANGI II', companyId: 'company-001' },
  { id: 'vessel-002', name: 'MV Sinar Harapan', companyId: 'company-001' },
  { id: 'vessel-003', name: 'TB Nusantara', companyId: 'company-001' },
];

const mockPeriods = [
  { id: 'period-001', period: '2025-06', label: 'June 2025' },
  { id: 'period-002', period: '2025-05', label: 'May 2025' },
  { id: 'period-003', period: '2025-04', label: 'April 2025' },
];

// Mock data for cost outside budget details
const mockCostDetails = [
  {
    transactionDate: '30/06/2025',
    narration: 'DBN009104/25, CHARTERER PROVISION CONSUMPTION (USD), SEACHEF, FOR THE MONTH OF JUNE 2025',
    voucherNo: '',
    transCurr: 'USD',
    transAmount: 250.93,
    exDiff: 1.0000,
    net: 250.93,
    coaCode: '6000491013',
    coaName: 'OPERATION COSTS - CHARTERER\'S ACCOUNT'
  },
  {
    transactionDate: '30/06/2025',
    narration: 'CHARTERER\'S SLOPCHEST CONSUMPTION - JUNE 2025',
    voucherNo: '',
    transCurr: 'USD',
    transAmount: 296.75,
    exDiff: 1.0000,
    net: 296.75,
    coaCode: '6000491013',
    coaName: 'OPERATION COSTS - CHARTERER\'S ACCOUNT'
  },
  {
    transactionDate: '01/06/2025',
    narration: 'HANSEATIC MARITIME HEALTH HMH GMBH - ANNUAL FLAT FEE AS PER CONSULTANT SERVICE AGREEMENT ENTERED INTO AS OF 01/01/2024, DISB/001486/25',
    voucherNo: '',
    transCurr: 'USD',
    transAmount: -1600.00,
    exDiff: 1.0000,
    net: -1600.00,
    coaCode: '6503211019',
    coaName: 'OPERATION COSTS OWNERS A/C - NON TECHNICAL ITEMS'
  },
  {
    transactionDate: '30/06/2025',
    narration: 'EXTRA CREW LUMPSUM COSTS - OS FANTONIAL, D CLIENT FOR MAY 1 TO 25, 2025',
    voucherNo: '',
    transCurr: 'USD',
    transAmount: 652.50,
    exDiff: 1.0000,
    net: 652.50,
    coaCode: '6503211018',
    coaName: 'OPERATION COSTS - OWNER\'S ACCOUNT'
  },
  {
    transactionDate: '30/06/2025',
    narration: 'EXTRA CREW PROVISION CONSUMPTION - OS FANTONIAL, D CLIENT FOR MAY 1 TO 25, 2025',
    voucherNo: '',
    transCurr: 'USD',
    transAmount: 212.50,
    exDiff: 1.0000,
    net: 212.50,
    coaCode: '6503211018',
    coaName: 'OPERATION COSTS - OWNER\'S ACCOUNT'
  },
  {
    transactionDate: '30/06/2025',
    narration: 'EXTRA CREW LUMPSUM COSTS - JUNIOR OFFICER TAMPI, A CHRISTOPHER FOR MAY 2025',
    voucherNo: '',
    transCurr: 'USD',
    transAmount: 973.40,
    exDiff: 1.0000,
    net: 973.40,
    coaCode: '6503211018',
    coaName: 'OPERATION COSTS - OWNER\'S ACCOUNT'
  },
  {
    transactionDate: '30/06/2025',
    narration: 'EXTRA CREW PROVISION CONSUMPTION - JUNIOR OFFICER TAMPI, A CHRISTOPHER FOR MAY 2025',
    voucherNo: '',
    transCurr: 'USD',
    transAmount: 263.50,
    exDiff: 1.0000,
    net: 263.50,
    coaCode: '6503211018',
    coaName: 'OPERATION COSTS - OWNER\'S ACCOUNT'
  }
];

const formatCurrency = (amount: number) => {
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);
  
  if (amount < 0) {
    return `(${formatted})`;
  }
  return formatted;
};


export default function Dashboard() {
  const [selectedVessel, setSelectedVessel] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  // Filter data based on selection
  const filteredData = mockCostDetails.filter(() => {
    if (!selectedVessel || !selectedPeriod) return false;
    return true; // In real app, filter based on vessel and period
  });

  // Group data by COA code for subtotals
  const groupedData = filteredData.reduce((acc, item) => {
    const key = item.coaCode;
    if (!acc[key]) {
      acc[key] = {
        coaCode: item.coaCode,
        coaName: item.coaName,
        items: [],
        total: 0
      };
    }
    acc[key].items.push(item);
    acc[key].total += item.net;
    return acc;
  }, {} as Record<string, any>);

  const selectedVesselName = mockVessels.find(v => v.id === selectedVessel)?.name || '';
  const selectedPeriodLabel = mockPeriods.find(p => p.id === selectedPeriod)?.label || '';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Cost Analysis - Outside Budget Report</p>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Vessel *</label>
              <Select value={selectedVessel} onValueChange={setSelectedVessel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vessel" />
                </SelectTrigger>
                <SelectContent>
                  {mockVessels.map((vessel) => (
                    <SelectItem key={vessel.id} value={vessel.id}>
                      {vessel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Monthly Budget Period *</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {mockPeriods.map((period) => (
                    <SelectItem key={period.id} value={period.id}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Details Report */}
      {selectedVessel && selectedPeriod && (
        <Card className="border-border">
          <CardHeader>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-foreground">{selectedVesselName}</h3>
              <h4 className="text-lg font-semibold text-foreground">
                LIST OF COST OUTSIDE BUDGET FOR {selectedPeriodLabel.toUpperCase()}
              </h4>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-border">
                    <TableHead className="text-center font-bold text-foreground border-r border-border">Transaction Date</TableHead>
                    <TableHead className="text-center font-bold text-foreground border-r border-border">Narration</TableHead>
                    <TableHead className="text-center font-bold text-foreground border-r border-border">Voucher No.</TableHead>
                    <TableHead className="text-center font-bold text-foreground border-r border-border">Trans. Curr.</TableHead>
                    <TableHead className="text-center font-bold text-foreground border-r border-border">Trans. Amount</TableHead>
                    <TableHead className="text-center font-bold text-foreground border-r border-border">Ex Diff</TableHead>
                    <TableHead className="text-center font-bold text-foreground">Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.values(groupedData).map((group: any) => (
                    <React.Fragment key={group.coaCode}>
                      {/* COA Header Row */}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={7} className="font-bold text-foreground p-2">
                          {group.coaCode} {group.coaName}
                        </TableCell>
                      </TableRow>
                      
                      {/* Detail Rows */}
                      {group.items.map((item: any, index: number) => (
                        <TableRow key={`${group.coaCode}-${index}`} className="border-b border-border/50">
                          <TableCell className="text-center border-r border-border/50 py-1 px-2">
                            {item.transactionDate}
                          </TableCell>
                          <TableCell className="border-r border-border/50 py-1 px-2 text-sm">
                            {item.narration}
                          </TableCell>
                          <TableCell className="text-center border-r border-border/50 py-1 px-2">
                            {item.voucherNo}
                          </TableCell>
                          <TableCell className="text-center border-r border-border/50 py-1 px-2">
                            {item.transCurr}
                          </TableCell>
                          <TableCell className="text-right border-r border-border/50 py-1 px-2">
                            {formatCurrency(item.transAmount)}
                          </TableCell>
                          <TableCell className="text-right border-r border-border/50 py-1 px-2">
                            {item.exDiff.toFixed(4)}
                          </TableCell>
                          <TableCell className="text-right py-1 px-2">
                            {formatCurrency(item.net)}
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Subtotal Row */}
                      <TableRow className="border-b-2 border-border">
                        <TableCell colSpan={6} className="text-right font-bold py-2 px-2"></TableCell>
                        <TableCell className="text-right font-bold py-2 px-2 bg-muted/30">
                          {formatCurrency(group.total)}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {(!selectedVessel || !selectedPeriod) && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Ship className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Select Vessel and Period</h3>
            <p className="text-muted-foreground text-center">
              Please select a vessel and monthly budget period to view the cost details report.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}