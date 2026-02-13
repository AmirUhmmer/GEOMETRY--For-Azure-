let worksetData

export function workset(viewer) {
    extractWorkset(viewer, (worksets) => {
      worksetData = worksets;
      console.log("Extracted worksets:", worksetData);
    });
    createWorksetButton(viewer);
    showWorksetPanel(viewer);
}

// Declare the button globally so it can be accessed in other functions
let showWorksetButton;

//#region Workset Button
function createWorksetButton(viewer) {
  const toolbar = viewer.getToolbar();
  if (!toolbar) {
    console.error("Toolbar not found");
    return;
  }

  // Create a new toolbar button
  showWorksetButton = new Autodesk.Viewing.UI.Button(
    "showWorksetButton"
  );

  // Apply icon styling directly to the button's container
  const buttonContainer = showWorksetButton.container;
  buttonContainer.style.backgroundImage = "url(./images/levels.svg)"; // Set your icon image source here
  buttonContainer.style.backgroundColor = "transparent"; // Make background transparent
  buttonContainer.style.backgroundSize = "25px"; // Adjust size of the background image
  buttonContainer.style.backgroundRepeat = "no-repeat"; // Ensure no repeat of the image
  buttonContainer.style.backgroundPosition = "center"; // Center the image inside the button
  buttonContainer.style.filter = "invert(1)";
  buttonContainer.style.hoverColor = "#555"; // Optional: Add a hover effect

  showWorksetButton.setToolTip("Levels"); // Set the tooltip for the button

  // Define the action when the button is clicked
  showWorksetButton.onClick = function () {
    if (viewer.WorksetPanel) {
      viewer.WorksetPanel.setVisible(
        !viewer.WorksetPanel.isVisible()
      );
    } else {
      showWorksetPanel(viewer); // Show panel even if no service tasks exist yet
    }
  };

  // Add the button to a new toolbar group
  let subToolbar = viewer.toolbar.getControl("myAppToolbar");
  if (!subToolbar) {
    subToolbar = new Autodesk.Viewing.UI.ControlGroup("myAppToolbar");
    toolbar.addControl(subToolbar);
  }
  subToolbar.addControl(showWorksetButton);

  // Call this function once the viewer is fully initialized
  viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, function () {
    createToolbarRepeatingTaskButton(viewer);
  });
}
// #endregion: Workset Button Creation


// #region Workset Panel
// Function to create and display a docking panel
export function showWorksetPanel(viewer) {
  // Create a custom Docking Panel class
  class WorksetPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(viewer, title, options) {
      super(viewer.container, title, options);

      // Set the panel styles
      this.container.style.top = "10px";
      this.container.style.left = "10px";
      this.container.style.width = "300px";
      this.container.style.height = "325px";
      this.container.style.resize = "auto";
      this.container.style.backgroundColor = "#333";
      this.container.style.title = "Tasks";

      // Create and configure the scroll container
      this.createScrollContainer();
    }

    // Create the content of the panel
    createScrollContainer() {
      // Create the scroll container
      this.scrollContainer = document.createElement("div");
      this.scrollContainer.style.overflow = "auto";
      this.scrollContainer.style.padding = "1em"; // Add padding to the scroll container
      this.scrollContainer.style.height = "100%"; // Ensure it takes full panel height
      this.container.appendChild(this.scrollContainer); // Append the scroll container to the panel

      // Create and append elements to the scroll container
      this.createPanelContent();
    }

    // Create the content inside the scroll container
    createPanelContent() {
      // Loop through the taskArray and create elements for each task
    }
  }

  // Check if a panel already exists and remove it
  if (viewer.WorksetPanel) {
    viewer.WorksetPanel.setVisible(false);
    viewer.WorksetPanel.uninitialize();
  }

  // Create a new panel with the title 'Service Task'
  viewer.WorksetPanel = new WorksetPanel(
    viewer,
    "Workset",
    "Workset",
    {}
  );
}
// #endregion Workset Panel


// #region Extract Worksets
function extractWorkset(viewer, callback) {
  console.log('extracting worksets');

  const models = viewer.impl.modelQueue().getModels();
  const options = new Set();

  models.forEach((model) => {

    const instanceTree = model.getData().instanceTree;
    const rootId = instanceTree.getRootId();

    instanceTree.enumNodeChildren(rootId, function collect(dbId) {

      model.getProperties(dbId, (props) => {

        const workset = props.properties.find(
          p => p.displayName === "Workset"
        );

        if (
          workset &&
          workset.displayValue &&
          workset.displayValue.toLowerCase().includes("level")
        ) {
          options.add(workset.displayValue);
        }

        instanceTree.enumNodeChildren(dbId, collect);
      });

    });

  });

  setTimeout(() => callback([...options]), 1000);
}
// #endregion