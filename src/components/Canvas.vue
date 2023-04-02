<template>
    <canvas id="main-canvas"/>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import paper from "paper";

    import type { StageBaseObject } from "../stageObjects/StageBaseObject";

    export default defineComponent({
        data: () => ({ 
            dragging: false,
            tool: new paper.Tool(),
            objects: new Map<number, StageBaseObject>(),
            lastId: 0
        }),

        methods: {
            updateCanvas() {
                paper.project.clear();
                for (const object of this.objects.values()) {       
                    object.draw();
                }
            },

            addObject(object: StageBaseObject): number {
                const id = this.lastId++;
                this.objects.set(id, object);
                return id;
            },

            getObject(id: number): StageBaseObject | undefined {
                return this.objects.get(id);
            },

            removeObject(id: number) {
                this.objects.delete(id);
            },

            clearObjects() {
                this.objects.clear();
            },

            setMouseActions() {     
                const hitOptions = {
                    segments: true,
                    stroke: true,
                    fill: true,
                    tolerance: 5,

                };

                this.tool.onMouseDown = (event: any) => {
                    // only left mouse button
                    if (event.event.button != 0) return;

                    const hitResult = paper.project.hitTest(event.point, hitOptions);
                    if (hitResult) return;

                    this.dragging = true;
                }

                this.tool.onMouseDrag = (event: any) => {
                    if (event.event.button != 0) return;
                    if(!this.dragging) return;

                    const delta = event.downPoint.subtract(event.point);
                    paper.view.translate(delta.multiply(-1));
                    this.updateCanvas();
                }

                this.tool.onMouseUp = (event: any) => {
                    if (event.event.button != 0) return;
                    this.dragging = false;
                }

                // detect scroll inside the canvas (scroll down = zoom out)
                const canvas = document.getElementById("main-canvas") as HTMLDivElement;

                canvas.addEventListener("wheel", (event: any) => {
                    event.preventDefault();
                    const max = 5;
                    const min = 1/max;

                    // zoom in/out
                    const delta = -1*event.deltaY;
                    const zoom = 1 + delta/1000;

                    // clamp the zoom
                    const newZoom = Math.min(Math.max(paper.view.zoom*zoom, min), max);

                    if (newZoom == paper.view.zoom) return;

                    paper.view.zoom = newZoom;
                    
                    // move the view to the mouse position
                    const mouse = paper.view.getEventPoint(event);
                    const center = paper.view.center;
                    const offset = mouse.subtract(center);
                    paper.view.center = center.add(offset.multiply(zoom - 1));

                    this.updateCanvas();
                });
            }
        },

        mounted() {
            // resize the canvas to the size of the container
            const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
            canvas.width = parseInt(canvas.style.width);
            canvas.height = parseInt(canvas.style.height);

            paper.setup("main-canvas");
            
            this.setMouseActions();
            this.updateCanvas();
        },
    });
</script>

<style scoped>
    #main-canvas {
        width: inherit;
        height: inherit;
        background-color: #181818;
    }
</style>
