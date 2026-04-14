"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const exportToCSV = () => {
    const headers = [
      "Nickname",
      "Edad",
      "Género",
      "Ocupación",
      "Nivel 1",
      "Nivel 2",
      "Nivel 3",
      "Nivel 4",
      "Nivel 5",
      "Total",
      "Tiempo (min)",
      "Completado",
      "Fecha",
    ];

    const rows = participants.map((p) => [
      p.nickname,
      p.edad,
      p.genero,
      p.ocupacion,
      p.puntaje_nivel_1,
      p.puntaje_nivel_2,
      p.puntaje_nivel_3,
      p.puntaje_nivel_4,
      p.puntaje_nivel_5,
      p.puntaje_total,
      (p.tiempo_total / 60).toFixed(1),
      (p.puntaje_total > 0 && p.puntaje_formulario === 10) ? "Completo" : "Incompleto",
      new Date(p.fecha_hora).toLocaleString("es-ES"),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `participantes_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#1E2D6B]">Tabla de Participantes</CardTitle>
            <CardDescription>Todos los registros ordenados por fecha</CardDescription>
          </div>
          <Button onClick={exportToCSV} className="bg-[#2167AE] hover:bg-[#1E2D6B]">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nickname</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Género</TableHead>
                <TableHead>Ocupación</TableHead>
                <TableHead className="text-center">N1</TableHead>
                <TableHead className="text-center">N2</TableHead>
                <TableHead className="text-center">N3</TableHead>
                <TableHead className="text-center">N4</TableHead>
                <TableHead className="text-center">N5</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Tiempo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center text-gray-500">
                    No hay participantes registrados
                  </TableCell>
                </TableRow>
              ) : (
                participants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium">{participant.nickname}</TableCell>
                    <TableCell>{participant.edad}</TableCell>
                    <TableCell>{participant.genero}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{participant.ocupacion}</TableCell>
                    <TableCell className="text-center">{participant.puntaje_nivel_1}</TableCell>
                    <TableCell className="text-center">{participant.puntaje_nivel_2}</TableCell>
                    <TableCell className="text-center">{participant.puntaje_nivel_3}</TableCell>
                    <TableCell className="text-center">{participant.puntaje_nivel_4}</TableCell>
                    <TableCell className="text-center">{participant.puntaje_nivel_5}</TableCell>
                    <TableCell className="text-center font-bold text-[#2167AE]">
                      {participant.puntaje_total}
                    </TableCell>
                    <TableCell className="text-center">
                      {(participant.tiempo_total / 60).toFixed(1)} min
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={(participant.puntaje_total > 0 && participant.puntaje_formulario === 10) ? "default" : "secondary"}
                        className={
                          (participant.puntaje_total > 0 && participant.puntaje_formulario === 10)
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {(participant.puntaje_total > 0 && participant.puntaje_formulario === 10) ? "Completo" : "Incompleto"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(participant.fecha_hora).toLocaleDateString("es-ES")}
                      <br />
                      <span className="text-gray-500">
                        {new Date(participant.fecha_hora).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
