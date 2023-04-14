import { removeLoading, changeLoading, startBackground, toggleAll } from "./managers/UIManager"
import { downloadAssets } from "./managers/AssetManager"
import { Socket, io } from "socket.io-client"
import { Player, Packet, StatusType, BodyPacket } from "./types"
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import GameScene from "./scenes/GameScene"

let scene: GameScene
let socket: Socket | null = null
const loader = new THREE.TextureLoader();

startBackground()

window.addEventListener("join_game", (event) => {
    const ipAddress = (<any>event).detail.ip_address!
    toggleAll(true)
    socket = io()
    joinGame()
})

let objects: Map<number, THREE.Mesh> = new Map()

const joinGame = () => {
    scene = new GameScene()
    scene.initialize()
    startThreeJS()
    socket?.emit("join", { name: "Meida", id: 0 })
    const decoder = new TextDecoder("utf-8")
    socket?.on("packet", (packet: Buffer) => {
        let packetData: [Packet] = JSON.parse(decoder.decode(packet))
        packetData.forEach(obj => {
            objects.get(obj.id as number)?.position.set(obj.t.x, obj.t.y, obj.t.z)
            objects.get(obj.id as number)?.setRotationFromQuaternion(new THREE.Quaternion(obj.r.x, obj.r.y, obj.r.z, obj.r.w));
        });
    })
    socket?.on("bodyCreate", (packet: Buffer) => {
        let packetData: BodyPacket = JSON.parse(decoder.decode(packet))
        let geometry = new THREE.BoxGeometry(packetData.s.x, packetData.s.y, packetData.s.z);
        let color = 0xFFFFFF
        if(packetData.id == 0) color = 0x999999
        let material = new THREE.MeshBasicMaterial( { color: color } );
        let object = new THREE.Mesh( geometry, material );
        object.scale.set(2, 2, 2)
        object.position.set(packetData.t.x, packetData.t.y, packetData.t.z)
        object.setRotationFromQuaternion(new THREE.Quaternion(packetData.r.x, packetData.r.y, packetData.r.z, packetData.r.w))
        objects.set(packetData.id, object)
        scene?.add(object);
    })
    socket?.on("deleteBody", (id) => {
        let deletedObject = objects.get(id)
        objects.delete(id)
        scene?.remove(deletedObject as THREE.Object3D)
    })
    socket?.on("server_error", (data) => {
        console.log(data)
    })
}

const startThreeJS = () => {
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const controls = new OrbitControls(camera, renderer.domElement)

    camera.position.z = 25;
    camera.position.y = 5

    window.addEventListener( 'resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );

    function animate() {
        requestAnimationFrame( animate );

        renderer.render( scene!, camera );
    }

    animate();
}

downloadAssets(changeLoading)
    .then(() => {
        console.log('All files downloaded.');
        removeLoading()
    })
    .catch(error => {
        console.error(`Error downloading files: ${error}`);
    });


// Loading Order
// [ Assets, Files, ThreeJS ]
// Handle Event When Loading Is Finished