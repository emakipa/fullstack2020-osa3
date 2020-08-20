require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())

// cors (Cross-origin resource sharing)
app.use(cors())

// morgan custom token
morgan.token('data', function getData (req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  else {
    return ''
  }
})

// morgan middelware, log to console using custom configuration
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

// routes

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// get all persons
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

// get phonebook info
app.get('/info', (req, res) => {
  let date = new Date()

  Person.find({})
    .then(persons => {
      res.send(`
        <div>
          <p>Phonebook has info for ${persons.length} people </p>
          <p> ${date}</p>
        </div>
      `)
    })
})

// get person with specific id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// delete data with specific id
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// add new data to phonebook
app.post('/api/persons/', (req, res, next) => {

  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      res.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})

// update phone number
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

// unknown endpoint handling
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// unknown request handling
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
