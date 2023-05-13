export type Subset<T> = {
    [P in keyof T]?: T[P];
};

export type ShapeOptions = {
    stroke_color: string;
    fill_color: string | null;
};

export type LabelOptions = {
    font_size: number;
    font_color: string;
    justification: string;
};

export type ContainerOptions = {
    wrap_count: number;
    size: number;
    aspect_ratio: "fit" | "square" | "longest";
};
