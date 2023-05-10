<template>
    <div class="center">
        <div id="left_panel">
            <div class="arrayPanel">
                <span class="label">Number of cells:</span>
                <input type="range" min="1" max="100" v-model="square_count" class="panel_button" style="margin: -16px 0px">
                <span class="label">{{ square_count }}</span>

                <span class="label">Cell size:</span>
                <input type="range" min="1" max="100" v-model="cell_size" class="panel_button" style="margin: -16px 0px">
                <span class="label">{{ cell_size }}</span>

                <span class="label">Label font size:</span>
                <input type="range" min="1" max="100" v-model="font_size" class="panel_button" style="margin: -16px 0px">
                <span class="label">{{ font_size }}</span>

                <span class="label">Wrap count:</span>
                <input type="range" min="1" max="100" v-model="wrap_count" class="panel_button" style="margin: -16px 0px">
                <span class="label">{{ wrap_count }}</span>
            </div>
            <button class="panel_button" id="reset_button" @click="reset">Reset</button>
            <button class="panel_button" id="draw_button" @click='download("svg")'>Download svg</button>
            <button class="panel_button" id="draw_button" @click='download("pdf")'>Download pdf</button>
        </div>
        <div id="canvas_wrapper">
            <Stage ref="stage"/>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import paper from "paper";
    import * as pdfMake from "pdfmake/build/pdfmake";

    // @ts-ignore fix for fonts
    import * as pdfFonts from "pdfmake/build/vfs_fonts"; pdfMake.vfs = pdfFonts.pdfMake.vfs;
    
    import { default as Stage } from "./components/Canvas.vue";
    import { StageArray } from "./stageObjects/StageArray";

    const randArray = (size: number) => {
        const arr = [];
        for (let i = 0; i < size; ++i) {
            arr.push(Math.floor(Math.random() * 100));
        }
        return arr;
    }

    export default defineComponent({
        components: { Stage },

        data: () => ({ 
            dragging: false,
            square_count: '20',
            cell_size: '30',
            font_size: '12',
            wrap_count: '5',
        }),

        methods: {
            reset() {
                paper.view.center = new paper.Point(250, 250);
                paper.view.zoom = 1;

                this.square_count = '20';
                this.cell_size = '30';
                this.font_size = '12';
                this.wrap_count = '5';

                this.update();
            },

            update() {
                const stage = this.$refs.stage as any;

                for (const object of stage.objects.values()) {
                    object.data = randArray(parseInt(this.square_count));
                    const opt = object.renderOptions;   
                    opt.cell_size = parseInt(this.cell_size),
                    opt.wrap_count = parseInt(this.wrap_count),
                    opt.font_size = parseInt(this.font_size)
                }

                stage.updateCanvas();
            },

            download(type: "svg" | "pdf" = "svg") {
                // add dark background with some padding
                const bounds = new paper.Rectangle(paper.project.activeLayer.strokeBounds);
                bounds.width += 20; bounds.x -= 10;
                bounds.height += 20; bounds.y -= 10;
                
                const rect = new paper.Path.Rectangle(bounds);
                rect.fillColor = new paper.Color('#181818');
                rect.sendToBack();

                const svg = paper.project.exportSVG({ asString: true, bounds: "content" });
                if (typeof svg !== "string") return;
                    
                if (type == "svg") {
                    const blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = "scene.svg";
                    link.click();
                } else if (type == "pdf") {
                    const docDefinition = {
                        pageSize: {
                            width: bounds.width,
                            height: bounds.height
                        },
                        pageMargins: 0,
                        content: [
                            {
                                svg: svg,
                                width: bounds.width,
                                height: bounds.height,
                            }
                        ]
                    };
                    pdfMake.createPdf(docDefinition).download("scene.pdf");
                }
            }
        },

        updated() {
            this.update();
        },

        mounted() {
            const stage = this.$refs.stage as any;

            stage.addObject(new StageArray(randArray(parseInt(this.square_count)), { 
                    position: {x: 50, y: 30}, 
                    cell_size: parseInt(this.cell_size),
                    wrap_count: parseInt(this.wrap_count),
                    font_size: parseInt(this.font_size)
                }));

            stage.addObject(new StageArray(randArray(parseInt(this.square_count)), { 
                position: {x: 250, y: 250}, 
                cell_size: parseInt(this.cell_size),
                wrap_count: parseInt(this.wrap_count),
                font_size: parseInt(this.font_size)
            }));

            this.reset();
        }
    });
</script>

<style scoped>
    .center {
        width: 100vw;
        height: 100vh;
        background-color: #181818;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .arrayPanel {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 10px;
    }

    .label {
        color: white;
        margin-top: 0px;
        margin-bottom: 0px;
    }

    #left_panel {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 500px;
        width: 250px;
        background-color: #202020;
        border-right: none;
        border-radius: 4px 0 0 4px;
        border: 1px solid #bbbbbb;
    }

    #canvas_wrapper {
        border-radius: 0 4px 4px 0;
        border: 1px solid #bbbbbb;
        border-left: none;
        width: 500px;
        height: 500px;
    }

    .panel_button {
        border: 1px solid #bbbbbb;
        margin-top: 10px;
        width: 200px;
        height: 50px;
        color:#bbbbbb;
        font-size: 20px;
        background-color: #181818;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .panel_button:hover {
        background-color: #303030;
        cursor: pointer;
    }

    .panel_button:active {
        transform: translateY(1px);
    }
</style>
