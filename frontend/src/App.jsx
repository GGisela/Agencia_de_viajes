import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PackageList from './components/PackageList';
import ExcursionList from './components/ExcursionList';
import QuoteBuilder from './components/QuoteBuilder';
import AdminDashboard from './components/AdminDashboard';
import ChatbotWidget from './components/ChatbotWidget';
import { api } from './services/api';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('admin');
  const [destinos, setDestinos] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [excursiones, setExcursiones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Quote State
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedExcursions, setSelectedExcursions] = useState([]);

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const [destData, pkgData, excData] = await Promise.all([
          api.getDestinos(),
          api.getPaquetes(),
          api.getExcursiones()
        ]);
        setDestinos(destData);
        setPaquetes(pkgData);
        setExcursiones(excData);
      } catch (err) {
        console.error('Error cargando catálogo:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleSelectPackage = (pkg) => {
    if (selectedPackage?.id === pkg.id) {
      setSelectedPackage(null);
    } else {
      setSelectedPackage(pkg);
    }
  };

  const handleToggleExcursion = (exc) => {
    if (selectedExcursions.some(e => e.id === exc.id)) {
      setSelectedExcursions(prev => prev.filter(e => e.id !== exc.id));
    } else {
      setSelectedExcursions(prev => [...prev, exc]);
    }
  };

  const handleResetQuote = () => {
    setSelectedPackage(null);
    setSelectedExcursions([]);
  };

  // Filter logic
  const filteredPaquetes = paquetes.filter(p => {
    const matchesDest = selectedDestination === null || p.destinoId === selectedDestination;
    const matchesSearch = !searchTerm.trim() || 
      p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.destinoCiudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.destinoPais?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDest && matchesSearch;
  });

  const filteredExcursiones = excursiones.filter(e => {
    const matchesDest = selectedDestination === null || e.destinoId === selectedDestination;
    const matchesSearch = !searchTerm.trim() || 
      e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.destinoCiudad?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDest && matchesSearch;
  });

  const quoteCount = (selectedPackage ? 1 : 0) + selectedExcursions.length;

  return (
    <div className="app-root">
      {/* Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        quoteCount={quoteCount} 
      />

      <main className="main-content">
        {/* Render Tab Contents */}
        {activeTab === 'paquetes' && (
          <div className="tab-pane animate-fade">
            <Hero 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedDestination={selectedDestination}
              setSelectedDestination={setSelectedDestination}
              destinos={destinos}
            />

            <div className="section-container">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Paquetes Turísticos Disponibles</h2>
                  <p className="section-subtitle">Selecciona un paquete para armar tu cotización a medida</p>
                </div>
                <span className="results-count">{filteredPaquetes.length} paquetes encontrados</span>
              </div>

              {loading ? (
                <div className="loading-state glass-panel">
                  <p>Cargando catálogo de paquetes...</p>
                </div>
              ) : (
                <PackageList 
                  paquetes={filteredPaquetes}
                  onSelectPackage={handleSelectPackage}
                  selectedPackage={selectedPackage}
                  onGoToQuote={() => setActiveTab('cotizador')}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'excursiones' && (
          <div className="tab-pane animate-fade">
            <div className="section-container" style={{ paddingTop: '2.5rem' }}>
              <div className="section-header">
                <div>
                  <h2 className="section-title">Catálogo de Excursiones y Actividades</h2>
                  <p className="section-subtitle">Suma experiencias únicas e inolvidables a tu itinerario</p>
                </div>
                <span className="results-count">{filteredExcursiones.length} actividades disponibles</span>
              </div>

              {loading ? (
                <div className="loading-state glass-panel">
                  <p>Cargando excursiones...</p>
                </div>
              ) : (
                <ExcursionList 
                  excursiones={filteredExcursiones}
                  selectedExcursions={selectedExcursions}
                  onToggleExcursion={handleToggleExcursion}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'cotizador' && (
          <div className="tab-pane animate-fade">
            <div className="section-container" style={{ paddingTop: '2.5rem' }}>
              <QuoteBuilder 
                selectedPackage={selectedPackage}
                setSelectedPackage={setSelectedPackage}
                selectedExcursions={selectedExcursions}
                setSelectedExcursions={setSelectedExcursions}
                onResetQuote={handleResetQuote}
              />
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="tab-pane animate-fade">
            <div className="section-container" style={{ paddingTop: '2.5rem' }}>
              <AdminDashboard />
            </div>
          </div>
        )}
      </main>

      {/* Floating AI Chatbot Assistant */}
      <ChatbotWidget onSelectDestination={(destId) => setSelectedDestination(destId)} />

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-content">
          <p>© 2026 ViajesHorizonte - Plataforma Web para Agencia de Viajes con IA y Sistema de Cotizaciones.</p>
          <div className="footer-links">
            <button onClick={() => setActiveTab('paquetes')}>Catálogo</button>
            <button onClick={() => setActiveTab('cotizador')}>Cotizador</button>
            <button onClick={() => setActiveTab('admin')}>Panel Agente</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
