import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Inicio from "./pages/Inicio/Inicio";
import Contato from "./pages/Contato/Contato";
import Servicos from "./pages/Servicos/Servicos";

const router = createBrowserRouter([
	{
		path:"/",
		element: <Inicio/>
	},
	{
		path:"/servicos",
		element: <Servicos/>
	},
	{
		path:"/contato",
		element: <Contato/>
	}
])

function App() {
	return(
		<React.StrictMode>
			<RouterProvider router={router}/>
		</React.StrictMode>
	)
}

export default App;