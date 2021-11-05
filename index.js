const express = require('express')
const app = express()
const port = 3000

function logger({name, description, ...rest}){
  return name+description+JSON.stringify(rest);
}

const log = {
  name: 'express',
  description: 'description',
  content: 'content'
}


app.get('/', (req, res) => {
  res.send(logger(log))

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})