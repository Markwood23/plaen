'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Save, Send, Eye, Building2, User, Calculator, FileText, Calendar } from 'lucide-react';
import { mockBusinessProfile, type InvoiceItem } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';

export default function NewInvoice() {
  const [invoiceData, setInvoiceData] = useState({
    clientName: '',
    clientEmail: '',
    dueDate: '',
    notes: '',
    taxRate: 0,
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (invoiceData.taxRate / 100);
  const total = subtotal + taxAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: mockBusinessProfile.preferredCurrency,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-medium text-black">
              plæn.
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-black hover:bg-gray-50">
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button variant="outline" className="border-gray-200 text-black hover:bg-gray-50">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button className="bg-black text-white hover:bg-gray-800">
                <Send className="mr-2 h-4 w-4" />
                Send Invoice
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-medium text-black mb-2">New Invoice</h1>
          <p className="text-gray-600">Create a professional invoice for your client.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Invoice Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* From Section */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-medium text-black">
                  <Building2 className="mr-2 h-5 w-5 text-gray-600" />
                  From
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-6 border border-gray-200">
                  <div className="space-y-2">
                    <div className="font-semibold text-black text-lg">{mockBusinessProfile.companyName}</div>
                    <div className="text-gray-700">{mockBusinessProfile.email}</div>
                    {mockBusinessProfile.phone && (
                      <div className="text-gray-700">{mockBusinessProfile.phone}</div>
                    )}
                    {mockBusinessProfile.address && (
                      <div className="text-gray-700">{mockBusinessProfile.address}</div>
                    )}
                    {mockBusinessProfile.taxId && (
                      <div className="text-sm text-gray-500 mt-3 pt-2 border-t border-gray-300">
                        Tax ID: {mockBusinessProfile.taxId}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* To Section */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-medium text-black">
                  <User className="mr-2 h-5 w-5 text-gray-600" />
                  To
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="clientName" className="text-sm font-medium">Client Name *</Label>
                    <Input
                      id="clientName"
                      value={invoiceData.clientName}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, clientName: e.target.value }))}
                      className="mt-2 border-gray-200 focus:border-black focus:ring-black"
                      placeholder="Client or company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail" className="text-sm font-medium">Client Email *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={invoiceData.clientEmail}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, clientEmail: e.target.value }))}
                      className="mt-2 border-gray-200 focus:border-black focus:ring-black"
                      placeholder="client@example.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Section */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="flex items-center text-lg font-medium text-black">
                  <FileText className="mr-2 h-5 w-5 text-gray-600" />
                  Items
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="border-gray-200 text-black hover:bg-gray-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Items Header */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 text-sm font-medium text-gray-600 pb-2 border-b border-gray-200">
                    <div className="md:col-span-5">Description</div>
                    <div className="md:col-span-2">Quantity</div>
                    <div className="md:col-span-2">Rate</div>
                    <div className="md:col-span-3">Amount</div>
                  </div>
                  
                  {items.map((item, index) => (
                    <div key={item.id} className="grid gap-4 rounded-lg border border-gray-200 p-4 md:grid-cols-12 hover:border-gray-300 transition-colors">
                      <div className="md:col-span-5">
                        <Label htmlFor={`description-${item.id}`} className="text-sm font-medium md:sr-only">
                          Description
                        </Label>
                        <Input
                          id={`description-${item.id}`}
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="mt-1 md:mt-0 border-gray-200 focus:border-black focus:ring-black"
                          placeholder="Description of work or product"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`quantity-${item.id}`} className="text-sm font-medium md:sr-only">
                          Quantity
                        </Label>
                        <Input
                          id={`quantity-${item.id}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="mt-1 md:mt-0 border-gray-200 focus:border-black focus:ring-black"
                          placeholder="Qty"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`rate-${item.id}`} className="text-sm font-medium md:sr-only">
                          Rate
                        </Label>
                        <Input
                          id={`rate-${item.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="mt-1 md:mt-0 border-gray-200 focus:border-black focus:ring-black"
                          placeholder="Rate"
                        />
                      </div>
                      <div className="flex items-center justify-between md:col-span-3">
                        <div className="font-semibold text-black text-lg">
                          {formatCurrency(item.amount)}
                        </div>
                        {items.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-medium text-black">
                  <Calculator className="mr-2 h-5 w-5 text-gray-600" />
                  Additional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="mt-2 border-gray-200 focus:border-black focus:ring-black"
                    />
                    <p className="mt-1 text-xs text-gray-500">Optional - when payment is due</p>
                  </div>
                  <div>
                    <Label htmlFor="taxRate" className="text-sm font-medium">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={invoiceData.taxRate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                      className="mt-2 border-gray-200 focus:border-black focus:ring-black"
                      placeholder="0"
                    />
                    <p className="mt-1 text-xs text-gray-500">Applied to subtotal</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                  <Textarea
                    id="notes"
                    value={invoiceData.notes}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-2 border-gray-200 focus:border-black focus:ring-black"
                    placeholder="Payment terms, thank you note, or other details..."
                    rows={4}
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional - appears at bottom of invoice</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 border-gray-200 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-medium text-black">
                  <Calculator className="mr-2 h-5 w-5 text-gray-600" />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Invoice Preview */}
                <div className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-4 border border-gray-200">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Invoice Total</div>
                    <div className="text-3xl font-bold text-black">
                      {formatCurrency(total)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {items.length} item{items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-black">{formatCurrency(subtotal)}</span>
                  </div>
                  {invoiceData.taxRate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax ({invoiceData.taxRate}%)</span>
                      <span className="font-medium text-black">{formatCurrency(taxAmount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                    <span className="text-black">Total</span>
                    <span className="text-black">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Status Info */}
                <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <div className="font-medium mb-1">Ready to send</div>
                    <div className="text-xs text-blue-600">
                      Invoice will be sent to {invoiceData.clientEmail || 'client email'}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-black text-white hover:bg-gray-800 h-11"
                    disabled={!invoiceData.clientName || !invoiceData.clientEmail || items.some(item => !item.description)}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Invoice
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="border-gray-200 text-black hover:bg-gray-50">
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button variant="outline" className="border-gray-200 text-black hover:bg-gray-50">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
