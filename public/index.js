const cursorFull = "\u25AE"
const cursorEmpty = "\u25AF"

window.onload = () => {

    const updateCursor = ()=>{
        const cursor = document.getElementById("cursor")
        if(cursor) {
            if(cursor.innerText === cursorEmpty) {
                cursor.innerText = cursorFull
            }
            else{
                cursor.innerText = cursorEmpty
            }
        }
    }

    const keyDown = (e) => {
        const commandBefore = document.getElementById("command-before")
        const commandHidden = document.getElementById("command-hidden")
        const commandAfter = document.getElementById("command-after")
        if(commandBefore && commandHidden && commandAfter) {
            if (e.key.length === 1) {
                commandBefore.innerText+=e.key
            }
            else {
                if (e.key === "Enter") {
                    handleEnter(commandBefore.innerText+commandHidden.innerText+commandAfter.innerText)
                } else if (e.key === "Backspace") {
                    if(commandBefore.innerText.length > 0){
                        commandBefore.innerText = commandBefore.innerText.substring(0, commandBefore.innerText.length-1)
                    }
                }
                //Shifts cursor left by one position
                else if(e.key === "ArrowLeft"){
                    if(commandBefore.innerText.length > 1) {
                        commandAfter.innerText = commandHidden.innerText+commandAfter.innerText
                        commandHidden.innerText = commandBefore.innerText.charAt(commandBefore.innerText.length-1)
                        commandBefore.innerText = commandBefore.innerText.substring(0, commandBefore.innerText.length-1)
                    }
                    else if(commandBefore.innerText.length > 0){
                        commandAfter.innerText = commandHidden.innerText+commandAfter.innerText
                        commandHidden.innerText = commandBefore.innerText.charAt(0)
                        commandBefore.innerText = ""
                    }
                    else if(commandHidden.innerText.length > 0){
                        commandAfter.innerText = commandHidden.innerText+commandAfter.innerText
                        commandHidden.innerText = ""
                    }
                }
                //Shifts cursor right by one position
                else if(e.key === "ArrowRight"){
                    if(commandAfter.innerText.length > 1) {
                        commandBefore.innerText = commandBefore.innerText+commandHidden.innerText
                        commandHidden.innerText = commandAfter.innerText.charAt(0)
                        commandAfter.innerText = commandAfter.innerText.substring(1)
                    }
                    else if(commandAfter.innerText.length > 0){
                        commandBefore.innerText = commandBefore.innerText+commandHidden.innerText
                        commandHidden.innerText = commandAfter.innerText.charAt(0)
                        commandAfter.innerText = ""
                    }
                    else if(commandHidden.innerText.length > 0){
                        commandBefore.innerText = commandBefore.innerText+commandHidden.innerText
                        commandHidden.innerText = ""
                    }
                }

            }
        }


    }



    const handleEnter = (command) => {
        const past = document.getElementById("pastInput")
        const current = document.getElementById("currentInput")
        if(past && current){

            if(command!=="") {
                interpretCommand(command).then((response) => {
                    response.text().then(
                        (text) => {
                            command = ""
                            past.innerText += text + "\n"
                        }
                    )
                })
            }
        }
    }

    const interpretCommand = async (command) => {
        return await fetch("/command", {method: "POST", headers: {"Content-Type": "text/plain", "Charset":"UTF-8"}, body:command})
    }


    setInterval(updateCursor, 400)

    window.addEventListener("keydown", keyDown)
}