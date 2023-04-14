import * as THREE from "three"

export default class GameScene extends THREE.Scene {
    initialize() {
        const loader = new THREE.CubeTextureLoader();
		const texture = loader.load([
			'assets/files/materials/purplenebula_rt.png',
			'assets/files/materials/purplenebula_lf.png',
			'assets/files/materials/purplenebula_up.png',
			'assets/files/materials/purplenebula_dn.png',
			'assets/files/materials/purplenebula_ft.png',
			'assets/files/materials/purplenebula_bk.png',
		]);
		texture.encoding = THREE.sRGBEncoding;
		this.background = texture;

        let directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5)
        directionalLight.position.set(0, 1, 0)
        directionalLight.castShadow = true
        this.add(directionalLight)
        
        let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
        this.add(ambientLight)
    }

    update() {

    }
}