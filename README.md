# Tour Insight Feedback Hub

A comprehensive feedback management system for tour operators, featuring both web and mobile applications for collecting, analyzing, and managing customer feedback.

## 🏗️ Project Structure

```
tour-insight-feedback-hub/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn UI components
│   │   ├── AnalyticsDashboard/     # Analytics components
│   │   ├── ComprehensiveFeedbackForm/  # Feedback form components
│   │   ├── FeedbackViewer/          # Feedback display components
│   │   ├── TourManagement/          # Tour management components
│   │   └── MobileFeedbackFlow/      # Mobile-specific components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API and business logic
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── integrations/        # External service integrations
├── android/                 # Android mobile app
├── supabase/                # Database migrations and config
├── dist/                    # Built web application
└── scripts/                 # Build and utility scripts
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Router** - Navigation
- **Recharts** - Data visualization

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database
- **Row Level Security (RLS)** - Data access control
- **Real-time subscriptions** - Live data updates

### Mobile
- **Capacitor** - Cross-platform mobile framework
- **Android** - Native mobile app
- **LocalForage** - Offline storage

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Testing framework

## ✨ Implemented Features

### 🎯 Core Functionality
- **Comprehensive Feedback Collection** - Multi-page feedback forms with 2 decimal precision ratings
- **Tour Management** - Create, edit, delete, and manage tours
- **Real-time Analytics** - Live feedback analysis and insights
- **Duplicate Prevention** - Prevents duplicate feedback submissions
- **Offline Support** - Mobile app works offline with sync capabilities

### 📱 Mobile App Features
- **Native Android App** - Version 1.0.6 (versionCode 7)
- **Offline Data Collection** - Works without internet connection
- **Auto-sync** - Syncs data when connection is restored
- **Manual Tour Creation** - Create tours directly from mobile
- **Review Reminders** - Email integration for Google/TripAdvisor reviews

### 🌐 Web App Features
- **Admin Dashboard** - Complete tour and feedback management
- **Analytics Dashboard** - Comprehensive data visualization
- **Feedback Management** - View, filter, and analyze feedback
- **Tour Management** - Full CRUD operations for tours
- **Data Export** - Export feedback data for analysis

### 🔒 Security & Data Management
- **Version Tracking** - App version control and access management
- **Row Level Security** - Database-level access control
- **Client Identification** - Distinguishes between web and mobile clients
- **Data Preservation** - All historical data maintained
- **Legacy Data Handling** - Graceful handling of old app versions

### 📊 Analytics & Reporting
- **Rating Analysis** - 2 decimal precision rating calculations
- **Satisfaction Metrics** - Customer satisfaction tracking
- **Crew Performance** - Guide and driver performance analysis
- **Trend Analysis** - Performance trends over time
- **Custom Filtering** - Filter by tour, date, nationality, etc.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Android Studio (for mobile development)
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tour-insight-feedback-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

### Mobile App Development

1. **Sync with Capacitor**
   ```bash
   npx cap sync
   ```

2. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

3. **Build APK**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

## 📋 Future Enhancements

### 🔮 Planned Features
- **iOS Mobile App** - Native iOS application
- **Advanced Analytics** - Machine learning insights
- **Email Integration** - Automated email notifications
- **Multi-language Support** - Internationalization
- **API Documentation** - Comprehensive API docs
- **User Authentication** - Role-based access control
- **Data Backup** - Automated backup solutions
- **Performance Monitoring** - Application performance tracking

### 🎯 Potential Improvements
- **Real-time Notifications** - Push notifications for new feedback
- **Advanced Reporting** - PDF report generation
- **Integration APIs** - Third-party service integrations
- **Mobile Offline Maps** - Offline map functionality
- **Voice Feedback** - Voice-to-text feedback collection
- **Photo Upload** - Image attachment support
- **QR Code Integration** - QR code-based tour identification

## 🗄️ Database Schema

### Key Tables
- **tours** - Tour information and management
- **comprehensive_feedback** - Customer feedback data
- **crew_members** - Guide and driver information
- **tour_crew_assignments** - Tour-crew relationships

### Security Features
- **Row Level Security (RLS)** - Table-level access control
- **Version Tracking** - App version and client identification
- **Data Validation** - Constraint-based data integrity
- **Audit Logging** - Change tracking and history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions, please contact the development team.

---

**Version**: 1.0.6  
**Last Updated**: September 2025  
**Status**: Production Ready