import React, { useState } from 'react';

const EstractorIA = ({ onClose, onSuccess }) => {
    const [cargando, setCargando] = useState(false);
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

    // Función para convertir el archivo a Base64
    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validación de tamaño para evitar que la conexión se cuelgue (máx 2MB)
        if (file.size > 2000000) {
            alert("El archivo es muy pesado. Intenta con una captura de pantalla (máx 2MB).");
            return;
        }

        if (!API_KEY) {
            alert("Error: No se encontró la API KEY en el archivo .env");
            return;
        }

        setCargando(true);

        // Control de tiempo de espera (AbortController)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        try {
            console.log("1. Leyendo archivo...");
            const base64Data = await readFileAsBase64(file);

            console.log("Tipo MIME:", file.type);
            console.log("Base64 length:", base64Data.length);

            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
            console.log("2. Enviando petición a Google Gemini...");

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `
Analiza la tabla de esta imagen y extrae TODOS los registros.

RESPONDE EXCLUSIVAMENTE con un arreglo JSON válido.
NO agregues explicación.
NO agregues texto antes ni después.
NO uses markdown.
NO uses comillas invertidas.

Formato obligatorio:

[
  {
    "programaAcademico": "texto",
    "calificacion": numero,
    "totalDocentes": numero
  }
]

Extrae una fila por cada programa académico visible en la tabla.
`
                                },
                                {
                                    inlineData: {
                                        mimeType: file.type,
                                        data: base64Data
                                    }
                                }
                            ]
                        }
                    ]
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Error en la petición a la IA");
            }

            console.log("3. Respuesta recibida con éxito:", data);

            // Simulación temporal para mantener tu estructura intacta
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            console.log("Texto IA:", rawText);

            // Aquí mantenemos tu parsing original por si devuelve JSON después
            const jsonMatch = rawText.match(/\[[\s\S]*\]/);

            if (!jsonMatch) {
                throw new Error("La IA respondió, pero no devolvió un JSON válido todavía. Revisa consola.");
            }

            const datosExtraidos = JSON.parse(jsonMatch[0]);
            console.log("4. Datos extraídos:", datosExtraidos);

            onSuccess(datosExtraidos);
            onClose();

        } catch (error) {
            if (error.name === 'AbortError') {
                alert("La conexión tardó demasiado. Verifica tu internet e intenta con una imagen más pequeña.");
            } else {
                console.error("Error en el Extractor:", error);
                alert("Error: " + error.message);
            }
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h3 style={styles.title}>📎 PROCESADOR IA PSICEI</h3>
                    <button onClick={onClose} style={styles.closeX} disabled={cargando}>&times;</button>
                </div>
                <div style={styles.body}>
                    {cargando ? (
                        <div style={styles.loadingArea}>
                            <div className="spinner"></div>
                            <p style={{ marginTop: '15px', fontWeight: 'bold' }}>Analizando datos...</p>
                            <p style={{ fontSize: '11px', color: '#666' }}>Esto puede tardar unos segundos.</p>
                        </div>
                    ) : (
                        <div style={styles.uploadContainer}>
                            <label style={styles.uploadBtn}>
                                <span>☁️ Seleccionar Archivo (Imagen/PDF)</span>
                                <input type="file" hidden accept=".pdf,image/*" onChange={handleFileUpload} />
                            </label>
                            <p style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
                                Sube el reporte de evaluación docente.
                            </p>
                        </div>
                    )}
                </div>
                <div style={styles.footer}>
                    <button onClick={onClose} style={styles.btnCerrar} disabled={cargando}>Cancelar</button>
                </div>
            </div>
            <style>{`
                .spinner { 
                    border: 4px solid #f3f3f3; 
                    border-top: 4px solid #1c3170; 
                    border-radius: 50%; 
                    width: 40px; 
                    height: 40px; 
                    animation: spin 1s linear infinite; 
                    margin: 0 auto; 
                } 
                @keyframes spin { 
                    0% { transform: rotate(0deg); } 
                    100% { transform: rotate(360deg); } 
                }
            `}</style>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
    },
    modal: {
        backgroundColor: 'white',
        width: '400px',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
    },
    title: {
        margin: 0,
        fontSize: '16px',
        color: '#1c3170',
        fontWeight: 'bold'
    },
    body: {
        padding: '30px 0'
    },
    loadingArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    uploadContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    uploadBtn: {
        backgroundColor: '#1c3170',
        color: 'white',
        padding: '12px 25px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        borderTop: '1px solid #eee',
        paddingTop: '10px'
    },
    btnCerrar: {
        padding: '8px 15px',
        cursor: 'pointer',
        borderRadius: '5px',
        border: '1px solid #ccc',
        background: 'white'
    },
    closeX: {
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        color: '#999'
    }
};

export default EstractorIA;