import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, MapPin, Calendar, DollarSign, FileText, User } from 'lucide-react';
import { ExpenseItem } from '@/types/Expense';

interface ExpenseItemDetailDialogProps {
  expenseItem: ExpenseItem;
  onClose: () => void;
}

const ExpenseItemDetailDialog: React.FC<ExpenseItemDetailDialogProps> = ({
  expenseItem,
  onClose
}) => {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reconciled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Expense Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-lg font-semibold">{expenseItem.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(expenseItem.amount, expenseItem.currency)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <Badge variant="outline" className="mt-1">
                    {expenseItem.category?.name || 'Unknown'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={`mt-1 ${getStatusColor(expenseItem.status)}`}>
                    {expenseItem.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date and Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Date & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expense Date</label>
                  <p className="font-semibold">{formatDate(expenseItem.expense_date)}</p>
                </div>
              </div>

              {expenseItem.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <p className="font-semibold">{expenseItem.location}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Receipt Information */}
          {(expenseItem.receipt_number || expenseItem.receipt_image_url) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Receipt Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {expenseItem.receipt_number && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Receipt Number</label>
                    <p className="font-semibold">{expenseItem.receipt_number}</p>
                  </div>
                )}

                {expenseItem.receipt_image_url && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Receipt Image</label>
                    <div className="mt-2">
                      <img 
                        src={expenseItem.receipt_image_url} 
                        alt="Receipt" 
                        className="max-w-full h-auto rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* People Involved */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">People Involved</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {expenseItem.tour_leader && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tour Leader</label>
                    <p className="font-semibold">{expenseItem.tour_leader.full_name}</p>
                  </div>
                </div>
              )}

              {expenseItem.approver && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Approved By</label>
                    <p className="font-semibold">{expenseItem.approver.full_name}</p>
                    {expenseItem.approved_at && (
                      <p className="text-sm text-muted-foreground">
                        on {formatDate(expenseItem.approved_at)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {expenseItem.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                  <p className="text-sm whitespace-pre-wrap">{expenseItem.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm font-medium">{formatDate(expenseItem.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Updated:</span>
                <span className="text-sm font-medium">{formatDate(expenseItem.updated_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseItemDetailDialog;
