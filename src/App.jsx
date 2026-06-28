import { useState } from 'react'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './componentes/Home'
import CadastroPedido from './componentes/CadastroPedido'
import CadastroCliente from './componentes/CadastroCliente'

const router = createBrowserRouter ([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/pedido",
    element: <CadastroPedido />
  },
  {
    path: "/cliente",
    element: <CadastroCliente />
  }
])

function App() {

  return (
    <>
      {/* <h1>Sistema de Pedidos</h1> */}
      <RouterProvider router={router}/>
    </>
  )
}

export default App
