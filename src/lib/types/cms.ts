// src/lib/types/cms.ts

export interface User {
	email: string;
	name: string;
	expiresAt: number;
}

export interface MagicLinkToken {
	email: string;
	expiresAt: number;
}

export interface VercelProject {
	id: string;
	name: string;
	framework: string;
}

export interface VercelDeployment {
	id: string;
	url: string;
	readyState: 'READY' | 'ERROR' | 'BUILDING' | 'QUEUED';
}

export interface GistFile {
	filename: string;
	content: string;
}

export interface CreateGistRequest {
	description: string;
	public: boolean;
	files: Record<string, GistFile>;
}
