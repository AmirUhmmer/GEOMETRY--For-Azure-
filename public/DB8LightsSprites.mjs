const viewableMap = new Map();

export async function LightSPRITES(viewer, selectedFloor) {
    const { SurfaceShadingData, SurfaceShadingPoint, SurfaceShadingNode } = Autodesk.DataVisualization.Core;

    const extension0 = await viewer.loadExtension('Autodesk.DataVisualization');

    if (!extension0) {
        console.error('Error loading the DataVisualization extension.');
        return;
    }

    console.log('TEST: ' + selectedFloor);

    const DataVizCore = Autodesk.DataVisualization.Core;
    const viewableType = DataVizCore.ViewableType.SPRITE;
    const spriteColor = new THREE.Color(0xffffff);  // White color for visibility
    const lightsOffURL = "./images/LightsOff.svg";
    const lightsOnURL = "./images/LightsOn.svg"; // Alternate image for 'on' state

    const viewableData = new DataVizCore.ViewableData();
    viewableData.spriteSize = 32; // Sprite size

    const myDataList = [
      // first floor
      { position: { x: 791.816162109375 , y: 516.4945068359375 , z: 7.5 }, name: "Main Entrance (DB8.-.1.001)"       ,  pointID: "b957051a-2cb0-4bcb-990c-3c34a6f627a7", objectDBID: 13076 },
      { position: { x: 801.0904541015625, y: 532.6544799804688 , z: 7.5 }, name: "Small Meeting/Office (DB8.-.1.004)",  pointID: "3b69ceda-a9e0-4b04-8a92-7ecccb6286a0", objectDBID: 7898  },
      { position: { x: 806.6129150390625, y: 534.724365234375  , z: 7.5 }, name: "Small Meeting/Office (DB8.-.1.004) (2)",  pointID: "3b69ceda-a9e0-4b04-8a92-7ecccb6286a0", objectDBID: 78981  },
      { position: { x: 820.8671875      , y: 540.1024780273438 , z: 7.5 }, name: "Office (DB8.-.1.005)"              ,  pointID: "b343e138-36fb-4af4-80be-d266aca41db9", objectDBID: 7899  },
      { position: { x: 828.3556518554688 , y: 543.1005859375   , z: 7.5 }, name: "Office (DB8.-.1.006)"              ,  pointID: "7a97be73-e5f6-422b-ade9-6a14ca78b879", objectDBID: 7896  },
      { position: { x: 837.6583251953125 , y: 546.6654663085938 , z: 7.5 }, name: "Office (DB8.-.1.007)"              ,  pointID: "2c570a32-6987-4f6a-bac2-09572d9bcf56", objectDBID: 7897  }, //x -4  y +1 
      { position: { x: 829.5490112304688, y: 560.9873046875    , z: 7.5 }, name: "Hot Desk (DB8.-.1.008)"            ,  pointID: "c34c8e2d-67fe-49dc-af3f-4af4991e3f02", objectDBID: 7895  },
      { position: { x: 825.149658203125 , y: 578.9117431640625 , z: 7.5 }, name: "Office (DB8.-.1.009)"              ,  pointID: "d695fb48-8698-41b3-a557-8dbb69524211", objectDBID: 7894  }, // y-1   x-4
      { position: { x: 815.8023071289062, y: 575.2665405273438 , z: 7.5 }, name: "Office (DB8.-.1.010)"              ,  pointID: "d089bfc1-5b63-48d2-9c79-2ee5162b342e", objectDBID: 7893  },
      { position: { x: 806.6764526367188, y: 571.6778564453125 , z: 7.5 }, name: "Office (DB8.-.1.011)"              ,  pointID: "d089bfc1-5b63-48d2-9c79-2ee5162b342e", objectDBID: 7892  },
      { position: { x: 797.4756469726562, y: 568.159912109375  , z: 7.5 }, name: "Office (DB8.-.1.012)"              ,  pointID: "bcf5cba9-1821-46c9-90e4-737860933e69", objectDBID: 7891  }, // y+1   x+4
      { position: { x: 788.3688354492188, y: 564.5670776367188 , z: 7.5 }, name: "Office (DB8.-.1.013)"              ,  pointID: "a674dc37-bd9a-4afe-a8e0-a04954293334", objectDBID: 7890  },
      { position: { x: 779.0816650390625, y: 561.0070190429688 , z: 7.5 }, name: "Office (DB8.-.1.014)"              ,  pointID: "f545cc16-709c-46ca-8331-41463edead9f", objectDBID: 7889  }, // x-3   y-2
      { position: { x: 803.4495239257812, y: 548.885986328125 , z: 7.5 }, name: "Meeting Room (DB8.-.1.015)"              ,  pointID: "f545cc16-709c-46ca-8331-41463edead9f", objectDBID: 78891  },
      { position: { x: 810.8169555664062, y: 551.707763671875 , z: 7.5 }, name: "Meeting Room (DB8.-.1.015) (2)"              ,  pointID: "f545cc16-709c-46ca-8331-41463edead9f", objectDBID: 78892  },
      { position: { x: 748.4779052734375, y: 544.4462890625    , z: 7.5 }, name: "Social Area (DB8.-.1.017)"         ,  pointID: "1da69c37-4364-4bdd-a40d-ec60078c5593", objectDBID: 7888  },
      { position: { x: 752.3358764648438, y: 524.6958618164062 , z: 7.5 }, name: "Office (DB8.-.1.018)"              ,  pointID: "1d512e32-54df-4c23-ac36-25fb03665dfd", objectDBID: 7969  }, // x-1   y-3
      { position: { x: 755.8767700195312, y: 515.68212890625 , z: 7.5 }, name: "Office (DB8.-.1.019)"              ,  pointID: "d7b28135-4a1e-4251-b436-b21b630d0012", objectDBID: 7970  },
      { position: { x: 759.2647705078125, y: 506.7217102050781 , z: 7.5 }, name: "Office (DB8.-.1.020)"              ,  pointID: "ce717192-968f-46b5-bb43-6fb73965da0f", objectDBID: 7971  },
      { position: { x: 768.8243408203125, y: 492.05230712890625, z: 7.5 }, name: "Electronics Workshop (DB8.-.1.021)",  pointID: "2da239f8-ddab-4d43-823f-8797638123f2", objectDBID: 13074 },
      { position: { x: 788.08544921875  , y: 497.38482666015625, z: 7.5 }, name: "Mechanical Workshop (DB8.-.1.022)" ,  pointID: "a3215104-8c66-4714-96f4-dcb5b3fb2ab2", objectDBID: 13075 },
      // second floor
      { position: { x: 779.6911010742188 , y: 500.82025146484375, z: 18.3 }, name: "Social Area (DB8.-.2.001)"     ,  pointID: "193d3a83-b870-4d7b-83eb-ea73111b8c0a", objectDBID: 7887 },
      { position: { x: 794.48248291015625, y: 493.23358154296875, z: 18.3 }, name: "Office (DB8.-2.002)"           ,  pointID: "d8d4faa1-2bc9-4809-8a25-08430813fc63", objectDBID: 7886 },
      { position: { x: 766.6151123046875 , y: 482.5823974609375 , z: 18.3 }, name: "Office (DB8.-2.003)"           ,  pointID: "08d4abfb-ca40-4a35-91b4-3582388be8e5", objectDBID: 7861 },
      { position: { x: 763.1085815429688 , y: 491.7373352050781 , z: 18.3 }, name: "Office (DB8.-2.004)"           ,  pointID: "23600d1e-3798-4b77-8eaa-fede3c1bddc8", objectDBID: 7862 },  //x +1 y -2
      { position: { x: 759.8141479492188 , y: 500.4873352050781 , z: 18.3 }, name: "Office (DB8.-2.005)"           ,  pointID: "dbe72c0e-6856-4a84-8604-e33a06914608", objectDBID: 7864 },
      { position: { x: 757.3841552734375 , y: 506.9432678222656 , z: 18.3 }, name: "Office (DB8.-2.006)"           ,  pointID: "5d186d87-62d6-415e-8f23-7ed4f96439dc", objectDBID: 7863 },
      { position: { x: 754.4649658203125 , y: 514.0925903320312 , z: 18.3 }, name: "Office (DB8.-2.007)"           ,  pointID: "dede5f73-0a26-4330-a7b9-52499d79cc71", objectDBID: 7865 },
      { position: { x: 751.7056274414062 , y: 521.8632202148438 , z: 18.3 }, name: "Office (DB8.-2.008)"           ,  pointID: "671c9530-5a8c-49ce-aa4c-28e752c8137e", objectDBID: 7866 },
      { position: { x: 748.361572265625  , y: 530.8175048828125 , z: 18.3 }, name: "Office (DB8.-2.009)"           ,  pointID: "5c4c68f2-8d13-4b67-b7aa-88c876e12ff0", objectDBID: 7867 },
      { position: { x: 744.0645141601562 , y: 541.5896606445312 , z: 18.3 }, name: "Office (DB8.-2.010)"           ,  pointID: "f378f3bf-b905-4928-94d4-ce7dc0baffd0", objectDBID: 7868 },
      { position: { x: 758.1451416015625 , y: 552.2349853515625 , z: 18.3 }, name: "Office (DB8.-2.011)"           ,  pointID: "282a8fdc-d284-43ec-bf87-cb4f0b6b22f9", objectDBID: 7873 }, // point to a desk then minus/add 4 to x and z times 10
      { position: { x: 771.0670166015625 , y: 556.9873046875    , z: 18.3 }, name: "Office (DB8.-2.012)"           ,  pointID: "b8b962ae-4e0a-4563-848c-04a081e4700e", objectDBID: 7874 },
      { position: { x: 780.3478393554688 , y: 560.548583984375  , z: 18.3 }, name: "Office (DB8.-2.013)"           ,  pointID: "008bc641-423d-4d53-bf0e-0046218da1c4", objectDBID: 7875 },
      { position: { x: 789.4520263671875 , y: 564.0685424804688 , z: 18.3 }, name: "Office (DB8.-2.014)"           ,  pointID: "7a2568ce-4143-427e-9a7d-18d945d3a12b", objectDBID: 7876 },
      { position: { x: 798.769287109375  , y: 567.5257568359375 , z: 18.3 }, name: "Office (DB8.-2.015)"           ,  pointID: "9d3aefd9-2b96-4674-b4dd-0a7947117af5", objectDBID: 7877 },
      { position: { x: 807.8764038085938 , y: 571.00830078125   , z: 18.3 }, name: "Office (DB8.-2.016)"           ,  pointID: "0e6cd4f0-cdb4-4c1e-8277-9fe15073f7ba", objectDBID: 7878 },
      { position: { x: 826.433349609375  , y: 578.0833129882812 , z: 18.3 }, name: "Office (DB8.-2.017)"           ,  pointID: "c3c4b142-1d49-4667-87e2-b9fd7ad3afb1", objectDBID: 7879 },
      { position: { x: 838.93505859375   , y: 545.6364135742188 , z: 18.3 }, name: "Office (DB8.-2.018)"           ,  pointID: "1147a344-9089-469f-a51b-ccc7b8b431cc", objectDBID: 7882 }, // x +4 y -2
      { position: { x: 829.609619140625  , y: 542.1044921875    , z: 18.3 }, name: "Office (DB8.-2.019)"           ,  pointID: "5bd45fab-d1ce-401a-9671-f0dd25b39c9e", objectDBID: 7881 },
      { position: { x: 820.3927612304688 , y: 538.634033203125  , z: 18.3 }, name: "Office (DB8.-2.020)"           ,  pointID: "310a64d0-dc6c-4ce4-9730-78301272ea99", objectDBID: 7883 },
      { position: { x: 810.6512451171875 , y: 552.7745971679688 , z: 18.3 }, name: "Meeting Room (DB8.-.2.021)"    ,  pointID: "16bc9315-dd0e-460e-a9c3-10ae5602dd2d", objectDBID: 7885 },
      { position: { x: 805.84765625      , y: 534.26318359375   , z: 18.3 }, name: "Gym/Fitness Room (DB8.-.2.022)",  pointID: "34ad5978-9645-4d9e-a519-6cff67eb1713", objectDBID: 7884 },
    ];

    // { position: { x: -, y: -, z: 10 }, name: "0" },
    
    try {
        // Use for...of loop to handle async operations
        for (const myData of myDataList) {
            const dbId = myData.objectDBID;
            const position = myData.position;
            const name = myData.name;
            const pointId = myData.pointID;

            // Fetch the sensor value asynchronously
            const sensorValue = await getSensorValue(pointId);

            // Determine the sprite icon URL based on the sensor value
            const spriteIconUrl = sensorValue < 0.5 ? lightsOffURL : lightsOnURL;

            // Create the viewable style with the selected icon
            const style = new DataVizCore.ViewableStyle(viewableType, spriteColor, spriteIconUrl);
            const viewable = new DataVizCore.SpriteViewable(position, style, dbId, name, pointId, dbId);

            viewable.customData = { name, pointId, dbId }; // Attach custom data
            viewableData.addViewable(viewable);

            // Add the viewable to the map by dbId
            viewableMap.set(dbId, viewable);
        }

        await viewableData.finish();  // Ensure viewable data is finished
        console.log('Viewable Data finished successfully!');

        // Add the viewables to the extension
        extension0.addViewables(viewableData);

        const models = viewer.impl.modelQueue().getModels();

        console.log('Viewables added to the extension successfully!');
    } catch (error) {
        console.error('Error adding viewables:', error);
    }
}

// Function to fetch sensor value from the database via API
async function getSensorValue(location) {
    // try {
    //     const response = await fetch(`/api/sensor/${location}`);
    //     if (response.ok) {
    //         const data = await response.json();
    //         return data.value; // Return the sensor value
    //     } else {
    //         console.error('Error fetching sensor value:', response.status);
    //         return null;
    //     }
    // } catch (error) {
    //     console.error('Error fetching sensor value:', error);
    //     return null;
    // }
    const randomNumber = Math.random();
    return randomNumber;
}