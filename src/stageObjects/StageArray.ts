import paper from 'paper';
import { StageBaseObject } from './StageBaseObject';

/**
 * __position__ - Position of the top left corner of the first cell in the array  
 * __wrap_count__ - Number of cells in a row  
 * __cell_size__- Size of a single cell (both width and height)  
 * __font_size__ - Size of the font used to display the index and value  
 */
export type StageArrayOptions = {
    position?: { x: number, y: number } | paper.Point;
    wrap_count?: number;
    cell_size?: number;
    font_size?: number;
};

export class StageArray extends StageBaseObject {
    private data: any[];

    renderOptions = {
        position: { x: 0, y: 0 },
        wrap_count: 1,
        cell_size: 20,
        font_size: 10
    };

    set position(position: { x: number, y: number }) {
        this.renderOptions.position = position;
    }

    /**
     * @param data - Array of data to be displayed. Data must heve a toString() method
     * @param options - Options for rendering (see StageArrayOptions)
     */
    constructor(data: any[], options: StageArrayOptions = {}) {
        super(options);

        this.data = data;
        this.renderOptions.wrap_count = data.length;

        this.mergeOptions(options);
    }

    draw() {
        const wrap_count = this.renderOptions.wrap_count;
        const cell_size = this.renderOptions.cell_size;
        const font_size = this.renderOptions.font_size;

        const origin = new paper.Point(this.renderOptions.position);
        const group = new paper.Group();
        
        this.data.map((item, index) => {
            // Calculate cell position (top left corner)
            const x = origin.x + (index%wrap_count) * cell_size;
            const y = origin.y + Math.floor(index/wrap_count) * (cell_size + 1.5*font_size);

            // Draw cell
            const cornerAnchor = new paper.Point(x, y);
            const cell = new paper.Path.Rectangle(cornerAnchor, new paper.Size(cell_size, cell_size));

            cell.strokeColor = new paper.Color("white");
            group.addChild(cell);

            // Draw cell value
            const valueAnchor = cornerAnchor.add(new paper.Point(cell_size/2, cell_size/2 + font_size/3));
            const value = new paper.PointText(valueAnchor);

            value.justification = "center";
            value.fillColor = new paper.Color("white");
            value.fontSize = font_size;
            value.content = item.toString()
            group.addChild(value);

            // Draw cell label
            const labelAnchor = cornerAnchor.add(new paper.Point(cell_size/2, cell_size + font_size));
            const label = new paper.PointText(labelAnchor);

            label.justification = "center"
            label.fillColor = new paper.Color("white")
            label.fontSize = font_size;
            label.content = index.toString();
            group.addChild(label);
        });

        // add invisible rectangle to make dragging easier
        const rect = new paper.Path.Rectangle(group.bounds);
        rect.fillColor = new paper.Color("white");
        rect.opacity = 0;
        group.addChild(rect);

        group.onMouseDrag = (event: any) => {
            group.position = group.position.add(event.delta);
            this.position = group.bounds.topLeft;
        }
    }
}
