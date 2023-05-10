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
