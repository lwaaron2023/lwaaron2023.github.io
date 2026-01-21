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
                    //Queries server for result of command
                    window.removeEventListener("keydown", keyDown)
                    handleEnter(commandBefore.innerText+commandHidden.innerText+commandAfter.innerText)
                    writeNextHistory(commandBefore.innerText+commandHidden.innerText+commandAfter.innerText)
                    commandBefore.innerText = ""
                    commandHidden.innerText = ""
                    commandAfter.innerText = ""
                    window.addEventListener("keydown", keyDown)
                } else if (e.key === "Backspace") {
                    //Deletes character before cursor in command
                    if(commandBefore.innerText.length > 0){
                        commandBefore.innerText = commandBefore.innerText.substring(0, commandBefore.innerText.length-1)
                    }
                }
                //Shifts cursor left by one position
                else if(e.key === "ArrowLeft"){
                    leftShift(commandBefore, commandHidden, commandAfter)
                }
                //Shifts cursor right by one position
                else if(e.key === "ArrowRight"){
                    rightShift(commandBefore, commandHidden, commandAfter)
                }
                //Goes backwards one command
                else if(e.key === "ArrowUp"){
                    window.removeEventListener("keydown", keyDown)
                    readPreviousHistory(commandBefore, commandHidden, commandAfter)
                    window.addEventListener("keydown", keyDown)
                }
                //Goes forward one command
                else if(e.key === "ArrowDown"){
                    window.removeEventListener("keydown", keyDown)
                    readNextHistory(commandBefore, commandHidden, commandAfter)
                    window.addEventListener("keydown", keyDown)
                }
            }
        }


    }
    //Shifts cursor left
    const leftShift = (commandBefore, commandHidden, commandAfter)=>{
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
    //Shifts cursor right
    const rightShift = (commandBefore, commandHidden, commandAfter)=>{
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



    //Retrieves the data held in the history id element
    const getHistory = ()=>{
        const history = document.getElementById("history")
        if(history){
            try{
                const dataString = history.getAttribute("data-items")
                const temp = JSON.parse(dataString)
                if("index" in temp && "commands" in temp){
                    console.log(temp.index, temp.commands)
                    return temp
                }
            }catch(e){
                console.log(e)
            }
        }
    }
    //Increments the index by 1 (if it would not be greater than array size) then returns the
    //Command at the index
    const readPreviousHistory = (commandBefore, commandHidden, commandAfter)=>{
        const history = getHistory()
        if(history){
            const commands = history.commands
            if (history.index < commands.length - 1) {
                history.index++
            }
            if (commands.length > 0) {
                commandBefore.innerText = commands[history.index]
                commandHidden.innerText = ""
                commandAfter.innerText = ""
            }
            writeHistory(history)
        }
    }
    //Decrements the index by 1 (if it would not be less than 0) then returns the
    //Command at the index
    const readNextHistory = (commandBefore, commandHidden, commandAfter)=>{
        const history = getHistory()
        if(history){
            const commands = history.commands
            if(history.index > 0){
                history.index--
            }
            if(commands.length > 0) {
                commandBefore.innerText = commands[history.index]
                commandHidden.innerText = ""
                commandAfter.innerText = ""
            }
            writeHistory(history)
        }
    }
    //Adds a new command to the history and resets the index
    const writeNextHistory = (command)=>{
        const history = getHistory()
        if(history){
            history.index = 0
            history.commands.splice(0,1,"",command)
            writeHistory(history)
        }
    }
    //Writes changes to history
    const writeHistory = (data)=>{
        const history = document.getElementById("history")
        if(history){
            try{
                history.setAttribute("data-items", JSON.stringify(data))
            }catch(e){
                console.log(e)
            }
        }
    }

    const handleEnter = (command) => {
        const past = document.getElementById("pastInput")
        if(past){
            addCommand(command)
            if(command!=="" && command!=="clear") {
                queryServer(command)
            }
            else if(command==="clear"){
                past.innerText = ""
            }
        }
    }

    const addCommand = (command) => {
        const past = document.getElementById("pastInput")
        const base = document.getElementById("baseCommand")
        if(past && base){
            past.innerText += base.innerText + command + "\n"
        }
    }

    const queryServer = (command) => {
        const past = document.getElementById("pastInput")
        if(past) {
            interpretCommand(command).then((response) => {
                response.text().then(
                    (text) => {
                        past.innerText += "\n" + text + "\n"
                    }
                )
            })
        }
    }

    const interpretCommand = async (command) => {
        return await fetch("/command", {method: "POST", headers: {"Content-Type": "text/plain", "Charset":"UTF-8"}, body:command})
    }


    setInterval(updateCursor, 400)

    window.addEventListener("keydown", keyDown)
}