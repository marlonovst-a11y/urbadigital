"use client";

import { useEffect, useState } from "react";
import { Users, Target, Clock, Trophy, RefreshCw } from "lucide-react";
import ParticipantsTable from "./ParticipantsTable";

interface Participante {
  id: string;
  nickname: string;
  edad: string;
  genero: string;
  ocupacion: string;
  puntaje_nivel_1: number;
  puntaje_nivel_2: number;
  puntaje_nivel_3: number;
  puntaje_nivel_4: number;
  puntaje_nivel_5: number;
  puntaje_total: number;
  puntaje_formulario: number;
  tiempo_total: number;
  fecha_hora: string;
  completado: boolean;
}

function KpiCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className="w-9 h-9 rounded-xl bg-[#ECEEEF] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#2167AE]" />
        </div>
      </div>
      <div className="text-4xl font-bold text-[#2167AE] leading-none">{value}</div>
      <div className="text-xs text-gray-400">{sub}</div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-base font-semibold text-[#1E2D6B] mb-4">{title}</h3>
      {children}
    </div>
  );
}

function ProgressRow({ label, count, total, badge }: { label: string; count: number; total: number; badge?: React.ReactNode }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-24 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-[#ECEEEF] rounded-full h-2">
        <div className="bg-[#2167AE] h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold text-[#2167AE] w-6 text-right">{count}</span>
      {badge}
    </div>
  );
}

export default function Dashboard() {
  const [participants, setParticipants] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchParticipants = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/participantes');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const sorted = [...data].sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
      setParticipants(sorted);
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchParticipants(); }, []);

  const totalParticipants = participants.length;
  const completedParticipants = participants.filter(p => p.puntaje_total > 0 && p.puntaje_formulario === 10).length;
  const averageScore = totalParticipants > 0
    ? Math.round(participants.reduce((sum, p) => sum + p.puntaje_total, 0) / totalParticipants)
    : 0;
  const averageTime = totalParticipants > 0
    ? (participants.reduce((sum, p) => sum + p.tiempo_total, 0) / totalParticipants / 60).toFixed(1)
    : "0.0";

  const getLevelStats = (level: number) => {
    const scores = participants
      .map(p => p[`puntaje_nivel_${level}` as keyof Participante] as number)
      .filter(s => s > 0);
    if (scores.length === 0) return { average: 0, label: "Sin datos", color: "text-gray-400 bg-gray-100" };
    const average = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
    const label = average < 60 ? "Difícil" : average < 75 ? "Medio" : "Fácil";
    const color = average < 60 ? "text-red-700 bg-red-50" : average < 75 ? "text-amber-700 bg-amber-50" : "text-emerald-700 bg-emerald-50";
    return { average, label, color };
  };

  const getAgeDistribution = () =>
    [{ display: "16-18", value: "16-18 años" }, { display: "19-26", value: "19-26 años" }, { display: "27-35", value: "27-35 años" }, { display: "35+", value: "35 en adelante" }]
      .map(({ display, value }) => ({ label: display, count: participants.filter(p => p.edad === value).length }));

  const getGenderDistribution = () =>
    ["Masculino", "Femenino", "Otro"].map(g => ({ label: g, count: participants.filter(p => p.genero === g).length }));

  const getOccupationDistribution = () => {
    const map = new Map<string, number>();
    participants.forEach(p => { if (p.ocupacion) map.set(p.ocupacion, (map.get(p.ocupacion) || 0) + 1); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, count]) => ({ label, count }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECEEEF]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2167AE] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#1E2D6B] font-medium">Cargando datos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECEEEF]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <header className="bg-[#1E2D6B] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Aprende y Previene</h1>
            <p className="text-blue-200 text-sm mt-0.5">Panel Administrativo</p>
          </div>
          <button
            onClick={() => fetchParticipants(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={Users} label="Total Participantes" value={totalParticipants} sub="Registros en el sistema" />
          <KpiCard icon={Trophy} label="Completados" value={completedParticipants} sub={`${totalParticipants > 0 ? Math.round((completedParticipants / totalParticipants) * 100) : 0}% del total`} />
          <KpiCard icon={Target} label="Puntaje Promedio" value={averageScore} sub="Puntos por participante" />
          <KpiCard icon={Clock} label="Tiempo Promedio" value={`${averageTime} min`} sub="Por sesión completada" />
        </div>

        {/* Level difficulty */}
        <SectionCard title="Rendimiento por Nivel">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(level => {
              const stats = getLevelStats(level);
              return (
                <div key={level} className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-[#1E2D6B] w-14 shrink-0">Nivel {level}</span>
                  <div className="flex-1 bg-[#ECEEEF] rounded-full h-2.5">
                    <div className="bg-[#2167AE] h-2.5 rounded-full transition-all duration-500" style={{ width: `${stats.average}%` }} />
                  </div>
                  <span className="text-sm font-bold text-[#2167AE] w-14 text-right shrink-0">{stats.average} pts</span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full w-16 text-center shrink-0 ${stats.color}`}>{stats.label}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Distribution cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Por Edad">
            <div className="space-y-3">
              {getAgeDistribution().map(({ label, count }) => (
                <ProgressRow key={label} label={label} count={count} total={totalParticipants} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Por Género">
            <div className="space-y-3">
              {getGenderDistribution().map(({ label, count }) => (
                <ProgressRow key={label} label={label} count={count} total={totalParticipants} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Por Ocupación">
            <div className="space-y-3">
              {getOccupationDistribution().map(({ label, count }) => (
                <ProgressRow key={label} label={label} count={count} total={totalParticipants} />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Table */}
        <ParticipantsTable participants={participants} />

      </main>
    </div>
  );
}
