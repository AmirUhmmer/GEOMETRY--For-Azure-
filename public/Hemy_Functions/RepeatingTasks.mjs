export function RepeatingTasks(viewer, RepeatingTask) {
    if (RepeatingTask === "TRUE") {
      // First, get the models from the viewer
      const models = viewer.impl.modelQueue().getModels();
  
      // Call the function to get the array of tasks and log it
      let taskArray = getSubgridDataFromURL();
      console.log(taskArray);
  
      let alldbidFunctionalLocation = [];
      let alldbidAsset = [];
      let alldbid = [];
  
      // Prepare color array
      const staticColors = [
        { name: "Violet", vectorColor: new THREE.Vector4(0.54, 0.17, 0.89, 1) },
        { name: "Orange", vectorColor: new THREE.Vector4(1, 0.5, 0, 1) },
        { name: "Red", vectorColor: new THREE.Vector4(1, 0, 0, 1) },
        { name: "Blue", vectorColor: new THREE.Vector4(0, 0, 1, 1) },
        { name: "Yellow", vectorColor: new THREE.Vector4(1, 1, 0, 1) },
        { name: "Cyan", vectorColor: new THREE.Vector4(0, 1, 1, 1) },
        { name: "Magenta", vectorColor: new THREE.Vector4(1, 0, 1, 1) },
        { name: "Purple", vectorColor: new THREE.Vector4(0.5, 0, 0.5, 1) },
        { name: "Pink", vectorColor: new THREE.Vector4(1, 0.75, 0.8, 1) },
        { name: "Brown", vectorColor: new THREE.Vector4(0.6, 0.3, 0, 1) },
      ];
  
      // Use promises to wait for all search operations to complete
      let searchPromises = taskArray.map((task, index) => {
        let promises = [];
  
        // Get the color based on the index (using modulo to cycle through colors)
        let color = staticColors[index % staticColors.length].vectorColor;
  
        // Extract the Functional Location ID and Hard Asset ID from the task object
        let funcLocID = task["Functional Location ID"];
        if (funcLocID != "N") {
          promises.push(
            new Promise((resolve) => {
              // Search for the Functional Location ID in the first model (models[0])
              models[0].search(funcLocID, function (dbIDs) {
                console.log("Found dbIDs for Functional Location:", dbIDs);

                // Apply the color to each Functional Location dbID
                dbIDs.forEach((dbID) => {
                  viewer.setThemingColor(dbID, color, models[0]);
                });

                // Array of promises for fetching properties of the dbIDs
                let propertyPromises = dbIDs.map((dbID) => {
                  return new Promise((propResolve) => {
                    // Fetch properties for each dbID
                    models[0].getProperties(dbID, function (props) {
                      let assetIDValue = null;
                      let assetLevel = null;
                      let FLname = null;

                      console.log("Properties for dbID:", dbID, props);
                      console.log("Properties Name:", props.name);
                      // let testdbid = [18052, 17948, 15810];
                      // Office 014
                      // 
                      // getElementBoundingBox(viewer, testdbid);
                      
                    //   viewer.getObjectTree(function (instanceTree) {
                    //     // Iterate over each dbId in your testdbid array
                    //     testdbid.forEach(function (dbId) {
                    //         var boundingBox = new THREE.Box3(); // Initialize the bounding box here
                    
                    //         if (instanceTree) {
                    //             instanceTree.enumNodeFragments(dbId, function (fragId) {
                    //                 const fragList = viewer.model.getFragmentList(); // Use viewer's model fragment list
                    
                    //                 // Get the bounding box of the fragment
                    //                 var fragBoundingBox = new THREE.Box3();
                    //                 fragList.getWorldBounds(fragId, fragBoundingBox);
                    //                 boundingBox.union(fragBoundingBox); // Accumulate bounding boxes
                    
                    //                 // Get the world matrix of the fragment
                    //                 const matrix = new THREE.Matrix4();
                    //                 fragList.getWorldMatrix(fragId, matrix);
                    
                    //                 // Extract the position (coordinates) from the matrix
                    //                 const position = new THREE.Vector3();
                    //                 position.setFromMatrixPosition(matrix);
                    
                    //                 // Log the world coordinates
                    //                 console.log(`World Coordinates for dbId ${dbId} (Model ${viewer.model.id}): x=${position.x}, y=${position.y}, z=${position.z}`);
                    //             });
                    
                    //             // After processing all fragments for the dbId
                    //             console.log('Bounding Box for dbId ' + dbId + ':', boundingBox);
                    //         } else {
                    //             console.log("InstanceTree not available for model:", viewer.model);
                    //         }
                    //     });
                    // });


                    // createHeatmapFromDbIds(viewer, testdbid);

                    // generateDevicesFromDbIds(viewer, testdbid);
                    
                    

                      // Check if "Asset ID" or "Asset ID (GUID)" matches the searched value
                      props.properties.forEach(function (prop) {
                        if (prop.displayName === "Asset ID" || prop.displayName === "Asset ID (GUID)") {
                          assetIDValue = prop.displayValue;
                        }
                        if (prop.displayName === "Level" || prop.displayName === "Schedule Level") {
                          assetLevel = prop.displayValue; // Save the level value
                          console.log("Level:", assetLevel);
                        }
                      });

                      // If Asset ID and Level match, and name is not null, store the dbID
                      // this should add in the filters assetLevel != null
                      if (assetIDValue === funcLocID && assetIDValue != null && FLname != null) {
                        alldbidFunctionalLocation = alldbidFunctionalLocation.concat(dbID);
                        alldbid = alldbid.concat(dbID);
                        console.log(`Matching dbId: ${dbID} with Asset ID: ${assetIDValue} and Level: ${assetLevel} in model ${models[0].id}`);
                        viewer.setThemingColor(dbID, color, models[0]);
                      }

                      // Resolve the property promise
                      propResolve();
                    });
                  });
                });

                // Wait for all property fetches to complete before resolving the main promise
                Promise.all(propertyPromises).then(() => {
                  resolve();
                });
              });
            })
          );
        }

  
        let hardAssetID = task["Hard Asset ID"];
        if (hardAssetID != "N") {
          const models = viewer.impl.modelQueue().getModels(); // Get all models in the viewer
          models.forEach((model) => {
            promises.push(
              new Promise((resolve) => {
                model.search(hardAssetID, function (dbIDs) {
                  console.log(`Found dbIDs for asset in model ${model.id}:`, dbIDs);

                  // Array of promises for fetching properties
                  let propertyPromises = dbIDs.map((dbID) => {
                    return new Promise((propResolve) => {
                      

                      // Fetch properties for the dbID
                      model.getProperties(dbID, function (props) {
                        let assetIDValue = null;
                        let assetLevel = null;

                        console.log("Properties for dbID:", dbID, props);
                        console.log("Properties Name:", props.name);

                        // Check if "Asset ID" or "Asset ID (GUID)" matches the searched value
                        props.properties.forEach(function (prop) {
                          if (prop.displayName === "Asset ID" || prop.displayName === "Asset ID (GUID)") {
                            assetIDValue = prop.displayValue;
                          }
                          if (prop.displayName === "Level" || prop.displayName === "Schedule Level") {
                            assetLevel = prop.displayValue; // Save the level value
                            console.log("Level:", assetLevel);
                          }
                        });

                        // If Asset ID matches, store the dbID
                        if (assetIDValue === hardAssetID && assetLevel != null && assetIDValue != null && props.name != null) {
                          alldbidAsset = alldbidAsset.concat(dbID);
                          alldbid = alldbid.concat(dbID);
                          console.log(`Matching dbId: ${dbID} with Asset ID: ${assetIDValue} and Level: ${assetLevel} and with model ${model.id}`);
                          viewer.setThemingColor(dbID, color, model);
                          
                        }

                        // Resolve the property promise
                        propResolve();
                      });
                    });
                  });

                  // Wait for all property fetches to complete before resolving the main promise
                  Promise.all(propertyPromises).then(() => {
                    resolve();
                  });
                });
              })
            );
          });
        }

        
  
        return Promise.all(promises);
      });
  
      // After all search promises are resolved, proceed with isolation and selection
      Promise.all(searchPromises).then(() => {
        console.log("This is your dbid ", alldbid);
        console.log("This is your dbid for Asset", alldbidAsset);
        console.log("This is your dbid for FL", alldbidFunctionalLocation);
        const models = viewer.impl.modelQueue().getModels();
        models.forEach((model) => {
          alldbid.forEach((dbId) => {
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
                  console.log("LAST PROCESS Level:", assetLevel);
                }
                if (prop.displayName === "Schedule Level") {
                  assetLevel = prop.displayValue; // Save the level value
                  console.log("Level:", assetLevel);
                }
              });

                // console.log(`Matching dbId: ${dbId} with Asset ID: ${assetIDValue}`);

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
                              if(alldbidAsset.length > 0){
                                levelsExt.floorSelector.selectFloor(selectedLevelIndex, true);
                              }
                              // levelsExt.floorSelector.selectFloor(selectedLevelIndex, true);
                              console.log(`Floor changed to level: ${matchingLevel.name}, Index: ${selectedLevelIndex}`);

                              viewer.loadExtension('Autodesk.BimWalk').then(function(bimWalkExt) {
                                // Start BimWalk after loading the extension
                                if (bimWalkExt) {
                                  // bimWalkExt.activate();
                                  viewer.select(alldbid, model); // Select all dbIDs at once for the model
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
            });
          });
        });
  
        // Set the selection color to green (or any default color for selection)
        viewer.setSelectionColor(new THREE.Color(0x892be3));
  
        // // Once dbIDs are found, isolate the found objects
        // models.forEach((model) => {
        //   viewer.isolate(alldbid, model);
        // });
  
        // Fit the view to the found objects (combined bounding box as done earlier)

        if(alldbidAsset.length > 0){
          models.forEach((model) => {
          viewer.fitToView(alldbidAsset, model);
        });
        }

        if(alldbidFunctionalLocation.length > 0){
          viewer.fitToView(alldbidFunctionalLocation, models[0]);
          if(alldbidAsset.length == 0){
            models.forEach((model) => {
              viewer.isolate(alldbidFunctionalLocation, model);
            });
          }
        }

        
        models.forEach((model) => {
          viewer.select(alldbid, model); // Select all dbIDs at once for the model
        });

        
        

        // console.log("Final matching dbIDs in model:", dbIDs);
      });
  
      createToolbarRepeatingTaskButton(viewer);
      showRepeatingTaskPanel(viewer, taskArray, staticColors);
    }


    else if (RepeatingTask === "TRUE1") {
      // First, get the models from the viewer
      const models = viewer.impl.modelQueue().getModels();
  
      createToolbarRepeatingTaskButtonTEST(viewer);
      showRepeatingTaskPanelTEST(viewer);

      window.addEventListener('message', function(event) {
        // Ensure the message comes from a trusted origin
        // if (event.origin !== 'https://your-dynamics-origin') return;
    
        var data = event.data;
        console.log("Data received from iframe:", data);
        // You can now process the `data` object, which contains the guid, abbreviation, and any other data
    });
    
    }
  }








  // async function generateDevicesFromDbIds(viewer, dbIds) {
  //   const dataVizExtn = await viewer.loadExtension("Autodesk.DataVisualization");
  //   const structureInfo = new Autodesk.DataVisualization.Core.ModelStructureInfo(viewer.model);
  
  //   console.log("Using static coordinates for device generation.");
  
  //   // Static coordinates without room mapping
  //   const devices = [
  //     {
  //       id: `Device_Static_01`,
  //       position: { x: 806.887451171875, y: 551.6994018554688, z: 11.482939720153809 },
  //       roomId: null,
  //       sensorTypes: ["temperature"],
  //     },
  //   ];
  
  //   const shadingData = new Autodesk.DataVisualization.Core.SurfaceShadingData({ id: "shadingDataId" });
  //   const shadingGroup = new Autodesk.DataVisualization.Core.SurfaceShadingGroup({
  //     id: "static_group",
  //     name: "Static Device Group",
  //   });
  
  //   devices.forEach((device) => {
  //     const shadingPoint = new Autodesk.DataVisualization.Core.SurfaceShadingPoint({
  //       id: device.id,
  //       position: device.position,
  //       sensorTypes: device.sensorTypes,
  //     });
  //     shadingGroup.addChild(shadingPoint);
  //   });
  
  //   shadingData.addChild(shadingGroup);
  
  //   console.log("Generated Shading Data:", shadingData);
  
  //   await dataVizExtn.setupSurfaceShading(viewer.model, shadingData);
  
  //   const sensorColors = [0x0000ff, 0x00ff00, 0xffff00, 0xff0000];
  //   const sensorType = "temperature";
  //   dataVizExtn.registerSurfaceShadingColors(sensorType, sensorColors);
  
  //   // Use a fixed value for testing
  //   function getSensorValue() {
  //     return 0.5; // Test with a fixed value
  //   }
  
  //   const floorName = "Default Floor";
  //   console.log("Using floor name:", floorName);
  
  //   try {
  //     await dataVizExtn.renderSurfaceShading(floorName, sensorType, getSensorValue);
  //     console.log("Heatmap setup completed.");
  //     viewer.impl.invalidate(true, true, true); // Force re-rendering
  //   } catch (error) {
  //     console.error("Error rendering surface shading:", error);
  //   }
  // }
  
  
  
  






















