import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InventoryItem, Transaction } from '@/types/inventory';
import { mockItems, mockTransactions } from '@/data/mockData';

interface InventoryContextType {
  items: InventoryItem[];
  transactions: Transaction[];
  addItem: (item: Omit<InventoryItem, 'id' | 'status'>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  stockIn: (itemId: string, quantity: number, notes?: string) => void;
  stockOut: (itemId: string, quantity: number, notes?: string) => void;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
};

const getStatus = (qty: number, min: number): InventoryItem['status'] => {
  if (qty === 0) return 'out-of-stock';
  if (qty <= min) return 'low-stock';
  return 'in-stock';
};

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>(mockItems);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const addItem = (item: Omit<InventoryItem, 'id' | 'status'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      status: getStatus(item.quantity, item.minQuantity),
    };
    setItems(prev => [newItem, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, ...updates };
      updated.status = getStatus(updated.quantity, updated.minQuantity);
      return updated;
    }));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addTransaction = (itemId: string, itemName: string, type: Transaction['type'], quantity: number, notes?: string) => {
    const tx: Transaction = {
      id: Date.now().toString(),
      itemId,
      itemName,
      type,
      quantity,
      date: new Date().toISOString(),
      performedBy: 'Alex Morgan',
      notes,
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const stockIn = (itemId: string, quantity: number, notes?: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    updateItem(itemId, { quantity: item.quantity + quantity });
    addTransaction(itemId, item.name, 'stock-in', quantity, notes);
  };

  const stockOut = (itemId: string, quantity: number, notes?: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item || item.quantity < quantity) return;
    updateItem(itemId, { quantity: item.quantity - quantity });
    addTransaction(itemId, item.name, 'stock-out', quantity, notes);
  };

  return (
    <InventoryContext.Provider value={{ items, transactions, addItem, updateItem, deleteItem, stockIn, stockOut }}>
      {children}
    </InventoryContext.Provider>
  );
};
