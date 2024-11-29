import { Route, Switch } from "wouter"
import Home from "./Home"
import Content from "./Content"

export default function App() {
	return (
		<div className="flex flex-col justify-stretch items-stretch h-screen w-screen bg">
			{/* 
      Routes below are matched exclusively -
      the first matched route gets rendered
    */}
      <header className="shadow-md px-8 py-8 text-center bg-white/90">
        <h4 className="font-bold text-2xl text-black tracking-tighter">Katha Vriksha</h4>
      </header>
			<main className="p-4 overflow-y-auto h-full bg-gray-100/40">
				<Switch>
					<Route path="/" component={Home} />

					<Route path="/content/:id">{(params) => <Content id={params.id} />}</Route>

					{/* Default route in a switch */}
					<Route>404: No such page!</Route>
				</Switch>
			</main>
		</div>
	)
}
