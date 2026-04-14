'use client';

export default function FamilyCharacters() {
  const characters = [
    {
      name: 'Roberto',
      role: 'Papá',
      initials: 'R',
      colors: 'bg-gradient-to-b from-white via-blue-100 to-blue-200'
    },
    {
      name: 'Carmen',
      role: 'Mamá',
      initials: 'C',
      colors: 'bg-gradient-to-b from-yellow-50 via-green-100 to-purple-200'
    },
    {
      name: 'Sofía',
      role: 'Niña',
      initials: 'S',
      colors: 'bg-gradient-to-b from-yellow-100 via-blue-50 to-blue-100'
    },
    {
      name: 'Don Manuel',
      role: 'Abuelo',
      initials: 'M',
      colors: 'bg-gradient-to-b from-white via-green-50 to-green-100'
    }
  ];

  return (
    <div className="flex justify-center gap-8 mt-12">
      {characters.map((char) => (
        <div
          key={char.name}
          className="group cursor-pointer"
        >
          <div
            className={`w-20 h-24 rounded-lg ${char.colors} flex items-center justify-center font-bold text-lg text-[#1E2D6B] shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
          >
            {char.initials}
          </div>
          <p className="text-center text-xs font-medium text-gray-700 mt-2">{char.role}</p>
        </div>
      ))}
    </div>
  );
}
