import { Timing } from "../misc/timing"

const background = document.getElementById("background") as HTMLElement
const loadingScreen = document.getElementById("loading") as HTMLElement
const loadingBar = document.getElementById("loadingBar") as HTMLElement

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

export const disableAll = () => {
    toggleSplash(false)
}

export const toggleSplash = (action: boolean) => {

}

export const toggleServers = (action: boolean) => {

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