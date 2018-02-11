const MongoClient = require("mongodb").MongoClient
const config = require("config")

const url = "mongodb://localhost:27017"
const dbName = config.get("dbConfig.dbName")

const connect = MongoClient.connect(config.get("dbConfig.mongoConnectionString"))

const cats = (client) => {
  return client.db(dbName).collection("cats")
}

const ensureIndexes = (client) => {
  return cats(client).createIndex( { "location" : "2dsphere" } )
}

module.exports = {
  connect, cats, ensureIndexes
}
