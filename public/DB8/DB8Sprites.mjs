// Map to store viewables by dbId push test
const viewableMap = new Map();

export async function SPRITES(viewer, selectedFloor) {
    const { SurfaceShadingData, SurfaceShadingPoint, SurfaceShadingNode } = Autodesk.DataVisualization.Core;

    const extension0 = await viewer.loadExtension('Autodesk.DataVisualization');

    if (!extension0) {
      console.error('Error loading the DataVisualization extension.');
    }

    function searchForSystemCode(viewer, myDataList) {
      return new Promise((resolve, reject) => {
          const systemCodeValue = '5640 BUS Systems'; // Define the systemCode value you're searching for
          let selectedModel = viewer.impl.modelQueue().getModels()[0];
          const models = viewer.impl.modelQueue().getModels();
          models.forEach((model, index) => {
            let bubbleNode = model.getData().loadOptions.bubbleNode;
            // console.log('Model:', model, 'name:', bubbleNode.data.name);
            if(bubbleNode.data.name === 'DB8-SEMY-P41-ASBUILT'){
              // console.log('Model Found');
              selectedModel = viewer.impl.modelQueue().getModels()[index];
            }
          });
          let searchPromises = myDataList.map((node, index) => {
              return new Promise((searchResolve) => {
                selectedModel.search(node.assetID, dbIDs => {
                      if (!dbIDs || dbIDs.length === 0) {
                          console.log(`No matching objects found for: ${node.name}`);
                          searchResolve(); // Resolve search even if no matches
                          return;
                      }
  
                      // Assuming you're only interested in the first dbId
                      const dbId = dbIDs[0];
  
                      // Update myDataList with the dbId found
                      myDataList[index] = {
                          ...myDataList[index],
                          objectDBID: dbId,
                      };
  
                      // console.log(`Updated objectDBID for asset: ${node.name} with dbId: ${dbId}`);
  
                      searchResolve(); // Resolve after processing the dbId
                  }, error => {
                      console.error("Search error in model:", error);
                      searchResolve(); // Still resolve even on error
                  });
              });
          });
  
          Promise.all(searchPromises).then(() => {
              resolve();
          }).catch(reject);
      });
    }
  


    const DataVizCore = Autodesk.DataVisualization.Core;
    const viewableType = DataVizCore.ViewableType.SPRITE;
    const spriteColor = new THREE.Color(0xffffff);  // Red color for better visibility
    const baseURL = "./images/temp.svg";
    const spriteIconUrl = `${baseURL}`;
    
    const style = new DataVizCore.ViewableStyle(viewableType, spriteColor, spriteIconUrl);
    
    const viewableData = new DataVizCore.ViewableData();
    viewableData.spriteSize = 30; // Sprites as points of size 24 x 24 pixels

    const myDataList = [
      // first floor
      { position: { x: 791.816162109375 , y: 516.4945068359375 , z: 7.5 }, name: "Main Entrance (DB8.-.1.001)"       ,  pointID: "b957051a-2cb0-4bcb-990c-3c34a6f627a7", assetID:'e2d06cc1-c29d-ef11-8a6b-0022489fd44c', objectDBID: 13071 },
      { position: { x: 805.4255981445312, y: 532.2337036132812 , z: 7.5 }, name: "Small Meeting/Office (DB8.-.1.004)",  pointID: "3b69ceda-a9e0-4b04-8a92-7ecccb6286a0", assetID:'cad12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7898  },
      { position: { x: 817.8609619140625, y: 536.9022827148438 , z: 7.5 }, name: "Office (DB8.-.1.005)"              ,  pointID: "b343e138-36fb-4af4-80be-d266aca41db9", assetID:'ccd12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7899  },
      { position: { x: 829.052001953125 , y: 541.2498779296875 , z: 7.5 }, name: "Office (DB8.-.1.006)"              ,  pointID: "7a97be73-e5f6-422b-ade9-6a14ca78b879", assetID:'c6d12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7896  },
      { position: { x: 838.37109375     , y: 544.8475952148438 , z: 7.5 }, name: "Office (DB8.-.1.007)"              ,  pointID: "2c570a32-6987-4f6a-bac2-09572d9bcf56", assetID:'c8d12779-0ced-ee11-a203-0022489fd44', objectDBID: 7897  }, //x -4  y +1 
      { position: { x: 829.5490112304688, y: 560.9873046875    , z: 7.5 }, name: "Hot Desk (DB8.-.1.008)"            ,  pointID: "c34c8e2d-67fe-49dc-af3f-4af4991e3f02", assetID:'c4d12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7895  },
      { position: { x: 825.149658203125 , y: 578.9117431640625 , z: 7.5 }, name: "Office (DB8.-.1.009)"              ,  pointID: "d695fb48-8698-41b3-a557-8dbb69524211", assetID:'ccd12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7894  }, // y-1   x-4
      { position: { x: 815.8023071289062, y: 575.2665405273438 , z: 7.5 }, name: "Office (DB8.-.1.010)"              ,  pointID: "d089bfc1-5b63-48d2-9c79-2ee5162b342e", assetID:'c2d12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7893  },
      { position: { x: 806.6764526367188, y: 571.6778564453125 , z: 7.5 }, name: "Office (DB8.-.1.011)"              ,  pointID: "d089bfc1-5b63-48d2-9c79-2ee5162b342e", assetID:'bed12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7892  },
      { position: { x: 797.4756469726562, y: 568.159912109375  , z: 7.5 }, name: "Office (DB8.-.1.012)"              ,  pointID: "bcf5cba9-1821-46c9-90e4-737860933e69", assetID:'bcd12779-0ced-ee11-a203-0022489fd44', objectDBID: 7891  }, // y+1   x+4
      { position: { x: 788.3688354492188, y: 564.5670776367188 , z: 7.5 }, name: "Office (DB8.-.1.013)"              ,  pointID: "a674dc37-bd9a-4afe-a8e0-a04954293334", assetID:'bad12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7890  },
      { position: { x: 779.0816650390625, y: 561.0070190429688 , z: 7.5 }, name: "Office (DB8.-.1.014)"              ,  pointID: "f545cc16-709c-46ca-8331-41463edead9f", assetID:'b8d12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7889  }, // x-3   y-2
      { position: { x: 748.4779052734375, y: 544.4462890625    , z: 7.5 }, name: "Social Area (DB8.-.1.017)"         ,  pointID: "1da69c37-4364-4bdd-a40d-ec60078c5593", assetID:'b6d12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7888  },
      { position: { x: 752.3358764648438, y: 524.6958618164062 , z: 7.5 }, name: "Office (DB8.-.1.018)"              ,  pointID: "1d512e32-54df-4c23-ac36-25fb03665dfd", assetID:'d0d12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7969  }, // x-1   y-3
      { position: { x: 752.1937866210938, y: 514.1864013671875 , z: 7.5 }, name: "Office (DB8.-.1.019)"              ,  pointID: "d7b28135-4a1e-4251-b436-b21b630d0012", assetID:'d2d12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7970  },
      { position: { x: 755.6309814453125, y: 505.3243713378906 , z: 7.5 }, name: "Office (DB8.-.1.020)"              ,  pointID: "ce717192-968f-46b5-bb43-6fb73965da0f", assetID:'d4d12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7971  },
      { position: { x: 768.8243408203125, y: 492.05230712890625, z: 7.5 }, name: "Electronics Workshop (DB8.-.1.021)",  pointID: "2da239f8-ddab-4d43-823f-8797638123f2", assetID:'ded06cc1-c29d-ef11-8a6b-0022489fd44c', objectDBID: 13069 },
      { position: { x: 788.08544921875  , y: 497.38482666015625, z: 7.5 }, name: "Mechanical Workshop (DB8.-.1.022)" ,  pointID: "a3215104-8c66-4714-96f4-dcb5b3fb2ab2", assetID:'e0d06cc1-c29d-ef11-8a6b-0022489fd44c', objectDBID: 13070 },
      // second floor
      { position: { x: 779.6911010742188 , y: 500.82025146484375, z: 18.3 }, name: "Social Area (DB8.-.2.001)"     ,   pointID: "193d3a83-b870-4d7b-83eb-ea73111b8c0a", assetID:'f4a66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7887 },
      { position: { x: 794.48248291015625, y: 493.23358154296875, z: 18.3 }, name: "Office (DB8.-.2.002)"           ,  pointID: "d8d4faa1-2bc9-4809-8a25-08430813fc63", assetID:'f2a66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7886 },
      { position: { x: 766.6151123046875 , y: 482.5823974609375 , z: 18.3 }, name: "Office (DB8.-.2.003)"           ,  pointID: "08d4abfb-ca40-4a35-91b4-3582388be8e5", assetID:'d6d12779-0ced-ee11-a203-0022489fd44c', objectDBID: 7861 },
      { position: { x: 763.1085815429688 , y: 491.7373352050781 , z: 18.3 }, name: "Office (DB8.-.2.004)"           ,  pointID: "23600d1e-3798-4b77-8eaa-fede3c1bddc8", assetID:'caa66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7862 },  //x +1 y -2
      { position: { x: 759.8141479492188 , y: 500.4873352050781 , z: 18.3 }, name: "Office (DB8.-.2.005)"           ,  pointID: "dbe72c0e-6856-4a84-8604-e33a06914608", assetID:'cea66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7864 },
      { position: { x: 757.3841552734375 , y: 506.9432678222656 , z: 18.3 }, name: "Office (DB8.-.2.006)"           ,  pointID: "5d186d87-62d6-415e-8f23-7ed4f96439dc", assetID:'cca66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7863 },
      { position: { x: 754.4649658203125 , y: 514.0925903320312 , z: 18.3 }, name: "Office (DB8.-.2.007)"           ,  pointID: "dede5f73-0a26-4330-a7b9-52499d79cc71", assetID:'d0a66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7865 },
      { position: { x: 751.7056274414062 , y: 521.8632202148438 , z: 18.3 }, name: "Office (DB8.-.2.008)"           ,  pointID: "671c9530-5a8c-49ce-aa4c-28e752c8137e", assetID:'d2a66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7866 },
      { position: { x: 748.361572265625  , y: 530.8175048828125 , z: 18.3 }, name: "Office (DB8.-.2.009)"           ,  pointID: "5c4c68f2-8d13-4b67-b7aa-88c876e12ff0", assetID:'d4a66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7867 },
      { position: { x: 744.0645141601562 , y: 541.5896606445312 , z: 18.3 }, name: "Office (DB8.-.2.010)"           ,  pointID: "f378f3bf-b905-4928-94d4-ce7dc0baffd0", assetID:'d6a66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7868 },
      { position: { x: 758.1451416015625 , y: 552.2349853515625 , z: 18.3 }, name: "Office (DB8.-.2.011)"           ,  pointID: "282a8fdc-d284-43ec-bf87-cb4f0b6b22f9", assetID:'d8a66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7873 }, // point to a desk then minus/add 4 to x and z times 10
      { position: { x: 771.0670166015625 , y: 556.9873046875    , z: 18.3 }, name: "Office (DB8.-.2.012)"           ,  pointID: "b8b962ae-4e0a-4563-848c-04a081e4700e", assetID:'daa66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7874 },
      { position: { x: 780.3478393554688 , y: 560.548583984375  , z: 18.3 }, name: "Office (DB8.-.2.013)"           ,  pointID: "008bc641-423d-4d53-bf0e-0046218da1c4", assetID:'dca66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7875 },
      { position: { x: 789.4520263671875 , y: 564.0685424804688 , z: 18.3 }, name: "Office (DB8.-.2.014)"           ,  pointID: "7a2568ce-4143-427e-9a7d-18d945d3a12b", assetID:'dea66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7876 },
      { position: { x: 798.769287109375  , y: 567.5257568359375 , z: 18.3 }, name: "Office (DB8.-.2.015)"           ,  pointID: "9d3aefd9-2b96-4674-b4dd-0a7947117af5", assetID:'e0a66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7877 },
      { position: { x: 807.8764038085938 , y: 571.00830078125   , z: 18.3 }, name: "Office (DB8.-.2.016)"           ,  pointID: "0e6cd4f0-cdb4-4c1e-8277-9fe15073f7ba", assetID:'e2a66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7878 },
      { position: { x: 826.433349609375  , y: 578.0833129882812 , z: 18.3 }, name: "Office (DB8.-.2.017)"           ,  pointID: "c3c4b142-1d49-4667-87e2-b9fd7ad3afb1", assetID:'e4a66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7879 },
      { position: { x: 838.93505859375   , y: 545.6364135742188 , z: 18.3 }, name: "Office (DB8.-.2.018)"           ,  pointID: "1147a344-9089-469f-a51b-ccc7b8b431cc", assetID:'eaa66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7882 }, // x +4 y -2
      { position: { x: 829.609619140625  , y: 542.1044921875    , z: 18.3 }, name: "Office (DB8.-.2.019)"           ,  pointID: "5bd45fab-d1ce-401a-9671-f0dd25b39c9e", assetID:'e8a66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7881 },
      { position: { x: 820.3927612304688 , y: 538.634033203125  , z: 18.3 }, name: "Office (DB8.-.2.020)"           ,  pointID: "310a64d0-dc6c-4ce4-9730-78301272ea99", assetID:'eca66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7883 },
      { position: { x: 810.6512451171875 , y: 552.7745971679688 , z: 18.3 }, name: "Meeting Room (DB8.-.2.021)"    ,   pointID: "16bc9315-dd0e-460e-a9c3-10ae5602dd2d", assetID:'f0a66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7885 },
      { position: { x: 805.84765625      , y: 534.26318359375   , z: 18.3 }, name: "Gym/Fitness Room (DB8.-.2.022)",   pointID: "34ad5978-9645-4d9e-a519-6cff67eb1713", assetID:'eea66663-0eed-ee11-a203-0022489fdfca', objectDBID: 7884 },
    ];

    await searchForSystemCode(viewer, myDataList);

    console.log('Updated nodesData:', myDataList); // Output the updated nodesData

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
      viewer.addEventListener(DataVizCore.MOUSE_CLICK, (event) => onSpriteClicked(event, viewer));  // Add the event listener after
      
      // console.log('Viewables added to the extension successfully!');
      // Add the viewables to the extension
      extension0.addViewables(viewableData);
    } catch (error) {
      // Catch any errors that occur during the process
      console.error('Error adding viewables:', error);
    }



}




//                           ACTUAL GET GRAPH DATA

// Define the onSpriteClicked function to handle sprite clicks
async function onSpriteClicked(event, viewer) {
  // Check if the clicked event contains a valid sprite (dbId)
  console.log('Clicked event:', event);  // Debugging line
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
          // Bring back data after test
          let model = 'DB8';
             viewer.LiveDataPanel.updateSpriteInfo(name, data, model);
             viewer.LiveDataPanel.setVisible(false);  // Show the Live Data panel
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

//           // Update the panel with the sprite info and show it
//           viewer.LiveDataPanel.updateSpriteInfo(name, randomData);
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





// const myDataList = [
//   // first floor
//   { position: { x: -7.4544677734375, y: -50.523826599121094, z: 1 }, name: "Main Entrance (DB8.-.1.001)",  pointID: "b957051a-2cb0-4bcb-990c-3c34a6f627a7" },
//   { position: { x: -1.5990402698516846, y: -35.01947784423828, z: 1 }, name: "Small Meeting/Office (DB8.-.1.004)",  pointID: "3b69ceda-a9e0-4b04-8a92-7ecccb6286a0" },
//   { position: { x: 14.28420639038086, y: -29.21438026428221, z: 1 }, name: "Office (DB8.-.1.005)",  pointID: "b343e138-36fb-4af4-80be-d266aca41db9" },
//   { position: { x: 23.6044921875, y: -25.988082885742188, z: 1 }, name: "Office (DB8.-.1.006)",  pointID: "7a97be73-e5f6-422b-ade9-6a14ca78b879" },
//   { position: { x: 32.92477798461914, y: -22.76178550720215, z: 1 }, name: "Office (DB8.-.1.007)",  pointID: "2c570a32-6987-4f6a-bac2-09572d9bcf56" }, //x -4  y +1 
//   { position: { x: 23.067581176757812, y: -9.72921085357666, z: 1 }, name: "Hot Desk (DB8.-.1.008)",  pointID: "c34c8e2d-67fe-49dc-af3f-4af4991e3f02" },
//   { position: { x: 20.28854751586914, y: 9.323418617248535, z: 1 }, name: "Office (DB8.-.1.009)",  pointID: "d695fb48-8698-41b3-a557-8dbb69524211" }, // y-1   x-4
//   { position: { x: 11.136373519897461, y: 5.81022834777832, z: 1 }, name: "Office (DB8.-.1.010)",  pointID: "d089bfc1-5b63-48d2-9c79-2ee5162b342e" },
//   { position: { x: 3.15217399597168, y: 2.513190269470215, z: 1 }, name: "Office (DB8.-.1.011)",  pointID: "d089bfc1-5b63-48d2-9c79-2ee5162b342e" },
//   { position: { x: -7.1676769256591797, y: -1.2160385102033615, z: 1 }, name: "Office (DB8.-.1.012)",  pointID: "bcf5cba9-1821-46c9-90e4-737860933e69" }, // y+1   x+4
//   { position: { x: -15.296846389770508, y: -4.4113433361053467, z: 1 }, name: "Office (DB8.-.1.013)",  pointID: "a674dc37-bd9a-4afe-a8e0-a04954293334" },
//   { position: { x: -24.996318817138672, y: -7.746861457824707, z: 1 }, name: "Office (DB8.-.1.014)",  pointID: "f545cc16-709c-46ca-8331-41463edead9f" }, // x-3   y-2
//   { position: { x: -44.996318817138672, y: -14.746861457824707, z: 1 }, name: "Social Area (DB8.-.1.017)",  pointID: "1da69c37-4364-4bdd-a40d-ec60078c5593" },
//   { position: { x: -53.81877136230469, y: -43.58452224731445, z: 1 }, name: "Office (DB8.-.1.018)",  pointID: "1d512e32-54df-4c23-ac36-25fb03665dfd" }, // x-1   y-3
//   { position: { x: -49.02860641479492, y: -55.136619567871094, z: 1 }, name: "Office (DB8.-.1.019)",  pointID: "d7b28135-4a1e-4251-b436-b21b630d0012" },
//   { position: { x: -45.227108001708984, y: -62.72303009033203, z: 1 }, name: "Office (DB8.-.1.020)",  pointID: "ce717192-968f-46b5-bb43-6fb73965da0f" },
//   { position: { x: -34.54344940185547, y: -73.68550872802734, z: 1 }, name: "Electronics Workshop (DB8.-.1.021)",  pointID: "2da239f8-ddab-4d43-823f-8797638123f2" },
//   { position: { x: -20.29170036315918, y: -68.0743637084961, z: 1 }, name: "Mechanical Workshop (DB8.-.1.022)",  pointID: "a3215104-8c66-4714-96f4-dcb5b3fb2ab2" },
//   // second floor
//   // { position: { x: -28.199254989624023, y: -63.891197204589844, z: 10 }, name: "Social Area (DB8.-.2.001)",  pointID: "193d3a83-b870-4d7b-83eb-ea73111b8c0a" },
//   { position: { x: 787.7235107421875, y: 496.2212829589844, z: 18.5 }, name: "Social Area (DB8.-.2.001)",  pointID: "193d3a83-b870-4d7b-83eb-ea73111b8c0a" },
//   { position: { x: -10.616475105285645, y: -75.35884094238281, z: 10 }, name: "Office (DB8.-.2.002)",  pointID: "d8d4faa1-2bc9-4809-8a25-08430813fc63" },
//   { position: { x: -37.16954040527344, y: -86.9566421508789, z: 10 }, name: "Office (DB8.-.2.003)",  pointID: "08d4abfb-ca40-4a35-91b4-3582388be8e5" },
//   { position: { x: -40.05435562133789, y: -77.49775695800781, z: 10 }, name: "Office (DB8.-.2.004)",  pointID: "23600d1e-3798-4b77-8eaa-fede3c1bddc8" },  //x +1 y -2
//   { position: { x: -42.90624237060547, y: -70.06834411621094, z: 10 }, name: "Office (DB8.-.2.005)",  pointID: "dbe72c0e-6856-4a84-8604-e33a06914608" },
//   { position: { x: -46.08716583251953, y: -61.7817497253418, z: 10 }, name: "Office (DB8.-.2.006)",  pointID: "5d186d87-62d6-415e-8f23-7ed4f96439dc" },
//   { position: { x: -49.08607482910156, y: -54.88481521606445, z: 10 }, name: "Office (DB8.-.2.007)",  pointID: "dede5f73-0a26-4330-a7b9-52499d79cc71" },
//   { position: { x: -51.74506759643555, y: -47.95791244506836, z: 10 }, name: "Office (DB8.-.2.008)",  pointID: "671c9530-5a8c-49ce-aa4c-28e752c8137e" },
//   { position: { x: -55.10665512084961, y: -39.20066833496094, z: 10 }, name: "Office (DB8.-.2.009)",  pointID: "5c4c68f2-8d13-4b67-b7aa-88c876e12ff0" },
//   { position: { x: -60, y: -25, z: 10 }, name: "Office (DB8.-.2.010)", pointID: "f378f3bf-b905-4928-94d4-ce7dc0baffd0" },
//   { position: { x: -45, y: -17, z: 10 }, name: "Office (DB8.-.2.011)", pointID: "282a8fdc-d284-43ec-bf87-cb4f0b6b22f9" }, // point to a desk then minus/add 4 to x and z times 10
//   { position: { x: -33.631832122802734, y: -12.092769622802734, z: 10 }, name: "Office (DB8.-.2.012)",  pointID: "b8b962ae-4e0a-4563-848c-04a081e4700e" },
//   { position: { x: -24.42253303527832, y: -8.557650566101074, z: 10 }, name: "Office (DB8.-.2.013)",  pointID: "008bc641-423d-4d53-bf0e-0046218da1c4" },
//   { position: { x: -15.049692153930664, y: -5.311180114746094, z: 10 }, name: "Office (DB8.-.2.014)",  pointID: "7a2568ce-4143-427e-9a7d-18d945d3a12b" },
//   { position: { x: -5.995307922363281, y: -1.8355271816253662, z: 10 }, name: "Office (DB8.-.2.015)",  pointID: "9d3aefd9-2b96-4674-b4dd-0a7947117af5" },
//   { position: { x: 4.310800552368164, y: 2.081400871276855, z: 10 }, name: "Office (DB8.-.2.016)",  pointID: "0e6cd4f0-cdb4-4c1e-8277-9fe15073f7ba" },
//   { position: { x: 20.118976593017578, y: 8.946104049682617, z: 10 }, name: "Office (DB8.-.2.017)",  pointID: "c3c4b142-1d49-4667-87e2-b9fd7ad3afb1" },
//   { position: { x: 34.674522399902344, y: -23.034147262573242, z: 10 }, name: "Office (DB8.-.2.018)",  pointID: "1147a344-9089-469f-a51b-ccc7b8b431cc" }, // x +4 y -2
//   { position: { x: 25.742843627929688, y: -26.376054763793945, z: 10 }, name: "Office (DB8.-.2.019)",  pointID: "5bd45fab-d1ce-401a-9671-f0dd25b39c9e" },
//   { position: { x: 16.342942237854004, y: -30.070980072021484, z: 10 }, name: "Office (DB8.-.2.020)",  pointID: "310a64d0-dc6c-4ce4-9730-78301272ea99" },
//   { position: { x: 2.4715659618377686, y: -16.61492347717285, z: 10 }, name: "Meeting Room (DB8.-.2.021)",  pointID: "16bc9315-dd0e-460e-a9c3-10ae5602dd2d" },
//   { position: { x: 6.169073104858398, y: -32.653114318847656, z: 10 }, name: "Gym/Fitness Room (DB8.-.2.022)",  pointID: "34ad5978-9645-4d9e-a519-6cff67eb1713" },
// ];






// async function onSpriteClicked(event, viewer) {
//   // Check if the clicked event contains a valid sprite (dbId)
//   if (event.dbId && event.dbId !== -1) {
//       console.log(`Sprite clicked: ${event.dbId}`);
      
//       // Retrieve the viewable from the map using dbId
//       const viewable = viewableMap.get(event.dbId);
      
//       if (viewable) {
//           // Access the custom data from the viewable
//           const name = viewable.customData?.name;
          
//           if (name) {
//               console.log(`Sprite name: ${name}`);  // Log the name associated with the clicked sprite
//           } else {
//               console.log('No name found for this sprite.');
//           }

//           // Check if the bar chart panel is exposed and show it
//           console.log(`Updating panel with dbId: ${event.dbId}`);

//           const response = await fetch(`/api/graphData/${name}`);
//           if (!response.ok) {
//             throw new Error(`Error fetching sensor data: ${response.statusText}`);
//           }

//           window.histogramPanels.barChart.updateSpriteInfo(name);  // Update panel with sprite info
//           window.histogramPanels.barChart.setVisible(true);  // Show the histogram panel
//       } else {
//           console.log('No viewable found for this dbId.');
//       }
//   } else {
//       // Ignore the event if the click did not happen on a sprite
//       console.log("Click outside of sprite detected, no action taken.");
//       window.histogramPanels.barChart.setVisible(false);  // Hide the histogram panel
//   }
// }





// async function onSpriteClicked(event, viewer) {
//   // Check if the clicked event contains a valid sprite (dbId)
//   if (event.dbId && event.dbId !== -1) {
//       console.log(`Sprite clicked: ${viewer}`);
      
//       // Check if the bar chart panel is exposed and show it
//       console.log(`Updating panel with dbId: ${event.dbId}`);
//       window.histogramPanels.barChart.updateSpriteInfo(event.dbId); // Update panel with sprite info
//       window.histogramPanels.barChart.setVisible(true);  // Show the histogram panel

//       // const response = await fetch(`/api/sensor/${location}`);
//       //   if (!response.ok) {
//       //       throw new Error(`Error fetching sensor data: ${response.statusText}`);
//       //   }
          
//   } else {
//       // Ignore the event if the click did not happen on a sprite
//       console.log("Click outside of sprite detected, no action taken.");
//       window.histogramPanels.barChart.setVisible(false);  // Hide the histogram panel
//   }
// }

