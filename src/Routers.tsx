import { createBrowserRouter } from 'react-router-dom'
import { Login, Home, Register, Settings } from './Pages'
import { Messages } from './Pages/Messages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/messages',
    element: <Messages />
  },
  {
    path: '/settings',
    element: <Settings />
  }
])
