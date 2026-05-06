// const viewableMap = new Map();

// export async function HG62SPRITES(viewer, selectedFloor) {
//     const { SurfaceShadingData, SurfaceShadingPoint, SurfaceShadingNode } = Autodesk.DataVisualization.Core;

//     const extension0 = await viewer.loadExtension('Autodesk.DataVisualization');

//     if (!extension0) {
//       console.error('Error loading the DataVisualization extension.');
//     }

//     console.log('TEST: ' + selectedFloor)
    


//     const DataVizCore = Autodesk.DataVisualization.Core;
//     const viewableType = DataVizCore.ViewableType.SPRITE;
//     const spriteColor = new THREE.Color(0xffffff);  // Red color for better visibility
//     const baseURL = "./images/temp.svg";
//     const spriteIconUrl = `${baseURL}`;
    
//     const style = new DataVizCore.ViewableStyle(viewableType, spriteColor, spriteIconUrl);
    
//     const viewableData = new DataVizCore.ViewableData();
//     viewableData.spriteSize = 30; // Sprites as points of size 24 x 24 pixels

//     const myDataList = [
//       // 3RD floor
//       { position: { x: -97.79080200195312, y: -2.323376417160034 , z: 23.6  }, name: "Apartment Room (HG62.ID.-.3.034)",  pointID: "e0ddd286-51f0-ef11-9342-0022489fdfca", objectDBID: 10939 },
//       { position: { x: -91.14710235595703 , y: -2.323376417160034 , z: 23.6 }, name: "Apartment Room (HG62.ID.-.3.036)",  pointID: "e2ddd286-51f0-ef11-9342-0022489fdfca", objectDBID: 10950 },
//       { position: { x: -92.71158599853516 , y: -8.295315742492676 , z: -20   }, name: "Boiler Room (HG62.ID.-.U2.021)"  ,  pointID: "529208a9-42d7-ef11-8eea-0022489fd3f3", objectDBID: 85133 },
//       // second floor
//     //   { position: { x: 779.6911010742188 , y: 500.82025146484375, z: 18.3 }, name: "Social Area (DB8.-.2.001)"     ,  pointID: "193d3a83-b870-4d7b-83eb-ea73111b8c0a", objectDBID: 7887 },
//     //   { position: { x: 794.48248291015625, y: 493.23358154296875, z: 18.3 }, name: "Office (DB8.-.2.002)"           ,  pointID: "d8d4faa1-2bc9-4809-8a25-08430813fc63", objectDBID: 7886 },
//     ];

//     // { position: { x: -, y: -, z: 10 }, name: "0" },
    
//     try {
//       myDataList.forEach((myData, index) => {
//         const dbId = 10 + index;
//         const position = myData.position;
//         const name = myData.name; // Get the custom name (e.g., "Office (DB8.-.2.010)")
//         const pointId = myData.pointID; // Get the custom id (e.g., "f378f3bf-b905-4928-94d4-ce7dc0baffd0")
//         const objectDBID = myData.objectDBID; // Get the custom id (e.g., "f378f3bf-b905-4928-94d4-ce7dc0baffd0")
//         const viewable = new DataVizCore.SpriteViewable(position, style, dbId, name, pointId, objectDBID);

//         viewable.customData = { name, pointId, objectDBID }; // Attach custom data to the viewable
//         // console.log(`Setting customData for ${name, pointId}:`, viewable.customData);  // Debugging line
//         viewableData.addViewable(viewable);

//         // Add the viewable to the map by dbId
//         viewableMap.set(dbId, viewable);
//       });
    
//       // Try finishing and adding the viewables, with success confirmation
//       await viewableData.finish();  // Ensure the viewable data is finished before proceeding
//       viewer.addEventListener(DataVizCore.MOUSE_CLICK, (event) => onSpriteClicked(event, viewer));
      
//       // Add the viewables to the extension
//       extension0.addViewables(viewableData);

//     } catch (error) {
//       // Catch any errors that occur during the process
//       console.error('Error adding viewables:', error);
//     }



// }




// //                           ACTUAL GET GRAPH DATA

// // Define the onSpriteClicked function to handle sprite clicks
// async function onSpriteClicked(event, viewer) {
//   // Check if the clicked event contains a valid sprite (dbId)
//   if (event.dbId && event.dbId !== -1) {
//       console.log(`Sprite clicked: ${event.dbId}`);
      
//       // Retrieve the viewable from the map using dbId
//       const viewable = viewableMap.get(event.dbId);
      
