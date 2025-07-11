export async function AgreementFunctionalLocationSearch(viewer, functionalLocations) {
  await new Promise(resolve => setTimeout(resolve, 10000)); // 15 second delay
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

  // Collect all dbIDs first
  const allDbIds = [];
  const searchPromises = [];

  functionalLocations.forEach((location) => {
    models.forEach((model) => {
      const searchPromise = new Promise((resolve) => {
        model.search(location.id, (dbIDs) => {
          if (dbIDs && dbIDs.length > 0) {
            // console.log(`Found dbIDs for ${location.id}:`, dbIDs);
            // Add dbIDs with their model reference
            dbIDs.forEach(id => {
              allDbIds.push({ dbId: id, model: model });
            });
          } else {
            console.log("No matching objects found for:", location.id);
          }
          resolve();
        });
      });
      searchPromises.push(searchPromise);
    });
  });

  // Wait for all searches to complete
  await Promise.all(searchPromises);

  // Now apply coloring and selection to all collected dbIDs
  if (allDbIds.length > 0) {
    // console.log(`Total dbIDs found: ${allDbIds.length}`);
    
    // Group dbIDs by model for efficient processing
    const dbIdsByModel = {};
    allDbIds.forEach(({ dbId, model }) => {
      const modelId = model.id || model.getData().instanceTree.nodeAccess.dbIdToIndex.length;
      if (!dbIdsByModel[modelId]) {
        dbIdsByModel[modelId] = { model: model, dbIds: [] };
      }
      dbIdsByModel[modelId].dbIds.push(dbId);
    });

    // Apply coloring and selection for each model
    Object.values(dbIdsByModel).forEach(({ model, dbIds }) => {
      console.log(`Highlighting ${dbIds.length} objects in model:`, dbIds);
      for (const id of dbIds) {
        viewer.setThemingColor(id, color, models[1]);
      }
      viewer.select(dbIds, model);
    });
  } else {
    console.log("No objects found for any functional locations");
  }
}