import React from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Package, DollarSign, AlertTriangle, XCircle, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { items, transactions } = useInventory();

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const lowStockItems = items.filter(i => i.status === 'low-stock');
  const outOfStockItems = items.filter(i => i.status === 'out-of-stock');
  const recentTx = transactions.slice(0, 8);

  const stats = [
    { label: 'Total Items', value: totalItems.toLocaleString(), icon: Package, color: 'text-accent' },
    { label: 'Total Value', value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-success' },
    { label: 'Low Stock', value: lowStockItems.length, icon: AlertTriangle, color: 'text-warning' },
    { label: 'Out of Stock', value: outOfStockItems.length, icon: XCircle, color: 'text-destructive' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your warehouse inventory</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-3 table-container">
          <div className="px-5 py-4 border-b">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Recent Activity
            </h2>
          </div>
          <div className="divide-y">
            {recentTx.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 px-5 py-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tx.type === 'stock-in' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  {tx.type === 'stock-in' ? (
                    <ArrowDownRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.itemName}</p>
                  <p className="text-xs text-muted-foreground">{tx.performedBy} · {new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <Badge variant={tx.type === 'stock-in' ? 'default' : 'secondary'} className={tx.type === 'stock-in' ? 'bg-success/15 text-success border-0' : 'bg-destructive/15 text-destructive border-0'}>
                  {tx.type === 'stock-in' ? '+' : '-'}{tx.quantity}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-2 table-container">
          <div className="px-5 py-4 border-b">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Low Stock Alerts
            </h2>
          </div>
          <div className="divide-y">
            {[...lowStockItems, ...outOfStockItems].map(item => (
              <div key={item.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <Badge variant="outline" className={item.status === 'out-of-stock' ? 'border-destructive/30 text-destructive bg-destructive/5' : 'border-warning/30 text-warning bg-warning/5'}>
                    {item.status === 'out-of-stock' ? 'Out' : item.quantity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">{item.sku} · Min: {item.minQuantity}</p>
              </div>
            ))}
            {lowStockItems.length === 0 && outOfStockItems.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">All stock levels are healthy</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
