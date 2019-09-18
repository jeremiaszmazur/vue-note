<template>
    <div class="notes">
        <statistics/>
        <table>
            <thead>
                <tr>
                    <th>
                      <input
                        v-model="selectAll"
                        type="checkbox"
                        @change="handleSelectAll()">
                    </th>
                    <th @click="sort('id')">ID</th>
                    <th @click="sort('title')">Title</th>
                    <th @click="sort('content')">Content</th>
                    <th @click="sort('status')">Status</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="notes.length">
                    <tr v-for="note in notes" :key="note.id">
                        <td>
                            <input
                                v-model="selectedNotes"
                                type="checkbox"
                                :id="note.id"
                                :value="note"
                                @change="handleChange(note)">
                        </td>
                        <td>{{note.id}}</td>
                        <td>{{note.title}}</td>
                        <td>{{note.content}}</td>
                        <td>{{statusDictionary[note.status]}}</td>
                    </tr>
                </template>
                <tr v-else colspan="4">
                    No notes. Add some :)
                </tr>
            </tbody>
        </table>
        <button type="button" @click="addForm = true">Add</button>
        <note-form v-model="addForm"/>
        <actionbar v-model="actionbar" :selectedNotes="selectedNotes"/>
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
    private sortBy: SortByType = 'id';
    private sortAscending: boolean = true;

    private get notes() {
        return this.$store.getters.sortedNotes || [];
    }

    public created(): void {
        this.fetchNotes();
    }

    private handleSelectAll(): void {
      if ( this.selectAll ) {
        this.selectedNotes = this.notes;
        this.actionbar = true;
      } else {
        this.selectedNotes = [];
        this.actionbar = false;
      }
    }

    private sort(sortBy: SortByType): void {
        if (this.sortBy === sortBy) {
            this.sortAscending = !this.sortAscending;
        } else {
            this.sortBy = sortBy;
            this.sortAscending = true;
        }
        this.fetchNotes();
    }

    private fetchNotes(): void {
        this.showLoading = true;
        this.$store.dispatch('fetchNotes', {
            sortBy: this.sortBy,
            sortAscending: this.sortAscending,
        }).finally(
            () => this.showLoading  = false,
        );
    }

    private handleChange(): void {
        this.actionbar = !!this.selectedNotes.length;
        this.selectAll = this.selectedNotes.length === this.notes.length;
    }
}
</script>
