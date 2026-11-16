import React from 'react';
import { Clock, MapPin, Plus, Check } from 'lucide-react';

export default function ExcursionList({ excursiones, selectedExcursions, onToggleExcursion }) {
  if (excursiones.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <MapPin size={40} className="empty-icon" />
        <h3>No se encontraron actividades turísticas</h3>
      </div>
    );
  }

  return (
    <section className="excursions-grid">
      {excursiones.map((exc) => {
        const isSelected = selectedExcursions.some(e => e.id === exc.id);

        return (
          <div key={exc.id} className={`excursion-card glass-panel ${isSelected ? 'selected-card' : ''}`}>
            <div className="excursion-image-container">
              <img src={exc.imagenUrl} alt={exc.nombre} className="excursion-image" />
              <div className="card-badge badge badge-info">
                <Clock size={12} />
                <span>{exc.duracionHoras} Horas</span>
              </div>
            </div>

            <div className="excursion-body">
              <div className="excursion-location">
                <MapPin size={14} />
                <span>{exc.destinoCiudad}, {exc.destinoPais}</span>
              </div>
              <h4 className="excursion-name">{exc.nombre}</h4>
              <p className="excursion-description">{exc.descripcion}</p>

              <div className="excursion-footer">
                <div className="price-tag">
                  <span className="price-label">Tarifa por persona</span>
                  <span className="price-amount">${exc.precio.toLocaleString()} <span className="price-currency">USD</span></span>
                </div>

                <button 
                  className={`btn-action-small ${isSelected ? 'btn-selected' : 'btn-outline'}`}
                  onClick={() => onToggleExcursion(exc)}
                >
                  {isSelected ? (
                    <>
                      <Check size={14} />
                      <span>Agregada</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      <span>Sumar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
