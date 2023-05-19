import paper from 'paper';
import { StageBaseObject } from "./StageBaseObject";

export class StageCollection extends StageBaseObject {
    private group = new paper.Group();
    private _dragable = false;

    data: StageBaseObject[];

    getObject(id: number): StageBaseObject {
        return this.data[id];
    }

    get dragable(): boolean {
        return this._dragable;
    }

    set dragable(value: boolean) {
        this._dragable = value;

        if (value) {
            this.group.onMouseDrag = (event: paper.MouseEvent) => {
                this.group.position = this.group.position.add(event.delta);
                this.position = this.position.add(event.delta);
            };
        } else {
            this.group.onMouseDrag = null;
        }
    }

    constructor(objects: StageBaseObject[], dragable = false) {
        super([0, 0], {});

        this.data = objects;
        this.dragable = dragable;
    }

    draw() {
        this.group.removeChildren();

        this.data.forEach((object) => {
            const obj = object.draw();
            // shift the position of the object to the position of the collection
            obj.position = obj.position.add(this.position);
            this.group.addChild(obj);
        });

        return this.group;
    }
}
