# Vysion Analytics - Getting Started Guide

Welcome to Vysion Analytics! This guide will help you set up the development environment and run the application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ and npm
- **PostgreSQL** 14+ (for database)
- **Git** (for version control)
- **Expo CLI** (for mobile development)
- **Firebase Account** (for authentication and storage)
- **Code Editor** (VS Code recommended)

### For Mobile Development
- **iOS**: Xcode (Mac only)
- **Android**: Android Studio + Android SDK
- **Alternative**: Expo Go app on your phone (easier for testing)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone git@github.com:Hamez-brayo/vysion-analytics.git
cd vysion-analytics
```

### 2. Install Dependencies

Install all workspace dependencies:

```bash
npm install
```

This will install dependencies for:
- Root workspace
- Shared package
- Backend API
- Mobile app
- Database

### 3. Set Up Environment Variables

#### Backend (.env)

Create `apps/new-backend/.env`:

```bash
cp apps/new-backend/.env.example apps/new-backend/.env
```

Edit the file with your credentials:

```env
NODE_ENV=development
PORT=3002

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vysion_db

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:19006
```

#### Mobile (.env)

Create `apps/mobile/.env`:

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

Edit the file with your Firebase config:

```env
API_URL=http://localhost:3002/api

FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123:web:abc123
```

### 4. Set Up Database

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE vysion_db;

# Create user (optional)
CREATE USER vysion_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vysion_db TO vysion_user;
```

#### Run Migrations

```bash
cd database
npm run migrate
```

#### Seed Database (Optional)

```bash
npm run seed
```

This creates sample users for testing.

### 5. Start Development Servers

#### Option 1: Start All Services

From the root directory:

```bash
npm run dev
```

This starts:
- Backend API on `http://localhost:3002`
- Mobile app with Expo

#### Option 2: Start Individually

**Backend:**
```bash
cd apps/new-backend
npm run dev
```

**Mobile:**
```bash
cd apps/mobile
npm start
```

Then choose:
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Scan QR code with Expo Go app

---

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `vysion-analytics`
4. Enable Google Analytics (optional)

### 2. Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable **Google**, **Apple** for social login

### 3. Set Up Storage

1. Go to **Storage** → **Get Started**
2. Start in **production mode** (update rules later)
3. Note your storage bucket URL

### 4. Get Service Account Key (Backend)

1. Go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Download JSON file
4. Extract values for `.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### 5. Get Web Config (Mobile)

1. Go to **Project Settings** → **General**
2. Under **Your apps**, click **</> Web**
3. Register app: `vysion-mobile`
4. Copy config values to mobile `.env`

---

## 📱 Mobile Development

### Using Expo Go (Easiest)

1. Install Expo Go on your phone from App Store/Play Store
2. Start the dev server: `npm start`
3. Scan QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

### Using Simulators

**iOS (Mac only):**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

Make sure simulators are installed and configured.

---

## 🧪 Testing

### Backend Tests

```bash
cd apps/new-backend
npm test
```

### Type Checking

```bash
# Check all TypeScript
npm run type-check

# Backend only
cd apps/new-backend
npm run type-check

# Mobile only
cd apps/mobile
npm run type-check
```

---

## 📚 Development Workflow

### 1. Create a New Feature

```bash
git checkout -b feature/player-search
```

### 2. Make Changes

- Backend code in `apps/new-backend/src/`
- Mobile code in `apps/mobile/app/` and `apps/mobile/components/`
- Shared types/utils in `packages/shared/src/`

### 3. Test Your Changes

```bash
# Run backend
cd apps/new-backend
npm run dev

# Run mobile
cd apps/mobile
npm start
```

### 4. Commit and Push

```bash
git add .
git commit -m "feat: add player search functionality"
git push origin feature/player-search
```

### 5. Create Pull Request

Open PR on GitHub and request review.

---

## 🛠️ Common Commands

### Root Commands
```bash
npm install              # Install all dependencies
npm run dev              # Start all services
npm run build            # Build all packages
```

### Database Commands
```bash
cd database
npm run migrate          # Run migrations
npm run migrate:reset    # Reset database
npm run generate         # Generate Prisma client
npm run studio           # Open Prisma Studio (GUI)
npm run seed            # Seed database
```

### Backend Commands
```bash
cd apps/new-backend
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production build
npm test                 # Run tests
```

### Mobile Commands
```bash
cd apps/mobile
npm start                # Start Expo
npm run ios              # Run on iOS
npm run android          # Run on Android
npm test                 # Run tests
```

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error: Connection refused**
- Make sure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL (macOS)
brew services start postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql
```

### Firebase Authentication Errors

**Error: Invalid API key**
- Check Firebase config in `.env`
- Verify project ID matches

**Error: Admin SDK failed to initialize**
- Check service account JSON is correct
- Ensure private key includes `\n` characters

### Mobile App Won't Start

**Error: Metro bundler failed**
```bash
cd apps/mobile
rm -rf node_modules
npm install
npm start --clear
```

**Error: Can't find module '@vysion/shared'**
```bash
cd packages/shared
npm run build
```

### Port Already in Use

Change ports in `.env` files or kill existing process:

```bash
# Find process on port 3002
lsof -i :3002

# Kill process
kill -9 <PID>
```

---

## 📖 Next Steps

1. **Read Architecture**: Check [ARCHITECTURE.md](../ARCHITECTURE.md)
2. **Follow Standards**: Review [CODING_STANDARDS.md](../CODING_STANDARDS.md)
3. **Explore APIs**: See [docs/api/](./api/)
4. **Build Features**: Start with player profile creation

---

## 🆘 Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: Create GitHub issue
- **Contact**: jamesbrian.kariuki@hotmail.com

---

**Happy Coding! ⚽🚀**
