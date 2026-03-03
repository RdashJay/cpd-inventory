import React from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { CATEGORIES } from '@/types/inventory';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileBarChart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CHART_COLORS = [
  'hsl(174, 62%, 40%)', 'hsl(215, 50%, 23%)', 'hsl(38, 92%, 50%)',
  'hsl(152, 60%, 40%)', 'hsl(0, 72%, 51%)', 'hsl(260, 50%, 50%)',
  'hsl(30, 70%, 50%)', 'hsl(200, 60%, 45%)',
];

const Reports = () => {
  const { items, transactions } = useInventory();

  const categoryData = CATEGORIES.map(cat => ({
    name: cat,
    count: items.filter(i => i.category === cat).length,
    value: items.filter(i => i.category === cat).reduce((s, i) => s + i.quantity * i.unitPrice, 0),
  })).filter(d => d.count > 0);

  const statusData = [
    { name: 'In Stock', value: items.filter(i => i.status === 'in-stock').length },
    { name: 'Low Stock', value: items.filter(i => i.status === 'low-stock').length },
    { name: 'Out of Stock', value: items.filter(i => i.status === 'out-of-stock').length },
  ].filter(d => d.value > 0);

  const statusColors = ['hsl(152, 60%, 40%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)'];

  const handleExport = () => {
    const csv = [
      'Name,SKU,Category,Quantity,Min Qty,Unit Price,Status,Location,Supplier',
      ...items.map(i => `"${i.name}","${i.sku}","${i.category}",${i.quantity},${i.minQuantity},${i.unitPrice},"${i.status}","${i.location}","${i.supplier}"`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Inventory analytics and exports</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Value by Category */}
        <div className="table-container p-5">
          <h2 className="text-base font-semibold mb-4">Value by Category</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, 'Value']} />
              <Bar dataKey="value" fill="hsl(174, 62%, 40%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="table-container p-5">
          <h2 className="text-base font-semibold mb-4">Stock Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, i) => <Cell key={i} fill={statusColors[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary table */}
      <div className="table-container">
        <div className="px-5 py-4 border-b">
          <h2 className="text-base font-semibold">Category Summary</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Items</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Total Value</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categoryData.map(d => (
              <tr key={d.name} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{d.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{d.count}</td>
                <td className="px-4 py-3 font-mono">${d.value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
