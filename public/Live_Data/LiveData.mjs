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
        updateSpriteInfo(name, data) {
            document.getElementById('spriteDbId').innerText = name;
            document.getElementById('spriteTemp').innerText = data[0].value + '°C';  // Assuming randomData has a 'temp' property
            document.getElementById('spriteTime').innerText = data[0].observationTime;  // Assuming randomData has a 'time' property
            const specificReportLink = this.container.querySelector('#SpecificReport');  // Select the hyperlink with the ID 'SpecificReport'
            if (specificReportLink) {
                specificReportLink.href = 'https://app.powerbi.com/reportEmbed?reportId=f6f9c99d-e70d-4a97-94dc-375d0d0a9af7&autoAuth=true&ctid=ead65215-ebfd-4a8d-9e73-b403a85a7e04&filter=RelynkIdentifier0711%2Fpoint_name+eq+%27Current%27+and+RelynkIdentifier0711%2Fis_point_of_furniture_name+eq+%27' + name + '%27';
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





// Function to create a toolbar button
export function createToolbarLiveDataButton(viewer) {
    const toolbar = viewer.getToolbar();
    if (!toolbar) {
        console.error("Toolbar not found");
        return;
    }

    // Create a new toolbar button
    const button = new Autodesk.Viewing.UI.Button('showLiveDataButton');

    // Apply icon styling directly to the button's container
    const buttonContainer = button.container;
    buttonContainer.style.backgroundImage = 'url(./images/graph.svg)';  // Set your icon image source here
    buttonContainer.style.backgroundColor = 'transparent';  // Make background transparent
    buttonContainer.style.backgroundSize = '25px';  // Adjust size of the background image
    buttonContainer.style.backgroundRepeat = 'no-repeat';  // Ensure no repeat of the image
    buttonContainer.style.backgroundPosition = 'center';  // Center the image inside the button

    button.setToolTip('Live Data');  // Set the tooltip for the button

    // Define the action when the button is clicked
    button.onClick = function() {
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
    subToolbar.addControl(button);

    // Call this function once the viewer is fully initialized
    viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, function() {
        createToolbarButton(viewer);
    });
}


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
    buttonContainer.style.backgroundImage = 'url(./images/task.svg)';  // Set your icon image source here
    buttonContainer.style.backgroundColor = 'transparent';  // Make background transparent
    buttonContainer.style.backgroundSize = '30px';  // Adjust size of the background image
    buttonContainer.style.backgroundRepeat = 'no-repeat';  // Ensure no repeat of the image
    buttonContainer.style.backgroundPosition = 'center';  // Center the image inside the button

    button.setToolTip('Live Data Views');  // Set the tooltip for the button

    // Define the action when the button is clicked
    // button.onClick = function() {
    //     if (viewer.LiveDataListPanel) {
    //         viewer.LiveDataListPanel.setVisible(!viewer.LiveDataListPanel.isVisible());
    //     } else {
    //         showLiveDataPanel(viewer, []);  // Show panel even if no service tasks exist yet
    //     }
    // };

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