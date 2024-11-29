import { create } from "zustand"

export interface Detail {
	language: string
	location: string
	age: number
	genre: string
}

// Define the Store interface
export interface Store {
	defaults: Detail
	setDefaults: (newDefaults: Detail) => void
    loadDefaultsFromLocalStorage: () => void
}

// Create the Zustand store
export const useStore = create<Store>((set) => ({
	defaults: {
		language: "",
		location: "",
		age: 12,
		genre: "Folk Tale",
	},
	setDefaults: (newDefaults: Detail) => {
		set(() => ({
			defaults: newDefaults,
		}))
		localStorage.setItem("Xdefaults", JSON.stringify(newDefaults))
	},
	loadDefaultsFromLocalStorage: () => {
		const storedDefaults = localStorage.getItem("Xdefaults")
        console.log(storedDefaults)
		if (storedDefaults) {
			set(() => ({
				defaults: JSON.parse(storedDefaults),
			}))
		}
	},
}))

// Utility function to check if defaults exist in localStorage
export function isPresentInLocal(): boolean {
	const storedDefaults = localStorage.getItem("Xdefaults")
	return !!storedDefaults
}
