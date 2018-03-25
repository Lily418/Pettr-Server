const Promise = require("bluebird")
const mongodb = require("./mongodb")
const seed = require("./seed.json")
const fetch = require("node-fetch")

const getCatImageBuffer = () => {
  return fetch("https://thecatapi.com/api/images/get?type=jpg&size=small").then((response) => {
    return response.buffer()
  })
}

mongodb.connect.then((client) => {
  return mongodb.cats(client).drop()
}).then((result) => {
  console.log(result)
  return Promise.all(seed.cats.map(() => {
    return getCatImageBuffer()
  }))
}).then((res) => {
  return seed.cats.map((cat, index) => {
    return {"location": cat.location, "photo": res[index]}
  })
}).then((cats) => {
  return Promise.join(mongodb.connect, cats, (client, cats) => {
    const lotsOfCats = Array(25).fill().map((e, i)=> Object.assign({}, cats[0], cats[i], {index: i}))
    console.log(cats)

    console.log("Lots", lotsOfCats.map((e)=>e.location.coordinates))
    return mongodb.cats(client).insert(lotsOfCats)
  })
}).then((result) => {
  console.log(result)
  return mongodb.connect
}).then((client) => {
  return mongodb.ensureIndexes(client)
}).then((result) => {
  console.log(result)
  return mongodb.connect
}).then((client) => {
  return client.close()
}).catch((err) => {
  console.log(err)
})
