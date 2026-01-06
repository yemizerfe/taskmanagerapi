import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/home'
import Tasks from './components/Tasks'

function App() {
  return (
    <div className='container-fluid'>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Tasks' element={<Tasks />} />
        </Routes>


      </BrowserRouter>

    </div>
  )
}

export default App
