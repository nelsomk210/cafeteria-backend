import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditarVenta from './EditarVenta';

function ListaVentas() {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarVentas = () => {
    setCargando(true);
    axios.get('http://localhost:3000/ventas')
      .then(res => setVentas(res.data))
      .catch(err => console.error('Error al obtener ventas:', err))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const eliminarVenta = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta venta?')) {
      axios.delete(`http://localhost:3000/ventas/${id}`)
        .then(res => {
          alert(res.data.message || 'Venta eliminada');
          cargarVentas();
          if (ventaSeleccionada?.id === id) {
            setVentaSeleccionada(null);
          }
        })
        .catch(err => console.error('Error al eliminar venta:', err));
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="icon-badge accent">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <div>
          <h2>Historial de Ventas</h2>
          <p>Listado de transacciones registradas en la cafetería</p>
        </div>
      </div>

      {cargando ? (
        <div className="empty-state">
          <p>Cargando registros...</p>
        </div>
      ) : ventas.length === 0 ? (
        <div className="empty-state">
          <p>No hay ventas registradas en este momento.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio U.</th>
                <th>Total</th>
                <th>Fecha</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map(v => (
                <tr key={v.id} className={ventaSeleccionada?.id === v.id ? 'active-row' : ''}>
                  <td><strong>{v.estudiante}</strong></td>
                  <td>{v.producto}</td>
                  <td><span className="badge">{v.cantidad}</span></td>
                  <td>${Number(v.precio || 0).toFixed(2)}</td>
                  <td><strong className="total-highlight">${Number(v.total || 0).toFixed(2)}</strong></td>
                  <td>{v.fecha}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setVentaSeleccionada(v)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarVenta(v.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {ventaSeleccionada && (
        <EditarVenta 
          venta={ventaSeleccionada} 
          onUpdate={() => {
            cargarVentas();
            setVentaSeleccionada(null);
          }} 
          onCancel={() => setVentaSeleccionada(null)}
        />
      )}
    </div>
  );
}

export default ListaVentas;