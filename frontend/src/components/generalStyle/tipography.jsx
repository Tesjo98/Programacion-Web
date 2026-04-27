export const Typography = {
    family: {
        principal: "'Montserrat', sans-serif",
        datos: "'Inter', sans-serif"
    },

    // Título de la página 
    titlePrincipal: {
        fontSize: '1.4rem',
        fontWeight: '700', // Negrita
        fontFamily: "'Montserrat', sans-serif",
        textAlign: 'center',
        textTransform: 'uppercase'
    },

    // Subtítulo (Ej: Periodo ...)
    subtitlePeriodo: {
        fontSize: '1rem',
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: '400', // Normal
        color: '#333'
    },

    // Encabezados de tablas (Negritas forzadas)
    tableHeader: {
        fontSize: '0.75rem',
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: '700',
        textTransform: 'uppercase',
        color: 'white'
    },

    // Encabezados de tablas (Negritas forzadas)
    Footer: {
        fontSize: '0.75rem',
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: '700',
        textTransform: 'uppercase',
        color: 'white'
    },
// Celdas de tablas (Contenido limpio sin negritas)
    tableCell: {
        fontSize: '0.8rem',
        fontFamily: "'Inter', sans-serif",
        fontWeight: '400',
        lineHeight: '1.4'
    }
};

export default Typography;