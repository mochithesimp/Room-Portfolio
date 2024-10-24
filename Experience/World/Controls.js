import * as THREE from "three"
import Experience from "../Experience.js";
import GSAP from "gsap"

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;

        this.progress = 0;
        this.dummyCurve = new THREE.Vector3(0, 0, 0);

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.position = new THREE.Vector3(0, 0, 0);
        this.lookAtPosition = new THREE.Vector3(0, 0, 0);

        this.directionalVector = new THREE.Vector3(0, 0, 0);
        this.staticVector = new THREE.Vector3(0, 1, 0);
        this.crossVector = new THREE.Vector3(0, 0, 0);


        this.setPath();
        this.onWheel();
    }

    setPath() {
        this.curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-5, 0, 0),
            new THREE.Vector3(0, 0, -5),
            new THREE.Vector3(5, 12, 0),
            new THREE.Vector3(0, 5, 5),
            new THREE.Vector3(15, 0, 5),
            new THREE.Vector3(0, 5, 5),
            new THREE.Vector3(-12, 6, 5),
        ], true);

        const points = this.curve.getPoint(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

        const curveObject = new THREE.Line(geometry, material);
        this.scene.add(curveObject);
    }

    onWheel() {
        window.addEventListener("wheel", (e) => {
            if (e.deltaY > 0) {
                this.lerp.target += 0.01;
            } else {
                this.lerp.target -= 0.01;
            }
        })
    }

    resize() {

    }

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease,
        )
        this.curve.getPointAt(this.lerp.current % 1, this.position);
        this.camera.orthographicCamera.position.copy(this.position);

        this.directionalVector.subVectors(
            this.curve.getPointAt((this.lerp.current % 1) + 0.000001),
            this.position);

        this.directionalVector.normalize();
        this.crossVector.crossVectors(
            this.directionalVector,
            this.staticVector,
        );
        this.crossVector.multiplyScalar(100000);
        this.camera.orthographicCamera.lookAt(0, 0, 0);
    }

}