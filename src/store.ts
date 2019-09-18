import Vue from 'vue';
import Vuex, { MutationTree, GetterTree, ActionTree } from 'vuex';
import { Note, NoteContent, NoteStatus } from './Note';

Vue.use(Vuex);

export interface NoteState {
    notes: Note[];
    lastId: number;
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
};

export interface Mutations extends MutationTree<NoteState> { }

const getters: GetterTree<NoteState, NoteState> = {
    notes: state => state.notes,
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
    fetchNotes: ({commit}) => new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 4000);
    }),
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
});
