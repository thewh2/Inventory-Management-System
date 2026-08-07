const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const { sequelize, User, Supplier, Product } = require('./models');

const authRoutes = require('./routes/authRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', authRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Database Sync & Initial Seed
const initDB = async () => {
  try {
    await sequelize.sync(); // sync DB tables
    console.log('Database synced successfully.');

    // Seed default admin user if not existing
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword
      });
      console.log('Default admin user created: admin / admin123');
    }

    // Seed initial demo suppliers if empty
    const supplierCount = await Supplier.count();
    if (supplierCount === 0) {
      const s1 = await Supplier.create({
        name: 'Tech World Supplies',
        email: 'contact@techworld.com',
        phone: '+977 9841234567'
      });
      const s2 = await Supplier.create({
        name: 'Office Depot Solutions',
        email: 'info@officedepot.com',
        phone: '+977 9851098765'
      });

      await Product.create({
        name: 'Wireless Ergonomic Mouse',
        description: 'High precision optical sensor wireless mouse.',
        price: 29.99,
        quantity: 15,
        supplierId: s1.id,
        image: null
      });

      await Product.create({
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB mechanical keyboard with tactile switches.',
        price: 79.99,
        quantity: 3, // Low stock demo (< 5)
        supplierId: s1.id,
        image: null
      });

      await Product.create({
        name: 'A4 Printing Paper (500 Sheets)',
        description: 'Premium quality 80gsm white printing paper ream.',
        price: 8.50,
        quantity: 4, // Low stock demo (< 5)
        supplierId: s2.id,
        image: null
      });

      console.log('Demo suppliers and products seeded successfully.');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
