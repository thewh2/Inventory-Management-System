const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

// GET /api/suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      order: [['id', 'DESC']]
    });
    return res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return res.status(500).json({ message: 'Server error while fetching suppliers.' });
  }
};

// GET /api/suppliers/:id
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }
    return res.status(200).json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return res.status(500).json({ message: 'Server error while fetching supplier.' });
  }
};

// POST /api/suppliers
exports.createSupplier = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Supplier name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Supplier email is required.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ message: 'Supplier phone is required.' });
    }

    const supplier = await Supplier.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim()
    });

    return res.status(201).json({ message: 'Supplier created successfully.', supplier });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return res.status(500).json({ message: 'Server error while creating supplier.' });
  }
};

// PUT /api/suppliers/:id
exports.updateSupplier = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Supplier name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Supplier email is required.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ message: 'Supplier phone is required.' });
    }

    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    supplier.name = name.trim();
    supplier.email = email.trim();
    supplier.phone = phone.trim();
    await supplier.save();

    return res.status(200).json({ message: 'Supplier updated successfully.', supplier });
  } catch (error) {
    console.error('Error updating supplier:', error);
    return res.status(500).json({ message: 'Server error while updating supplier.' });
  }
};

// DELETE /api/suppliers/:id
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    await supplier.destroy();
    return res.status(200).json({ message: 'Supplier deleted successfully.' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return res.status(500).json({ message: 'Server error while deleting supplier.' });
  }
};
