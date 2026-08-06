export interface ReceiptDto {
    merchant: string | null;
    amount: number | null;
    currency: string | null;
    category: string | null;
    date: string | null;
    note: string | null;
}