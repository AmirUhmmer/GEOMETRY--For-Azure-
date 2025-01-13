//push test
export async function HEATMAP(viewer, selectedFloor) {
    const { SurfaceShadingData, SurfaceShadingPoint, SurfaceShadingNode } = Autodesk.DataVisualization.Core;

    viewer.getExtension('Autodesk.DataVisualization').removeSurfaceShading()

    let nodesData;

    // Render the heatmap for the selected floor
    // Node definitions and GUIDs in an array
    // 3.22629737854003
    // x = 9.32028579711914
    if (selectedFloor === 1) {
        console.log('Rendering heatmap for the First Floor');
        nodesData = [
        { name: "Main Entrance (DB8.-.1.001)"       , dbId: 25788, guid: "b957051a-2cb0-4bcb-990c-3c34a6f627a7" },
        { name: "Entrance Area (DB8.-.1.002)"       , dbId: 25874, guid: "d9063147-d93d-4746-858b-e45d810d17d5" },
        { name: "Small Meeting/Office (DB8.-.1.004)", dbId: 25524, guid: "3b69ceda-a9e0-4b04-8a92-7ecccb6286a0" },
        { name: "Office (DB8.-.1.005)"              , dbId: 25505, guid: "b343e138-36fb-4af4-80be-d266aca41db9" },
        { name: "Office (DB8.-.1.006)"              , dbId: 25486, guid: "7a97be73-e5f6-422b-ade9-6a14ca78b879" },
        { name: "Office (DB8.-.1.007)"              , dbId: 25435, guid: "2c570a32-6987-4f6a-bac2-09572d9bcf56" },
        { name: "Hot Desk (DB8.-.1.008)"            , dbId: 25853, guid: "c34c8e2d-67fe-49dc-af3f-4af4991e3f02" },
        { name: "Office (DB8.-.1.009)"              , dbId: 25452, guid: "d695fb48-8698-41b3-a557-8dbb69524211" },
        { name: "Office (DB8.-.1.010)"              , dbId: 25466, guid: "d089bfc1-5b63-48d2-9c79-2ee5162b342e" },
        { name: "Office (DB8.-.1.011)"              , dbId: 25580, guid: "fa29b828-4a93-4f89-91c7-0afc49c37ee1" },
        { name: "Office (DB8.-.1.012)"              , dbId: 25600, guid: "bcf5cba9-1821-46c9-90e4-737860933e69" },
        { name: "Office (DB8.-.1.013)"              , dbId: 25615, guid: "a674dc37-bd9a-4afe-a8e0-a04954293334" },
        { name: "Office (DB8.-.1.014)"              , dbId: 25635, guid: "f545cc16-709c-46ca-8331-41463edead9f" },
        { name: "Social Area (DB8.-.1.017)"         , dbId: 25924, guid: "1da69c37-4364-4bdd-a40d-ec60078c5593" },
        { name: "Office (DB8.-.1.018)"              , dbId: 25419, guid: "1d512e32-54df-4c23-ac36-25fb03665dfd" },
        { name: "Office (DB8.-.1.019)"              , dbId: 25400, guid: "d7b28135-4a1e-4251-b436-b21b630d0012" },
        { name: "Office (DB8.-.1.020)"              , dbId: 25389, guid: "ce717192-968f-46b5-bb43-6fb73965da0f" },
        { name: "Electronics Workshop (DB8.-.1.021)", dbId: 25373, guid: "2da239f8-ddab-4d43-823f-8797638123f2" },
        { name: "Mechanical Workshop (DB8.-.1.022)" , dbId: 25380, guid: "a3215104-8c66-4714-96f4-dcb5b3fb2ab2" },

        ]
    } else if (selectedFloor === 2) {
        console.log('Rendering heatmap for the Second Floor');
        nodesData = [
            { name: "Social Area (DB8.-.2.001)", dbId: 26840, guid: "193d3a83-b870-4d7b-83eb-ea73111b8c0a" },
            { name: "Office (DB8.-.2.002)", dbId: 26075, guid: "d8d4faa1-2bc9-4809-8a25-08430813fc63" },
            { name: "Office (DB8.-.2.003)", dbId: 26084, guid: "08d4abfb-ca40-4a35-91b4-3582388be8e5" },
            { name: "Office (DB8.-.2.004)", dbId: 26102, guid: "23600d1e-3798-4b77-8eaa-fede3c1bddc8" },
            { name: "Office (DB8.-.2.005)", dbId: 26122, guid: "dbe72c0e-6856-4a84-8604-e33a06914608" },
            { name: "Office (DB8.-.2.006)", dbId: 26142, guid: "5d186d87-62d6-415e-8f23-7ed4f96439dc" },
            { name: "Office (DB8.-.2.007)", dbId: 26161, guid: "dede5f73-0a26-4330-a7b9-52499d79cc71" },
            { name: "Office (DB8.-.2.008)", dbId: 26181, guid: "671c9530-5a8c-49ce-aa4c-28e752c8137e" },
            { name: "Office (DB8.-.2.009)", dbId: 26201, guid: "5c4c68f2-8d13-4b67-b7aa-88c876e12ff0" },
            { name: "Office (DB8.-.2.010)", dbId: 26216, guid: "f378f3bf-b905-4928-94d4-ce7dc0baffd0" },
            { name: "Office (DB8.-.2.011)", dbId: 26247, guid: "282a8fdc-d284-43ec-bf87-cb4f0b6b22f9" },
            { name: "Office (DB8.-.2.012)", dbId: 26269, guid: "b8b962ae-4e0a-4563-848c-04a081e4700e" },
            { name: "Office (DB8.-.2.013)", dbId: 26284, guid: "008bc641-423d-4d53-bf0e-0046218da1c4" },
            { name: "Office (DB8.-.2.014)", dbId: 26303, guid: "7a2568ce-4143-427e-9a7d-18d945d3a12b" },
            { name: "Office (DB8.-.2.015)", dbId: 26322, guid: "9d3aefd9-2b96-4674-b4dd-0a7947117af5" },
            { name: "Office (DB8.-.2.016)", dbId: 26340, guid: "0e6cd4f0-cdb4-4c1e-8277-9fe15073f7ba" },
            { name: "Office (DB8.-.2.017)", dbId: 26359, guid: "c3c4b142-1d49-4667-87e2-b9fd7ad3afb1" },
            { name: "Office (DB8.-.2.018)", dbId: 26376, guid: "1147a344-9089-469f-a51b-ccc7b8b431cc" },
            { name: "Office (DB8.-.2.019)", dbId: 26393, guid: "5bd45fab-d1ce-401a-9671-f0dd25b39c9e" },
            { name: "Office (DB8.-.2.020)", dbId: 26412, guid: "310a64d0-dc6c-4ce4-9730-78301272ea99" },
            { name: "Meeting Room (DB8.-.2.021)", dbId: 26443, guid: "16bc9315-dd0e-460e-a9c3-10ae5602dd2d" },
            { name: "Gym/Fitness Room (DB8.-.2.022)", dbId: 26429, guid: "34ad5978-9645-4d9e-a519-6cff67eb1713" },
        ];
    }
    else if (selectedFloor === 0) {
    console.log('Rendering heatmap for U1');
    nodesData = [
        // { name: "Storage (DB8.-.U1.002)", dbId: 26840, guid: "" },
        { name: "Tenant Area (DB8.-.U1.007)", dbId: 27045, guid: "507ac9f4-73a7-4034-8cf5-33b9e5e9fedb" },
        { name: "Tenant Area (DB8.-.U1.007)", dbId: 27029, guid: "507ac9f4-73a7-4034-8cf5-33b9e5e9fedb" },
        // { name: "Workshop (DB8.-.U1.011)", dbId: 26840, guid: "" },
    ]
    }



    // Define simple color gradient
    const colors = [
        0x0000ff, // Blue
        0x00ff00, // Green
        0xffff00, // Yellow
        0xff0000  // Red
    ];

    // Create a SurfaceShadingPoint to attach to nodes
    const shadingPoint = new SurfaceShadingPoint("Location", undefined, ["TEMP"]);

    // Create SurfaceShadingNodes with simple sensor values
    const nodes = nodesData.map((data, index) => {
        const node = new SurfaceShadingNode(data.name, data.dbId);
        node.hemyguid = data.guid;

        // Use the predefined color for each node
        node.addPoint(shadingPoint);

        // Set color based on the index (simple mapping of colors)
        const sensorValue = index + 1; // Simple mock of sensor value
        shadingPoint.setValue(sensorValue); // Set the value for the shading point

        return node;
    });

    // Initialize the heatmap data
    const heatmapData = new SurfaceShadingData();
    nodes.forEach(node => heatmapData.addChild(node));

    // Initialize the heatmap and ensure it loads properly
    await heatmapData.initialize(viewer.model);
    console.log('Heatmap Data initialized');

    // Batch render the nodes with predefined sensor values
    async function renderNodes() {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const sensorValue = i + 1; // Use simple sensor value (just for testing)
            console.log(`Rendering node: ${node.name}, with value: ${sensorValue}`);

            // Render surface shading for each node
            extension0.renderSurfaceShading(node.name, "TEMP", () => sensorValue);
        }
    }

    // Call the render function
    await renderNodes();

    console.log('Simple Heatmap Rendering Complete');


    // const extension0 = await viewer.loadExtension('Autodesk.DataVisualization');
    // console.log('SurfaceShadingExtension loaded successfully!');

    // // Iterate through each model in the aggregated view
    // const models = viewer.impl.modelQueue().getModels();

    // for (const model of models) {
    //     console.log('Processing model:', model);

    //     // Setup surface shading for the model
    //     await extension0.setupSurfaceShading(model);

    //     // Register shading colors globally
    //     extension0.registerSurfaceShadingColors("TEMP", [
    //         0x0000ff, // Blue
    //         0x00ff00, // Green
    //         0xff0000  // Red
    //     ]);

    //     const shadingPoint = new SurfaceShadingPoint("Location", undefined, ["TEMP"]);


    //     // Filter the nodes that exist in the current model by checking the dbId
    //     const filteredNodesData = nodesData.filter(data => {
    //         const dbId = parseInt(data.dbId, 10);
    //         return model.getData().instanceTree && model.getData().instanceTree.nodeAccess.dbIdToIndex[dbId] !== undefined;
    //     });

    //     if (filteredNodesData.length > 0) {
    //         // If nodes exist in this model, proceed with the shading process
    //         console.log('Matching nodes found in model:', model);

    //         // Fetch position for each model's dbId (ensures correct mapping)
    //         await shadingPoint.positionFromDBId(model);

    //         // Create SurfaceShadingNode for each node in filteredNodesData
    //         const nodes = filteredNodesData.map(data => {
    //             const node = new SurfaceShadingNode(data.name, parseInt(data.dbId, 10));
    //             node.hemyguid = data.guid;
    //             node.addPoint(shadingPoint);
    //             return node;
    //         });

    //         // Initialize heatmap data for the current model
    //         const heatmapData = new SurfaceShadingData();
    //         nodes.forEach(node => heatmapData.addChild(node));

    //         // Initialize the heatmap data and wait for it to complete
    //         await heatmapData.initialize(model);
    //         console.log('Heatmap Data initialized for model:', model);

    //         try {
    //             // Setup surface shading for the model, and ensure this is awaited
    //             await extension0.setupSurfaceShading(model, heatmapData);
    //             console.log('Surface shading setup completed for model:', model);

    //             // Batch processing of nodes
    //             async function queryNodesInPairsAndRender(nodes, model) {
    //                 for (let i = 0; i < nodes.length; i += 2) {
    //                     const batch = nodes.slice(i, i + 2);
    //                     const sensorValues = await Promise.all(batch.map(node => getSensorValue(node.hemyguid)));

    //                     // Render each node with corresponding sensor value, for the current model
    //                     batch.forEach((node, index) => {
    //                         const sensorValue = sensorValues[index];

    //                         if (sensorValue !== undefined && sensorValue !== null) {
    //                             // Log the model and node being rendered
    //                             console.log(`Rendering on model: ${model.id}, node:`, node.name, ` value: ${sensorValues[index]}`);

    //                             // Render surface shading for the specific node within this model context
    //                             extension0.renderSurfaceShading(node.name, "TEMP", () => sensorValues[index]);
    //                         } else {
    //                             console.warn(`Invalid sensor value for node ${node.name}:`, sensorValue);
    //                         }
    //                     });
    //                 }
    //             }

    //             await queryNodesInPairsAndRender(nodes, model); // Pass the model explicitly
    //         } catch (error) {
    //             console.error('Failed to load SurfaceShadingExtension or render surface shading for model:', model, error);
    //         }
    //     } else {
    //         console.log(`No matching nodes found for model: ${model.id}`);
    //     }
    // }




    
}






























































