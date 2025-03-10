// export function HardAssetSearch(viewer, HardAsset) {
//   // Assuming this is part of your search function when Hard Asset is selected
//   if (HardAsset === "Hard Asset") {
//     let assetValue = localStorage.getItem("ASSET");
//     console.log("SEARCHED:" + assetValue);

//     // First, get the models from the viewer
//     const models = viewer.impl.modelQueue().getModels();
//     const specificModel = models[1]; // Select the specific model you want to search in

//     // Ensure models are loaded before proceeding
//     if (models && models.length > 0 && assetValue) {
//       // Perform the search within the loaded models
//       models[0].search(
//         assetValue,
//         function (dbIDs) {
//           // If no objects are found, handle it gracefully
//           if (!dbIDs || dbIDs.length === 0) {
//             console.log("No matching objects found for: " + assetValue);
//             return;
//           }

//           // Loop through the models only once
//           models.forEach((model) => {
//             // Hide all objects first
//             viewer.isolate([], model);

//             // Isolate the found objects
//             viewer.isolate(dbIDs, model);
//           });
          
          

//           // Fit to view and highlight the found objects
//           viewer.fitToView(dbIDs);
//           let color = "";

//           // // Get the service tasks from the URL query string
//           // let params = {};
//           // let queryString = window.location.search.substring(1);
//           // let queryParts = queryString.split("&");

//           // for (let i = 0; i < queryParts.length; i++) {
//           //     let param = queryParts[i].split("=");
//           //     params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
//           // }

//           // let serviceTasks = params["subgridData"];  // The service task data, if it exists

//           // // Check if there are service tasks and split them into an array
//           // let serviceTaskList = [];
//           // if (serviceTasks) {
//           //     serviceTaskList = serviceTasks.split("\n");  // Split by newline to convert into an array
//           //     console.log('Service Tasks Array:', serviceTaskList);  // Array of service tasks
//           // }

//           // // Display the service tasks in a docking panel
//           // showServiceTasksDockingPanel(viewer, serviceTaskList);
//           // createToolbarButton(viewer);

//           color = new THREE.Vector4(0, 1, 0, 1); // Green color with full intensity (RGBA)
//           viewer.setSelectionColor(new THREE.Color(0, 1, 0)); // RGB: red, green, blue

//           // Optionally highlight the objects
//           viewer.setThemingColor(dbIDs, color);
//           viewer.select(dbIDs); // Optionally highlight the objects
//           console.log(dbIDs);
//         },
//         function (error) {
//           console.error("Search error:", error); // Handle any potential search errors
//         }
//       );
//     } else {
//       console.warn("No models loaded or invalid asset value.");
//     }
//   }
// }



export function HardAssetSearch(viewer, HardAsset) {
  if (HardAsset === "Hard Asset") {
    let assetValue = localStorage.getItem("ASSET");
    console.log("SEARCHED:" + assetValue);

    // First, get the models from the viewer
    const models = viewer.impl.modelQueue().getModels();

    // Ensure models are loaded before proceeding
    if (models && models.length > 0 && assetValue) {
      models.forEach((model) => {
        model.search(
          assetValue,
          function (dbIDs) {
            if (!dbIDs || dbIDs.length === 0) {
              console.log("No matching objects found for: " + assetValue);
              return;
            }

            // Hide all objects in the current model first
            viewer.isolate([], model);

            // Loop through found dbIDs to check their properties
            let matchingDbIDs = [];
            dbIDs.forEach((dbId) => {
              model.getProperties(dbId, function (props) {
                let assetIDValue = null;
                let assetLevel = null;

                // Check if "Asset ID" matches the searched value and get the Level
                props.properties.forEach(function (prop) {
                  if (prop.displayName === "Asset ID") {
                    assetIDValue = prop.displayValue;
                  }
                  if (prop.displayName === "Asset ID (GUID)") {
                    assetIDValue = prop.displayValue;
                  }
                  if (prop.displayName === "Level") {
                    assetLevel = prop.displayValue; // Save the level value
                    console.log("Level:", assetLevel);
                  }
                  if (prop.displayName === "Schedule Level") {
                    assetLevel = prop.displayValue; // Save the level value
                    console.log("Level:", assetLevel);
                  }
                });

                if (assetIDValue === assetValue) {
                  matchingDbIDs.push(dbId); // Add dbId to matching list if it matches
                  console.log(`Matching dbId: ${dbId} with Asset ID: ${assetIDValue}`);

                  // Check the level in the Levels Extension
                  viewer.loadExtension('Autodesk.AEC.LevelsExtension').then(function (levelsExt) {
                    if (levelsExt && levelsExt.floorSelector) {

                      const floorData = levelsExt.floorSelector;
                        console.log("Initial Floor Data:", floorData);

                        setTimeout(() => {
                            const levels = floorData._floors;
                            console.log("Floor Array after delay:", levels);

                            if (levels && levels.length > 0) {
                                levels.forEach((floor, index) => {
                                    console.log(`Floor ${index}:`, floor);
                                });
                            } else {
                                console.error("Floors array is still empty.");
                            }

                              // Search for the level by name in the levels array
                              let matchingLevel = levels.find(level => level.name === assetLevel);
      
                              if (matchingLevel) {
                                const selectedLevelIndex = matchingLevel.index;
      
                                // Change the floor level based on the index
                                levelsExt.floorSelector.selectFloor(selectedLevelIndex, true);
                                console.log(`Floor changed to level: ${matchingLevel.name}, Index: ${selectedLevelIndex}`);

                                viewer.loadExtension('Autodesk.BimWalk').then(function(bimWalkExt) {
                                  // Start BimWalk after loading the extension
                                  if (bimWalkExt) {
                                    // viewer.fitToView(dbIDs, model);
                                    bimWalkExt.activate();
                                    console.log("BimWalk started.");
                                    
                                  } else {
                                    console.error("BimWalk extension could not be loaded.");
                                  }
                                });

                              } else {
                                console.error('No matching level found for the asset level.');
                              }
                            

                        }, 1000); // Wait for 1 second before checking

                      
                    } else {
                      console.error("Levels Extension or floorSelector is not available.");
                    }
                  });
                }
              });
            });

            // // Isolate the found objects in the current model
            // viewer.isolate(dbIDs, model);

            // Fit to view the found objects in the current model
            viewer.fitToView(dbIDs, model);

            // Highlight the found objects with a green color
            let color = new THREE.Vector4(0, 1, 0, 1); // Green color with full intensity (RGBA)
            viewer.setSelectionColor(new THREE.Color(0, 1, 0)); // RGB: red, green, blue
            viewer.setThemingColor(dbIDs, color, model);
            viewer.select(dbIDs, model); // Optionally highlight the objects
            console.log("Final matching dbIDs in model:", dbIDs);
          },
          function (error) {
            console.error("Search error in model:", error); // Handle any potential search errors
          }
        );
      });
    } else {
      console.warn("No models loaded or invalid asset value.");
    }
    
    
  }
}


