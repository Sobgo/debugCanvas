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
        const font_size = this.drawOptions?.font_size ?? 16;
        
        let position = this.position;
        
        if (this.drawOptions?.align === "center") {
            position = new paper.Point(position.x, position.y + font_size * 3/8);
        } else if (this.drawOptions?.align === "top") {
            position = new paper.Point(position.x, position.y + font_size * 3/4);
        }

        const value = new paper.PointText(position);

        value.content = this.text;
        value.fontFamily = "monospace"
        value.fontSize = font_size;

        if (this.drawOptions?.font_color) value.fillColor = new paper.Color(this.drawOptions.font_color);
        if (this.drawOptions?.justification) value.justification = this.drawOptions.justification;

        return value;
    }
}
