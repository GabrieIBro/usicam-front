import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Inicio from "./pages/Inicio/Inicio";
import Contato from "./pages/Contato/Contato";
import Servicos from "./pages/Servicos/Servicos";
import Login from "./pages/Login/Login";

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
	},
	{
		path:"/login",
		element: <Login/>
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