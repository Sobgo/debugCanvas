export class StageBaseObject {
    renderOptions: Record<string, any> = {
        position: { x: 0, y: 0 }
    };

    constructor(options: Record<string, any> = {}) {
        this.mergeOptions(options);
    }

    mergeOptions(options: Record<string, any>) {
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                this.renderOptions[key] = options[key];
            }
        }
    }

    draw() {
        return;
    }
}
