<template>
    <div class="notes">
        <statistics/>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Status</th>
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
import { NoteStatus, NoteContent, Note, NoteStatusDictionary } from './Note';

@Component({ components: { Statistics, NoteForm, Actionbar } })
export default class App extends Vue {
    private statusDictionary = NoteStatusDictionary;
    private addForm: boolean = false;
    private selectedNotes: Note[] = [];
    private actionbar: boolean = false;
    private showLoading: boolean = true;

    private get notes() {
        return this.$store.getters.notes || [];
    }

    public created(): void {
        this.fetchNotes();
    }

    private fetchNotes(): void {
        this.showLoading = true;
        this.$store.dispatch('fetchNotes').finally(
            () => this.showLoading  = false,
        );
    }

    private handleChange(): void {
        this.actionbar = !!this.selectedNotes.length;
    }
}
</script>
