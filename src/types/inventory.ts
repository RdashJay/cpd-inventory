export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  supplier: string;
  dateReceived: string;
  expirationDate?: string;
  location: string;
  unitPrice: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  type: 'stock-in' | 'stock-out';
  quantity: number;
  date: string;
  performedBy: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  avatar?: string;
}

export interface DashboardStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export type Category = 'Electronics' | 'Raw Materials' | 'Packaging' | 'Chemicals' | 'Tools' | 'Safety Equipment' | 'Office Supplies' | 'Other';

export const CATEGORIES: Category[] = [
  'Electronics', 'Raw Materials', 'Packaging', 'Chemicals', 'Tools', 'Safety Equipment', 'Office Supplies', 'Other'
];
