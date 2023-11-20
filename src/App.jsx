import React from 'react'
import { BrowserRouter ,Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Home from './container/Home'

function App () {
  return (
    <BrowserRouter className="App">
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='/*' element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
