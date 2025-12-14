import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import HeroSection from '../models/HeroSection.js';
import AnnouncementBanner from '../models/AnnouncementBanner.js';
import Settings from '../models/Settings.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { sendOrderNotificationToAdmin, sendOrderConfirmationToCustomer } from '../services/emailService.js';
import XLSX from 'xlsx';

const router = express.Router();

// ========== DELIVERY SLIP (Public route - no auth required for printing) ==========
// Generate delivery slip (must be before auth middleware)
router.get('/orders/:id/delivery-slip', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email firstName lastName')
      .populate('items.product', 'name actualPrice discountedPrice');
    
    if (!order) {
      return res.status(404).send('Order not found');
    }
    
    // Calculate subtotal
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = order.totalAmount - subtotal;
    
    // Generate HTML delivery slip
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Delivery Slip - ${order.orderNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    @page {
      size: A4;
      margin: 0.5cm;
    }
    body {
      font-family: 'Arial', sans-serif;
      padding: 15px;
      background: #fff;
      color: #000;
      font-size: 11px;
    }
    .slip-container {
      max-width: 100%;
      margin: 0 auto;
      border: 2px solid #000;
      padding: 15px;
      background: #fff;
      page-break-inside: avoid;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .header h1 {
      color: #000;
      font-size: 20px;
      margin-bottom: 5px;
      font-weight: bold;
    }
    .header p {
      color: #000;
      font-size: 12px;
    }
    .order-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
    }
    .info-section {
      border: 1px solid #000;
      padding: 10px;
    }
    .info-section h3 {
      color: #000;
      font-size: 12px;
      margin-bottom: 8px;
      border-bottom: 1px solid #000;
      padding-bottom: 3px;
      font-weight: bold;
    }
    .info-section p {
      margin: 3px 0;
      font-size: 10px;
      color: #000;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      border: 1px solid #000;
    }
    .items-table th {
      background: #000;
      color: #fff;
      padding: 8px 6px;
      text-align: left;
      font-size: 10px;
      font-weight: bold;
      border: 1px solid #000;
    }
    .items-table td {
      padding: 6px;
      border: 1px solid #000;
      font-size: 10px;
      color: #000;
    }
    .total-section {
      text-align: right;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 2px solid #000;
    }
    .total-row {
      display: flex;
      justify-content: flex-end;
      margin: 3px 0;
      font-size: 11px;
    }
    .total-row.final {
      font-size: 14px;
      font-weight: bold;
      color: #000;
      margin-top: 5px;
      border-top: 1px solid #000;
      padding-top: 5px;
    }
    .payment-info {
      border: 1px solid #000;
      padding: 10px;
      margin-top: 10px;
    }
    .payment-info h3 {
      color: #000;
      margin-bottom: 5px;
      font-size: 11px;
      font-weight: bold;
    }
    .payment-info p {
      margin: 2px 0;
      font-size: 10px;
      color: #000;
    }
    .footer {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #000;
      text-align: center;
      font-size: 9px;
      color: #000;
    }
    @media print {
      body {
        padding: 0;
        margin: 0;
      }
      .slip-container {
        border: 2px solid #000;
        padding: 15px;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="slip-container">
    <div class="header">
      <h1>MISTIQ PERFUMERIES</h1>
      <p>Delivery Slip</p>
    </div>
    
    <div class="order-info">
      <div class="info-section">
        <h3>Order Information</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div class="info-section">
        <h3>Delivery Address</h3>
        <p><strong>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</strong></p>
        <p>${order.shippingAddress.street || ''}</p>
        <p>${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zipCode || ''}</p>
        <p><strong>Phone:</strong> ${order.shippingAddress.phone || 'N/A'}</p>
        ${order.shippingAddress.nearestLandmark ? `<p><strong>Landmark:</strong> ${order.shippingAddress.nearestLandmark}</p>` : ''}
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td>${item.product?.name || 'N/A'}</td>
            <td>${item.quantity}</td>
            <td>Rs ${item.price.toFixed(2)}</td>
            <td>Rs ${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div class="total-section">
      <div class="total-row">
        <span style="margin-right: 15px;">Subtotal:</span>
        <span>Rs ${subtotal.toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span style="margin-right: 15px;">Delivery Charge:</span>
        <span>Rs ${deliveryCharge.toFixed(2)}</span>
      </div>
      <div class="total-row final">
        <span style="margin-right: 15px;">Total Amount:</span>
        <span>Rs ${order.totalAmount.toFixed(2)}</span>
      </div>
    </div>
    
    <div class="payment-info">
      <h3>Payment Information</h3>
      <p><strong>Payment Method:</strong> ${order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}</p>
    </div>
    
    <div class="footer">
      <p>Thank you for your order! | mistiqperfumeries@gmail.com</p>
    </div>
  </div>
</body>
</html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `inline; filename=delivery-slip-${order.orderNumber}.html`);
    res.send(html);
  } catch (error) {
    console.error('Error generating delivery slip:', error);
    res.status(500).send('Error generating delivery slip');
  }
});

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// ========== PRODUCT MANAGEMENT ==========

// Get all products (admin view)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== ORDER MANAGEMENT ==========

// Get all orders with filters
router.get('/orders', async (req, res) => {
  try {
    const { status, customerId, startDate, endDate } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (customerId) {
      query.user = customerId;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
    
    const orders = await Order.find(query)
      .populate('user', 'username email firstName lastName')
      .populate('items.product', 'name bottleImage')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export orders to Excel (MUST be before /orders/:id to avoid route conflict)
router.get('/orders/export', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};
    
    // Only apply date filter if both dates are provided
    // If no dates selected, get all orders (query remains empty)
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      query.createdAt = {
        $gte: start,
        $lte: end
      };
    }
    
    const orders = await Order.find(query)
      .populate('user', 'username email firstName lastName')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });
    
    // Prepare data for Excel
    const excelData = orders.map(order => {
      const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const deliveryCharge = order.totalAmount - subtotal;
      const items = order.items.map(item => 
        `${item.product?.name || 'N/A'} (Qty: ${item.quantity})`
      ).join('; ');
      
      return {
        'Order Number': order.orderNumber,
        'Order Date': new Date(order.createdAt).toLocaleDateString(),
        'Customer Name': `${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`.trim(),
        'Email': order.shippingAddress.email || 'N/A',
        'Phone': order.shippingAddress.phone || 'N/A',
        'Address': `${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zipCode || ''}`.trim(),
        'Landmark': order.shippingAddress.nearestLandmark || 'N/A',
        'Items': items,
        'Subtotal': subtotal.toFixed(2),
        'Delivery Charge': deliveryCharge.toFixed(2),
        'Total Amount': order.totalAmount.toFixed(2),
        'Payment Method': order.paymentMethod || 'COD',
        'Status': order.status
      };
    });
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const colWidths = [
      { wch: 15 }, // Order Number
      { wch: 12 }, // Order Date
      { wch: 20 }, // Customer Name
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 40 }, // Address
      { wch: 20 }, // Landmark
      { wch: 50 }, // Items
      { wch: 12 }, // Subtotal
      { wch: 15 }, // Delivery Charge
      { wch: 12 }, // Total Amount
      { wch: 15 }, // Payment Method
      { wch: 12 }  // Status
    ];
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    
    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Set headers
    const filename = `orders-export-${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting orders:', error);
    res.status(500).json({ message: error.message || 'Error exporting orders' });
  }
});

// Get single order
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email firstName lastName')
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ========== ANALYTICS ==========

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate, year } = req.query;
    
    let dateQuery = {};
    if (year) {
      // Filter by year
      const yearStart = new Date(`${year}-01-01`);
      const yearEnd = new Date(`${year}-12-31T23:59:59.999`);
      dateQuery.createdAt = {
        $gte: yearStart,
        $lte: yearEnd
      };
    } else if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
      if (endDate) dateQuery.createdAt.$lte = new Date(endDate);
    }
    
    // Total orders
    const totalOrders = await Order.countDocuments(dateQuery);
    
    // Total revenue
    const revenueData = await Order.aggregate([
      { $match: dateQuery },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;
    
    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $match: dateQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Orders by date (for chart)
    const ordersByDate = await Order.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Top products
    const topProducts = await Order.aggregate([
      { $match: dateQuery },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);
    
    // Populate product names
    const topProductsWithNames = await Promise.all(
      topProducts.map(async (item) => {
        const product = await Product.findById(item._id);
        return {
          productName: product?.name || 'Unknown',
          quantity: item.totalQuantity,
          revenue: item.totalRevenue
        };
      })
    );
    
    // Monthly product breakdown for compound bar chart
    const monthlyProductData = await Order.aggregate([
      { $match: dateQuery },
      { $unwind: '$items' },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            product: '$items.product'
          },
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);
    
    // Get all unique products and months
    const productMap = new Map();
    const monthSet = new Set();
    
    for (const item of monthlyProductData) {
      monthSet.add(item._id.month);
      if (!productMap.has(item._id.product.toString())) {
        const product = await Product.findById(item._id.product);
        productMap.set(item._id.product.toString(), product?.name || 'Unknown');
      }
    }
    
    // Transform data for chart
    const months = Array.from(monthSet).sort();
    const products = Array.from(productMap.values());
    const chartData = months.map(month => {
      const monthData = { month, totalRevenue: 0 };
      let monthTotalRevenue = 0;
      
      monthlyProductData
        .filter(item => item._id.month === month)
        .forEach(item => {
          const productName = productMap.get(item._id.product.toString());
          // Quantity data
          monthData[productName] = (monthData[productName] || 0) + item.quantity;
          // Revenue data per product
          monthData[`${productName}_revenue`] = (monthData[`${productName}_revenue`] || 0) + item.revenue;
          monthTotalRevenue += item.revenue;
        });
      
      // Ensure all products have a value (0 if not present)
      products.forEach(productName => {
        if (!(productName in monthData)) {
          monthData[productName] = 0;
          monthData[`${productName}_revenue`] = 0;
        }
      });
      
      monthData.totalRevenue = monthTotalRevenue;
      return monthData;
    });
    
    res.json({
      totalOrders,
      totalRevenue,
      ordersByStatus,
      ordersByDate,
      topProducts: topProductsWithNames,
      monthlyProductChart: {
        data: chartData,
        products: products,
        months: months
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== HERO SECTION MANAGEMENT ==========

// Get hero section
router.get('/hero', async (req, res) => {
  try {
    let hero = await HeroSection.findOne({ isActive: true });
    
    if (!hero) {
      // Create default hero if none exists
      hero = new HeroSection({
        title: 'Discover Scents That Tell Your Story',
        subtitle: 'Let your presence linger beautifully. Explore our handcrafted fragrances designed to match every personality.',
        primaryButtonText: 'Shop Now',
        secondaryButtonText: 'Vote Your Favorite',
        isActive: true,
      });
      await hero.save();
    }
    
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update hero section
router.put('/hero', async (req, res) => {
  try {
    let hero = await HeroSection.findOne({ isActive: true });
    
    if (!hero) {
      hero = new HeroSection(req.body);
      hero.isActive = true;
    } else {
      Object.assign(hero, req.body);
    }
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ========== ANNOUNCEMENT BANNER MANAGEMENT ==========

// Update announcement banner (admin only)
router.put('/announcement', async (req, res) => {
  try {
    let banner = await AnnouncementBanner.findOne();
    
    if (!banner) {
      banner = new AnnouncementBanner({
        text: req.body.text || 'Opening Sale Live',
        isActive: req.body.isActive !== undefined ? req.body.isActive : false,
      });
    } else {
      if (req.body.text !== undefined) banner.text = req.body.text;
      if (req.body.isActive !== undefined) banner.isActive = req.body.isActive;
    }
    
    await banner.save();
    res.json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ========== SETTINGS MANAGEMENT ==========

// Get settings (public route for delivery charge)
router.get('/settings', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({ deliveryCharge: settings.deliveryCharge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get full settings (admin only)
router.get('/settings/full', authenticate, isAdmin, async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update delivery charge (admin only)
router.put('/settings/delivery-charge', authenticate, isAdmin, async (req, res) => {
  try {
    const { deliveryCharge } = req.body;
    
    if (deliveryCharge === undefined || deliveryCharge < 0) {
      return res.status(400).json({ message: 'Delivery charge must be a non-negative number' });
    }
    
    const settings = await Settings.getSettings();
    settings.deliveryCharge = deliveryCharge;
    await settings.save();
    
    res.json({ message: 'Delivery charge updated successfully', deliveryCharge: settings.deliveryCharge });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

