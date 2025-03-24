//push test
export async function HG62HEATMAP(viewer, selectedFloor) {
    const { SurfaceShadingData, SurfaceShadingPoint, SurfaceShadingNode } = Autodesk.DataVisualization.Core;

    viewer.getExtension('Autodesk.DataVisualization').removeSurfaceShading()

    let nodesData;

    // Render the heatmap for the selected floor
    console.log('Rendering heatmap for the selected floor:', selectedFloor);
    if (selectedFloor === 8) {
        console.log('Rendering heatmap for the First Floor');
        nodesData = [
        { name: "Apartment Room (HG62.ID.-.3.034)"       , dbId: 51716, guid: "e0ddd286-51f0-ef11-9342-0022489fdfca" },
        { name: "Apartment Room (HG62.ID.-.3.036)"       , dbId: 51739, guid: "e2ddd286-51f0-ef11-9342-0022489fdfca" },
        ]
    }



    // Load the extension once

    const models = viewer.impl.modelQueue().getModels(); // Get all models again if needed
    const extension0 = viewer.getExtension('Autodesk.DataVisualization') || await viewer.loadExtension('Autodesk.DataVisualization');
    console.log('SurfaceShadingExtension loaded successfully!');

    // Specify a valid model and dbId
    const model = models[0]; // Assuming you want to use the first model
    const dbId = 51716; // Replace with a valid dbId for a specific nod (DBID FROM ANY OBJECT WITTHIN AR)

    // Creating shading points for all nodes
    const shadingPoint = new SurfaceShadingPoint("Location", undefined, ["TEMP"]);
    await shadingPoint.positionFromDBId(model, dbId); // Fetch position once

    // Convert dbId to number and map nodes
    const nodes = nodesData.map(data => {
        const node = new SurfaceShadingNode(data.name, parseInt(data.dbId, 10)); // Ensure dbId is numeric
        node.hemyguid = data.guid;
        node.addPoint(shadingPoint); // Attach point to node
        return node;
    });

    const heatmapData = new SurfaceShadingData();
    nodes.forEach(node => heatmapData.addChild(node)); // Add nodes to heatmap data
    await heatmapData.initialize(models[0]); // Initialize heatmap with model

    console.log('Heatmap Data initialized.');

    // Load extension only once
    const extension = await viewer.loadExtension('Autodesk.DataVisualization');
    console.log('SurfaceShadingExtension loaded successfully!');

    try {
        // Get the first model (models[0]) explicitly for heatmap rendering
        const models = viewer.impl.modelQueue().getModels();
        const model = models[0]; // Always use the first model for heatmap rendering
    
        // Setup surface shading for models[0] with heatmap data
        await extension.setupSurfaceShading(model, heatmapData, model);
    
        // Register shading colors for temperature data (TEMP)
        extension0.registerSurfaceShadingColors("TEMP", [0x0000ff, 0x00ff00, 0xff0000]);
    
        // Function to query nodes in batches of 2 and render surface shading
        async function queryNodesInPairsAndRender(nodes) {
            // Loop through nodes in batches of 2
            for (let i = 0; i < nodes.length; i += 2) {
                const batch = nodes.slice(i, i + 2); // Get the pair of nodes
    
                // Fetch sensor values for the pair of nodes
                const sensorValues = await Promise.all(batch.map(node => getSensorValue(node.hemyguid)));
    
                // Render surface shading for each node in the batch
                batch.forEach((node, index) => {
                    // Render surface shading for the current node on model[0]
                    console.log('node: ' + node.name + ' sensorValue: ' + sensorValues[index]);
                    extension.renderSurfaceShading(node.name, "TEMP", () => sensorValues[index], { model: model });
                });
            }
        }
    
        // Query the nodes in pairs and render surface shading using models[0]
        await queryNodesInPairsAndRender(nodes);
    
    } catch (error) {
        console.error('Failed to load SurfaceShadingExtension or render surface shading', error);
    }

    
}

//             ACTUAL FUNCTION TO GET DATA FROM DATABASE

async function getSensorValue(location) {
    try {
        const response = await fetch(`/api/sensorv2/${location}`);
        if (!response.ok) {
            throw new Error(`Error fetching sensor data: ${response.statusText}`);
        }

        const data = await response.json();
        const temp = parseInt(data.value); // Converts data.value to an integer
        const minTemp = 19;
        const maxTemp = 28;

        // Normalize the temperature value to range [0, 1]
        console.log(`Sensor value for ${location}: ${data.value}`);
        const result = Math.min(Math.max((temp - minTemp) / (maxTemp - minTemp), 0), 1);
        return result;


        //18 below celsius to blue 
        //20-24 up green
        //25 transition to red

    } catch (err) {
        console.error(err);
    }
}










// SAMPLE DATA 

// async function getSensorValue(location) {
//     try {
//         // Comment out the actual fetch request for now
//         /*
//         const response = await fetch(`/api/sensor/${location}`);
//         if (!response.ok) {
//             throw new Error(`Error fetching sensor data: ${response.statusText}`);
//         }
//         const data = await response.json();
//         const temp = parseInt(data.value); // Converts data.value to an integer
//         */

//         // Generate random temperature between 16 and 25
//         const randomTemp = Math.floor(Math.random() * (25 - 16 + 1)) + 16;
//         const sampleData = { value: randomTemp };
//         // const temp = parseInt(sampleData.value);
//         const temp = 24.6;

//         const minTemp = 20;
//         const maxTemp = 25.9;

//         // Normalize the temperature value to range [0, 1]
//         // console.log(`Sensor value for ${location}: ${sampleData.value}`);
//         const result = Math.min(Math.max((temp - minTemp) / (maxTemp - minTemp), 0), 1);
//         return result;

//         //21 below celsius to blue 
//         //20-24 up green 
//         //22 transition to red

//     } catch (err) {
//         console.error(err);
//     }
// }