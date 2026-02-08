import { PrismaClient } from '../src/generated/index';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min: number, max: number, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(randomBetween(8, 21), randomBetween(0, 59), randomBetween(0, 59));
  return d;
}

async function main() {
  console.log('Seeding database...');

  // ---------- USERS ----------
  const hashedAdmin = await bcrypt.hash('admin123', 10);
  const hashedManager = await bcrypt.hash('manager123', 10);
  const hashedCashier = await bcrypt.hash('cashier123', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@pos.local',
      password: hashedAdmin,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const manager = await prisma.user.upsert({
    where: { username: 'manager' },
    update: {},
    create: {
      username: 'manager',
      email: 'manager@pos.local',
      password: hashedManager,
      firstName: 'Maria',
      lastName: 'Santos',
      role: 'MANAGER',
      isActive: true,
    },
  });

  const cashier = await prisma.user.upsert({
    where: { username: 'cashier' },
    update: {},
    create: {
      username: 'cashier',
      email: 'cashier@pos.local',
      password: hashedCashier,
      firstName: 'Juan',
      lastName: 'Cruz',
      role: 'CASHIER',
      isActive: true,
    },
  });

  const users = [admin, manager, cashier];
  console.log(`Created ${users.length} users`);

  // ---------- SUPPLIERS ----------
  const supplier1 = await prisma.supplier.upsert({
    where: { id: 'supplier-1' },
    update: {},
    create: {
      id: 'supplier-1',
      name: 'Global Beverage Distributors',
      contactPerson: 'John Reyes',
      email: 'john@globalbev.com',
      phone: '+63-912-345-6789',
      address: '123 Commerce St, Makati City',
      isActive: true,
    },
  });

  const supplier2 = await prisma.supplier.upsert({
    where: { id: 'supplier-2' },
    update: {},
    create: {
      id: 'supplier-2',
      name: 'Kitchen Equipment Co.',
      contactPerson: 'Ana Mendoza',
      email: 'ana@kitchenequip.com',
      phone: '+63-917-654-3210',
      address: '456 Industrial Ave, Quezon City',
      isActive: true,
    },
  });

  console.log('Created 2 suppliers');

  // ---------- PRODUCTS ----------
  const productData = [
    { barcode: 'BEV-001', name: 'Coffee Beans (1kg)', description: 'Premium arabica coffee beans', price: 24.99, cost: 14.00, category: 'Beverages', supplierId: supplier1.id },
    { barcode: 'BEV-002', name: 'Espresso Roast (500g)', description: 'Dark roast espresso blend', price: 18.99, cost: 10.50, category: 'Beverages', supplierId: supplier1.id },
    { barcode: 'BEV-003', name: 'Green Tea Box (20 bags)', description: 'Organic green tea bags', price: 8.99, cost: 4.00, category: 'Beverages', supplierId: supplier1.id },
    { barcode: 'BEV-004', name: 'Hot Chocolate Mix', description: 'Rich cocoa hot chocolate', price: 12.50, cost: 6.00, category: 'Beverages', supplierId: supplier1.id },
    { barcode: 'BEV-005', name: 'Chai Latte Powder', description: 'Spiced chai latte mix', price: 15.99, cost: 8.50, category: 'Beverages', supplierId: supplier1.id },
    { barcode: 'FD-001', name: 'Croissant (Pack of 4)', description: 'Fresh butter croissants', price: 6.99, cost: 3.50, category: 'Food', supplierId: supplier1.id },
    { barcode: 'FD-002', name: 'Blueberry Muffin', description: 'Freshly baked blueberry muffin', price: 3.99, cost: 1.80, category: 'Food', supplierId: supplier1.id },
    { barcode: 'FD-003', name: 'Chocolate Chip Cookie', description: 'Large chocolate chip cookie', price: 2.50, cost: 0.90, category: 'Food', supplierId: supplier1.id },
    { barcode: 'FD-004', name: 'Banana Bread Slice', description: 'Homestyle banana bread', price: 4.50, cost: 2.00, category: 'Food', supplierId: supplier1.id },
    { barcode: 'FD-005', name: 'Granola Bar', description: 'Oat & honey granola bar', price: 2.99, cost: 1.20, category: 'Food', supplierId: supplier1.id },
    { barcode: 'EQ-001', name: 'Espresso Machine', description: 'Professional espresso maker', price: 299.99, cost: 180.00, category: 'Equipment', supplierId: supplier2.id },
    { barcode: 'EQ-002', name: 'French Press', description: 'Glass french press (600ml)', price: 34.99, cost: 18.00, category: 'Equipment', supplierId: supplier2.id },
    { barcode: 'EQ-003', name: 'Milk Frother', description: 'Electric milk frother', price: 19.99, cost: 9.00, category: 'Equipment', supplierId: supplier2.id },
    { barcode: 'EQ-004', name: 'Coffee Grinder', description: 'Burr coffee grinder', price: 49.99, cost: 25.00, category: 'Equipment', supplierId: supplier2.id },
    { barcode: 'ACC-001', name: 'Ceramic Mug (350ml)', description: 'Classic ceramic coffee mug', price: 9.99, cost: 4.00, category: 'Accessories', supplierId: supplier2.id },
    { barcode: 'ACC-002', name: 'Travel Tumbler', description: 'Insulated travel tumbler (500ml)', price: 22.99, cost: 11.00, category: 'Accessories', supplierId: supplier2.id },
    { barcode: 'ACC-003', name: 'Tea Set (Premium)', description: 'Porcelain tea set for 4', price: 49.99, cost: 22.00, category: 'Accessories', supplierId: supplier2.id },
    { barcode: 'ACC-004', name: 'Coffee Filter (100 pack)', description: 'Paper coffee filters', price: 5.99, cost: 2.00, category: 'Accessories', supplierId: supplier2.id },
    { barcode: 'ACC-005', name: 'Sugar Packets (50 pack)', description: 'Individual sugar packets', price: 3.99, cost: 1.50, category: 'Accessories', supplierId: supplier2.id },
    { barcode: 'ACC-006', name: 'Stirring Sticks (200 pack)', description: 'Wooden stirring sticks', price: 2.99, cost: 0.80, category: 'Accessories', supplierId: supplier2.id },
  ];

  const products = [];
  for (const p of productData) {
    const product = await prisma.product.upsert({
      where: { barcode: p.barcode },
      update: {},
      create: { ...p, trackInventory: true },
    });
    products.push(product);
  }
  console.log(`Created ${products.length} products`);

  // ---------- INITIAL INVENTORY (STOCK IN) ----------
  const initialStocks = [
    150, 120, 200, 80, 90,    // Beverages
    60, 80, 100, 50, 120,     // Food
    15, 45, 30, 20,           // Equipment
    200, 80, 25, 300, 150, 400 // Accessories
  ];

  for (let i = 0; i < products.length; i++) {
    await prisma.inventoryLog.create({
      data: {
        productId: products[i].id,
        quantity: initialStocks[i],
        action: 'STOCK_IN',
        notes: 'Initial stock',
        reference: 'SEED-INIT',
        createdAt: daysAgo(14),
      },
    });
  }
  console.log('Created initial inventory');

  // ---------- SALES ----------
  const paymentMethods = ['CASH', 'CARD', 'GCASH', 'PAYMAYA'] as const;
  let receiptCounter = 1000;

  // Track inventory deductions
  const inventoryDeductions: { productId: string; quantity: number; receiptNumber: string; createdAt: Date }[] = [];

  // Generate 35 sales over the past 7 days
  const salesData = [];
  for (let day = 0; day < 7; day++) {
    const salesPerDay = randomBetween(3, 7);
    for (let s = 0; s < salesPerDay; s++) {
      receiptCounter++;
      const saleDate = daysAgo(day);
      const numItems = randomBetween(1, 4);
      const usedProductIndices = new Set<number>();
      const items = [];
      let subtotal = 0;

      for (let j = 0; j < numItems; j++) {
        let pIdx: number;
        do { pIdx = randomBetween(0, products.length - 1); } while (usedProductIndices.has(pIdx));
        usedProductIndices.add(pIdx);
        const product = products[pIdx];
        const qty = randomBetween(1, 3);
        const unitPrice = Number(product.price);
        const itemDiscount = Math.random() > 0.8 ? randomDecimal(0, unitPrice * 0.1) : 0;
        const itemTotal = parseFloat((qty * unitPrice - itemDiscount).toFixed(2));
        subtotal += itemTotal;

        items.push({
          productId: product.id,
          quantity: qty,
          unitPrice,
          discount: itemDiscount,
          total: itemTotal,
        });

        inventoryDeductions.push({
          productId: product.id,
          quantity: qty,
          receiptNumber: `RCP-${receiptCounter}`,
          createdAt: saleDate,
        });
      }

      subtotal = parseFloat(subtotal.toFixed(2));
      const discount = Math.random() > 0.85 ? parseFloat((subtotal * 0.05).toFixed(2)) : 0;
      const tax = parseFloat((subtotal * 0.12).toFixed(2));
      const total = parseFloat((subtotal - discount + tax).toFixed(2));
      const paymentMethod = paymentMethods[randomBetween(0, paymentMethods.length - 1)];
      const amountPaid = paymentMethod === 'CASH'
        ? parseFloat((Math.ceil(total / 10) * 10).toFixed(2))
        : total;
      const change = parseFloat((amountPaid - total).toFixed(2));

      // Most are COMPLETED, a few PENDING or REFUNDED
      const statusRoll = Math.random();
      const status = (statusRoll > 0.92 ? 'REFUNDED' : statusRoll > 0.85 ? 'PENDING' : 'COMPLETED') as 'COMPLETED' | 'PENDING' | 'REFUNDED';

      salesData.push({
        receiptNumber: `RCP-${receiptCounter}`,
        cashierId: users[randomBetween(0, users.length - 1)].id,
        subtotal,
        discount,
        tax,
        total,
        paymentMethod,
        amountPaid,
        change,
        status,
        createdAt: saleDate,
        items,
      });
    }
  }

  for (const sale of salesData) {
    const { items, ...saleFields } = sale;
    await prisma.sale.create({
      data: {
        ...saleFields,
        items: {
          create: items,
        },
      },
    });
  }
  console.log(`Created ${salesData.length} sales`);

  // ---------- INVENTORY LOGS FOR SALES ----------
  for (const ded of inventoryDeductions) {
    await prisma.inventoryLog.create({
      data: {
        productId: ded.productId,
        quantity: -ded.quantity,
        action: 'SALE',
        reference: ded.receiptNumber,
        createdAt: ded.createdAt,
      },
    });
  }
  console.log('Created sale inventory deductions');

  // ---------- MANUAL INVENTORY ADJUSTMENTS ----------
  // A few restock events
  const restockProducts = [0, 2, 5, 7, 14];
  for (const idx of restockProducts) {
    await prisma.inventoryLog.create({
      data: {
        productId: products[idx].id,
        quantity: randomBetween(20, 50),
        action: 'STOCK_IN',
        notes: 'Weekly restock',
        reference: 'RESTOCK',
        createdAt: daysAgo(3),
      },
    });
  }

  // A couple of adjustments
  await prisma.inventoryLog.create({
    data: {
      productId: products[6].id,
      quantity: -5,
      action: 'ADJUSTMENT',
      notes: 'Damaged items removed',
      createdAt: daysAgo(2),
    },
  });

  await prisma.inventoryLog.create({
    data: {
      productId: products[11].id,
      quantity: -2,
      action: 'ADJUSTMENT',
      notes: 'Display samples',
      createdAt: daysAgo(1),
    },
  });

  console.log('Created inventory adjustments');

  // ---------- DISCOUNTS ----------
  await prisma.discount.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      name: 'Welcome Discount',
      description: '10% off for new customers',
      type: 'PERCENTAGE',
      value: 10,
      minPurchase: 50,
      maxDiscount: 25,
      status: 'ACTIVE',
      usageLimit: 100,
      usedCount: 23,
    },
  });

  await prisma.discount.upsert({
    where: { code: 'FLAT50' },
    update: {},
    create: {
      code: 'FLAT50',
      name: 'Flat 50 Off',
      description: '$50 off on orders above $200',
      type: 'FIXED',
      value: 50,
      minPurchase: 200,
      status: 'ACTIVE',
      usageLimit: 50,
      usedCount: 8,
    },
  });

  console.log('Created discount codes');

  // ---------- BRANCH ----------
  await prisma.branch.upsert({
    where: { code: 'MAIN' },
    update: {},
    create: {
      name: 'Main Branch',
      code: 'MAIN',
      address: '789 Main Street, Manila',
      phone: '+63-2-8888-1234',
      email: 'main@pos.local',
      isActive: true,
    },
  });

  console.log('Created branch');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
