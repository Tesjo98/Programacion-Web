import { useState } from 'react';

export const useTableLogic = (datos, setDatos, numColumnas) => {

    const eliminarFila = (id) => {
        if (datos.length > 1) {
            setDatos(datos.filter(f => f.id !== id));
        }
    };

    const handleBlurCell = (index, campo, valor) => {
        const nuevosDatos = [...datos];
        if (nuevosDatos[index]) {
            nuevosDatos[index][campo] = valor;
            setDatos(nuevosDatos);
        }
    };

    const handleKeyDown = (e, rowIndex, colIndex) => {
        const currentCell = e.target;
        const currentRow = currentCell.closest('tr');
        const tbody = currentRow.closest('tbody');
        if (!tbody) return;

        let nextCell;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                // Busca la fila que está físicamente arriba en el DOM
                const prevRow = currentRow.previousElementSibling;
                if (prevRow) nextCell = prevRow.cells[colIndex];
                break;

            case 'ArrowDown':
            case 'Enter':
                e.preventDefault();
                // Busca la fila que está físicamente abajo en el DOM
                const nextRow = currentRow.nextElementSibling;
                if (nextRow) nextCell = nextRow.cells[colIndex];
                break;

            case 'ArrowLeft':
                if (colIndex > 0) {
                    e.preventDefault();
                    nextCell = currentRow.cells[colIndex - 1];
                }
                break;

            case 'ArrowRight':
                // Nota: numColumnas incluye la de texto (nombre), pero aquí navegamos en celdas
                if (colIndex < currentRow.cells.length - 1) {
                    e.preventDefault();
                    nextCell = currentRow.cells[colIndex + 1];
                }
                break;

            default: return;
        }

        if (nextCell && nextCell.getAttribute('contenteditable') === 'true') {
            nextCell.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(nextCell);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    return { eliminarFila, handleKeyDown, handleBlurCell };
};