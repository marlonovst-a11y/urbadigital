'use client';

import { useState } from 'react';
import Header from './Header';
import DecorativeShapes from './DecorativeShapes';
import FamilyCharacters from './FamilyCharacters';

export default function Welcome() {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="pt-16 flex-1 flex flex-col">
        <section className="relative bg-[#2167AE] text-white py-16 flex-1 flex items-center justify-center overflow-hidden">
          <DecorativeShapes />

          <div className="relative z-10 container mx-auto px-4 text-center max-w-2xl">
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Aprende a prevenir y proteger a tu familia
            </h1>
            <p className="text-lg opacity-90 mb-12">
              5 niveles · 110 puntos posibles · ~10 minutos
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#2167AE] mb-4">
                Sobre este juego
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Acompaña a una familia ecuatoriana en su viaje de aprendizaje. Descubre cómo prevenir riesgos comunes en el hogar, en el trabajo y en tu comunidad. Completa los 5 niveles y acumula puntos respondiendo correctamente.
              </p>
              <button
                onClick={() => setShowContent(true)}
                className="w-full bg-[#2167AE] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#1E2D6B] transition-colors duration-300"
              >
                ¡Comenzar!
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-[#1E2D6B] mb-4 text-center">
                Conoce a la familia
              </h3>
              <div className="flex justify-center gap-8 flex-wrap">
                <div className="flex flex-col items-center">
                  <img src="/papa.svg" alt="Roberto" className="w-24 h-auto mb-2" />
                  <p className="text-xs text-[#1E2D6B]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Roberto · Papá</p>
                </div>
                <div className="flex flex-col items-center">
                  <img src="/mama.svg" alt="Carmen" className="w-24 h-auto mb-2" />
                  <p className="text-xs text-[#1E2D6B]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Carmen · Mamá</p>
                </div>
                <div className="flex flex-col items-center">
                  <img src="/nina.svg" alt="Sofía" className="w-20 h-auto mb-2" />
                  <p className="text-xs text-[#1E2D6B]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Sofía · Niña</p>
                </div>
                <div className="flex flex-col items-center">
                  <img src="/abuelo.svg" alt="Don Manuel" className="w-24 h-auto mb-2" />
                  <p className="text-xs text-[#1E2D6B]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Don Manuel · Abuelo</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
