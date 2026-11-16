import React from 'react';
import { Search, Sparkles, Compass, Shield, Award } from 'lucide-react';

export default function Hero({ searchTerm, setSearchTerm, selectedDestination, setSelectedDestination, destinos }) {
  return (
    <section className="hero-section">
      <div className="hero-glow-sphere"></div>
      <div className="hero-content">
        <div className="hero-badge badge badge-primary animate-fade">
          <Sparkles size={14} />
          <span>Cotizaciones Personalizadas & Soporte con Inteligencia Artificial</span>
        </div>

        <h1 className="hero-title">
          Descubre los mejores destinos del mundo con un plan <span className="text-gradient">diseñado para ti</span>
        </h1>

        <p className="hero-subtitle">
          Arma tu presupuesto en tiempo real, elige excursiones exclusivas y recibe una cotización directa con tarifas especiales y asesoría dedicada.
        </p>

        {/* Search & Filter Bar */}
        <div className="search-bar-container glass-panel">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text"
              placeholder="Buscar por destino, hotel o actividad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="destinations-filter">
            <button 
              className={`filter-pill ${selectedDestination === null ? 'active' : ''}`}
              onClick={() => setSelectedDestination(null)}
            >
              Todos
            </button>
            {destinos.map((dest) => (
              <button 
                key={dest.id}
                className={`filter-pill ${selectedDestination === dest.id ? 'active' : ''}`}
                onClick={() => setSelectedDestination(dest.id)}
              >
                {dest.nombreCiudad}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="hero-highlights">
          <div className="highlight-item">
            <Compass size={18} className="highlight-icon" />
            <span>Itinerarios Flexibles</span>
          </div>
          <div className="highlight-item">
            <Shield size={18} className="highlight-icon" />
            <span>Asistencia 24/7 con IA</span>
          </div>
          <div className="highlight-item">
            <Award size={18} className="highlight-icon" />
            <span>Mejor Tarifa Garantizada</span>
          </div>
        </div>
      </div>
    </section>
  );
}
