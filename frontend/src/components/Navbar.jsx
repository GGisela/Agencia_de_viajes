import React from 'react';
import { Compass, ShoppingBag, ShieldCheck, MapPin, Database } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, quoteCount }) {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-brand" onClick={() => setActiveTab('admin')}>
          <div className="brand-icon-wrapper">
            <Compass className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Horizonte<span className="brand-accent">Travel</span></span>
            <span className="brand-tag">Gestión de Agencia & Cotizador</span>
          </div>
        </div>

        <nav className="navbar-nav">
          <button 
            className={`nav-link admin-link ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
            style={{ fontWeight: 700 }}
          >
            <ShieldCheck size={18} />
            <span>Gestión & CRUD Agencia</span>
          </button>

          <button 
            className={`nav-link ${activeTab === 'paquetes' ? 'active' : ''}`}
            onClick={() => setActiveTab('paquetes')}
          >
            <MapPin size={18} />
            <span>Catálogo Paquetes</span>
          </button>

          <button 
            className={`nav-link ${activeTab === 'excursiones' ? 'active' : ''}`}
            onClick={() => setActiveTab('excursiones')}
          >
            <Compass size={18} />
            <span>Excursiones</span>
          </button>

          <button 
            className={`nav-link cotizador-link ${activeTab === 'cotizador' ? 'active' : ''}`}
            onClick={() => setActiveTab('cotizador')}
          >
            <ShoppingBag size={18} />
            <span>Cotizador</span>
            {quoteCount > 0 && (
              <span className="quote-badge animate-fade">{quoteCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
