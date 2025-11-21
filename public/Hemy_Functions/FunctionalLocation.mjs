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



// #region Service Zone Hemy X
export async function highlightFLByTask(viewer, message) {
  // Expecting message.payload = [ { flId, flName, taskNames: [...] }, ... ]
  console.log("Highlight FL by Task message received.");
  console.log("Message payload:", message);
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

  // Detect the actual data shape (message is already an array)
  let flData;

  if (Array.isArray(message)) {
    flData = message;
  } else if (Array.isArray(message.payload)) {
    flData = message.payload;
  } else if (message.JSONPayload) {
    try {
      flData = JSON.parse(message.JSONPayload);
    } catch {
      flData = [];
    }
  } else {
    flData = [];
  }

  console.log("Message data:", flData);

  if (!Array.isArray(flData) || flData.length === 0) {
    console.warn("No FL data found in message.");
    return;
  }
  
  console.log("Parsed FL + Tasks Data:", flData);

  const models = viewer.impl.modelQueue().getModels();
  if (!models?.length || flData.length === 0) return;

  // Clear any existing theming
  models.forEach(model => viewer.clearThemingColors(model));

  // Build a map for debugging / fallback: flId -> flName
  const idToName = {};
  flData.forEach(fl => {
    idToName[fl.flId] = fl.flName || "(no name)";
    // set group = first task or "No Task"
    fl.group = (!fl.taskNames || fl.taskNames.length === 0) ? "No Task" : fl.taskNames[0];
  });

  // Unique groups
  const groups = [...new Set(flData.map(z => z.group))];
  console.log("Task Groups:", groups);

  // Assign colors per group
  const groupColors = {};
  groups.forEach((g, i) => {
    const hue = (i * 360 / groups.length) / 360;
    const c = new THREE.Color().setHSL(hue, 0.8, 0.5);
    groupColors[g] = new THREE.Vector4(c.r, c.g, c.b, 1);
  });

  // Build grouped FLs using FL IDs (not names)
  const grouped = groups.map(g => ({
    group: g,
    // locations is an array of flId strings
    locations: flData.filter(z => z.group === g).map(z => z.flId)
  }));

  console.log("Grouped FL by Task (IDs):", grouped);
  console.log("FL id->name map:", idToName);

  // Helper to run searches for one group and return aggregated matched dbIds per model
  async function searchGroupModels(groupLocations) {
    const searchPromises = models.map(model =>
      new Promise(resolve => {
        let matchedIds = [];
        let pending = groupLocations.length;

        // If no locations in this group, resolve with empty
        if (pending === 0) return resolve({ model, matchedIds });

        groupLocations.forEach(flId => {
          model.search(
            flId, // SEARCH USING THE FL ID (GUID)
            dbIDs => {
              console.log(`Search for FLId "${flId}" returned IDs (model ${model.id}):`, dbIDs);
              if (dbIDs?.length) matchedIds.push(...dbIDs);
              if (--pending === 0) resolve({ model, matchedIds });
            },
            err => {
              console.warn(`Search error for FLId "${flId}" on model ${model.id}:`, err);
              if (--pending === 0) resolve({ model, matchedIds });
            }
          );
        });
      })
    );

    return Promise.all(searchPromises);
  }

  // Process each group
  for (const { group, locations } of grouped) {
    const color = groupColors[group];

    // 1) Try searching by FL ID
    const resultsById = await searchGroupModels(locations);

    // 2) Check if ANY model found matches; if none found across all models,
    //    fallback to searching by FL NAME (useful if GUIDs aren't present in the model)
    const totalMatchesById = resultsById.reduce((sum, r) => sum + (r.matchedIds?.length || 0), 0);

    let finalResults = resultsById;

    if (totalMatchesById === 0) {
      console.warn(`No matches found by FLId for group "${group}". Falling back to search by FL name.`);

      // Build parallel locations-by-name array ordered the same as 'locations' (flId -> flName)
      const names = locations.map(id => idToName[id] || id);

      // Run searches using names instead
      const searchByNamePromises = models.map(model =>
        new Promise(resolve => {
          let matchedIds = [];
          let pending = names.length;
          if (pending === 0) return resolve({ model, matchedIds });

          names.forEach(name => {
            model.search(
              name,
              dbIDs => {
                console.log(`Fallback search for name "${name}" returned (model ${model.id}):`, dbIDs);
                if (dbIDs?.length) matchedIds.push(...dbIDs);
                if (--pending === 0) resolve({ model, matchedIds });
              },
              err => {
                console.warn(`Fallback search error for name "${name}" on model ${model.id}:`, err);
                if (--pending === 0) resolve({ model, matchedIds });
              }
            );
          });
        })
      );

      finalResults = await Promise.all(searchByNamePromises);
    }

    // Apply theming color to all matched dbIds for each model
    for (const { model, matchedIds } of finalResults) {
      if (!matchedIds || matchedIds.length === 0) continue;

      // Deduplicate matchedIds before applying (just in case)
      const uniqueIds = Array.from(new Set(matchedIds));
      uniqueIds.forEach(id => viewer.setThemingColor(id, color, model));
      console.log(`Group "${group}" → ${uniqueIds.length} matches in model ${model.id}. Example FL names:`,
        uniqueIds.slice(0,5).map(_ => idToName[locations[0]])); // small helpful log
    }
  }

  console.log("Highlighting complete.");
}

