# Vysion Analytics - Architecture Documentation

## 🏗️ System Architecture Overview

Vysion Analytics is a mobile-first, cross-platform Football Talent Scouting Platform designed with modularity, scalability, and maintainability at its core.

### Architecture Principles
- **Mobile-First**: React Native + Expo as primary platform
- **API-Driven**: RESTful backend with clear separation of concerns
- **Code Reusability**: Shared packages for types, utilities, and validation
- **Scalable**: Designed for future AI microservices integration
- **Type-Safe**: TypeScript throughout the stack
- **Cloud-Native**: Firebase/AWS for authentication and storage

---

## 📁 Project Structure

```
vysion-analytics/
├── apps/
│   ├── mobile/              # React Native + Expo mobile app
│   │   ├── app/             # Expo Router file-based routing
│   │   ├── components/      # React Native components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── screens/         # Screen components
│   │   ├── services/        # API clients, Firebase
│   │   ├── store/           # State management (Zustand/Context)
│   │   ├── assets/          # Images, fonts, icons
│   │   └── app.json         # Expo configuration
│   │
│   └── backend/             # Node.js + Express API server
│       ├── src/
│       │   ├── config/      # Database, Firebase, environment
│       │   ├── controllers/ # Request handlers
│       │   ├── middleware/  # Auth, validation, error handling
│       │   ├── routes/      # API route definitions
│       │   ├── services/    # Business logic layer
│       │   ├── utils/       # Helper functions
│       │   └── server.ts    # Entry point
│       ├── tests/           # API tests
│       └── package.json
│
├── packages/
│   └── shared/              # Shared code between apps
│       ├── src/
│       │   ├── types/       # TypeScript interfaces/types
│       │   ├── schemas/     # Zod validation schemas
│       │   ├── constants/   # Shared constants, enums
│       │   └── utils/       # Utility functions
│       └── package.json
│
├── database/
│   ├── prisma/
│   │   ├── schema.prisma    # Centralized database schema
│   │   ├── migrations/      # Migration history
│   │   └── seed.ts          # Database seeding
│   └── package.json
│
├── docs/
│   ├── api/                 # API documentation
│   ├── mobile/              # Mobile app guides
│   ├── deployment/          # Deployment guides
│   └── coding-standards.md  # Code style guide
│
├── assets/
│   ├── brand/               # Logos, brand assets
│   └── samples/             # Sample videos, test data
│
├── scripts/                 # Build and deployment scripts
├── .env.example             # Environment variable template
├── package.json             # Root workspace config
├── tsconfig.json            # Shared TypeScript config
└── README.md
```

---

## 🔧 Technology Stack

### Mobile App (React Native + Expo)
- **Framework**: React Native with Expo SDK 50+
- **Routing**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind for React Native)
- **State Management**: Zustand or React Context
- **API Client**: Axios with interceptors
- **Authentication**: Firebase Auth SDK
- **Media**: Expo ImagePicker, Video, Camera
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Custom component library

### Backend (Node.js + Express)
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma with PostgreSQL
- **Authentication**: Firebase Admin SDK
- **Validation**: Zod schemas
- **File Upload**: Multer + Firebase Storage/S3
- **Error Handling**: Custom error middleware
- **Logging**: Winston or Pino
- **API Documentation**: OpenAPI/Swagger (future)

### Database
- **Primary Database**: PostgreSQL (via Prisma)
- **ORM**: Prisma with type-safe queries
- **Migrations**: Prisma Migrate
- **Full-Text Search**: PostgreSQL full-text search

### Shared Infrastructure
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage or AWS S3
- **Media Processing**: Future AI microservices (Python/Node)
- **Real-time**: Firebase Realtime Database (messaging)

---

## 🎯 Core Features & Implementation

### 1. Player Profiles
**Mobile Screens:**
- Profile creation wizard (multi-step form)
- Profile view/edit
- Media upload (photos, videos)
- Verification status display

**Backend APIs:**
- `POST /api/players/profile` - Create/update profile
- `GET /api/players/:id` - Get player profile
- `POST /api/players/media` - Upload media
- `GET /api/players/search` - Search players (for scouts)

**Database Models:**
- User (base profile)
- PhysicalAttributes
- FootballProfile
- Media
- Achievements

### 2. AI Verification (Scaffolded)
**Mobile Screens:**
- Video verification wizard
- Face/ID verification capture
- Skill challenge recording

**Backend APIs:**
- `POST /api/verification/initiate` - Start verification
- `POST /api/verification/upload` - Upload verification media
- `POST /api/verification/submit` - Submit for AI processing
- `GET /api/verification/status/:id` - Check status

**Future Integration:**
- Python microservice for computer vision
- Face matching ML model
- Video skill analysis
- Stat validation engine

### 3. Scout/Club Portal
**Mobile Screens:**
- Scout dashboard
- Advanced search & filters
- Player discovery feed
- Messaging interface

**Backend APIs:**
- `GET /api/scouts/dashboard` - Scout analytics
- `POST /api/scouts/search` - Advanced player search
- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Get conversation

**Database Models:**
- ScoutProfile
- ClubProfile
- SearchQuery (saved searches)
- Messages/Conversations

