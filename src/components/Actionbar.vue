<template>
    <div class="actionbar" :class="{'actionbar--active': value}">
        <i>!</i>
        <span>Do you want do delete this news?</span>
        <button type="submit" class="btn" :disabled="showLoading" @click="close">No</button>
        <button type="submit" class="btn btn-primary" :disabled="showLoading" @click="deleteSelected">Yes</button>
    </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Note } from '../Note';

@Component
export default class Actionbar extends Vue {
    @Prop() private value!: boolean;
    @Prop() private selectedNotes!: Note[];
    private showLoading: boolean = false;

    private close(): void {
        this.$emit('input', false);
    }

    private deleteSelected(): void {
        this.showLoading = true;
        const promises: Array<Promise<number>> = [];
        this.selectedNotes.forEach((note: Note) => {
            promises.push(this.$store.dispatch('deleteNote', note.id));
        });
        Promise.all(promises).then(() => {
            this.showLoading = false;
            this.close();
        });
    }
}
</script>

<style lang="scss" scoped>
$margin: 30px;

.actionbar {
    display: none;
    will-change: display;
    position: fixed;
    bottom: $margin;
    right: $margin;
    width: calc(90vw - #{$margin * 2});
    max-width: 400px;
    background-color: #FFF;
    &--active {
        display: block;
    }
}
</style>