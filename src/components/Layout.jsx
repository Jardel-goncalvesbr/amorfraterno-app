import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Home, HandHeart, Calendar, CalendarDays, Users, Bell } from 'lucide-react'

const NAV = [
  { to:'/',        label:'Início',     Icon:Home         },
  { to:'/oracoes', label:'Orações',    Icon:HandHeart    },
  { to:'/eventos', label:'Eventos',    Icon:Calendar     },
  { to:'/agenda',  label:'Agenda',     Icon:CalendarDays },
  { to:'/membros', label:'Comunidade', Icon:Users        },
]
const TITLES = { '/':'Início', '/oracoes':'Orações', '/eventos':'Eventos', '/agenda':'Agenda', '/membros':'Comunidade' }

export default function Layout({ toast, avisos = 0 }) {
  const [time, setTime] = useState(new Date())
  const location = useLocation()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const timeStr   = time.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })
  const pageTitle = TITLES[location.pathname] || 'AmorFraterno'

  return (
    <div className="app-shell">

      {/* Sidebar desktop */}
      <aside className="sidebar">
        <div style={{ padding:'28px 20px 18px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
            <div style={{ width:42,height:42,borderRadius:'50%',background:'rgba(201,168,76,0.13)',border:'1.5px solid var(--gold)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,color:'var(--gold)',flexShrink:0 }}>✝</div>
            <div>
              <div style={{ fontFamily:'var(--font-display)',fontSize:17,color:'var(--gold-pale)',fontWeight:600,lineHeight:1.1 }}>AmorFraterno</div>
              <div style={{ fontSize:10,color:'var(--gold)',opacity:0.65,marginTop:2 }}>Comunidade Católica</div>
            </div>
          </div>
          <div style={{ fontSize:10,color:'rgba(245,230,192,0.3)',marginTop:6,lineHeight:1.6 }}>Comunidade Católica<br/>Amor Fraterno — Itapira, SP</div>
        </div>

        <div style={{ padding:'10px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display:'flex',alignItems:'center',gap:6 }}>
            <div style={{ width:7,height:7,borderRadius:'50%',background:'#9B59B6',flexShrink:0 }}/>
            <span style={{ fontSize:10,color:'rgba(245,230,192,0.4)' }}>Tempo Comum • Sem. IV</span>
          </div>
          <div style={{ fontSize:11,color:'rgba(245,230,192,0.25)',marginTop:3 }}>{timeStr}</div>
        </div>

        <nav style={{ flex:1, padding:'12px 10px' }}>
          {NAV.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} end={to==='/'} className={({ isActive }) => `snav-item${isActive?' active':''}`}>
              <Icon size={16}/>{label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize:10,color:'rgba(245,230,192,0.18)',lineHeight:1.7 }}>© 2026 AmorFraterno<br/>Desenvolvido com React</div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header style={{ background:'var(--white)',borderBottom:'1px solid var(--border)',padding:'13px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:10,boxShadow:'var(--shadow-sm)' }}>
          <div style={{ fontFamily:'var(--font-display)',fontSize:18,fontWeight:600,color:'var(--deep3)' }}>{pageTitle}</div>
          {avisos > 0 && (
            <div style={{ background:'var(--deep)',color:'var(--gold-pale)',fontSize:11,padding:'6px 14px',borderRadius:20,display:'flex',alignItems:'center',gap:5 }}>
              <Bell size={11}/>{avisos} {avisos===1?'aviso':'avisos'}
            </div>
          )}
        </header>

        <div className="page-scroll">
          <Outlet/>
        </div>
      </main>

      {/* Bottom nav mobile */}
      <nav className="bottom-nav">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} end={to==='/'} className={({ isActive }) => `bnav-item${isActive?' active':''}`}>
            <Icon size={22}/><span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Toast */}
      <div className={`toast${toast.visible?'':' hidden'}`}>{toast.message}</div>
    </div>
  )
}
