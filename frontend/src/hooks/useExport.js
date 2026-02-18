import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const useExport = () => {

  // Agregamos el parámetro 'orientacion' que por defecto es 'p' (portrait/vertical)
  const exportToPDF = async (elementId, tituloArchivo, orientacion = 'p') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 3, // Máxima nitidez
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Aseguramos que los logos se expandan en la captura
          const logos = clonedDoc.getElementsByClassName('solo-pdf-captura');
          for (let logo of logos) {
            logo.style.position = 'static';
            logo.style.display = 'block';
            logo.style.visibility = 'visible';
            logo.style.height = 'auto';
          }
          // OCULTAMOS TODOS LOS BOTONES E INTERFACES EN EL PDF
          const botonesContenedores = clonedDoc.querySelectorAll('.no_imprimir_botones_ia');
          botonesContenedores.forEach(contenedor => {
            contenedor.style.display = 'none';
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');

      // Ajustamos la creación del PDF para usar la orientación recibida ('p' o 'l')
      const pdf = new jsPDF(orientacion, 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${tituloArchivo}.pdf`);
    } catch (error) {
      console.error("Error PDF:", error);
    }
  };

  const exportToExcel = async (datos, tituloArchivo) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Evaluación');

    // --- INSERTAR LOGO ---
    try {
      const response = await fetch('/assets/logo_tesjo.jpg'); // Ruta de tu logo
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const logoId = workbook.addImage({
        buffer: arrayBuffer,
        extension: 'jpeg',
      });
      worksheet.addImage(logoId, {
        tl: { col: 0, row: 0 },
        ext: { width: 100, height: 60 }
      });
    } catch (e) { console.warn("No se pudo cargar el logo en Excel"); }

    // Configuración de espacio para el logo
    worksheet.getRow(1).height = 50;

    // Título y Columnas
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value = tituloArchivo.toUpperCase();
    worksheet.getCell('A2').font = { bold: true, size: 14 };
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    worksheet.columns = [
      { header: 'PROGRAMA ACADÉMICO', key: 'p', width: 55 },
      { header: 'CALIFICACIÓN', key: 'c', width: 15 },
      { header: 'TOTAL DOCENTES', key: 't', width: 15 },
    ];

    // Formato de tabla (Fila 4 para dejar aire al logo)
    const headerRow = worksheet.getRow(4);
    headerRow.values = ['PROGRAMA ACADÉMICO', 'CALIFICACIÓN', 'TOTAL DE DOCENTES'];
    headerRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00264D' } };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    datos.forEach(item => {
      const row = worksheet.addRow([item.programaAcademico, item.calificacion, item.totalDocentes]);
      row.getCell(2).alignment = { horizontal: 'center' };
      row.getCell(3).alignment = { horizontal: 'center' };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${tituloArchivo}.xlsx`);
  };

  return { exportToPDF, exportToExcel };
};

export default useExport;