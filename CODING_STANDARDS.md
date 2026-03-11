# Vysion Analytics - Coding Standards & Best Practices

## 📋 Table of Contents
1. [TypeScript Standards](#typescript-standards)
2. [File & Folder Naming](#file--folder-naming)
3. [Code Style](#code-style)
4. [React Native Best Practices](#react-native-best-practices)
5. [Backend Best Practices](#backend-best-practices)
6. [Git Workflow](#git-workflow)
7. [Comments & Documentation](#comments--documentation)

---

## 🔷 TypeScript Standards

### Always Use TypeScript
- All files must be `.ts` or `.tsx` (no JavaScript)
- Avoid `any` type - use `unknown` or proper typing
- Enable strict mode in `tsconfig.json`

### Type Definitions
```typescript
// ✅ Good - Explicit interfaces
interface PlayerProfile {
  id: string;
  name: string;
  age: number;
  position: Position;
}

// ❌ Bad - Using any
const getPlayer = (): any => { /* ... */ }

// ✅ Good - Proper return type
const getPlayer = (): Promise<PlayerProfile> => { /* ... */ }
```

### Enums vs Union Types
```typescript
// ✅ Use enums for fixed values
export enum UserType {
  TALENT = 'TALENT',
  SCOUT = 'SCOUT',
  CLUB = 'CLUB',
}

// ✅ Use union types for simple cases
type Status = 'active' | 'inactive' | 'pending';
```

### Generic Types
```typescript
// ✅ Use generics for reusable functions
function wrapResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}
```

---

## 📁 File & Folder Naming

### Naming Conventions
- **Components**: PascalCase (`PlayerCard.tsx`, `ProfileScreen.tsx`)
- **Utilities**: camelCase (`formatDate.ts`, `apiClient.ts`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`, `usePlayer.ts`)
- **Types**: PascalCase in `types.ts` files (`PlayerProfile`, `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE in `constants.ts` (`API_BASE_URL`, `MAX_FILE_SIZE`)
- **Folders**: kebab-case (`player-profile/`, `auth-context/`)

### File Organization
```
components/
├── player/
│   ├── PlayerCard.tsx          # Component
│   ├── PlayerCard.styles.ts    # Styles (if needed)
│   ├── PlayerCard.test.tsx     # Tests
│   └── index.ts                # Export barrel
```

### Barrel Exports
```typescript
// components/player/index.ts
export { PlayerCard } from './PlayerCard';
export { PlayerList } from './PlayerList';
export { PlayerDetails } from './PlayerDetails';

// Usage elsewhere
import { PlayerCard, PlayerList } from '@/components/player';
```

---

## 🎨 Code Style

### Formatting
- **Indentation**: 2 spaces (not tabs)
- **Line Length**: Max 100 characters
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Trailing Commas**: Use in multiline objects/arrays

### ESLint & Prettier
```json
// .eslintrc.json
{
  "extends": [
    "expo",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Import Order
```typescript
// 1. External dependencies
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

// 2. Internal packages
import { PlayerProfile } from '@vysion/shared/types';
import { PlayerSchema } from '@vysion/shared/schemas';

// 3. Local imports
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui';
import { formatDate } from '@/utils';

// 4. Relative imports
import { PlayerCard } from './PlayerCard';
import styles from './styles';
```

---

## ⚛️ React Native Best Practices

### Functional Components with Hooks
```typescript
// ✅ Good - Functional component with TypeScript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface PlayerCardProps {
  player: PlayerProfile;
  onPress: (id: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onPress }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <TouchableOpacity onPress={() => onPress(player.id)}>
      <View>
        <Text>{player.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

// ❌ Bad - Class component (avoid)
class PlayerCard extends React.Component { /* ... */ }
```

### Custom Hooks
```typescript
// hooks/usePlayer.ts
import { useState, useEffect } from 'react';
import { getPlayerById } from '@/services/api';
import type { PlayerProfile } from '@vysion/shared/types';

export const usePlayer = (playerId: string) => {
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setLoading(true);
        const data = await getPlayerById(playerId);
        setPlayer(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  return { player, loading, error };
};
```

### Styling with NativeWind
```typescript
import { View, Text } from 'react-native';

export const PlayerCard = ({ player }) => {
  return (
    <View className="bg-white rounded-lg p-4 shadow-md">
      <Text className="text-lg font-bold text-gray-900">
        {player.name}
      </Text>
      <Text className="text-sm text-gray-600">
        {player.position}
      </Text>
    </View>
  );
};
```

### Performance Optimization
```typescript
import React, { memo, useCallback, useMemo } from 'react';

// ✅ Memoize expensive components
export const PlayerList = memo(({ players }) => {
  // ✅ Use useMemo for expensive calculations
  const sortedPlayers = useMemo(
    () => players.sort((a, b) => a.rating - b.rating),
    [players]
  );

  // ✅ Use useCallback for functions passed as props
  const handlePlayerPress = useCallback((id: string) => {
    console.log('Player pressed:', id);
  }, []);

  return (
    <FlatList
      data={sortedPlayers}
      renderItem={({ item }) => (
        <PlayerCard player={item} onPress={handlePlayerPress} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
});
```

---

## 🔧 Backend Best Practices

### Controller Pattern
```typescript
// controllers/playerController.ts
import { Request, Response, NextFunction } from 'express';
import { playerService } from '@/services';
import { PlayerSchema } from '@vysion/shared/schemas';

export class PlayerController {
  async createPlayer(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate input
      const validatedData = PlayerSchema.parse(req.body);

      // 2. Call service layer
      const player = await playerService.createPlayer(validatedData, req.user.id);

      // 3. Return response
      res.status(201).json({
        success: true,
        data: player,
        message: 'Player created successfully',
      });
    } catch (error) {
      next(error); // Pass to error middleware
    }
  }

  async getPlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const player = await playerService.getPlayerById(id);

      if (!player) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Player not found' },
        });
      }

      res.json({
        success: true,
        data: player,
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### Service Layer
```typescript
// services/playerService.ts
import { prisma } from '@/config/database';
import type { PlayerProfile } from '@vysion/shared/types';

export class PlayerService {
  async createPlayer(data: Partial<PlayerProfile>, userId: string) {
    // Business logic here
    const player = await prisma.user.create({
      data: {
        ...data,
        userId,
        userType: 'TALENT',
      },
      include: {
        footballProfile: true,
        physicalAttributes: true,
      },
    });

    return player;
  }

  async getPlayerById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        footballProfile: true,
        physicalAttributes: true,
        media: true,
      },
    });
  }

  async searchPlayers(filters: SearchFilters) {
    const { position, ageMin, ageMax, country } = filters;

    return prisma.user.findMany({
      where: {
        userType: 'TALENT',
        position: position || undefined,
        nationality: country || undefined,
        // Add more filters
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const playerService = new PlayerService();
```

### Middleware Pattern
```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { auth } from '@/config/firebase';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No token provided' },
      });
    }

    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email!,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid token' },
    });
  }
};
```

### Error Handling
```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        fields: err.flatten().fieldErrors,
      },
    });
  }

  // Custom app errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Unknown errors
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};
```

---

## 🌿 Git Workflow

### Branch Naming
- `main` - Production-ready code
- `develop` - Development branch
- `feature/player-profile` - New features
- `bugfix/login-error` - Bug fixes
- `hotfix/security-patch` - Urgent fixes

### Commit Messages
Use conventional commits:

```
feat: add player profile creation screen
fix: resolve authentication token expiry issue
refactor: improve database query performance
docs: update API documentation
test: add unit tests for player service
chore: update dependencies
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots]
```

---

## 📝 Comments & Documentation

### JSDoc for Functions
```typescript
/**
 * Retrieves a player profile by ID
 * @param id - The unique player identifier
 * @returns Promise resolving to player profile or null
 * @throws {AppError} If database query fails
 */
async getPlayerById(id: string): Promise<PlayerProfile | null> {
  return prisma.user.findUnique({ where: { id } });
}
```

### Inline Comments
```typescript
// ✅ Good - Explains WHY, not WHAT
// Use exponential backoff to avoid rate limiting
await retry(uploadVideo, { maxAttempts: 3, delay: 1000 });

// ❌ Bad - States the obvious
// Loop through players
players.forEach(player => { /* ... */ });
```

### TODO Comments
```typescript
// TODO(username): Add pagination support for player search
// FIXME: Handle edge case when user has no profile photo
// NOTE: This endpoint will be deprecated in v2.0
```

---

## ✅ Code Review Checklist

### Before Submitting PR
- [ ] Code follows TypeScript standards
- [ ] All tests pass
- [ ] No console.log or debugging code
- [ ] Imports are organized
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] API responses follow standard format
- [ ] Documentation is updated

### Reviewer Checklist
- [ ] Code is readable and maintainable
- [ ] Business logic is in service layer
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Edge cases handled
- [ ] Tests are meaningful

---

**Last Updated**: March 8, 2026
