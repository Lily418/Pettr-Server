const expressMongoDb = require("express-mongo-db")
const express = require("express")
const config = require("config")
const multer = require("multer")
const app = express()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

let connect = null

app.use(expressMongoDb(config.get("dbConfig.mongoConnectionString"), config.get("dbConfig.dbName")));

app.get("/cat", (req, res) => { 
  const location = JSON.parse(req.query.location)
  return req.db.collection("cats").find({
    location: {
      $nearSphere: {
        $geometry: {
              type : "Point",
              coordinates : location
           }
      }
    }
  }).toArray().then((cats) => {
    return res.status(200).json(cats);
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

app.listen(3000, () => console.log("Example app listening on port 3000!"))