// // Function to generate devices from a list of dbIds
// async function generateDevicesFromDbIds(viewer, dbIds) {
//   console.log("Generating devices from dbIds:", dbIds); // Log input dbIds
//   const devices = [];
  
//   viewer.getObjectTree(function (instanceTree) {
//     if (!instanceTree) {
//       console.error("InstanceTree not available.");
//       return;
//     }
    
//     dbIds.forEach(function (dbId) {
//       try {
//         let boundingBox = new THREE.Box3(); // Initialize the bounding box here

//         instanceTree.enumNodeFragments(dbId, function (fragId) {
//           const fragList = viewer.model.getFragmentList(); // Use viewer's model fragment list

//           // Get the bounding box of the fragment
//           const fragBoundingBox = new THREE.Box3();
//           fragList.getWorldBounds(fragId, fragBoundingBox);
//           boundingBox.union(fragBoundingBox); // Accumulate bounding boxes

//           // Get the world matrix of the fragment
//           const matrix = new THREE.Matrix4();
//           fragList.getWorldMatrix(fragId, matrix);

//           // Extract the position (coordinates) from the matrix
//           const position = new THREE.Vector3();
//           position.setFromMatrixPosition(matrix);

//           // Log the world coordinates
//           console.log(`World Coordinates for dbId ${dbId} (Model ${viewer.model.id}): x=${position.x}, y=${position.y}, z=${position.z}`);

