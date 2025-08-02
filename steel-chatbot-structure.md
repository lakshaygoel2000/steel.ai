# Steel Industry AI Chatbot - React.js Project Structure

## Overview
A professional AI chatbot application specifically designed for the steel construction industry, featuring Google Authentication, session persistence, and Gemini API integration.

## Project Structure

```
steel-industry-chatbot/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── GoogleAuth.jsx
│   │   │   ├── AuthProvider.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── chatbot/
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageItem.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── project/
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── ProjectParams.jsx
│   │   │   └── ParamEditor.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   └── common/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Select.jsx
│   │       └── Loading.jsx
│   ├── services/
│   │   ├── geminiApi.js
│   │   ├── firestore.js
│   │   ├── auth.js
│   │   └── chatService.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   ├── useProject.js
│   │   └── useLocalStorage.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   └── ProjectContext.jsx
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── steelIndustryData.js
│   ├── styles/
│   │   ├── global.css
│   │   ├── components/
│   │   │   ├── auth.css
│   │   │   ├── chatbot.css
│   │   │   ├── project.css
│   │   │   └── layout.css
│   │   └── variables.css
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── .env.example
├── .env.local
├── .gitignore
├── package.json
├── README.md
└── tailwind.config.js (optional)
```

## Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@google-cloud/aiplatform": "^3.0.0",
    "firebase": "^9.17.0",
    "google-auth-library": "^8.7.0",
    "@google/generative-ai": "^0.1.3",
    "react-firebase-hooks": "^5.1.1",
    "uuid": "^9.0.0",
    "date-fns": "^2.29.3",
    "react-hot-toast": "^2.4.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "^0.321.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0",
    "eslint": "^8.34.0",
    "prettier": "^2.8.4",
    "tailwindcss": "^3.2.7",
    "autoprefixer": "^10.4.13",
    "postcss": "^8.4.21"
  }
}
```

## Environment Variables (.env.local)

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

## Core Components Overview

### 1. AuthProvider.jsx
```jsx
// Manages Google Authentication state and Firebase integration
export const AuthProvider = ({ children }) => {
  // Google Auth implementation
  // Firebase user management
  // Session persistence
};
```

### 2. ChatInterface.jsx
```jsx
// Main chatbot interface component
export const ChatInterface = () => {
  // Message handling
  // Gemini API integration
  // Real-time chat updates
  // Context management
};
```

### 3. ProjectForm.jsx
```jsx
// Construction project parameter collection
export const ProjectForm = ({ onSubmit }) => {
  // Form validation
  // Parameter collection
  // Initial project setup
};
```

### 4. ProjectParams.jsx
```jsx
// Display and edit project parameters
export const ProjectParams = () => {
  // Parameter display
  // Edit functionality
  // Real-time updates
};
```

## Firebase Firestore Data Structure

```javascript
// Users Collection
users: {
  [userId]: {
    uid: string,
    email: string,
    displayName: string,
    photoURL: string,
    createdAt: timestamp,
    lastLoginAt: timestamp
  }
}

// Chat Sessions Collection
chatSessions: {
  [sessionId]: {
    userId: string,
    projectParams: {
      plotSize: number,
      constructionType: string,
      stories: string,
      houseType: string,
      foundationType: string,
      roofType: string,
      specialRequirements: string
    },
    messages: [
      {
        id: string,
        type: 'user' | 'bot',
        content: string,
        timestamp: timestamp
      }
    ],
    createdAt: timestamp,
    updatedAt: timestamp
  }
}
```

## Key Services

### geminiApi.js
```javascript
// Gemini API integration for intelligent responses
export class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.model = null;
  }
  
  async generateResponse(message, context, projectParams) {
    // Implement Gemini API calls
    // Context-aware response generation
    // Steel industry specific prompting
  }
}
```

### chatService.js
```javascript
// Chat session management
export class ChatService {
  static async saveMessage(sessionId, message) {
    // Save to Firestore
  }
  
  static async loadChatHistory(sessionId) {
    // Load from Firestore
  }
  
  static async updateProjectParams(sessionId, params) {
    // Update project parameters
  }
}
```

## Custom Hooks

### useChat.js
```javascript
export const useChat = (sessionId) => {
  // Chat state management
  // Message sending/receiving
  // Real-time updates
  // Context preservation
};
```

### useProject.js
```javascript
export const useProject = () => {
  // Project parameter management
  // Validation
  // Updates and edits
};
```

## Steel Industry Data (utils/steelIndustryData.js)

```javascript
export const CONSTRUCTION_TYPES = [
  'Steel Frame',
  'Concrete Frame', 
  'Wood Frame',
  'Hybrid'
];

export const FOUNDATION_TYPES = [
  'Slab-on-Grade',
  'T-Shaped',
  'Basement',
  'Crawl Space',
  'Pile Foundation'
];

export const ROOF_TYPES = [
  'Gable',
  'Hip', 
  'Shed',
  'Gambrel',
  'Flat',
  'Truss System'
];

export const STEEL_GRADES = [
  'S235', 'S275', 'S355', 'S450'
];

export const BUILDING_CODES = [
  'AISC 360',
  'AISC 341',
  'IBC 2021',
  'ASCE 7-16'
];
```

## Development Setup

1. **Create React App:**
```bash
npx create-react-app steel-industry-chatbot
cd steel-industry-chatbot
```

2. **Install Dependencies:**
```bash
npm install firebase @google/generative-ai react-router-dom
npm install react-firebase-hooks uuid date-fns react-hot-toast
npm install framer-motion lucide-react
```

3. **Setup Firebase:**
- Create Firebase project
- Enable Authentication (Google provider)
- Setup Firestore database
- Add web app configuration

4. **Setup Google Cloud:**
- Enable Gemini API
- Create API key
- Configure authentication

5. **Environment Setup:**
- Copy `.env.example` to `.env.local`
- Add your API keys and configuration

## Key Features Implementation

### 1. Session Management
- Persistent chat sessions per user
- Real-time message syncing
- Context preservation across sessions

### 2. Project Parameter Management
- Initial parameter collection
- Parameter locking after first query
- Edit functionality with real-time updates

### 3. Gemini API Integration
- Context-aware responses
- Steel industry expertise
- Parameter-specific recommendations

### 4. Google Authentication
- Secure user authentication
- Session persistence
- User profile management

### 5. Responsive Design
- Mobile-first approach
- Professional steel industry theme
- Smooth animations and interactions

## Deployment Options

1. **Vercel:** Simple deployment with automatic builds
2. **Netlify:** Easy static site deployment
3. **Firebase Hosting:** Integrated with Firebase services
4. **AWS Amplify:** Full-stack deployment option

## Security Considerations

- API key protection
- Firebase security rules
- Input validation and sanitization
- Rate limiting for API calls
- User data encryption

This structure provides a solid foundation for building a professional steel industry chatbot with all the requested features including Google Authentication, session persistence, and Gemini API integration.