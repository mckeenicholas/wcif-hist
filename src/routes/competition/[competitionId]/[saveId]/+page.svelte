<script lang="ts">
	import PersonList from '$lib/components/PersonListView.svelte';
	import ActivityList from '$lib/components/ActivityListView.svelte';
	import JsonViewer from '$lib/components/json/JsonViewer.svelte';
	import type { PageServerData } from './$types';
	import { Tabs } from 'bits-ui';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="container mx-auto p-4 sm:p-6 lg:p-8">
	<div class="mb-6 p-4 text-center text-sm text-gray-800">
		<p class="font-medium">{data.description}</p>
		<p class="mt-1 text-xs text-gray-600">
			Saved by <span class="font-semibold">{data.savedByName}</span> on {new Date(
				data.savedAt
			).toLocaleString()}
		</p>
	</div>

	<Tabs.Root value="people" class="w-full p-2">
		<Tabs.List class="grid w-full grid-cols-3 bg-gray-200 p-1">
			<Tabs.Trigger
				value="people"
				class="px-4 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none data-[state=active]:bg-white data-[state=active]:shadow-sm"
			>
				People
			</Tabs.Trigger>
			<Tabs.Trigger
				value="schedule"
				class="px-4 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none data-[state=active]:bg-white data-[state=active]:shadow-sm"
			>
				Schedule
			</Tabs.Trigger>
			<Tabs.Trigger
				value="json"
				class="px-4 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none data-[state=active]:bg-white data-[state=active]:shadow-sm"
			>
				JSON
			</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="people" class="pt-4 focus-visible:outline-none">
			<PersonList competitors={data.wcif.persons} schedule={data.wcif.schedule} />
		</Tabs.Content>

		<Tabs.Content value="schedule" class="pt-4 focus-visible:outline-none">
			<ActivityList competitors={data.wcif.persons} schedule={data.wcif.schedule} />
		</Tabs.Content>

		<Tabs.Content value="json" class="pt-4 focus-visible:outline-none">
			<JsonViewer data={data.wcif} />
		</Tabs.Content>
	</Tabs.Root>
</div>
