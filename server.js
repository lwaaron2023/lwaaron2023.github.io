import http from 'http'
import fs from 'fs'
import mime from 'mime'
const port =  process.env.PORT || 3000

const server = http.createServer( function( request,response ) {
    let file = request.url;
    if(file === '/'){
        //Handles special case of base url
        file = 'index.html';
    }
    sendFile(response, file);
})

server.listen( port )

const sendFile = ( response, filename ) => {
    const type = mime.getType( filename )

    fs.readFile( './public/'+filename, function( err, content ) {
        // if the error = null, then we"ve loaded the file successfully
        if( err === null ) {

            // status code: https://httpstatuses.com
            response.writeHeader( 200, { "Content-Type": type })
            response.end( content )

        }else{

            // file not found, error code 404
            response.writeHeader( 404 )
            response.end( "404 Error: File Not Found" )

        }
    })


}

// if(command in commands){
//     const result = commands[command]()
//     return result
// }
// else{
//     return `Command '${command}' is not a recognized command. Use command 'help' for a list of recognized commands`
// }