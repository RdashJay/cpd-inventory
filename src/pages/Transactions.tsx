import React, { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { ArrowDownRight, ArrowUpRight, Search, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Transactions = () => {
  const { items, transactions, stockIn, stockOut } = useInventory();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [txType, setTxType] = useState<'stock-in' | 'stock-out'>('stock-in');
  const [selectedItem, setSelectedItem] = useState('');
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  const filtered = transactions.filter(tx => {
    const matchSearch = !search || tx.itemName.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || tx.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleSubmit = () => {
    if (!selectedItem || qty <= 0) {
      toast.error('Select an item and valid quantity');
      return;
    }
    if (txType === 'stock-in') {
      stockIn(selectedItem, qty, notes || undefined);
      toast.success('Stock in recorded');
    } else {
      const item = items.find(i => i.id === selectedItem);
      if (item && item.quantity < qty) {
        toast.error(`Only ${item.quantity} available`);
        return;
      }
      stockOut(selectedItem, qty, notes || undefined);
      toast.success('Stock out recorded');
    }
    setDialogOpen(false);
    setSelectedItem('');
    setQty(1);
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">Stock in/out activity log</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" /> New Transaction
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by item name..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="stock-in">Stock In</SelectItem>
            <SelectItem value="stock-out">Stock Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="table-container">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Item</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Qty</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">By</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(tx => (
              <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full ${tx.type === 'stock-in' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    {tx.type === 'stock-in' ? <ArrowDownRight className="h-3.5 w-3.5 text-success" /> : <ArrowUpRight className="h-3.5 w-3.5 text-destructive" />}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{tx.itemName}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={tx.type === 'stock-in' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                    {tx.type === 'stock-in' ? '+' : '-'}{tx.quantity}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{tx.performedBy}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{new Date(tx.date).toLocaleString()}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">{tx.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={txType} onValueChange={v => setTxType(v as 'stock-in' | 'stock-out')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock-in">Stock In</SelectItem>
                  <SelectItem value="stock-out">Stock Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Item</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger><SelectValue placeholder="Select item..." /></SelectTrigger>
                <SelectContent>
                  {items.map(item => (
                    <SelectItem key={item.id} value={item.id}>{item.name} ({item.quantity} in stock)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" min={1} value={qty} onChange={e => setQty(parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