//       if (viewable) {
//           // Access the custom data from the viewable
//           const name = viewable.customData?.name;
//           const pointID = viewable.customData?.pointId;
//           const location = viewable.customData?.pointId;
//           const objectDBID = viewable.customData?.objectDBID;
//           if (name) {
//               console.log(`Sprite name: ${name}`);  // Log the name associated with the clicked sprite
//               console.log(`Sprite id: ${pointID}`);
//               console.log(`Sprite object: ${objectDBID}`);

//                  if (objectDBID) {
//                   console.log(`Sprite object: ${objectDBID}`);
                   
                 
//                    // Get all models loaded in the viewer
//                    const models = viewer.impl.modelQueue().getModels();
//                    // Iterate over each model
//                      viewer.select([objectDBID], models[1]);  // Select the object in the viewer 
//                      viewer.fitToView([objectDBID], models[1]);  // THE MEP MODEL THAT CONTAINS THE DBID IS IN SECOND INDEX
                   
//                  }
//           } else {
//               console.log('No name found for this sprite.');
//           }

//           // Fetch data from the server for dynamic chart update
//           const response = await fetch(`/api/TempSetpoint/${pointID}`);
//           if (!response.ok) {
//             throw new Error(`Error fetching sensor data: ${response.statusText}`);
//           }

//           const data = await response.json();
          
//           console.log(`Sensor value for ${location}: `, data);
//           // Update the chart with the fetched data
//           let model = 'HG62';
//           //Update the panel with the sprite info and show it
//           viewer.LiveDataPanel.updateSpriteInfo(name, data, model);
//           viewer.LiveDataPanel.setVisible(false);  // Show the Live Data panel
//       } else {
//           console.log('No viewable found for this dbId.');
//       }
//   } else {
//       // Ignore the event if the click did not happen on a sprite
//       console.log("Click outside of sprite detected, no action taken.");
//       viewer.LiveDataPanel.setVisible(false);  // Hide the Live Data panel
//   }
// }








// // sample random numberrrrr


// // async function onSpriteClicked(event, viewer) {
// //   // Check if the clicked event contains a valid sprite (dbId)
// //   if (event.dbId && event.dbId !== -1) {
// //       console.log(`Sprite clicked: ${event.dbId}`);
      
// //       // Retrieve the viewable from the map using dbId
// //       const viewable = viewableMap.get(event.dbId);
      
// //       if (viewable) {
// //           // Access the custom data from the viewable
// //           const name = viewable.customData?.name;
// //           const pointID = viewable.customData?.pointId;
// //           const location = viewable.customData?.pointId;
// //           const objectDBID = viewable.customData?.objectDBID;

// //           if (name) {
// //               console.log(`Sprite name: ${name}`);  // Log the name associated with the clicked sprite
// //               console.log(`Sprite id: ${pointID}`);
// //               console.log(`Sprite object: ${objectDBID}`);

// //               if (objectDBID) {
// //                 console.log(`Sprite object: ${objectDBID}`);
                
              
// //                 // Get all models loaded in the viewer
// //                 const models = viewer.impl.modelQueue().getModels();
// //                 // Iterate over each model
// //                   viewer.select([objectDBID], models[1]);  // Select the object in the viewer 
// //                   viewer.fitToView([objectDBID], models[1]);  // THE MEP MODEL THAT CONTAINS THE DBID IS IN SECOND INDEX
                
// //               }
              
// //           } else {
// //               console.log('No name found for this sprite.');
// //           }

// //           // Generate random test data
// //           const randomData = generateRandomGraphData();  // Call helper function for random data
// //           let model = 'HG62';
// //           // Update the panel with the sprite info and show it
// //           viewer.LiveDataPanel.updateSpriteInfo(name, randomData, model);
// //           viewer.LiveDataPanel.setVisible(true);  // Show the Live Data panel
// //       } else {
// //           console.log('No viewable found for this dbId.');
// //       }
// //   } else {
// //       // Ignore the event if the click did not happen on a sprite
// //       console.log("Click outside of sprite detected, no action taken.");
// //       viewer.LiveDataPanel.setVisible(false);  // Hide the Live Data panel
// //   }
// // }



// // function generateRandomGraphData() {
// //   const data = [];
// //   const now = new Date();
// //   const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0, 0);  // Start at 9:00 AM

// //   let currentTime = new Date(startOfDay);

// //   // Generate random data at 30-minute intervals until the current time
// //   while (currentTime <= now) {
// //       // Format the time (HH:mm) for observationTime
// //       const observationTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// //       // Generate random values between 16 and 25
// //       const value = Math.floor(Math.random() * (25 - 16 + 1)) + 16;

// //       // Push the observationTime and value into the data array
// //       data.push({ observationTime, value });

// //       // Increment time by 30 minutes
// //       currentTime.setMinutes(currentTime.getMinutes() + 30);
// //   }

// //   return data;
// // }




