
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Tour } from '../../types/Tour';

interface FeedbackHeaderProps {
  tour?: Tour | null;
}

const FeedbackHeader: React.FC<FeedbackHeaderProps> = ({ tour }) => {
  return (
    <CardHeader className="text-center bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="text-left">
          <div className="text-2xl font-bold">NOMAD</div>
          <div className="text-xl font-bold">AFRICA</div>
        </div>
        <div className="text-center flex-1">
          <div className="text-xs">Scan this QR Code and sign up for our monthly newsletter</div>
          <div className="text-xs">to stay up-to-date about tours, specials</div>
          <div className="text-xs">and travel promotions!</div>
        </div>
        <div className="w-16 h-16 border-2 border-white flex items-center justify-center text-xs">
          QR CODE
        </div>
      </div>
      
      <CardTitle className="text-2xl font-bold bg-black text-white py-2 px-4 inline-block">
        TOUR FEEDBACK FORM
      </CardTitle>
      
      {tour && (
        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <div className="text-lg font-semibold">{tour.tour_name}</div>
          <div className="text-sm opacity-90">Tour Code: <span className="font-bold">{tour.tour_code}</span></div>
          {tour.date_start && tour.date_end && (
            <div className="text-sm opacity-90">
              {new Date(tour.date_start).toLocaleDateString()} - {new Date(tour.date_end).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
      
      <CardDescription className="text-white/90 text-sm mt-4 leading-relaxed">
        Thank you for choosing to travel with Nomad Africa Adventure Tours. In order to ensure we deliver the best possible service, 
        we kindly ask you to complete this feedback form. All feedback forms are <strong>confidential</strong> and returning them assists 
        with statistical accuracy. Should you wish to email any further comments or feedback please send to nomadafricatours.co.za. 
        We look forward to hearing from you and we hope to welcome you back on a future tour! Safe travels home and we trust you are 
        taking some special memories along with you!
        <br /><br />
        <strong>Many Thanks the Nomad Team</strong>
      </CardDescription>
    </CardHeader>
  );
};

export default FeedbackHeader;
