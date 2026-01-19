const commandHeader = "PS C:\\Users\\portfolio> "
const baseLength = commandHeader.length
const cursorFull = "\u25AE"
const cursorEmpty = "\u25AF"


window.onload = () => {
    const current = document.getElementById("currentInput")
    let cursor = false
    let currentLength = baseLength
    let canHandle = true

    const updateCursor = ()=>{
        const current = document.getElementById("currentInput")
        if(current){
            let text = current.innerText.substring(0, current.innerText.length - 1)
            text += (cursor? cursorEmpty : cursorFull )
            cursor = !cursor
            current.innerText = text
        }
    }

    const keyDown = (e) => {
        const current = document.getElementById("currentInput")
        if (current){
            if(e.key.length === 1){
                current.innerText = current.innerText.substring(0, currentLength)+e.key+current.innerText.charAt(currentLength)
                currentLength += 1
            }
            else{
                if(e.key === "Enter"){
                    if(canHandle){
                        canHandle = false
                        handleEnter(current.innerText.substring(baseLength, currentLength))
                        canHandle = true
                    }

                }
                else if(e.key === "Backspace"){
                    if(currentLength > baseLength) {
                        current.innerText = current.innerText.substring(0, currentLength - 1) + current.innerText.charAt(currentLength)
                        currentLength -= 1
                    }
                }
            }
        }


    }

    const handleEnter = (command) => {
        const past = document.getElementById("pastInput")
        const current = document.getElementById("currentInput")
        if(past && current){
            current.innerText = commandHeader + cursorEmpty
            currentLength = baseLength
            past.innerText += commandHeader + command + "\n\n"
            interpretCommand(command.toLowerCase()).then((response)=>{
                console.log(response)
            })
        }
    }

    const interpretCommand = async (command) => {
        const parts = command.split(" ")
        return await fetch(`/${parts[0]}`, {method: "POST", headers: {"Content-Type": "text/plain", "Charset":"UTF-8"}, body:command})
    }


    setInterval(updateCursor, 400)

    window.addEventListener("keydown", keyDown)

    if(current) {
        current.innerText = commandHeader+cursorEmpty
    }
}