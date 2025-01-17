// Function to create and display a docking panel
export function showServiceTasksDockingPanel(viewer, serviceTaskList) {

    // Create a custom Docking Panel class
    class ServiceTasksPanel extends Autodesk.Viewing.UI.DockingPanel {
        constructor(viewer, title, options) {
            super(viewer.container, title, options);  // Fixed the title to "Service Task"
            this.container.style.top = "10px";
            this.container.style.left = "10px";
            this.container.style.width = "300px";
            this.container.style.height = "400px";
            this.container.style.resize = "auto";
            this.container.style.backgroundColor = '#333';
            this.container.style.title = 'Service Task'
            this.createScrollContainer();
        }

        // Create the content of the panel
        createScrollContainer() {
            const content = document.createElement('div');
            content.classList.add('docking-panel-content');

            const taskListElement = document.createElement('ul');
            serviceTaskList.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.textContent = task;
                taskListElement.appendChild(taskItem);
            });

            content.appendChild(taskListElement);
            this.container.appendChild(content);
        }
    }

    // Check if a panel already exists and remove it
    if (viewer.serviceTasksPanel) {
        viewer.serviceTasksPanel.setVisible(false);
        viewer.serviceTasksPanel.uninitialize();
    }

    // Create a new panel with the title 'Service Task'
    viewer.serviceTasksPanel = new ServiceTasksPanel(viewer, "Service Task", "Service Task", {});
    viewer.serviceTasksPanel.setVisible(true);
}



// Function to create a toolbar button
export function createToolbarButton(viewer) {
    const toolbar = viewer.getToolbar();
    if (!toolbar) {
        console.error("Toolbar not found");
        return;
    }

    // Create a new toolbar button
    const button = new Autodesk.Viewing.UI.Button('showServiceTasksButton');

    // Apply icon styling directly to the button's container
    const buttonContainer = button.container;
    buttonContainer.style.backgroundImage = 'url(./images/task.svg)';  // Set your icon image source here
    buttonContainer.style.backgroundSize = '30px';  // Adjust size of the background image
    buttonContainer.style.backgroundRepeat = 'no-repeat';  // Ensure no repeat of the image
    buttonContainer.style.backgroundPosition = 'center';  // Center the image inside the button

    button.setToolTip('Service Tasks');

    // Define the action when the button is clicked
    button.onClick = function() {
        if (viewer.serviceTasksPanel) {
            viewer.serviceTasksPanel.setVisible(!viewer.serviceTasksPanel.isVisible());
        } else {
            showServiceTasksDockingPanel(viewer, []);  // Show panel even if no service tasks exist yet
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

