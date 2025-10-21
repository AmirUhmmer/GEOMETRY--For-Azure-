export function FunctionalLocationSearch(viewer, FunctionalLocation){
    // Assuming this is part of your search function when Hard Asset is selected
    if (FunctionalLocation === 'TRUE') {

        const FunctionalLocationID = localStorage.getItem('uniqueID');

        // First, get the models from the viewer
        const models = viewer.impl.modelQueue().getModels();

        // Ensure models are loaded before proceeding
        if (models && models.length > 0) {

            // Perform the search within the loaded models
            models[1].search(FunctionalLocationID, function(dbIDs) {

                // If no objects are found, handle it gracefully
                if (!dbIDs || dbIDs.length === 0) {
                    console.log('No matching objects found for: ' + FunctionalLocationID);
                    return;
                }

                // Loop through the models only once
                models.forEach(model => {
                    // Hide all objects first
                    viewer.isolate([], model);

                    // Isolate the found objects
                    viewer.isolate(dbIDs, model);
                });

                // Fit to view and highlight the found objects
                viewer.fitToView(dbIDs, models[1]);
                let color = '';

                color = new THREE.Vector4(0, 1, 0, 1);  // Green color with full intensity (RGBA)
                viewer.setSelectionColor(new THREE.Color(0, 1, 0));  // RGB: red, green, blue

                // Optionally highlight the objects
                models[1].setThemingColor(dbIDs, color);  
                viewer.select(dbIDs, models[1]);  // Optionally highlight the objects
                console.log(dbIDs);

            }, function(error) {
                console.error('Search error:', error);  // Handle any potential search errors
            });
        } else {
            console.warn('No models loaded or invalid asset value.');
        }

    }
}







// #region Zone FL
export async function zoneFunctionalLocation(viewer, message) {
  const zoneData = JSON.parse(message.JSONPayload);
  console.log("Parsed zone data:", zoneData);

  const models = viewer.impl.modelQueue().getModels();
  if (!models || models.length === 0) return;

  models.forEach(model => viewer.clearThemingColors(model));

  const color = new THREE.Vector4(0, 1, 0, 1); // RGBA green
  viewer.setSelectionColor(new THREE.Color(0, 1, 0)); // RGB green

  // Collect all dbIDs first
  const allDbIds = [];
  const searchPromises = [];

  // ✅ Fix: use zoneData (not functionalLocations.FunctionalLocation)
  zoneData.forEach((location) => {
    models.forEach((model) => {
      const searchPromise = new Promise((resolve) => {
        // ✅ You were using location.id, but your data uses FunctionalLocationName
        model.search(location.FunctionalLocationName, (dbIDs) => {
          if (dbIDs && dbIDs.length > 0) {
            dbIDs.forEach((id) => {
              allDbIds.push({ dbId: id, model });
            });
          } else {
            console.log("No matching objects found for:", location.FunctionalLocationName);
          }
          resolve();
        });
      });
      searchPromises.push(searchPromise);
    });
  });

  await Promise.all(searchPromises);

  // Apply coloring and selection
  if (allDbIds.length > 0) {
    const dbIdsByModel = {};

    allDbIds.forEach(({ dbId, model }) => {
      const modelId = model.id || model.getData().instanceTree.nodeAccess.dbIdToIndex.length;
      if (!dbIdsByModel[modelId]) {
        dbIdsByModel[modelId] = { model, dbIds: [] };
      }
      dbIdsByModel[modelId].dbIds.push(dbId);
    });

    Object.values(dbIdsByModel).forEach(({ model, dbIds }) => {
      console.log(`Highlighting ${dbIds.length} objects in model ${model.id}:`, dbIds);
      dbIds.forEach((id) => viewer.setThemingColor(id, color, models[1]));
      viewer.select(dbIds, model);
    });
  } else {
    console.log("No objects found for any functional locations");
  }
}
// #endregion