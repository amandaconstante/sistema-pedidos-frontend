import { useState } from 'react'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './pages/Home'
import CadastroPedido from './pages/CadastroPedido'
import CadastroCliente from './pages/CadastroCliente'

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
      <RouterProvider router={router}/>
    </>
  )
}

export default App
