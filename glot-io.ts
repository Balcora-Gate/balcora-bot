import fetch from 'node-fetch';


export const url = `https://snippets.glot.io/snippets`;
export const res_url = `https://glot.io/snippets`;

export type CreateParams = {
	language?: string,
	title: string,
	public?: boolean,
	files: { name: string, content: string }[]
};

export const create = async (params: CreateParams) => {
	return (await fetch(url, {
		method: `POST`,
		body: JSON.stringify(params),
		headers: { 'Content-Type': `application/json` }
	})).json();
};	
