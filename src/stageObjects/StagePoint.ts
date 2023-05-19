import paper from 'paper';
import { StageBaseObject } from "./StageBaseObject";
import { StageLabel } from "./StageLabel";

export class StagePoint extends StageBaseObject {
    private group = new paper.Group();
    text: string;
    
    constructor(position: paper.PointLike, text: string) {
        super(position);
        this.text = text;
    }

    draw() {
        this.group.removeChildren();
        const position = this.position;

        const value = new paper.Path.Circle(position, 3);
        value.fillColor = new paper.Color('white');
        value.strokeColor = new paper.Color('white');

        const label = new StageLabel(position.add([0, 5]),
            this.text, { font_size: 6, font_color: "white", align: "top", justification: "left" });
    
        this.group.addChildren([value,  label.draw()]);
        return this.group;
    }
}