/**
 * Cart Service
 * Business logic for shopping cart management
 *
 * Note: Cart is stored in-memory/session for simplicity in PoC
 * In production, consider Redis or database-backed carts
 */

interface CartItem {
  productId: string;
  paymentMethod: 'cash' | 'credits';
  product?: any; // Product snapshot
}

interface Cart {
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// In-memory cart storage (replace with Redis in production)
const carts = new Map<string, Cart>();

export class CartService {
  /**
   * Get user's cart
   */
  getCart(userId: string): Cart {
    if (!carts.has(userId)) {
      carts.set(userId, {
        userId,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return carts.get(userId)!;
  }

  /**
   * Add item to cart
   */
  addItem(userId: string, productId: string, paymentMethod: 'cash' | 'credits' = 'cash') {
    const cart = this.getCart(userId);

    // Check if item already exists
    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      // Update payment method
      existingItem.paymentMethod = paymentMethod;
    } else {
      // Add new item
      cart.items.push({
        productId,
        paymentMethod,
      });
    }

    cart.updatedAt = new Date();
    return cart;
  }

  /**
   * Remove item from cart
   */
  removeItem(userId: string, productId: string) {
    const cart = this.getCart(userId);
    cart.items = cart.items.filter((item) => item.productId !== productId);
    cart.updatedAt = new Date();
    return cart;
  }

  /**
   * Update item payment method
   */
  updatePaymentMethod(userId: string, productId: string, paymentMethod: 'cash' | 'credits') {
    const cart = this.getCart(userId);
    const item = cart.items.find((item) => item.productId === productId);

    if (item) {
      item.paymentMethod = paymentMethod;
      cart.updatedAt = new Date();
    }

    return cart;
  }

  /**
   * Get cart totals (requires product data)
   */
  async getCartWithTotals(userId: string, productsService: any) {
    const cart = this.getCart(userId);

    let cashTotal = 0;
    let creditsTotal = 0;

    // Fetch product details and calculate totals
    const itemsWithProducts = await Promise.all(
      cart.items.map(async (item) => {
        const product = await productsService.getProduct(item.productId);

        if (product) {
          if (item.paymentMethod === 'cash') {
            cashTotal += Number(product.cashPrice);
          } else {
            creditsTotal += product.creditPrice;
          }
        }

        return {
          ...item,
          product,
        };
      })
    );

    return {
      ...cart,
      items: itemsWithProducts,
      cashTotal,
      creditsTotal,
    };
  }

  /**
   * Clear cart
   */
  clearCart(userId: string) {
    const cart = this.getCart(userId);
    cart.items = [];
    cart.updatedAt = new Date();
    return cart;
  }

  /**
   * Get cart item count
   */
  getItemCount(userId: string): number {
    const cart = this.getCart(userId);
    return cart.items.length;
  }
}

export const cartService = new CartService();
