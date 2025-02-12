import './App.css'
import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { } from 'react-router';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {

  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <h1>Home</h1>,
      errorElement: <h1>error</h1>
    },

  ])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  )
}

export default App
