import React from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export default class Canvas extends React.Component {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private material: THREE.MeshBasicMaterial;
  private geometry: THREE.BoxGeometry;
  private cube: THREE.Mesh;
  public animate: () => void;

  constructor(props?: any) {
    super(props);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.camera.position.z = 5;
    this.animate = function () {
      requestAnimationFrame(this.animate);
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
    };
    this.animate = this.animate.bind(this);

    this.addLight(this.scene);

    this.loadFBXFile(this.scene);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    this.scene.add(dirLight);
  }

  loadObject(scene: THREE.Scene) {
    const loader = new OBJLoader();
    loader.load(
      "http://localhost:8000/public/tree1.obj",
      function (obj) {
        scene.add(obj);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }

  addLight(scene: THREE.Scene) {
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  loadFBXFile(scene: THREE.Scene) {
    const loader = new FBXLoader();
    loader.load(
      "http://localhost:8000/public/rp_eric_rigged_001_u3d.fbx",
      function (obj) {
        const texture = new THREE.TextureLoader().load(
          "http://localhost:8000/public/rp_eric_rigged_001_dif.jpg"
        );
        const material = new THREE.MeshBasicMaterial({ map: texture });
        obj.scale.multiplyScalar(0.01);
        obj.traverse(function (child: any) {
          if (child.material) {
            child.material = material;
          }
        });
        scene.add(obj);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }
}
