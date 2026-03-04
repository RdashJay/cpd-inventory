import { InventoryItem, Transaction, User } from '@/types/inventory';

export const mockUser: User = {
  id: '1',
  name: 'Alex Morgan',
  email: 'alex@warehouse.io',
  role: 'admin',
};

export const mockUsers: User[] = [
  { id: '1', name: 'Alex Morgan', email: 'alex@warehouse.io', role: 'admin' },
  { id: '2', name: 'Sam Rivera', email: 'sam@warehouse.io', role: 'staff' },
  { id: '3', name: 'Jordan Lee', email: 'jordan@warehouse.io', role: 'staff' },
];

export const mockItems: InventoryItem[] = [
  { id: '1', name: 'Industrial Bearing 6205', sku: 'BRG-6205', category: 'Raw Materials', quantity: 245, minQuantity: 50, supplier: 'SKF Industries', dateReceived: '2026-02-15', location: 'A1-R3-B2', unitPrice: 12.50, status: 'in-stock' },
  { id: '2', name: 'Arduino Mega 2560', sku: 'ELC-ARD-2560', category: 'Electronics', quantity: 8, minQuantity: 20, supplier: 'DigiParts Co.', dateReceived: '2026-01-28', location: 'B2-R1-B5', unitPrice: 38.90, status: 'low-stock' },
  { id: '3', name: 'Safety Goggles Pro', sku: 'SAF-GOG-001', category: 'Safety Equipment', quantity: 150, minQuantity: 30, supplier: 'SafeWork Ltd.', dateReceived: '2026-02-20', location: 'C1-R2-B1', unitPrice: 15.00, status: 'in-stock' },
  { id: '4', name: 'Corrugated Box 12x12', sku: 'PKG-CB-1212', category: 'Packaging', quantity: 0, minQuantity: 100, supplier: 'BoxCraft Inc.', dateReceived: '2026-01-10', location: 'D3-R1-B3', unitPrice: 2.30, status: 'out-of-stock' },
  { id: '5', name: 'Isopropyl Alcohol 99%', sku: 'CHM-IPA-99', category: 'Chemicals', quantity: 35, minQuantity: 40, supplier: 'ChemSupply Co.', dateReceived: '2026-02-01', expirationDate: '2027-02-01', location: 'E1-R4-B2', unitPrice: 24.00, status: 'low-stock' },
  { id: '6', name: 'Torque Wrench Set', sku: 'TLS-TWR-SET', category: 'Tools', quantity: 22, minQuantity: 5, supplier: 'ToolMaster', dateReceived: '2026-02-18', location: 'A2-R1-B4', unitPrice: 89.99, status: 'in-stock' },
  { id: '7', name: 'Printer Paper A4', sku: 'OFS-PPA4-500', category: 'Office Supplies', quantity: 12, minQuantity: 25, supplier: 'OfficeHub', dateReceived: '2026-02-25', location: 'F1-R1-B1', unitPrice: 6.50, status: 'low-stock' },
  { id: '8', name: 'Steel Bolts M10x30', sku: 'RAW-BLT-M10', category: 'Raw Materials', quantity: 1800, minQuantity: 200, supplier: 'MetalWorks Ltd.', dateReceived: '2026-02-22', location: 'A1-R5-B1', unitPrice: 0.45, status: 'in-stock' },
  { id: '9', name: 'Lithium Battery 3.7V', sku: 'ELC-BAT-37V', category: 'Electronics', quantity: 3, minQuantity: 50, supplier: 'PowerCell Inc.', dateReceived: '2026-01-15', expirationDate: '2028-01-15', location: 'B1-R3-B2', unitPrice: 5.20, status: 'low-stock' },
  { id: '10', name: 'Bubble Wrap Roll', sku: 'PKG-BW-100M', category: 'Packaging', quantity: 65, minQuantity: 20, supplier: 'BoxCraft Inc.', dateReceived: '2026-02-10', location: 'D2-R2-B1', unitPrice: 18.75, status: 'in-stock' },
];

export const mockTransactions: Transaction[] = [
  { id: '1', itemId: '1', itemName: 'Industrial Bearing 6205', type: 'stock-in', quantity: 100, date: '2026-03-02T14:30:00', performedBy: 'Alex Morgan', notes: 'Regular restocking' },
  { id: '2', itemId: '4', itemName: 'Corrugated Box 12x12', type: 'stock-out', quantity: 200, date: '2026-03-02T11:15:00', performedBy: 'Sam Rivera', notes: 'Shipped to Client B' },
  { id: '3', itemId: '2', itemName: 'Arduino Mega 2560', type: 'stock-out', quantity: 12, date: '2026-03-01T16:45:00', performedBy: 'Alex Morgan' },
  { id: '4', itemId: '9', itemName: 'Lithium Battery 3.7V', type: 'stock-out', quantity: 47, date: '2026-03-01T09:20:00', performedBy: 'Sam Rivera', notes: 'Production line request' },
  { id: '5', itemId: '8', itemName: 'Steel Bolts M10x30', type: 'stock-in', quantity: 500, date: '2026-02-28T13:00:00', performedBy: 'Alex Morgan', notes: 'Bulk order received' },
  { id: '6', itemId: '3', itemName: 'Safety Goggles Pro', type: 'stock-in', quantity: 50, date: '2026-02-27T10:30:00', performedBy: 'Alex Morgan' },
];
