export function ToolbarButton2DFaro(viewer, modelAbbreviation) {
 const toolbar = viewer.getToolbar();
    if (!toolbar) {
        console.error("Toolbar not found");
        return;
    }

    // Create a new toolbar button
    showFaro2DPanel = new Autodesk.Viewing.UI.Button('showFaro2DPanel');

    // Apply icon styling directly to the button's container
    const buttonContainer = showFaro2DPanel.container;
    buttonContainer.style.backgroundImage = 'url(./images/eyeSprite.svg)';  // Set your icon image source here
    buttonContainer.style.backgroundColor = 'transparent';  // Make background transparent
    buttonContainer.style.backgroundSize = '32px';  // Adjust size of the background image
    buttonContainer.style.backgroundRepeat = 'no-repeat';  // Ensure no repeat of the image
    buttonContainer.style.backgroundPosition = 'center';  // Center the image inside the button

    showFaro2DPanel.setToolTip('Different Views');  // Set the tooltip for the button

    // Define the action when the button is clicked
    showFaro2DPanel.onClick = function() {
        if (viewer.Faro2DPanel) {
            viewer.Faro2DPanel.setVisible(!viewer.Faro2DPanel.isVisible());
        } else {
            showFaro2DPanel(viewer);  // Show panel even if no service tasks exist yet
        }
    };

    // Add the button to a new toolbar group
    let subToolbar = viewer.toolbar.getControl('myAppToolbar');
    if (!subToolbar) {
        subToolbar = new Autodesk.Viewing.UI.ControlGroup('myAppToolbar');
        toolbar.addControl(subToolbar);
    }
    subToolbar.addControl(showFaro2DPanel);

    // Call this function once the viewer is fully initialized
    viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, function() {
        createToolbarRepeatingTaskButton(viewer);
    });
}

// Function to create and display a docking panel
export function showFaro2DPanel(viewer) {
    // Create a custom Docking Panel class
    class Faro2DPanel extends Autodesk.Viewing.UI.DockingPanel {
      constructor(viewer, title, options) {
        super(viewer.container, title, options);
  
        // Set the panel styles
        this.container.style.top = "10px";
        this.container.style.left = "10px";
        this.container.style.width = "300px";
        this.container.style.height = "325px";
        this.container.style.resize = "auto";
        this.container.style.backgroundColor = '#333';
        this.container.style.title = 'Tasks';
  
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
        // Loop through the taskArray and create elements for each task
      }
    }
  
    // Check if a panel already exists and remove it
    if (viewer.Faro2DPanel) {
      viewer.Faro2DPanel.setVisible(false);
      viewer.Faro2DPanel.uninitialize();
    }
  
    // Create a new panel with the title 'Service Task'
    viewer.Faro2DPanel = new Faro2DPanel(viewer, "Different Views", "Different Views", {});

    // Show the panel by setting it to visible
    viewer.Faro2DPanel.setVisible(true);
}