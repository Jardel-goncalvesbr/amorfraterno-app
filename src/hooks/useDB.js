import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

export function useDB() {
  const [db, setDb] = useState({
    eventos: [], membros: [], oracoes: [], avisos: [], intencoes: [],
  })
  const [loading, setLoading] = useState(true)

  // ── Carrega todos os dados ──────────────────────────────
  async function load() {
    const [ev, mb, or, av, in_] = await Promise.all([
      supabase.from('eventos').select('*').eq('ativo', true).order('data').order('hora'),
      supabase.from('membros').select('*').order('nome'),
      supabase.from('oracoes').select('*').eq('ativo', true).order('ordem'),
      supabase.from('avisos').select('*').eq('ativo', true).order('created_at', { ascending: false }),
      supabase.from('intencoes').select('*').eq('ativo', true).order('created_at', { ascending: false }),
    ])
    setDb({
      eventos:   ev.data   || [],
      membros:   mb.data   || [],
      oracoes:   or.data   || [],
      avisos:    av.data   || [],
      intencoes: in_.data  || [],
    })
    setLoading(false)
  }

  useEffect(() => {
    load()

    // ── Realtime: atualiza ao vivo quando admin muda algo ──
    const channels = ['eventos','membros','oracoes','avisos','intencoes'].map(table =>
      supabase.channel(`rt-${table}`)
        .on('postgres_changes', { event:'*', schema:'public', table }, () => load())
        .subscribe()
    )
    return () => channels.forEach(c => supabase.removeChannel(c))
  }, [])

  // ── Adicionar intenção (usuário do app) ────────────────
  const addIntencao = useCallback(async (texto) => {
    await supabase.from('intencoes').insert({ texto, votos: 0 })
    load()
  }, [])

  // ── Votar em intenção ──────────────────────────────────
  const votarIntencao = useCallback(async (id, votosAtuais) => {
    await supabase.from('intencoes').update({ votos: votosAtuais + 1 }).eq('id', id)
    load()
  }, [])

  return { db, loading, addIntencao, votarIntencao }
}
