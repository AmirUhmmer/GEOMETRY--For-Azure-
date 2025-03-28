import { SPRITES } from '../DB8/DB8Sprites.mjs';
import { HEATMAP } from '../DB8/DB8SurfaceShading.mjs';
import { LightSPRITES } from '../DB8/DB8LightsSprites.mjs';
import { HG62HEATMAP } from '../HG62/HG62SurfaceShading.mjs';
import { HG62SPRITES } from '../HG62/HG62Sprites.mjs';


let LiveData = localStorage.getItem('LiveData');



// ---------------------------LIVE DATA PANEL-----------------------------------

// Function to create and display a docking panel
export function showLiveDataPanel(viewer) {

    // Create a custom Docking Panel class
    class LiveDataPanel extends Autodesk.Viewing.UI.DockingPanel {
        constructor(viewer, title, options) {
            super(viewer.container, title, options);  // Fixed the title to "Service Task"
            
            // Set the panel styles
            this.container.style.top = "10px";
            this.container.style.left = "10px";
            this.container.style.width = "300px";
            this.container.style.height = "325px";
            this.container.style.resize = "auto";
            this.container.style.backgroundColor = '#333';
            this.container.style.title = 'Live Data';
    
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
            const content = [
                { id: 'spriteDbId', label: 'Selected Room:', value: 'None' },
                { id: 'spriteTemp', label: 'Temperature:', value: '0' },
                { id: 'spriteSetPoint', label: 'Setpoint:', value: '0' },
                { id: 'spriteTime', label: 'As of:', value: 'Lorem Ipsum' },
                { id: 'MSFabricsURL', label: 'MS Fabrics:', value: 'View the MS Fabrics', url: 'https://app.powerbi.com/groups/c9e86663-87b6-49cf-b5b2-a79d6a01d7dd/list?experience=power-bi' },
                { id: 'BIReports', label: 'Power BI Reports:', value: 'View the Power BI Reports', url: 'https://app.powerbi.com/groups/c9e86663-87b6-49cf-b5b2-a79d6a01d7dd/list?experience=power-bi&subfolderId=1978' },
                { id: 'SpecificReport', label: 'Specific Report for this data point:', value: 'View Report', url: 'https://app.powerbi.com/reportEmbed?reportId=f6f9c99d-e70d-4a97-94dc-375d0d0a9af7&autoAuth=true&ctid=ead65215-ebfd-4a8d-9e73-b403a85a7e04&filter=RelynkIdentifier0711/point_name%20eq%20%27Current%27%20and%20RelynkIdentifier0711/is_point_of_furniture_name%20eq%20%27Small%20Meeting/Office%20(DB8.-.1.004)%27' }
            ];
    
            // Loop through content array and create elements
            content.forEach(item => {
                const container = document.createElement('div');
                container.style.marginBottom = '10px';  // Add space between elements
    
                if (item.url) {
                    container.innerHTML = `<strong>${item.label}</strong> <a style="color: #3399FF;" id="${item.id}" href="${item.url}" target="_blank">${item.value}</a>`;
                } else {
                    container.innerHTML = `<strong>${item.label}</strong> <span id="${item.id}">${item.value}</span>`;
                }
    
                this.scrollContainer.appendChild(container);
            });
        }

        // Add a method to update the panel's content
        updateSpriteInfo(name, data, model) {
            if (model === 'DB8') {
                document.getElementById('spriteDbId').innerText = name;
                document.getElementById('spriteTemp').innerText = data[0].value + '°C';  // Assuming randomData has a 'temp' property
                document.getElementById('spriteTime').innerText = data[0].observationTime;  // Assuming randomData has a 'time' property
                const specificReportLink = this.container.querySelector('#SpecificReport');  // Select the hyperlink with the ID 'SpecificReport'
                if (specificReportLink) {
                    specificReportLink.href = 'https://app.powerbi.com/reportEmbed?reportId=f6f9c99d-e70d-4a97-94dc-375d0d0a9af7&autoAuth=true&ctid=ead65215-ebfd-4a8d-9e73-b403a85a7e04&filter=RelynkIdentifier0711%2Fpoint_name+eq+%27Current%27+and+RelynkIdentifier0711%2Fis_point_of_furniture_name+eq+%27' + name + '%27';
                }
                // Hide the setpoint
                const elementsToHide = ['spriteSetPoint'];

                elementsToHide.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.style.display = 'none';  // Hide the link
                        element.previousElementSibling.style.display = 'none';  // Hide the label
                    }
                });
            } else if (model === 'HG62') {
                // Parse the ISO 8601 string and adjust to local timezone
                const observationDate = new Date(data.observationTime);

                // Format the time as "3:34 PM"
                const formattedTime = observationDate.toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                });

                // Format the date as "28 Mar"
                const formattedDate = observationDate.toLocaleString('en-US', {
                    day: 'numeric',
                    month: 'short'
                });

                // Combine the formatted time and date
                const formattedObservationTime = `${formattedTime} - ${formattedDate}`;
                document.getElementById('spriteDbId').innerText = name;
                document.getElementById('spriteTemp').innerText = data.value + '°C';  // Assuming randomData has a 'temp' property
                document.getElementById('spriteSetPoint').innerText = data.setpoint;  // Assuming randomData has a 'setpoint' property
                document.getElementById('spriteTime').innerText = formattedObservationTime;  // Assuming randomData has a 'time' property
                const elementsToHide = ['MSFabricsURL', 'BIReports', 'SpecificReport'];

                elementsToHide.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.style.display = 'none';  // Hide the link
                        element.previousElementSibling.style.display = 'none';  // Hide the label
                    }
                });
            }
            
        }

    }
    

    // Check if a panel already exists and remove it
    if (viewer.LiveDataPanel) {
        viewer.LiveDataPanel.setVisible(false);
        viewer.LiveDataPanel.uninitialize();
    }

    // Create a new panel with the title 'Service Task'
    viewer.LiveDataPanel = new LiveDataPanel(viewer, "Live Data", "Live Data", {});
}




