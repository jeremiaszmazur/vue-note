<template>
    <div>
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
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Statistics extends Vue {
    private get total() {
        return this.$store.getters.total || 0;
    }
    private get completed() {
        return this.$store.getters.completed || 0;
    }
    private get notCompleted() {
        return this.$store.getters.notCompleted || 0;
    }
}
</script>
