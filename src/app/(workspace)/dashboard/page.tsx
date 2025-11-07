'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockInvoices, type InvoiceStatus } from '@/lib/mock-data';
import { format } from 'date-fns';
import { Plus, Search, Filter, TrendingUp, DollarSign, FileText, Clock } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch = 
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Calculate dashboard statistics
  const stats = {
    totalInvoices: mockInvoices.length,
    totalRevenue: mockInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
    pendingAmount: mockInvoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0),
    overdueAmount: mockInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0),
    draftCount: mockInvoices.filter(inv => inv.status === 'draft').length,
    paidCount: mockInvoices.filter(inv => inv.status === 'paid').length,
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
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome back to Plaen.</span>
              <Button variant="ghost" className="text-black hover:bg-gray-50">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Statistics Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">
                {formatCurrency(stats.totalRevenue, 'GHS')}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                From {stats.paidCount} paid invoice{stats.paidCount !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">
                {formatCurrency(stats.pendingAmount, 'GHS')}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">
                {formatCurrency(stats.overdueAmount, 'GHS')}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">
                {stats.totalInvoices}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.draftCount} draft{stats.draftCount !== 1 ? 's' : ''} remaining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-black">Your workspace is ready.</h1>
            <p className="mt-1 text-gray-600">
              {filteredInvoices.length === 0 && searchQuery === '' && statusFilter === 'all' 
                ? 'No invoices yet — start your first.' 
                : `${filteredInvoices.length} invoice${filteredInvoices.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <Link href="/invoices/new">
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as InvoiceStatus | 'all')}>
            <SelectTrigger className="w-40 border-gray-200">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoice Table */}
        {filteredInvoices.length > 0 ? (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-black">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100 hover:bg-transparent">
                    <TableHead className="font-medium text-black pl-6">Invoice</TableHead>
                    <TableHead className="font-medium text-black">Client</TableHead>
                    <TableHead className="font-medium text-black">Amount</TableHead>
                    <TableHead className="font-medium text-black">Status</TableHead>
                    <TableHead className="font-medium text-black">Date</TableHead>
                    <TableHead className="font-medium text-black pr-6">Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <Link key={invoice.id} href={`/invoice/${invoice.id}`}>
                      <TableRow className="border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <TableCell className="font-medium text-black pl-6">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              invoice.status === 'paid' ? 'bg-green-500' :
                              invoice.status === 'sent' ? 'bg-blue-500' :
                              invoice.status === 'overdue' ? 'bg-red-500' : 'bg-gray-400'
                            }`} />
                            <span>{invoice.invoiceNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">
                          <div>
                            <div className="font-medium">{invoice.clientName}</div>
                            <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900 font-medium">
                          {formatCurrency(invoice.total, invoice.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[invoice.status]} font-medium`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div>
                            <div>{format(invoice.createdAt, 'MMM d, yyyy')}</div>
                            <div className="text-sm text-gray-400">{format(invoice.createdAt, 'h:mm a')}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 pr-6">
                          {invoice.dueDate ? (
                            <div>
                              <div>{format(invoice.dueDate, 'MMM d, yyyy')}</div>
                              <div className="text-sm text-gray-400">
                                {invoice.status === 'overdue' ? 'Overdue' : 'Due'}
                              </div>
                            </div>
                          ) : '—'}
                        </TableCell>
                      </TableRow>
                    </Link>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="mx-auto max-w-sm">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-black mb-2">
                  {searchQuery || statusFilter !== 'all' ? 'No matching invoices' : 'No invoices yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Create your first invoice to get started with Plaen.'}
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Link href="/invoices/new">
                    <Button className="bg-black text-white hover:bg-gray-800">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Invoice
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
