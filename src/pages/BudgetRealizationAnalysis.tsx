import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function BudgetRealizationAnalysis() {
  const budgetRealizations = [
    { company: 'PT Samudra Jaya', vessel: 'MV Ocean Star', budget: 125000, realization: 98000, variance: 27000, percentage: 78 },
    { company: 'PT Maritim Nusantara', vessel: 'MV Sea Explorer', budget: 150000, realization: 145000, variance: 5000, percentage: 97 },
    { company: 'PT Samudra Jaya', vessel: 'MV Wave Rider', budget: 180000, realization: 165000, variance: 15000, percentage: 92 },
    { company: 'PT Pelayaran Sejahtera', vessel: 'MV Blue Horizon', budget: 200000, realization: 175000, variance: 25000, percentage: 88 },
    { company: 'PT Maritim Nusantara', vessel: 'MV Pacific Dream', budget: 95000, realization: 92000, variance: 3000, percentage: 97 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Budget Realization Analysis</h2>
        <p className="text-muted-foreground">Analisa budget per PT dan kapal berdasarkan realisasi vendor</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget vs Realization</CardTitle>
          <CardDescription>Perbandingan budget dan realisasi per company dan vessel</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Vessel</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Realization</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetRealizations.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.company}</TableCell>
                  <TableCell>{item.vessel}</TableCell>
                  <TableCell>${item.budget.toLocaleString()}</TableCell>
                  <TableCell>${item.realization.toLocaleString()}</TableCell>
                  <TableCell className={item.variance > 0 ? 'text-green-600' : 'text-red-600'}>
                    ${item.variance.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.percentage >= 90 ? 'destructive' : 'secondary'}>
                      {item.percentage}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
