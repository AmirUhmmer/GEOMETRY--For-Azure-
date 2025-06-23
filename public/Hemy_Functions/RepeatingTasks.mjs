export function RepeatingTasks(viewer, RepeatingTask) {
  if (RepeatingTask === "TRUE") {
    // First, get the models from the viewer
    const models = viewer.impl.modelQueue().getModels();

    const header = document.getElementById("preview");
    header.style.top = "0em";

    viewer.resize();
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
      console.log("Functional Location ID:", funcLocID);
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
                    let FLname = props.name; // Get the name of the Functional Location
                    let FLCategory = props.Category; // Get the category of the Functional Location

                    console.log("Properties for dbID:", dbID, props);
                    console.log("Properties Name:", props.name);

                    // Check if "Asset ID" or "Asset ID (GUID)" matches the searched value
                    props.properties.forEach(function (prop) {
                      if (
                        prop.displayName === "Asset ID" ||
                        prop.displayName === "Asset ID (GUID)"
                      ) {
                        if (prop.displayValue) {
                          assetIDValue = prop.displayValue;
                          console.log("Asset ID:", assetIDValue);
                        }
                      }
                      if (
                        prop.displayName === "Level" ||
                        prop.displayName === "Schedule Level"
                      ) {
                        if (prop.displayCategory === "Constraints") {
                          assetLevel = prop.displayValue; // Save the level value
                          console.log("Level:", assetLevel);
                        }
                      }
                      if (prop.displayName === "Category") {
                        if (prop.displayValue != "Revit Room") {
                          FLCategory = prop.displayValue; // Save the Functional Location name
                          console.log("Functional Location Name:", FLCategory);
                        }
                      }
                    });

                    // If Asset ID and Level match, and name is not null, store the dbID
                    // this should add in the filters assetLevel != null
                    if (
                      assetIDValue === funcLocID &&
                      assetIDValue != null &&
                      FLname != null &&
                      FLCategory != "Revit Rooms"
                    ) {
                      alldbidFunctionalLocation =
                        alldbidFunctionalLocation.concat(dbID);
                      alldbid = alldbid.concat(dbID);
                      console.log(
                        `Matching dbId: ${dbID} with Asset ID: ${assetIDValue} and Level: ${assetLevel} in model ${models[0].id}`
                      );
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
      console.log("Hard Asset ID:", hardAssetID);
      if (hardAssetID != "N") {
        const models = viewer.impl.modelQueue().getModels(); // Get all models in the viewer
        models.forEach((model) => {
          promises.push(
            new Promise((resolve) => {
              model.search(hardAssetID, function (dbIDs) {
                console.log(
                  `Found dbIDs for asset in model ${model.id}:`,
                  dbIDs
                );

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
                        if (
                          prop.displayName === "Asset ID" ||
                          prop.displayName === "Asset ID (GUID)"
                        ) {
                          if (prop.displayValue) {
                            assetIDValue = prop.displayValue;
                            console.log("Asset ID:", assetIDValue);
                          }
                        }
                        if (
                          prop.displayName === "Level" ||
                          prop.displayName === "Schedule Level"
                        ) {
                          if (prop.displayCategory === "Constraints") {
                            assetLevel = prop.displayValue; // Save the level value
                            console.log("Level:", assetLevel);
                          }
                        }
                      });

                      // If Asset ID matches, store the dbID
                      if (
                        assetIDValue === hardAssetID &&
                        assetLevel != null &&
                        assetIDValue != null &&
                        props.name != null
                      ) {
                        alldbidAsset = alldbidAsset.concat(dbID);
                        alldbid = alldbid.concat(dbID);
                        console.log(
                          `Matching dbId: ${dbID} with Asset ID: ${assetIDValue} and Level: ${assetLevel} and with model ${model.id}`
                        );
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
      //viewer.hide(alldbid); // Hide all dbIDs in the first model
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

            // Check the level in the Levels Extension
            viewer
              .loadExtension("Autodesk.AEC.LevelsExtension")
              .then(function (levelsExt) {
                if (levelsExt && levelsExt.floorSelector) {
                  const floorData = levelsExt.floorSelector;
                  // console.log("Initial Floor Data:", floorData);

                  setTimeout(() => {
                    const levels = floorData._floors;
                    console.log("Floor Array after delay:", levels);

                    if (levels && levels.length > 0) {
                      levels.forEach((floor, index) => {
                        // console.log(`Floor ${index}:`, floor);
                      });
                    } else {
                      console.error("Floors array is still empty.");
                    }

                    // Search for the level by name in the levels array
                    let matchingLevel = levels.find(
                      (level) => level.name === assetLevel
                    );

                    if (matchingLevel) {
                      const selectedLevelIndex = matchingLevel.index;

                      // Change the floor level based on the index
                      if (alldbidAsset.length > 0) {
                        levelsExt.floorSelector.selectFloor(
                          selectedLevelIndex,
                          true
                        );
                      }

                      viewer
                        .loadExtension("Autodesk.BimWalk")
                        .then(function (bimWalkExt) {
                          // Start BimWalk after loading the extension
                          if (bimWalkExt) {
                            // bimWalkExt.activate();
                            viewer.select(alldbid, model); // Select all dbIDs at once for the model
                            // console.log("BimWalk started.");
                          } else {
                            console.error(
                              "BimWalk extension could not be loaded."
                            );
                          }
                        });
                    } else {
                      console.error(
                        "No matching level found for the asset level."
                      );
                    }
                  }, 1000); // Wait for 1 second before checking
                } else {
                  console.error(
                    "Levels Extension or floorSelector is not available."
                  );
                }
              });
          });
        });
      });

      // Set the selection color to green (or any default color for selection)
      viewer.setSelectionColor(new THREE.Color(0x892be3));

      // Fit the view to the found objects (combined bounding box as done earlier)

      if (alldbidFunctionalLocation.length > 0) {
        viewer.fitToView(alldbidFunctionalLocation, models[0]);
        if (alldbidAsset.length == 0) {
          models.forEach((model) => {
            viewer.isolate(alldbidFunctionalLocation, model);
          });
        }
      }

      if (alldbidAsset.length > 0) {
        models.forEach((model) => {
          viewer.fitToView(alldbidAsset, model);
        });
      }

      models.forEach((model) => {
        viewer.select(alldbid, model); // Select all dbIDs at once for the model
      });
    });

    createToolbarRepeatingTaskButton(viewer);
    showRepeatingTaskPanel(viewer, taskArray, staticColors);
  }
}

