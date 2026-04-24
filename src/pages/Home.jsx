import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, Calendar, HandHeart, ChevronRight, Bell } from 'lucide-react'
import { Card, Badge, SectionTitle, Spinner } from '../components/UI'

export default function Home({ db, loading, onToast }) {
  const navigate = useNavigate()
  const today    = new Date().toISOString().split('T')[0]
  const proximos = db.eventos.filter(e => e.data >= today).slice(0, 3)
  const oracaoDia = db.oracoes[new Date().getDate() % (db.oracoes.length || 1)]
  const ativos   = db.membros.filter(m => m.ativo).length

  if (loading) return <Spinner/>

  return (
    <div>
      {/* Hero */}
      <div className="card-hero fade-up" style={{ padding:'28px 24px 24px', marginBottom:16 }}>
        <div style={{ fontSize:11,color:'var(--gold)',textTransform:'uppercase',letterSpacing:'0.14em',marginBottom:6,fontFamily:'var(--font-display)' }}>Bem-vindo à</div>
        <h1 style={{ fontFamily:'var(--font-display)',fontSize:32,color:'var(--gold-pale)',fontWeight:600,lineHeight:1.1,marginBottom:4 }}>AmorFraterno</h1>
        <div style={{ fontFamily:'var(--font-display)',fontSize:14,color:'var(--gold)',fontStyle:'italic',marginBottom:10 }}>Comunidade Católica Amor Fraterno</div>
        <p style={{ fontSize:13,color:'rgba(245,230,192,0.55)',lineHeight:1.7,marginBottom:20,maxWidth:300 }}>Unidos na fé, na esperança e na caridade. Itapira, SP.</p>
        <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
          <button className="btn btn-gold btn-sm" onClick={() => navigate('/eventos')}>Ver eventos</button>
          <button className="btn btn-sm" onClick={() => navigate('/oracoes')} style={{ color:'var(--gold-pale)',borderColor:'rgba(245,230,192,0.2)',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(245,230,192,0.2)' }}>Orações</button>
        </div>
      </div>

      {/* Stats */}
      <div className="fade-up-1" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:4 }}>
        {[
          { Icon:Users,     num:ativos,              label:'Membros',   path:'/membros'  },
          { Icon:Calendar,  num:db.eventos.length,   label:'Eventos',   path:'/eventos'  },
          { Icon:HandHeart, num:db.intencoes.length, label:'Intenções', path:'/oracoes'  },
        ].map(({ Icon,num,label,path }) => (
          <div key={label} className="stat-pill" onClick={() => navigate(path)} style={{ cursor:'pointer' }}>
            <div style={{ color:'var(--purple)',marginBottom:5,display:'flex',justifyContent:'center' }}><Icon size={17}/></div>
            <div style={{ fontSize:24,fontWeight:600,color:'var(--deep3)',lineHeight:1 }}>{num}</div>
            <div style={{ fontSize:11,color:'var(--text-muted)',marginTop:3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Próximos eventos */}
      <div className="fade-up-2">
        <SectionTitle action={
          <Link to="/eventos" style={{ fontSize:12,color:'var(--purple)',textDecoration:'none',display:'flex',alignItems:'center',gap:2 }}>
            Ver todos <ChevronRight size={12}/>
          </Link>
        }>Próximos eventos</SectionTitle>

        {proximos.length === 0
          ? <Card><p style={{ color:'var(--text-muted)',fontSize:13 }}>Nenhum evento agendado.</p></Card>
          : proximos.map(ev => {
            const dt = new Date(ev.data + 'T' + ev.hora)
            return (
              <Card key={ev.id} style={{ marginBottom:10,display:'flex',alignItems:'center',gap:14 }}>
                <div className="ev-date future">
                  <div className="day">{dt.getDate()}</div>
                  <div className="mon">{dt.toLocaleString('pt-BR',{month:'short'}).toUpperCase()}</div>
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:500,fontSize:14,color:'var(--text-dark)',marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{ev.nome}</div>
                  <div style={{ fontSize:12,color:'var(--text-muted)',marginBottom:5 }}>{ev.hora?.slice(0,5)} · {ev.local}</div>
                  <Badge label={ev.tipo}/>
                </div>
                <button onClick={() => onToast('Lembrete criado! 🔔')} style={{ fontSize:11,color:'var(--purple)',background:'rgba(91,53,160,0.08)',border:'none',cursor:'pointer',padding:'6px 10px',borderRadius:'var(--radius-sm)',flexShrink:0,fontFamily:'var(--font-body)',fontWeight:500 }}>
                  + Lembrar
                </button>
              </Card>
            )
          })
        }
      </div>

      {/* Oração do dia */}
      {oracaoDia && (
        <div className="fade-up-3">
          <SectionTitle>Oração do dia</SectionTitle>
          <div className="prayer-hero">
            <div style={{ fontSize:12,color:'var(--gold)',marginBottom:6 }}>{oracaoDia.titulo}</div>
            <p style={{ fontFamily:'var(--font-display)',fontSize:16,fontStyle:'italic',color:'rgba(245,230,192,0.75)',lineHeight:1.8,marginBottom:16 }}>
              {oracaoDia.texto?.slice(0,180)}...
            </p>
            <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
              <button className="btn btn-sm" onClick={() => navigate('/oracoes')} style={{ background:'rgba(255,255,255,0.1)',color:'var(--gold-pale)',border:'1px solid rgba(245,230,192,0.18)',fontSize:12 }}>
                Ver oração completa
              </button>
              <button className="btn btn-sm" onClick={() => onToast('Oração compartilhada!')} style={{ background:'rgba(201,168,76,0.15)',color:'var(--gold)',border:'1px solid rgba(201,168,76,0.25)',fontSize:12 }}>
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avisos */}
      {db.avisos.length > 0 && (
        <div className="fade-up-4">
          <SectionTitle><span style={{ display:'flex',alignItems:'center',gap:5 }}><Bell size={11}/>Avisos</span></SectionTitle>
          {db.avisos.map(av => (
            <Card key={av.id} style={{ marginBottom:10,display:'flex',gap:12,alignItems:'flex-start' }}>
              <div style={{ width:36,height:36,borderRadius:'var(--radius-md)',background:'#FDF3D9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>📢</div>
              <div>
                <div style={{ fontWeight:500,fontSize:13,color:'var(--text-dark)',marginBottom:3 }}>{av.titulo}</div>
                <div style={{ fontSize:12,color:'var(--text-muted)',lineHeight:1.5 }}>{av.texto}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