//           // Push device with position
//           devices.push({
//             id: `Device_${dbId}`,  // Unique ID for each device
//             position: { x: position.x, y: position.y, z: position.z },
//             sensorTypes: ["temperature"],  // Customize this as needed
//           });
//         });

//         // Log the bounding box after processing all fragments for this dbId
//         console.log('Bounding Box for dbId ' + dbId + ':', boundingBox);

//       } catch (error) {
//         console.error(`Error getting position for dbId ${dbId}:`, error);
//       }
//     });
//   });

//   return devices;
// }

// async function generateSurfaceShadingData(viewer, devices) {
//   const shadingData = new Autodesk.DataVisualization.Core.SurfaceShadingData();

//   devices.forEach((device) => {
//     const shadingPoint = new Autodesk.DataVisualization.Core.SurfaceShadingPoint(device.id);
//     console.log("Shading Point:", shadingPoint); // Log for debugging

//     device.sensorTypes.forEach((sensorType) => {
//       // Check if addSensor is a function before calling
//       if (typeof shadingPoint.addSensor === "function") {
//         shadingPoint.addSensor(new Autodesk.DataVisualization.Core.SurfaceShadingSensor(sensorType));
//       } else {
//         console.error(`addSensor is not a function for shadingPoint: ${device.id}`);
//       }
//     });

