export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  project?: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
  department: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  type: 'input' | 'output';
  quantity: number;
  unitPrice: number;
  totalValue: number;
  project: string;
  staffId: string;
  staffName: string;
  date: string;
}