// ---------------------------LIVE DATA PANEL-----------------------------------








// Declare the button globally so it can be accessed in other functions
let showLiveDataButton;

export function createToolbarLiveDataButton(viewer) {
    const toolbar = viewer.getToolbar();
    if (!toolbar) {
        console.error("Toolbar not found");
        return;
    }

    // Create a new toolbar button
    showLiveDataButton = new Autodesk.Viewing.UI.Button('showLiveDataButton');

    // Apply icon styling directly to the button's container
    const buttonContainer = showLiveDataButton.container;
    buttonContainer.style.backgroundImage = 'url(./images/graph.svg)';  // Set your icon image source here
    buttonContainer.style.backgroundColor = 'transparent';  // Make background transparent
    buttonContainer.style.backgroundSize = '25px';  // Adjust size of the background image
    buttonContainer.style.backgroundRepeat = 'no-repeat';  // Ensure no repeat of the image
    buttonContainer.style.backgroundPosition = 'center';  // Center the image inside the button

    showLiveDataButton.setToolTip('Live Data');  // Set the tooltip for the button

    // Define the action when the button is clicked
    showLiveDataButton.onClick = function() {
        if (viewer.LiveDataPanel) {
            viewer.LiveDataPanel.setVisible(!viewer.LiveDataPanel.isVisible());
        } else {
            showLiveDataPanel(viewer, []);  // Show panel even if no service tasks exist yet
        }
    };

    // Add the button to a new toolbar group
    let subToolbar = viewer.toolbar.getControl('myAppToolbar');
    if (!subToolbar) {
        subToolbar = new Autodesk.Viewing.UI.ControlGroup('myAppToolbar');
        toolbar.addControl(subToolbar);
    }
    subToolbar.addControl(showLiveDataButton);

    // Call this function once the viewer is fully initialized
    viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, function() {
        createToolbarButton(viewer);
    });
}











// -------------------------------LIVE DATA LIST PANEL-----------------------------------





