import { LCCLoader } from './lcc-loader.mjs';
import { GaussianSplatRenderer } from './splat-renderer.mjs';

export async function initGaussianSplatRenderer(viewer) {
    // viewer = window.viewerInstance;

    const loader = new LCCLoader({ targetLOD: 4 });
    const data = await loader.load('../LCC files/SOL10 LCC/test.lcc');

    const splatRenderer = new GaussianSplatRenderer();
    await splatRenderer.init(data);

    // Scale and rotate to align with your model
    const METERS_TO_FEET = 3.28084;
    splatRenderer.mesh.scale.set(METERS_TO_FEET, METERS_TO_FEET, METERS_TO_FEET);

    viewer.impl.createOverlayScene('splats');
    viewer.impl.addOverlay('splats', splatRenderer.mesh);

    viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, () => {
        splatRenderer.update(viewer.impl.camera);
        viewer.impl.invalidate(false, false, true);
    });

    viewer.addEventListener(Autodesk.Viewing.CUTPLANES_CHANGE_EVENT, () => {
        splatRenderer.setCutPlanes(viewer.getCutPlanes() || []);
        viewer.impl.invalidate(false, false, true);
    });
}