"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_service_1 = require("./inventory.service");
const create_inventory_log_dto_1 = require("./dto/create-inventory-log.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    createLog(createLogDto) {
        return this.inventoryService.createLog(createLogDto);
    }
    findAll(productId, action, page, limit) {
        return this.inventoryService.findAll(productId, action, page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
    }
    getCurrentStock(productId) {
        return this.inventoryService.getCurrentStock(productId);
    }
    getStockLevels(threshold) {
        return this.inventoryService.getStockLevels(threshold ? parseInt(threshold) : 10);
    }
    getLowStockProducts(threshold) {
        return this.inventoryService.getLowStockProducts(threshold ? parseInt(threshold) : 10);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)('logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Create inventory log entry' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_log_dto_1.CreateInventoryLogDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createLog", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory logs' }),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Query)('action')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stock/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current stock for a product' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getCurrentStock", null);
__decorate([
    (0, common_1.Get)('stock-levels'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock levels for all products' }),
    __param(0, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getStockLevels", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Get products with low stock' }),
    __param(0, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getLowStockProducts", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('inventory'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map