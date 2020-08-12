const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = 
  `mongodb://fullstack:${password}@cluster0-shard-00-00.cjzpf.mongodb.net:27017,cluster0-shard-00-01.cjzpf.mongodb.net:27017,cluster0-shard-00-02.cjzpf.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-2m8ky1-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => console.log(err))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {

  const newName = process.argv[3]
  const newNumber = process.argv[4]

  const person = new Person({
    name: newName,
    number: newNumber,
    id: Math.floor(Math.random() * 100) + 1,
  })

  // save person
  person.save().then(result => {
    console.log(`Added ${newName} number ${newNumber} to phonebook`)
    mongoose.connection.close()
  })
} else {

  // get all persons
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