### 4. Media Management
**Mobile Screens:**
- Video upload with progress
- Media gallery
- Video player with highlights

**Backend APIs:**
- `POST /api/media/upload` - Upload to storage
- `GET /api/media/:id` - Get media metadata
- `DELETE /api/media/:id` - Remove media

**Storage Strategy:**
- Small images: Firebase Storage
- Large videos: AWS S3 + CloudFront CDN
- Thumbnails: Auto-generated on upload

---

## 🔐 Authentication Flow

### Mobile App
1. User opens app and Firebase restores persisted auth state
2. If no Firebase session → Show login/signup screens
3. User authenticates with Firebase Auth (email/password, Google, Apple)
4. Client obtains Firebase ID token
5. Client sends ID token to backend session verification endpoint
6. Backend verifies token and returns/creates application user data
7. Client uses Firebase ID token as the Authorization bearer token for API requests

### Local JWT Flow (Isolated)
- Local JWT endpoints are retained for non-mobile legacy clients under `/api/auth/local/*`.
- Mobile clients do not use local JWT login/register routes.

### Backend Validation
1. Middleware intercepts requests
2. Extract token from Authorization header
3. Verify with Firebase Admin SDK
4. Check user exists in database
5. Attach user to request object
6. Proceed to controller

---

## 📦 Shared Package Structure

### Types (`@vysion/shared/types`)
```typescript
export interface PlayerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  position: Position;
  // ... more fields
}

export enum Position {
  GOALKEEPER = 'GOALKEEPER',
  DEFENDER = 'DEFENDER',
  MIDFIELDER = 'MIDFIELDER',
  FORWARD = 'FORWARD'
}
```

### Schemas (`@vysion/shared/schemas`)
```typescript
import { z } from 'zod';

export const PlayerProfileSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  position: z.enum(['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD']),
  // ... more validations
});
```

### Constants (`@vysion/shared/constants`)
```typescript
export const API_ENDPOINTS = {
  PLAYERS: '/api/players',
  AUTH: '/api/auth',
  MEDIA: '/api/media',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@vysion/auth_token',
  USER_DATA: '@vysion/user_data',
};
```

---

## 🔄 State Management Strategy

### Mobile App (Zustand)
```typescript
// stores/authStore.ts
import create from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
```

---

## 🚀 API Design Principles

### RESTful Conventions
- `GET` - Retrieve resources
- `POST` - Create resources
- `PUT/PATCH` - Update resources
- `DELETE` - Remove resources

### Response Format
```json
{
  "success": true,
  "data": { /* payload */ },
  "message": "Operation successful",
  "timestamp": "2026-03-08T10:30:00Z"
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "fields": {
      "email": "Invalid email format"
    }
  },
  "timestamp": "2026-03-08T10:30:00Z"
}
```

### HTTP Status Codes
- `200` OK - Successful request
- `201` Created - Resource created
- `400` Bad Request - Validation error
- `401` Unauthorized - Missing/invalid token
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource doesn't exist
- `500` Internal Server Error - Server error

---

## 🧪 Testing Strategy

### Mobile App
- **Unit Tests**: Jest + React Testing Library
- **Component Tests**: Storybook (future)
- **E2E Tests**: Detox or Maestro
- **Coverage Goal**: 70%+

### Backend
- **Unit Tests**: Jest
- **Integration Tests**: Supertest
- **Database Tests**: Separate test database
- **Coverage Goal**: 80%+

---

## 🌍 Environment Configuration

### Development
- Local PostgreSQL database
- Firebase emulators for auth/storage
- Mock AI verification endpoints

### Staging
- Hosted PostgreSQL (Railway/Render)
- Firebase production project
- Real AI endpoints (limited quota)

### Production
- Managed PostgreSQL (Supabase/AWS RDS)
- Firebase production with CDN
- Scalable AI microservices
- Rate limiting & caching

---

## 🔮 Future Enhancements

### Phase 1 (MVP) - Q2 2026
- ✅ Player profile creation
- ✅ Basic authentication
- ✅ Media upload
- ✅ Scout search (basic)

### Phase 2 - Q3 2026
- 🔄 AI verification (face matching)
- 🔄 Real-time messaging
- 🔄 Advanced scout filters
- 🔄 Subscription management

### Phase 3 - Q4 2026
- 🔜 Video stat analysis (AI)
- 🔜 Match highlights auto-generation
- 🔜 Web dashboard for clubs
- 🔜 Analytics & insights

### Phase 4 - 2027
- 🔜 Mobile livestreaming
- 🔜 Community challenges
- 🔜 Agent marketplace
- 🔜 International expansion

---

## 📞 Development Workflow

### Getting Started
1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Initialize database: `npm run db:migrate`
5. Seed data: `npm run db:seed`
6. Start backend: `npm run dev:backend`
7. Start mobile: `npm run dev:mobile`

### Development Commands
```bash
# Install all dependencies
npm install

# Run backend dev server
npm run dev:backend

# Run mobile app (iOS)
npm run ios

# Run mobile app (Android)
npm run android

# Run database migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Run tests
npm run test

# Build for production
npm run build
```

---

**Last Updated**: March 8, 2026  
**Version**: 2.0.0 (Clean Rebuild)
