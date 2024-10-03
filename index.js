const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.URI;

// Middleware
app.use(cors());
app.use(express.json());

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
        console.log("Conexión exitosa a MongoDB");
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
}

run();



const noteSchema = new mongoose.Schema({
    content: { type: String, required: true },  // Requiere que 'content' esté presente
    date: { type: Date, default: Date.now },    // Asigna la fecha actual por defecto
    important: { type: Boolean, default: false }, // Asigna 'false' por defecto
});


const Note = mongoose.model('Note', noteSchema)

const unknownRoute = (req, res) => {
    res.status(404).json({ error: 'Unknown endpoint' });
  };
  
  // Routes
  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
  });
  
  app.get('/api/notes', async (req, res) => {
    try {
        console.log("funcina");
      const notes = await Note.find({});
      console.log(notes);
      
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching notes' });
    }
  });
  
  app.get('/api/notes/:id', async (req, res) => {
    try {
      const note = await Note.findById(req.params.id);
      if (note) {
        res.json(note);
      } else {
        res.status(404).json({ error: 'Note not found' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Invalid ID format' });
    }
  });
  
  app.post('/api/notes', async (req, res) => {
    const { content, important } = req.body;
  
    if (!content) {
      return res.status(400).json({ error: 'Content missing' });
    }
  
    try {
      const newNote = new Note({
        content,
        important: important || false
      });
      const savedNote = await newNote.save();
      res.status(201).json(savedNote);
    } catch (error) {
      res.status(500).json({ error: 'Error saving the note' });
    }
  });
  
  app.put('/api/notes/:id', async (req, res) => {
    const { content, important } = req.body;
  
    try {
      const updatedNote = await Note.findByIdAndUpdate(
        req.params.id,
        { content, important },
        { new: true, runValidators: true }
      );
      if (updatedNote) {
        res.json(updatedNote);
      } else {
        res.status(404).json({ error: 'Note not found' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Invalid data or ID format' });
    }
  });
  
  app.delete('/api/notes/:id', async (req, res) => {
    try {
      const deletedNote = await Note.findByIdAndDelete(req.params.id);
      if (deletedNote) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Note not found' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Invalid ID format' });
    }
  });
  
  // Handle unknown routes
  app.use(unknownRoute);
  
  // Server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });