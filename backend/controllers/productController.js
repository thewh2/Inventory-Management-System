const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

// GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Supplier,
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['id', 'DESC']]
    });
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Server error while fetching products.' });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Supplier,
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ message: 'Server error while fetching product.' });
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, supplierId, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Product name is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Product description is required.' });
    }
    if (price === undefined || price === null || price === '' || Number(price) < 0) {
      return res.status(400).json({ message: 'Price cannot be negative.' });
    }
    if (quantity === undefined || quantity === null || quantity === '' || Number(quantity) < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative.' });
    }
    if (!supplierId) {
      return res.status(400).json({ message: 'Supplier must be selected.' });
    }

    // Verify supplier exists
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: 'Selected supplier does not exist.' });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      supplierId: parseInt(supplierId, 10),
      image: image || null
    });

    const populatedProduct = await Product.findByPk(product.id, {
      include: [{ model: Supplier, attributes: ['id', 'name', 'email', 'phone'] }]
    });

    return res.status(201).json({ message: 'Product created successfully.', product: populatedProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Server error while creating product.' });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, supplierId, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Product name is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Product description is required.' });
    }
    if (price === undefined || price === null || price === '' || Number(price) < 0) {
      return res.status(400).json({ message: 'Price cannot be negative.' });
    }
    if (quantity === undefined || quantity === null || quantity === '' || Number(quantity) < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative.' });
    }
    if (!supplierId) {
      return res.status(400).json({ message: 'Supplier must be selected.' });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Verify supplier exists
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: 'Selected supplier does not exist.' });
    }

    product.name = name.trim();
    product.description = description.trim();
    product.price = parseFloat(price);
    product.quantity = parseInt(quantity, 10);
    product.supplierId = parseInt(supplierId, 10);
    if (image !== undefined) {
      product.image = image;
    }

    await product.save();

    const populatedProduct = await Product.findByPk(product.id, {
      include: [{ model: Supplier, attributes: ['id', 'name', 'email', 'phone'] }]
    });

    return res.status(200).json({ message: 'Product updated successfully.', product: populatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Server error while updating product.' });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await product.destroy();
    return res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Server error while deleting product.' });
  }
};
