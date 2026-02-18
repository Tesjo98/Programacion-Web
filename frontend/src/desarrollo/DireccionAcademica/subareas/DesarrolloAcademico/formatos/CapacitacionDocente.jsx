import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useExport from '../../../../../hooks/useExport';
import { Colors, Assets, Typography } from '../../../../../components/generalStyle/StylesConfig';
import { fetchEvaluaciones, saveEvaluacion } from '../../../../../api/firebaseService';
import { useTableLogic } from '../../../../../hooks/useTableLogic';

// HEREDAMOS LOS COMPONENTES REUTILIZABLES CENTRALIZADOS
import {
    BotonSincronizar,
    BotonAgregar,
    BotonLimpiar,
    BotonEliminar,
    BotonNuevaColumna
} from '../../../../../components/BotonesTablas';

const CapacitacionDocente = () => {
    const { periodoId } = useParams();
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actualizando, setActualizando] = useState(false);

    // ESTRUCTURA INICIAL DE COLUMNAS (MÁS DE 8 ACTIVA MODO HORIZONTAL AUTOMÁTICO)
    const [columnas, setColumnas] = useState([
        { key: 'curso', label: 'NOMBRE DEL CURSO' },
        { key: 'diplomado', label: 'NOMBRE DEL DIPLOMADO' },
        { key: 'institucion', label: 'INSTITUCIÓN QUE LO IMPARTE' },
        { key: 'instructor', label: 'NOMBRE DEL INSTRUCTOR' },
        { key: 'duracion', label: 'DURACIÓN' },
        { key: 'periodo', label: 'PERIODO INICIO Y TERMINO' },
        { key: 'lugar', label: 'LUGAR' },
        { key: 'beca', label: 'BECA' },
        { key: 'tipo', label: 'TIPO DE CURSOS' },
        { key: 'participante', label: 'NOMBRE DEL PARTICIPANTE' },
        { key: 'sexo', label: 'SEXO' },
        { key: 'discapacidad', label: 'CON DISCAPACIDAD' },
        { key: 'indigena', label: 'HABLANTES DE LENGUAJES INDÍGENAS' },
        { key: 'programa', label: 'PROGRAMA ACADÉMICO' }
    ]);

    const { exportToPDF, exportToExcel } = useExport();
    const periodoActual = periodoId || "Septiembre 2025 – Febrero 2026";

    // PARÁMETRO DE CONTROL: Activa estética y exportación horizontal
    const esHorizontal = columnas.length > 8;

    const { handleKeyDown, handleBlurCell } = useTableLogic(datos, setDatos, columnas.length);

    useEffect(() => {
        // ENLAZADO AL FORMATO DE IMPRESIÓN PDF HORIZONTAL
        const handlePDF = () => exportToPDF(
            'area-oficial-impresion',
            `Capacitación Docente - ${periodoActual}`,
            esHorizontal ? 'landscape' : 'portrait' 
        );

        const handleExcel = () => exportToExcel(datos, `Capacitación Docente - ${periodoActual}`);
        window.addEventListener('descargar-pdf-global', handlePDF);
        window.addEventListener('descargar-excel-global', handleExcel);
        return () => {
            window.removeEventListener('descargar-pdf-global', handlePDF);
            window.removeEventListener('descargar-excel-global', handleExcel);
        };
    }, [datos, periodoActual, esHorizontal]);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const idDoc = `capacitacion-docente-${periodoActual}`;
                const registros = await fetchEvaluaciones(idDoc);
                if (registros && registros.registros) {
                    setDatos(registros.registros);
                } else {
                    const filaInicial = { id: Date.now() };
                    columnas.forEach(col => filaInicial[col.key] = '');
                    setDatos([filaInicial]);
                }
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        cargarDatos();
    }, [periodoActual]);

    // --- ACCIONES HEREDADAS Y DINÁMICAS ---
    const agregarFila = () => {
        const nuevaFila = { id: Date.now() };
        columnas.forEach(col => nuevaFila[col.key] = '');
        setDatos([...datos, nuevaFila]);
    };

    const eliminarFila = (id) => {
        if (datos.length > 1) setDatos(datos.filter(f => f.id !== id));
    };

    const handleLimpiarTabla = () => {
        if (window.confirm("¿Deseas vaciar la tabla?")) {
            const filaLimpia = { id: Date.now() };
            columnas.forEach(col => filaLimpia[col.key] = '');
            setDatos([filaLimpia]);
        }
    };

    const handleAgregarColumna = () => {
        const nombre = prompt("Ingrese el nombre del nuevo atributo (Columna):");
        if (nombre) {
            const keyNueva = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_');
            setColumnas([...columnas, { key: keyNueva, label: nombre.toUpperCase() }]);
            // Actualizamos registros existentes para incluir el nuevo campo en blanco
            setDatos(datos.map(fila => ({ ...fila, [keyNueva]: '' })));
        }
    };

    const handleSincronizar = async () => {
        setActualizando(true);
        try {
            await saveEvaluacion({ 
                id: `capacitacion-docente-${periodoActual}`, 
                registros: datos, 
                periodo: periodoActual,
                tipoFormato: "Capacitación Docente" 
            });
            alert("¡Registro de capacitación guardado con éxito!");
        } catch (error) { alert("Error al guardar en la base de datos."); }
        finally { setActualizando(false); }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando Formato de Capacitación...</div>;

    return (
        <div className="container" style={styles.mainContainer}>
            <style>
                {`
          @media print {
            @page { 
              size: ${esHorizontal ? 'landscape' : 'portrait'}; 
              margin: 0.5cm; 
            }
            body { -webkit-print-color-adjust: exact; }
          }

          @media screen { .solo-pdf-captura { position: absolute; left: -9999px; } }
          .no_imprimir_botones_ia { display: flex; }
          td[contenteditable="true"]:focus { background-color: #fff9c4 !important; outline: none; }
          
          .fila-datos { position: relative; }
          .contenedor-eliminar {
            position: absolute;
            right: -35px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 10;
          }
          .fila-datos:hover .contenedor-eliminar { opacity: 1; }

          td[contenteditable="true"] {
            user-select: text;
            -webkit-user-modify: read-write-plaintext-only;
            word-break: break-word;
            white-space: normal;
          }
        `}
            </style>

            <div id="area-oficial-impresion" style={{
                ...styles.pageWrapper,
                maxWidth: esHorizontal ? '1600px' : '1100px' // Se abre hacia las orillas si es horizontal
            }}>

                <div className="solo-pdf-captura" style={styles.fullImageContainer}>
                    <img src={Assets.header} alt="Header" style={styles.fullWidthImg} />
                </div>

                <div style={styles.marginContent}>
                    <div style={styles.contentHeader}>
                        <h2 style={styles.titlePrincipal}>CAPACITACIÓN PERSONAL DOCENTE</h2>
                        <p style={styles.subtitlePeriodo}>Periodo: {periodoActual}</p>
                        <div style={styles.divider} />
                    </div>

                    <div style={styles.tableWrapper}>
                        <div style={styles.tableContainer}>
                            <form autoComplete="off" action="none">
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={{ backgroundColor: Colors.barraTitulo || '#00264D', color: 'white' }}>
                                            <th colSpan={columnas.length} style={styles.thMain}>DETALLE DE CAPACITACIÓN INSTITUCIONAL</th>
                                        </tr>
                                        <tr style={{ backgroundColor: Colors.barraTitulo || '#00264D', color: 'white', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                                            {columnas.map((col) => (
                                                <th key={col.key} style={styles.th}>{col.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datos.map((fila, index) => (
                                            <tr key={fila.id} className="fila-datos" style={{ borderBottom: '1px solid #eee' }}>
                                                {columnas.map((col, colIdx) => (
                                                    <td
                                                        key={`${fila.id}-${col.key}`}
                                                        style={styles.td}
                                                        contentEditable="true"
                                                        suppressContentEditableWarning
                                                        onKeyDown={(e) => handleKeyDown(e, index, colIdx)}
                                                        onBlur={(e) => handleBlurCell(index, col.key, e.target.innerText)}
                                                        autoComplete="off"
                                                        spellCheck="false"
                                                    >
                                                        {fila[col.key]}
                                                    </td>
                                                ))}
                                                {/* BOTÓN ELIMINAR FLOTANTE HEREDADO */}
                                                <div className="contenedor-eliminar no_imprimir_botones_ia">
                                                    <BotonEliminar onClick={() => eliminarFila(fila.id)} />
                                                </div>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </form>
                        </div>
                    </div>

                    {/* BOTONERA REUTILIZABLE DEBAJO DE LA TABLA */}
                    <div className="no_imprimir_botones_ia" style={styles.buttonContainer}>
                        <BotonLimpiar onClick={handleLimpiarTabla} />
                        <BotonNuevaColumna onClick={handleAgregarColumna} />
                        <BotonAgregar onClick={agregarFila} />
                        <BotonSincronizar onClick={handleSincronizar} loading={actualizando} />
                    </div>
                </div>

                <div className="solo-pdf-captura" style={styles.fullImageContainerFooter}>
                    <img src={Assets.footer} alt="Footer" style={styles.fullWidthImg} />
                </div>
            </div>
        </div>
    );
};

const styles = {
    mainContainer: { width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: '20px 0' },
    pageWrapper: {
        backgroundColor: 'white',
        width: '98%', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)'
    },
    fullImageContainer: { width: '100%' },
    fullImageContainerFooter: { width: '100%', marginTop: 'auto' },
    marginContent: { padding: '20px 2%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
    fullWidthImg: { width: '100%', display: 'block' },
    contentHeader: { width: '100%', textAlign: 'center', marginBottom: '20px' },
    titlePrincipal: { margin: '0', fontSize: '1.2rem', fontWeight: 'bold', color: '#000' },
    subtitlePeriodo: { margin: '2px 0', fontSize: '1rem', color: '#333' },
    divider: { height: '3px', backgroundColor: '#00264D', width: '100%', marginTop: '10px' },
    tableWrapper: { width: '100%', display: 'flex', justifyContent: 'center' },
    tableContainer: { width: '100%', border: '1px solid #ccc', borderRadius: '4px', overflow: 'visible' },
    table: { width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }, 
    thMain: { padding: '10px', fontSize: '0.8rem', fontWeight: 'bold' },
    th: { padding: '6px', textAlign: 'center', fontSize: '0.55rem', borderRight: '1px solid rgba(255,255,255,0.1)', wordWrap: 'break-word' },
    td: { padding: '6px', textAlign: 'center', fontSize: '0.6rem', outline: 'none', borderRight: '1px solid #eee' },
    buttonContainer: { display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '25px', width: '100%' }
};

export default CapacitacionDocente;