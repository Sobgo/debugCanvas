import type { StageBaseObject } from "./StageBaseObject";
import paper from 'paper';

export class StageDragable {
    private group = new paper.Group();
    private object;

    get stageObject(): StageBaseObject {
        return this.object;
    }

    constructor(object: StageBaseObject) {
        this.object = object;

        this.group.onMouseDrag = (event: paper.MouseEvent) => {
            this.group.position = this.group.position.add(event.delta);
            this.object.position = this.group.bounds;
        };
    }

    draw() {
        this.group.removeChildren();

        this.group.addChild(this.object.draw());
        this.group.position = this.object.center;

        return this.group;
    }
}
