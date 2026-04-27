// StylesConfig.js
// Asegúrate de que el nombre del archivo 'tipography' sea exacto (con 'i' o 'y')
import { Typography as TypographyData } from './tipography';

export const Colors = {
    institucional: '#1c3170',
    barraTitulo: '#00264D',
    franjaGris: '#B0B0B0',
    fondoGris: '#f4f4f4',
    textoBlanco: '#ffffff',
    estadoEnLinea: '#31a24c',
    periodoActivo: '#0066cc',
    error: '#d32f2f',
    iaGradient: 'linear-gradient(135deg, #1c3170 0%, #2d88ff 100%)',
    accent: '#fff9c4' // Añadido para el focus de las tablas
};

export const Assets = {
    header: '/assets/header-bg.png',
    footer: '/assets/pagg.png',
    // Avatar dinámico de Icons8
    avatarDefault: 'https://img.icons8.com/?size=100&id=povlgAcqxwW6&format=png&color=000000',
    iconIA: 'https://img.icons8.com/m_outlined/512/FFFFFF/artificial-intelligence.png',

    // --- NUEVOS ICONOS DE NAVEGACIÓN (SVG) ---
    // Sustituimos los anteriores por los de círculo relleno que pediste
    iconBack: (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
        </svg>
    ),
    iconNext: (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
        </svg>
    ),

    iconHome: 'http://www.w3.org/2000/svg'  
};

export const Typography = TypographyData;