//push test
export async function HEATMAP(viewer, selectedFloor) {
    const { SurfaceShadingData, SurfaceShadingPoint, SurfaceShadingNode } = Autodesk.DataVisualization.Core;

    viewer.getExtension('Autodesk.DataVisualization').removeSurfaceShading()

    let nodesData;

    // Render the heatmap for the selected floor
    // Node definitions and GUIDs in an array
    // 3.22629737854003
    // x = 9.32028579711914
    if (selectedFloor === 1) {
        console.log('Rendering heatmap for the First Floor');
        nodesData = [
        { name: "Main Entrance (DB8.-.1.001)"       , dbId: 25788, guid: "b957051a-2cb0-4bcb-990c-3c34a6f627a7" },
        { name: "Entrance Area (DB8.-.1.002)"       , dbId: 25874, guid: "d9063147-d93d-4746-858b-e45d810d17d5" },
        { name: "Small Meeting/Office (DB8.-.1.004)", dbId: 25524, guid: "3b69ceda-a9e0-4b04-8a92-7ecccb6286a0" },
        { name: "Office (DB8.-.1.005)"              , dbId: 25505, guid: "b343e138-36fb-4af4-80be-d266aca41db9" },
        { name: "Office (DB8.-.1.006)"              , dbId: 25486, guid: "7a97be73-e5f6-422b-ade9-6a14ca78b879" },
        { name: "Office (DB8.-.1.007)"              , dbId: 25435, guid: "2c570a32-6987-4f6a-bac2-09572d9bcf56" },
        { name: "Hot Desk (DB8.-.1.008)"            , dbId: 25853, guid: "c34c8e2d-67fe-49dc-af3f-4af4991e3f02" },
        { name: "Office (DB8.-.1.009)"              , dbId: 25452, guid: "d695fb48-8698-41b3-a557-8dbb69524211" },
        { name: "Office (DB8.-.1.010)"              , dbId: 25466, guid: "d089bfc1-5b63-48d2-9c79-2ee5162b342e" },
        { name: "Office (DB8.-.1.011)"              , dbId: 25580, guid: "fa29b828-4a93-4f89-91c7-0afc49c37ee1" },
        { name: "Office (DB8.-.1.012)"              , dbId: 25600, guid: "bcf5cba9-1821-46c9-90e4-737860933e69" },
        { name: "Office (DB8.-.1.013)"              , dbId: 25615, guid: "a674dc37-bd9a-4afe-a8e0-a04954293334" },
        { name: "Office (DB8.-.1.014)"              , dbId: 25635, guid: "f545cc16-709c-46ca-8331-41463edead9f" },
        { name: "Social Area (DB8.-.1.017)"         , dbId: 25924, guid: "1da69c37-4364-4bdd-a40d-ec60078c5593" },
        { name: "Office (DB8.-.1.018)"              , dbId: 25419, guid: "1d512e32-54df-4c23-ac36-25fb03665dfd" },
        { name: "Office (DB8.-.1.019)"              , dbId: 25400, guid: "d7b28135-4a1e-4251-b436-b21b630d0012" },
        { name: "Office (DB8.-.1.020)"              , dbId: 25389, guid: "ce717192-968f-46b5-bb43-6fb73965da0f" },
        { name: "Electronics Workshop (DB8.-.1.021)", dbId: 25373, guid: "2da239f8-ddab-4d43-823f-8797638123f2" },
        { name: "Mechanical Workshop (DB8.-.1.022)" , dbId: 25380, guid: "a3215104-8c66-4714-96f4-dcb5b3fb2ab2" },

        ]
    } else if (selectedFloor === 2) {
        console.log('Rendering heatmap for the Second Floor');
        nodesData = [
            { name: "Social Area (DB8.-.2.001)", dbId: 26840, guid: "193d3a83-b870-4d7b-83eb-ea73111b8c0a" },
            { name: "Office (DB8.-.2.002)", dbId: 26075, guid: "d8d4faa1-2bc9-4809-8a25-08430813fc63" },
            { name: "Office (DB8.-.2.003)", dbId: 26084, guid: "08d4abfb-ca40-4a35-91b4-3582388be8e5" },
            { name: "Office (DB8.-.2.004)", dbId: 26102, guid: "23600d1e-3798-4b77-8eaa-fede3c1bddc8" },
            { name: "Office (DB8.-.2.005)", dbId: 26122, guid: "dbe72c0e-6856-4a84-8604-e33a06914608" },
            { name: "Office (DB8.-.2.006)", dbId: 26142, guid: "5d186d87-62d6-415e-8f23-7ed4f96439dc" },
            { name: "Office (DB8.-.2.007)", dbId: 26161, guid: "dede5f73-0a26-4330-a7b9-52499d79cc71" },
            { name: "Office (DB8.-.2.008)", dbId: 26181, guid: "671c9530-5a8c-49ce-aa4c-28e752c8137e" },
            { name: "Office (DB8.-.2.009)", dbId: 26201, guid: "5c4c68f2-8d13-4b67-b7aa-88c876e12ff0" },
            { name: "Office (DB8.-.2.010)", dbId: 26216, guid: "f378f3bf-b905-4928-94d4-ce7dc0baffd0" },
            { name: "Office (DB8.-.2.011)", dbId: 26247, guid: "282a8fdc-d284-43ec-bf87-cb4f0b6b22f9" },
            { name: "Office (DB8.-.2.012)", dbId: 26269, guid: "b8b962ae-4e0a-4563-848c-04a081e4700e" },
            { name: "Office (DB8.-.2.013)", dbId: 26284, guid: "008bc641-423d-4d53-bf0e-0046218da1c4" },
            { name: "Office (DB8.-.2.014)", dbId: 26303, guid: "7a2568ce-4143-427e-9a7d-18d945d3a12b" },
            { name: "Office (DB8.-.2.015)", dbId: 26322, guid: "9d3aefd9-2b96-4674-b4dd-0a7947117af5" },
            { name: "Office (DB8.-.2.016)", dbId: 26340, guid: "0e6cd4f0-cdb4-4c1e-8277-9fe15073f7ba" },
            { name: "Office (DB8.-.2.017)", dbId: 26359, guid: "c3c4b142-1d49-4667-87e2-b9fd7ad3afb1" },
            { name: "Office (DB8.-.2.018)", dbId: 26376, guid: "1147a344-9089-469f-a51b-ccc7b8b431cc" },
            { name: "Office (DB8.-.2.019)", dbId: 26393, guid: "5bd45fab-d1ce-401a-9671-f0dd25b39c9e" },
            { name: "Office (DB8.-.2.020)", dbId: 26412, guid: "310a64d0-dc6c-4ce4-9730-78301272ea99" },
            { name: "Meeting Room (DB8.-.2.021)", dbId: 26443, guid: "16bc9315-dd0e-460e-a9c3-10ae5602dd2d" },
            { name: "Gym/Fitness Room (DB8.-.2.022)", dbId: 26429, guid: "34ad5978-9645-4d9e-a519-6cff67eb1713" },
        ];
    }
    else if (selectedFloor === 0) {
    console.log('Rendering heatmap for U1');
    nodesData = [
        // { name: "Storage (DB8.-.U1.002)", dbId: 26840, guid: "" },
        { name: "Tenant Area (DB8.-.U1.007)", dbId: 27045, guid: "507ac9f4-73a7-4034-8cf5-33b9e5e9fedb" },
        { name: "Tenant Area (DB8.-.U1.007)", dbId: 27029, guid: "507ac9f4-73a7-4034-8cf5-33b9e5e9fedb" },
        // { name: "Workshop (DB8.-.U1.011)", dbId: 26840, guid: "" },
    ]
    }

    // { name: "Office (DB8.-.2.010)", dbId: 26161, guid: "" },

    // const extension0 = await viewer.loadExtension('Autodesk.DataVisualization');

    // // Creating shading points for all nodes
    // const shadingPoint = new SurfaceShadingPoint("Location", undefined, ["TEMP"]);
    // await shadingPoint.positionFromDBId(viewer.model); // Get position from DBId once

    // // Create shading nodes and add points
    // const nodes = nodesData.map(data => {
    //     const node = new SurfaceShadingNode(data.name, data.dbId);
    //     node.hemyguid = data.guid;
    //     node.addPoint(shadingPoint); // Attach point to node
    //     return node;
    // });

    // const heatmapData = new SurfaceShadingData();
    // nodes.forEach(node => heatmapData.addChild(node)); // Add all nodes to heatmapData
    // heatmapData.initialize(viewer.model);

    // // Load extension only once
    // const extension = await viewer.loadExtension('Autodesk.DataVisualization');
    // console.log('SurfaceShadingExtension loaded successfully!');








    // working code



    // Load the extension once
    // const extension0 = await viewer.loadExtension('Autodesk.DataVisualization');
    // console.log('SurfaceShadingExtension loaded successfully!');

    // // Creating shading points for all nodes
    // const shadingPoint = new SurfaceShadingPoint("Location", undefined, ["TEMP"]);
    // await shadingPoint.positionFromDBId(viewer.model); // Fetch position once

    // // Convert dbId to number and map nodes
    // const nodes = nodesData.map(data => {
    //     const node = new SurfaceShadingNode(data.name, parseInt(data.dbId, 10)); // Ensure dbId is numeric
    //     node.hemyguid = data.guid;
    //     node.addPoint(shadingPoint); // Attach point to node
    //     return node;
    // });

    // const heatmapData = new SurfaceShadingData();
    // nodes.forEach(node => heatmapData.addChild(node)); // Add nodes to heatmap data
    // await heatmapData.initialize(viewer.model); // Initialize heatmap with model

    // console.log('Heatmap Data initialized.');

    // // Load extension only once
    // const extension = await viewer.loadExtension('Autodesk.DataVisualization');
    // console.log('SurfaceShadingExtension loaded successfully!');

    // try {
    //     // Setup surface shading with heatmap data
    //     await extension.setupSurfaceShading(viewer.model, heatmapData);
    
    //     extension0.registerSurfaceShadingColors("TEMP", [0x0000ff, 0x00ff00, 0xff0000]);
    
    //     // Function to query nodes in batches of 2 and render surface shading
    //     async function queryNodesInPairsAndRender(nodes) {
    //         // Loop through nodes in batches of 2
    //         for (let i = 0; i < nodes.length; i += 2) {
    //             const batch = nodes.slice(i, i + 2); // Get the pair of nodes
                
    //             // Fetch sensor values for the pair of nodes
    //             const sensorValues = await Promise.all(batch.map(node => getSensorValue(node.hemyguid)));
                
    //             // Render surface shading for each node in the batch immediately after querying
    //             batch.forEach((node, index) => {
    //                 extension.renderSurfaceShading(node.name, "TEMP", () => sensorValues[index]);
    //             });
    //         }
    //     }
    
    //     // Query the nodes in pairs and render surface shading
    //     await queryNodesInPairsAndRender(nodes);
    
    // } catch (error) {
    //     console.error('Failed to load SurfaceShadingExtension or render surface shading', error);
    // }






    const extension0 = await viewer.loadExtension('Autodesk.DataVisualization');
    console.log('SurfaceShadingExtension loaded successfully!');

    // // Register shading colors globally
    // extension0.registerSurfaceShadingColors("TEMP", [
    //     0x0000ff, // Blue
    //     0x00ff00, // Green
    //     0xff0000  // Red
    // ]);

    // const shadingPoint = new SurfaceShadingPoint("Location", undefined, ["TEMP"]);

    // Iterate through each model in the aggregated view
    const models = viewer.impl.modelQueue().getModels();

    for (const model of models) {
        console.log('Processing model:', model);

        // Setup surface shading for the model
        await extension0.setupSurfaceShading(model);

        // Register shading colors globally
        extension0.registerSurfaceShadingColors("TEMP", [
            0x0000ff, // Blue
            0x00ff00, // Green
            0xff0000  // Red
        ]);

        const shadingPoint = new SurfaceShadingPoint("Location", undefined, ["TEMP"]);


        // Filter the nodes that exist in the current model by checking the dbId
        const filteredNodesData = nodesData.filter(data => {
            const dbId = parseInt(data.dbId, 10);
            return model.getData().instanceTree && model.getData().instanceTree.nodeAccess.dbIdToIndex[dbId] !== undefined;
        });

        if (filteredNodesData.length > 0) {
            // If nodes exist in this model, proceed with the shading process
            console.log('Matching nodes found in model:', model);

            // Fetch position for each model's dbId (ensures correct mapping)
            await shadingPoint.positionFromDBId(model);

            // Create SurfaceShadingNode for each node in filteredNodesData
            const nodes = filteredNodesData.map(data => {
                const node = new SurfaceShadingNode(data.name, parseInt(data.dbId, 10));
                node.hemyguid = data.guid;
                node.addPoint(shadingPoint);
                return node;
            });

            // Initialize heatmap data for the current model
            const heatmapData = new SurfaceShadingData();
            nodes.forEach(node => heatmapData.addChild(node));

            // Initialize the heatmap data and wait for it to complete
            await heatmapData.initialize(model);
            console.log('Heatmap Data initialized for model:', model);

            try {
                // Setup surface shading for the model, and ensure this is awaited
                await extension0.setupSurfaceShading(model, heatmapData);
                console.log('Surface shading setup completed for model:', model);

                // Batch processing of nodes
                async function queryNodesInPairsAndRender(nodes, model) {
                    for (let i = 0; i < nodes.length; i += 2) {
                        const batch = nodes.slice(i, i + 2);
                        const sensorValues = await Promise.all(batch.map(node => getSensorValue(node.hemyguid)));

                        // Render each node with corresponding sensor value, for the current model
                        batch.forEach((node, index) => {
                            const sensorValue = sensorValues[index];

                            if (sensorValue !== undefined && sensorValue !== null) {
                                // Log the model and node being rendered
                                console.log(`Rendering on model: ${model.id}, node:`, node.name, ` value: ${sensorValues[index]}`);

                                // Render surface shading for the specific node within this model context
                                extension0.renderSurfaceShading(node.name, "TEMP", () => sensorValues[index]);
                            } else {
                                console.warn(`Invalid sensor value for node ${node.name}:`, sensorValue);
                            }
                        });
                    }
                }

                await queryNodesInPairsAndRender(nodes, model); // Pass the model explicitly
            } catch (error) {
                console.error('Failed to load SurfaceShadingExtension or render surface shading for model:', model, error);
            }
        } else {
            console.log(`No matching nodes found for model: ${model.id}`);
        }
    }

    
}




















































