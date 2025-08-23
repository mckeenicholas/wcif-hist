import type { EditableCompetition } from '$lib/types/storedWcif';
import type { Competition } from '$lib/types/wcif';

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
