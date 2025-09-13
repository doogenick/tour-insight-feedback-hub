
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import CrewManagement from './TourManagement/CrewManagement';
import TourManagementDashboard from './TourManagement/TourManagementDashboard';
import { Button } from './ui/button';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminOverview from './AdminOverview';
import MobileHeader from './MobileHeader';
import FeedbackGatheringManager from './FeedbackGatheringManager';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <MobileHeader />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12 text-sm">
            <TabsTrigger value="feedback" className="text-xs md:text-sm">Feedback Gathering</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="tours" className="text-xs md:text-sm">Tour Management</TabsTrigger>
          </TabsList>

          <TabsContent value="feedback" className="space-y-4">
            <FeedbackGatheringManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    View comprehensive feedback analytics and insights across all tours.
                  </p>
                  <Button 
                    onClick={() => navigate('/analytics')}
                    className="w-full"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Open Analytics Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tours" className="space-y-4">
            <TourManagementDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
