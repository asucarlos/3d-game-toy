import { ReactComponent } from '*.svg';
import React from 'react'
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export default class Canvas extends React.Component {
  private scene:any = {}
  private camera:any = {}
  private renderer: any = {}
  private material:any = {}
  private geometry:any = {}
  private cube:any = {}
  public animate:any = {}
  public object:any = {}

  constructor(props?:any){
    super(props)
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
    this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
    this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new THREE.Mesh( this.geometry, this.material );
    this.scene.add( this.cube );
    this.camera.position.z = 5;
    this.animate = function () {
      requestAnimationFrame( this.animate );
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
      this.renderer.render( this.scene, this.camera );
    };
    this.animate = this.animate.bind(this)
    this.loadObject(this.scene)
    this.addLight(this.scene)
  }

  loadObject(scene: any) {
    const loader = new OBJLoader();
    loader.load( 'http://localhost:8000/public/windmill.obj', function ( obj ) {
      console.log(obj)
      console.log(scene)

      scene.add(obj)
    }, undefined, function ( error ) {
      console.error( error );
    } );
  }

  addLight(scene: any) {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

}