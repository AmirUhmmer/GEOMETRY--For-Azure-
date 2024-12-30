// SpriteInfoPanel.js push test
export class SpriteInfoPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(extension, id, title, options) {
        super(extension.viewer.container, id, title, options);
        this.extension = extension;
        this.container.style.left = (options.x || 0) + 'px';
        this.container.style.top = (options.y || 0) + 'px';
        this.container.style.width = (options.width || 400) + 'px';  // Adjust width as needed
        this.container.style.height = (options.height || 200) + 'px'; // Adjust height as needed
        this.container.style.resize = 'none';
        this.container.style.zIndex = '1000';  // Ensure it’s on top
    }

    initialize() {
        this.title = this.createTitleBar(this.titleLabel || this.container.id);
        this.initializeMoveHandlers(this.title);
        this.container.appendChild(this.title);

        this.content = document.createElement('div');
        this.content.style.height = '100%';
        this.content.style.backgroundColor = 'white';
        this.content.style.padding = '1em';
        this.content.style.overflow = 'auto'; // For scrolling if needed
        this.content.innerHTML = `
            <h3>Clicked Sprite Information</h3>
            <p id="spriteInfo">Click a sprite to display its dbId here.</p>
        `;
        this.container.appendChild(this.content);
    }

    // Method to update the content of the panel with dbId
    updateSpriteInfo(dbId) {
        const spriteInfo = document.getElementById('spriteInfo');
        spriteInfo.textContent = `dbId: ${dbId}`;
    }
}
