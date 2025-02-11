export function RepeatingTasks(viewer, RepeatingTask) {
    if (RepeatingTask === 'TRUE') {

        // First, get the models from the viewer
        const models = viewer.impl.modelQueue().getModels();

        // Call the function to get the array of tasks and log it
        let taskArray = getSubgridDataFromURL();
        console.log(taskArray);

        taskArray.forEach((task) => {
            // Extract the Functional Location ID and Hard Asset ID from the task object
            let funcLocID = task["Functional Location ID"];
            console.log('This is your ' + funcLocID);
            if (funcLocID != 'N'){
                models[1].search(FunctionalLocationID, function(dbIDs) {
                    
                });
            }

            let hardAssetID = task["Hard Asset ID"];
            console.log('This is your HA' + hardAssetID);

            // Highlight the Hard Asset in the viewer
            viewer.select(dbId, model);
        });
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