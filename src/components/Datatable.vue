<template>
    <table class="datatable" :class="{loading: showLoading}">
        <thead>
            <tr>
                <th>
                    <span class="col">
                        <label class="checkbox-wrapper">
                            ID
                            <input
                                v-model="selectAll"
                                type="checkbox"
                                @change="handleSelectAll()"
                            />
                            <span class="checkmark"></span>
                        </label>
                        <span
                            class="sort"
                            @click="sort('id')"
                            :class="{
                                'active': sortBy === 'id',
                                'asc': sortAscending
                            }"
                        >
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
                            }"
                        >
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
                            }"
                        >
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
                            }"
                        >
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
                                @change="handleChange(note)"
                            />
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
                    <slot />
                </td>
            </tr>
        </tbody>
    </table>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { SortByType } from '../store';
import { NoteStatus, NoteContent, Note, NoteStatusDictionary } from '../Note';

@Component
export default class Datatable extends Vue {
    @Prop({ required: false, default: false })
    private showLoading!: boolean;

    @Prop({ required: true })
    private notes!: Note[];

    @Prop({ required: true })
    private value!: Note[];

    private statusDictionary = NoteStatusDictionary;
    private addForm: boolean = false;
    private selectedNotes: Note[] = this.value;
    private selectAll: boolean = false;

    @Watch('selectedNotes')
    private onSelectedNotesChanged(value: Note[]): void {
        this.$emit('input', value);
        this.selectAll = value.length === this.notes.length;
    }

    @Watch('value')
    private onValueChanged(value: Note[]): void {
        this.selectedNotes = value;
    }

    @Watch('notes')
    private onNotesChanged(value: Note[]): void {
        if ( this.selectAll ) {
            this.selectedNotes = value;
        }
    }

    private get sortBy(): SortByType {
        return this.$store.getters.sortBy;
    }

    private get sortAscending(): boolean {
        return this.$store.getters.sortAscending;
    }

    private handleClearSelected(): void {
        this.selectedNotes = [];
        this.selectAll = false;
    }

    private handleSelectAll(): void {
        if (this.selectAll && this.notes.length) {
            this.selectedNotes = this.notes;
        } else {
            this.selectedNotes = [];
        }
    }

    private sort(sortBy: SortByType): void {
        this.$emit('sort', sortBy, this.sortBy === sortBy ? !this.sortAscending : true);
    }

    private handleChange(): void {
        this.selectAll = this.selectedNotes.length === this.notes.length;
    }

    private handleDelete(): void {
        this.selectAll = false;
        this.selectedNotes = [];
    }
}
</script>