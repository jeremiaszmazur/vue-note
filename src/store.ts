import Vue from 'vue';
import Vuex, { MutationTree, GetterTree, ActionTree } from 'vuex';
import { Note, NoteContent, NoteStatus } from './Note';

Vue.use(Vuex);

export type SortByType = 'id' | 'title' | 'content' | 'status';

export interface SortData {
    sortBy: SortByType;
    sortAscending: boolean;
}

export interface NoteState {
    notes: Note[];
    lastId: number;
    sortBy: SortByType;
    sortAscending: boolean;
}

const state: NoteState = {
    notes: [
        {
            id: 1,
            title: 'delectus aut autem',
            content: 'Lorem ipsum',
            status: NoteStatus.New,
        },
        {
            id: 2,
            title: 'quis ut nam facilis et officia qui',
            content: 'Lorem ipsum',
            status: NoteStatus.Completed,
        },
        {
            id: 3,
            title: 'fugiat veniam minus',
            content: 'Lorem ipsum',
            status: NoteStatus.NotCompleted,
        },
    ],
    lastId: 3,
    sortBy: 'id',
    sortAscending: true,
};

export interface Mutations extends MutationTree<NoteState> { }

const getters: GetterTree<NoteState, NoteState> = {
    notes: state => state.notes,
    sortBy: state => state.sortBy,
    sortAscending: state => state.sortAscending,
    sortedNotes: state => {
        const notes = [...state.notes].sort((a, b) => {
            if (a[state.sortBy] > b[state.sortBy]) {
                return 1;
            }
            if (a[state.sortBy] < b[state.sortBy]) {
                return -1;
            }
            return 0;
        });

        if (!state.sortAscending) {
            notes.reverse();
        }

        return notes;
    },
    total: state => state.notes.length,
    completed: state => state.notes.filter(
        (note: Note) => note.status === NoteStatus.Completed,
    ).length,
    notCompleted: state => state.notes.filter(
        (note: Note) => note.status === NoteStatus.NotCompleted,
    ).length,
};

const mutations: Mutations = {
    ADD_NOTE(state, content: NoteContent) {
        const id = ++state.lastId;
        state.notes.push({
            id,
            ...content,
        });
    },
    DELETE_NOTE(state, id: number) {
      state.notes = state.notes.filter(note => note.id !== id);
    },
    SORT(state, sort: SortData) {
        state.sortBy = sort.sortBy;
        state.sortAscending = sort.sortAscending;
    },
};

const actions: ActionTree<NoteState, NoteState> = {
    addNote: ({commit}, payload: NoteContent) => new Promise((resolve) => {
        setTimeout(() => {
            commit('ADD_NOTE', payload);
            resolve(payload);
        }, 2000);
    }),
    deleteNote: ({commit}, id: number) => new Promise((resolve) => {
        setTimeout(() => {
            commit('DELETE_NOTE', id);
            resolve(id);
        }, 1000);
    }),
    fetchNotes: () => new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    }),
    fetchSorted: ({commit}, payload) => new Promise((resolve) => {
        setTimeout(() => {
            commit('SORT', payload);
            resolve();
        }, 500);
    }),
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
});
