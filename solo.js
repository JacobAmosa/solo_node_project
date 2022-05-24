const express = require('express')
const fetch = require('node-fetch')
const app = express()
const urlApi = 'https://swapi.dev/api/'

app.get('/', async (req, res) => {
    res.send("Add /people, people/:sortParam, or /planets to the url!")
})

app.get('/people', async (req, res) => {
  try {
    let page = 1;
    let result = {};
    while (page != null) {
      const apiResponse = await fetch(`${urlApi}people/?page=${page}`)
      const apiResponseJson = await apiResponse.json()
      if (apiResponseJson.next != null){
        page = parseInt(apiResponseJson.next.slice(-1))
      } else {
        page = null
      }
      result = {...apiResponseJson.results, result}
    } 
    res.send(result)
  } catch (err) {
    console.log(err)
    res.status(500).send('Error retrieving people')
  }
})

//had some troubles with this endpoint. Didn't seem to order correctly.
app.get('/people/:sort', async (req, res) => {
  try {
    const sort = req.params.sort
    let page = 1;
    let result = {};
    while (page != null) {
      const apiResponse = await fetch(`${urlApi}people/?page=${page}&sort=${sort}`)
      const apiResponseJson = await apiResponse.json()
      if (apiResponseJson.next != null){
        page = parseInt(apiResponseJson.next.slice(-1))
      } else {
        page = null
      }
      result = {...apiResponseJson.results, result}
    } 
    res.send(result)
  } catch (err) {
    console.log(err)
    res.status(500).send('Error retrieving sorted people')
  }
})

app.get('/planets', async (req, res) => {
  try {
    let page = 1;
    let result = {};
    while (page != null) {
      const apiResponse = await fetch(`${urlApi}planets/?page=${page}`)
      const apiResponseJson = await apiResponse.json()
      const response = apiResponseJson.results
      for (let i = 0; i < response.length; ++i) {
        if (response[i].residents.length > 0) {
          for (let j = 0; j < response[i].residents.length; ++j) {
            response[i].residents[j] = await getFullName(response[i].residents[j])
          }
        }
      }
      if (apiResponseJson.next != null){
        page = parseInt(apiResponseJson.next.slice(-1))
      } else {
        page = null
      }
      result = {...apiResponseJson.results, result}
    } 
    res.send(result)
  } catch (err) {
    console.log(err)
    res.status(500).send('Error retrieving planets')
  }
})

async function getFullName(url) {
  const apiResponse = await fetch(`${url}`)
  const apiResponseJson = await apiResponse.json()
  return apiResponseJson.name
}

app.listen(3000, () => console.log(`App listening on port 3000!`))
