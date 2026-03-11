import { z } from 'zod';
/**
 * User Schemas
 */
export declare const UserProfileSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    nickname: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodOptional<z.ZodString>;
    nationality: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    languages: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    currentLocation: z.ZodOptional<z.ZodString>;
    profilePhoto: z.ZodOptional<z.ZodString>;
    coverPhoto: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    languages: string[];
    nickname?: string | undefined;
    dateOfBirth?: string | undefined;
    nationality?: string | undefined;
    phone?: string | undefined;
    currentLocation?: string | undefined;
    profilePhoto?: string | undefined;
    coverPhoto?: string | undefined;
}, {
    firstName: string;
    lastName: string;
    nickname?: string | undefined;
    dateOfBirth?: string | undefined;
    nationality?: string | undefined;
    phone?: string | undefined;
    languages?: string[] | undefined;
    currentLocation?: string | undefined;
    profilePhoto?: string | undefined;
    coverPhoto?: string | undefined;
}>;
export declare const PhysicalAttributesSchema: z.ZodObject<{
    height: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    wingspan: z.ZodOptional<z.ZodNumber>;
    fitnessLevel: z.ZodDefault<z.ZodNumber>;
    preferredFoot: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT", "BOTH"]>>;
}, "strip", z.ZodTypeAny, {
    fitnessLevel: number;
    height?: number | undefined;
    weight?: number | undefined;
    wingspan?: number | undefined;
    preferredFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
}, {
    height?: number | undefined;
    weight?: number | undefined;
    wingspan?: number | undefined;
    fitnessLevel?: number | undefined;
    preferredFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
}>;
export declare const FootballProfileSchema: z.ZodObject<{
    primaryPosition: z.ZodOptional<z.ZodString>;
    secondaryPositions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    currentClub: z.ZodOptional<z.ZodString>;
    previousClubs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    playingStyle: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    strongFoot: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT", "BOTH"]>>;
    experience: z.ZodOptional<z.ZodEnum<["AMATEUR", "ACADEMY", "SEMI_PRO", "PRO"]>>;
}, "strip", z.ZodTypeAny, {
    secondaryPositions: string[];
    previousClubs: string[];
    playingStyle: string[];
    primaryPosition?: string | undefined;
    currentClub?: string | undefined;
    strongFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
    experience?: "AMATEUR" | "ACADEMY" | "SEMI_PRO" | "PRO" | undefined;
}, {
    primaryPosition?: string | undefined;
    secondaryPositions?: string[] | undefined;
    currentClub?: string | undefined;
    previousClubs?: string[] | undefined;
    playingStyle?: string[] | undefined;
    strongFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
    experience?: "AMATEUR" | "ACADEMY" | "SEMI_PRO" | "PRO" | undefined;
}>;
export declare const AchievementSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description?: string | undefined;
    date?: string | undefined;
}, {
    title: string;
    description?: string | undefined;
    date?: string | undefined;
}>;
/**
 * Media Schemas
 */
export declare const MediaUploadSchema: z.ZodObject<{
    type: z.ZodEnum<["image", "video"]>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "image" | "video";
    title?: string | undefined;
    description?: string | undefined;
}, {
    type: "image" | "video";
    title?: string | undefined;
    description?: string | undefined;
}>;
/**
 * Authentication Schemas
 */
export declare const SignUpSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    userType: z.ZodOptional<z.ZodEnum<["TALENT", "SCOUT", "AGENT", "CLUB"]>>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType?: "TALENT" | "SCOUT" | "AGENT" | "CLUB" | undefined;
}, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType?: "TALENT" | "SCOUT" | "AGENT" | "CLUB" | undefined;
}>;
export declare const SignInSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
/**
 * Search Schemas
 */
export declare const SearchFiltersSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodString>;
    nationality: z.ZodOptional<z.ZodString>;
    ageMin: z.ZodOptional<z.ZodNumber>;
    ageMax: z.ZodOptional<z.ZodNumber>;
    experienceLevel: z.ZodOptional<z.ZodEnum<["AMATEUR", "ACADEMY", "SEMI_PRO", "PRO"]>>;
    currentClub: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    nationality?: string | undefined;
    currentClub?: string | undefined;
    query?: string | undefined;
    position?: string | undefined;
    ageMin?: number | undefined;
    ageMax?: number | undefined;
    experienceLevel?: "AMATEUR" | "ACADEMY" | "SEMI_PRO" | "PRO" | undefined;
}, {
    nationality?: string | undefined;
    currentClub?: string | undefined;
    query?: string | undefined;
    position?: string | undefined;
    ageMin?: number | undefined;
    ageMax?: number | undefined;
    experienceLevel?: "AMATEUR" | "ACADEMY" | "SEMI_PRO" | "PRO" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
/**
 * Verification Schemas
 */
export declare const VerificationRequestSchema: z.ZodObject<{
    type: z.ZodEnum<["face", "skill", "document"]>;
    mediaUrls: z.ZodArray<z.ZodString, "many">;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "face" | "skill" | "document";
    mediaUrls: string[];
    notes?: string | undefined;
}, {
    type: "face" | "skill" | "document";
    mediaUrls: string[];
    notes?: string | undefined;
}>;
/**
 * Messaging Schemas
 */
export declare const MessageSchema: z.ZodObject<{
    receiverId: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    receiverId: string;
    content: string;
}, {
    receiverId: string;
    content: string;
}>;
/**
 * Helper function to validate data
 */
export declare function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T;
export declare function validateDataSafe<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    errors: z.ZodError;
};
