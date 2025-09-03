# StartGeek - BaseGeek App Registration

## Application Details

### Basic Information
- **App Name**: `startgeek`
- **Display Name**: `StartGeek`
- **Description**: `System monitoring and server management dashboard`
- **Version**: `1.0.0`
- **Category**: `System Management`

### Authentication Configuration
```json
{
  "appId": "startgeek",
  "displayName": "StartGeek",
  "description": "System monitoring and server management dashboard",
  "redirectUris": [
    "http://localhost:3000",
    "http://localhost:3000/auth/callback",
    "https://start.clintgeek.com",
    "https://start.clintgeek.com/auth/callback"
  ],
  "allowedOrigins": [
    "http://localhost:3000",
    "https://start.clintgeek.com"
  ],
  "scopes": [
    "profile",
    "email",
    "ai:chat",
    "ai:analyze",
    "user:preferences"
  ],
  "permissions": {
    "userGeek": ["read", "update"],
    "aiGeek": ["chat", "analyze", "history"],
    "dbGeek": ["read", "write"]
  }
}
```

### API Integration
- **AI Provider Preference**: `gemini` (Gemini 1.5 Flash)
- **Fallback Chain**: `['gemini', 'anthropic', 'groq', 'together']`
- **Context**: System monitoring, server management, tech support

### Required BaseGeek Endpoints
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/validate`
- `POST /api/auth/refresh`
- `GET /api/users/me`
- `POST /api/ai/call`

### Development Configuration
```bash
# Local Development
BASEGEEK_URL=http://localhost:3000
STARTGEEK_URL=http://localhost:3000

# Production
BASEGEEK_URL=https://basegeek.clintgeek.com
STARTGEEK_URL=https://start.clintgeek.com
```

## Registration Steps

### 1. Add to BaseGeek Apps Registry
Add StartGeek to BaseGeek's `config/apps.json` or database:

```json
{
  "startgeek": {
    "name": "StartGeek",
    "description": "System monitoring and server management dashboard",
    "redirectUris": ["http://localhost:3000", "https://start.clintgeek.com"],
    "allowedOrigins": ["http://localhost:3000", "https://start.clintgeek.com"],
    "scopes": ["profile", "email", "ai:chat", "ai:analyze"],
    "active": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Update BaseGeek CORS Settings
Ensure BaseGeek allows requests from StartGeek origins:

```javascript
// In BaseGeek's server configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', // StartGeek dev
    'https://start.clintgeek.com', // StartGeek prod
    'http://localhost:3001', // FitnessGeek dev
    'https://fitnessgeek.clintgeek.com', // FitnessGeek prod
    // ... other Geek apps
  ],
  credentials: true
}
```

### 3. AI Service Configuration
Configure AI service to recognize StartGeek context:

```javascript
// In BaseGeek's AI service
const appContexts = {
  startgeek: {
    systemPrompt: "You are StartGeek's AI assistant, specialized in system monitoring, server management, and technical support.",
    preferredProvider: "gemini",
    fallbackChain: ["gemini", "anthropic", "groq", "together"]
  }
}
```

### 4. Database Schema
Ensure user preferences support StartGeek:

```javascript
// User preferences schema
{
  userId: ObjectId,
  appPreferences: {
    startgeek: {
      theme: "dark",
      notifications: true,
      dashboardLayout: "grid",
      refreshInterval: 30000
    }
  }
}
```

## Testing Registration

### 1. Authentication Test
```bash
curl -X POST https://basegeek.clintgeek.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-App-Name: startgeek" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 2. AI Integration Test
```bash
curl -X POST https://basegeek.clintgeek.com/api/ai/call \
  -H "Authorization: Bearer <token>" \
  -H "X-App-Name: startgeek" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello StartGeek AI!","context":{"component":"dashboard"}}'
```

### 3. User Data Test
```bash
curl -X GET https://basegeek.clintgeek.com/api/users/me \
  -H "Authorization: Bearer <token>" \
  -H "X-App-Name: startgeek"
```

## Security Considerations

- **Origin Validation**: BaseGeek must validate request origins
- **Token Scoping**: Tokens should include app-specific scopes
- **Rate Limiting**: Per-app rate limits for API calls
- **Audit Logging**: Track StartGeek API usage

## Next Steps

1. **Contact BaseGeek Admin**: Request StartGeek app registration
2. **Provide Configuration**: Share the JSON configuration above
3. **Test Integration**: Verify authentication and AI flows
4. **Deploy**: Update production configurations
5. **Monitor**: Track usage and performance

Once registered, StartGeek will have full access to the GeekSuite ecosystem! 🚀