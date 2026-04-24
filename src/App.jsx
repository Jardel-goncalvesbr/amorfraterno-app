import React, { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Oracoes from './pages/Oracoes'
import { Eventos, Agenda, Membros } from './pages/Pages'
import { useDB } from './hooks/useDB'

export default function App() {
  const [toast, setToast] = useState({ message:'', visible:false })
  const { db, loading, addIntencao, votarIntencao } = useDB()

  const onToast = useCallback((msg) => {
    setToast({ message:msg, visible:true })
    setTimeout(() => setToast(t => ({ ...t, visible:false })), 2200)
  }, [])

  const shared = { db, loading, onToast }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout toast={toast} avisos={db.avisos.length}/>}>
          <Route index          element={<Home    {...shared}/>}/>
          <Route path="oracoes" element={<Oracoes {...shared} addIntencao={addIntencao} votarIntencao={votarIntencao}/>}/>
          <Route path="eventos" element={<Eventos {...shared}/>}/>
          <Route path="agenda"  element={<Agenda  {...shared}/>}/>
          <Route path="membros" element={<Membros {...shared}/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
