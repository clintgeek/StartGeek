# StartGeek Authentication Integration

## 🎯 Overview

StartGeek now integrates with BaseGeek's centralized authentication system, following the exact same pattern as FitnessGeek and other GeekSuite applications.

## ✅ Completed Integration

### 1. Authentication Service (`src/services/authService.js`)
- **BaseGeek Integration**: Uses BaseGeek's `/api/auth/*` endpoints
- **Token Management**: Automatic token refresh and storage
- **App-Specific**: Configured for `startgeek` app name
- **Error Handling**: Graceful fallback and logout on auth failures

### 2. User Service (`src/services/userService.js`)
- **Profile Management**: Get/update user profiles
- **Preferences**: StartGeek-specific user preferences
- **Password Management**: Change password functionality

### 3. AI Service Integration (`server/services/aiService.js`)
- **Token-Based Authentication**: Uses user tokens for BaseGeek AI calls
- **Fallback Support**: Works without authentication (contextual responses)
- **Clean API**: Follows FitnessGeek's `callAI()` pattern exactly
- **Provider Preference**: Gemini 1.5 Flash as primary, with fallback chain

### 4. Frontend Authentication (`src/App.jsx`)
- **Login Flow**: Automatic authentication check on app load
- **Token Validation**: Validates stored tokens with BaseGeek
- **User State**: Manages authenticated user state
- **Protected Routes**: All routes require authentication

### 5. Login Component (`src/components/Login.jsx`)
- **Unified Design**: Matches GeekSuite design system
- **Registration Support**: Create new accounts via BaseGeek
- **Error Handling**: Clear error messages and loading states
- **Responsive**: Mobile-friendly design

### 6. Navigation Updates (`src/components/Navigation.jsx`)
- **User Info**: Displays authenticated user details
- **Logout Button**: Secure logout functionality
- **User Avatar**: Visual user representation

### 7. AI Chat Integration (`src/components/AIChat.jsx`)
- **Authenticated Requests**: Passes user tokens to AI endpoints
- **Seamless UX**: Works with or without authentication
- **Error Handling**: Graceful degradation if auth fails

## 🔧 API Endpoints Enhanced

### AI Endpoints with Authentication
```bash
# Chat with AI (authenticated)
POST /api/ai/chat
Authorization: Bearer <user-token>

# System Analysis (authenticated)
POST /api/ai/analyze-system
Authorization: Bearer <user-token>

# Conversation History
GET /api/ai/conversations

# AI Status
GET /api/ai/status
```

## 🌐 BaseGeek Integration Points

### Authentication Endpoints Used
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/validate` - Token validation
- `POST /api/auth/refresh` - Token refresh
- `GET /api/users/me` - Get current user

### AI Integration
- `POST /api/ai/call` - BaseGeek's unified AI endpoint
- **App Name**: `startgeek`
- **Provider Preference**: `gemini` (Gemini 1.5 Flash)
- **Fallback Chain**: `['gemini', 'anthropic', 'groq', 'together']`

## 🚀 Usage Flow

### 1. User Authentication
1. User visits StartGeek
2. App checks for stored token
3. If no token or invalid → Login screen
4. User logs in via BaseGeek
5. Token stored and user authenticated

### 2. AI Interactions
1. User sends message in AI chat
2. Frontend gets user token from storage
3. Request sent to StartGeek API with `Authorization` header
4. StartGeek forwards to BaseGeek with token
5. BaseGeek processes with user's AI quota/preferences
6. Response returned through StartGeek to frontend

### 3. Fallback Behavior
- **No BaseGeek**: Contextual fallback responses
- **No Token**: Still works with fallback responses
- **BaseGeek Down**: Graceful degradation to fallback

## 🔒 Security Features

- **JWT Tokens**: Secure, signed tokens from BaseGeek
- **Automatic Refresh**: Tokens refreshed before expiration
- **Secure Storage**: Tokens stored in localStorage (can be upgraded to httpOnly cookies)
- **CORS Handling**: Proper cross-origin request handling
- **Error Boundaries**: Graceful handling of auth failures

## 📋 Configuration

### Environment Variables
```bash
# Frontend (.env)
REACT_APP_BASEGEEK_URL=https://basegeek.clintgeek.com

# Backend (server/.env)
BASEGEEK_API_URL=https://basegeek.clintgeek.com
BASEGEEK_API_KEY=optional_fallback_key
```

### Development Setup
```bash
# For local development with BaseGeek
REACT_APP_BASEGEEK_URL=http://localhost:3000
BASEGEEK_API_URL=http://localhost:3000
```

## 🎨 UI/UX Features

- **Seamless Login**: Beautiful, responsive login form
- **User Profile**: User info displayed in navigation
- **Logout Flow**: Clean logout with redirect
- **Loading States**: Proper loading indicators
- **Error Messages**: Clear, actionable error messages

## 🔄 Integration Pattern Compliance

StartGeek now follows the **exact same pattern** as FitnessGeek:

1. ✅ **Authentication**: BaseGeek centralized auth
2. ✅ **AI Integration**: BaseGeek's `/api/ai/call` endpoint
3. ✅ **Token Management**: JWT with automatic refresh
4. ✅ **Fallback Support**: Works without BaseGeek
5. ✅ **App Registration**: Registered as `startgeek` app
6. ✅ **Provider Preferences**: Gemini 1.5 Flash primary
7. ✅ **Error Handling**: Graceful degradation
8. ✅ **UI Consistency**: Matches GeekSuite design

## 🚀 Next Steps

1. **Deploy BaseGeek**: Set up BaseGeek instance for production
2. **User Registration**: Create StartGeek users in BaseGeek
3. **AI Quotas**: Configure AI usage limits per user
4. **Advanced Features**: Add user preferences, themes, etc.
5. **Analytics**: Track AI usage and user engagement

## 🧪 Testing

```bash
# Test authentication flow
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello StartGeek!"}'

# Test without authentication (fallback)
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello StartGeek!"}'
```

StartGeek is now fully integrated with BaseGeek's authentication and AI systems! 🎉