// Function to create and display a docking panel
export async function showLiveDataListPanel(viewer) {
    // Load 'Autodesk.DataVisualization' and store it as a variable for later use
    const dataVizExtn = await viewer.loadExtension("Autodesk.DataVisualization");
    // Create a custom Docking Panel class
    class LiveDataListPanel extends Autodesk.Viewing.UI.DockingPanel {
        constructor(viewer, title, options) {
            super(viewer.container, title, options); 
            
            // Set the panel styles
            this.container.style.top = "10px";
            this.container.style.left = "10px";
            this.container.style.width = "250px";
            this.container.style.height = "250px";
            this.container.style.resize = "auto";
            this.container.style.backgroundColor = '#333';
            this.container.style.title = 'Live Data List';
    
            // Create and configure the scroll container
            this.createScrollContainer();

            // Declare class-level variables for sprites
            this.heatmapSprites = null;
            this.lightsSprites = null;
        }
    
        // Create the content of the panel
        createScrollContainer() {
            this.scrollContainer = document.createElement('div');
            this.scrollContainer.style.overflow = 'auto';
            this.scrollContainer.style.padding = '1em';
            this.scrollContainer.style.height = '100%';
            this.container.appendChild(this.scrollContainer);
    
            // Create the panel content with toggle functionality
            this.createPanelContent();
        }
    
        // Create the content inside the scroll container
        createPanelContent() {
            const dataViews = [
                { id: 'temperatureView', label: 'Temperature View' },
                { id: 'occupancyView', label: 'Occupancy View' },
                { id: 'alarmsView', label: 'Alarms View' },
                { id: 'lightsView', label: 'Lights View' }
            ];
        
            // Store references to all the checkboxes in an array
            const checkboxes = [];
        
            // Loop through the dataViews array and create elements
            dataViews.forEach(item => {
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.justifyContent = 'space-between';
                container.style.marginBottom = '10px';  // Space between elements
        
                // Create the label for the view
                const label = document.createElement('label');
                label.innerText = item.label;
        
                // Create the checkbox toggle
                const toggle = document.createElement('input');
                toggle.type = 'checkbox';  // Using checkbox as a toggle
                toggle.checked = false;  // Default is unchecked (invisible by default)
                toggle.id = item.id;  // Set the id to the item's id (e.g., 'temperatureView')
        
                // Store the reference of the checkbox in the array
                checkboxes.push(toggle);
        
                // Add event listener for toggle action
                toggle.addEventListener('change', () => {
                    // When checkbox is unchecked
                    if (!toggle.checked) {
                        this.hideDataOnModel(item.id);  // Call hideDataOnModel when checkbox is unchecked
                    }
        
                    if (toggle.checked) {
                        // Uncheck all other checkboxes
                        checkboxes.forEach(cb => {
                            if (cb !== toggle) {
                                cb.checked = false;  // Uncheck other checkboxes
                                this.hideDataOnModel(cb.id);  // Call hideDataOnModel for unchecked checkboxes
                            }
                        });
                    }
        
                    this.toggleLiveDataView(item.id, toggle.checked);  // Call the method when checkbox is changed
                });
        
                // Append the label and toggle to the container
                container.appendChild(label);
                container.appendChild(toggle);
        
                // Append the container to the scroll container
                this.scrollContainer.appendChild(container);
            });
        }
        
        
    
        // Method to handle toggling of data views
        toggleLiveDataView(viewId, isVisible) {
            if (isVisible) {
                console.log(viewId + ' is now visible');
                // Logic to show the live data view in the viewer
                this.showDataOnModel(viewId);
            } else {
                console.log(viewId + ' is now hidden');
                // Logic to hide the live data view from the viewer
                this.hideDataOnModel(viewId);
            }
        }

         // Example method to show live data on the model
         showDataOnModel(viewId) {
            let selectedFloor = -1;
            let LiveData = localStorage.getItem('LiveData');
            console.log(LiveData);
            if (viewId === 'temperatureView') {
                 if (LiveData === 'DB8') {
                    HEATMAP(viewer, selectedFloor); // HEATMAP will be called
                    this.heatmapSprites = SPRITES(viewer, selectedFloor); // Save heatmap sprites for later use
                    // Create the toolbar button only if it hasn't been created yet
                    if (!showLiveDataButton) {
                        createToolbarLiveDataButton(viewer);
                    }

                    // Show the button
                    if (showLiveDataButton && showLiveDataButton.container) {
                        showLiveDataButton.container.style.display = 'block';  // Show the button
                    }
                 }else if (LiveData === 'HG62') {
                    console.log('HG62');
                    HG62HEATMAP(viewer, selectedFloor); // HEATMAP will be called
                    this.heatmapSprites = HG62SPRITES(viewer, selectedFloor); // Save heatmap sprites for later use
                    // Create the toolbar button only if it hasn't been created yet
                    if (!showLiveDataButton) {
                        createToolbarLiveDataButton(viewer);
                    }

                    // Show the button
                    if (showLiveDataButton && showLiveDataButton.container) {
                        showLiveDataButton.container.style.display = 'block';  // Show the button
                    }
                 }
                
            } else if (viewId === 'lightsView') {
                if (LiveData === 'DB8') {
                    this.lightsSprites = LightSPRITES(viewer); // Save light sprites for later use
                }
                
            }
            // Implement similar logic for other data views
        }

       // Example method to hide live data from the model
        hideDataOnModel(viewId) {
            let LiveData = localStorage.getItem('LiveData');
            if (viewId === 'temperatureView') {
                if (LiveData === 'DB8' || LiveData === 'HG62') {
                    dataVizExtn.removeSurfaceShading();  // Remove surface shading
                    // dataVizExtn.removeAllViewables();
                    // Ensure the button is defined and exists before trying to hide it
                    if (showLiveDataButton && showLiveDataButton.container) {
                        showLiveDataButton.container.style.display = 'none';  // Hide the button
                    } else {
                        console.error('showLiveDataButton is not defined or does not have a container');
                    }
                }
                // Optionally hide heatmap sprites if needed
                dataVizExtn.showHideViewables(false, false, this.heatmapSprites); //16
            } else if (viewId === 'lightsView') {
                if (LiveData === 'DB8') {
                    // Check if lightsSprites is iterable (like an array)
                    dataVizExtn.showHideViewables(false, false, this.lightsSprites);
                }
            
            }
            // Implement similar logic for other data views
        }

        // Method to handle changes in the selected floor
        changedfloor(viewer, selectedFloor) {
            const temperatureCheckbox = document.getElementById('temperatureView').checked;
            let LiveData = localStorage.getItem('LiveData');
            console.log('Changed floor to:', selectedFloor, 'Live Data: ', LiveData);
            if (temperatureCheckbox && LiveData === 'DB8') {
                HEATMAP(viewer, selectedFloor);
            } else if (temperatureCheckbox && LiveData === 'HG62') {
                HG62HEATMAP(viewer, selectedFloor);
            }
        }
    }

    // Check if a panel already exists and remove it
    if (viewer.LiveDataListPanel) {
        viewer.LiveDataListPanel.setVisible(false);
        viewer.LiveDataListPanel.uninitialize();
    }

    // Create a new panel with the title 'Live Data List'
    viewer.LiveDataListPanel = new LiveDataListPanel(viewer, "Live Data List", "Live Data List", {});
}




