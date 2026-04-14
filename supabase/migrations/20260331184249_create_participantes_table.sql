/*
  # Create participantes table

  1. New Table
    - `participantes`
      - `id` (uuid, primary key) - Identificador único
      - `nickname` (text) - Nombre de usuario elegido por el participante
      - `edad` (text) - Rango de edad seleccionado
      - `genero` (text) - Género del participante
      - `ocupacion` (text) - Ocupación del participante
      - `puntaje_nivel_1` to `puntaje_nivel_5` (integer) - Puntos por nivel
      - `puntaje_formulario` (integer) - Puntos del formulario de diagnóstico
      - `puntaje_total` (integer) - Puntuación total acumulada
      - `tiempo_total` (integer) - Tiempo total en segundos
      - `fecha_hora` (timestamp with timezone) - Fecha y hora de creación
      - `respuestas_nivel_1` to `respuestas_nivel_5` (jsonb) - Respuestas por nivel
      - `respuestas_evaluacion` (jsonb) - Respuestas del formulario diagnóstico

  2. Security
    - Enable RLS on `participantes` table
    - Add policy for inserting new participants
    - Add policy for reading and updating own participant data
*/

CREATE TABLE IF NOT EXISTS participantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL,
  edad text,
  genero text,
  ocupacion text,
  puntaje_nivel_1 integer DEFAULT 0,
  puntaje_nivel_2 integer DEFAULT 0,
  puntaje_nivel_3 integer DEFAULT 0,
  puntaje_nivel_4 integer DEFAULT 0,
  puntaje_nivel_5 integer DEFAULT 0,
  puntaje_formulario integer DEFAULT 0,
  puntaje_total integer DEFAULT 0,
  tiempo_total integer DEFAULT 0,
  fecha_hora timestamptz DEFAULT now(),
  respuestas_nivel_1 jsonb,
  respuestas_nivel_2 jsonb,
  respuestas_nivel_3 jsonb,
  respuestas_nivel_4 jsonb,
  respuestas_nivel_5 jsonb,
  respuestas_evaluacion jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE participantes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a new participant"
  ON participantes
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read their own participant data"
  ON participantes
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update their own participant data"
  ON participantes
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
