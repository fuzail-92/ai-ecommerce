const Cart = require("../cart/cart.model");
const Product = require("../products/product.model");
const User = require("../users/user.model");
const Order = require("../orders/order.model");
const AppError = require("../../utils/appError");
const inventoryService = require("../inventory/inventory.service");

// Preview checkout: calculate totals without creating order/reserving stock
const previewCheckout = async (userId, { addressId }) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  // Load user and address
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  let address = null;
  if (addressId) {
    address = user.addresses.id(addressId);
    if (!address) throw new AppError("Address not found", 404);
  }

  let subtotal = 0;
  const items = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.product._id || item.product);
    if (!product || product.status !== "active") {
      throw new AppError(
        `Product not available: ${item.product.name || item.product}`,
        400,
      );
    }

    let price = product.price;
    let variant = null;
    if (item.variant) {
      variant = product.variants.id(item.variant);
      if (!variant) throw new AppError("Variant not found", 404);
      price =
        variant.price !== undefined && variant.price !== null
          ? variant.price
          : product.price;
    }

    // Check inventory availability
    const inventory = await inventoryService.getInventory(
      product._id,
      item.variant || null,
    );
    if (inventory.availableStock < item.quantity) {
      throw new AppError(
        `Insufficient stock for ${product.name}. Available: ${inventory.availableStock}`,
        400,
      );
    }

    const totalPrice = price * item.quantity;
    subtotal += totalPrice;

    items.push({
      product: product._id,
      variant: variant ? variant._id : null,
      name: product.name,
      quantity: item.quantity,
      price,
      totalPrice,
    });
  }

  // Shipping cost: simple fixed rate (could be dynamic later)
  const shippingCost = subtotal > 5000 ? 0 : 150;
  const taxAmount = Math.round((subtotal + shippingCost) * 0.05); // 5% tax
  const totalAmount = subtotal + shippingCost + taxAmount;

  return {
    items,
    subtotal,
    shippingCost,
    taxAmount,
    totalAmount,
    address: address || null,
  };
};

// Execute checkout: validate, reserve stock, create order
const executeCheckout = async (userId, { addressId }) => {
  const preview = await previewCheckout(userId, { addressId });

  // Load user to get address snapshot
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const address = user.addresses.id(addressId);
  if (!address) throw new AppError("Address not found", 404);

  // Reserve inventory for each item
  const reservationIds = [];
  for (const item of preview.items) {
    const reservation = await inventoryService.reserveStock(
      item.product,
      item.variant || null,
      item.quantity,
      "Order reservation",
      null,
    );
    reservationIds.push(reservation._id.toString());
  }

  // Create order
  const order = await Order.create({
    user: userId,
    items: preview.items,
    shippingAddress: {
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    },
    subtotal: preview.subtotal,
    shippingCost: preview.shippingCost,
    taxAmount: preview.taxAmount,
    totalAmount: preview.totalAmount,
    status: "PAYMENT_PENDING",
    paymentStatus: "PENDING",
    reservationIds,
  });

  // Clear the cart after order creation (optional, can also keep until payment)
  // For now, clear cart
  await Cart.findOneAndUpdate({ user: userId }, { items: [] });

  return order;
};

module.exports = {
  previewCheckout,
  executeCheckout,
};
