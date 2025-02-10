// Map to store viewables by dbId push test
const viewableMap = new Map();

export async function Sol11PicsSPRITES(viewer) {

    // const extension0 = await viewer.loadExtension('Autodesk.DataVisualization');

    // if (!extension0) {
    //   console.error('Error loading the DataVisualization extension.');
    // }

    // const DataVizCore = Autodesk.DataVisualization.Core;
    // const viewableType = DataVizCore.ViewableType.SPRITE;
    // const spriteColor = new THREE.Color(0xffffff);  // Red color for better visibility
    // const baseURL = "./images/eyeSprite.svg";
    // const spriteIconUrl = `${baseURL}`;
    
    // const style = new DataVizCore.ViewableStyle(viewableType, spriteColor, spriteIconUrl);
    
    // const viewableData = new DataVizCore.ViewableData();
    // viewableData.spriteSize = 30; // Sprites as points of size 24 x 24 pixels

    // const myDataList = [
    //   // first floor
    //   { position: { x: 115.94706726074219 , y: 50.89152145385742 , z: 30 }, name: "OtherC"       ,  url3D: "https://realsee.ai/ByNNRbn8?shareCode=bqZLmvMQ&entry=share" },
    //   { position: { x: 125.94706726074219 , y: 50.89152145385742 , z: 30 }, name: "OtherH"       ,  url3D: "https://realsee.ai/ByNNRbn8?shareCode=o6Zol0Ma&entry=share" },
    //   { position: { x: 132.94706726074219 , y: 50.89152145385742 , z: 30 }, name: "OtherG"       ,  url3D: "https://realsee.ai/ByNNRbn8?shareCode=avMOx5y5&entry=share" },
    // //   { position: { x: 805.84765625      , y: 534.26318359375   , z: 18.3 }, name: "Gym/Fitness Room (DB8.-.2.022)",  pointID: "34ad5978-9645-4d9e-a519-6cff67eb1713", objectDBID: 7884 }
    // ];

    // // { position: { x: -, y: -, z: 10 }, name: "0" },
    
    // try {
    //   myDataList.forEach((myData, index) => {
    //     const dbId = 10 + index;
    //     const position = myData.position;
    //     const name = myData.name; // Get the custom name (e.g., "Office (DB8.-.2.010)")
    //     const url3D = myData.url3D; // Get the custom URL for the 3D model
    //     const viewable = new DataVizCore.SpriteViewable(position, style, dbId, name, url3D);

    //     viewable.customData = { name, url3D }; // Attach custom data to the viewable
    //     // console.log(`Setting customData for ${name, pointId}:`, viewable.customData);  // Debugging line
    //     viewableData.addViewable(viewable);

    //     // Add the viewable to the map by dbId
    //     viewableMap.set(dbId, viewable);
    //   });
    
    //   // Try finishing and adding the viewables, with success confirmation
    //   await viewableData.finish();  // Ensure the viewable data is finished before proceeding
    //   console.log('Viewable Data finished successfully!');
      
    //   // Add the viewables to the extension
    //   extension0.addViewables(viewableData);

    //   const models = viewer.impl.modelQueue().getModels();

    //   viewer.addEventListener(DataVizCore.MOUSE_CLICK, (event) => onSpriteClicked(event, viewer));
    //   console.log('Viewables added to the extension successfully!');
    // } catch (error) {
    //   // Catch any errors that occur during the process
    //   console.error('Error adding viewables:', error);
    // }

}


// function onSpriteClicked(event, viewer) {
//     if (event.dbId && event.dbId !== -1) {
//         console.log(`Sprite clicked: ${event.dbId}`);

//         // Retrieve the viewable from the map using dbId
//         const viewable = viewableMap.get(event.dbId);

//         if (viewable) {
//             const { name, url3D } = viewable.customData;
//             console.log(`Sprite clicked: ${name}`);
//             if (url3D) {
//                 window.open(url3D, '_blank');
//             }
//         }
//     }
//   }