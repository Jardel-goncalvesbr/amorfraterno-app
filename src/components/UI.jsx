import React from 'react'

export function Card({ children, style={}, onClick, className='' }) {
  return (
    <div onClick={onClick} className={`card${onClick?' clickable':''} ${className}`} style={style}>
      {children}
    </div>
  )
}

export function Button({ children, onClick, variant='primary', size='', disabled=false, style={} }) {
  const cls = ['btn',`btn-${variant}`,size?`btn-${size}`:''].filter(Boolean).join(' ')
  return (
    <button className={cls} onClick={disabled?undefined:onClick} disabled={disabled} style={{ opacity:disabled?0.5:1,...style }}>
      {children}
    </button>
  )
}

const BADGE_COLORS = {
  Missa:    {bg:'#EDE8FB',color:'#4A2DA0'}, Retiro:  {bg:'#D6F5EB',color:'#0D5C45'},
  Grupo:    {bg:'#FDF3D9',color:'#7A4500'}, Louvor:  {bg:'#FBEAF0',color:'#7A2040'},
  Formação: {bg:'#E6F1FB',color:'#1A4F8A'}, Catequese:{bg:'#FDF3D9',color:'#7A4500'},
  default:  {bg:'#F0ECF8',color:'#5B35A0'},
}
export function Badge({ label }) {
  const c = BADGE_COLORS[label]||BADGE_COLORS.default
  return <span className="badge" style={{ background:c.bg, color:c.color }}>{label}</span>
}

const AV_COLORS = [{bg:'#EDE8FB',color:'#4A2DA0'},{bg:'#D6F5EB',color:'#0D5C45'},{bg:'#FDF3D9',color:'#7A4500'},{bg:'#FBEAF0',color:'#7A2040'},{bg:'#E6F1FB',color:'#1A4F8A'}]
export function Avatar({ name, size=38 }) {
  const initials = (name||'?').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()
  const c = AV_COLORS[(name||'').charCodeAt(0)%AV_COLORS.length]
  return <div style={{ width:size,height:size,borderRadius:'50%',background:c.bg,color:c.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.37,fontWeight:500,flexShrink:0 }}>{initials}</div>
}

export function Input({ label, ...props }) {
  return <div className="field">{label&&<label>{label}</label>}<input {...props}/></div>
}
export function Select({ label, children, ...props }) {
  return <div className="field">{label&&<label>{label}</label>}<select {...props}>{children}</select></div>
}
export function Textarea({ label, rows=3, ...props }) {
  return <div className="field">{label&&<label>{label}</label>}<textarea rows={rows} {...props}/></div>
}
export function SectionTitle({ children, action }) {
  return <div className="section-title"><span>{children}</span>{action}</div>
}
export function Empty({ icon, message }) {
  return <div style={{ textAlign:'center',padding:'44px 20px',color:'var(--text-muted)' }}><div style={{ fontSize:36,marginBottom:10 }}>{icon}</div><p style={{ fontSize:14 }}>{message}</p></div>
}
export function Spinner() {
  return <div className="spinner"/>
}
