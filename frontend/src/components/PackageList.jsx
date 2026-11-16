import React from 'react';
import { Calendar, Clock, MapPin, Check, Plus, ArrowRight } from 'lucide-react';

export default function PackageList({ paquetes, onSelectPackage, selectedPackage, onGoToQuote }) {
  if (paquetes.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <MapPin size={40} className="empty-icon" />
        <h3>No se encontraron paquetes para este criterio de búsqueda</h3>
        <p>Prueba seleccionando otro destino o limpiando los filtros.</p>
      </div>
    );
  }

  return (
    <section className="packages-grid">
      {paquetes.map((pkg) => {
        const isSelected = selectedPackage?.id === pkg.id;

        return (
          <div key={pkg.id} className={`package-card glass-panel ${isSelected ? 'selected-card' : ''}`}>
            <div className="card-image-wrapper">
              <img src={pkg.imagenUrl} alt={pkg.titulo} className="card-image" />
              <div className="card-badge badge badge-primary">
                <Clock size={12} />
                <span>{pkg.duracionDias} Días</span>
              </div>
              <div className="card-location">
                <MapPin size={14} />
                <span>{pkg.destinoCiudad}, {pkg.destinoPais}</span>
              </div>
            </div>

            <div className="card-content">
              <h3 className="card-title">{pkg.titulo}</h3>
              <p className="card-description">{pkg.descripcion}</p>

              {pkg.excursiones && pkg.excursiones.length > 0 && (
                <div className="inclusions-section">
                  <span className="inclusions-title">Excursiones incluidas:</span>
                  <ul className="inclusions-list">
                    {pkg.excursiones.map((exc) => (
                      <li key={exc.id} className="inclusion-item">
                        <Check size={14} className="check-icon" />
                        <span>{exc.nombre}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="card-footer">
                <div className="price-tag">
                  <span className="price-label">Precio base estimado</span>
                  <span className="price-amount">${pkg.precioBase.toLocaleString()} <span className="price-currency">USD / pax</span></span>
                </div>

                <div className="card-actions">
                  <button 
                    className={`btn-action ${isSelected ? 'btn-selected' : 'btn-primary'}`}
                    onClick={() => onSelectPackage(pkg)}
                  >
                    {isSelected ? (
                      <>
                        <Check size={16} />
                        <span>En Cotizador</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>Cotizar Paquete</span>
                      </>
                    )}
                  </button>

                  {isSelected && (
                    <button className="btn-secondary-action" onClick={onGoToQuote}>
                      <span>Configurar</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
