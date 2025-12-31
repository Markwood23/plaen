/**
 * Date Utilities
 * 
 * Functions for date calculations, aging buckets, overdue detection, and DSO.
 */

import { differenceInDays, differenceInCalendarDays, isAfter, isBefore, addDays, startOfDay } from 'date-fns'

export type AgingBucket = 'current' | 'attention' | 'concerning' | 'critical'

export interface AgingResult {
  bucket: AgingBucket
  daysOverdue: number
  label: string
}

/**
 * Calculate aging bucket based on days past due date
 * - current: 0-30 days
 * - attention: 31-60 days  
 * - concerning: 61-90 days
 * - critical: 90+ days
 */
export function getAgingBucket(dueDate: Date | string, referenceDate: Date = new Date()): AgingResult {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  const ref = startOfDay(referenceDate)
  const dueDay = startOfDay(due)
  
  const daysOverdue = differenceInCalendarDays(ref, dueDay)
  
  if (daysOverdue <= 30) {
    return { bucket: 'current', daysOverdue, label: '0-30 days' }
  } else if (daysOverdue <= 60) {
    return { bucket: 'attention', daysOverdue, label: '31-60 days' }
  } else if (daysOverdue <= 90) {
    return { bucket: 'concerning', daysOverdue, label: '61-90 days' }
  } else {
    return { bucket: 'critical', daysOverdue, label: '90+ days' }
  }
}

/**
 * Check if an invoice is overdue
 * Overdue = due_date < today AND balance > 0
 */
export function isOverdue(dueDate: Date | string, balanceMinor: number): boolean {
  if (balanceMinor <= 0) return false
  
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  const today = startOfDay(new Date())
  const dueDay = startOfDay(due)
  
  return isAfter(today, dueDay)
}

/**
 * Check if an invoice is due soon (within N days)
 */
export function isDueSoon(dueDate: Date | string, withinDays: number = 7): boolean {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  const today = startOfDay(new Date())
  const dueDay = startOfDay(due)
  const threshold = addDays(today, withinDays)
  
  return isAfter(dueDay, today) && isBefore(dueDay, threshold)
}

/**
 * Calculate Days Sales Outstanding (DSO)
 * DSO = (Accounts Receivable / Total Credit Sales) × Number of Days
 * 
 * @param outstandingMinor - Total outstanding AR in minor units
 * @param totalSalesMinor - Total credit sales for period in minor units
 * @param periodDays - Number of days in the period (default 30)
 */
export function calculateDSO(
  outstandingMinor: number,
  totalSalesMinor: number,
  periodDays: number = 30
): number {
  if (totalSalesMinor === 0) return 0
  
  const dso = (outstandingMinor / totalSalesMinor) * periodDays
  return Math.round(dso * 10) / 10 // Round to 1 decimal
}

/**
 * Calculate on-time payment rate
 * On-time = paid within N days of issue date
 * 
 * @param invoices - Array of invoice payment data
 * @param thresholdDays - Number of days to consider "on-time" (default 3)
 */
export function calculateOnTimeRate(
  invoices: Array<{ issueDate: Date | string; paidDate: Date | string | null; status: string }>,
  thresholdDays: number = 3
): number {
  const paidInvoices = invoices.filter(inv => inv.status === 'paid' && inv.paidDate)
  
  if (paidInvoices.length === 0) return 0
  
  const onTimeCount = paidInvoices.filter(inv => {
    const issue = typeof inv.issueDate === 'string' ? new Date(inv.issueDate) : inv.issueDate
    const paid = typeof inv.paidDate === 'string' ? new Date(inv.paidDate!) : inv.paidDate!
    
    const daysToPay = differenceInCalendarDays(paid, issue)
    return daysToPay <= thresholdDays
  }).length
  
  return Math.round((onTimeCount / paidInvoices.length) * 100)
}

/**
 * Calculate collection rate
 * Collection Rate = (Total Collected / Total Invoiced) × 100
 */
export function calculateCollectionRate(
  collectedMinor: number,
  invoicedMinor: number
): number {
  if (invoicedMinor === 0) return 0
  return Math.round((collectedMinor / invoicedMinor) * 100)
}

/**
 * Get days until due date (negative if overdue)
 */
export function getDaysUntilDue(dueDate: Date | string): number {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  const today = startOfDay(new Date())
  const dueDay = startOfDay(due)
  
  return differenceInCalendarDays(dueDay, today)
}

/**
 * Format days as human-readable string
 */
export function formatDaysUntilDue(dueDate: Date | string): string {
  const days = getDaysUntilDue(dueDate)
  
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days === -1) return '1 day overdue'
  if (days > 0) return `Due in ${days} days`
  return `${Math.abs(days)} days overdue`
}
