export const applicationID = 'hWfCXvGiBqSkixzEKw7qGynSYmvlhmKB1VpT_UIwBZ4';
export const redirectURI = 'http://localhost:5173/login';

export const authFetch = async (
	url: URL | string,
	token: string,
	options: RequestInit = {}
): Promise<Response> => {
	return fetch(url.toString(), {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			...options.headers
		}
	});
};

export const formatDate = (date: Date | string): string => {
	const dateObj = date instanceof Date ? date : new Date(date);

	return dateObj.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
};

export const formatDateTime = (date: Date | string): string => {
	const dateObj = date instanceof Date ? date : new Date(date);

	return dateObj.toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	});
};

export const formatTime = (date: Date | string): string => {
	const dateObj = date instanceof Date ? date : new Date(date);

	return dateObj.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	});
};

export const capitalizeString = (str: string): string => {
	return str
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};