// -------------------------------LIVE DATA LIST PANEL-----------------------------------





// Function to create a toolbar button
export function createToolbarLiveDataListButton(viewer) {
    const toolbar = viewer.getToolbar();
    if (!toolbar) {
        console.error("Toolbar not found");
        return;
    }

    // Create a new toolbar button
    const button = new Autodesk.Viewing.UI.Button('showLiveDataListButton');

    // Apply icon styling directly to the button's container
    const buttonContainer = button.container;
    buttonContainer.style.backgroundImage = 'url(./images/graph.svg)';  // Set your icon image source here
    buttonContainer.style.backgroundColor = 'transparent';  // Make background transparent
    buttonContainer.style.backgroundSize = '30px';  // Adjust size of the background image
    buttonContainer.style.backgroundRepeat = 'no-repeat';  // Ensure no repeat of the image
    buttonContainer.style.backgroundPosition = 'center';  // Center the image inside the button

    button.setToolTip('Live Data Views');  // Set the tooltip for the button

    // Define the action when the button is clicked
    button.onClick = function() {
        if (viewer.LiveDataListPanel) {
            viewer.LiveDataListPanel.setVisible(!viewer.LiveDataListPanel.isVisible());
        } else {
            showLiveDataPanel(viewer, []);  // Show panel even if no service tasks exist yet
        }
    };

    // Add the button to a new toolbar group
    let subToolbar = viewer.toolbar.getControl('myAppToolbar');
    if (!subToolbar) {
        subToolbar = new Autodesk.Viewing.UI.ControlGroup('myAppToolbar');
        toolbar.addControl(subToolbar);
    }
    subToolbar.addControl(button);

    // Call this function once the viewer is fully initialized
    viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, function() {
        createToolbarButton(viewer);
    });
}