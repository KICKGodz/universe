import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        proxy: {
            // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
            '/socket.io': {
                target: 'ws://localhost:5174',
                ws: true,
            },
        },
    },
})