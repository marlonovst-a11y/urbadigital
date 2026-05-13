"use client";

import { Download } from "lucide-react";

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

interface ParticipantsTableProps {
  participants: Participante[];
}

export default function ParticipantsTable({ participants }: ParticipantsTableProps) {
  const isComplete = (p: Participante) => p.puntaje_total > 0 && p.puntaje_formulario === 10;

  const exportToCSV = () => {
    const headers = ["Nickname", "Edad", "Género", "Ocupación", "N1", "N2", "N3", "N4", "N5", "Total", "Tiempo (min)", "Estado", "Fecha"];
    const rows = participants.map(p => [
      p.nickname, p.edad, p.genero, p.ocupacion,
      p.puntaje_nivel_1, p.puntaje_nivel_2, p.puntaje_nivel_3, p.puntaje_nivel_4, p.puntaje_nivel_5,
      p.puntaje_total,
      (p.tiempo_total / 60).toFixed(1),
      isComplete(p) ? "Completo" : "Incompleto",
      new Date(p.fecha_hora).toLocaleString("es-ES"),
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `participantes_${new Date().toISOString().split("T")[0]}.csv`;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#ECEEEF]">
        <div>
          <h3 className="text-base font-semibold text-[#1E2D6B]">Tabla de Participantes</h3>
          <p className="text-xs text-gray-400 mt-0.5">{participants.length} registros ordenados por fecha</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2167AE] hover:bg-[#1E2D6B] text-white text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1E2D6B] text-white">
              {["Nickname", "Edad", "Género", "Ocupación", "N1", "N2", "N3", "N4", "N5", "Total", "Tiempo", "Estado", "Fecha"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {participants.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center text-gray-400 py-12">No hay participantes registrados</td>
              </tr>
            ) : (
              participants.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-[#ECEEEF] hover:bg-blue-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#ECEEEF]/50'}`}
                >
                  <td className="px-4 py-3 font-semibold text-[#1E2D6B]">{p.nickname}</td>
                  <td className="px-4 py-3 text-gray-600">{p.edad}</td>
                  <td className="px-4 py-3 text-gray-600">{p.genero}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{p.ocupacion}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{p.puntaje_nivel_1}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{p.puntaje_nivel_2}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{p.puntaje_nivel_3}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{p.puntaje_nivel_4}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{p.puntaje_nivel_5}</td>
                  <td className="px-4 py-3 text-center font-bold text-[#2167AE] text-base">{p.puntaje_total}</td>
                  <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">{(p.tiempo_total / 60).toFixed(1)} min</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isComplete(p)
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-orange-50 text-orange-700'
                    }`}>
                      {isComplete(p) ? 'Completo' : 'Incompleto'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                    {new Date(p.fecha_hora).toLocaleDateString("es-ES")}
                    <br />
                    <span className="text-gray-400">
                      {new Date(p.fecha_hora).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
