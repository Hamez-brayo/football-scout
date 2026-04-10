export declare enum UserRole {
    PLAYER = "PLAYER",
    SCOUT = "SCOUT"
}
export { UserRole as UserType };
export declare enum RegistrationStatus {
    INCOMPLETE = "INCOMPLETE",
    JOURNEY_COMPLETED = "JOURNEY_COMPLETED",
    COMPLETE = "COMPLETE"
}
export declare enum PlayingStatus {
    PLAYING = "PLAYING",
    PROFESSIONAL = "PROFESSIONAL"
}
export declare enum ProfessionalFocus {
    PLAYER_DEVELOPMENT = "PLAYER_DEVELOPMENT",
    TEAM_OPERATIONS = "TEAM_OPERATIONS",
    TALENT_DISCOVERY = "TALENT_DISCOVERY",
    CLUB_MANAGEMENT = "CLUB_MANAGEMENT"
}
export declare enum Position {
    GOALKEEPER = "GOALKEEPER",
    CENTER_BACK = "CENTER_BACK",
    LEFT_BACK = "LEFT_BACK",
    RIGHT_BACK = "RIGHT_BACK",
    DEFENSIVE_MIDFIELDER = "DEFENSIVE_MIDFIELDER",
    CENTRAL_MIDFIELDER = "CENTRAL_MIDFIELDER",
    ATTACKING_MIDFIELDER = "ATTACKING_MIDFIELDER",
    LEFT_WINGER = "LEFT_WINGER",
    RIGHT_WINGER = "RIGHT_WINGER",
    STRIKER = "STRIKER"
}
export declare enum ExperienceLevel {
    AMATEUR = "AMATEUR",
    ACADEMY = "ACADEMY",
    SEMI_PRO = "SEMI_PRO",
    PRO = "PRO"
}
export declare enum PreferredFoot {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    BOTH = "BOTH"
}
export declare enum MediaType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO"
}
export declare enum MediaStatus {
    PENDING = "PENDING",
    READY = "READY",
    FAILED = "FAILED"
}
export declare enum DrillType {
    TECHNICAL = "TECHNICAL",
    ATHLETIC = "ATHLETIC"
}
export declare enum DrillSubmissionStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED"
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    timestamp: string;
}
export interface ApiError {
    success: false;
    error: {
        code: string;
        message: string;
        fields?: Record<string, string[]>;
    };
    timestamp: string;
}
export type ApiResponseEnvelope<T> = ApiResponse<T>;
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
export interface AuthUser {
    id?: string;
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    role?: UserRole;
    userType?: UserRole;
    registrationStatus?: RegistrationStatus;
    profilePhoto?: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
}
export interface JwtSessionPayload {
    userId: string;
    email: string;
    role?: UserRole | null;
}
export interface SessionResponse extends ApiResponse<{
    user: AuthUser;
    appToken?: string;
}> {
}
export interface SignUpRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
}
export interface SignInRequest {
    email: string;
    password: string;
}
export interface CreateSessionRequest {
    idToken: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
}
export interface UserProfile {
    id: string;
    userId: string;
    email: string;
    role: UserRole;
    registrationStatus: RegistrationStatus;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    dateOfBirth?: string;
    nationality?: string;
    phone?: string;
    currentLocation?: string;
    profilePhoto?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PlayerProfile {
    id: string;
    userId: string;
    primaryPosition?: string;
    secondaryPositions: string[];
    currentClub?: string;
    preferredFoot?: PreferredFoot;
    experienceLevel?: ExperienceLevel;
    isAvailable: boolean;
    bio?: string;
    physicalAttributes?: PhysicalAttributes;
    footballProfile?: FootballProfile;
    createdAt: Date;
    updatedAt: Date;
}
export interface PhysicalAttributes {
    id: string;
    playerProfileId: string;
    heightCm?: number;
    weightKg?: number;
    wingspanCm?: number;
    sprintSpeed?: number;
    staminaScore?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface FootballProfile {
    id: string;
    playerProfileId: string;
    dominantFoot?: PreferredFoot;
    playingStyle: string[];
    strongestSkills: string[];
    weakFootRating?: number;
    achievements: Achievement[];
    createdAt: Date;
    updatedAt: Date;
}
export interface Achievement {
    id: string;
    footballProfileId: string;
    title: string;
    description?: string;
    date?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface MediaRecord {
    id: string;
    userId: string;
    type: MediaType;
    status: MediaStatus;
    url: string;
    thumbnailUrl?: string;
    mimeType: string;
    sizeBytes: number;
    durationSec?: number;
    title?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
export type Media = MediaRecord;
export declare enum VerificationStatus {
    UNVERIFIED = "UNVERIFIED",
    IDENTITY_VERIFIED = "IDENTITY_VERIFIED",
    COACH_VERIFIED = "COACH_VERIFIED",
    FULLY_VERIFIED = "FULLY_VERIFIED"
}
export interface VerificationRequest {
    id: string;
    userId: string;
    type: 'face' | 'skill' | 'document';
    status: VerificationStatus;
    mediaUrls: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: Date;
}
export interface Conversation {
    id: string;
    participantIds: string[];
    lastMessage?: Message;
    updatedAt: Date;
}
export interface CreateProfileRequest {
    primaryPosition?: string;
    secondaryPositions?: string[];
    currentClub?: string;
    preferredFoot?: PreferredFoot;
    experienceLevel?: ExperienceLevel;
    isAvailable?: boolean;
    bio?: string;
    physicalAttributes?: Omit<PhysicalAttributes, 'id' | 'playerProfileId' | 'createdAt' | 'updatedAt'>;
    footballProfile?: Omit<FootballProfile, 'id' | 'playerProfileId' | 'achievements' | 'createdAt' | 'updatedAt'>;
}
export type UpdateProfileRequest = Partial<CreateProfileRequest>;
export interface SearchFilters {
    query?: string;
    position?: string;
    nationality?: string;
    ageMin?: number;
    ageMax?: number;
    heightMin?: number;
    heightMax?: number;
    speedMin?: number;
    speedMax?: number;
    experienceLevel?: ExperienceLevel;
    currentClub?: string;
    page?: number;
    limit?: number;
}
export interface TrainingProgram {
    id: string;
    title: string;
    level: string;
    positionFocus: string;
    description?: string;
    createdById?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Drill {
    id: string;
    trainingProgramId: string;
    title: string;
    type: DrillType;
    instructions: string;
    videoUrl?: string;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface DrillSubmission {
    id: string;
    playerId: string;
    drillId: string;
    videoUrl: string;
    status: DrillSubmissionStatus;
    verifiedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateTrainingProgramRequest {
    title: string;
    level: string;
    positionFocus: string;
    description?: string;
}
export interface CreateDrillRequest {
    trainingProgramId: string;
    title: string;
    type: DrillType;
    instructions: string;
    videoUrl?: string;
    displayOrder?: number;
}
export interface CreateDrillSubmissionRequest {
    drillId: string;
    videoUrl: string;
}
export interface MetricType {
    id: string;
    key: string;
    displayName: string;
    unit?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PlayerStatEntry {
    id: string;
    playerId: string;
    metricTypeId: string;
    value: number;
    recordedAt: Date;
    source?: string;
    createdAt: Date;
    updatedAt: Date;
    metricType?: MetricType;
}
export interface CreatePlayerStatRequest {
    playerId: string;
    metricKey: string;
    value: number;
    recordedAt?: string;
    source?: string;
}
export interface PlayerStatsQuery {
    metricKey?: string;
    from?: string;
    to?: string;
}
export interface ShortlistEntry {
    id: string;
    scoutId: string;
    playerId: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PlayerViewEntry {
    id: string;
    scoutId: string;
    playerId: string;
    viewedAt: Date;
}
export interface ShortlistMutationRequest {
    playerId: string;
    notes?: string;
}
export interface UploadServiceConfig {
    maxFileSizeMb: number;
    allowedMimeTypes: string[];
    maxVideoDurationSec: number;
}
export interface UploadMediaInput {
    filename: string;
    mimeType: string;
    sizeBytes: number;
    durationSec?: number;
    buffer?: Buffer;
    sourcePath?: string;
}
export interface UploadService {
    uploadMedia(file: UploadMediaInput, ownerId: string, type: 'image' | 'video'): Promise<MediaRecord>;
    deleteMedia(mediaId: string): Promise<void>;
    getSignedUrl(mediaId: string): Promise<string>;
}
