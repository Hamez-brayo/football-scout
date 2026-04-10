import { z } from 'zod';
export declare const RoleSchema: z.ZodEnum<["PLAYER", "SCOUT"]>;
export declare const ApiPaginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const SignUpSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<["PLAYER", "SCOUT"]>>;
    userType: z.ZodOptional<z.ZodEnum<["PLAYER", "SCOUT"]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: "PLAYER" | "SCOUT" | undefined;
    userType?: "PLAYER" | "SCOUT" | undefined;
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: "PLAYER" | "SCOUT" | undefined;
    userType?: "PLAYER" | "SCOUT" | undefined;
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
export declare const SessionExchangeSchema: z.ZodObject<{
    idToken: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["PLAYER", "SCOUT"]>>;
    userType: z.ZodOptional<z.ZodEnum<["PLAYER", "SCOUT"]>>;
}, "strip", z.ZodTypeAny, {
    idToken: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
    role?: "PLAYER" | "SCOUT" | undefined;
    userType?: "PLAYER" | "SCOUT" | undefined;
}, {
    idToken: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
    role?: "PLAYER" | "SCOUT" | undefined;
    userType?: "PLAYER" | "SCOUT" | undefined;
}>;
export declare const UserProfileSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    fullName: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodOptional<z.ZodString>;
    nationality: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    currentLocation: z.ZodOptional<z.ZodString>;
    profilePhoto: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    fullName?: string | undefined;
    dateOfBirth?: string | undefined;
    nationality?: string | undefined;
    phone?: string | undefined;
    currentLocation?: string | undefined;
    profilePhoto?: string | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    fullName?: string | undefined;
    dateOfBirth?: string | undefined;
    nationality?: string | undefined;
    phone?: string | undefined;
    currentLocation?: string | undefined;
    profilePhoto?: string | undefined;
}>;
export declare const PhysicalAttributesSchema: z.ZodObject<{
    heightCm: z.ZodOptional<z.ZodNumber>;
    weightKg: z.ZodOptional<z.ZodNumber>;
    wingspanCm: z.ZodOptional<z.ZodNumber>;
    sprintSpeed: z.ZodOptional<z.ZodNumber>;
    staminaScore: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    heightCm?: number | undefined;
    weightKg?: number | undefined;
    wingspanCm?: number | undefined;
    sprintSpeed?: number | undefined;
    staminaScore?: number | undefined;
}, {
    heightCm?: number | undefined;
    weightKg?: number | undefined;
    wingspanCm?: number | undefined;
    sprintSpeed?: number | undefined;
    staminaScore?: number | undefined;
}>;
export declare const FootballProfileSchema: z.ZodObject<{
    dominantFoot: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT", "BOTH"]>>;
    playingStyle: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    strongestSkills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    weakFootRating: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    playingStyle: string[];
    strongestSkills: string[];
    dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
    weakFootRating?: number | undefined;
}, {
    dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
    playingStyle?: string[] | undefined;
    strongestSkills?: string[] | undefined;
    weakFootRating?: number | undefined;
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
export declare const CreateProfileSchema: z.ZodObject<{
    primaryPosition: z.ZodOptional<z.ZodString>;
    secondaryPositions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    currentClub: z.ZodOptional<z.ZodString>;
    preferredFoot: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT", "BOTH"]>>;
    experienceLevel: z.ZodOptional<z.ZodEnum<["AMATEUR", "ACADEMY", "SEMI_PRO", "PRO"]>>;
    isAvailable: z.ZodOptional<z.ZodBoolean>;
    bio: z.ZodOptional<z.ZodString>;
    physicalAttributes: z.ZodOptional<z.ZodObject<{
        heightCm: z.ZodOptional<z.ZodNumber>;
        weightKg: z.ZodOptional<z.ZodNumber>;
        wingspanCm: z.ZodOptional<z.ZodNumber>;
        sprintSpeed: z.ZodOptional<z.ZodNumber>;
        staminaScore: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        heightCm?: number | undefined;
        weightKg?: number | undefined;
        wingspanCm?: number | undefined;
        sprintSpeed?: number | undefined;
        staminaScore?: number | undefined;
    }, {
        heightCm?: number | undefined;
        weightKg?: number | undefined;
        wingspanCm?: number | undefined;
        sprintSpeed?: number | undefined;
        staminaScore?: number | undefined;
    }>>;
    footballProfile: z.ZodOptional<z.ZodObject<{
        dominantFoot: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT", "BOTH"]>>;
        playingStyle: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        strongestSkills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        weakFootRating: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        playingStyle: string[];
        strongestSkills: string[];
        dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
        weakFootRating?: number | undefined;
    }, {
        dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
        playingStyle?: string[] | undefined;
        strongestSkills?: string[] | undefined;
        weakFootRating?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    secondaryPositions: string[];
    primaryPosition?: string | undefined;
    currentClub?: string | undefined;
    preferredFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
    experienceLevel?: "AMATEUR" | "ACADEMY" | "SEMI_PRO" | "PRO" | undefined;
    isAvailable?: boolean | undefined;
    bio?: string | undefined;
    physicalAttributes?: {
        heightCm?: number | undefined;
        weightKg?: number | undefined;
        wingspanCm?: number | undefined;
        sprintSpeed?: number | undefined;
        staminaScore?: number | undefined;
    } | undefined;
    footballProfile?: {
        playingStyle: string[];
        strongestSkills: string[];
        dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
        weakFootRating?: number | undefined;
    } | undefined;
}, {
    primaryPosition?: string | undefined;
    secondaryPositions?: string[] | undefined;
    currentClub?: string | undefined;
    preferredFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
    experienceLevel?: "AMATEUR" | "ACADEMY" | "SEMI_PRO" | "PRO" | undefined;
    isAvailable?: boolean | undefined;
    bio?: string | undefined;
    physicalAttributes?: {
        heightCm?: number | undefined;
        weightKg?: number | undefined;
        wingspanCm?: number | undefined;
        sprintSpeed?: number | undefined;
        staminaScore?: number | undefined;
    } | undefined;
    footballProfile?: {
        dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
        playingStyle?: string[] | undefined;
        strongestSkills?: string[] | undefined;
        weakFootRating?: number | undefined;
    } | undefined;
}>;
export declare const UpdateProfileSchema: z.ZodObject<{
    primaryPosition: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    secondaryPositions: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    currentClub: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    preferredFoot: z.ZodOptional<z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT", "BOTH"]>>>;
    experienceLevel: z.ZodOptional<z.ZodOptional<z.ZodEnum<["AMATEUR", "ACADEMY", "SEMI_PRO", "PRO"]>>>;
    isAvailable: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    bio: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    physicalAttributes: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        heightCm: z.ZodOptional<z.ZodNumber>;
        weightKg: z.ZodOptional<z.ZodNumber>;
        wingspanCm: z.ZodOptional<z.ZodNumber>;
        sprintSpeed: z.ZodOptional<z.ZodNumber>;
        staminaScore: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        heightCm?: number | undefined;
        weightKg?: number | undefined;
        wingspanCm?: number | undefined;
        sprintSpeed?: number | undefined;
        staminaScore?: number | undefined;
    }, {
        heightCm?: number | undefined;
        weightKg?: number | undefined;
        wingspanCm?: number | undefined;
        sprintSpeed?: number | undefined;
        staminaScore?: number | undefined;
    }>>>;
    footballProfile: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        dominantFoot: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT", "BOTH"]>>;
        playingStyle: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        strongestSkills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        weakFootRating: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        playingStyle: string[];
        strongestSkills: string[];
        dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
        weakFootRating?: number | undefined;
    }, {
        dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
        playingStyle?: string[] | undefined;
        strongestSkills?: string[] | undefined;
        weakFootRating?: number | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    primaryPosition?: string | undefined;
    secondaryPositions?: string[] | undefined;
    currentClub?: string | undefined;
    preferredFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
    experienceLevel?: "AMATEUR" | "ACADEMY" | "SEMI_PRO" | "PRO" | undefined;
    isAvailable?: boolean | undefined;
    bio?: string | undefined;
    physicalAttributes?: {
        heightCm?: number | undefined;
        weightKg?: number | undefined;
        wingspanCm?: number | undefined;
        sprintSpeed?: number | undefined;
        staminaScore?: number | undefined;
    } | undefined;
    footballProfile?: {
        playingStyle: string[];
        strongestSkills: string[];
        dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
        weakFootRating?: number | undefined;
    } | undefined;
}, {
    primaryPosition?: string | undefined;
    secondaryPositions?: string[] | undefined;
    currentClub?: string | undefined;
    preferredFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
    experienceLevel?: "AMATEUR" | "ACADEMY" | "SEMI_PRO" | "PRO" | undefined;
    isAvailable?: boolean | undefined;
    bio?: string | undefined;
    physicalAttributes?: {
        heightCm?: number | undefined;
        weightKg?: number | undefined;
        wingspanCm?: number | undefined;
        sprintSpeed?: number | undefined;
        staminaScore?: number | undefined;
    } | undefined;
    footballProfile?: {
        dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
        playingStyle?: string[] | undefined;
        strongestSkills?: string[] | undefined;
        weakFootRating?: number | undefined;
    } | undefined;
}>;
export declare const PlayerProfileSchema: z.ZodObject<{
    primaryPosition: z.ZodOptional<z.ZodString>;
    secondaryPositions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    currentClub: z.ZodOptional<z.ZodString>;
    preferredFoot: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT", "BOTH"]>>;
    experienceLevel: z.ZodOptional<z.ZodEnum<["AMATEUR", "ACADEMY", "SEMI_PRO", "PRO"]>>;
    isAvailable: z.ZodOptional<z.ZodBoolean>;
    bio: z.ZodOptional<z.ZodString>;
    physicalAttributes: z.ZodOptional<z.ZodObject<{
        heightCm: z.ZodOptional<z.ZodNumber>;
        weightKg: z.ZodOptional<z.ZodNumber>;
        wingspanCm: z.ZodOptional<z.ZodNumber>;
        sprintSpeed: z.ZodOptional<z.ZodNumber>;
        staminaScore: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        heightCm?: number | undefined;
        weightKg?: number | undefined;
        wingspanCm?: number | undefined;
        sprintSpeed?: number | undefined;
        staminaScore?: number | undefined;
    }, {
        heightCm?: number | undefined;
        weightKg?: number | undefined;
        wingspanCm?: number | undefined;
        sprintSpeed?: number | undefined;
        staminaScore?: number | undefined;
    }>>;
    footballProfile: z.ZodOptional<z.ZodObject<{
        dominantFoot: z.ZodOptional<z.ZodEnum<["LEFT", "RIGHT", "BOTH"]>>;
        playingStyle: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        strongestSkills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        weakFootRating: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        playingStyle: string[];
        strongestSkills: string[];
        dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
        weakFootRating?: number | undefined;
    }, {
        dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
        playingStyle?: string[] | undefined;
        strongestSkills?: string[] | undefined;
        weakFootRating?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    secondaryPositions: string[];
    primaryPosition?: string | undefined;
    currentClub?: string | undefined;
    preferredFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
    experienceLevel?: "AMATEUR" | "ACADEMY" | "SEMI_PRO" | "PRO" | undefined;
    isAvailable?: boolean | undefined;
    bio?: string | undefined;
    physicalAttributes?: {
        heightCm?: number | undefined;
        weightKg?: number | undefined;
        wingspanCm?: number | undefined;
        sprintSpeed?: number | undefined;
        staminaScore?: number | undefined;
    } | undefined;
    footballProfile?: {
        playingStyle: string[];
        strongestSkills: string[];
        dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
        weakFootRating?: number | undefined;
    } | undefined;
}, {
    primaryPosition?: string | undefined;
    secondaryPositions?: string[] | undefined;
    currentClub?: string | undefined;
    preferredFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
    experienceLevel?: "AMATEUR" | "ACADEMY" | "SEMI_PRO" | "PRO" | undefined;
    isAvailable?: boolean | undefined;
    bio?: string | undefined;
    physicalAttributes?: {
        heightCm?: number | undefined;
        weightKg?: number | undefined;
        wingspanCm?: number | undefined;
        sprintSpeed?: number | undefined;
        staminaScore?: number | undefined;
    } | undefined;
    footballProfile?: {
        dominantFoot?: "LEFT" | "RIGHT" | "BOTH" | undefined;
        playingStyle?: string[] | undefined;
        strongestSkills?: string[] | undefined;
        weakFootRating?: number | undefined;
    } | undefined;
}>;
export declare const MediaUploadSchema: z.ZodObject<{
    type: z.ZodEffects<z.ZodEnum<["IMAGE", "VIDEO", "image", "video"]>, "IMAGE" | "VIDEO", "IMAGE" | "VIDEO" | "image" | "video">;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodString;
    sizeBytes: z.ZodNumber;
    durationSec: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "IMAGE" | "VIDEO";
    mimeType: string;
    sizeBytes: number;
    title?: string | undefined;
    description?: string | undefined;
    durationSec?: number | undefined;
}, {
    type: "IMAGE" | "VIDEO" | "image" | "video";
    mimeType: string;
    sizeBytes: number;
    title?: string | undefined;
    description?: string | undefined;
    durationSec?: number | undefined;
}>;
export declare const TrainingProgramSchema: z.ZodObject<{
    title: z.ZodString;
    level: z.ZodString;
    positionFocus: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    level: string;
    positionFocus: string;
    description?: string | undefined;
}, {
    title: string;
    level: string;
    positionFocus: string;
    description?: string | undefined;
}>;
export declare const DrillSchema: z.ZodObject<{
    trainingProgramId: z.ZodString;
    title: z.ZodString;
    type: z.ZodEnum<["TECHNICAL", "ATHLETIC"]>;
    instructions: z.ZodString;
    videoUrl: z.ZodOptional<z.ZodString>;
    displayOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "TECHNICAL" | "ATHLETIC";
    title: string;
    trainingProgramId: string;
    instructions: string;
    videoUrl?: string | undefined;
    displayOrder?: number | undefined;
}, {
    type: "TECHNICAL" | "ATHLETIC";
    title: string;
    trainingProgramId: string;
    instructions: string;
    videoUrl?: string | undefined;
    displayOrder?: number | undefined;
}>;
export declare const DrillSubmissionSchema: z.ZodObject<{
    drillId: z.ZodString;
    videoUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    videoUrl: string;
    drillId: string;
}, {
    videoUrl: string;
    drillId: string;
}>;
export declare const MetricTypeSchema: z.ZodObject<{
    key: z.ZodString;
    displayName: z.ZodString;
    unit: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    key: string;
    displayName: string;
    description?: string | undefined;
    unit?: string | undefined;
}, {
    key: string;
    displayName: string;
    description?: string | undefined;
    unit?: string | undefined;
}>;
export declare const PlayerStatCreateSchema: z.ZodObject<{
    playerId: z.ZodString;
    metricKey: z.ZodString;
    value: z.ZodNumber;
    recordedAt: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    value: number;
    playerId: string;
    metricKey: string;
    recordedAt?: string | undefined;
    source?: string | undefined;
}, {
    value: number;
    playerId: string;
    metricKey: string;
    recordedAt?: string | undefined;
    source?: string | undefined;
}>;
export declare const PlayerStatsSchema: z.ZodObject<{
    metricKey: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    metricKey?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
}, {
    metricKey?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
}>;
export declare const SearchFiltersSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
} & {
    query: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodString>;
    nationality: z.ZodOptional<z.ZodString>;
    ageMin: z.ZodOptional<z.ZodNumber>;
    ageMax: z.ZodOptional<z.ZodNumber>;
    heightMin: z.ZodOptional<z.ZodNumber>;
    heightMax: z.ZodOptional<z.ZodNumber>;
    speedMin: z.ZodOptional<z.ZodNumber>;
    speedMax: z.ZodOptional<z.ZodNumber>;
    experienceLevel: z.ZodOptional<z.ZodEnum<["AMATEUR", "ACADEMY", "SEMI_PRO", "PRO"]>>;
    currentClub: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    nationality?: string | undefined;
    currentClub?: string | undefined;
    experienceLevel?: "AMATEUR" | "ACADEMY" | "SEMI_PRO" | "PRO" | undefined;
    query?: string | undefined;
    position?: string | undefined;
    ageMin?: number | undefined;
    ageMax?: number | undefined;
    heightMin?: number | undefined;
    heightMax?: number | undefined;
    speedMin?: number | undefined;
    speedMax?: number | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    nationality?: string | undefined;
    currentClub?: string | undefined;
    experienceLevel?: "AMATEUR" | "ACADEMY" | "SEMI_PRO" | "PRO" | undefined;
    query?: string | undefined;
    position?: string | undefined;
    ageMin?: number | undefined;
    ageMax?: number | undefined;
    heightMin?: number | undefined;
    heightMax?: number | undefined;
    speedMin?: number | undefined;
    speedMax?: number | undefined;
}>;
export declare const ScoutShortlistSchema: z.ZodObject<{
    playerId: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    playerId: string;
    notes?: string | undefined;
}, {
    playerId: string;
    notes?: string | undefined;
}>;
export declare const PlayerViewSchema: z.ZodObject<{
    playerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    playerId: string;
}, {
    playerId: string;
}>;
export declare function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T;
export declare function validateDataSafe<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    errors: z.ZodError;
};
