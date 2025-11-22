/**
 * Mobile Money SDK Loader
 * Lazy-loaded when MoMo payment method is selected
 */

export async function initializeMoMoSDK() {
  // In production, this would load the actual MoMo SDK
  // For now, this is a placeholder
  return Promise.resolve({
    version: '1.0.0',
    provider: 'momo',
  });
}

export default initializeMoMoSDK;
