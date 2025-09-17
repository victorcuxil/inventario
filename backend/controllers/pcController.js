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

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM computadoras ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener computadoras' });
  }
};

exports.create = async (req, res) => {
  const { marca, modelo, procesador, ram, disco, sistema_operativo, laboratorio } = req.body;
  try {
    await pool.query(
      'INSERT INTO computadoras (marca, modelo, procesador, ram, disco, sistema_operativo, laboratorio) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [marca, modelo, procesador, ram, disco, sistema_operativo, laboratorio]
    );
    res.json({ msg: 'Computadora agregada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar computadora' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { marca, modelo, procesador, ram, disco, sistema_operativo, laboratorio } = req.body;
  try {
    await pool.query(
      'UPDATE computadoras SET marca=$1, modelo=$2, procesador=$3, ram=$4, disco=$5, sistema_operativo=$6, laboratorio=$7 WHERE id=$8',
      [marca, modelo, procesador, ram, disco, sistema_operativo, laboratorio, id]
    );
    res.json({ msg: 'Actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

exports.delete = async (req, res) => {
  try {
    await pool.query('DELETE FROM computadoras WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};

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
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: [
              ['Marca', 'Modelo', 'Procesador', 'RAM', 'Disco', 'SO', 'Laboratorio'],
              ...computadoras.map(c => [c.marca, c.modelo, c.procesador, c.ram, c.disco, c.sistema_operativo, c.laboratorio])
            ]
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] }
      }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=inventario.pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (err) {
    res.status(500).json({ error: 'Error al generar PDF' });
  }
};