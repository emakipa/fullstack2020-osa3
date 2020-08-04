const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

// routes

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// get phonebook info
app.get('/info', (req, res) => {
    date = new Date()
    res.send(`
      <div>
        <p>Phonebook has info for ${persons.length} people </p>
        <p> ${date}</p>
      </div>
    `)
  })

// get person with specific id
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// delete data with specific id
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

// add new data to phonebook
app.post('/api/persons/', (req, res) => {

  const body = req.body
  
  // check name and number
  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'name or number or both missing' 
    })
  }
  
  // check if person already exists
  if (persons.map(person => person.name).includes(body.name)) { 
    return res.status(400).json({ 
      error: `${body.name} is already added to phonebook, name must be unique`
    })
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000) + 1,
  }
  
  persons = persons.concat(person)
  
  res.json(person)
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)
