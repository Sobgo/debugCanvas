export type Subset<T> = {
    [P in keyof T]?: T[P];
};

export type ShapeOptions = {
    stroke_color: string;
    fill_color: string;
};

export type LabelOptions = {
    font_size: number;
    font_color: string;
    justification: string;
    align: "top" | "center" | "bottom" | string;
};

export type ContainerOptions = {
    wrap_count: number;
    size: number;
    aspect_ratio: "fit" | "square" | "longest" | string;
};