//push test
export async function HEATMAP(viewer, selectedFloor) {
    const { SurfaceShadingData, SurfaceShadingPoint, SurfaceShadingNode } = Autodesk.DataVisualization.Core;

    viewer.getExtension('Autodesk.DataVisualization').removeSurfaceShading()

    let nodesData;

    // Render the heatmap for the selected floor
    // Node definitions and GUIDs in an array
    // 3.22629737854003
    // x = 9.32028579711914
    if (selectedFloor === 1) {
        console.log('Rendering heatmap for the First Floor');
        nodesData = [
        { name: "Main Entrance (DB8.-.1.001)"       , dbId: 25788, guid: "b957051a-2cb0-4bcb-990c-3c34a6f627a7" },
        { name: "Entrance Area (DB8.-.1.002)"       , dbId: 25874, guid: "d9063147-d93d-4746-858b-e45d810d17d5" },
        { name: "Small Meeting/Office (DB8.-.1.004)", dbId: 25524, guid: "3b69ceda-a9e0-4b04-8a92-7ecccb6286a0" },
        { name: "Office (DB8.-.1.005)"              , dbId: 25505, guid: "b343e138-36fb-4af4-80be-d266aca41db9" },
        { name: "Office (DB8.-.1.006)"              , dbId: 25486, guid: "7a97be73-e5f6-422b-ade9-6a14ca78b879" },
        { name: "Office (DB8.-.1.007)"              , dbId: 25435, guid: "2c570a32-6987-4f6a-bac2-09572d9bcf56" },
        { name: "Hot Desk (DB8.-.1.008)"            , dbId: 25853, guid: "c34c8e2d-67fe-49dc-af3f-4af4991e3f02" },
        { name: "Office (DB8.-.1.009)"              , dbId: 25452, guid: "d695fb48-8698-41b3-a557-8dbb69524211" },
        { name: "Office (DB8.-.1.010)"              , dbId: 25466, guid: "d089bfc1-5b63-48d2-9c79-2ee5162b342e" },
        { name: "Office (DB8.-.1.011)"              , dbId: 25580, guid: "fa29b828-4a93-4f89-91c7-0afc49c37ee1" },
        { name: "Office (DB8.-.1.012)"              , dbId: 25600, guid: "bcf5cba9-1821-46c9-90e4-737860933e69" },
        { name: "Office (DB8.-.1.013)"              , dbId: 25615, guid: "a674dc37-bd9a-4afe-a8e0-a04954293334" },
        { name: "Office (DB8.-.1.014)"              , dbId: 25635, guid: "f545cc16-709c-46ca-8331-41463edead9f" },
        { name: "Social Area (DB8.-.1.017)"         , dbId: 25924, guid: "1da69c37-4364-4bdd-a40d-ec60078c5593" },
        { name: "Office (DB8.-.1.018)"              , dbId: 25419, guid: "1d512e32-54df-4c23-ac36-25fb03665dfd" },
        { name: "Office (DB8.-.1.019)"              , dbId: 25400, guid: "d7b28135-4a1e-4251-b436-b21b630d0012" },
        { name: "Office (DB8.-.1.020)"              , dbId: 25389, guid: "ce717192-968f-46b5-bb43-6fb73965da0f" },
        { name: "Electronics Workshop (DB8.-.1.021)", dbId: 25373, guid: "2da239f8-ddab-4d43-823f-8797638123f2" },
        { name: "Mechanical Workshop (DB8.-.1.022)" , dbId: 25380, guid: "a3215104-8c66-4714-96f4-dcb5b3fb2ab2" },

        ]
    } else if (selectedFloor === 2) {
        console.log('Rendering heatmap for the Second Floor');
        nodesData = [
            { name: "Social Area (DB8.-.2.001)", dbId: 26840, guid: "193d3a83-b870-4d7b-83eb-ea73111b8c0a" },
            { name: "Office (DB8.-.2.002)", dbId: 26075, guid: "d8d4faa1-2bc9-4809-8a25-08430813fc63" },
            { name: "Office (DB8.-.2.003)", dbId: 26084, guid: "08d4abfb-ca40-4a35-91b4-3582388be8e5" },
            { name: "Office (DB8.-.2.004)", dbId: 26102, guid: "23600d1e-3798-4b77-8eaa-fede3c1bddc8" },
            { name: "Office (DB8.-.2.005)", dbId: 26122, guid: "dbe72c0e-6856-4a84-8604-e33a06914608" },
            { name: "Office (DB8.-.2.006)", dbId: 26142, guid: "5d186d87-62d6-415e-8f23-7ed4f96439dc" },
            { name: "Office (DB8.-.2.007)", dbId: 26161, guid: "dede5f73-0a26-4330-a7b9-52499d79cc71" },
            { name: "Office (DB8.-.2.008)", dbId: 26181, guid: "671c9530-5a8c-49ce-aa4c-28e752c8137e" },
            { name: "Office (DB8.-.2.009)", dbId: 26201, guid: "5c4c68f2-8d13-4b67-b7aa-88c876e12ff0" },
            { name: "Office (DB8.-.2.010)", dbId: 26216, guid: "f378f3bf-b905-4928-94d4-ce7dc0baffd0" },
            { name: "Office (DB8.-.2.011)", dbId: 26247, guid: "282a8fdc-d284-43ec-bf87-cb4f0b6b22f9" },
            { name: "Office (DB8.-.2.012)", dbId: 26269, guid: "b8b962ae-4e0a-4563-848c-04a081e4700e" },
            { name: "Office (DB8.-.2.013)", dbId: 26284, guid: "008bc641-423d-4d53-bf0e-0046218da1c4" },
            { name: "Office (DB8.-.2.014)", dbId: 26303, guid: "7a2568ce-4143-427e-9a7d-18d945d3a12b" },
            { name: "Office (DB8.-.2.015)", dbId: 26322, guid: "9d3aefd9-2b96-4674-b4dd-0a7947117af5" },
            { name: "Office (DB8.-.2.016)", dbId: 26340, guid: "0e6cd4f0-cdb4-4c1e-8277-9fe15073f7ba" },
            { name: "Office (DB8.-.2.017)", dbId: 26359, guid: "c3c4b142-1d49-4667-87e2-b9fd7ad3afb1" },
            { name: "Office (DB8.-.2.018)", dbId: 26376, guid: "1147a344-9089-469f-a51b-ccc7b8b431cc" },
            { name: "Office (DB8.-.2.019)", dbId: 26393, guid: "5bd45fab-d1ce-401a-9671-f0dd25b39c9e" },
            { name: "Office (DB8.-.2.020)", dbId: 26412, guid: "310a64d0-dc6c-4ce4-9730-78301272ea99" },
            { name: "Meeting Room (DB8.-.2.021)", dbId: 26443, guid: "16bc9315-dd0e-460e-a9c3-10ae5602dd2d" },
            { name: "Gym/Fitness Room (DB8.-.2.022)", dbId: 26429, guid: "34ad5978-9645-4d9e-a519-6cff67eb1713" },
        ];
    }
    else if (selectedFloor === 0) {
    console.log('Rendering heatmap for U1');
    nodesData = [
        // { name: "Storage (DB8.-.U1.002)", dbId: 26840, guid: "" },
        { name: "Tenant Area (DB8.-.U1.007)", dbId: 27045, guid: "507ac9f4-73a7-4034-8cf5-33b9e5e9fedb" },
        { name: "Tenant Area (DB8.-.U1.007)", dbId: 27029, guid: "507ac9f4-73a7-4034-8cf5-33b9e5e9fedb" },
        // { name: "Workshop (DB8.-.U1.011)", dbId: 26840, guid: "" },
    ]
    }

    
}