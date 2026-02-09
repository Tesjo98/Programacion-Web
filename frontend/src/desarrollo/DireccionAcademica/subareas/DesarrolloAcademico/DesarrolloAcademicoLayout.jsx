import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Typography, Colors } from '../../../../components/generalStyle/StylesConfig';

const DesarrolloAcademicoLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const esTabla = location.pathname.includes('Septiembre') || 
                    location.pathname.includes('Febrero') || 
                    location.pathname.includes('periodo');
    setIsCollapsed(esTabla);
  }, [location]);

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="layout-container" style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* SIDEBAR FIJO AL BORDE DE LA VENTANA */}
      <aside 
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => {
            const esTabla = location.pathname.includes('Septiembre') || location.pathname.includes('Febrero');
            if(esTabla) setIsCollapsed(true);
        }}
        style={{
            ...sidebarBaseStyle,
            left: 0, // <--- Pegado al borde de la pantalla
            width: isCollapsed ? '10px' : '240px', 
            padding: isCollapsed ? '0' : '20px 15px',
            height: 'fit-content',
            position: 'fixed', // <--- CLAVE: Se posiciona respecto al monitor, no al contenedor
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* PEQUEÑO TIRADOR VISUAL */}
        {isCollapsed && (
            <div style={smallHandleStyle}>
                <svg width="10" height="10" fill="white" viewBox="0 0 16 16">
                    <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
                </svg>
            </div>
        )}

        <div style={{ 
            opacity: isCollapsed ? 0 : 1, 
            visibility: isCollapsed ? 'hidden' : 'visible',
            whiteSpace: 'nowrap'
        }}>
            <h3 style={sidebarTitleStyle}>FORMATOS DE CAPTURA</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                    onClick={() => navigate('evaluacion-docente')}
                    style={{ 
                        ...linkStyle,
                        backgroundColor: isActive('evaluacion-docente') ? 'rgba(255,255,255,0.2)' : 'transparent'
                    }}
                >
                    <span style={bulletStyle}></span>
                    Evaluación Docente
                </button>
            </nav>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO (LIBRE Y CENTRADA) */}
      <main style={{ 
          flexGrow: 1, 
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
          width: '100%',
          marginLeft: '0' 
      }}>
        <div style={{ width: '100%', maxWidth: '1100px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// --- ESTILOS REVISADOS ---
const sidebarBaseStyle = {
    top: '250px', // Ajusta esta altura para que no choque con el banner del TESJo
    backgroundColor: '#00264D', 
    borderRadius: '0 15px 15px 0', 
    zIndex: 3000, 
    boxShadow: '4px 0 15px rgba(0,0,0,0.2)',
    overflow: 'hidden'
};

const smallHandleStyle = {
    position: 'absolute', 
    top: '50%', 
    right: '0px',
    transform: 'translateY(-50%)', 
    width: '10px', 
    height: '50px',
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: '10px 0 0 10px',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    cursor: 'pointer'
};

const sidebarTitleStyle = { color: 'white', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '15px', paddingBottom: '5px', borderBottom: '1px solid rgba(255,255,255,0.1)' };
const linkStyle = { color: 'white', border: 'none', cursor: 'pointer', padding: '10px', textAlign: 'left', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' };
const bulletStyle = { backgroundColor: '#ff66aa', width: '8px', height: '12px', borderRadius: '2px' };

export default DesarrolloAcademicoLayout;