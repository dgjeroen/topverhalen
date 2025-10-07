declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	// Dit vertelt TypeScript hoe het om moet gaan met SVG-imports.
	declare module '*.svg' {
		const content: string;
		export default content;
	}
}
export { };