const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Configuración de multer para guardar en ./public/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Cambia el nombre para evitar conflictos (timestamp + originalname)
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

app.use(express.static('public'));
app.use('/admin', express.static('admin'));
app.use(express.json());

// API para obtener slides
app.get('/api/slides', (req, res) => {
  const data = JSON.parse(fs.readFileSync('slides.json'));
  res.json(data);
});

// API para crear slides
app.post('/api/slides', (req, res) => {
  const slides = JSON.parse(fs.readFileSync('slides.json'));
  slides.push(req.body);
  fs.writeFileSync('slides.json', JSON.stringify(slides, null, 2));
  res.sendStatus(200);
});

// API para eliminar slides
app.delete('/api/slides/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const slides = JSON.parse(fs.readFileSync('slides.json'));
  slides.splice(index, 1);
  fs.writeFileSync('slides.json', JSON.stringify(slides, null, 2));
  res.sendStatus(200);
});

// API para subir imágenes
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });
  // Devuelve la URL pública para acceder a la imagen
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
