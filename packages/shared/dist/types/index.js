"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationStatus = exports.DrillSubmissionStatus = exports.DrillType = exports.MediaStatus = exports.MediaType = exports.PreferredFoot = exports.ExperienceLevel = exports.Position = exports.ProfessionalFocus = exports.PlayingStatus = exports.RegistrationStatus = exports.UserType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["PLAYER"] = "PLAYER";
    UserRole["SCOUT"] = "SCOUT";
})(UserRole || (exports.UserType = exports.UserRole = UserRole = {}));
var RegistrationStatus;
(function (RegistrationStatus) {
    RegistrationStatus["INCOMPLETE"] = "INCOMPLETE";
    RegistrationStatus["JOURNEY_COMPLETED"] = "JOURNEY_COMPLETED";
    RegistrationStatus["COMPLETE"] = "COMPLETE";
})(RegistrationStatus || (exports.RegistrationStatus = RegistrationStatus = {}));
var PlayingStatus;
(function (PlayingStatus) {
    PlayingStatus["PLAYING"] = "PLAYING";
    PlayingStatus["PROFESSIONAL"] = "PROFESSIONAL";
})(PlayingStatus || (exports.PlayingStatus = PlayingStatus = {}));
var ProfessionalFocus;
(function (ProfessionalFocus) {
    ProfessionalFocus["PLAYER_DEVELOPMENT"] = "PLAYER_DEVELOPMENT";
    ProfessionalFocus["TEAM_OPERATIONS"] = "TEAM_OPERATIONS";
    ProfessionalFocus["TALENT_DISCOVERY"] = "TALENT_DISCOVERY";
    ProfessionalFocus["CLUB_MANAGEMENT"] = "CLUB_MANAGEMENT";
})(ProfessionalFocus || (exports.ProfessionalFocus = ProfessionalFocus = {}));
var Position;
(function (Position) {
    Position["GOALKEEPER"] = "GOALKEEPER";
    Position["CENTER_BACK"] = "CENTER_BACK";
    Position["LEFT_BACK"] = "LEFT_BACK";
    Position["RIGHT_BACK"] = "RIGHT_BACK";
    Position["DEFENSIVE_MIDFIELDER"] = "DEFENSIVE_MIDFIELDER";
    Position["CENTRAL_MIDFIELDER"] = "CENTRAL_MIDFIELDER";
    Position["ATTACKING_MIDFIELDER"] = "ATTACKING_MIDFIELDER";
    Position["LEFT_WINGER"] = "LEFT_WINGER";
    Position["RIGHT_WINGER"] = "RIGHT_WINGER";
    Position["STRIKER"] = "STRIKER";
})(Position || (exports.Position = Position = {}));
var ExperienceLevel;
(function (ExperienceLevel) {
    ExperienceLevel["AMATEUR"] = "AMATEUR";
    ExperienceLevel["ACADEMY"] = "ACADEMY";
    ExperienceLevel["SEMI_PRO"] = "SEMI_PRO";
    ExperienceLevel["PRO"] = "PRO";
})(ExperienceLevel || (exports.ExperienceLevel = ExperienceLevel = {}));
var PreferredFoot;
(function (PreferredFoot) {
    PreferredFoot["LEFT"] = "LEFT";
    PreferredFoot["RIGHT"] = "RIGHT";
    PreferredFoot["BOTH"] = "BOTH";
})(PreferredFoot || (exports.PreferredFoot = PreferredFoot = {}));
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "IMAGE";
    MediaType["VIDEO"] = "VIDEO";
})(MediaType || (exports.MediaType = MediaType = {}));
var MediaStatus;
(function (MediaStatus) {
    MediaStatus["PENDING"] = "PENDING";
    MediaStatus["READY"] = "READY";
    MediaStatus["FAILED"] = "FAILED";
})(MediaStatus || (exports.MediaStatus = MediaStatus = {}));
var DrillType;
(function (DrillType) {
    DrillType["TECHNICAL"] = "TECHNICAL";
    DrillType["ATHLETIC"] = "ATHLETIC";
})(DrillType || (exports.DrillType = DrillType = {}));
var DrillSubmissionStatus;
(function (DrillSubmissionStatus) {
    DrillSubmissionStatus["PENDING"] = "PENDING";
    DrillSubmissionStatus["VERIFIED"] = "VERIFIED";
})(DrillSubmissionStatus || (exports.DrillSubmissionStatus = DrillSubmissionStatus = {}));
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["UNVERIFIED"] = "UNVERIFIED";
    VerificationStatus["IDENTITY_VERIFIED"] = "IDENTITY_VERIFIED";
    VerificationStatus["COACH_VERIFIED"] = "COACH_VERIFIED";
    VerificationStatus["FULLY_VERIFIED"] = "FULLY_VERIFIED";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
