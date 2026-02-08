// Permission Constants

export enum Permission {
  // Sales
  CREATE_SALE = 'CREATE_SALE',
  VIEW_SALES = 'VIEW_SALES',
  REFUND_SALE = 'REFUND_SALE',
  CANCEL_SALE = 'CANCEL_SALE',
  
  // Products
  CREATE_PRODUCT = 'CREATE_PRODUCT',
  UPDATE_PRODUCT = 'UPDATE_PRODUCT',
  DELETE_PRODUCT = 'DELETE_PRODUCT',
  VIEW_PRODUCTS = 'VIEW_PRODUCTS',
  
  // Inventory
  MANAGE_INVENTORY = 'MANAGE_INVENTORY',
  VIEW_INVENTORY = 'VIEW_INVENTORY',
  ADJUST_STOCK = 'ADJUST_STOCK',
  
  // Reports
  VIEW_REPORTS = 'VIEW_REPORTS',
  EXPORT_REPORTS = 'EXPORT_REPORTS',
  
  // Users
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_USERS = 'VIEW_USERS',
  
  // Settings
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
}

export const RolePermissions: Record<string, Permission[]> = {
  ADMIN: Object.values(Permission),
  MANAGER: [
    Permission.VIEW_SALES,
    Permission.CREATE_SALE,
    Permission.REFUND_SALE,
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCT,
    Permission.UPDATE_PRODUCT,
    Permission.VIEW_INVENTORY,
    Permission.MANAGE_INVENTORY,
    Permission.ADJUST_STOCK,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_USERS,
  ],
  CASHIER: [
    Permission.CREATE_SALE,
    Permission.VIEW_SALES,
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_INVENTORY,
  ],
};
