const viewableMap = new Map();

export async function HG62SPRITES(viewer, selectedFloor) {
    const { SurfaceShadingData, SurfaceShadingPoint, SurfaceShadingNode } = Autodesk.DataVisualization.Core;

    const extension0 = await viewer.loadExtension('Autodesk.DataVisualization');

    if (!extension0) {
      console.error('Error loading the DataVisualization extension.');
    }

    console.log('TEST: ' + selectedFloor)
    


    const DataVizCore = Autodesk.DataVisualization.Core;
    const viewableType = DataVizCore.ViewableType.SPRITE;
    const spriteColor = new THREE.Color(0xffffff);  // Red color for better visibility
    const baseURL = "./images/temp.svg";
    const spriteIconUrl = `${baseURL}`;
    
    const style = new DataVizCore.ViewableStyle(viewableType, spriteColor, spriteIconUrl);
    
    const viewableData = new DataVizCore.ViewableData();
    viewableData.spriteSize = 30; // Sprites as points of size 24 x 24 pixels

    const myDataList = [
      // 3RD floor
      { position: { x: -97.79080200195312, y: -2.323376417160034 , z: 23.6 }, name: "Apartment Room (HG62.ID.-.3.034)",  pointID: "b957051a-2cb0-4bcb-990c-3c34a6f627a7", objectDBID: 10939 },
      { position: { x: -91.14710235595703 , y: -2.323376417160034 , z: 23.6 }, name: "Apartment Room (HG62.ID.-.3.036)",  pointID: "3b69ceda-a9e0-4b04-8a92-7ecccb6286a0", objectDBID: 10950 },
      // second floor
    //   { position: { x: 779.6911010742188 , y: 500.82025146484375, z: 18.3 }, name: "Social Area (DB8.-.2.001)"     ,  pointID: "193d3a83-b870-4d7b-83eb-ea73111b8c0a", objectDBID: 7887 },
    //   { position: { x: 794.48248291015625, y: 493.23358154296875, z: 18.3 }, name: "Office (DB8.-.2.002)"           ,  pointID: "d8d4faa1-2bc9-4809-8a25-08430813fc63", objectDBID: 7886 },
    ];

    // { position: { x: -, y: -, z: 10 }, name: "0" },
    
    try {
      myDataList.forEach((myData, index) => {
        const dbId = 10 + index;
        const position = myData.position;
        const name = myData.name; // Get the custom name (e.g., "Office (DB8.-.2.010)")
        const pointId = myData.pointID; // Get the custom id (e.g., "f378f3bf-b905-4928-94d4-ce7dc0baffd0")
        const objectDBID = myData.objectDBID; // Get the custom id (e.g., "f378f3bf-b905-4928-94d4-ce7dc0baffd0")
        const viewable = new DataVizCore.SpriteViewable(position, style, dbId, name, pointId, objectDBID);

        viewable.customData = { name, pointId, objectDBID }; // Attach custom data to the viewable
        // console.log(`Setting customData for ${name, pointId}:`, viewable.customData);  // Debugging line
        viewableData.addViewable(viewable);

        // Add the viewable to the map by dbId
        viewableMap.set(dbId, viewable);
      });
    
      // Try finishing and adding the viewables, with success confirmation
      await viewableData.finish();  // Ensure the viewable data is finished before proceeding
    //   console.log('Viewable Data finished successfully!');
      
      // Add the viewables to the extension
      extension0.addViewables(viewableData);

      const models = viewer.impl.modelQueue().getModels();

      viewer.addEventListener(DataVizCore.MOUSE_CLICK, (event) => onSpriteClicked(event, viewer));
    //   console.log('Viewables added to the extension successfully!');
    } catch (error) {
      // Catch any errors that occur during the process
      console.error('Error adding viewables:', error);
    }



}




//                           ACTUAL GET GRAPH DATA

// Define the onSpriteClicked function to handle sprite clicks
async function onSpriteClicked(event, viewer) {
  // Check if the clicked event contains a valid sprite (dbId)
  if (event.dbId && event.dbId !== -1) {
      console.log(`Sprite clicked: ${event.dbId}`);
      
      // Retrieve the viewable from the map using dbId
      const viewable = viewableMap.get(event.dbId);
      
      if (viewable) {
          // Access the custom data from the viewable
          const name = viewable.customData?.name;
          const pointID = viewable.customData?.pointId;
          const location = viewable.customData?.pointId;
          const objectDBID = viewable.customData?.objectDBID;
          if (name) {
              console.log(`Sprite name: ${name}`);  // Log the name associated with the clicked sprite
              console.log(`Sprite id: ${pointID}`);
              console.log(`Sprite object: ${objectDBID}`);

                 if (objectDBID) {
                  console.log(`Sprite object: ${objectDBID}`);
                   
                 
                   // Get all models loaded in the viewer
                   const models = viewer.impl.modelQueue().getModels();
                   // Iterate over each model
                     viewer.select([objectDBID], models[1]);  // Select the object in the viewer 
                     viewer.fitToView([objectDBID], models[1]);  // THE MEP MODEL THAT CONTAINS THE DBID IS IN SECOND INDEX
                   
                 }
          } else {
              console.log('No name found for this sprite.');
          }

          // Fetch data from the server for dynamic chart update
          const response = await fetch(`/api/graphdata/${pointID}`);
          if (!response.ok) {
            throw new Error(`Error fetching sensor data: ${response.statusText}`);
          }

          const data = await response.json();
          
          // Update the chart with the fetched data
          let model = 'HG62';
          //Update the panel with the sprite info and show it
            viewer.LiveDataPanel.updateSpriteInfo(name, data, model);
            viewer.LiveDataPanel.setVisible(true);  // Show the Live Data panel
      } else {
          console.log('No viewable found for this dbId.');
      }
  } else {
      // Ignore the event if the click did not happen on a sprite
      console.log("Click outside of sprite detected, no action taken.");
      viewer.LiveDataPanel.setVisible(false);  // Hide the Live Data panel
  }
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