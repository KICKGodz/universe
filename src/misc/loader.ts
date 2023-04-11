import { backgrounds } from "../managers/UIManager";

backgrounds.forEach(image => {
    let preload = document.createElement("link")
    preload.rel = "preload"
    preload.href = `/assets/backgrounds/${image}`
    preload.as = "image"
    document.head.appendChild(preload)
})