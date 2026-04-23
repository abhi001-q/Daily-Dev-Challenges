import React from 'react'
import Navbar from './Navbar'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main className="app-content">
        <h1 className="h-50 w-50 text-red-500 bg-blue-400 flex items-center justify-center">
          Hello World!
        </h1>
      </main>
    </>
  )
}

export default App
