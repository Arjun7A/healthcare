# Healthcare App - AI-Powered Medical Triage System

A comprehensive healthcare application built with React, Supabase, and Google AI Studio (Gemini) for advanced symptom analysis and medical triage.

## 🏥 Features

### 🤖 AI-Powered Symptom Analysis
- **Google AI Studio Integration**: Advanced medical analysis using Gemini Pro
- **Multi-Symptom Input**: Free-text and selector-based symptom entry
- **Personalized Assessment**: User profiles with age, gender, and medical history
- **Risk Stratification**: Professional triage with urgency levels

### 🩺 Professional Medical Features
- **Condition Analysis**: Top probable conditions with likelihood percentages
- **Clinical Recommendations**: Evidence-based medical advice
- **Red Flag Detection**: Critical warning signs identification
- **Follow-up Questions**: AI-generated refinement questions
- **Home Remedies**: Safe self-care suggestions

### 📋 Advanced Reporting
- **PDF Export**: Professional medical reports
- **Confidence Indicators**: AI analysis reliability scores
- **Medical Disclaimers**: Comprehensive safety notices
- **Case Studies**: Similar patient outcomes

### 🎨 Premium UI/UX
- **Healthcare Design**: Professional medical interface
- **Responsive Layout**: Mobile and desktop optimized
- **Accessibility**: WCAG compliant with screen reader support
- **Real-time Feedback**: Loading states and progress indicators

### 🌟 Phase 3 Advanced Features
- **Voice Input**: Speech-to-text symptom description
- **Dark Mode**: Complete theme switching
- **Multilingual Support**: English, Spanish, French translations
- **Expert Mode**: Advanced clinical data and insights
- **AI Analytics**: Risk factors, preventive measures, lifestyle recommendations
- **Telehealth Integration**: Provider connections and appointment scheduling
- **History Tracking**: Analysis history and bookmarking system
- **Sharing**: Secure analysis sharing with healthcare providers
- **Emergency Detection**: Immediate alerts for critical conditions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd my-healthcare-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Setup
Create `.env.local` with:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_AI_API_KEY=your_google_ai_studio_api_key
```

### Development
```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

## 🏗️ Tech Stack

- **Frontend**: React 19, Vite
- **Backend**: Supabase (Auth, Database)
- **AI**: Google AI Studio (Gemini Pro)
- **Styling**: Custom CSS with healthcare design system
- **PDF**: jsPDF with auto-table
- **Routing**: React Router DOM

## 📱 Routes

- `/` - Dashboard (protected)
- `/auth` - Authentication (login/signup)
- `/symptoms` - AI Symptom Checker (protected)
- `/reset-password` - Password reset

## 🔒 Security & Compliance

- **Medical Disclaimers**: All outputs include appropriate disclaimers
- **Emergency Detection**: Validates symptoms for emergency keywords
- **AI Safety**: Content filtering and safety measures
- **Data Privacy**: No patient data storage

## 🧪 Testing

```bash
# Run tests
npm test

# Build for production
npm run build
```

## 📦 Dependencies

### Core
- `react` - UI framework
- `react-router-dom` - Routing
- `@supabase/supabase-js` - Backend services

### AI & PDF
- `@google/generative-ai` - Google AI Studio integration
- `jspdf` - PDF generation
- `jspdf-autotable` - PDF tables

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## ⚠️ Medical Disclaimer

This application is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for better healthcare accessibility**te

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# healthcare
