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
              models[0].search(funcLocID, function (dbIDs) {
                console.log("Found dbIDs for loc:", dbIDs);
                alldbidFunctionalLocation = alldbidFunctionalLocation.concat(dbIDs);
                alldbid = alldbid.concat(dbIDs);
  
                // Apply the color to the Functional Location dbIDs
                dbIDs.forEach((dbID) => {
                  viewer.setThemingColor(dbID, color, models[0]);
                });
  
                resolve();
              });
            })
          );
        }
  
        let hardAssetID = task["Hard Asset ID"];
        if (hardAssetID != "N") {
          promises.push(
            new Promise((resolve) => {
              models[1].search(hardAssetID, function (dbIDs) {
                console.log("Found dbIDs for asset:", dbIDs);
                alldbidAsset = alldbidAsset.concat(dbIDs);
                alldbid = alldbid.concat(dbIDs);
  
                // Apply the color to the Asset dbIDs
                dbIDs.forEach((dbID) => {
                  viewer.setThemingColor(dbID, color, models[1]);
                });
  
                resolve();
              });
            })
          );
        }
  
        return Promise.all(promises);
      });
  
      // After all search promises are resolved, proceed with isolation and selection
      Promise.all(searchPromises).then(() => {
        console.log("This is your dbid ", alldbid);
        console.log("This is your dbid for Asset", alldbidAsset);
        console.log("This is your dbid for FL", alldbidFunctionalLocation);
  
        // Set the selection color to green (or any default color for selection)
        viewer.setSelectionColor(new THREE.Color(0x00ff00));
  
        // Once dbIDs are found, isolate the found objects
        models.forEach((model) => {
          viewer.isolate(alldbid, model);
        });
  
        // Fit the view to the found objects (combined bounding box as done earlier)
        viewer.fitToView(alldbidFunctionalLocation, models[0]);
        viewer.fitToView(alldbidAsset, models[1]);
      });
  
      createToolbarRepeatingTaskButton(viewer);
      showRepeatingTaskPanel(viewer, taskArray, staticColors);
    }
  }
  

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
  