//     shadingData.addSurfaceShadingPoint(shadingPoint);
//   });

//   return shadingData;
// }


// // Function to setup heatmap and render it with room logging
// async function setupAndRenderHeatmap(viewer, devices) {
//   const dataVizExtn = viewer.getExtension('Autodesk.DataVisualization');

//   console.log("Setting up surface shading for devices:", devices); // Log devices

//   // Generate shading data for the devices
//   const shadingData = await generateSurfaceShadingData(viewer, devices);
//   await dataVizExtn.setupSurfaceShading(viewer.model, shadingData);

//   // Register heatmap colors
//   const sensorColors = [0x0000ff, 0x00ff00, 0xffff00, 0xff0000]; // Blue to Red gradient
//   const sensorType = "temperature";
//   dataVizExtn.registerSurfaceShadingColors(sensorType, sensorColors);

//   // Function to get the sensor value for each device and log the room being shaded
//   function getSensorValue(surfaceShadingPoint, sensorType) {
//     const deviceId = surfaceShadingPoint.id;

//     // Log the room being shaded (the device id corresponds to the room id)
//     console.log("Shading room/device with id:", deviceId);

//     // Simulate reading sensor data (replace this with actual sensor data)
//     let sensorValue = Math.random() * 100; // Example: Random value between 0 and 100
//     const maxSensorValue = 100;  // Max possible sensor value
//     const minSensorValue = 0;    // Min possible sensor value

