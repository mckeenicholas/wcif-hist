<script lang="ts">
	import type { FlattenedActivity } from '$lib/types';
	import type { Schedule, Person, Assignment } from '$lib/types/wcif';
	import { formatTime } from '$lib/util';
	import {
		flattenScheduleActivities,
		formatAssignmentCode,
		formatRegistrationStatus
	} from '$lib/wcifUtils';
	import { Accordion } from 'bits-ui';
	import { SvelteMap } from 'svelte/reactivity';

	interface Props {
		schedule: Schedule;
		competitors: Person[];
	}

	const organizerRoles = ['delegate', 'trainee-delegate', 'organizer'];
	const { schedule, competitors }: Props = $props();

	let searchTerm = $state('');

	const scheduleMap = $derived.by(() => {
		const map = new SvelteMap<number, FlattenedActivity>();
		const scheduleFlat = flattenScheduleActivities(schedule);
		scheduleFlat.forEach((activity) => {
			map.set(activity.id, activity);
		});
		return map;
	});

	const competitorsOrdered = $derived.by(() => {
		const trimmedSearch = searchTerm.trim().toLowerCase();

		const filteredCompetitors = trimmedSearch.length
			? competitors.filter(
					(competitor) =>
						competitor.name.toLowerCase().includes(trimmedSearch) ||
						(competitor.wcaId && competitor.wcaId.toLowerCase().includes(trimmedSearch))
				)
			: competitors;

		const staffCompetitors = filteredCompetitors
			.filter((competitor) => competitor.roles.some((role) => organizerRoles.includes(role)))
			.sort((a, b) => a.name.localeCompare(b.name));

		const nonStaffCompetitors = filteredCompetitors
			.filter((competitor) => competitor.roles.every((role) => !organizerRoles.includes(role)))
			.sort((a, b) => a.name.localeCompare(b.name));

		return [...staffCompetitors, ...nonStaffCompetitors];
	});

	const orderAssignments = (assignments: Assignment[]) => {
		return assignments.sort((a, b) => {
			const startTimeA = scheduleMap.get(a.activityId)?.startTime ?? '';
			const startTimeB = scheduleMap.get(b.activityId)?.startTime ?? '';
			return new Date(startTimeA).getTime() - new Date(startTimeB).getTime();
		});
	};
</script>

<div class="font-sans">
	<div class="mb-6">
		<label for="competitorsearch" class="mb-1 block text-sm font-medium text-gray-700"
			>Search competitors</label
		>
		<input
			id="competitorsearch"
			type="text"
			placeholder="Search by name or WCA ID..."
			class="w-full border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
			bind:value={searchTerm}
		/>
	</div>

	<Accordion.Root type="multiple" class="space-y-1">
		{#each competitorsOrdered as competitor (competitor.wcaUserId)}
			<Accordion.Item class="overflow-hidden border border-gray-200">
				<Accordion.Header class="flex">
					<Accordion.Trigger
						class="flex-1 cursor-pointer bg-gray-50 px-4 py-2 text-left text-lg font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100"
					>
						<span class="block">{competitor.name} - {competitor.wcaId ?? 'No WCA ID'}</span>
						<span class="text-sm font-medium"> Registration status: </span>
						<span
							class="text-sm font-medium"
							class:text-green-600={competitor.registration?.status === 'accepted'}
							class:text-yellow-600={competitor.registration?.status === 'pending'}
							class:text-red-600={competitor.registration?.status === 'deleted'}
						>
							{formatRegistrationStatus(competitor.registration?.status)}
						</span>
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Content class="border-t border-gray-200 bg-white p-4 text-base text-gray-800">
					<ul class="list-inside list-disc space-y-2">
						{#each orderAssignments(competitor.assignments) as assignment (assignment.activityId)}
							{@const activity = scheduleMap.get(assignment.activityId)}
							{#if activity}
								<li class="flex items-start">
									<span
										class="mt-1.5 mr-2 h-2 w-2 rounded-md"
										style="background-color: {activity.roomColor || '#6B7280'};"
									></span>
									<div>
										<span class="font-semibold">{activity.name}</span> -
										<span class="text-gray-600"
											>{formatAssignmentCode(assignment.assignmentCode)}</span
										>
										{#if assignment.stationNumber}
											<span class="text-gray-600"> - Station {assignment.stationNumber}</span>
										{/if}
										<div>
											<span class="text-sm text-gray-500 italic">{activity.roomName}</span>
											<span class="text-sm text-gray-500">
												{formatTime(activity.startTime)}
												-
												{formatTime(activity.endTime)}
											</span>
										</div>
									</div>
								</li>
							{:else}
								<li>Activity details not found.</li>
							{/if}
						{:else}
							<li class="text-gray-500 italic">No assignments created for this competitor.</li>
						{/each}
					</ul>
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
</div>
