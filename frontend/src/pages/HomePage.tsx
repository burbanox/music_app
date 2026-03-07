import React from 'react';
import { Search, ShoppingCart, Shield, Music } from 'lucide-react';
import type { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const features = [
  {
    icon: Search,
    title: 'Búsqueda Avanzada',
    description: 'Encuentra canciones por nombre, artista o género con filtros intuitivos.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: ShoppingCart,
    title: 'Compra Rápida',
    description: 'Adquiere tus canciones favoritas de forma sencilla y segura.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Shield,
    title: 'Cuenta Segura',
    description: 'Regístrate y gestiona tus compras con autenticación protegida.',
    color: 'from-amber-500 to-orange-600',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section         className=" w-full py-24 px-4 overflow-hidden"
        style={{
          backgroundImage: 'url("https://images.steamusercontent.com/ugc/949596928134142092/4C0E46016EE7ABF8440FCA7B9B5AB60EF55AA969/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
        <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-violet-200">
          <Music className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight text-center">
          Tu música favorita,{' '}
          <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            al instante
          </span>
        </h1>
        <p className="mt-6 text-xl text-purple-500 max-w-2xl mx-auto leading-relaxed">
          Explora el catálogo completo de super magnum ultra hyper sanguinaria ardilla 2000 music studio Store. Busca, descubre y compra
          canciones de miles de artistas y géneros.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('search')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 text-lg"
          >
            <Search className="w-5 h-5" />
            Explorar Canciones
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl hover:bg-gray-50 border border-gray-200 transition-colors text-lg"
          >
            Crear Cuenta
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-gray-300 transition-all"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="w-full bg-gradient-to-r from-violet-600 to-purple-700 py-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Canciones', value: '3,500+' },
            { label: 'Artistas', value: '275+' },
            { label: 'Álbumes', value: '347+' },
            { label: 'Géneros', value: '25+' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl sm:text-4xl font-extrabold text-white">{stat.value}</p>
              <p className="text-violet-200 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-sm text-gray-400">
        <p>© 2024 Chinook Music Store — Proyecto Académico Full Stack</p>
      </footer>
    </div>
  );
};
