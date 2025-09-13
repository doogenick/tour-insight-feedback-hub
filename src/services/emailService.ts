// Email service for sending review reminders
import { supabase } from '@/integrations/supabase/client';

interface ReviewReminderData {
  clientName: string;
  clientEmail: string;
  tourName: string;
  tourCode: string;
  reviewPlatforms: ('google' | 'tripadvisor')[];
}

export class EmailService {
  // Google Reviews link - you'll need to replace with your actual business link
  private static getGoogleReviewLink(): string {
    // Replace with your actual Google My Business URL
    return 'https://g.page/r/your-business-name/review';
  }

  // TripAdvisor link - you'll need to replace with your actual business link
  private static getTripAdvisorLink(): string {
    // Replace with your actual TripAdvisor business URL
    return 'https://www.tripadvisor.com/Attraction_Review-your-location.html';
  }

  // Generate email content
  private static generateEmailContent(data: ReviewReminderData): string {
    const { clientName, tourName, tourCode, reviewPlatforms } = data;
    
    let content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">NOMAD AFRICA</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Adventure Tours</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Thank you for your feedback, ${clientName}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            We're thrilled to hear about your experience on <strong>${tourName}</strong> (${tourCode}). 
            Your feedback helps us improve and helps other travelers discover our amazing tours.
          </p>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            If you enjoyed your adventure with us, we'd be incredibly grateful if you could take just 2 minutes 
            to leave a review on one of these platforms:
          </p>
          
          <div style="margin-bottom: 30px;">
    `;

    if (reviewPlatforms.includes('google')) {
      content += `
        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
          <h3 style="color: #1f2937; margin: 0 0 10px 0; display: flex; align-items: center;">
            <span style="background: #4285f4; color: white; padding: 5px 10px; border-radius: 4px; margin-right: 10px; font-size: 14px;">G</span>
            Google Reviews
          </h3>
          <p style="color: #4b5563; margin: 0 0 15px 0; font-size: 14px;">
            Help other travelers find us on Google
          </p>
          <a href="${this.getGoogleReviewLink()}" 
             style="background: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Leave Google Review →
          </a>
        </div>
      `;
    }

    if (reviewPlatforms.includes('tripadvisor')) {
      content += `
        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
          <h3 style="color: #1f2937; margin: 0 0 10px 0; display: flex; align-items: center;">
            <span style="background: #00aa6c; color: white; padding: 5px 10px; border-radius: 4px; margin-right: 10px; font-size: 14px;">T</span>
            TripAdvisor
          </h3>
          <p style="color: #4b5563; margin: 0 0 15px 0; font-size: 14px;">
            Share your experience with the travel community
          </p>
          <a href="${this.getTripAdvisorLink()}" 
             style="background: #00aa6c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Leave TripAdvisor Review →
          </a>
        </div>
      `;
    }

    content += `
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>💡 Pro tip:</strong> You can copy and paste your feedback from our form to make it even easier!
            </p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Thank you for choosing Nomad Africa Adventure Tours. We hope to welcome you back on another 
            incredible adventure soon!
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              <strong>The Nomad Team</strong><br>
              <a href="mailto:nomadafricatours.co.za" style="color: #f97316; text-decoration: none;">nomadafricatours.co.za</a>
            </p>
          </div>
        </div>
      </div>
    `;

    return content;
  }

  // Send review reminder email
  static async sendReviewReminder(data: ReviewReminderData): Promise<{ success: boolean; message: string }> {
    try {
      // For now, we'll use a simple approach - you can integrate with your preferred email service
      // This is a placeholder that logs the email content
      console.log('📧 Review Reminder Email:');
      console.log('To:', data.clientEmail);
      console.log('Subject: Thank you for your feedback - Help us grow with a review!');
      console.log('Content:', this.generateEmailContent(data));
      
      // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
      // For now, we'll simulate success
      
      return {
        success: true,
        message: 'Review reminder email sent successfully!'
      };
    } catch (error) {
      console.error('Error sending review reminder:', error);
      return {
        success: false,
        message: 'Failed to send review reminder email'
      };
    }
  }

  // Send review reminder using Supabase Edge Functions (if you have them set up)
  static async sendReviewReminderViaSupabase(data: ReviewReminderData): Promise<{ success: boolean; message: string }> {
    try {
      const { data: result, error } = await supabase.functions.invoke('send-review-reminder', {
        body: {
          to: data.clientEmail,
          subject: 'Thank you for your feedback - Help us grow with a review!',
          html: this.generateEmailContent(data),
          clientName: data.clientName,
          tourName: data.tourName,
          tourCode: data.tourCode,
          reviewPlatforms: data.reviewPlatforms
        }
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Review reminder email sent successfully!'
      };
    } catch (error) {
      console.error('Error sending review reminder via Supabase:', error);
      return {
        success: false,
        message: 'Failed to send review reminder email'
      };
    }
  }
}
