const sequelize = require('../config/database');
const User = require('./User');
const Supplier = require('./Supplier');
const Product = require('./Product');

// Define Associations
// One Supplier has many Products
Supplier.hasMany(Product, { foreignKey: 'supplierId', onDelete: 'CASCADE' });
// One Product belongs to one Supplier
Product.belongsTo(Supplier, { foreignKey: 'supplierId' });

module.exports = {
  sequelize,
  User,
  Supplier,
  Product
};
