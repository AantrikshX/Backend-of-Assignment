const express = require("express")
const cors = require("cors")
const app = express()
const createevent = require("./Routes/Api")
const dotenv = require("dotenv")
dotenv.config();


app.use(cors());


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api', createevent)

app.listen(3000)