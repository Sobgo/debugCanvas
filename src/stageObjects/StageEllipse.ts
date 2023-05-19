import paper from 'paper';
import type { ShapeOptions, Subset } from "./types";
import { StageBaseObject } from "./StageBaseObject";

export class StageEllipse extends StageBaseObject {
    declare drawOptions: Subset<ShapeOptions>;
    width: number;
    height: number;

    constructor(position: paper.PointLike, width: number, height: number, options?: Subset<ShapeOptions>) {
        super(position, options);
        this.width = width;
        this.height = height;
    }

    draw() {
        const position = this.position;
        const width = this.width;
        const height = this.height;

        const value = new paper.Path.Ellipse({ point: position, size: new paper.Size(width, height) });

        if (this.drawOptions?.stroke_color) value.strokeColor = new paper.Color(this.drawOptions.stroke_color);
        if (this.drawOptions?.fill_color) value.fillColor = new paper.Color(this.drawOptions.fill_color);

        return value;
    }
}
