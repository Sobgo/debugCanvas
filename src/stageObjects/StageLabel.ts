import paper from 'paper';
import type { LabelOptions, Subset } from "./types";
import { StageBaseObject } from "./StageBaseObject";

export class StageLabel extends StageBaseObject {
    declare drawOptions: Subset<LabelOptions>;
    text: string;

    constructor(position: paper.PointLike, text: string, options?: Subset<LabelOptions>) {
        super(position, options);
        this.text = text;
    }

    draw() {
        const position = this.position;
    
        const value = new paper.PointText(position);
        value.content = this.text;
        value.fontFamily = "monospace"
        
        if (this.drawOptions?.font_size) value.fontSize = this.drawOptions.font_size;
        if (this.drawOptions?.font_color) value.fillColor = new paper.Color(this.drawOptions.font_color);
        if (this.drawOptions?.justification) value.justification = this.drawOptions.justification;

        return value;
    }
}
