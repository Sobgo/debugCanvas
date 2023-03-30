import paper from 'paper';
import { stageObject } from './object';

type ArrayOptions = {
    position?: { x: number, y: number };
    wrap_count?: number;
    cell_size?: number;
    font_size?: number;
};

export class stageArray extends stageObject {
    data: any[];
    options = {
        position: { x: 0, y: 0 },
        wrap_count: 1,
        cell_size: 20,
        font_size: 10
    }

    constructor(data: any[], options: ArrayOptions = {}) {
        super();
        this.data = data;
        this.options.wrap_count = data.length;

        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                // @ts-ignore
                this.options[key] = options[key];
            }
        }
    }

    draw() {
        const X = this.options.position?.x;
        const Y = this.options.position?.y;
        const wrap_count = this.options.wrap_count;
        const square_size = this.options.cell_size;
        const font_size = this.options.font_size;

        for (let i = 0; i < this.data.length; ++i) {
            // cell
            const origin = new paper.Point(X + i % wrap_count * square_size, Y + Math.floor(i/wrap_count) * (square_size + 1.5*font_size));
            const square = new paper.Path.Rectangle(origin, new paper.Size(square_size, square_size))
            square.strokeColor = new paper.Color("white")

            // label
            const label = new paper.PointText(origin.add(new paper.Point(square_size/2, square_size + font_size)))
            label.justification = "center"
            label.fillColor = new paper.Color("white")
            label.content = i.toString()

            // cell value
            const value = new paper.PointText(origin.add(new paper.Point(square_size/2, square_size/2 + font_size/3)))
            value.justification = "center"
            value.fillColor = new paper.Color("white")
            value.content = this.data[i].toString()
        }
    }
}