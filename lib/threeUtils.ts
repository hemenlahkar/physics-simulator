import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  SpotLight,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
  Camera,
  Clock,
  DirectionalLight,
} from "three";

import { OrbitControls } from "three/examples/jsm/Addons.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default class SceneInit {
  scene: Scene | undefined;
  camera: Camera | undefined;
  renderer: WebGLRenderer | undefined;
  fov: number | undefined;
  nearPlane: number;
  farPlane: number;
  canvasId: string;
  clock: Clock | undefined;
  stats: Stats | undefined;
  controls: OrbitControls | undefined;
  ambientLight: AmbientLight | undefined;
  directionalLight: DirectionalLight | undefined;

  constructor(canvasId: string) {
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    this.clock = undefined;
    this.stats = undefined;
    this.controls = undefined;

    this.ambientLight = undefined;
    this.directionalLight = undefined;
  }

  initialize() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(50, 30, 0);

    const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    this.clock = new Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.ambientLight = new AmbientLight(0xffffff, 0.5);
    // this.ambientLight.castShadow = true;  // Cannot do this
    this.scene.add(this.ambientLight);

    this.directionalLight = new DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(0, 32, 64);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    // if window resizes
    window.addEventListener("resize", () => this.onWinowResize(), false);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.controls?.update();
  }

  render() {
    this.renderer?.render(this.scene as Scene, this.camera as Camera);
  }

  onWinowResize() {
    /*@ts-ignore */
    this.camera.aspect = window.innerWidth / window.innerHeight;
    /*@ts-ignore */
    this.camera?.updateProjectionMatrix();
    this.renderer?.setSize(window.innerWidth, window.innerHeight);
  }
}
