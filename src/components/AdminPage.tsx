
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import CrewManagement from './TourManagement/CrewManagement';
import DummyDataGenerator from './TourManagement/DummyDataGenerator';
import TourManagementDashboard from './TourManagement/TourManagementDashboard';
import MobileHeader from './MobileHeader';
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <MobileHeader />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12 text-sm">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="tours" className="text-xs md:text-sm">Tours</TabsTrigger>
            <TabsTrigger value="crew" className="text-xs md:text-sm">Crew</TabsTrigger>
            <TabsTrigger value="data" className="text-xs md:text-sm">Data</TabsTrigger>
            <TabsTrigger value="export" className="text-xs md:text-sm">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">System Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900">Active Tours</h3>
                    <p className="text-2xl font-bold text-blue-600">8</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-900">Feedback Collected</h3>
                    <p className="text-2xl font-bold text-green-600">156</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-medium text-purple-900">Active Crew</h3>
                    <p className="text-2xl font-bold text-purple-600">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tours" className="space-y-4">
            <TourManagementDashboard />
          </TabsContent>

          <TabsContent value="crew" className="space-y-4">
            <CrewManagement />
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <DummyDataGenerator />
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Export data in various formats for analysis and reporting.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Excel Export</h4>
                    <p className="text-sm text-gray-600 mb-3">Export feedback data with client initials for manual processing</p>
                    <button className="w-full bg-tour-primary text-white py-2 px-4 rounded hover:bg-tour-secondary transition-colors">
                      Export to Excel
                    </button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">CSV Export</h4>
                    <p className="text-sm text-gray-600 mb-3">Export raw data for external analysis tools</p>
                    <button className="w-full bg-tour-primary text-white py-2 px-4 rounded hover:bg-tour-secondary transition-colors">
                      Export to CSV
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
