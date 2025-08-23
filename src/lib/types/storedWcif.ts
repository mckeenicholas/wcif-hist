import type {
	Activity,
	AdvancementCondition,
	Assignment,
	Attempt,
	Avatar,
	Cutoff,
	Extension,
	PersonalBest,
	Qualification,
	Registration,
	RegistrationInfo,
	Result,
	ScrambleSet,
	Series,
	TimeLimit
} from './wcif'; // Assuming your original types are in 'wcif-types.ts'

export type EditableAssignment = Assignment;
export type EditableExtension = Extension;
export type EditableActivity = Activity;

export type EditableAttempt = Attempt;
export type EditablePersonalBest = PersonalBest;
export type EditableRegistration = Registration;
export type EditableRegistrationInfo = RegistrationInfo;
export type EditableAvatar = Avatar;
export type EditableTimeLimit = TimeLimit;
export type EditableCutoff = Cutoff;
export type EditableAdvancementCondition = AdvancementCondition;
export type EditableQualification = Qualification;
export type EditableScrambleSet = ScrambleSet;
export type EditableResult = Result;
export type EditableSeries = Series;

export type EditablePerson = {
	registrantId: number;
	assignments: EditableAssignment[];
	extensions: EditableExtension[];
};

export type EditableRound = {
	extensions: EditableExtension[];
};

export type EditableEvent = {
	rounds: EditableRound[];
	extensions: EditableExtension[];
};

export type EditableRoom = {
	activities: EditableActivity[];
	extensions: EditableExtension[];
};

export type EditableVenue = {
	rooms: EditableRoom[];
	extensions: EditableExtension[];
};

export type EditableSchedule = {
	venues: EditableVenue[];
};

export type EditableCompetition = {
	persons: EditablePerson[];
	events: EditableEvent[];
	schedule: EditableSchedule;
	extensions: EditableExtension[];
};
