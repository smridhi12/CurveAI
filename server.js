require("dotenv").config()

const express = require("express")
const app = express();
const multer = require("multer")
const { spawn } = require('child_process')
const path = require('path')


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'Images')
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now()+ path.extname(file.originalname))
    }
})


const upload = multer({storage})

app.use(express.static("public"))

app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.render("index")
})

app.get('/exe',(req,res)=>{
    let bool = '';
    const pythonOne = spawn('python', ['./python.py'])
    pythonOne.stdout.on('data',(data)=>{
        bool = data.toString()
    })
    pythonOne.on('close',(data)=>{
        res.send(bool)
    })
    console.log(bool)
})

app.post("/upload", upload.single("file"),async (req,res)=>{
    res.redirect("/exe")
})


app.listen(3000)

// npm i                                                   --to install depedencies
// npm run dev                                             --to start the server
// jupyter nbconvert --to script python.ipynb              --ipynb to py converter     