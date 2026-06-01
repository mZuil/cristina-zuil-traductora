import * as THREE from "three";

// `GLTF` and `GLTFLoader` are referenced only as types. We deliberately
// avoid `import type` here because the project does not have @types/three
// installed and the bundled types confuse the TS server in some setups;
// using `any` keeps this module self-contained without affecting runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GLTF = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GLTFLoaderT = any;

// IMPORTANT: GLTFLoader + DRACOLoader are loaded via DYNAMIC import so this
// module — and anything that statically depends on it (e.g. CModel.astro and
// the Layout) — does NOT pull DRACOLoader (and consequently draco_decoder.wasm)
// into the LCP critical request chain. Lighthouse follows static import chains
// when building its "Network Dependency Tree"; switching to dynamic imports
// breaks that chain so the wasm download is no longer reported as critical.

let platformModelPromise: Promise<GLTF> | null = null;
let loaderPromise: Promise<GLTFLoaderT> | null = null;

function getLoader(): Promise<GLTFLoaderT> {
    if (!loaderPromise) {
        loaderPromise = Promise.all([
            import("three/examples/jsm/loaders/GLTFLoader.js"),
            import("three/examples/jsm/loaders/DRACOLoader.js"),
        ]).then(([gltfMod, dracoMod]) => {
            THREE.Cache.enabled = true;

            const dracoLoader = new dracoMod.DRACOLoader();
            // Use the smaller, gltf-optimized Draco decoder
            // (~94 KB smaller wasm + faster decode than the generic one).
            dracoLoader.setDecoderPath("/draco/gltf/");

            const loader = new gltfMod.GLTFLoader();
            loader.setDRACOLoader(dracoLoader);

            return loader;
        });
    }
    return loaderPromise;
}

export function prefetchPlatformModel(): Promise<GLTF> {
    if (!platformModelPromise) {
        platformModelPromise = getLoader().then(
            (loader) =>
                new Promise<GLTF>((resolve, reject) => {
                    loader.load(
                        "/models/platform.glb",
                        resolve,
                        (event: ProgressEvent) => {
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
                })
        );
    }

    return platformModelPromise;
}

export function getPlatformModel(): Promise<GLTF> {
    return prefetchPlatformModel();
}