//     // Normalize the sensor value to [0, 1.0]
//     sensorValue = (sensorValue - minSensorValue) / (maxSensorValue - minSensorValue);
//     return THREE.MathUtils.clamp(sensorValue, 0.0, 1.0);
//   }

//   // Apply the heatmap to the desired floor or area and log the floor being rendered
//   const floorName = "01 - Entry Level";  // Customize based on your model
//   console.log("Rendering heatmap for floor:", floorName);

//   // Render heatmap and log the result
//   const room = dataVizExtn.renderSurfaceShading(floorName, sensorType, getSensorValue);
//   console.log("Room with heatmap:", room); // Log the room with heatmap applied
// }

// // Function to initiate heatmap creation from dbIds
// async function createHeatmapFromDbIds(viewer, dbIds) {
//   console.log("Creating heatmap from dbIds..."); // Log start of the function
//   const devices = await generateDevicesFromDbIds(viewer, dbIds);
//   console.log("Devices generated:", devices); // Log generated devices
//   await setupAndRenderHeatmap(viewer, devices);
//   console.log("Heatmap setup completed."); // Log after heatmap is set up
// }


















  

// Function to get subgrid data and return an array of task objects
function getSubgridDataFromURL() {
  let params = {};
  let queryString = window.location.search.substring(1); // Remove "?" from the start of the query string
  let queryParts = queryString.split("&");

  // Parse query string into key-value pairs
  for (let i = 0; i < queryParts.length; i++) {
    let param = queryParts[i].split("=");
    params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
  }

  // Check if subgridData exists in the query parameters
  let subgridData = params["subgridData"];
  if (!subgridData) {
    console.log("No subgrid data found in the URL.");
    return [];
  }

  // Split the subgrid data by newline characters ("%0A" in URL encoding)
  let tasks = subgridData.split("\n"); // Split into individual service task entries

  // Create an array to hold the task objects
  let taskArray = [];

  // Parse each task and extract relevant data (Name, Functional Location ID, Hard Asset ID)
  tasks.forEach((task) => {
    if (task.trim() === "") return; // Skip empty lines

    // Split each task entry into key-value pairs (each entry is separated by commas)
    let taskParts = task.split(", ");
    let taskData = {};

    // Extract the key-value pairs
    taskParts.forEach((part) => {
      let [key, value] = part.split(": ");
      taskData[key] = value;
    });

    // Add the task data to the array
    taskArray.push(taskData);
  });

  // Return the array of task objects
  return taskArray;
}


// Declare the button globally so it can be accessed in other functions
let showRepeatingTaskButton;

