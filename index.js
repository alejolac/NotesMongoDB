const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())

app.use(express.json())

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
]
const url = `mongodb://alejo:alejo123@ac-wemx38j-shard-00-00.mbuupbd.mongodb.net:27017,ac-wemx38j-shard-00-01.mbuupbd.mongodb.net:27017,ac-wemx38j-shard-00-02.mbuupbd.mongodb.net:27017/?ssl=true&replicaSet=atlas-92fx11-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message)
    })

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const unknowRoute = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.get(`/`, (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get(`/api/notes/:id`, async (req, res) => {
    const id = req.params.id
    const note = await Note.findById(id)
    if (note) {
        res.json(note)
    }
    else {
        res.status(404).end()
    }
})

app.delete(`/api/notes/:id`, async (req, res) => {
    const id = req.params.id
    const deleteNote = await Note.findByIdAndDelete(id)
    res.json(deleteNote).status(204).end()
    console.log(deleteNote)
})

app.post(`/api/notes`, (req, res) => {
    const body = req.body

    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        date: new Date(),
        important: body.important || false,
        id: new mongoose.Types.ObjectId()
    })

    note.save().then(savedNote => {
        res.json(savedNote)
    })
})

app.put(`/api/notes/:id`, async (req, res) => {
    const id = req.params.id
    await Note.updateOne({ _id: id }, req.body)
    const updateNote = await Note.findById(id)
    res.json(updateNote)
})


app.use(unknowRoute)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})