// #endregion






// #region Zone FL
// export async function zoneFunctionalLocation(viewer, message) {
//   const zoneData = JSON.parse(message.JSONPayload || "[]");
//   console.log("Parsed zone data:", zoneData);

//   const models = viewer.impl.modelQueue().getModels();
//   if (!models?.length) return;

//   // Clear all theming
//   models.forEach(model => viewer.clearThemingColors(model));
//   if (!Array.isArray(zoneData) || zoneData.length === 0) return;

//   // Unique tenants + colors
//   const tenants = [...new Set(zoneData.map(z => z.Tenant))];
//   const tenantColors = {};
//   tenants.forEach((tenant, i) => {
//     const hue = (i * 360 / tenants.length) / 360;
//     const c = new THREE.Color().setHSL(hue, 0.8, 0.5);
//     tenantColors[tenant] = new THREE.Vector4(c.r, c.g, c.b, 1);
//   });

//   // Group FunctionalLocations by Tenant
//   const tenantGroups = tenants.map(t => ({
//     tenant: t,
//     locations: zoneData.filter(z => z.Tenant === t).map(z => z.FunctionalLocation),
//   }));

//   // Process per tenant
//   for (const { tenant, locations } of tenantGroups) {
//     const tenantColor = tenantColors[tenant];
//     const dbIdsByModel = {};

//     // For each model, batch all location searches
//     const searchPromises = models.map(model =>
//       new Promise(resolve => {
//         let matchedIds = [];
//         let pending = locations.length;
//         if (pending === 0) return resolve();

//         locations.forEach(loc => {
//           model.search(
//             loc,
//             dbIDs => {
//               if (dbIDs?.length) matchedIds.push(...dbIDs);
//               if (--pending === 0) resolve({ model, matchedIds });
//             },
//             err => {
//               console.warn("Search error:", err);
//               if (--pending === 0) resolve({ model, matchedIds });
//             }
//           );
//         });
//       })
//     );

//     const modelResults = await Promise.all(searchPromises);

//     // Apply colors
//     for (const { model, matchedIds } of modelResults) {
//       if (!matchedIds?.length) continue;
//       dbIdsByModel[model.id] = matchedIds;

//       // Apply theming color in bulk
//       matchedIds.forEach(id => viewer.setThemingColor(id, tenantColor, model));
//       viewer.select(matchedIds, model);
//       console.log(`Tenant "${tenant}" → ${matchedIds.length} matches in model ${model.id}`);
//     }
//   }

//   // Optionally refresh view
//   // viewer.impl.invalidate(true, true, true);
// }



export async function zoneFunctionalLocation(viewer, message) {
  viewer.clearSelection();
  const zoneData = JSON.parse(message.JSONPayload || "[]");
  console.log("Parsed zone data:", zoneData);

  const models = viewer.impl.modelQueue().getModels();
  if (!models?.length) return;

  // Clear all theming
  models.forEach(model => viewer.clearThemingColors(model));
  if (!Array.isArray(zoneData) || zoneData.length === 0) return;

  // Define fixed colors
  const red = new THREE.Vector4(1, 0, 0, 1);
  const green = new THREE.Vector4(0, 1, 0, 1);

  const redSel = new THREE.Color(1, 0, 0);
  const greenSel = new THREE.Color(0, 1, 0);


  // Group FunctionalLocations by Tenant
  const tenantGroups = [...new Set(zoneData.map(z => z.Tenant))].map(t => ({
    tenant: t,
    locations: zoneData.filter(z => z.Tenant === t).map(z => z.FunctionalLocation),
  }));

  // Process per tenant
  for (const { tenant, locations } of tenantGroups) {

    // If the tenant is unoccupied → red. Else → green.
    const tenantColor = tenant === "Unoccupied" ? red : green;

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

      matchedIds.forEach(id => viewer.setThemingColor(id, tenantColor, model));
      console.log("Tenant Color:", tenantColor);
      viewer.setSelectionColor(tenant === "Unoccupied" ? redSel : greenSel);
      viewer.select(matchedIds, model);

      console.log(
        `Tenant "${tenant}" → ${matchedIds.length} matches in model ${model.id}`
      );
    }
    
  }
}


// #endregion