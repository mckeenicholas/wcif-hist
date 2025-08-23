import type { Activity } from './types/wcif';

export interface Avatar {
	id: number | null;
	status: string;
	thumbnail_crop_x: number;
	thumbnail_crop_y: number;
	thumbnail_crop_w: number;
	thumbnail_crop_h: number;
	url: string;
	thumb_url: string;
	is_default: boolean;
	can_edit_thumbnail: boolean;
}

export interface Country {
	id: string;
	name: string;
	continent_id: string;
	iso2: string;
}

export interface Team {
	id: number;
	friendly_id: string;
	leader: boolean;
	senior_member: boolean;
	name: string;
	wca_id: string;
	avatar: Avatar;
}

export interface User {
	id: number;
	created_at: string;
	updated_at: string;
	name: string;
	wca_id: string | null;
	gender: string;
	country_iso2: string;
	url: string;
	country: Country;
	location?: string;
	region_id?: number;
	delegate_status?: string | null;
	email?: string;
	class: 'user';
	teams: Team[];
	avatar: Avatar;
}

export interface Competition {
	id: string;
	name: string;
	venue: string;
	registration_open: string;
	registration_close: string;
	results_posted_at: string | null;
	announced_at: string;
	start_date: string;
	end_date: string;
	competitor_limit: number;
	cancelled_at: string | null;
	url: string;
	website: string;
	short_name: string;
	short_display_name: string;
	city: string;
	venue_address: string;
	venue_details: string;
	latitude_degrees: number;
	longitude_degrees: number;
	country_iso2: string;
	event_ids: string[];
	time_until_registration: string;
	date_range: string;
	delegates: User[];
	organizers: User[];
	class: 'competition';
}

export interface UpcomingCompetitionsResponse {
	user: User;
	upcoming_competitions: Competition[];
}

export interface WCAUserResponseInfo {
	me: {
		name: string;
		id: number;
		wca_id: string;
	};
}

export interface FlattenedActivity extends Activity {
	roomName?: string;
	roomColor?: string;
}
