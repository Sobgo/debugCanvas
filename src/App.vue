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

    import Stage from "./components/Stage.vue";
    import { StageArray } from "./stageObjects/StageArray";
import { StageLabel } from "./stageObjects/StageLabel";

    const randomString = (length: number) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        for (let i = 0; i < length; ++i) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    const randArray = (size: number, str_len: number) => {
        const arr = [];
        for (let i = 0; i < size; ++i) {
            arr.push(randomString(Math.floor(Math.random() * (str_len - 1)) + 1));
        }
        return arr;
    }

    export default defineComponent({
        components: { Stage },

        data: () => ({ 
            dragging: false,
            square_count: '20',
            cell_size: '30',
            wrap_count: '5',
            arrays: [] as StageArray[]
        }),

        methods: {
            reset() {
                paper.view.center = new paper.Point(250, 250);
                paper.view.zoom = 1;

                this.square_count = '20';
                this.cell_size = '30';
                this.wrap_count = '5';

                const stage = this.$refs.stage as any;

                stage.clearObjects();
                this.arrays = [];

                this.arrays.push(new StageArray(
                    { x: 30, y: 60 }, 
                    randArray(parseInt(this.square_count), 10),
                    { size: parseInt(this.cell_size), wrap_count: parseInt(this.wrap_count), aspect_ratio: "longest" }
                ));

                this.arrays.push(new StageArray(
                    { x: 50, y: 280 }, 
                    randArray(parseInt(this.square_count), 15),
                    { size: parseInt(this.cell_size), wrap_count: parseInt(this.wrap_count) }
                ));

                for (const array of this.arrays) {
                    stage.addObject(array);
                }

                stage.addObject(new StageLabel(
                    { x: 50, y: 30 },
                    "Test",
                    { font_size: 20, font_color: "red" }
                ));

                this.update();
            },

            update() {
                const stage = this.$refs.stage as any;

                for (const array of this.arrays) {
                    if (array.data.length != parseInt(this.square_count)) {
                        const diff = array.data.length - parseInt(this.square_count);

                        if (diff > 0) {
                            array.data.splice(parseInt(this.square_count), diff);
                        } else {
                            array.data.push(...randArray(-diff, 15));
                        }
                    }
                    
                    array.drawOptions.size = parseInt(this.cell_size);
                    array.drawOptions.wrap_count = parseInt(this.wrap_count);
                }


                stage.updateCanvas();
            },

            download(type: "svg" | "pdf") {
                const stage = this.$refs.stage as any;
                stage.download(type);
            }
        },

        updated() {
            this.update();
        },

        mounted() {
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
