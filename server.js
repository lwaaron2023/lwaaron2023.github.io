import http from 'http'
import fs from 'fs'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'

const commandDirectory = path.join(process.cwd(),'/public/cmd/')
const port =  process.env.PORT || 3000
const app = express()
const extension = "txt"

app.use(express.static('public'))
app.use(bodyParser.text())

app.post('/command', (req, res) => {
    const command = req.body.toLocaleString()
    //For now treats commands as txt files to be read
    fs.readFile(path.join(commandDirectory, `${command}.${extension}`), (err, data) => {
        if (err) {
            res.send(`'${command}' is not recognized as an internal command, operable program, or batch file`)
        }
        else{
            res.send(data)
        }
    })

})

const server = http.createServer(app)

server.listen(port)