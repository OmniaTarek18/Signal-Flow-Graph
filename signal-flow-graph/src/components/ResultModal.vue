<template>
    <div class="modal" :class="{ 'is-active': show }">
        <div class="modal-background" @click="close"></div>
        <div class="modal-content">
            <button class="modal-close" aria-label="close" @click="close">
                <span aria-hidden="true">&times;</span>
            </button>
            <div class="box">
                <h2 class="subtitle result-title"><span class="highlight">Solution</span></h2>
                <!-- dispalying the results -->
                <div v-if="result" class="result-container">
                    <p class="result-info" style="text-align: left;">
                        <span class="highlight">Total Gain:</span> <span style="color: black;">{{ result.totalGain
                            }}</span>
                    </p>

                    <div class="result-section" v-if="result.traversalArrays">
                        <hr>
                        <h3 class="subtitle section-title"><span class="highlight">Forward Paths</span></h3>
                        <ul class="result-list">
                            <li v-for="(path, index) in result.traversalArrays.forwardPaths" :key="index">P{{ index + 1
                                }}: {{ path }}</li>
                        </ul>
                    </div>
                    <div class="result-section" v-if="result.traversalArrays">
                        <hr>
                        <h3 class="subtitle section-title"><span class="highlight">Loops</span></h3>
                        <ul class="result-list">
                            <li v-for="(loop, index) in result.traversalArrays.loops" :key="index">L{{ index + 1 }}:
                                {{loop }}</li>
                        </ul>
                    </div>
                    <div class="result-section" v-if="result.traversalArrays">
                        <hr>
                        <h3 class="subtitle section-title"><span class="highlight">Non-Touching Loops</span></h3>
                        <ul class="result-list">
                            <li v-for="(ntLoop, index) in result.traversalArrays.nonTouchingLoops" :key="index">
                                Non-Touching Loop {{ index + 1 }}: {{ ntLoop }}</li>
                        </ul>
                    </div>
                    <div class="result-section" v-if="result.traversalArrays">
                        <hr>
                        <h3 class="subtitle section-title"><span class="highlight">Loops Not Touching Path</span></h3>
                        <ul class="result-list">
                            <li v-for="(loop, index) in result.traversalArrays.loopsNotTouchingPath" :key="index">Loop
                                not Touching Path{{ index + 1 }}: {{ loop }}</li>
                        </ul>
                    </div>
                    <div class="result-section" v-if="result.traversalArrays">
                        <hr>
                        <h3 class="subtitle section-title"><span class="highlight">Non-Touching Loops Not Touching
                                Path</span></h3>
                        <ul class="result-list">
                            <li v-for="(ntLoop, index) in result.traversalArrays.nonTouchingLoopsNotTouchingPath"
                                :key="index">Non-Touching Loop not Touching Path {{ index + 1 }}: {{ ntLoop }}</li>
                        </ul>
                    </div>
                    <div class="result-section" v-if="result.gainArrays">
                        <hr>
                        <h3 class="subtitle section-title"><span class="highlight">Gain of Forward Paths</span></h3>
                        <ul class="result-list">
                            <li v-for="(gain, index) in result.gainArrays.forwardPathsGain" :key="index">P{{ index + 1
                                }} Gain: {{ gain }}</li>
                        </ul>
                    </div>
                    <div class="result-section" v-if="result.gainArrays">
                        <hr>
                        <h3 class="subtitle section-title"><span class="highlight">Gain of Loops</span></h3>
                        <ul class="result-list">
                            <li v-for="(gain, index) in result.gainArrays.gainOfLoops" :key="index">L{{ index + 1 }}
                                Gain: {{ gain }}</li>
                        </ul>
                    </div>
                    <div class="result-section" v-if="result.gainArrays">
                        <hr>
                        <h3 class="subtitle section-title"><span class="highlight">Gain of Non-Touching Loops</span>
                        </h3>
                        <ul class="result-list">
                            <li v-for="(gain, index) in result.gainArrays.gainOfNonTouchingLoops" :key="index">
                                Non-Touching Loop {{ index + 1 }} Gain: {{ gain }}</li>
                        </ul>
                    </div>
                    <div class="result-section" v-if="result.gainArrays">
                        <hr>
                        <h3 class="subtitle section-title"><span class="highlight">Gain of Loops Not Touching
                                Path</span></h3>
                        <ul class="result-list">
                            <li v-for="(gain, index) in result.gainArrays.gainOfLoopsNotTouchingPath" :key="index">Loop
                                {{ index + 1 }} not Touching Path Gain: {{ gain }}</li>
                        </ul>
                    </div>
                    <div class="result-section" v-if="result.gainArrays">
                        <hr>
                        <h3 class="subtitle section-title"><span class="highlight">Gain of Non-Touching Loops Not
                                Touching Path</span></h3>
                        <ul class="result-list">
                            <li v-for="(gain, index) in result.gainArrays.gainOfNonTouchingLoopsNotTouchingPath"
                                :key="index">Non-Touching Loop {{ index + 1 }} not Touching Path Gain: {{ gain }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        show: Boolean, // prop to control modal visibility
        result: Object,
    },
    methods: {
        // closing event
        close() {
            this.$emit("close");
        },
    },
};
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal.is-active {
    display: flex;
}

.modal-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    position: relative;
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 30px;
    max-width: 80%;
    max-height: 80%;
    overflow: auto;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    background: transparent;
    border: none;
    outline: none;
    font-size: 30px;
    color: #aaa;
    z-index: 999;
}

.modal-close:hover {
    color: #333;
}

.box {
    margin-bottom: 20px;
}

.result-container {
    font-family: 'Arial', sans-serif;
}

.result-title {
    font-size: 24px;
    margin-bottom: 20px;
}

.highlight {
    color: rgb(8, 192, 238);
}

.section-title {
    font-size: 20px;
    margin-bottom: 10px;
}

.result-list {
    list-style-type: none;
    padding: 0;
}

.result-list li {
    margin-bottom: 8px;
}

.result-info {
    font-size: 18px;
    margin-bottom: 20px;
}

.result-section {
    text-align: left;
}
hr {
  color: black; /* Change this to the desired color */
}
.result-list li {
  color: black;
}
</style>