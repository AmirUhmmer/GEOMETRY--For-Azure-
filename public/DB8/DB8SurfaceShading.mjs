//push test
export async function HEATMAP(viewer, selectedFloor) {
    const { SurfaceShadingData, SurfaceShadingPoint, SurfaceShadingNode } = Autodesk.DataVisualization.Core;

    viewer.getExtension('Autodesk.DataVisualization').removeSurfaceShading()

    let nodesData;

    function searchForSystemCode(viewer, nodesData) {
        return new Promise((resolve, reject) => {
            const systemCodeValue = "2500 Slab Constructions"; // Define the systemCode value you're searching for
            let model = viewer.impl.modelQueue().getModels()[0];
            const models = viewer.impl.modelQueue().getModels();
            models.forEach((selectedModel, index) => {
                let bubbleNode = selectedModel.getData().loadOptions.bubbleNode;
                // console.log('Model:', model, 'name:', bubbleNode.data.name);
                if(bubbleNode.data.name === 'DB8-SEMY-ARST-ASBUILT'){
                    console.log('Model Found');
                    model = viewer.impl.modelQueue().getModels()[index];
                }
            });

            let searchPromises = nodesData.map((node, index) => {
                return new Promise((searchResolve) => {
                    model.search(node.name, dbIDs => {
                        // console.log(`Processing node: ${index} - ${node.name}`);
                        if (!dbIDs || dbIDs.length === 0) {
                            console.log(`No matching objects found for: ${node.name}`);
                            searchResolve(); // Resolve search even if no matches
                            return;
                        }

                        let propertyPromises = dbIDs.map(dbId => {
                            return new Promise((propResolve) => {
                                model.getProperties(dbId, props => {
                                    // console.log(props);
                                    //const systemCodeProperty = props.properties.find(prop => prop.displayName === 'System Code');

                                    //if (systemCodeProperty && systemCodeProperty.displayValue == systemCodeValue) {
                                    // props.dbId === 24382 ? console.log('properties (GYM): ' & props) : console.log('No dbId found'); 
                                    if (props.name === nodesData[index].modelName) {
                                        console.log(`Properties for dbId ${dbId}:`, props.name);
                                        // Update the existing nodesData entry with the new dbId and other properties
                                        nodesData[index] = {
                                            name: node.name,
                                            dbId: dbId,
                                            systemCode: systemCodeValue,
                                            guid: node.guid, // Retaining the original guid if needed
                                            modelName: props.name
                                        };

                                        //console.log(`Found matching dbId: ${dbId} for asset: ${node.name} with systemCode: ${systemCodeValue}`);
                                    }
                                    propResolve();
                                });
                            });
                        });

                        Promise.all(propertyPromises).then(() => searchResolve()); // Resolve after all properties are processed
                    }, error => {
                        console.error("Search error in model:", error);
                        searchResolve(); // Still resolve even on error
                    });
                });
            });

            Promise.all(searchPromises).then(() => {
                console.log("[HEATMAP] Updated nodesData:", nodesData); // Output the updated nodesData
                resolve();
            }).catch(reject);
        });
    }
    
    

    // Render the heatmap for the selected floor
    if (selectedFloor === 1) {
        console.log('Rendering heatmap for the First Floor');
        nodesData = [
        { name: "Main Entrance (DB8.-.1.001)"       , dbId: 25788, guid: "b957051a-2cb0-4bcb-990c-3c34a6f627a7", modelName: "Floor [1885372]" }, //uid: "b957051a-2cb0-4bcb-990c-3c34a6f627a7"
        //{ name: "Entrance Area (DB8.-.1.002)"       , dbId: 25874, guid: "d9063147-d93d-4746-858b-e45d810d17d5" },
        { name: "Small Meeting/Office (DB8.-.1.004)", dbId: 25524, guid: "3b69ceda-a9e0-4b04-8a92-7ecccb6286a0", modelName: "Floor [1870026]" },
        { name: "Office (DB8.-1.005)"              , dbId: 25505, guid: "b343e138-36fb-4af4-80be-d266aca41db9", modelName: "Floor [1868278]" },
        { name: "Office (DB8.-1.006)"              , dbId: 25486, guid: "7a97be73-e5f6-422b-ade9-6a14ca78b879", modelName: "Floor [1866802]" },
        { name: "Office (DB8.-1.007)"              , dbId: 25435, guid: "2c570a32-6987-4f6a-bac2-09572d9bcf56", modelName: "Floor [1862380]" },
        { name: "Hot Desk (DB8.-.1.008)"            , dbId: 25853, guid: "c34c8e2d-67fe-49dc-af3f-4af4991e3f02", modelName: "Floor [1890547]" },
        { name: "Office (DB8.-1.009)"              , dbId: 25452, guid: "d695fb48-8698-41b3-a557-8dbb69524211", modelName: "Floor [1863630]" },
        { name: "Office (DB8.-1.010)"              , dbId: 25466, guid: "d089bfc1-5b63-48d2-9c79-2ee5162b342e", modelName: "Floor [1865073]" },
        { name: "Office (DB8.-1.011)"              , dbId: 25580, guid: "fa29b828-4a93-4f89-91c7-0afc49c37ee1", modelName: "Floor [1872322]" },
        { name: "Office (DB8.-1.012)"              , dbId: 25600, guid: "bcf5cba9-1821-46c9-90e4-737860933e69", modelName: "Floor [1874087]" },
        { name: "Office (DB8.-1.013)"              , dbId: 25615, guid: "a674dc37-bd9a-4afe-a8e0-a04954293334", modelName: "Floor [1875634]" },
        { name: "Office (DB8.-1.014)"              , dbId: 25635, guid: "f545cc16-709c-46ca-8331-41463edead9f", modelName: "Floor [1877095]" },
        { name: "Social Area (DB8.-.1.017)"         , dbId: 25924, guid: "1da69c37-4364-4bdd-a40d-ec60078c5593", modelName: "Floor [1897010]" },
        { name: "Office (DB8.-1.018)"              , dbId: 25419, guid: "1d512e32-54df-4c23-ac36-25fb03665dfd", modelName: "Floor [1860949]" },
        { name: "Office (DB8.-1.019)"              , dbId: 25400, guid: "d7b28135-4a1e-4251-b436-b21b630d0012", modelName: "Floor [1859489]" },
        { name: "Office (DB8.-1.020)"              , dbId: 25389, guid: "ce717192-968f-46b5-bb43-6fb73965da0f", modelName: "Floor [1858458]" },
        { name: "Electronics Workshop (DB8.-1.021)", dbId: 23558, guid: "2da239f8-ddab-4d43-823f-8797638123f2", modelName: "Floor [1856561]" },
        { name: "Mechanical Workshop (DB8.-1.022)" , dbId: 23565, guid: "a3215104-8c66-4714-96f4-dcb5b3fb2ab2", modelName: "Floor [1857330]" },

        ];
        await searchForSystemCode(viewer, nodesData); // Wait for search to complete
    } else if (selectedFloor === 2) {
        console.log('Rendering heatmap for the Second Floor');
        nodesData = [
            { name: "Social Area (DB8.-.2.001)", dbId: 26840, guid: "193d3a83-b870-4d7b-83eb-ea73111b8c0a", modelName: "Floor [1960611]" },
            { name: "Office (DB8.-2.002)", dbId: 26075, guid: "d8d4faa1-2bc9-4809-8a25-08430813fc63", modelName: "Floor [1909924]" },
            { name: "Office (DB8.-2.003)", dbId: 26084, guid: "08d4abfb-ca40-4a35-91b4-3582388be8e5", modelName: "Floor [1910861]" },
            { name: "Office (DB8.-2.004)", dbId: 26102, guid: "23600d1e-3798-4b77-8eaa-fede3c1bddc8", modelName: "Floor [1912374]" },
            { name: "Office (DB8.-2.005)", dbId: 26122, guid: "dbe72c0e-6856-4a84-8604-e33a06914608", modelName: "Floor [1913686]" },
            { name: "Office (DB8.-2.006)", dbId: 26142, guid: "5d186d87-62d6-415e-8f23-7ed4f96439dc", modelName: "Floor [1914881]" },
            { name: "Office (DB8.-2.007)", dbId: 26161, guid: "dede5f73-0a26-4330-a7b9-52499d79cc71", modelName: "Floor [1916249]" },
            { name: "Office (DB8.-2.008)", dbId: 26181, guid: "671c9530-5a8c-49ce-aa4c-28e752c8137e", modelName: "Floor [1917284]" },
            { name: "Office (DB8.-2.009)", dbId: 26201, guid: "5c4c68f2-8d13-4b67-b7aa-88c876e12ff0", modelName: "Floor [1918244]" },
            { name: "Office (DB8.-2.010)", dbId: 26216, guid: "f378f3bf-b905-4928-94d4-ce7dc0baffd0", modelName: "Floor [1919270]" },
            { name: "Office (DB8.-2.011)", dbId: 26247, guid: "282a8fdc-d284-43ec-bf87-cb4f0b6b22f9", modelName: "Floor [1921371]" },
            { name: "Office (DB8.-2.012)", dbId: 26269, guid: "b8b962ae-4e0a-4563-848c-04a081e4700e", modelName: "Floor [1923498]" },
            { name: "Office (DB8.-2.013)", dbId: 26284, guid: "008bc641-423d-4d53-bf0e-0046218da1c4", modelName: "Floor [1924504]" },
            { name: "Office (DB8.-2.014)", dbId: 26303, guid: "7a2568ce-4143-427e-9a7d-18d945d3a12b", modelName: "Floor [1925617]" },
            { name: "Office (DB8.-2.015)", dbId: 26322, guid: "9d3aefd9-2b96-4674-b4dd-0a7947117af5", modelName: "Floor [1926599]" },
            { name: "Office (DB8.-2.016)", dbId: 26340, guid: "0e6cd4f0-cdb4-4c1e-8277-9fe15073f7ba", modelName: "Floor [1927938]" },
            { name: "Office (DB8.-2.017)", dbId: 26359, guid: "c3c4b142-1d49-4667-87e2-b9fd7ad3afb1", modelName: "Floor [1929094]" },
            { name: "Office (DB8.-2.018)", dbId: 26376, guid: "1147a344-9089-469f-a51b-ccc7b8b431cc", modelName: "Floor [1930249]" },
            { name: "Office (DB8.-2.019)", dbId: 26393, guid: "5bd45fab-d1ce-401a-9671-f0dd25b39c9e", modelName: "Floor [1931340]" },
            { name: "Office (DB8.-2.020)", dbId: 26412, guid: "310a64d0-dc6c-4ce4-9730-78301272ea99", modelName: "Floor [1932440]" },
            { name: "Meeting Room (DB8.-.2.021)", dbId: 24382, guid: "16bc9315-dd0e-460e-a9c3-10ae5602dd2d", modelName: "Floor [1934689]" },
            { name: "Gym/Fitness Room (DB8.-.2.022)", dbId: 24388, guid: "34ad5978-9645-4d9e-a519-6cff67eb1713", modelName: "Floor [1933386]" },
            
        ];
        await searchForSystemCode(viewer, nodesData); // Wait for search to complete
    }
    else if (selectedFloor === 0) {
    console.log('Rendering heatmap for U1');
    nodesData = [
        // { name: "Storage (DB8.-.U1.002)", dbId: 26840, guid: "" },
        { name: "Tenant Area (DB8.-.U1.007)", dbId: 27048, guid: "507ac9f4-73a7-4034-8cf5-33b9e5e9fedb", modelName: "Floor [1973465]" },
        { name: "Tenant Area (DB8.-.U1.007)", dbId: 27032, guid: "507ac9f4-73a7-4034-8cf5-33b9e5e9fedb", modelName: "Floor [1972498]" },
        // { name: "Workshop (DB8.-.U1.011)", dbId: 26840, guid: "" },
    ];
    await searchForSystemCode(viewer, nodesData); // Wait for search to complete
    }
   
    // working code



    // Load the extension once

    const models = viewer.impl.modelQueue().getModels(); // Get all models again if needed
    const extension0 = viewer.getExtension('Autodesk.DataVisualization') || await viewer.loadExtension('Autodesk.DataVisualization');
    console.log('SurfaceShadingExtension loaded successfully!');

    // Specify a valid model and dbId
    const model = models[0]; // Assuming you want to use the first model
    const dbId = nodesData[0].dbId; // Replace with a valid dbId for a specific node

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
    // console.log('SurfaceShadingExtension loaded successfully!');

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
        const response = await fetch(`/api/sensor/${location}`);
        if (!response.ok) {
            throw new Error(`Error fetching sensor data: ${response.statusText}`);
        }

        const data = await response.json();
        const temp = parseInt(data.value); // Converts data.value to an integer
        const minTemp = 16;
        const maxTemp = 24;

        // Normalize the temperature value to range [0, 1]
        // console.log(`Sensor value for ${location}: ${data.value}`);
        const result = Math.min(Math.max((temp - minTemp) / (maxTemp - minTemp), 0), 1);
        return result;


        //18 below celsius to blue 
        //19 up green 20-23
        //22 transition to red

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
//         const temp = parseInt(sampleData.value);

//         const minTemp = 16;
//         const maxTemp = 24;

//         // Normalize the temperature value to range [0, 1]
//         // console.log(`Sensor value for ${location}: ${sampleData.value}`);
//         const result = Math.min(Math.max((temp - minTemp) / (maxTemp - minTemp), 0), 1);
//         return result;

//         //18 below celsius to blue 
//         //19 up green 20-23
//         //22 transition to red

//     } catch (err) {
//         console.error(err);
//     }
// }

















// export async function HEATMAP(viewer) {
//     const { SurfaceShadingData, SurfaceShadingPoint, SurfaceShadingNode } = Autodesk.DataVisualization.Core;
    
//     // Creating a shading node and point
//     const DB82001 = new SurfaceShadingNode("Social Area (DB8.-.2.001)", 26840);
//     DB82001.hemyguid = "193d3a83-b870-4d7b-83eb-ea73111b8c0a";

//     const DB82002 = new SurfaceShadingNode("Office (DB8.-.2.002)", 26075);
//     DB82002.hemyguid = "d8d4faa1-2bc9-4809-8a25-08430813fc63";

//     const DB82003 = new SurfaceShadingNode("Office (DB8.-.2.003)", 26084);
//     DB82003.hemyguid = "08d4abfb-ca40-4a35-91b4-3582388be8e5";

//     const DB82004 = new SurfaceShadingNode("Office (DB8.-.2.004)", 26102);
//     DB82004.hemyguid = "23600d1e-3798-4b77-8eaa-fede3c1bddc8";

//     const DB82005 = new SurfaceShadingNode("Office (DB8.-.2.005)", 26122);
//     DB82005.hemyguid = "dbe72c0e-6856-4a84-8604-e33a06914608";

//     const DB82010 = new SurfaceShadingNode("Office (DB8.-2.010)", 26216);
//     DB82010.hemyguid = "f378f3bf-b905-4928-94d4-ce7dc0baffd0";

//     //DEFINE HEATMAP COLORS
//     const extension0 = await viewer.loadExtension('Autodesk.DataVisualization');

//     const shadingPoint = new SurfaceShadingPoint("Location", undefined, ["TEMP"]);

//     try {
//         // Get position from DBId for the shading point
//         await shadingPoint.positionFromDBId(viewer.model);
//         DB82001.addPoint(shadingPoint);
//         DB82002.addPoint(shadingPoint);
//         DB82003.addPoint(shadingPoint);
//         DB82004.addPoint(shadingPoint);
//         DB82005.addPoint(shadingPoint);
//         DB82010.addPoint(shadingPoint);

//         const heatmapData = new SurfaceShadingData();
//         heatmapData.addChild(DB82001);
//         heatmapData.addChild(DB82002);
//         heatmapData.addChild(DB82003);
//         heatmapData.addChild(DB82004);
//         heatmapData.addChild(DB82005);
//         heatmapData.addChild(DB82010);

//         heatmapData.initialize(viewer.model);

//         // Load the Data Visualization extension once
//         const extension = await viewer.loadExtension('Autodesk.DataVisualization');
//         console.log('SurfaceShadingExtension loaded successfully!');

//         // Now use the extension to setup, render and update surface shading
//         await extension.setupSurfaceShading(viewer.model, heatmapData);

//         extension0.registerSurfaceShadingColors("TEMP", [0x0000ff, 0x00ff00, 0xff0000]);


//         let live = await getSensorValue(DB82001.hemyguid);
//         extension.renderSurfaceShading("Social Area (DB8.-.2.001)", "TEMP", () => live);

//         live = await getSensorValue(DB82002.hemyguid);
//         extension.renderSurfaceShading("Office (DB8.-.2.002)", "TEMP", () => live);
        
//         live = await getSensorValue(DB82003.hemyguid);
//         extension.renderSurfaceShading("Office (DB8.-.2.003)", "TEMP", () => live);

//         live = await getSensorValue(DB82004.hemyguid);
//         extension.renderSurfaceShading("Office (DB8.-.2.004)", "TEMP", () => live)

//         live = await getSensorValue(DB82005.hemyguid);
//         extension.renderSurfaceShading("Office (DB8.-.2.005)", "TEMP", () => live)

//         live = await getSensorValue(DB82010.hemyguid);
//         extension.renderSurfaceShading("Office (DB8.-2.010)", "TEMP", () => live);
//         // extension.updateSurfaceShading(getSensorValue);
//     } catch (error) {
//         console.error('Failed to load SurfaceShadingExtension or render surface shading', error);
//     }
    
// }



// async function getSensorValue(location) {
//     const locationString = String(location); // Force conversion to string

//     const sensorValue = await getLatestTempData(locationString);

//     console.log(parseFloat(sensorValue));

//     return sensorValue;  // Return the actual sensor value

//     // return Math.random() * 1; // Random value for illustration
// }


// export async function getLatestTempData(location) {
//     try {
//         const response = await fetch(`/api/sensor/${location}`);
//         if (!response.ok) {
//             throw new Error(`Error fetching sensor data: ${response.statusText}`);
//         }

//         const data = await response.json();
//         console.log(`Sensor value for ${location}: ${data.value}`);
//         // return data.value;  // Return actual sensor value from the database

//         const temp = parseInt(data.value);  // Converts data.value to an integer
//         const minTemp = 16; // minimum temperature
//         const maxTemp = 24;

//         const result = Math.min(Math.max((temp - minTemp) / (maxTemp - minTemp), 0), 1); // Ensures 0 <= normalized value <= 1

//         return result;  // Return only the resolved value (PromiseResult)
        

//         //18 below celsius to blue
//         //19 up green
//         //22 transition to red
//     } catch (err) {
//         console.error(err);
//     }
// }

// 8




//     try {
//         // Setup surface shading with heatmap data
//         await extension.setupSurfaceShading(viewer.model, heatmapData);

//         extension0.registerSurfaceShadingColors("TEMP", [0x0000ff, 0x00ff00, 0xff0000]);

//         // Function to query nodes in batches of 2 and render surface shading
//         async function queryNodesInPairsAndRender(nodes) {
//             for (let i = 0; i < nodes.length; i += 2) {
//                 const nodePair = nodes.slice(i, i + 2);

//                 // Perform the long-running getSensorValue operation in a non-blocking way
//                 nodePair.forEach(node => {
//                     setTimeout(async () => {
//                         try {
//                             const sensorValues = await getSensorValue(node.hemyguid); // Your sensor fetching code
                            
//                             nodePair.forEach((node, index) => {
//                                 console.log(sensorValues);
//                                 extension.renderSurfaceShading(node.name, "TEMP", () => sensorValues);
//                             });
//                         } catch (error) {
//                             console.error(`Error fetching sensor value for ${node.name}:`, error);
//                         }
//                     }, 0); // This sends the operation to the background
//                 });

//                 // Optionally add some delay to avoid overwhelming the server
//                 await new Promise(resolve => setTimeout(resolve, 100)); // Pause between each batch
//             }

//             // Apply the updates to the shading surface after the loop
//             await extension.updateSurfaceShading(viewer.model);
//             console.log('Heatmap rendered successfully!');
//         }

//         // Start querying the nodes and rendering the heatmap
//         queryNodesInPairsAndRender(nodes);
        
//     } catch (error) {
//         console.error('Error in heatmap setup or sensor fetching:', error);
//     }




