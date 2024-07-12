import axios from 'axios';

const API = 'http://localhost:8000/api';

export const api = axios.create({
	baseURL: API,
	headers: {
		'Content-Type': 'application/json',
	},
});