// Function to get subgrid data and return an array of task objects
function getSubgridDataFromURL() {
  let params = {};
  let queryString = window.location.search.substring(1);
  let queryParts = queryString.split("&");

  for (let i = 0; i < queryParts.length; i++) {
    let param = queryParts[i].split("=");
    params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
  }

  let subgridData = params["subgridData"];
  if (!subgridData) {
    console.log("No subgrid data found in the URL.");
    return [];
  }

  let tasks = subgridData.split("\n");
  let taskArray = [];

  tasks.forEach((task) => {
    if (task.trim() === "") return;

    let taskData = {};

    // Use regex to find key-value pairs more accurately
    let regex = /([\w\s\(\)\/\?\-]+):\s(.*?)(?=,\s[\w\s\(\)\/\?\-]+:\s|$)/g;
    let match;

    while ((match = regex.exec(task)) !== null) {
      let key = match[1].trim();
      let value = match[2].trim();
      taskData[key] = value;
    }

    taskArray.push(taskData);
  });

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
  showRepeatingTaskButton = new Autodesk.Viewing.UI.Button(
    "showRepeatingTaskButton"
  );

  // Apply icon styling directly to the button's container
  const buttonContainer = showRepeatingTaskButton.container;
  buttonContainer.style.backgroundImage = "url(./images/task.svg)"; // Set your icon image source here
  buttonContainer.style.backgroundColor = "transparent"; // Make background transparent
  buttonContainer.style.backgroundSize = "32px"; // Adjust size of the background image
  buttonContainer.style.backgroundRepeat = "no-repeat"; // Ensure no repeat of the image
  buttonContainer.style.backgroundPosition = "center"; // Center the image inside the button

  showRepeatingTaskButton.setToolTip("Repeating Task"); // Set the tooltip for the button

  // Define the action when the button is clicked
  showRepeatingTaskButton.onClick = function () {
    if (viewer.RepeatingTaskPanel) {
      viewer.RepeatingTaskPanel.setVisible(
        !viewer.RepeatingTaskPanel.isVisible()
      );
    } else {
      showRepeatingTaskPanel(viewer, []); // Show panel even if no service tasks exist yet
    }
  };

  // Add the button to a new toolbar group
  let subToolbar = viewer.toolbar.getControl("myAppToolbar");
  if (!subToolbar) {
    subToolbar = new Autodesk.Viewing.UI.ControlGroup("myAppToolbar");
    toolbar.addControl(subToolbar);
  }
  subToolbar.addControl(showRepeatingTaskButton);

  // Call this function once the viewer is fully initialized
  viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, function () {
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
      this.container.style.backgroundColor = "#333";
      this.container.style.title = "Tasks";

      // Create and configure the scroll container
      this.createScrollContainer();
    }

    // Create the content of the panel
    createScrollContainer() {
      // Create the scroll container
      this.scrollContainer = document.createElement("div");
      this.scrollContainer.style.overflow = "auto";
      this.scrollContainer.style.padding = "1em"; // Add padding to the scroll container
      this.scrollContainer.style.height = "100%"; // Ensure it takes full panel height
      this.container.appendChild(this.scrollContainer); // Append the scroll container to the panel

      // Create and append elements to the scroll container
      this.createPanelContent();
    }

    // Create the content inside the scroll container
    createPanelContent() {
      // Loop through the taskArray and create elements for each task
      taskArray.forEach((task, index) => {
        const taskName = task["Name"]; // Assuming the task name is stored under "Service Task"
        const color = colorMapping[index].name; // Get the color name for this index

        const container = document.createElement("div");
        container.style.marginBottom = "10px"; // Add space between elements

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
  viewer.RepeatingTaskPanel = new RepeatingTaskPanel(
    viewer,
    "Repeating Task",
    "Repeating Task",
    {}
  );

  // // Show the panel by setting it to visible
  // viewer.RepeatingTaskPanel.setVisible(true);
}

// Received message: {"type":"showTask","Name":"Change - Dark Light Source - (max 3,5m high) if there is a starter, change it too",
// "HardAsset":"64761da9-83d5-ee11-904d-0022489fdfca",
// "FunctionalLocation":"21b06458-4161-ee11-8df0-0022489fdfca"}







export function showTasks(viewer, RepeatingTask) {
  viewer.showAll(); // Show all objects first
  const models = viewer.impl.modelQueue().getModels();
  const header = document.getElementById("preview");
  header.style.top = "0em";
  viewer.resize();

  let selectionColor;
  viewer.setSelectionColor(new THREE.Color(0, 1, 0)); // RGB green (selection highlight)

  const hardAssetID = RepeatingTask.HardAsset;
  const funcLocID = RepeatingTask.FunctionalLocation;
  const taskName = RepeatingTask.Name.toLowerCase();

  // ✅ Assign the right color based on task name
  if (["cleaning", "if needed"].some(term => taskName.includes(term))) {
    selectionColor = new THREE.Vector4(0.231, 0.773, 0.976, 1);
  } else if (["fix", "assess", "issue", "troubleshoot", "assessment"].some(term => taskName.includes(term))) {
    selectionColor = new THREE.Vector4(1, 1, 0.400, 1);
  } else if (["snow", "ice"].some(term => taskName.includes(term))) {
    selectionColor = new THREE.Vector4(0.231, 0.976, 0.965, 1);
  } else if (["green", "green areas", "maintain green areas"].some(term => taskName.includes(term))) {
    selectionColor = new THREE.Vector4(0.784, 0.976, 0.231, 1);
  } else {
    selectionColor = new THREE.Vector4(0, 1, 0, 1); // Default green
  }

  console.log("showTasks called with HardAsset:", hardAssetID);
  console.log("showTasks called with FunctionalLocation:", funcLocID);

  let alldbid = [];
  let alldbidAsset = [];
  let alldbidFunctionalLocation = [];

  // ✅ Helper: Process properties and check match
  function processProps(props, dbID, model, expectedID, outputArray, type, selectionColor) {
    let assetIDValue = null;
    let assetLevel = null;
    let name = props.name;
    let category = props.Category;

    props.properties.forEach((prop) => {
      const { displayName, displayValue, displayCategory } = prop;

      if (displayName === "Asset ID" || displayName === "Asset ID (GUID)") {
        assetIDValue = displayValue;
      }

      if (
        (displayName === "Level" || displayName === "Schedule Level") &&
        displayCategory === "Constraints"
      ) {
        assetLevel = displayValue;
      }

      if (displayName === "Category" && displayValue !== "Revit Room") {
        category = displayValue;
      }
    });

    const match =
      assetIDValue === expectedID &&
      assetIDValue != null &&
      name != null &&
      (type === "asset" || category !== "Revit Room");

    if (match) {
      outputArray.push(dbID);
      alldbid.push(dbID);
      viewer.setThemingColor(dbID, selectionColor, model);
    }
  }

  // ✅ Helper: Search and process
  function searchAndProcess(model, id, type, outputArray, selectionColor) {
    return new Promise((resolve) => {
      model.search(id, (dbIDs) => {
        const propPromises = dbIDs.map((dbID) => {
          return new Promise((propResolve) => {
            model.getProperties(dbID, (props) => {
              processProps(props, dbID, model, id, outputArray, type, selectionColor);
              propResolve();
            });
          });
        });

        Promise.all(propPromises).then(resolve);
      });
    });
  }

  const assetSearch = searchAndProcess(models[0], hardAssetID, "asset", alldbidAsset, selectionColor);
  const funcLocSearch = searchAndProcess(models[0], funcLocID, "floc", alldbidFunctionalLocation, selectionColor);

  Promise.all([assetSearch, funcLocSearch]).then(() => {
    console.log("All dbIDs:", alldbid);
    console.log("Asset dbIDs:", alldbidAsset);
    console.log("Functional Location dbIDs:", alldbidFunctionalLocation);

    const fitAndSelect = () => {
      if (alldbidFunctionalLocation.length > 0) {
        viewer.fitToView(alldbidFunctionalLocation, models[0]);
        if (alldbidAsset.length === 0) {
          models.forEach((model) => viewer.isolate(alldbidFunctionalLocation, model));
        }
      }

      if (alldbidAsset.length > 0) {
        models.forEach((model) => viewer.fitToView(alldbidAsset, model));
      }

      models.forEach((model) => viewer.select(alldbid, model));
    };

    const setLevelAndStartWalk = () => {
      models.forEach((model) => {
        alldbid.forEach((dbId) => {
          model.getProperties(dbId, (props) => {
            let assetLevel = null;

            props.properties.forEach((prop) => {
              if (["Level", "Schedule Level"].includes(prop.displayName)) {
                assetLevel = prop.displayValue;
              }
            });

            viewer
              .loadExtension("Autodesk.AEC.LevelsExtension")
              .then((levelsExt) => {
                const levels = levelsExt.floorSelector?._floors || [];
                const matched = levels.find((lvl) => lvl.name === assetLevel);

                if (matched && alldbidAsset.length > 0) {
                  levelsExt.floorSelector.selectFloor(matched.index, true);

                  viewer.loadExtension("Autodesk.BimWalk").then((bimWalkExt) => {
                    if (bimWalkExt) {
                      viewer.select(alldbid, model);
                    }
                  });
                }
              });
          });
        });
      });
    };

    viewer.setSelectionColor(selectionColor);
    setLevelAndStartWalk();
    fitAndSelect();
  });
}
