import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Inicio from "./pages/Inicio/Inicio";
import Contato from "./pages/Contato/Contato";
import Servicos from "./pages/Servicos/Servicos";
import Login from "./pages/Login/Login";

import Dashboard from "./pages/Dashboard/Dashboard";
import Overview from "./components/Dashboard/Overview/Overview";
import Mensagens from "./components/Dashboard/Mensagens/Mensagens";
import Pedidos from "./components/Dashboard/Pedidos/Pedidos";
import Publico from "./components/Dashboard/Publico/Publico";
import Usuarios from "./components/Dashboard/Usuarios/Usuarios";
import Configuracoes from "./components/Dashboard/Configuracoes/Configuracoes";

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
	},
	{
		path:"/dashboard",
		element: <Dashboard/>,
		children:[
			{
				path:"/dashboard/inicio",
				element: <Overview/>
			},
			{
				path:"/dashboard/mensagens",
				element: <Mensagens/>
			},
			{
				path:"/dashboard/pedidos",
				element: <Pedidos/>
			},
			{
				path:"/dashboard/publico",
				element: <Publico/>
			},
			{
				path:"/dashboard/usuarios",
				element: <Usuarios/>
			},
			{
				path:"/dashboard/configuracoes",
				element: <Configuracoes/>
			}
		]
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