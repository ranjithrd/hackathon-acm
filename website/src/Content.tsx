import { useEffect, useState } from "react"
import { Detail, useStore } from "./defaults"
import { Link } from "wouter"

interface PDefinition {
	word: string
	definition: string
}

interface PResponse {
	text: string
	words: PDefinition[]
}

export default function Content({ id }: { id: string }) {
	const [loading, setLoading] = useState(false)
    const [loadedOnce, setLoadedOnce] = useState(false)
	const [error, setError] = useState("")
	const { defaults: details, loadDefaultsFromLocalStorage } = useStore()
	const [data, setData] = useState<PResponse>({
		text: "",
		words: [],
	})
	const [selected, setSelected] = useState("")

	async function loadData(details: Detail) {
        if (loadedOnce) {
            return
        }
        setLoadedOnce(true)
		setLoading(true)

		const formBody = details
		const res = await fetch(`http://localhost:5000/get`, {
			headers: {
				Authorization: "Bearer abcedgf",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formBody),
			method: "POST",
		})
		if (res.ok) {
			const data = (await res.json()) ?? {}
			console.log(data)
			setData(data)
			setLoading(false)
		} else {
			setError(`${res.status}: ${res.statusText}`)
			setLoading(false)
		}

		setLoading(false)
	}

	useEffect(() => {
		loadDefaultsFromLocalStorage()
		console.log(details)
		loadData(details)
	}, [])

	return (
		<>
			{loading ? <p>Loading...</p> : ""}
			{error ? <p>{error}</p> : ""}

			<div className="h-4"></div>

			<p className="text-lg">
				{data.text.replace(/<br>/g, " <br> ").split(" ").map((e) => {
                    if (e == "<br>") {
                        return <><br /><br /></>
                    }
					const d = data.words.find((x) => x.word == e.toLowerCase().replace(".", "").replace(",", ""))
					if (d) {
						return (
							<>
								<button
									onClick={() => {
										if (selected === e) {
											setSelected("")
										} else {
											setSelected(e)
										}
									}}
									className="p-0 m-0 ml-1 text-purple-600 underline"
								>
									{" "}
									{e}{" "}
								</button>
								{selected == e ? <span className="text-purple-800 mx-1">({d.definition})</span> : ""}
							</>
						)
					} else {
						return " " + e
					}
					// return data.words.findIndex(x => x.word == e) > -1 ? <button>{e}</button> :
				})}
			</p>

			<div className="h-4"></div>
			<Link to="/" className="text-black underline w-full text-center">
				Back
			</Link>
		</>
	)
}
