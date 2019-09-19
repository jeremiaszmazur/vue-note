<template>
    <div class="actionbar" :class="{'actionbar--active': value}">
        <div>
            <i class="fas fa-exclamation-triangle"></i>
            <span>Do you want do delete this news?</span>
        </div>
        <div>
            <button 
                type="submit" 
                class="btn" 
                :disabled="showLoading" 
                @click="clearSelected"
            >No</button>
            <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="showLoading"
                @click="deleteSelected"
            ><i v-if="showLoading" class="fas fa-sync fa-spin"></i>Yes</button>
        </div>
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

    private clearSelected(): void {
        this.close();
        this.$emit('clear');
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
            this.$emit('delete');
        });
    }
}
</script>