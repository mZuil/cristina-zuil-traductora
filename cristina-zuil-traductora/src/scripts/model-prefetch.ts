import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { GLTF } from "three/examples/jsm/Addons.js";

let platformModelPromise: Promise<GLTF> | null = null;

function makeLoader(): GLTFLoader {
  THREE.Cache.enabled = true;

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  return loader;
}

export function prefetchPlatformModel(): Promise<GLTF> {
  if (!platformModelPromise) {
    const loader = makeLoader();
    platformModelPromise = loader.loadAsync("/models/platform.glb");
  }
  return platformModelPromise;
}

export function getPlatformModel(): Promise<GLTF> {
  return prefetchPlatformModel();
}