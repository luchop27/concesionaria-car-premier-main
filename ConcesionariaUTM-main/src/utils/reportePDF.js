// utils/reportePDF.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generarFacturaPDF = async (datosFactura) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const filename = `factura_${datosFactura.id_venta}_${Date.now()}.pdf`; // Nombre único para el archivo
        const filePath = path.join(__dirname, '../uploads/facturas', filename); // Ruta donde se guardará

        // Asegúrate de que la carpeta exista
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc.fontSize(25).text('Factura de Venta', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`ID Venta: ${datosFactura.id_venta}`);
        doc.text(`Fecha: ${datosFactura.fecha_venta}`);
        doc.moveDown();
        doc.text(`Cliente: ${datosFactura.nombre_cliente} (${datosFactura.documento_cliente})`);
        doc.text(`Automóvil: ${datosFactura.nombre_automovil}`); // Asegúrate de pasar este dato
        doc.text(`Matrícula: ${datosFactura.matricula}`);
        doc.text(`Encargado de Fábrica: ${datosFactura.encargado_fabrica}`);
        doc.moveDown();
        doc.fontSize(14).text(`Total: $${parseFloat(datosFactura.total).toFixed(2)}`, { align: 'right' });

        doc.end();

        stream.on('finish', () => {
            console.log(`Factura generada y guardada en: ${filePath}`);
            // ¡Aquí es donde se define la URL que se guarda en la DB y usa el frontend!
            resolve(`/uploads/facturas/${filename}`); // Asegúrate de que esta URL sea la que quieres
        });

        stream.on('error', (err) => {
            console.error('Error FATAL al generar PDF:', err);
            reject(err);
        });
    });
};

module.exports = {
    generarFacturaPDF
};