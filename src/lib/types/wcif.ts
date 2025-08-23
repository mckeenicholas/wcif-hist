// Primitives and utility types

/** A string representing the date in YYYY-MM-DD format. */
export type Date = string;

/** A string representing a date and time according to ISO 8601. */
export type DateTime = string;

/** A string representing the ISO 3166-1 alpha-2 code of a country. */
export type CountryCode = string;

/** A string representing the ISO 4217 code of a currency. */
export type CurrencyCode = string;

/** A string representing a role at the competition. */
export type Role = 'delegate' | 'trainee-delegate' | 'organizer' | string;

/** A number of competitors. */
export type Ranking = number;

/** A number between 0 and 100 representing a percent of competitors. */
export type Percent = number;

/** An integer representing a competitor result in a single attempt. */
export type AttemptResult = number;

/** A string identifying an activity. */
export type ActivityCode = string;

/** A string representing a single scramble. */
export type Scramble = string;

export type RegistrationStatus = 'accepted' | 'pending' | 'deleted';

// Object interfaces

/** Represents a person related to the competition. */
export interface Person {
	registrantId: number;
	name: string;
	wcaUserId: number | null;
	wcaId: string | null;
	countryIso2: CountryCode;
	gender: 'm' | 'f' | 'o';
	birthdate: Date;
	email: string;
	avatar: Avatar | null;
	roles: Role[];
	registration: Registration | null;
	assignments: Assignment[];
	personalBests: PersonalBest[];
	extensions: Extension[];
}

/** Represents an avatar image. */
export interface Avatar {
	url: string;
	thumbUrl: string;
}

/** Represents person registration data. */
export interface Registration {
	wcaRegistrationId: number;
	eventIds: string[];
	status: RegistrationStatus;
	guests: number;
	comments: string;
	administrativeNotes: string;
	isCompeting: boolean;
}

/** Represents a task assignment. */
export interface Assignment {
	activityId: number;
	assignmentCode: AssignmentCode;
	stationNumber: number | null;
}

/** A string representing type of a task that may be assigned. */
export type AssignmentCode =
	| 'competitor'
	| 'staff-judge'
	| 'staff-scrambler'
	| 'staff-runner'
	| 'staff-dataentry'
	| 'staff-announcer'
	| string;

/** Represents an official personal record. */
export interface PersonalBest {
	eventId: string;
	best: AttemptResult;
	type: 'single' | 'average';
	worldRanking: number;
	continentalRanking: number;
	nationalRanking: number;
}

/** Represents data of an event held at the competition. */
export interface Event {
	id: string;
	rounds: Round[];
	competitorLimit: number | null;
	qualification: Qualification | null;
	extensions: Extension[];
}

/** Represents data of a round held at the competition. */
export interface Round {
	id: string;
	format: '1' | '2' | '3' | 'a' | 'm';
	timeLimit: TimeLimit | null;
	cutoff: Cutoff | null;
	advancementCondition: AdvancementCondition | null;
	results: Result[];
	scrambleSetCount: number;
	scrambleSets: ScrambleSet[];
	extensions: Extension[];
}

/** Represents a time limit. */
export interface TimeLimit {
	centiseconds: number;
	cumulativeRoundIds: string[];
}

/** Represents an attempt cutoff. */
export interface Cutoff {
	numberOfAttempts: number;
	attemptResult: AttemptResult;
}

/** Represents a requirement to advance to the next round. */
export interface AdvancementCondition {
	type: 'ranking' | 'percent' | 'attemptResult';
	level: Ranking | Percent | AttemptResult;
}

/** Represents a qualification requirement to register for an event. */
export interface Qualification {
	whenDate: Date;
	type: 'attemptResult' | 'ranking' | 'anyResult';
	resultType: 'single' | 'average';
	level: AttemptResult | Ranking | null;
}

/** Represents a competitor result in a single round. */
export interface Result {
	personId: number;
	ranking: number | null;
	attempts: Attempt[];
	best: AttemptResult;
	average: AttemptResult;
}

/** Represents one of a competitor's attempts. */
export interface Attempt {
	result: AttemptResult;
	reconstruction: string | null;
}

/** Represents a set of scrambles. */
export interface ScrambleSet {
	id: number;
	scrambles: Scramble[];
	extraScrambles: Scramble[];
}

/** Represents competition data related to time and scheduling. */
export interface Schedule {
	startDate: Date;
	numberOfDays: number;
	venues: Venue[];
}

/** Represents a physical location where the competition takes place. */
export interface Venue {
	id: number;
	name: string;
	latitudeMicrodegrees: number;
	longitudeMicrodegrees: number;
	countryIso2: CountryCode;
	timezone: string;
	rooms: Room[];
	extensions: Extension[];
}

/** Represents a specific room at a venue. */
export interface Room {
	id: number;
	name: string;
	color: string;
	activities: Activity[];
	extensions: Extension[];
}

/** Represents an activity taking place in a room. */
export interface Activity {
	id: number;
	name: string;
	activityCode: ActivityCode;
	startTime: DateTime;
	endTime: DateTime;
	childActivities: Activity[];
	scrambleSetId: number | null;
	extensions: Extension[];
}

/** Represents custom data. */
export interface Extension {
	id: string;
	specUrl: string;
	data: Record<string, unknown>;
}

/** Represents information related to registration. */
export interface RegistrationInfo {
	openTime: DateTime;
	closeTime: DateTime;
	baseEntryFee: number;
	currencyCode: CurrencyCode;
	onTheSpotRegistration: boolean;
	useWcaRegistration: boolean;
}

/** Represents a Competition Series. */
export interface Series {
	id: string;
	name: string;
	shortName: string;
	competitionIds: string[];
}

/**
 * Represents the root object and is usually referred to as a WCIF.
 */
export interface Competition {
	formatVersion: '1.0';
	id: string;
	name: string;
	shortName: string;
	series: Series | null;
	persons: Person[];
	events: Event[];
	schedule: Schedule;
	registrationInfo: RegistrationInfo;
	competitorLimit: number | null;
	extensions: Extension[];
}
