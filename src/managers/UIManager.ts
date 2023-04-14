import { Timing } from "../misc/timing"

const background = document.getElementById("background") as HTMLElement
const loadingScreen = document.getElementById("loading") as HTMLElement
const loadingBar = document.getElementById("loadingBar") as HTMLElement
const mainScreen = document.getElementById("mainPanel") as HTMLElement
const main = document.getElementById("main") as HTMLElement
const serverPanel = document.getElementById("serverPanel") as HTMLElement
const returnButton = document.getElementById("return") as HTMLButtonElement
const serverList = document.getElementById("serverList") as HTMLElement
const refreshButton = document.getElementById("refresh") as HTMLButtonElement
const serverSelect = document.getElementById("serverSelect") as HTMLElement

const multiButton = document.getElementById("multiplayer") as HTMLButtonElement
multiButton.onclick = () => {
    toggleServers(false)
}

export const backgrounds: string[] = [
    "wallpaper1.jpg",
    "wallpaper2.jpeg",
    "wallpaper3.jpeg"
]

let backgroundCount: number = 0

export const startBackground = () => {
    setTimeout(() => {
        if(backgroundCount >= backgrounds.length) backgroundCount = 0
        backgroundCount++
        background.style.backgroundImage = `url("/assets/backgrounds/${backgrounds[backgroundCount - 1]}")`
        startBackground()
    }, 15000)
}

export const toggleAll = (action: boolean) => {
    main.style.display = action ? "none" : "grid"
    background.style.display = action ? "none" : "block"
}

let currentElem: HTMLElement | undefined

export const toggleMain = (action: boolean) => {
    mainScreen.style.display = action ? "none" : "grid"
}

returnButton.onclick = () => {
    currentElem!.style.display = "none"
    currentElem = undefined
    toggleMain(false)
    toggleReturn(true)
}

const toggleReturn = (action: boolean) => {
    returnButton.style.display = action ? "none" : "block"
}
toggleReturn(true)

const selectedName = document.getElementById("serverName") as HTMLElement
const selectedIp = document.getElementById("serverIp") as HTMLElement
const selectedButton = document.getElementById("joinGame") as HTMLButtonElement

export const handleServerSelected = (name: string, ip: string) => {
    if(serverSelect.style.visibility == "hidden" || serverSelect.style.visibility == "") { serverSelect.style.visibility = "visible" }
    selectedName.innerText = name
    selectedIp.innerText = ip
    selectedButton.onclick = () => {
        window.dispatchEvent(new CustomEvent('join_game', { 
            detail: {
                ip_address: ip // IP address to pass as data
            }
        }));
    }
}

type Server = {
    name: string,
    updtime: number
}

export const updateServerListing = (servers: [[string, Server]]) => {
    while (serverList.firstChild) {
        serverList.removeChild(serverList.lastChild!);
    }
    servers.forEach(server => {
        let serverItem = document.createElement("button")
        serverItem.classList.add("gamemode")
        serverItem.setAttribute("data-universe-join", server[0])
        serverItem.onclick = () => {
            handleServerSelected(server[1].name, server[0])
        }
        serverItem.ondblclick = () => {
            window.dispatchEvent(new CustomEvent('join_game', { 
                detail: {
                    ip_address: server[0] // IP address to pass as data
                }
            }));
        }

        let img = document.createElement("img")
        img.src = "/icons/base.png"
        img.alt = `${server[1].name} Icon`
        let h2 = document.createElement("h2")
        h2.innerText = server[1].name
        serverItem.append(img, h2)
        serverList.appendChild(serverItem)
    })
}

export const loadServers = () => {
    fetch('/servers')
        .then(response => response.json())
        .then(data => {
            updateServerListing(data)
        })
        .catch(error => console.error(error))
}

export const toggleServers = (action: boolean) => {
    if(action) {
        serverPanel.style.display = "none"
    } else {
        currentElem = serverPanel
        toggleMain(true)
        serverPanel.style.display = "grid"
        toggleReturn(false)
        loadServers()
    }
}
// toggleServers(false)

refreshButton.onclick = () => {
    loadServers()
}


export const changeLoading = (percent: number) => {
    loadingBar.style.width = `${percent}%`
}

export const removeLoading = () => {
    setTimeout(() => {
        loadingScreen.style.top = `-100%`
        setTimeout(() => {
            loadingScreen.remove()
        }, Timing.LoadingUp);
    }, Timing.LoadingAwait)
}