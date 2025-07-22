const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generarFacturaPDF(venta, callback) {
  const doc = new PDFDocument();
  const nombreArchivo = `factura_venta_${venta.id}.pdf`;
  const ruta = path.join(__dirname, `../../uploads/${nombreArchivo}`);

  const stream = fs.createWriteStream(ruta);
  doc.pipe(stream);

  doc.fontSize(20).text('FACTURA DE COMPRA DE VEHÍCULO', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`ID Venta: ${venta.id}`);
  doc.text(`Fecha: ${venta.fecha}`);
  doc.text(`Cliente: ${venta.cliente.nombre} (${venta.cliente.correo})`);
  doc.text(`Vehículo: ${venta.automovil.marca} ${venta.automovil.modelo}`);
  doc.text(`Precio: $${venta.automovil.precio.toFixed(2)}`);

  doc.end();

  stream.on('finish', () => callback(null, nombreArchivo));
  stream.on('error', callback);
}

module.exports = {
  generarFacturaPDF
};
