# Backend API Documentation

## Overview

The Vysion Analytics Backend API provides RESTful endpoints for managing users, players, media, and verification.

**Base URL**: `http://localhost:3002/api`  
**API Version**: `v1`  
**Authentication**: Firebase Bearer Token

---

## Authentication

All protected endpoints require a Firebase ID token in the `Authorization` header.

### Header Format
```
Authorization: Bearer <firebase-id-token>
```

### Getting a Token

1. Sign in with Firebase on client
2. Get ID token: `await user.getIdToken()`
3. Include in request headers

---

## Endpoints

### Health Check

#### GET /health
Check if API is running.

**Response:**
```json
{
  "success": true,
  "message": "Vysion Analytics API is running",
  "timestamp": "2026-03-08T10:30:00Z",
  "version": "2.0.0"
}
```

---

## Authentication Routes

### Sign Up

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "player@example.com",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "TALENT"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* User object */ },
    "token": "firebase-custom-token"
  },
  "message": "Account created successfully",
  "timestamp": "2026-03-08T10:30:00Z"
}
```

### Verify Token

#### POST /api/auth/verify-token
Verify Firebase ID token and get/create user.

**Request Body:**
```json
{
  "idToken": "firebase-id-token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* User object */ }
  },
  "timestamp": "2026-03-08T10:30:00Z"
}
```

---

## User Routes

All user routes require authentication.

### Get Current User

#### GET /api/users/me
Get authenticated user's profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cuid123",
    "userId": "firebase-uid",
    "email": "player@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "userType": "TALENT",
    "physicalAttributes": { /* ... */ },
    "footballProfile": { /* ... */ }
  },
  "timestamp": "2026-03-08T10:30:00Z"
}
```

### Update Profile

#### PUT /api/users/profile
Update user profile information.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2000-05-15",
  "nationality": "United States",
  "currentLocation": "Los Angeles, CA",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* Updated user object */ },
  "message": "Profile updated successfully",
  "timestamp": "2026-03-08T10:30:00Z"
}
```

### Update Physical Attributes

#### PUT /api/users/physical-attributes
Update physical attributes.

**Request Body:**
```json
{
  "height": 178,
  "weight": 72,
  "wingspan": 183,
  "fitnessLevel": 85,
  "preferredFoot": "RIGHT"
}
```

### Update Football Profile

#### PUT /api/users/football-profile
Update football profile.

**Request Body:**
```json
{
  "primaryPosition": "Central Midfielder",
  "secondaryPositions": ["Attacking Midfielder"],
  "currentClub": "LA Galaxy Academy",
  "previousClubs": ["Youth FC"],
  "playingStyle": ["Technical", "Playmaker"],
  "strongFoot": "RIGHT",
  "experience": "ACADEMY"
}
```

---

## Player Routes

### Search Players

#### GET /api/players/search
Search for players (optional auth).

**Query Parameters:**
- `query` (string): Search term
- `position` (string): Filter by position
- `nationality` (string): Filter by nationality
- `ageMin` (number): Minimum age
- `ageMax` (number): Maximum age
- `experienceLevel` (string): AMATEUR, ACADEMY, SEMI_PRO, PRO
- `currentClub` (string): Filter by club
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)

**Example:**
```
GET /api/players/search?position=MIDFIELDER&nationality=United States&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [ /* Array of player objects */ ],
    "total": 45,
    "page": 1,
    "limit": 20,
    "hasMore": true
  },
  "timestamp": "2026-03-08T10:30:00Z"
}
```

### Get Player by ID

#### GET /api/players/:id
Get detailed player information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "player-id",
    "firstName": "John",
    "lastName": "Doe",
    "position": "MIDFIELDER",
    "physicalAttributes": { /* ... */ },
    "footballProfile": { /* ... */ },
    "media": [ /* ... */ ]
  },
  "timestamp": "2026-03-08T10:30:00Z"
}
```

### Get Player Stats

#### GET /api/players/:id/stats
Get player statistics (requires auth).

**Response:**
```json
{
  "success": true,
  "data": {
    "playerId": "player-id",
    "profileCompleteness": 75,
    "mediaCount": 5,
    "achievementsCount": 3
  },
  "timestamp": "2026-03-08T10:30:00Z"
}
```

---

## Error Responses

All endpoints return consistent error format.

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "fields": { /* Field-specific errors (validation) */ }
  },
  "timestamp": "2026-03-08T10:30:00Z"
}
```

### HTTP Status Codes
- `200` OK - Success
- `201` Created - Resource created
- `400` Bad Request - Validation error
- `401` Unauthorized - Missing/invalid token
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource not found
- `409` Conflict - Resource already exists
- `500` Internal Server Error - Server error

### Error Codes
- `VALIDATION_ERROR` - Invalid input data
- `UNAUTHORIZED` - Not authenticated
- `INVALID_TOKEN` - Invalid auth token
- `TOKEN_EXPIRED` - Token expired
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `ALREADY_EXISTS` - Resource already exists
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting

Currently no rate limiting implemented. Will be added in future versions.

---

## Postman Collection

Import our Postman collection for easy API testing:  
[Download Collection](./postman-collection.json) (Coming soon)

---

**Last Updated**: March 8, 2026
