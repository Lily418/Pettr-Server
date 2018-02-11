const expressMongoDb = require("express-mongo-db")
const express = require("express")
const config = require('config')
const app = express()

let connect = null

app.use(expressMongoDb(config.get("dbConfig.mongoConnectionString"), config.get("dbConfig.dbName")));

app.route("/cat").get((req, res) => { 
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
                  .put((req, res) => res.status(501).send("Not Implemented"))

app.listen(3000, () => console.log("Example app listening on port 3000!"))
