import { useEffect, useState } from "react"
import { Detail, isPresentInLocal, useStore } from "./defaults"
import { useLocation } from "wouter"

export default function Home() {
	const [showInput, setShowInput] = useState(false)
	const { defaults: details, setDefaults: setDetails, loadDefaultsFromLocalStorage } = useStore()
    const [_, setLocation] = useLocation()

	function handleChange(key: string) {
		return (e: unknown) => {
			setDetails({
				...details,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				[key]: e.target.value,
			})
		}
	}

	function generate() {
        setLocation("/content/1")
    }

	useEffect(() => {
		const presentInLocal = isPresentInLocal()
		setShowInput(!presentInLocal)

		console.log(presentInLocal)

		if (presentInLocal) {
			loadDefaultsFromLocalStorage()
		}
	}, [])

	return (
		<>
			{showInput ? (
				<>
					<div className="py-8 px-6 items-stretch bg-white rounded-lg shadow-md">
						<h4 className="font-bold text-xl tracking-tight">Let us know more about you</h4>
						<p>We'll personalize your stores based on the you give here</p>

						<div className="h-4"></div>

						<label className="text-sm font-bold pl-2">Age</label>
						<input type="number" value={details.age} onChange={handleChange("age")} />

						<div className="h-2"></div>

						<label className="text-sm font-bold pl-2">Language</label>
						<input
							type="text"
							value={details.language}
							onChange={handleChange("language")}
							placeholder="E.g, Kannada, Tamil, English, ..."
						/>

						<div className="h-2"></div>

						<label className="text-sm font-bold pl-2">Location</label>
						<input
							type="text"
							value={details.location}
							onChange={handleChange("location")}
							placeholder=""
						/>

						<div className="h-2"></div>

						<label className="text-sm font-bold pl-2">Genre</label>
						<input type="text" value={details.genre} onChange={handleChange("genre")} placeholder="" />

						<div className="h-4"></div>

						{/* <label className="text-sm"></label> */}
						<button
							className="bg-purple-600 text-white shadow-lg w-full"
							onClick={() => setShowInput(false)}
						>
							Save
						</button>
						<div className="h-2"></div>
						<small className="text-xs">You can change these later.</small>
					</div>
                    <div className="h-6"></div>
				</>
			) : (
				""
			)}

			<h4 className="font-bold text-2xl tracking-tighter">Explore our rich culture</h4>
			<div className="h-2"></div>
			<p>Click "Generate a Story" to read a story from our diverse culture</p>

			<div className="h-6"></div>

			<label className="text-sm font-bold pl-2">Language</label>
			<input type="text" value={details.language} onChange={handleChange("language")} placeholder="" />

			<div className="h-4"></div>

			<label className="text-sm font-bold pl-2">Genre</label>
			<input type="text" value={details.genre} onChange={handleChange("genre")} placeholder="" />

			<div className="h-8"></div>

			<button className="bg-purple-600 text-white shadow-lg w-full" onClick={generate}>
				Generate a Story
			</button>

			<div className="h-6"></div>
			<div className="flex flex-col gap-2">
				{!showInput ? (
					<button className="bg-transparent text-purple-600 bg-gray-100 w-full" onClick={() => setShowInput(true)}>
						Change Defaults
					</button>
				) : (
					""
				)}
			</div>
		</>
	)
}
