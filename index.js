const expressMongoDb = require("express-mongo-db")
const mongodb = require("./mongodb")
const express = require("express")
const config = require("config")
const multer = require("multer")
const app = express()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

mongodb.connect.then((client) => {
  mongodb.ensureIndexes(client)
})

app.use(expressMongoDb(config.get("dbConfig.mongoConnectionString"), config.get("dbConfig.dbName")));

app.get("/cat", (req, res) => { 
  const location = JSON.parse(req.query.location)
  console.log(`GET /cat location=${location}`)
  return req.db.collection("cats").find({
    location: {
      $nearSphere: {
        $geometry: {
              type : "Point",
              coordinates : location
           }
      }
    }
  }).limit(1).toArray().then((cats) => {
    return res.status(200).json(cats);
  }).catch((err) => {
    console.error(err);
    return res.status(500).json({ "error" : "Could not get cats"})
  })
})

app.put("/cat", upload.single('cat'), (req, res) => {
  const location = JSON.parse(req.query.location)
  const catPhotoBuffer = req.file.buffer
  req.db.collection("cats").insert({
    "location": {
      "type": "Point",
      "coordinates": location
    },
    "photo": catPhotoBuffer
  }).then((result) => {
    if(result.result.ok) {
      return res.status(200).json({"created": result.insertedIds[0]})
    } else {
      return res.status(500).json({ "error" : "Could not create cat"})
    }
  }).catch((err) => {
    return res.status(500).json({ "error" : "Could not create cat"})
  })
})

app.listen(3000, () => console.log("Pettr Server listening on port 3000"))
