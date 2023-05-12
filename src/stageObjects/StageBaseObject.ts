import paper from 'paper';

export class StageBaseObject {
    protected _position: paper.Point;
    declare drawOptions: Record<string, any>;

    set position(position: paper.PointLike) {
        this._position = new paper.Point(position);
    }

    get position(): paper.Point {
        return this._position;
    }

    get center(): paper.Point {
        return this.position;
    }

    constructor(position: paper.PointLike, options?: Record<string, any>) {
        this._position = new paper.Point(position);
        this.drawOptions = options ?? {};
    }

    draw() {
        return new paper.Item();
    }
}
