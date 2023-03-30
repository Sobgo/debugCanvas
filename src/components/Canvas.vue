<template>
    <canvas id="main-canvas" style="width: inherit; height: inherit;"></canvas>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import paper from "paper";
    import type { stageObject } from "../painters/object";

    export default defineComponent({
        data: () => ({ 
            dragging: false,
            tool: new paper.Tool(),
            objects: [] as stageObject[]
        }),

        methods: {
            updateDrawing() {
                paper.project.clear()

                // dark background
                new paper.Shape.Rectangle({
                    rectangle: paper.view.bounds,
                    fillColor: new paper.Color("#181818")
                });

                for (const object of this.objects) {
                    object.draw()
                }
            },

            addObject(object: stageObject) {
                this.objects.push(object)
            },

            clearObjects() {
                this.objects = []
            }
        },

        mounted() {
            // resize the canvas to the size of the container
            const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
            canvas.width = parseInt(canvas.style.width);
            canvas.height = parseInt(canvas.style.height);

            paper.setup("main-canvas");

            this.updateDrawing();

            this.tool.onMouseDown = (event: any) => {
                // only left mouse button
                if (event.event.button != 0) return;

                // set the cursor to move
                document.body.style.cursor = "move"
                this.dragging = true
            }

            this.tool.onMouseDrag = (event: any) => {
                if(!this.dragging) return;

                const delta = event.downPoint.subtract(event.point)
                paper.view.translate(delta.multiply(-1))
            }

            this.tool.onMouseUp = (event: any) => {
                if (event.event.button != 0) return;
                this.dragging = false;
                // reset the cursor
                document.body.style.cursor = "default";
                this.updateDrawing();
            }

            // detect scroll inside the canvas (scroll down = zoom out)
            const canvas_wrapper = document.getElementById("canvas_wrapper") as HTMLDivElement;
            canvas_wrapper.addEventListener("wheel", (event: any) => {
                const max = 5;
                const min = 1/max;
                // zoom in/out
                const delta = event.deltaY * -1;
                const zoom = 1 + delta / 1000;
                if (paper.view.zoom * zoom > max || paper.view.zoom * zoom < min) return;
                paper.view.zoom *= zoom;

                // move the view to the mouse position
                const mouse = paper.view.getEventPoint(event);
                const center = paper.view.center;
                const offset = mouse.subtract(center);
                paper.view.center = center.add(offset.multiply(zoom - 1));

                event.preventDefault();
                this.updateDrawing();
            });

        }
    });
</script>
