# Vysion — The Football Professional Network

> **⚡ Version 2.0** - Complete rebuild with mobile-first architecture

## 📌 Overview  
**Vysion** connects players and football professionals through profiles, organisations, connections, a football feed and opportunities.

### 🌟 What's New in v2.0
- ✅ **Mobile-First** - React Native + Expo app for iOS & Android
- ✅ **Clean Architecture** - Modular API, services and shared validation
- ✅ **Shared Packages** - Reusable types, schemas, utilities
- ✅ **Modern Tech Stack** - TypeScript, Prisma, Firebase, NativeWind
- ✅ **Better DX** - Comprehensive docs, coding standards, examples

## Product direction

Vysion is a mobile professional network for football. Players, scouts, coaches,
agents and club professionals can establish their identity, showcase their work,
build relationships and find opportunities.

The football network implementation covers:

- Football profiles with professional background, expertise, team history,
  achievements and footage links.
- Independent club and agency pages, owned by their creators, with member links.
- Connection requests and text messaging between accepted connections.
- A chronological football feed for match footage, training, achievements,
  team updates and recruitment.
- Opportunities for trials, player recruitment, representation and football jobs.

See the [network API contract](docs/api/network.md) and
[rollout and acceptance guide](docs/engineering/football-network-release.md).
Network availability requires the prepared database migration to be reviewed and
applied to an explicitly approved target. Page ownership and self-selected roles
are not verified professional credentials.

Footage currently uses member-supplied HTTPS links. AI video analysis, drill
assessment, Academy training plans, hosted uploads, real-time chat, payments and
recommendations remain future work.

## 🏗️ Tech Stack
### Mobile App
- **Framework**: React Native 0.81 + Expo SDK 54
- **Routing**: React Navigation (native stack)
- **Styling**: React Native StyleSheet and shared UI components
- **State**: Auth Context, TanStack Query and Zustand
- **Forms**: React Hook Form + Zod validation

### Backend API
- **Runtime**: Node.js + Express + TypeScript
- **ORM**: Prisma with PostgreSQL
- **Authentication**: Firebase Admin SDK
- **Validation**: Zod schemas
- **Logging**: Winston

### Shared Infrastructure
- **Authentication**: Firebase Auth (email/password client flow)
- **Shared Code**: `@vysion/shared` package
- **Future AI**: Python microservices for video analysis

## Roadmap

The current priority is the football professional network. See [ROADMAP.md](ROADMAP.md)
for rollout gates and later development areas.

## 📌 Getting Started

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/Hamez-brayo/football-scout.git
cd football-scout

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp services/api/.env.example services/api/.env
cp apps/mobile/.env.example apps/mobile/.env
# Edit .env files with your credentials

# 4. Review the rollout guide before applying migrations to an approved database.
# Do not run migrations or seeds against an unverified destination.
npm run db:generate
npm run build:shared

# 5. Start development servers
npm run dev
```

**📖 Detailed Guide**: See [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)

## 🤝 Contributing
We welcome contributions! Please submit a pull request or reach out to discuss ideas.

## 📞 Contact
For inquiries, partnerships, or collaborations, please reach out via email at jamesbrian.kariuki@hotmail.com. 
---
**Let's revolutionize football analytics together! ⚽🚀**