const viewableMap = new Map();
const dbIdModelMap = new Map();

function getWorldPositionForDbId(model, dbId) {
  if (!model) return null;

  const instanceTree = model.getInstanceTree();
  const fragList = model.getFragmentList();
  if (!instanceTree || !fragList) return null;

  let position = null;
  instanceTree.enumNodeFragments(dbId, (fragId) => {
    if (position) return;
    const matrix = new THREE.Matrix4();
    fragList.getWorldMatrix(fragId, matrix);
    position = new THREE.Vector3().setFromMatrixPosition(matrix);
  });

  if (!position) return null;
  position.z += 0.3;
  return position;
}

function getAssetIdFromProps(props) {
  let assetId = null;
  (props?.properties || []).forEach((prop) => {
    if (prop.displayName === "Asset ID (GUID)" || prop.displayName === "Asset ID") {
      assetId = String(prop.displayValue || "").trim();
    }
  });
  return assetId;
}

function searchAssetDbIdInModel(model, assetId) {
  return new Promise((resolve) => {
    model.search(
      assetId,
      (dbIDs) => {
        if (!dbIDs || dbIDs.length === 0) {
          resolve([]);
          return;
        }

        const propChecks = dbIDs.map(
          (dbId) =>
            new Promise((propResolve) => {
              model.getProperties(dbId, (props) => {
                const propAssetId = getAssetIdFromProps(props);
                // console.log("Properties:", props.name);
                console.log(`Checking huh ${assetId} with assetId ${propAssetId}`);
                if (props?.name != null || props?.name !== "" || props?.name !== undefined) {
                  console.log(`Match found for assetId ${assetId} in model ${model.getData().name} at dbId ${dbId}`);
                  propResolve({
                    dbId,
                    model,
                  });
                  return;
                }
                propResolve(null);
              });
            }),
        );

        Promise.all(propChecks).then((matches) => {
          resolve(matches.filter(Boolean));
        });
      },
      () => resolve([]),
      ["Asset ID", "Asset ID (GUID)"],
    );
  });
}

async function resolveDbIdForAsset(viewer, assetId) {
  const models = viewer.impl.modelQueue().getModels();
  for (const model of models) {
    const matches = await searchAssetDbIdInModel(model, assetId);
    if (matches.length > 0) {
      console.log(`Found match for assetId ${assetId} in model ${model.getData().name}:`, matches);
      return matches[0];
    }
  }
  console.warn(`No DBID found for assetId ${assetId} in any model.`);
  return null;
}

export async function HG62SPRITES(viewer, selectedFloor) {
  const extension0 = await viewer.loadExtension("Autodesk.DataVisualization");
  if (!extension0) {
    console.error("Error loading the DataVisualization extension.");
    return [];
  }

  console.log("HG62 selected floor:", selectedFloor);

  const response = await fetch("/hg62/live_data");
  if (!response.ok) {
    throw new Error(`Error fetching HG62 live data: ${response.statusText}`);
  }

  const payload = await response.json();
  const items = payload?.data?.liveDatas?.items || [];
  if (items.length === 0) {
    console.log("No HG62 live data items found.");
    return [];
  }

  const DataVizCore = Autodesk.DataVisualization.Core;
  const style = new DataVizCore.ViewableStyle(
    DataVizCore.ViewableType.SPRITE,
    new THREE.Color(0xffffff),
    "./images/temp.svg",
  );

  const viewableData = new DataVizCore.ViewableData();
  viewableData.spriteSize = 30;

  viewableMap.clear();
  dbIdModelMap.clear();

  const assetCache = new Map();
  let spriteDbId = 10;

  for (const item of items) {
    const assetId = String(item.assetId || "").trim();
    if (!assetId) continue;

    if (!assetCache.has(assetId)) {
      const match = await resolveDbIdForAsset(viewer, assetId);
      assetCache.set(assetId, match);
      // console.log(`Resolved assetId ${assetId} to dbId ${match?.dbId} in model ${match?.model?.getData()?.name}`);
    }

    const matched = assetCache.get(assetId);
    // console.log(`Asset ID: ${assetId}, Matched DBID: ${matched?.dbId}, Model: ${matched?.model?.getData()?.name}`);
    if (!matched) continue;

    const position = getWorldPositionForDbId(matched.model, matched.dbId);
    if (!position) continue;

    const name = item.sensorName || item.functionalLocation || `Asset ${assetId}`;
    const viewable = new DataVizCore.SpriteViewable(
      { x: position.x, y: position.y, z: position.z },
      style,
      spriteDbId,
      name,
    );

    viewable.customData = {
      name,
      pointId: assetId,
      assetId,
      objectDBID: matched.dbId,
      model: matched.model,
      sensorData: item,
    };

    viewableData.addViewable(viewable);
    viewableMap.set(spriteDbId, viewable);
    dbIdModelMap.set(matched.dbId, matched.model);
    spriteDbId += 1;
  }

  await viewableData.finish();
  extension0.addViewables(viewableData);

  if (viewer._hg62SpriteClickHandler) {
    viewer.removeEventListener(DataVizCore.MOUSE_CLICK, viewer._hg62SpriteClickHandler);
  }
  viewer._hg62SpriteClickHandler = (event) => onSpriteClicked(event, viewer);
  viewer.addEventListener(DataVizCore.MOUSE_CLICK, viewer._hg62SpriteClickHandler);

  return Array.from(viewableMap.keys());
}

