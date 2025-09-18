const pool = require('../db');
const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

const fonts = {
  Roboto: {
    normal: path.join(__dirname, '../fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '../fonts/Roboto-Medium.ttf'),
  },
};

/* ----------  OBTENER TODAS  ---------- */
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM computadoras ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener computadoras' });
  }
};

/* ----------  CREAR  ---------- */
exports.create = async (req, res) => {
  const {
    marca,
    modelo,
    procesador,
    ram,
    disco,
    sistema_operativo,
    laboratorio,
    fecha_registro,
    responsable,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO computadoras 
       (marca, modelo, procesador, ram, disco, sistema_operativo, laboratorio, fecha_registro, responsable) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        marca,
        modelo,
        procesador,
        ram,
        disco,
        sistema_operativo,
        laboratorio,
        fecha_registro || new Date().toISOString().slice(0, 10),
        responsable,
      ]
    );
    res.json({ msg: 'Computadora agregada' });
  } catch (err) {
    console.error('❌ Error al agregar:', err);
    res.status(500).json({ error: 'Error al agregar computadora' });
  }
};

/* ----------  ACTUALIZAR  ---------- */
exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    marca,
    modelo,
    procesador,
    ram,
    disco,
    sistema_operativo,
    laboratorio,
    fecha_registro,
    responsable,
  } = req.body;

  try {
    await pool.query(
      `UPDATE computadoras 
       SET marca=$1, modelo=$2, procesador=$3, ram=$4, disco=$5, sistema_operativo=$6, laboratorio=$7, fecha_registro=$8, responsable=$9 
       WHERE id=$10`,
      [
        marca,
        modelo,
        procesador,
        ram,
        disco,
        sistema_operativo,
        laboratorio,
        fecha_registro,
        responsable,
        id,
      ]
    );
    res.json({ msg: 'Actualizado' });
  } catch (err) {
    console.error('❌ Error al actualizar:', err);
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

/* ----------  ELIMINAR  ---------- */
exports.delete = async (req, res) => {
  try {
    await pool.query('DELETE FROM computadoras WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Eliminado' });
  } catch (err) {
    console.error('❌ Error al eliminar:', err);
    res.status(500).json({ error: 'Error al eliminar' });
  }
};

/* ----------  GENERAR PDF  ---------- */
exports.generatePDF = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM computadoras');
    const computadoras = result.rows;

    const printer = new PdfPrinter(fonts);
    const docDefinition = {
      content: [
        { text: 'Inventario de Computadoras', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*'],
            body: [
              [
                'Marca',
                'Modelo',
                'Procesador',
                'RAM',
                'Disco',
                'SO',
                'Laboratorio',
                'Fecha',
                'Responsable',
              ],
              ...computadoras.map((c) => [
                c.marca,
                c.modelo,
                c.procesador,
                c.ram,
                c.disco,
                c.sistema_operativo,
                c.laboratorio,
                c.fecha_registro,
                c.responsable,
              ]),
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=inventario.pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (err) {
    console.error('❌ Error al generar PDF:', err);
    res.status(500).json({ error: 'Error al generar PDF' });
  }
};