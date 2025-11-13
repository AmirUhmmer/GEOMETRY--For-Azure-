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


// export async function zoneFunctionalLocation(viewer, message) {
//   const zoneData = JSON.parse(message.JSONPayload || "[]");
//   console.log("Parsed zone data:", zoneData);

//   const models = viewer.impl.modelQueue().getModels();
//   if (!models?.length) return;

//   // Always clear existing theming
//   models.forEach(model => viewer.clearThemingColors(model));

//   // If no data, just clear colors and exit
//   if (!Array.isArray(zoneData) || zoneData.length === 0) {
//     console.log("No zone data — clearing theming only.");
//     return;
//   }

//   // Get unique tenants and assign colors
//   const tenants = [...new Set(zoneData.map(z => z.Tenant))];
//   const tenantColors = {};
//   tenants.forEach((tenant, i) => {
//     const hue = (i * 360 / tenants.length) / 360;
//     const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
//     tenantColors[tenant] = new THREE.Vector4(color.r, color.g, color.b, 1);
//   });

//   // Process each tenant group just like AgreementFunctionalLocationSearch
//   for (const tenant of tenants) {
//     const tenantItems = zoneData.filter(z => z.Tenant === tenant);
//     const tenantColor = tenantColors[tenant];

//     const allDbIds = [];
//     const searchPromises = [];

//     // Search through all models and collect dbIds
//     tenantItems.forEach(item => {
//       models.forEach(model => {
//         const searchPromise = new Promise(resolve => {
//           model.search(item.FunctionalLocation, dbIDs => {
//             if (dbIDs && dbIDs.length > 0) {
//               dbIDs.forEach(id => allDbIds.push({ dbId: id, model }));
//             } else {
//               console.log(`No matching objects found for: ${item.FunctionalLocation}`);
//             }
//             resolve();
//           });
//         });
//         searchPromises.push(searchPromise);
//       });
//     });

//     await Promise.all(searchPromises);

//     if (allDbIds.length > 0) {
//       // Group dbIds by model for efficiency
//       const dbIdsByModel = {};
//       allDbIds.forEach(({ dbId, model }) => {
//         const modelId = model.id || model.getData().instanceTree.nodeAccess.dbIdToIndex.length;
//         if (!dbIdsByModel[modelId]) {
//           dbIdsByModel[modelId] = { model, dbIds: [] };
//         }
//         dbIdsByModel[modelId].dbIds.push(dbId);
//       });
//       // Apply color and selection
//       Object.values(dbIdsByModel).forEach(({ model, dbIds }) => {
//         console.log(`Highlighting ${dbIds.length} objects for tenant "${tenant}" in model ${model.id}`);
//         dbIds.forEach(id => viewer.setThemingColor(id, tenantColor, model));
//         viewer.select(dbIds, model);
//       });
//     } else {
//       console.log(`No objects found for tenant "${tenant}"`);
//     }
//   }

//   // viewer.impl.invalidate(true, true, true);
// }



export async function zoneFunctionalLocation(viewer, message) {
  const zoneData = JSON.parse(message.JSONPayload || "[]");
  console.log("Parsed zone data:", zoneData);

  const models = viewer.impl.modelQueue().getModels();
  if (!models?.length) return;

  // Clear all theming
  models.forEach(model => viewer.clearThemingColors(model));
  if (!Array.isArray(zoneData) || zoneData.length === 0) return;

  // Unique tenants + colors
  const tenants = [...new Set(zoneData.map(z => z.Tenant))];
  const tenantColors = {};
  tenants.forEach((tenant, i) => {
    const hue = (i * 360 / tenants.length) / 360;
    const c = new THREE.Color().setHSL(hue, 0.8, 0.5);
    tenantColors[tenant] = new THREE.Vector4(c.r, c.g, c.b, 1);
  });

  // Group FunctionalLocations by Tenant
  const tenantGroups = tenants.map(t => ({
    tenant: t,
    locations: zoneData.filter(z => z.Tenant === t).map(z => z.FunctionalLocation),
  }));

  // Process per tenant
  for (const { tenant, locations } of tenantGroups) {
    const tenantColor = tenantColors[tenant];
    const dbIdsByModel = {};

    // For each model, batch all location searches
    const searchPromises = models.map(model =>
      new Promise(resolve => {
        let matchedIds = [];
        let pending = locations.length;
        if (pending === 0) return resolve();

        locations.forEach(loc => {
          model.search(
            loc,
            dbIDs => {
              if (dbIDs?.length) matchedIds.push(...dbIDs);
              if (--pending === 0) resolve({ model, matchedIds });
            },
            err => {
              console.warn("Search error:", err);
              if (--pending === 0) resolve({ model, matchedIds });
            }
          );
        });
      })
    );

    const modelResults = await Promise.all(searchPromises);

    // Apply colors
    for (const { model, matchedIds } of modelResults) {
      if (!matchedIds?.length) continue;
      dbIdsByModel[model.id] = matchedIds;

      // Apply theming color in bulk
      matchedIds.forEach(id => viewer.setThemingColor(id, tenantColor, model));
      viewer.select(matchedIds, model);
      console.log(`Tenant "${tenant}" → ${matchedIds.length} matches in model ${model.id}`);
    }
  }

  // Optionally refresh view
  // viewer.impl.invalidate(true, true, true);
}


// #endregion