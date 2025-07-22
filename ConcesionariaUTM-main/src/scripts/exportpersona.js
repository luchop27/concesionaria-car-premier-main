require('dotenv').config();
const ExcelJS = require('exceljs');
const { Client } = require('pg');

const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});

async function exportarPersonasExcel() {
    try {
        await client.connect();
        console.log('✅ Conectado a la base de datos concesionaria');

        const query = `
            SELECT 
                id_persona,
                nombre,
                apellido,
                email,
                telefono,
                direccion
            FROM persona;
        `;
        const result = await client.query(query);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Personas');

        // Estilos de encabezado
        worksheet.columns = [
            { header: 'ID', key: 'id_persona', width: 10 },
            { header: 'Nombre', key: 'nombre', width: 20 },
            { header: 'Apellido', key: 'apellido', width: 20 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Teléfono', key: 'telefono', width: 15 },
            { header: 'Dirección', key: 'direccion', width: 30 },
        ];

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { horizontal: 'center' };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFCCE5FF' },
        };

        result.rows.forEach(row => {
            worksheet.addRow(row);
        });

        const fecha = new Date().toISOString().slice(0, 10);
        const fileName = `personas_export_${fecha}.xlsx`;

        await workbook.xlsx.writeFile(fileName);
        console.log(`✅ Archivo Excel generado: ${fileName}`);

        await client.end();
    } catch (error) {
        console.error('❌ Error exportando personas:', error);
        await client.end();
    }
}

exportarPersonasExcel();
