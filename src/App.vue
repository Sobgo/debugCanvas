<template>
    <div class="center">
        <div id="left_panel">
            <span style="color: white; margin-top: 16px; margin-bottom: -16px">Number of cells:</span>
            <input type="range" min="0" max="100" v-model="square_count" class="panel_button" style="margin: 0">
            <span style="color: white; margin-top: -16px">{{ square_count }}</span>
            <button class="panel_button" id="reset_button" @click="reset">reset</button>
            <button class="panel_button" id="draw_button" @click="download">Download svg</button>
        </div>
        <div id="canvas_wrapper">
            <Stage ref="stage"/>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import paper from "paper";
    import { default as Stage } from "./components/Canvas.vue";
    import { stageArray } from "./painters/array";

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
            square_count: 70,
        }),
        methods: {
            reset() {
                paper.view.center = new paper.Point(250, 250);
                this.square_count = 70;
                paper.view.zoom = 1;
                this.update();
            },

            update() {
                // @ts-ignore
                const stage = this.$refs.stage as Stage;

                stage.clearObjects();
                stage.addObject(new stageArray(randArray(this.square_count), { 
                    position: {x: 50, y: 50}, 
                    cell_size: 40, 
                    wrap_count: 10
                }))
                stage.updateDrawing();
            },

            download() {
                var svg = paper.project.exportSVG({ asString: true });
                if (typeof svg !== "string") return;
                var blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
                
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = "image.svg";
                link.click();
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
    }
    .panel_button:active {
        transform: translateY(1px);
    }
</style>
