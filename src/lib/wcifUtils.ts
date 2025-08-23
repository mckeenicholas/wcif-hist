import type { EditableCompetition } from '$lib/types/storedWcif';
import type {
	Activity,
	AssignmentCode,
	Competition,
	RegistrationStatus,
	Role,
	Schedule
} from '$lib/types/wcif';
import type { FlattenedActivity } from './types';
import { capitalizeString } from './util';

export const stripWCIF = (base: Competition): EditableCompetition => {
	const editableCompetition: EditableCompetition = {
		persons: base.persons.map((person) => ({
			registrantId: person.registrantId,
			assignments: person.assignments.map((assignment) => ({ ...assignment })),
			extensions: person.extensions.map((extension) => ({ ...extension }))
		})),
		events: base.events.map((event) => ({
			rounds: event.rounds.map((round) => ({
				extensions: round.extensions.map((extension) => ({ ...extension }))
			})),
			extensions: event.extensions.map((extension) => ({ ...extension }))
		})),
		schedule: {
			venues: base.schedule.venues.map((venue) => ({
				rooms: venue.rooms.map((room) => ({
					activities: room.activities.map((activity) => ({
						...activity,
						childActivities: activity.childActivities.map((childActivity) => ({
							...childActivity
						})),
						extensions: activity.extensions.map((extension) => ({
							...extension
						}))
					})),
					extensions: room.extensions.map((extension) => ({ ...extension }))
				})),
				extensions: venue.extensions.map((extension) => ({ ...extension }))
			}))
		},
		extensions: base.extensions.map((extension) => ({ ...extension }))
	};

	return editableCompetition;
};

const flattenActivities = (
	activities: Activity[],
	roomName?: string,
	roomColor?: string
): FlattenedActivity[] => {
	return activities.flatMap((activity) => {
		const activityWithRoomDetails = {
			...activity,
			childActivities: [],
			...(roomName && { roomName }),
			...(roomColor && { roomColor })
		};

		const flattenedChildren =
			activity.childActivities && activity.childActivities.length > 0
				? flattenActivities(activity.childActivities, roomName, roomColor)
				: [];

		return [activityWithRoomDetails, ...flattenedChildren];
	});
};

export const flattenScheduleActivities = (schedule: Schedule) => {
	return schedule.venues.flatMap((venue) =>
		venue.rooms.flatMap((room) => flattenActivities(room.activities, room.name, room.color))
	);
};

export const formatRole = (role: Role): string => {
	switch (role) {
		case 'delegate':
			return 'Delegate';
		case 'trainee-delegate':
			return 'Trainee Delegate';
		case 'organizer':
			return 'Organizer';
		default:
			return capitalizeString(role);
	}
};

export const formatRegistrationStatus = (status: RegistrationStatus | undefined): string => {
	switch (status) {
		case undefined:
			return 'Not Competing';
		case 'accepted':
			return 'Accepted';
		case 'pending':
			return 'Pending';
		case 'deleted':
			return 'Deleted';
		default:
			return status;
	}
};

export const formatAssignmentCode = (code: AssignmentCode): string => {
	switch (code) {
		case 'competitor':
			return 'Competitor';
		case 'staff-judge':
			return 'Staff - Judge';
		case 'staff-scrambler':
			return 'Staff - Scrambler';
		case 'staff-runner':
			return 'Staff - Runner';
		case 'staff-dataentry':
			return 'Staff - Data Entry';
		case 'staff-announcer':
			return 'Staff - Announcer';
		default:
			return capitalizeString(code);
	}
};
