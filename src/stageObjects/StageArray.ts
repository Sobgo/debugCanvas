import paper from 'paper';
import { StageBaseObject } from "./StageBaseObject";
import { StageLabel } from "./StageLabel";
import { StageRect } from "./StageRect";
import type { ContainerOptions, Subset } from "./types";

export class StageArray extends StageBaseObject {
    private group = new paper.Group();
    declare drawOptions: Subset<ContainerOptions>;
    data: any[];

    set position(position: paper.PointLike) {
        this.group.position = new paper.Point(position).add(
            new paper.Point(this.group.bounds.width/2, this.group.bounds.height/2)
        );

        this._position = this.group.bounds.topLeft;
    }

    get position(): paper.Point {
        return this._position;
    }

    get center(): paper.Point {
        return this.group.position;
    }
    
    constructor(position: paper.PointLike, data: any[], options?: Subset<ContainerOptions>) {
        super(position, options);

        this.position = position;
        this.data = data;
    }

    draw() {
        this.group.removeChildren();

        const origin = new paper.Point(this.position);
        const wrap_count = this.drawOptions?.wrap_count ?? this.data.length;
        const height = this.drawOptions?.size ?? 40;
        const font_size = height / 3;
        const font_height = font_size * 5/6;
        const margin = font_size;
       
        const aspect = this.drawOptions?.aspect_ratio ?? "fit";

        let width = height;
        if (aspect == "longest") {
            const longest = this.data.reduce((a, b) => a.toString().length > b.toString().length ? a : b);
            width = longest.toString().length * (font_size - 4) + margin * 2;
        }

        const textOptions = {
            font_size: font_size, 
            font_color: "white",
            justification: "center"
        };

        let totalRowLenght = 0;

        this.data.map((item, index) => {
            const text = item.toString();

            if (aspect == "fit") {
                width = Math.max(height, text.length * (font_size - 4) + margin * 2);
            }

            const x = origin.x + totalRowLenght;
            const y = origin.y + Math.floor(index / wrap_count) * (height + font_size * 1.6);

            const cell = new StageRect({x, y}, width, height, {
                stroke_color: "white" 
            });
            
            const value = new StageLabel({ 
                x: x + width/2, 
                y: y + height/2 + font_height/2
            }, text, textOptions);

            const label = new StageLabel({
                x: x + width/2, 
                y: y + height + font_height * 1.2
            }, index.toString(), textOptions);

            totalRowLenght += width;
            if (index % wrap_count == wrap_count - 1) totalRowLenght = 0;

            this.group.addChildren([cell.draw(), value.draw(), label.draw()]);
        });

        // add invisible rectangle to make dragging easier
        const rect = new paper.Path.Rectangle(this.group.strokeBounds);
        rect.fillColor = new paper.Color("white");
        rect.opacity = 0;
        this.group.addChild(rect);

        return this.group;
    }
}
