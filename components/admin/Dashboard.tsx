"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Clock, Trophy, TrendingUp } from "lucide-react";
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

export default function Dashboard() {
  const [participants, setParticipants] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
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
    }
  };

  const totalParticipants = participants.length;
  const completedParticipants = participants.filter((p) => p.puntaje_total > 0 && p.puntaje_formulario === 10).length;
  const averageScore = participants.length > 0
    ? Math.round(participants.reduce((sum, p) => sum + p.puntaje_total, 0) / participants.length)
    : 0;
  const averageTime = participants.length > 0
    ? (participants.reduce((sum, p) => sum + p.tiempo_total, 0) / participants.length / 60).toFixed(1)
    : "0.0";

  const getLevelStats = (level: number) => {
    const scores = participants
      .map((p) => p[`puntaje_nivel_${level}` as keyof Participante] as number)
      .filter((s) => s > 0);

    if (scores.length === 0) return { average: 0, difficulty: "Sin datos" };

    const average = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
    let difficulty = "Fácil";
    if (average < 60) difficulty = "Difícil";
    else if (average < 75) difficulty = "Medio";

    return { average, difficulty };
  };

  const getLevelTime = (level: number) => {
    return 0;
  };

  const getAgeDistribution = () => {
    const ranges = [
      { display: "16-18", value: "16-18 años" },
      { display: "19-26", value: "19-26 años" },
      { display: "27-35", value: "27-35 años" },
      { display: "35+", value: "35 en adelante" }
    ];
    return ranges.map(({ display, value }) => ({
      range: display,
      count: participants.filter((p) => p.edad === value).length,
    }));
  };

  const getGenderDistribution = () => {
    const genders = ["M", "F", "Otro"];
    return genders.map((gender) => ({
      gender,
      count: participants.filter((p) => p.genero === gender).length,
    }));
  };

  const getOccupationDistribution = () => {
    const occupationSet = new Set(participants.map((p) => p.ocupacion).filter(Boolean));
    const occupations = Array.from(occupationSet);
    return occupations.map((occupation) => ({
      occupation,
      count: participants.filter((p) => p.ocupacion === occupation).length,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECEEEF]">
        <div className="text-lg text-[#1E2D6B]">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECEEEF] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1E2D6B]">Dashboard Administrativo</h1>
            <p className="text-gray-600 mt-1">Estadísticas y análisis de participantes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participantes</CardTitle>
              <Users className="h-4 w-4 text-[#2167AE]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1E2D6B]">{totalParticipants}</div>
              <p className="text-xs text-gray-600 mt-1">Registros totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completados</CardTitle>
              <Trophy className="h-4 w-4 text-[#2167AE]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1E2D6B]">{completedParticipants}</div>
              <p className="text-xs text-gray-600 mt-1">
                {totalParticipants > 0 ? Math.round((completedParticipants / totalParticipants) * 100) : 0}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Puntaje Promedio</CardTitle>
              <Target className="h-4 w-4 text-[#2167AE]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1E2D6B]">{averageScore}</div>
              <p className="text-xs text-gray-600 mt-1">Puntos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-[#2167AE]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1E2D6B]">{averageTime} min</div>
              <p className="text-xs text-gray-600 mt-1">Tiempo de completado</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#1E2D6B]">Dificultad por Nivel</CardTitle>
            <CardDescription>Promedio de puntaje y análisis de dificultad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((level) => {
              const stats = getLevelStats(level);
              return (
                <div key={level} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#1E2D6B]">Nivel {level}</span>
                      <Badge
                        variant="secondary"
                        className={
                          stats.difficulty === "Fácil"
                            ? "bg-green-100 text-green-800"
                            : stats.difficulty === "Medio"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {stats.difficulty}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium text-[#2167AE]">{stats.average} pts</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#2167AE] h-2 rounded-full transition-all"
                      style={{ width: `${stats.average}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1E2D6B]">Distribución por Edad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getAgeDistribution().map(({ range, count }) => (
                <div key={range} className="flex items-center justify-between">
                  <span className="text-sm">{range}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#2167AE] h-2 rounded-full transition-all"
                        style={{ width: `${(count / totalParticipants) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#2167AE] w-8">{count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#1E2D6B]">Distribución por Género</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getGenderDistribution().map(({ gender, count }) => (
                <div key={gender} className="flex items-center justify-between">
                  <span className="text-sm">{gender}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#2167AE] h-2 rounded-full transition-all"
                        style={{ width: `${(count / totalParticipants) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#2167AE] w-8">{count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#1E2D6B]">Distribución por Ocupación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getOccupationDistribution().slice(0, 5).map(({ occupation, count }) => (
                <div key={occupation} className="flex items-center justify-between">
                  <span className="text-sm truncate max-w-[120px]">{occupation}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#2167AE] h-2 rounded-full transition-all"
                        style={{ width: `${(count / totalParticipants) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#2167AE] w-8">{count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <ParticipantsTable participants={participants} />
      </div>
    </div>
  );
}
