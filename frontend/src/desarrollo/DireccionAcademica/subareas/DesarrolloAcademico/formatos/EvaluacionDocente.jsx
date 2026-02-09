import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Colors, Typography } from '../../../../../components/generalStyle/StylesConfig';
import { fetchEvaluaciones, saveEvaluacion } from '../../../../../api/firebaseService';

const EvaluacionDocente = () => {
  const { periodoId } = useParams();
  const navigate = useNavigate();
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback para el periodo si no viene en la URL
  const periodoActual = periodoId || "Septiembre 2026 – Febrero 2027";

  // --- 1. LÓGICA DE NAVEGACIÓN POR TECLADO ---
  const handleKeyDown = (e) => {
    const cell = e.target;
    if (cell.tagName !== 'TD') return;

    const row = cell.parentElement;
    const cellIndex = Array.from(row.children).indexOf(cell);
    const tbody = row.parentElement;
    const rowIndex = Array.from(tbody.children).indexOf(row);

    let nextCell;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        nextCell = tbody.children[rowIndex - 1]?.children[cellIndex];
        break;
      case 'ArrowDown':
      case 'Enter': 
        e.preventDefault();
        nextCell = tbody.children[rowIndex + 1]?.children[cellIndex];
        break;
      case 'ArrowLeft':
        if (window.getSelection().anchorOffset === 0) {
          e.preventDefault();
          nextCell = row.children[cellIndex - 1];
        }
        break;
      case 'ArrowRight':
        if (window.getSelection().anchorOffset === cell.innerText.length) {
          e.preventDefault();
          nextCell = row.children[cellIndex + 1];
        }
        break;
      default:
        return;
    }

    if (nextCell && nextCell.getAttribute('contentEditable') === 'true') {
      nextCell.focus();
    }
  };

  // --- 2. CARGA Y GUARDADO ---
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const registros = await fetchEvaluaciones(periodoActual);
        setDatos(registros || []); // Aseguramos que siempre sea un array
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [periodoActual]);

  const handleBlur = async (e, programaNombre, campo) => {
    // Limpiamos el valor para que sea solo numérico
    const valorLimpio = e.target.innerText.replace(/[^0-9.]/g, ''); 
    const valorNumerico = valorLimpio === "" ? 0 : Number(valorLimpio);

    const nuevosDatos = [...datos];
    const index = nuevosDatos.findIndex(d => d.programaAcademico === programaNombre);
    
    if (index !== -1) {
      nuevosDatos[index][campo] = valorNumerico;
    } else {
      nuevosDatos.push({
        programaAcademico: programaNombre, 
        periodo: periodoActual, 
        [campo]: valorNumerico
      });
    }
    setDatos(nuevosDatos);

    try {
      await saveEvaluacion({
        periodo: periodoActual, 
        programaAcademico: programaNombre, 
        [campo]: valorNumerico 
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const obtenerValor = (programaNombre, campo) => {
    const registro = datos.find(d => d.programaAcademico === programaNombre);
    // Si el valor es 0 o no existe, devolvemos cadena vacía para el contentEditable
    return registro && registro[campo] !== 0 ? registro[campo] : "";
  };

  // --- 3. CÁLCULOS MATEMÁTICOS (CORREGIDOS PARA EVITAR NaN) ---
  const calcularTotales = () => {
    const totalDocentes = datos.reduce((acc, curr) => acc + (Number(curr.totalDocentes) || 0), 0);
    
    // Filtramos solo las calificaciones que sean números válidos y mayores a 0
    const calificacionesValidas = datos
        .map(d => Number(d.calificacion))
        .filter(val => !isNaN(val) && val > 0);

    const sumaCalificaciones = calificacionesValidas.reduce((acc, curr) => acc + curr, 0);
    const carrerasConDatos = calificacionesValidas.length;

    // Protección contra división por cero
    const promedioCalificacion = carrerasConDatos > 0 
        ? (sumaCalificaciones / carrerasConDatos).toFixed(2) 
        : "0.00";

    return { totalDocentes, promedioCalificacion };
  };

  const { totalDocentes, promedioCalificacion } = calcularTotales();

  const programas = [
    "INGENIERÍA ELECTROMECÁNICA IEME-2010-210", "INGENIERÍA INDUSTRIAL IIND-2010-227",
    "INGENIERÍA INDUSTRIAL IIND-2010-227. EXTENSIÓN ACULCO", "INGENIERÍA EN SISTEMAS COMPUTACIONALES ISIC-2010-224",
    "INGENIERÍA EN SISTEMAS COMPUTACIONALES ISIC-2010-224. EXTENSIÓN ACULCO", "INGENIERÍA MECATRÓNICA IMCT-2010-229",
    "ARQUITECTURA ARQU-2010-204", "CONTADOR PÚBLICO COPU-2010-205",
    "CONTADOR PÚBLICO COPU-2010-205. EXTENSIÓN ACULCO", "INGENIERÍA EN GESTIÓN EMPRESARIAL IGEM-2009-201",
    "INGENIERÍA QUÍMICA IQUI-2010-232", "INGENIERÍA EN MATERIALES IMAT-2010-222",
    "INGENIERÍA EN ANIMACIÓN DIGITAL Y EFECTOS VISUALES IAEV-2012-238", "LICENCIATURA EN TURISMO LTUR-2012-237",
    "LICENCIATURA EN TURISMO LTUR-2012-237. EXTENSIÓN ACULCO"
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando datos de Planeación...</div>;

  return (
    <div className="container" style={{ fontFamily: Typography.principal }}>
      <div className="header-title-container">
        <h2>Evaluación Docente</h2>
      </div>

      <div style={{ 
        backgroundColor: Colors.periodoActivo, color: 'white', padding: '15px', 
        textAlign: 'center', borderRadius: '8px', marginBottom: '20px',
        fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        Periodo: {periodoActual}
      </div>

      <div className="scroll-table" style={{ 
        backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #ddd', position: 'relative'
      }}>
        <table 
          style={{ width: '100%', borderCollapse: 'collapse' }}
          onKeyDown={handleKeyDown}
        >
          <thead>
            <tr style={{ backgroundColor: Colors.barraTitulo, color: 'white' }}>
              <th style={styles.th}>PROGRAMA ACADÉMICO</th>
              <th style={styles.th}>CALIFICACIÓN</th>
              <th style={styles.th}>TOTAL DE DOCENTES</th>
            </tr>
          </thead>
          <tbody>
            {programas.map((programa, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={styles.tdNombre}>{programa}</td>
                <td 
                  style={styles.td} 
                  contentEditable="true" 
                  suppressContentEditableWarning={true} 
                  onBlur={(e) => handleBlur(e, programa, 'calificacion')}
                >
                  {obtenerValor(programa, 'calificacion')}
                </td>
                <td 
                  style={styles.td} 
                  contentEditable="true" 
                  suppressContentEditableWarning={true} 
                  onBlur={(e) => handleBlur(e, programa, 'totalDocentes')}
                >
                  {obtenerValor(programa, 'totalDocentes')}
                </td>
              </tr>
            ))}
            
            <tr style={{ backgroundColor: '#f0f4f8', fontWeight: 'bold', borderTop: '2px solid #00264D' }}>
              <td style={styles.tdNombre}>TOTAL DOCENTES INSTITUCIONAL</td>
              <td style={styles.td}>—</td>
              <td style={styles.td}>{totalDocentes}</td>
            </tr>
            <tr style={{ backgroundColor: '#e1e8f0', fontWeight: 'bold' }}>
              <td style={styles.tdNombre}>PROMEDIO GENERAL DE EVALUACIÓN</td>
              <td style={styles.td}>{promedioCalificacion}</td>
              <td style={styles.td}>—</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
        <button onClick={() => navigate(-1)} style={styles.navButton} title="Regresar">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
        <button onClick={() => navigate(1)} style={styles.navButton} title="Siguiente">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

const styles = {
  th: { padding: '12px', textAlign: 'center', fontSize: '0.75rem', borderRight: '1px solid rgba(255,255,255,0.2)', textTransform: 'uppercase' },
  tdNombre: { padding: '8px 15px', fontSize: '.9rem', textAlign: 'left', borderRight: '1px solid #eee', color: '#333', fontWeight: '500' },
  td: { padding: '8px', textAlign: 'center', fontSize: '0.9rem', borderRight: '1px solid #eee', minWidth: '120px', outline: 'none' },
  navButton: {
    backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', 
    padding: '10px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', color: '#555', transition: 'all 0.2s'
  }
};

export default EvaluacionDocente;