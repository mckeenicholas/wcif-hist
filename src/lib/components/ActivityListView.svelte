<script lang="ts">
	import type { Person, Schedule } from '$lib/types/wcif';
	import { formatTime } from '$lib/util';
	import { formatAssignmentCode, getAssignmentCodeOrder } from '$lib/wcifUtils';
	import { Accordion } from 'bits-ui';
	import { SvelteMap } from 'svelte/reactivity';

	interface Props {
		schedule: Schedule;
		competitors: Person[];
	}

	const { schedule, competitors }: Props = $props();

	const flattenSchedule = (schedule: Schedule) => {
		const scheduleFlat = schedule.venues.flatMap((venue) => {
			return venue.rooms.flatMap((room) =>
				room.activities.map((activity) => ({
					...activity,
					roomColor: room.color,
					roomName: room.name
				}))
			);
		});

		return scheduleFlat.sort(
			(a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
		);
	};

	const flatSchedule = $derived(flattenSchedule(schedule));

	const activityPersons = $derived.by(() => {
		let map = new SvelteMap<number, Person[]>();

		competitors.forEach((competitor) => {
			competitor.assignments.forEach((assignment) => {
				if (!map.has(assignment.activityId)) {
					map.set(assignment.activityId, []);
				}

				map.get(assignment.activityId)!.push(competitor);
			});
		});

		return map;
	});

	const formatCompetitors = (competitors: Person[], activityId: number) => {
		let map = new SvelteMap<string, Person[]>();

		competitors.forEach((competitor) => {
			const assignment = competitor.assignments.find(
				(assignment) => assignment.activityId == activityId
			);

			if (assignment) {
				if (!map.has(assignment.assignmentCode)) {
					map.set(assignment.assignmentCode, []);
				}

				map.get(assignment.assignmentCode)!.push(competitor);
			}
		});

		const groupedRoles = Array.from(map);
		return groupedRoles.sort((a, b) => {
			const orderA = getAssignmentCodeOrder(a[0]);
			const orderB = getAssignmentCodeOrder(b[0]);

			if (orderA === orderB) {
				return a[0].localeCompare(b[0]);
			}

			return orderA - orderB;
		});
	};
</script>

<div class=" font-sans">
	<Accordion.Root type="multiple" class="space-y-1">
		{#each flatSchedule as activity (activity.id)}
			<Accordion.Item class="overflow-hidden border border-gray-200">
				<Accordion.Header class="flex">
					<Accordion.Trigger
						class="flex-1 cursor-pointer bg-gray-50 px-4 py-2 text-left text-lg font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100"
					>
						<div class="flex items-center">
							<span
								class="mr-2 h-3 w-3 rounded-md"
								style="background-color: {activity.roomColor || '#6B7280'};"
							></span>
							<span class="block">{activity.name}</span>
						</div>
						<div class="text-sm font-normal text-gray-600">
							{activity.roomName} • {formatTime(activity.startTime)} -
							{formatTime(activity.endTime)}
						</div>
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Content class="border-t border-gray-200 bg-white p-4 text-gray-800">
					{#if activity.childActivities.length > 0}
						<Accordion.Root type="multiple" class="space-y-1">
							{#each activity.childActivities as childActivity (childActivity.activityCode)}
								<Accordion.Item class="border border-gray-200 ">
									<Accordion.Header>
										<Accordion.Trigger
											class="flex w-full bg-white px-4 py-2 text-left font-medium text-gray-700 hover:bg-gray-50"
										>
											<div class="flex items-center">
												<span class="block">{childActivity.name}</span>
											</div>
										</Accordion.Trigger>
									</Accordion.Header>
									<Accordion.Content
										class="border-t border-gray-200 bg-white px-4 py-2 text-gray-800"
									>
										{@const allPersons = activityPersons.get(childActivity.id)}
										{#if allPersons && allPersons.length > 0}
											{#each formatCompetitors(allPersons, childActivity.id) as [activityCode, persons] (activityCode)}
												<div class="mt-2 border-b border-gray-300 pb-1 font-semibold text-gray-700">
													{formatAssignmentCode(activityCode)}
												</div>
												<ul class="list-inside list-disc space-y-2 py-2">
													{#each persons as person, idx (idx)}
														<li>{person.name}</li>
													{/each}
												</ul>
											{/each}
										{:else}
											<p class="text-gray-500 italic">
												No competitors assigned to this activity yet.
											</p>
										{/if}
									</Accordion.Content>
								</Accordion.Item>
							{/each}
						</Accordion.Root>
					{:else}
						<p class="text-gray-500 italic">No competitors assigned to this activity.</p>
					{/if}
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
</div>
