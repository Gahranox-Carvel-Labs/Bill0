import { Injectable } from '@angular/core';
import { CurrencyCode, LineItem, Money, ProrationDetails, TaxType, Invoice } from './models';

@Injectable({
    providedIn: 'root'
})
export class CalculationService {

    constructor() { }

    /**
     * STRICT ORDER OF OPERATIONS:
     * 1. Calculate Line Item Subtotal (Quantity * Unit Price)
     * 2. Apply Discounts (Pre-tax)
     * 3. Calculate Tax
     * 4. Rounding
     */
    calculateLineItem(item: Partial<LineItem>): LineItem {
        // 1. Calculate Line Item Subtotal
        const qty = item.quantity || 0;
        const price = item.unitPrice ? item.unitPrice.amount : 0;
        let baseAmount = price * qty;

        if (item.proration) {
            baseAmount = Math.round(baseAmount * item.proration.factor);
        }

        // Discounts
        let discountAmount = 0;
        if (item.discount) {
            discountAmount = item.discount.amount;
        }

        // Taxable Amount
        let taxableAmount = baseAmount - discountAmount;
        let taxAmount = 0;

        if (item.taxData!.type === TaxType.Exclusive) {
            // Tax is added ON TOP
            taxAmount = (taxableAmount * item.taxData!.rate) / 100;
        } else {
            // Tax is BAKED IN.
            const grossAmount = taxableAmount;
            const baseNet = grossAmount / (1 + item.taxData!.rate / 100);
            taxAmount = grossAmount - baseNet;
        }

        // 4. Rounding
        taxAmount = Math.round(taxAmount);

        const currency = item.unitPrice!.currency;

        return {
            ...item,
            subtotal: { amount: baseAmount, currency },
            taxAmount: { amount: taxAmount, currency },
            total: {
                amount: (item.taxData!.type === TaxType.Exclusive)
                    ? (taxableAmount + taxAmount)
                    : (baseAmount - discountAmount),
                currency
            }
        } as LineItem;
    }

    calculateInvoice(invoiceData: Partial<Invoice>): Invoice {
        // 1. Calculate each line item
        const calculatedItems = (invoiceData.lineItems || []).map(item => this.calculateLineItem(item));

        // 2. Aggregate Totals
        let subtotalAmount = 0;
        let totalTaxAmount = 0;
        let totalDiscountAmount = 0;
        let grandTotalAmount = 0;

        const currency = invoiceData.currency || CurrencyCode.USD;

        calculatedItems.forEach(item => {
            subtotalAmount += item.subtotal!.amount; // Computed in calculateLineItem
            totalTaxAmount += item.taxAmount!.amount;
            if (item.discount) {
                totalDiscountAmount += item.discount.amount;
            }
            grandTotalAmount += item.total!.amount;
        });

        return {
            ...invoiceData,
            lineItems: calculatedItems,
            subtotal: { amount: subtotalAmount, currency },
            totalTax: { amount: totalTaxAmount, currency },
            totalDiscount: { amount: totalDiscountAmount, currency },
            grandTotal: { amount: grandTotalAmount, currency }
        } as Invoice;
    }

    calculateProration(startDate: Date, endDate: Date, periodStart: Date, periodEnd: Date): ProrationDetails {
        // Formula: (Days of Use / Total Days) logic standard
        const oneDay = 24 * 60 * 60 * 1000;
        const totalDays = Math.round(Math.abs((periodEnd.getTime() - periodStart.getTime()) / oneDay)) + 1;

        // Intersection of Usage and Period
        const effectiveStart = startDate > periodStart ? startDate : periodStart;
        const effectiveEnd = endDate < periodEnd ? endDate : periodEnd;

        let daysOfUse = 0;
        if (effectiveEnd >= effectiveStart) {
            daysOfUse = Math.round(Math.abs((effectiveEnd.getTime() - effectiveStart.getTime()) / oneDay)) + 1;
        }

        const factor = daysOfUse / totalDays;

        return {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            totalDaysInPeriod: totalDays,
            daysOfUse: daysOfUse,
            factor: factor
        };
    }
}
