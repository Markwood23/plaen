/**
 * Telemetry tracking for payment events
 * Abstracted to work with any analytics provider (Segment, Mixpanel, etc.)
 */

export type TelemetryEvent =
  | 'page_view'
  | 'method_selected'
  | 'payment_initiated'
  | 'payment_completed'
  | 'payment_failed'
  | 'receipt_viewed'
  | 'receipt_downloaded'
  | 'payment_retry'
  | 'offline_detected';

export interface TelemetryProperties {
  [key: string]: string | number | boolean | undefined;
}

class Telemetry {
  private enabled: boolean;

  constructor() {
    this.enabled = typeof window !== 'undefined' && process.env.NODE_ENV === 'production';
  }

  /**
   * Track an event
   */
  track(event: TelemetryEvent, properties?: TelemetryProperties): void {
    if (!this.enabled) {
      console.log('[Telemetry]', event, properties);
      return;
    }

    // Segment/Analytics.js
    if ((window as any).analytics?.track) {
      (window as any).analytics.track(event, {
        ...properties,
        timestamp: new Date().toISOString(),
        page_path: window.location.pathname,
        page_url: window.location.href,
      });
    }

    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', event, properties);
    }

    // Custom tracking
    if ((window as any).__PLAEN_TRACK__) {
      (window as any).__PLAEN_TRACK__(event, properties);
    }
  }

  /**
   * Track page view
   */
  pageView(path: string, properties?: TelemetryProperties): void {
    this.track('page_view', {
      ...properties,
      page_path: path,
    });
  }

  /**
   * Track payment method selection
   */
  methodSelected(invoiceId: string, method: string): void {
    this.track('method_selected', {
      invoice_id: invoiceId,
      method,
    });
  }

  /**
   * Track payment initiation
   */
  paymentInitiated(invoiceId: string, method: string, amount: number): void {
    this.track('payment_initiated', {
      invoice_id: invoiceId,
      method,
      amount,
    });
  }

  /**
   * Track successful payment
   */
  paymentCompleted(invoiceId: string, method: string, amount: number, transactionId: string): void {
    this.track('payment_completed', {
      invoice_id: invoiceId,
      method,
      amount,
      transaction_id: transactionId,
    });
  }

  /**
   * Track failed payment
   */
  paymentFailed(invoiceId: string, method: string, error: string): void {
    this.track('payment_failed', {
      invoice_id: invoiceId,
      method,
      error,
    });
  }

  /**
   * Track receipt view
   */
  receiptViewed(transactionId: string): void {
    this.track('receipt_viewed', {
      transaction_id: transactionId,
    });
  }

  /**
   * Track receipt download
   */
  receiptDownloaded(transactionId: string, format: 'pdf' | 'print'): void {
    this.track('receipt_downloaded', {
      transaction_id: transactionId,
      format,
    });
  }

  /**
   * Track payment retry
   */
  paymentRetry(invoiceId: string, previousMethod: string): void {
    this.track('payment_retry', {
      invoice_id: invoiceId,
      previous_method: previousMethod,
    });
  }

  /**
   * Track offline detection
   */
  offlineDetected(invoiceId: string): void {
    this.track('offline_detected', {
      invoice_id: invoiceId,
    });
  }
}

// Export singleton instance
export const telemetry = new Telemetry();
