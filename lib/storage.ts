import { Row } from "@/interfaces";

const STORAGE_KEY = "organogram-data";

export function saveToLocalStorage(rows: Row[]): void {
	try {
		const serializedData = JSON.stringify(rows);
		localStorage.setItem(STORAGE_KEY, serializedData);
	} catch (error) {
		console.error("Failed to save data to localStorage:", error);
	}
}

export function loadFromLocalStorage(): Row[] | null {
	try {
		const serializedData = localStorage.getItem(STORAGE_KEY);
		if (!serializedData) return null;
		return JSON.parse(serializedData) as Row[];
	} catch (error) {
		console.error("Failed to load data from localStorage:", error);
		return null;
	}
}

export function clearLocalStorage(): void {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error("Failed to clear data from localStorage:", error);
	}
}

export function isLocalStorageAvailable(): boolean {
	try {
		const testKey = "__test__";
		localStorage.setItem(testKey, testKey);
		localStorage.removeItem(testKey);
		return true;
	} catch (e) {
		console.error("Local storage is not available:", e);
		return false;
	}
}
