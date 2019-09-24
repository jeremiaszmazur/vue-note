<template>
    <div class="notes">
        <div class="container">
            <statistics
                :total="totalNotes"
                :completed="completedNotes"
                :not-completed="notCompletedNotes"
            />
            <div>
                <datatable
                    v-model="selectedNotes"
                    :notes="noteList"
                    :show-loading="showLoading"
                    @sort="fetchSorted"
                >Empty news list. Add some :)</datatable>
                <div class="text-right">
                    <button type="button" class="btn btn-add" @click="addForm = true">Add</button>
                </div>
            </div>
            <note-form v-model="addForm" />
            <actionbar
                :show="actionbar"
                :show-loading="actionbarLoading"
                @delete="handleDelete"
                @close="handleCloseActionbar"
            >Do you want do delete this news?</actionbar>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Statistics from './components/Statistics.vue';
import NoteForm from './components/NoteForm.vue';
import Actionbar from './components/Actionbar.vue';
import Datatable from './components/Datatable.vue';
import { SortByType } from './store';
import { NoteStatus, NoteContent, Note } from './Note';

@Component({ components: { Statistics, NoteForm, Actionbar, Datatable } })
export default class App extends Vue {
    private addForm: boolean = false;
    private selectedNotes: Note[] = [];
    private showLoading: boolean = true;
    private actionbarLoading: boolean = false;
    private selectAll: boolean = false;

    private get totalNotes() {
        return this.$store.getters.total || 0;
    }

    private get completedNotes() {
        return this.$store.getters.completed || 0;
    }
    private get notCompletedNotes() {
        return this.$store.getters.notCompleted || 0;
    }

    private get noteList(): Note[] {
        return this.$store.getters.sortedNotes || [];
    }

    private get sortBy(): SortByType {
        return this.$store.getters.sortBy;
    }

    private get sortAscending(): boolean {
        return this.$store.getters.sortAscending;
    }

    private get actionbar(): boolean {
        return !!this.selectedNotes.length;
    }

    public created(): void {
        this.fetchNotes();
    }

    private sort(sortBy: SortByType): void {
        this.fetchSorted(sortBy, this.sortBy === sortBy ? !this.sortAscending : true);
    }

    private fetchNotes(): void {
        this.showLoading = true;
        this.$store.dispatch('fetchNotes').finally(() => (this.showLoading = false));
    }

    private fetchSorted(sortBy: SortByType, sortAscending: boolean): void {
        this.showLoading = true;
        this.$store
            .dispatch('fetchSorted', { sortBy, sortAscending })
            .finally(() => (this.showLoading = false));
    }

    private handleCloseActionbar(): void {
        this.actionbarLoading = false;
        this.selectedNotes = [];
    }

    private handleDelete(): void {
        this.actionbarLoading = true;
        const ids = Object.values(this.selectedNotes.map((note) => note.id));
        this.$store.dispatch('deleteNotes', ids).finally(() => {
            this.actionbarLoading = false;
            this.selectedNotes = [];
        });
    }
}
</script>

<style lang="scss">
@import './styles/styles.scss';

.container {
    padding: 0 10vw;
    .btn-add {
        width: 100%;
        max-width: 200px;
        margin-top: 20px;
    }
}
</style>