async function onSpriteClicked(event, viewer) {
  if (!event.dbId || event.dbId === -1) {
    viewer.LiveDataPanel?.setVisible(false);
    return;
  }

  const viewable = viewableMap.get(event.dbId);
  if (!viewable?.customData) {
    viewer.LiveDataPanel?.setVisible(false);
    return;
  }

  const { name, pointId, objectDBID, model, sensorData } = viewable.customData;
  const targetModel = model || dbIdModelMap.get(objectDBID);

  if (objectDBID && targetModel) {
    viewer.select([objectDBID], targetModel);
    viewer.fitToView([objectDBID], targetModel);
  }

  let latestData = sensorData;
  try {
    const response = await fetch("/hg62/live_data");
    if (response.ok) {
      const payload = await response.json();
      const items = payload?.data?.liveDatas?.items || [];
      latestData = items.find((entry) => String(entry.assetId || "").trim() === pointId) || sensorData;
    }
  } catch (error) {
    console.warn("Could not refresh live data on sprite click:", error);
  }

  viewer.LiveDataPanel?.updateSpriteInfo(name, latestData, "HG62");
  viewer.LiveDataPanel?.setVisible(false);
}











// sample random numberrrrr


// async function onSpriteClicked(event, viewer) {
//   // Check if the clicked event contains a valid sprite (dbId)
//   if (event.dbId && event.dbId !== -1) {
//       console.log(`Sprite clicked: ${event.dbId}`);
      
//       // Retrieve the viewable from the map using dbId
//       const viewable = viewableMap.get(event.dbId);
      
//       if (viewable) {
//           // Access the custom data from the viewable
//           const name = viewable.customData?.name;
//           const pointID = viewable.customData?.pointId;
//           const location = viewable.customData?.pointId;
//           const objectDBID = viewable.customData?.objectDBID;

//           if (name) {
//               console.log(`Sprite name: ${name}`);  // Log the name associated with the clicked sprite
//               console.log(`Sprite id: ${pointID}`);
//               console.log(`Sprite object: ${objectDBID}`);

//               if (objectDBID) {
//                 console.log(`Sprite object: ${objectDBID}`);
                
              
//                 // Get all models loaded in the viewer
//                 const models = viewer.impl.modelQueue().getModels();
//                 // Iterate over each model
//                   viewer.select([objectDBID], models[1]);  // Select the object in the viewer 
//                   viewer.fitToView([objectDBID], models[1]);  // THE MEP MODEL THAT CONTAINS THE DBID IS IN SECOND INDEX
                
//               }
              
//           } else {
//               console.log('No name found for this sprite.');
//           }

//           // Generate random test data
//           const randomData = generateRandomGraphData();  // Call helper function for random data
//           let model = 'HG62';
//           // Update the panel with the sprite info and show it
//           viewer.LiveDataPanel.updateSpriteInfo(name, randomData, model);
//           viewer.LiveDataPanel.setVisible(true);  // Show the Live Data panel
//       } else {
//           console.log('No viewable found for this dbId.');
//       }
//   } else {
//       // Ignore the event if the click did not happen on a sprite
//       console.log("Click outside of sprite detected, no action taken.");
//       viewer.LiveDataPanel.setVisible(false);  // Hide the Live Data panel
//   }
// }



// function generateRandomGraphData() {
//   const data = [];
//   const now = new Date();
//   const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0, 0);  // Start at 9:00 AM

//   let currentTime = new Date(startOfDay);

//   // Generate random data at 30-minute intervals until the current time
//   while (currentTime <= now) {
//       // Format the time (HH:mm) for observationTime
//       const observationTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//       // Generate random values between 16 and 25
//       const value = Math.floor(Math.random() * (25 - 16 + 1)) + 16;

//       // Push the observationTime and value into the data array
//       data.push({ observationTime, value });

//       // Increment time by 30 minutes
//       currentTime.setMinutes(currentTime.getMinutes() + 30);
//   }

//   return data;
// }