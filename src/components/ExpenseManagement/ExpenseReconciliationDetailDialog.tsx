import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  User, 
  Calendar, 
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { ExpenseReconciliation } from '@/types/Expense';

interface ExpenseReconciliationDetailDialogProps {
  reconciliation: ExpenseReconciliation;
  onClose: () => void;
}

const ExpenseReconciliationDetailDialog: React.FC<ExpenseReconciliationDetailDialogProps> = ({
  reconciliation,
  onClose
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Reconciliation Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tour Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tour Code</label>
                  <p className="text-lg font-semibold">{reconciliation.tour?.tour_code || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tour Name</label>
                  <p className="text-lg font-semibold">{reconciliation.tour?.tour_name || 'Unknown'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(reconciliation.status)}>
                      {reconciliation.status}
                    </Badge>
                    {getStatusIcon(reconciliation.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reconciliation Date</label>
                  <p className="font-semibold">
                    {reconciliation.reconciliation_date ? formatDate(reconciliation.reconciliation_date) : 'Not set'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <label className="text-sm font-medium text-muted-foreground">Total Budgeted</label>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(reconciliation.total_budgeted)}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <label className="text-sm font-medium text-muted-foreground">Total Actual</label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(reconciliation.total_actual)}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <label className="text-sm font-medium text-muted-foreground">Variance</label>
                  <div className="flex items-center justify-center gap-2">
                    <p className={`text-2xl font-bold ${
                      reconciliation.total_variance >= 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {formatCurrency(Math.abs(reconciliation.total_variance))}
                    </p>
                    {reconciliation.total_variance >= 0 ? (
                      <TrendingUp className="h-6 w-6 text-red-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {reconciliation.total_variance >= 0 ? 'Over Budget' : 'Under Budget'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* People Involved */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">People Involved</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tour Leader</label>
                  <p className="font-semibold">{reconciliation.tour_leader?.full_name || 'Unknown'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Office Staff</label>
                  <p className="font-semibold">{reconciliation.office_staff?.full_name || 'Unknown'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {reconciliation.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                  <p className="text-sm whitespace-pre-wrap">{reconciliation.notes}</p>
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
                <span className="text-sm font-medium">{formatDate(reconciliation.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Updated:</span>
                <span className="text-sm font-medium">{formatDate(reconciliation.updated_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseReconciliationDetailDialog;
