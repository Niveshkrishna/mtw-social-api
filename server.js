let express = require("express")
let mongo = require("mongoose")
let bodyParser = require("body-parser")
let app = express()

let db = mongo.connect("mongodb://localhost:27017/mtw", function(err, res){
    if (err) {
        console.log("Unable to connect to DB", err);
    }
    else {
        console.log("Successfully connected to DB ;)")
    }
})

app.use(bodyParser.json())

app.get("/", (req, res) => {
	res.send("mtw-social API")
})

let userRoute = require('./routes/user');
app.use('/users', userRoute);

let postRoute = require('./routes/post')
app.use('/posts', postRoute)


let commentRoute = require('./routes/comment')
app.use('/comments', commentRoute)


app.listen(3000)
