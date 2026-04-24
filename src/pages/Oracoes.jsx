import React, { useState } from 'react'
import { Heart } from 'lucide-react'
import { Card, Badge, SectionTitle, Empty, Spinner } from '../components/UI'

const CATS = ['Todas','Fundamental','Santos','Salmos','Cotidiano']

export default function Oracoes({ db, loading, addIntencao, votarIntencao, onToast }) {
  const [cat, setCat]               = useState('Todas')
  const [expanded, setExpanded]     = useState(null)
  const [intencaoText, setIntencao] = useState('')
  const [sending, setSending]       = useState(false)

  const filtradas = cat === 'Todas' ? db.oracoes : db.oracoes.filter(o => o.categoria === cat)

  async function handleIntencao() {
    if (!intencaoText.trim()) { onToast('Digite sua intenção!'); return }
    setSending(true)
    await addIntencao(intencaoText.trim())
    setIntencao('')
    setSending(false)
    onToast('Intenção enviada! 🙏')
  }

  if (loading) return <Spinner/>

  return (
    <div>
      <div className="fade-up">
        <p style={{ fontSize:13,color:'var(--text-muted)',marginBottom:20 }}>Reze conosco a qualquer hora do dia.</p>

        {/* Filtros */}
        <div className="filter-strip">
          {CATS.map(c => (
            <button key={c} className={`filter-pill${cat===c?' active':''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        {filtradas.length === 0
          ? <Empty icon="🙏" message="Nenhuma oração nesta categoria."/>
          : filtradas.map((o, i) => (
            <div key={o.id} className={`fade-up-${Math.min(i+1,5)}`} style={{ marginBottom:12 }}>
              <Card onClick={() => setExpanded(expanded===o.id?null:o.id)} style={{ cursor:'pointer' }}>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)',fontSize:18,fontWeight:600,color:'var(--deep3)',marginBottom:4 }}>{o.titulo}</div>
                    <Badge label={o.categoria}/>
                  </div>
                  <div style={{ fontSize:20,color:'var(--purple)',transition:'transform 0.2s',transform:expanded===o.id?'rotate(180deg)':'none' }}>∨</div>
                </div>
                {expanded === o.id && (
                  <div style={{ marginTop:16,paddingTop:16,borderTop:'1px solid var(--border)' }}>
                    <pre style={{ fontFamily:'var(--font-display)',fontSize:16,fontStyle:'italic',color:'var(--text-mid)',lineHeight:2,whiteSpace:'pre-wrap',margin:'0 0 16px' }}>{o.texto}</pre>
                    <div style={{ display:'flex',gap:8 }}>
                      <button className="btn btn-primary btn-sm" onClick={e=>{e.stopPropagation();onToast('Rezando... 🙏')}}>🙏 Rezar agora</button>
                      <button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();onToast('Compartilhado!')}}>Compartilhar</button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ))
        }
      </div>

      {/* Intenções */}
      <div className="fade-up-3">
        <SectionTitle>Intenções de oração da comunidade</SectionTitle>
        <Card style={{ marginBottom:16 }}>
          <div className="field">
            <label>Sua intenção</label>
            <textarea rows={2} value={intencaoText} onChange={e=>setIntencao(e.target.value)} placeholder="Ex: Pela cura de um familiar..."/>
          </div>
          <button className="btn btn-primary" onClick={handleIntencao} disabled={sending}>
            🕯 {sending?'Enviando...':'Enviar à comunidade'}
          </button>
        </Card>

        {db.intencoes.length === 0
          ? <Empty icon="🕯" message="Nenhuma intenção ainda. Seja o primeiro!"/>
          : db.intencoes.map(i => (
            <Card key={i.id} style={{ marginBottom:10 }}>
              <div style={{ display:'flex',alignItems:'flex-start',gap:12 }}>
                <span style={{ fontSize:16 }}>🕯</span>
                <div style={{ flex:1,fontSize:13,color:'var(--text-mid)',lineHeight:1.6 }}>{i.texto}</div>
                <button onClick={() => { votarIntencao(i.id, i.votos); onToast('Rezando por esta intenção!') }} style={{ display:'flex',alignItems:'center',gap:4,fontSize:12,color:'var(--purple)',background:'none',border:'none',cursor:'pointer',flexShrink:0 }}>
                  <Heart size={13}/>{i.votos}
                </button>
              </div>
              <div style={{ fontSize:10,color:'var(--text-muted)',marginTop:6,marginLeft:28 }}>
                {new Date(i.created_at).toLocaleDateString('pt-BR')}
              </div>
            </Card>
          ))
        }
      </div>
    </div>
  )
}
