export function AgreementFunctionalLocationSearch(viewer, functionalLocations) {
  const panel = document.getElementById("model-browser-panel");
  console.log(
    "AgreementFunctionalLocationSearch called with FunctionalLocations:",
    functionalLocations
  );

  if (!Array.isArray(functionalLocations) || functionalLocations.length === 0) {
    return;
  }

  const models = viewer.impl.modelQueue().getModels();
  if (!models || models.length === 0) return;

  const color = new THREE.Vector4(0, 1, 0, 1); // RGBA green
  viewer.setSelectionColor(new THREE.Color(0, 1, 0)); // RGB green

  functionalLocations.forEach((location) => {
    models.forEach((model) => {
      model.search(location.id, (dbIDs) => {
        if (dbIDs && dbIDs.length > 0) {
          console.log(`Highlighting ${location.id}:`, dbIDs);
          viewer.setThemingColor(dbIDs, color);
          viewer.select(dbIDs, model);
        } else {
          console.log("No matching objects found for:", location.id);
        }
      });
    });
  });
}
