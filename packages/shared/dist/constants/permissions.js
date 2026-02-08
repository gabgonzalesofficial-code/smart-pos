"use strict";
// Permission Constants
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissions = exports.Permission = void 0;
var Permission;
(function (Permission) {
    // Sales
    Permission["CREATE_SALE"] = "CREATE_SALE";
    Permission["VIEW_SALES"] = "VIEW_SALES";
    Permission["REFUND_SALE"] = "REFUND_SALE";
    Permission["CANCEL_SALE"] = "CANCEL_SALE";
    // Products
    Permission["CREATE_PRODUCT"] = "CREATE_PRODUCT";
    Permission["UPDATE_PRODUCT"] = "UPDATE_PRODUCT";
    Permission["DELETE_PRODUCT"] = "DELETE_PRODUCT";
    Permission["VIEW_PRODUCTS"] = "VIEW_PRODUCTS";
    // Inventory
    Permission["MANAGE_INVENTORY"] = "MANAGE_INVENTORY";
    Permission["VIEW_INVENTORY"] = "VIEW_INVENTORY";
    Permission["ADJUST_STOCK"] = "ADJUST_STOCK";
    // Reports
    Permission["VIEW_REPORTS"] = "VIEW_REPORTS";
    Permission["EXPORT_REPORTS"] = "EXPORT_REPORTS";
    // Users
    Permission["MANAGE_USERS"] = "MANAGE_USERS";
    Permission["VIEW_USERS"] = "VIEW_USERS";
    // Settings
    Permission["MANAGE_SETTINGS"] = "MANAGE_SETTINGS";
})(Permission || (exports.Permission = Permission = {}));
exports.RolePermissions = {
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
