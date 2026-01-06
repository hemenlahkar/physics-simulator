import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  Camera,
  Clock,
  ColorRepresentation,
  Color,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface SceneInitConfig {
  canvas: HTMLCanvasElement;
  fov?: number;
  nearPlane?: number;
  farPlane?: number;
  cameraPosition?: { x: number; y: number; z: number };
  enableShadows?: boolean;
  enableControls?: boolean;
  ambientLightColor?: ColorRepresentation;
  ambientLightIntensity?: number;
  directionalLightColor?: ColorRepresentation;
  directionalLightIntensity?: number;
  directionalLightPosition?: { x: number; y: number; z: number };
  backgroundColor?: ColorRepresentation;
  antialias?: boolean;
}

export default class SceneInit {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  clock: Clock;
  controls: OrbitControls | null;
  ambientLight: AmbientLight;
  directionalLight: DirectionalLight;
  isControlEnabled?: boolean;

  private canvas: HTMLCanvasElement;
  private animationFrameId: number | null = null;
  private resizeHandler: (() => void) | null = null;

  constructor(config: SceneInitConfig) {
    this.canvas = config.canvas;

    this.scene = new Scene();
    if (config.backgroundColor) {
      this.scene.background = new Color(config.backgroundColor);
    }

    const fov = config.fov ?? 60;
    const nearPlane = config.nearPlane ?? 0.1;
    const farPlane = config.farPlane ?? 1000;

    this.camera = new PerspectiveCamera(fov, 1, nearPlane, farPlane);

    const camPos = config.cameraPosition ?? { x: 0, y: 5, z: 10 };
    this.camera.position.set(camPos.x, camPos.y, camPos.z);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new WebGLRenderer({ antialias: config.antialias ?? true });

    this.ambientLight = new AmbientLight(
      config.ambientLightColor ?? 0xffffff,
      config.ambientLightIntensity ?? 0.6
    );

    this.directionalLight = new DirectionalLight(
      config.directionalLightColor ?? 0xffffff,
      config.directionalLightIntensity ?? 0.8
    );
    const dirLightPos = config.directionalLightPosition ?? {
      x: 5,
      y: 10,
      z: 5,
    };
    this.directionalLight.position.set(
      dirLightPos.x,
      dirLightPos.y,
      dirLightPos.z
    );

    if (config.enableShadows ?? true) {
      this.directionalLight.castShadow = true;
      this.directionalLight.shadow.mapSize.width = 2048;
      this.directionalLight.shadow.mapSize.height = 2048;
    }

    this.clock = new Clock();

    this.controls = null;
    if (config.enableControls) {
      // Controls are created in initialize() after renderer is ready
      this.isControlEnabled = true;
    }
  }

  initialize(): boolean {
    const canvas = this.canvas;

    if (!canvas) {
      console.error(`Canvas with id "${this.canvas.id}" not found`);
      return false;
    }

    // Setup renderer with canvas
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
    });

    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = this.directionalLight.castShadow;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    if (this.isControlEnabled && this.controls == null && this.renderer) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
    }

    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);

    this.resizeHandler = () => this.onWindowResize();
    window.addEventListener("resize", this.resizeHandler);

    return true;
  }

  animate(customRenderCallback?: (delta: number) => void): void {
    this.animationFrameId = window.requestAnimationFrame(() =>
      this.animate(customRenderCallback)
    );

    const delta = this.clock.getDelta();

    if (this.controls) this.controls.update();

    if (customRenderCallback) {
      customRenderCallback(delta);
    }

    this.render();
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize(): void {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  dispose(): void {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = null;
    }
    this.controls?.dispose();

    this.renderer.dispose();

    this.scene.clear();
  }

  setBackgroundColor(color: ColorRepresentation): void {
    this.scene.background = new Color(color);
  }

  enableControls(enable: boolean): void {
    if (this.controls) {
      this.controls.enabled = enable;
    }
  }
}
