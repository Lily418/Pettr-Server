const MongoClient = require("mongodb").MongoClient
const url = "mongodb://localhost:27017"
const dbName = "Pettr";

const connect = MongoClient.connect(url)

const cats = (client) => {
  return client.db(dbName).collection("cats")
}

const ensureIndexes = (client) => {
  return cats(client).createIndex( { "location" : "2dsphere" } )
}

module.exports = {
  connect, cats, ensureIndexes
}
