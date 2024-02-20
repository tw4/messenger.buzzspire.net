import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/base.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './Routers'
import { ConfigProvider, theme } from 'antd';



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

<React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00FF8D',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>
)
