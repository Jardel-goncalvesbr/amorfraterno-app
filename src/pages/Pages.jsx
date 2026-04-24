import React, { useState } from 'react'
import { Card, Badge, SectionTitle, Empty, Spinner } from '../components/UI'

const TIPOS = ['Missa','Retiro','Grupo','Louvor','Formação','Catequese']
const TIPO_ICON = { Missa:'⛪',Retiro:'🏕',Grupo:'👥',Louvor:'🎵',Formação:'📚',Catequese:'✝' }

// ── Eventos ────────────────────────────────────────────────
export function Eventos({ db, loading, onToast }) {
  const [filtro, setFiltro] = useState('')
  const now    = new Date().toISOString().split('T')[0]
  const eventos = db.eventos.filter(e => !filtro || e.tipo === filtro)
  const futuros = eventos.filter(e => e.data >= now)
  const passados = eventos.filter(e => e.data < now)

  if (loading) return <Spinner/>

  function EventCard({ ev }) {
    const dt     = new Date(ev.data + 'T' + (ev.hora||'00:00'))
    const isPast = ev.data < now
    return (
      <Card style={{ marginBottom:10, opacity:isPast?0.65:1 }}>
        <div style={{ display:'flex',alignItems:'flex-start',gap:14 }}>
          <div className={`ev-date ${isPast?'past':'future'}`}>
            <div className="day">{dt.getDate()}</div>
            <div className="mon">{dt.toLocaleString('pt-BR',{month:'short'}).toUpperCase()}</div>
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:4 }}>
              <span style={{ fontSize:16 }}>{TIPO_ICON[ev.tipo]||'✝'}</span>
              <span style={{ fontWeight:500,fontSize:14,color:'var(--text-dark)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{ev.nome}</span>
            </div>
            <div style={{ fontSize:12,color:'var(--text-muted)',marginBottom:4 }}>
              {dt.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})} · {ev.hora?.slice(0,5)} · {ev.local}
            </div>
            {ev.descricao && <div style={{ fontSize:12,color:'var(--text-mid)',lineHeight:1.5,marginBottom:6 }}>{ev.descricao}</div>}
            <Badge label={ev.tipo}/>
          </div>
          {!isPast && (
            <button onClick={() => onToast('Lembrete criado!')} style={{ fontSize:11,color:'var(--purple)',background:'rgba(91,53,160,0.08)',border:'none',cursor:'pointer',padding:'6px 10px',borderRadius:'var(--radius-sm)',flexShrink:0,fontFamily:'var(--font-body)',fontWeight:500 }}>
              + Lembrar
            </button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div>
      <p style={{ fontSize:13,color:'var(--text-muted)',marginBottom:16 }}>Programação da comunidade</p>

      <div className="filter-strip">
        {['',...TIPOS].map(t => (
          <button key={t} className={`filter-pill${filtro===t?' active':''}`} onClick={() => setFiltro(t)}>{t||'Todos'}</button>
        ))}
      </div>

      <div className="fade-up">
        <SectionTitle>Próximos ({futuros.length})</SectionTitle>
        {futuros.length===0 ? <Empty icon="📅" message="Nenhum evento agendado."/> : futuros.map(ev=><EventCard key={ev.id} ev={ev}/>)}
      </div>
      {passados.length > 0 && (
        <div className="fade-up-2">
          <SectionTitle>Passados ({passados.length})</SectionTitle>
          {passados.map(ev=><EventCard key={ev.id} ev={ev}/>)}
        </div>
      )}
    </div>
  )
}

// ── Agenda ─────────────────────────────────────────────────
const DIAS  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export function Agenda({ db, loading, onToast }) {
  const today   = new Date()
  const [viewDate, setViewDate]       = useState(new Date(today.getFullYear(),today.getMonth(),1))
  const [selectedDay, setSelectedDay] = useState(today.getDate())

  const year  = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth    = new Date(year,month+1,0).getDate()
  const firstDow       = new Date(year,month,1).getDay()
  const isCurrentMonth = today.getFullYear()===year && today.getMonth()===month

  const eventDays = {}
  db.eventos.forEach(ev => {
    const d = new Date(ev.data)
    if (d.getFullYear()===year && d.getMonth()===month) {
      const day = d.getDate()
      if (!eventDays[day]) eventDays[day] = []
      eventDays[day].push(ev)
    }
  })

  if (loading) return <Spinner/>

  return (
    <div>
      <p style={{ fontSize:13,color:'var(--text-muted)',marginBottom:16 }}>Calendário litúrgico da comunidade</p>

      <Card className="fade-up" style={{ marginBottom:20 }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16 }}>
          <button onClick={()=>setViewDate(new Date(year,month-1,1))} style={{ background:'none',border:'none',cursor:'pointer',fontSize:20,color:'var(--purple)',padding:'4px 10px' }}>‹</button>
          <span style={{ fontFamily:'var(--font-display)',fontSize:18,fontWeight:600,color:'var(--deep3)' }}>{MESES[month]} {year}</span>
          <button onClick={()=>setViewDate(new Date(year,month+1,1))} style={{ background:'none',border:'none',cursor:'pointer',fontSize:20,color:'var(--purple)',padding:'4px 10px' }}>›</button>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:4 }}>
          {DIAS.map(d=><div key={d} style={{ textAlign:'center',fontSize:10,color:'var(--text-muted)',fontWeight:500,padding:'4px 0' }}>{d}</div>)}
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4 }}>
          {Array.from({length:firstDow},(_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:daysInMonth},(_,i)=>{
            const day=i+1, isToday=isCurrentMonth&&day===today.getDate(), isSel=day===selectedDay, hasEvent=!!eventDays[day]
            return (
              <button key={day} onClick={()=>setSelectedDay(day)} className={`cal-day${isSel?' sel':isToday?' today':''}`}>
                {day}{hasEvent&&<div className="cal-dot"/>}
              </button>
            )
          })}
        </div>
      </Card>

      <div className="fade-up-2">
        <SectionTitle>Dia {selectedDay} de {MESES[month]}</SectionTitle>
        {(eventDays[selectedDay]||[]).length===0
          ? <Card style={{ textAlign:'center',padding:24,color:'var(--text-muted)',fontSize:13 }}>Nenhum evento neste dia.</Card>
          : (eventDays[selectedDay]||[]).map(ev=>(
            <Card key={ev.id} style={{ marginBottom:10,display:'flex',alignItems:'center',gap:12 }}>
              <div style={{ fontSize:22 }}>{TIPO_ICON[ev.tipo]||'✝'}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:500,fontSize:14,color:'var(--text-dark)' }}>{ev.nome}</div>
                <div style={{ fontSize:12,color:'var(--text-muted)' }}>{ev.hora?.slice(0,5)} · {ev.local}</div>
              </div>
              <Badge label={ev.tipo}/>
            </Card>
          ))
        }
      </div>

      <div className="fade-up-3">
        <SectionTitle>Horários de missas</SectionTitle>
        <Card style={{ marginBottom:16 }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
            {[{p:'Seg–Sex',h:'7h00 · 19h00'},{p:'Sábado',h:'8h00 · 18h00'},{p:'Domingo',h:'7h · 9h · 11h · 19h'},{p:'Confissões',h:'Sáb 16h–17h30'}].map(({p,h})=>(
              <div key={p}><div style={{ fontSize:11,color:'var(--text-muted)',marginBottom:4 }}>{p}</div><div style={{ fontWeight:500,fontSize:14,color:'var(--deep3)' }}>{h}</div></div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ── Membros ────────────────────────────────────────────────
import { Avatar } from '../components/UI'
import { Search } from 'lucide-react'

export function Membros({ db, loading }) {
  const [busca, setBusca] = useState('')
  const filtrados = db.membros.filter(m => {
    const q = busca.toLowerCase()
    return !q || m.nome?.toLowerCase().includes(q) || m.ministerio?.toLowerCase().includes(q)
  }).filter(m => m.ativo)

  const grupos = {}
  filtrados.forEach(m => { const k=m.ministerio||'Sem ministério'; if(!grupos[k]) grupos[k]=[]; grupos[k].push(m) })

  if (loading) return <Spinner/>

  return (
    <div>
      <div className="fade-up" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:16 }}>
        {[
          { num:db.membros.filter(m=>m.ativo).length, label:'Membros ativos' },
          { num:db.membros.length,                    label:'Total'          },
          { num:Object.keys(grupos).length,           label:'Ministérios'   },
        ].map(({num,label})=>(
          <div key={label} className="stat-pill">
            <div style={{ fontSize:22,fontWeight:600,color:'var(--deep3)' }}>{num}</div>
            <div style={{ fontSize:11,color:'var(--text-muted)',marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="fade-up-1" style={{ position:'relative',marginBottom:16 }}>
        <Search size={14} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)' }}/>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar membro..." style={{ width:'100%',padding:'10px 14px 10px 34px',border:'1px solid var(--border-mid)',borderRadius:'var(--radius-md)',fontSize:13,background:'#fff',outline:'none',fontFamily:'var(--font-body)' }}/>
      </div>

      {filtrados.length===0
        ? <Empty icon="👥" message="Nenhum membro encontrado."/>
        : Object.entries(grupos).map(([grupo,membros])=>(
          <div key={grupo} className="fade-up-2">
            <SectionTitle>{grupo} ({membros.length})</SectionTitle>
            <Card style={{ padding:'8px 16px' }}>
              {membros.map((m,i)=>(
                <div key={m.id} style={{ display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:i<membros.length-1?'1px solid var(--border)':'none' }}>
                  <Avatar name={m.nome} size={38}/>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontWeight:500,fontSize:13,color:'var(--text-dark)' }}>{m.nome}</div>
                    <div style={{ fontSize:11,color:'var(--text-muted)' }}>{m.telefone}{m.email?` · ${m.email}`:''}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        ))
      }
    </div>
  )
}