function createToolbarRepeatingTaskButton(viewer) {
    const toolbar = viewer.getToolbar();
    if (!toolbar) {
        console.error("Toolbar not found");
        return;
    }

    // Create a new toolbar button
    showRepeatingTaskButton = new Autodesk.Viewing.UI.Button('showRepeatingTaskButton');

    // Apply icon styling directly to the button's container
    const buttonContainer = showRepeatingTaskButton.container;
    buttonContainer.style.backgroundImage = 'url(./images/task.svg)';  // Set your icon image source here
    buttonContainer.style.backgroundColor = 'transparent';  // Make background transparent
    buttonContainer.style.backgroundSize = '32px';  // Adjust size of the background image
    buttonContainer.style.backgroundRepeat = 'no-repeat';  // Ensure no repeat of the image
    buttonContainer.style.backgroundPosition = 'center';  // Center the image inside the button

    showRepeatingTaskButton.setToolTip('Repeating Task');  // Set the tooltip for the button

    // Define the action when the button is clicked
    showRepeatingTaskButton.onClick = function() {
        if (viewer.RepeatingTaskPanel) {
            viewer.RepeatingTaskPanel.setVisible(!viewer.RepeatingTaskPanel.isVisible());
        } else {
            showRepeatingTaskPanel(viewer, []);  // Show panel even if no service tasks exist yet
        }
    };

    // Add the button to a new toolbar group
    let subToolbar = viewer.toolbar.getControl('myAppToolbar');
    if (!subToolbar) {
        subToolbar = new Autodesk.Viewing.UI.ControlGroup('myAppToolbar');
        toolbar.addControl(subToolbar);
    }
    subToolbar.addControl(showRepeatingTaskButton);

    // Call this function once the viewer is fully initialized
    viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, function() {
        createToolbarRepeatingTaskButton(viewer);
    });
}




// Function to create and display a docking panel
export function showRepeatingTaskPanel(viewer, taskArray, colorMapping) {
    // Create a custom Docking Panel class
    class RepeatingTaskPanel extends Autodesk.Viewing.UI.DockingPanel {
      constructor(viewer, title, options) {
        super(viewer.container, title, options);
  
        // Set the panel styles
        this.container.style.top = "10px";
        this.container.style.left = "10px";
        this.container.style.width = "300px";
        this.container.style.height = "325px";
        this.container.style.resize = "auto";
        this.container.style.backgroundColor = '#333';
        this.container.style.title = 'Tasks';
  
        // Create and configure the scroll container
        this.createScrollContainer();
      }
  
      // Create the content of the panel
      createScrollContainer() {
        // Create the scroll container
        this.scrollContainer = document.createElement('div');
        this.scrollContainer.style.overflow = 'auto';
        this.scrollContainer.style.padding = '1em';  // Add padding to the scroll container
        this.scrollContainer.style.height = '100%';  // Ensure it takes full panel height
        this.container.appendChild(this.scrollContainer);  // Append the scroll container to the panel
  
        // Create and append elements to the scroll container
        this.createPanelContent();
      }
  
      // Create the content inside the scroll container
      createPanelContent() {
        // Loop through the taskArray and create elements for each task
        taskArray.forEach((task, index) => {
          const taskName = task['Name']; // Assuming the task name is stored under "Service Task"
          const color = colorMapping[index].name; // Get the color name for this index
  
          const container = document.createElement('div');
          container.style.marginBottom = '10px';  // Add space between elements
  
          // Display the task name and its color
          container.innerHTML = `<strong style="color: ${color.toLowerCase()};">${taskName}</strong>: <span style="color: ${color.toLowerCase()};">${color}</span>`;
  
          this.scrollContainer.appendChild(container);
        });
      }
    }
  
    // Check if a panel already exists and remove it
    if (viewer.RepeatingTaskPanel) {
      viewer.RepeatingTaskPanel.setVisible(false);
      viewer.RepeatingTaskPanel.uninitialize();
    }
  
    // Create a new panel with the title 'Service Task'
    viewer.RepeatingTaskPanel = new RepeatingTaskPanel(viewer, "Repeating Task", "Repeating Task", {});

    // Show the panel by setting it to visible
    viewer.RepeatingTaskPanel.setVisible(true);
  }
  

// Declare the button globally so it can be accessed in other functions
let showRepeatingTaskButtonTEST;

