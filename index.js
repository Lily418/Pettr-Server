const express = require('express')
const app = express()

app.route("/cat").get((req, res) => res.json({cats: [{ name: "Cat" }]}))
                .put((req, res) => res.status(200).json({id: "some-id"}))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
