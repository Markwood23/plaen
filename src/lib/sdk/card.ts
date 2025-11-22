/**
 * Card Payment SDK Loader
 * Lazy-loaded when Card payment method is selected
 */

export async function initializeCardSDK() {
  // In production, this would load Stripe, Paystack, or similar
  // For now, this is a placeholder
  return Promise.resolve({
    version: '1.0.0',
    provider: 'card',
  });
}

export default initializeCardSDK;
