<template>
    <div class="statistics">
        <div>
            <span>Total</span>
            <h1>{{ total }}</h1>
        </div>
        <div>
            <span>Completed</span>
            <h1>{{ completed }}</h1>
        </div>
        <div>
            <span>Not completed</span>
            <h1>{{ notCompleted }}</h1>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Statistics extends Vue {
    @Prop({ required: true })
    private total!: number;

    @Prop({ required: true })
    private completed!: number;

    @Prop({ required: true })
    private notCompleted!: number;
}
</script>