function createToolbarRepeatingTaskButtonTEST(viewer) {
    const toolbar = viewer.getToolbar();
    if (!toolbar) {
        console.error("Toolbar not found");
        return;
    }

    // Create a new toolbar button
    showRepeatingTaskButtonTEST = new Autodesk.Viewing.UI.Button('showRepeatingTaskButtonTEST');

    // Apply icon styling directly to the button's container
    const buttonContainer = showRepeatingTaskButtonTEST.container;
    buttonContainer.style.backgroundImage = 'url(./images/task.svg)';  // Set your icon image source here
    buttonContainer.style.backgroundColor = 'transparent';  // Make background transparent
    buttonContainer.style.backgroundSize = '32px';  // Adjust size of the background image
    buttonContainer.style.backgroundRepeat = 'no-repeat';  // Ensure no repeat of the image
    buttonContainer.style.backgroundPosition = 'center';  // Center the image inside the button

    showRepeatingTaskButtonTEST.setToolTip('Repeating Task TEST');  // Set the tooltip for the button

    // Define the action when the button is clicked
    showRepeatingTaskButtonTEST.onClick = function() {
        if (viewer.RepeatingTaskPanelTEST) {
            viewer.RepeatingTaskPanelTEST.setVisible(!viewer.RepeatingTaskPanelTEST.isVisible());
        } else {
            showRepeatingTaskPanelTEST(viewer, []);  // Show panel even if no service tasks exist yet
        }
    };

    // Add the button to a new toolbar group
    let subToolbar = viewer.toolbar.getControl('myAppToolbar');
    if (!subToolbar) {
        subToolbar = new Autodesk.Viewing.UI.ControlGroup('myAppToolbar');
        toolbar.addControl(subToolbar);
    }
    subToolbar.addControl(showRepeatingTaskButtonTEST);

    // Call this function once the viewer is fully initialized
    viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, function() {
        createToolbarRepeatingTaskButtonTEST(viewer);
    });
}



// TEST


// Function to create and display a docking panel
export function showRepeatingTaskPanelTEST(viewer, taskArray, colorMapping) {
  // Create a custom Docking Panel class
  class RepeatingTaskPanelTEST extends Autodesk.Viewing.UI.DockingPanel {
    constructor(viewer, title, options) {
      super(viewer.container, title, options);

      // Set the panel styles
      this.container.style.top = "10px";
      this.container.style.left = "10px";
      this.container.style.width = "300px";
      this.container.style.height = "650px";
      this.container.style.resize = "auto";
      this.container.style.backgroundColor = '#333';
      this.container.style.title = 'Tasks';

      // Create and configure the scroll container
      this.createScrollContainer();
    }

    // Create the content of the panel
    createScrollContainer() {
      // Create the scroll container
      this.scrollContainer = document.createElement('div');
      this.scrollContainer.style.overflow = 'auto';
      this.scrollContainer.style.padding = '1em';  // Add padding to the scroll container
      this.scrollContainer.style.height = '100%';  // Ensure it takes full panel height
      this.container.appendChild(this.scrollContainer);  // Append the scroll container to the panel

      // Create and append the iframe under the checkboxes
      const iframeContainer = document.createElement('div');
      iframeContainer.style.marginTop = '5px';  // Add space above the iframe
      const iframe = document.createElement('iframe');
      iframe.src = 'https://semydev.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entityrecord&etn=bookableresourcebooking&id=2a3ed4ae-6de4-ef11-9341-000d3ab1e3a4&formid=37864dfc-9ded-ef11-9341-7c1e52fae3cc';
      iframe.width = '100%';  // Make the iframe take the full width
      iframe.height = '600px';  // Set a height for the iframe
      iframe.style.border = 'none';  // Remove the border around the iframe

      iframeContainer.appendChild(iframe);
      this.scrollContainer.appendChild(iframeContainer);
    }
  }

  // Check if a panel already exists and remove it
  if (viewer.RepeatingTaskPanelTEST) {
    viewer.RepeatingTaskPanelTEST.setVisible(false);
    viewer.RepeatingTaskPanelTEST.uninitialize();
  }

  // Create a new panel with the title 'Service Task'
  viewer.RepeatingTaskPanelTEST = new RepeatingTaskPanelTEST(viewer, "Repeating Task TEST", "Repeating Task TEST", {});

  // Show the panel by setting it to visible
  viewer.RepeatingTaskPanelTEST.setVisible(true);
}
