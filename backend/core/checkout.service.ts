/**
 * Checkout Service
 * Orchestrates the checkout process with payments and credits
 */

import { getPaymentProvider } from '../providers/payment/index.js';
import { productsService } from './products.service.js';
import { creditsService } from './credits.service.js';
import { ordersService } from './orders.service.js';
import { cartService } from './cart.service.js';

export class CheckoutService {
  /**
   * Process checkout with cash payment
   */
  async checkoutWithCash(userId: string, cardDetails: any) {
    const paymentProvider = getPaymentProvider();

    // Get cart with totals
    const cart = await cartService.getCartWithTotals(userId, productsService);

    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Separate cash and credit items
    const cashItems = cart.items.filter((item) => item.paymentMethod === 'cash');
    const creditItems = cart.items.filter((item) => item.paymentMethod === 'credits');

    // Create order
    const order = await ordersService.createOrder(
      userId,
      cart.items,
      cart.cashTotal,
      cart.creditsTotal
    );

    try {
      // Process credit items first (no external payment needed)
      if (creditItems.length > 0 && cart.creditsTotal > 0) {
        await creditsService.deductCredits(
          userId,
          cart.creditsTotal,
          'spend',
          order.id
        );
      }

      // Process cash payment if any
      if (cashItems.length > 0 && cart.cashTotal > 0) {
        // Create payment intent
        const paymentIntent = await paymentProvider.createPaymentIntent(
          cart.cashTotal,
          'USD',
          { orderId: order.id, userId }
        );

        // Tokenize and charge card
        const token = await paymentProvider.createToken(cardDetails);
        const charge = await paymentProvider.chargeToken(
          token.token,
          cart.cashTotal,
          'USD'
        );

        if (!charge.success) {
          // Payment failed, rollback credit deduction if any
          if (creditItems.length > 0 && cart.creditsTotal > 0) {
            await creditsService.addCredits(
              userId,
              cart.creditsTotal,
              'refund',
              order.id
            );
          }

          await ordersService.updateOrderStatus(order.id, 'failed');
          throw new Error(charge.error || 'Payment failed');
        }

        // Update order with payment transaction ID
        await ordersService.updateOrderStatus(
          order.id,
          'completed',
          charge.transactionId
        );
      } else {
        // Credits only, mark as completed
        await ordersService.updateOrderStatus(order.id, 'completed');
      }

      // Grant access to all products
      await ordersService.grantProductAccess(userId, order.id);

      // Increment product popularity
      for (const item of cart.items) {
        await productsService.incrementPopularity(item.productId);
      }

      // Clear cart
      cartService.clearCart(userId);

      return {
        success: true,
        orderId: order.id,
        message: 'Purchase completed successfully',
      };
    } catch (error: any) {
      await ordersService.updateOrderStatus(order.id, 'failed');
      throw error;
    }
  }

  /**
   * Process checkout with credits only
   */
  async checkoutWithCredits(userId: string) {
    const cart = await cartService.getCartWithTotals(userId, productsService);

    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Verify all items are set to credits
    const cashItems = cart.items.filter((item) => item.paymentMethod === 'cash');
    if (cashItems.length > 0) {
      throw new Error('Some items are set to cash payment. Please update payment methods.');
    }

    // Check credit balance
    const balance = await creditsService.getBalance(userId);
    if (balance < cart.creditsTotal) {
      throw new Error(
        `Insufficient credits. Balance: ${balance}, Required: ${cart.creditsTotal}`
      );
    }

    // Create order
    const order = await ordersService.createOrder(
      userId,
      cart.items,
      0,
      cart.creditsTotal
    );

    try {
      // Deduct credits
      await creditsService.deductCredits(userId, cart.creditsTotal, 'spend', order.id);

      // Mark order as completed
      await ordersService.updateOrderStatus(order.id, 'completed');

      // Grant access
      await ordersService.grantProductAccess(userId, order.id);

      // Increment product popularity
      for (const item of cart.items) {
        await productsService.incrementPopularity(item.productId);
      }

      // Clear cart
      cartService.clearCart(userId);

      return {
        success: true,
        orderId: order.id,
        creditsSpent: cart.creditsTotal,
        message: 'Purchase completed with credits',
      };
    } catch (error: any) {
      await ordersService.updateOrderStatus(order.id, 'failed');
      throw error;
    }
  }

  /**
   * Process mixed checkout (some cash, some credits)
   */
  async checkoutMixed(userId: string, cardDetails?: any) {
    const cart = await cartService.getCartWithTotals(userId, productsService);

    if (cart.cashTotal > 0 && !cardDetails) {
      throw new Error('Card details required for cash payment');
    }

    if (cart.cashTotal === 0) {
      return this.checkoutWithCredits(userId);
    }

    return this.checkoutWithCash(userId, cardDetails);
  }
}

export const checkoutService = new CheckoutService();
