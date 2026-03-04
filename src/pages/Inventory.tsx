import React, { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { InventoryItem, CATEGORIES } from '@/types/inventory';
import { Search, Plus, Edit2, Trash2, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const statusStyles: Record<string, string> = {
  'in-stock': 'bg-success/10 text-success border-success/20',
  'low-stock': 'bg-warning/10 text-warning border-warning/20',
  'out-of-stock': 'bg-destructive/10 text-destructive border-destructive/20',
};

const emptyItem = {
  name: '', sku: '', category: 'Other' as const, quantity: 0, minQuantity: 10,
  supplier: '', dateReceived: new Date().toISOString().split('T')[0],
  expirationDate: '', location: '', unitPrice: 0,
};

const Inventory = () => {
  const { items, addItem, updateItem, deleteItem } = useInventory();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<InventoryItem> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = items.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const openAdd = () => { setEditingItem({ ...emptyItem }); setDialogOpen(true); };
  const openEdit = (item: InventoryItem) => { setEditingItem({ ...item }); setDialogOpen(true); };

  const handleSave = () => {
    if (!editingItem?.name || !editingItem?.sku) {
      toast.error('Name and SKU are required');
      return;
    }
    if (editingItem.id) {
      updateItem(editingItem.id, editingItem);
      toast.success('Item updated');
    } else {
      addItem(editingItem as Omit<InventoryItem, 'id' | 'status'>);
      toast.success('Item added');
    }
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
    setDeleteConfirm(null);
    toast.success('Item deleted');
  };

  const updateField = (field: string, value: string | number) => {
    setEditingItem(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} items · {filtered.length} shown</p>
        </div>
        {isAdmin && (
          <Button onClick={openAdd} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or SKU..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="table-container overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Item</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Qty</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Reorder Lvl</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Location</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Status</th>
              {isAdmin && <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(item => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{item.category}</td>
                <td className="px-4 py-3 font-mono font-medium">{item.quantity}</td>
                <td className="px-4 py-3 hidden md:table-cell font-mono text-muted-foreground">{item.minQuantity}</td>
                <td className="px-4 py-3 hidden lg:table-cell font-mono text-xs text-muted-foreground">{item.location}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <Badge variant="outline" className={statusStyles[item.status]}>
                    {item.status.replace('-', ' ')}
                  </Badge>
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="px-4 py-12 text-center text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Item Name *</Label>
                <Input value={editingItem?.name || ''} onChange={e => updateField('name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>SKU *</Label>
                <Input value={editingItem?.sku || ''} onChange={e => updateField('sku', e.target.value)} className="font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={editingItem?.category || 'Other'} onValueChange={v => updateField('category', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Input value={editingItem?.supplier || ''} onChange={e => updateField('supplier', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min={0} value={editingItem?.quantity ?? 0} onChange={e => updateField('quantity', parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>Reorder Level</Label>
                <Input type="number" min={0} value={editingItem?.minQuantity ?? 0} onChange={e => updateField('minQuantity', parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>Unit Price</Label>
                <Input type="number" min={0} step={0.01} value={editingItem?.unitPrice ?? 0} onChange={e => updateField('unitPrice', parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Received</Label>
                <Input type="date" value={editingItem?.dateReceived || ''} onChange={e => updateField('dateReceived', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Expiration Date</Label>
                <Input type="date" value={editingItem?.expirationDate || ''} onChange={e => updateField('expirationDate', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location (e.g., A1-R3-B2)</Label>
              <Input value={editingItem?.location || ''} onChange={e => updateField('location', e.target.value)} placeholder="Rack-Row-Bin" className="font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
