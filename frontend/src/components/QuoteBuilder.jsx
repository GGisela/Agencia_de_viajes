import React, { useState } from 'react';
import { ShoppingBag, Users, Trash2, Send, CheckCircle2, AlertCircle, Sparkles, Plus, Minus } from 'lucide-react';
import { api } from '../services/api';

export default function QuoteBuilder({ 
  selectedPackage, 
  setSelectedPackage, 
  selectedExcursions, 
  setSelectedExcursions,
  onResetQuote 
}) {
  const [passengers, setPassengers] = useState(2);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    comentarios: ''
  });
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Calculations
  const packageTotal = selectedPackage ? (selectedPackage.precioBase * passengers) : 0;
  const excursionsTotal = selectedExcursions.reduce((acc, exc) => acc + (exc.precio * passengers), 0);
  const totalEstimado = packageTotal + excursionsTotal;

  const handlePassengerChange = (delta) => {
    setPassengers(prev => Math.max(1, Math.min(20, prev + delta)));
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedPackage && selectedExcursions.length === 0) {
      setErrorMessage('Debes seleccionar al menos un paquete o excursión para cotizar.');
      return;
    }

    if (!formData.nombre.trim() || !formData.email.trim()) {
      setErrorMessage('Por favor completa tu nombre y correo electrónico.');
      return;
    }

    setLoading(true);

    try {
      const detalles = [];

      if (selectedPackage) {
        detalles.push({
          paqueteId: selectedPackage.id,
          cantidadPersonas: passengers
        });
      }

      selectedExcursions.forEach(exc => {
        detalles.push({
          excursionId: exc.id,
          cantidadPersonas: passengers
        });
      });

      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido || 'Cliente',
        email: formData.email,
        telefono: formData.telefono,
        comentariosCliente: formData.comentarios,
        detalles: detalles
      };

      const result = await api.crearPresupuesto(payload);
      setSuccessResult(result);
    } catch (err) {
      setErrorMessage(err.message || 'Error al procesar la cotización. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (successResult) {
    return (
      <div className="quote-success-view glass-panel animate-fade">
        <div className="success-icon-wrapper">
          <CheckCircle2 size={56} className="success-icon" />
        </div>
        <h2>¡Solicitud de Cotización Enviada con Éxito!</h2>
        <div className="quote-code-badge">
          <span>Referencia de Presupuesto: <strong>#{successResult.id}</strong></span>
        </div>
        <p className="success-message">
          Hemos enviado un correo de confirmación a <strong>{formData.email}</strong> con el resumen de tu itinerario solicitado.
        </p>
        <div className="success-info-box">
          <Sparkles size={20} className="info-box-icon" />
          <p>
            Un agente de viajes dedicado evaluará las mejores promociones de aerolíneas y alojamientos disponibles para contactarte de forma personalizada.
          </p>
        </div>

        <button 
          className="btn-primary btn-large"
          onClick={() => {
            setSuccessResult(null);
            onResetQuote();
          }}
        >
          Armar Nueva Cotización
        </button>
      </div>
    );
  }

  const hasItems = selectedPackage !== null || selectedExcursions.length > 0;

  return (
    <div className="quote-builder-container">
      <div className="quote-builder-header">
        <div className="badge badge-primary">
          <Sparkles size={14} />
          <span>Cotizador en Tiempo Real</span>
        </div>
        <h2>Configura tu Itinerario de Viaje</h2>
        <p>Personaliza los viajeros, ajusta actividades y envía tu solicitud en un solo paso.</p>
      </div>

      <div className="quote-grid-layout">
        {/* Left Column: Selected Items & Customizer */}
        <div className="quote-summary-column">
          <div className="quote-box glass-panel">
            <h3 className="box-title">
              <ShoppingBag size={20} />
              <span>Servicios Seleccionados</span>
            </h3>

            {!hasItems ? (
              <div className="empty-selection">
                <p>Aún no has agregado servicios a tu presupuesto.</p>
                <span>Explora nuestro catálogo y selecciona un paquete o excursiones.</span>
              </div>
            ) : (
              <div className="selected-items-list">
                {/* Paquete */}
                {selectedPackage && (
                  <div className="selected-item-card">
                    <div className="item-details">
                      <span className="item-type-badge">Paquete Principal</span>
                      <h4 className="item-title">{selectedPackage.titulo}</h4>
                      <span className="item-dest">{selectedPackage.destinoCiudad}, {selectedPackage.destinoPais} • {selectedPackage.duracionDias} días</span>
                      <span className="item-price">${selectedPackage.precioBase} USD / persona</span>
                    </div>
                    <button 
                      className="btn-remove"
                      onClick={() => setSelectedPackage(null)}
                      title="Quitar paquete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                {/* Excursiones */}
                {selectedExcursions.map(exc => (
                  <div key={exc.id} className="selected-item-card">
                    <div className="item-details">
                      <span className="item-type-badge badge-excursion">Excursión Extra</span>
                      <h4 className="item-title">{exc.nombre}</h4>
                      <span className="item-dest">{exc.destinoCiudad} • {exc.duracionHoras} horas</span>
                      <span className="item-price">${exc.precio} USD / persona</span>
                    </div>
                    <button 
                      className="btn-remove"
                      onClick={() => setSelectedExcursions(prev => prev.filter(e => e.id !== exc.id))}
                      title="Quitar excursión"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Travelers Counter */}
            <div className="passengers-selector">
              <div className="passengers-info">
                <Users size={20} />
                <div>
                  <span className="passengers-title">Cantidad de Viajeros</span>
                  <span className="passengers-sub">Tarifas calculadas por persona</span>
                </div>
              </div>

              <div className="counter-controls">
                <button 
                  type="button" 
                  className="counter-btn"
                  onClick={() => handlePassengerChange(-1)}
                  disabled={passengers <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="counter-value">{passengers}</span>
                <button 
                  type="button" 
                  className="counter-btn"
                  onClick={() => handlePassengerChange(1)}
                  disabled={passengers >= 20}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Total breakdown */}
            {hasItems && (
              <div className="price-breakdown">
                {selectedPackage && (
                  <div className="breakdown-row">
                    <span>Paquete ({passengers} pax):</span>
                    <span>${packageTotal.toLocaleString()} USD</span>
                  </div>
                )}
                {selectedExcursions.length > 0 && (
                  <div className="breakdown-row">
                    <span>Excursiones ({selectedExcursions.length} activ. x {passengers} pax):</span>
                    <span>${excursionsTotal.toLocaleString()} USD</span>
                  </div>
                )}
                <div className="breakdown-total">
                  <span>Total Base Estimado:</span>
                  <span className="total-highlight">${totalEstimado.toLocaleString()} USD</span>
                </div>
                <p className="disclaimer-text">
                  * Este importe es una tarifa base de referencia. El agente de viajes podrá aplicar descuentos por grupo o promociones vigentes de temporada.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contact & Lead Form */}
        <div className="quote-form-column">
          <form className="quote-form glass-panel" onSubmit={handleSubmit}>
            <h3 className="box-title">Datos del Solicitante</h3>

            {errorMessage && (
              <div className="form-error-alert animate-fade">
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre *</label>
                <input 
                  type="text" 
                  id="nombre" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleInputChange} 
                  placeholder="Ej: Laura" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input 
                  type="text" 
                  id="apellido" 
                  name="apellido" 
                  value={formData.apellido} 
                  onChange={handleInputChange} 
                  placeholder="Ej: Fernández" 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="ejemplo@correo.com" 
                required 
              />
              <span className="field-hint">Recibirás aquí la confirmación y la propuesta detallada.</span>
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono / WhatsApp</label>
              <input 
                type="tel" 
                id="telefono" 
                name="telefono" 
                value={formData.telefono} 
                onChange={handleInputChange} 
                placeholder="+54 9 11 1234-5678" 
              />
            </div>

            <div className="form-group">
              <label htmlFor="comentarios">Comentarios o Preferencias Especiales</label>
              <textarea 
                id="comentarios" 
                name="comentarios" 
                rows="3" 
                value={formData.comentarios} 
                onChange={handleInputChange} 
                placeholder="Indica fechas estimadas, tipo de habitación, régimen de comidas o peticiones particulares..."
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary btn-submit-quote"
              disabled={loading || !hasItems}
            >
              <Send size={18} />
              <span>{loading ? 'Generando Solicitud...' : 'Solicitar Cotización Oficial'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
