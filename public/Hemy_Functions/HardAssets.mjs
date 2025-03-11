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
  if (HardAsset !== "Hard Asset") return;

  let assetValue = localStorage.getItem("ASSET");
  console.log("SEARCHED: " + assetValue);

  // Get models from the viewer
  const models = viewer.impl.modelQueue().getModels();
  
  if (!models || models.length === 0 || !assetValue) {
    console.warn("No models loaded or invalid asset value.");
    return;
  }

  // Search through all models for the specified asset
  models.forEach(model => searchModelForAsset(viewer, model, assetValue));
}

// Function to search a single model for the asset
function searchModelForAsset(viewer, model, assetValue) {
  model.search(assetValue, dbIDs => {
    if (!dbIDs || dbIDs.length === 0) {
      console.log("No matching objects found for: " + assetValue);
      return;
    }

    let matchingDbIDs = [];

    // Isolate all objects initially
    viewer.isolate([], model);

    // Check properties of the found objects
    dbIDs.forEach(dbId => {
      model.getProperties(dbId, props => {
        const { assetIDValue, assetLevel } = getAssetProperties(props);
        
        if (assetIDValue === assetValue) {
          matchingDbIDs.push(dbId);
          console.log(`Matching dbId: ${dbId} with Asset ID: ${assetIDValue}`);

          // Handle floor change and BimWalk activation
          handleLevelsAndBimWalk(viewer, assetLevel, dbIDs, model);
        }
      });
    });

    // Fit and highlight found objects
    fitAndHighlightObjects(viewer, dbIDs, model);
  }, error => {
    console.error("Search error in model:", error);
  });
}

// Helper function to extract the asset properties (Asset ID and Level)
function getAssetProperties(props) {
  let assetIDValue = null;
  let assetLevel = null;

  props.properties.forEach(prop => {
    if (prop.displayName === "Asset ID" || prop.displayName === "Asset ID (GUID)") {
      assetIDValue = prop.displayValue;
    }
    if (["Level", "Schedule Level"].includes(prop.displayName)) {
      assetLevel = prop.displayValue;
      console.log("Level:", assetLevel);
    }
  });

  return { assetIDValue, assetLevel };
}

// Function to handle levels extension and BimWalk activation
function handleLevelsAndBimWalk(viewer, assetLevel, dbIDs, model) {
  viewer.loadExtension('Autodesk.AEC.LevelsExtension').then(levelsExt => {
    if (!levelsExt || !levelsExt.floorSelector) {
      console.error("Levels Extension or floorSelector is not available.");
      return;
    }

    const floorData = levelsExt.floorSelector;
    console.log("Initial Floor Data:", floorData);

    setTimeout(() => {
      const levels = floorData._floors;
      if (!levels || levels.length === 0) {
        console.error("Floors array is still empty.");
        return;
      }

      let matchingLevel = levels.find(level => level.name === assetLevel);
      if (!matchingLevel) {
        console.error("No matching level found for the asset level.");
        return;
      }

      const selectedLevelIndex = matchingLevel.index;
      levelsExt.floorSelector.selectFloor(selectedLevelIndex, true);
      console.log(`Floor changed to level: ${matchingLevel.name}, Index: ${selectedLevelIndex}`);

      viewer.loadExtension('Autodesk.BimWalk').then(bimWalkExt => {
        if (bimWalkExt) {
          bimWalkExt.activate();
          viewer.select(dbIDs, model); // Optionally select the objects
          console.log("BimWalk started.");
        } else {
          console.error("BimWalk extension could not be loaded.");
        }
      });
    }, 2000);
  });
}

// Function to fit and highlight objects
function fitAndHighlightObjects(viewer, dbIDs, model) {
  viewer.fitToView(dbIDs, model);

  // Highlight objects with green color
  let color = new THREE.Vector4(0, 1, 0, 1); // RGBA for green
  viewer.setSelectionColor(new THREE.Color(0, 1, 0)); // RGB: green
  viewer.setThemingColor(dbIDs, color, model);
  viewer.select(dbIDs, model); // Optionally select the objects

  console.log("Final matching dbIDs in model:", dbIDs);
}



