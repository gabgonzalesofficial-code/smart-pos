"use strict";
// Inventory Types
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryAction = void 0;
var InventoryAction;
(function (InventoryAction) {
    InventoryAction["STOCK_IN"] = "STOCK_IN";
    InventoryAction["STOCK_OUT"] = "STOCK_OUT";
    InventoryAction["ADJUSTMENT"] = "ADJUSTMENT";
    InventoryAction["SALE"] = "SALE";
    InventoryAction["RETURN"] = "RETURN";
    InventoryAction["TRANSFER_IN"] = "TRANSFER_IN";
    InventoryAction["TRANSFER_OUT"] = "TRANSFER_OUT";
})(InventoryAction || (exports.InventoryAction = InventoryAction = {}));
