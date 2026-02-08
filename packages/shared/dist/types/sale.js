"use strict";
// Sales Types
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleStatus = exports.PaymentMethod = void 0;
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["GCASH"] = "GCASH";
    PaymentMethod["PAYMAYA"] = "PAYMAYA";
    PaymentMethod["OTHER"] = "OTHER";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var SaleStatus;
(function (SaleStatus) {
    SaleStatus["COMPLETED"] = "COMPLETED";
    SaleStatus["REFUNDED"] = "REFUNDED";
    SaleStatus["CANCELLED"] = "CANCELLED";
    SaleStatus["PENDING"] = "PENDING";
})(SaleStatus || (exports.SaleStatus = SaleStatus = {}));
