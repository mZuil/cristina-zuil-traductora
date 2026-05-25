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

        platformModelPromise = new Promise<GLTF>((resolve, reject) => {
            loader.load(
                "/models/platform.glb",
                resolve,
                (event) => {
                    if (event.lengthComputable) {
                        document.dispatchEvent(
                            new CustomEvent("model:progress", {
                                detail: { ratio: event.loaded / event.total },
                            })
                        );
                    }
                },
                reject
            );
        });
    }

    return platformModelPromise;
}

export function getPlatformModel(): Promise<GLTF> {
    return prefetchPlatformModel();
}