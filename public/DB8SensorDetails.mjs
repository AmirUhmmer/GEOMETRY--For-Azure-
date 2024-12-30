// // Custom Levels Extension push test


export class SensorDetailExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.panel = null;
    }

    load() {
        console.log('SensorDetailExtension loaded.');

        // Create the button
        const button = new Autodesk.Viewing.UI.Button('sensor-detail-button');
        button.onClick = () => {
            // Define what happens when the button is clicked
            alert('Sensor Details button clicked');
        };
        
        // Set the button tooltip
        button.setToolTip('Show Sensor Details');

        // Create a toolbar group
        const toolbarGroup = new Autodesk.Viewing.UI.ControlGroup('sensor-toolbar-group');
        toolbarGroup.addControl(button); // Add the button to the toolbar group

        // Add the toolbar group to the viewer toolbar
        this.viewer.toolbar.addControl(toolbarGroup);

        return true;
    }

    unload() {
        console.log('SensorDetailExtension unloaded.');
        if (this.panel) {
            this.panel.setVisible(false);
            this.viewer.removePanel(this.panel);
            this.panel = null;
        }
        return true;
    }
}

// Register the extension
Autodesk.Viewing.theExtensionManager.registerExtension('SensorDetailExtension', SensorDetailExtension);




















// export class MyLevelsExtension extends Autodesk.Viewing.Extension {
//     constructor(viewer, options) {
//         super(viewer, options);
//         this.panel = null;
//     }

//     async load() {
//         console.log('MyLevelsExtension has been loaded.');
//         return true;
//     }

//     unload() {
//         if (this.panel) {
//             this.panel.setVisible(false);
//             this.viewer.removePanel(this.panel);
//             this.panel = null;
//         }
//         console.log('MyLevelsExtension has been unloaded.');
//         return true;
//     }

//     onToolbarCreated() {
//         const levelsPanelButton = new Autodesk.Viewing.UI.Button('levels-panel-button');
//         levelsPanelButton.onClick = () => {
//             if (!this.panel) {
//                 this.panel = new LevelsPanel(this.viewer);
//                 this.viewer.addPanel(this.panel);
//             }
//             this.panel.setVisible(!this.panel.isVisible());
//         };

//         levelsPanelButton.setToolTip('Show Levels Panel');

//         const toolbarGroup = new Autodesk.Viewing.UI.ControlGroup('levels-tool-group');
//         toolbarGroup.addControl(levelsPanelButton);
//         this.viewer.toolbar.addControl(toolbarGroup);
//     }
// }

// class LevelsPanel extends Autodesk.Viewing.UI.DockingPanel {
//     constructor(viewer) {
//         super(viewer.container, 'levelsPanel', 'Levels');

//         this.viewer = viewer;
//         this.container.classList.add('adn-docking-panel');
//         this.container.style.top = '10px';
//         this.container.style.left = '10px';

//         this.createScrollContainer({ heightAdjustment: 50 });

//         this.buildUI();
//     }

//     async buildUI() {
//         const levels = await this.getLevels();
//         const div = document.createElement('div');

//         // Create an unordered list (ul) to hold levels as list items
//         const ul = document.createElement('ul');
//         ul.style.listStyleType = 'none';  // Remove default bullet points
//         ul.style.paddingLeft = '0px'

//         levels.forEach(level => {
//             const li = document.createElement('li');
//             li.textContent = '' + level.name;
//             li.style.paddingRight = '100px';
//             li.style.paddingLeft = '10px';
//             li.style.margin = '10px';
//             li.style.cursor = 'pointer';
//             li.onclick = () => this.isolateLevel(level.name);  // Click to isolate
//             ul.appendChild(li);
//             div.appendChild(ul);
            
//         });

//         this.scrollContainer.appendChild(div);
//     }

//     async getLevels() {
//         const levelDbIds = await this.searchLevels();
//         const levelData = [];

//         for (let dbId of levelDbIds) {
//             const properties = await this.getPropertiesAsync(dbId);
//             if (properties) {
//                 levelData.push({
//                     name: properties.name || properties.externalId,
//                     dbIds: [dbId]
//                 });
//             }
//         }
//         return levelData;
//     }

//     searchLevels() {
//         return new Promise((resolve, reject) => {
//             this.viewer.search(
//                 'Level',
//                 dbIds => resolve(dbIds),
//                 error => reject(error),
//                 ['Category'],
//                 { searchHidden: true }
//             );
//         });
//     }

//     getPropertiesAsync(dbId) {
//         return new Promise((resolve, reject) => {
//             this.viewer.getProperties(dbId, result => resolve(result), error => reject(error));
//         });
//     }

//     async isolateLevel (levelName) {
//         const allDbIds = await this.getAllDbIds();  // Get all dbIds in the model
//         const dbIdsToIsolate = [];

//         // Loop through each dbId and check its properties
//         for (let dbId of allDbIds) {
//             const properties = await this.getPropertiesAsync(dbId);
//             if (properties) {
//                 const levelProp = properties.properties.find(prop => prop.displayName === 'Level');
//                 if (levelProp && levelProp.displayValue === levelName) {
//                     dbIdsToIsolate.push(dbId);
//                 }
//             }
//         }

//         // If we found dbIds that match the level name, isolate them
//         if (dbIdsToIsolate.length > 0) {
//             this.viewer.isolate(dbIdsToIsolate);  // Isolate objects
//             this.viewer.fitToView(dbIdsToIsolate);  // Optionally, fit view to these objects
//         }
//     }

//     // Retrieve all dbIds in the model
//     async getAllDbIds() {
//         return new Promise((resolve, reject) => {
//             this.viewer.getObjectTree((tree) => {
//                 const dbIds = [];
//                 tree.enumNodeFragments(tree.getRootId(), dbId => {
//                     dbIds.push(dbId);
//                 }, true);
//                 resolve(dbIds);
//             }, reject);
//         });
//     }
// }

// Autodesk.Viewing.theExtensionManager.registerExtension('MyLevelsExtension', MyLevelsExtension);