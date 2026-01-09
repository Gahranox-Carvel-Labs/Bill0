import { Injectable, signal, computed, effect } from '@angular/core';
import { Invoice, Product, Account, InvoiceStatus, InvoiceType, CurrencyCode } from './models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class BillingService {

    // Signals for State
    readonly invoices = signal<Invoice[]>([]);
    readonly products = signal<Product[]>([]);
    readonly customers = signal<Account[]>([]);
    readonly sellerProfile = signal<Account | null>(null);

    constructor() {
        this.loadFromStorage();

        // Auto-save effect
        effect(() => {
            localStorage.setItem('raseed_invoices', JSON.stringify(this.invoices()));
            localStorage.setItem('raseed_products', JSON.stringify(this.products()));
            localStorage.setItem('raseed_customers', JSON.stringify(this.customers()));
            if (this.sellerProfile()) {
                localStorage.setItem('raseed_seller', JSON.stringify(this.sellerProfile()));
            }
        });
    }

    private loadFromStorage() {
        const invoices = localStorage.getItem('raseed_invoices');
        if (invoices) this.invoices.set(JSON.parse(invoices));

        const products = localStorage.getItem('raseed_products');
        if (products) this.products.set(JSON.parse(products));

        const customers = localStorage.getItem('raseed_customers');
        if (customers) this.customers.set(JSON.parse(customers));

        const seller = localStorage.getItem('raseed_seller');
        if (seller) this.sellerProfile.set(JSON.parse(seller));
    }

    // --- Actions ---

    generateInvoiceNumber(): string {
        // Gapless sequential numbering
        // Format: INV-{YYYY}-{0000}
        const currentYear = new Date().getFullYear();
        const prefix = `INV-${currentYear}-`;

        // Filter invoices from this year
        const yearlyInvoices = this.invoices().filter(inv => inv.invoiceNumber.startsWith(prefix));

        let maxSeq = 0;
        yearlyInvoices.forEach(inv => {
            const parts = inv.invoiceNumber.split('-');
            const seq = parseInt(parts[2], 10);
            if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
        });

        const nextSeq = maxSeq + 1;
        return `${prefix}${nextSeq.toString().padStart(4, '0')}`;
    }

    createInvoice(invoiceData: Partial<Invoice>, idempotencyKey: string): Invoice {
        // Check Idempotency
        const existing = this.invoices().find(i => i.idempotencyKey === idempotencyKey);
        if (existing) return existing;

        const newInvoice: Invoice = {
            id: uuidv4(),
            invoiceNumber: this.generateInvoiceNumber(),
            issueDate: invoiceData.issueDate || new Date().toISOString(),
            dueDate: invoiceData.dueDate || new Date().toISOString(),
            status: InvoiceStatus.Draft,
            type: invoiceData.type || InvoiceType.Simplified,
            seller: this.sellerProfile()!,
            buyer: invoiceData.buyer!,
            lineItems: invoiceData.lineItems || [],
            subtotal: invoiceData.subtotal!,
            totalDiscount: invoiceData.totalDiscount!,
            totalTax: invoiceData.totalTax!,
            grandTotal: invoiceData.grandTotal!,
            currency: invoiceData.currency || CurrencyCode.USD,
            idempotencyKey: idempotencyKey,
            notes: invoiceData.notes
        };

        this.invoices.update(inv => [...inv, newInvoice]);
        return newInvoice;
    }

    updateInvoiceStatus(id: string, status: InvoiceStatus) {
        this.invoices.update(invs => invs.map(inv =>
            inv.id === id ? { ...inv, status } : inv
        ));
    }

    // Versions: For products, we don't overwrite. We assume new product entry or versioning logic
    // "Do not overwrite records... Use effective_at"
    // For this MVp, we will just create new Product entries if price changes in a real DB, 
    // but here we can just update the list. 
    addProduct(product: Product) {
        this.products.update(p => [...p, product]);
    }

    saveSellerProfile(profile: Account) {
        this.sellerProfile.set(profile);
    }
}
