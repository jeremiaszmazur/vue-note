<template>
    <div class="notes">
        <div class="container">
            <statistics/>
            <table class="datatable" :class="{loading: showLoading}">
                <thead>
                    <tr>
                        <th>
                            <span class="col">
                                <label class="checkbox-wrapper">ID
                                    <input
                                        v-model="selectAll"
                                        type="checkbox"
                                        @change="handleSelectAll()">
                                    <span class="checkmark"></span>
                                </label>
                                <span
                                    class="sort"
                                    @click="sort('id')"
                                    :class="{
                                        'active': sortBy === 'id',
                                        'asc': sortAscending
                                    }">
                                    <i class="fas fa-chevron-up"></i>
                                    <i class="fas fa-chevron-down"></i>
                                </span>
                            </span>
                        </th>
                        <th>
                            <span class="col">
                                Title
                                <span
                                    class="sort"
                                    @click="sort('title')"
                                    :class="{
                                        'active': sortBy === 'title',
                                        'asc': sortAscending
                                    }">
                                    <i class="fas fa-chevron-up"></i>
                                    <i class="fas fa-chevron-down"></i>
                                </span>
                            </span>
                        </th>
                        <th>
                            <span class="col">
                                Content
                                <span
                                    class="sort"
                                    @click="sort('content')"
                                    :class="{
                                        'active': sortBy === 'content',
                                        'asc': sortAscending
                                    }">
                                    <i class="fas fa-chevron-up"></i>
                                    <i class="fas fa-chevron-down"></i>
                                </span>
                            </span>
                        </th>
                        <th>
                            <span class="col">
                                Status
                                <span
                                    class="sort"
                                    @click="sort('status')"
                                    :class="{
                                        'active': sortBy === 'status',
                                        'asc': sortAscending
                                    }">
                                    <i class="fas fa-chevron-up"></i>
                                    <i class="fas fa-chevron-down"></i>
                                </span>
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="notes.length">
                        <tr v-for="note in notes" :key="note.id">
                            <td>
                                <label class="checkbox-wrapper">
                                    {{note.id}}
                                    <input
                                        v-model="selectedNotes"
                                        type="checkbox"
                                        :id="note.id"
                                        :value="note"
                                        @change="handleChange(note)">
                                    <span class="checkmark"></span>
                                </label>
                            </td>
                            <td>{{note.title}}</td>
                            <td>{{note.content}}</td>
                            <td>{{statusDictionary[note.status]}}</td>
                        </tr>
                    </template>
                    <tr v-else>
                        <td colspan="4">
                            Empty note list. Add some :)
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="text-right">
                <button type="button" class="btn" @click="addForm = true">Add</button>
            </div>
        </div>
        <note-form v-model="addForm"/>
        <actionbar
            v-model="actionbar"
            :selectedNotes="selectedNotes"
            @delete="handleDelete"
            @clear="handleClearSelected"
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Statistics from './components/Statistics.vue';
import NoteForm from './components/NoteForm.vue';
import Actionbar from './components/Actionbar.vue';
import { SortByType } from './store';
import { NoteStatus, NoteContent, Note, NoteStatusDictionary } from './Note';

@Component({ components: { Statistics, NoteForm, Actionbar } })
export default class App extends Vue {
    private statusDictionary = NoteStatusDictionary;
    private addForm: boolean = false;
    private selectedNotes: Note[] = [];
    private actionbar: boolean = false;
    private showLoading: boolean = true;
    private selectAll: boolean = false;

    private get notes(): Note[] {
        return this.$store.getters.sortedNotes || [];
    }

    private get sortBy(): SortByType {
        return this.$store.getters.sortBy;
    }

    private get sortAscending(): boolean {
        return this.$store.getters.sortAscending;
    }

    public created(): void {
        this.fetchNotes();
    }

    private handleClearSelected(): void {
        this.selectedNotes = [];
        this.selectAll = false;
    }

    private handleSelectAll(): void {
      if ( this.selectAll && this.notes.length ) {
        this.selectedNotes = this.notes;
        this.actionbar = true;
      } else {
        this.selectedNotes = [];
        this.actionbar = false;
      }
    }

    private sort(sortBy: SortByType): void {
        this.fetchSorted(sortBy, this.sortBy === sortBy ? !this.sortAscending : true);
    }

    private fetchNotes(): void {
        this.showLoading = true;
        this.$store.dispatch('fetchNotes').finally(
            () => this.showLoading  = false,
        );
    }

    private fetchSorted(sortBy: SortByType, sortAscending: boolean): void {
        this.showLoading = true;
        this.$store.dispatch('fetchSorted', {
            sortBy,
            sortAscending,
        }).finally(
            () => this.showLoading  = false,
        );
    }

    private handleChange(): void {
        this.actionbar = !!this.selectedNotes.length;
        this.selectAll = this.selectedNotes.length === this.notes.length;
    }

    private handleDelete(): void {
        this.selectAll = false;
        this.selectedNotes = [];
    }
}
</script>

<style lang="scss">
@import "./styles/styles.scss";

.container {
    padding: 0 10vw;
    .btn {
        width: 100%;
        max-width: 200px;
        margin-top: 20px;
    }
}
</style>