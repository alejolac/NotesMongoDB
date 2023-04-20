const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')

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

const unknowRoute = (req, res) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const generateID = () => {
    const MAXid = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return MAXid + 1
}

app.get(`/`, (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get(`/api/notes/:id`, (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        res.json(note)
    } else {
        res.status(400).end()
    }
})

app.delete(`/api/notes/:id`, (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})

app.post(`/api/notes`, (req, res) => {
    const body = req.body

    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateID(),
    }

    notes = notes.concat(note)

    res.json(note)
})

app.put(`/api/notes/:id`, (req, res) => {
    const id = Number(req.params.id)
    const body = req.body
    let note = notes.find(note => note.id === id)
    if (note) {
        notes = notes.map(note => note.id === id ? body : note)
        res.json(body)
    }
})


app.use(unknowRoute)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})