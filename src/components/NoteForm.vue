<template>
    <transition name="slide-fade">
        <form
            v-if="value"
            @submit.prevent="checkForm"
            class="note-form"
            :class="{'note-form--active': value}"
        >
            <h1 class="title">News</h1>

            <p>
                <input
                    v-model.trim="title"
                    type="text"
                    placeholder="Add title"
                    class="input"
                    :class="{'input-error': titleError}"
                    :disabled="showLoading"
                    @change="validTitle"
                />
                <span v-if="titleError" class="msg msg-error">{{ titleError }}</span>
            </p>

            <p>
                <textarea
                    v-model.trim="content"
                    rows="4"
                    cols="50"
                    placeholder="Add content"
                    class="input"
                    :class="{'input-error': contentError}"
                    :disabled="showLoading"
                    @change="validContent"
                />
                <span v-if="contentError" class="msg msg-error">{{ contentError }}</span>
            </p>

            <p>
                <button type="submit" class="btn" :disabled="showLoading">
                    <i v-if="showLoading" class="fas fa-sync fa-spin"></i>
                    Save
                </button>
                <button
                    type="button"
                    class="btn btn-flat"
                    @click="close"
                    :disabled="showLoading"
                >Cancel</button>
            </p>
        </form>
    </transition>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { NoteContent, NoteStatus, Note } from '../Note';

@Component
export default class NoteForm extends Vue {
    @Prop() private value!: boolean;

    private title: string = '';
    private content: string = '';
    private titleError: string = '';
    private contentError: string = '';
    private showLoading: boolean = false;

    public reset(): void {
        this.resetErrors();
        this.resetInputs();
    }

    private validTitle(): boolean {
        const valid = !!this.title;
        this.titleError = valid ? '' : 'Title is required.';
        return valid;
    }

    private validContent(): boolean {
        const valid = !!this.content;
        this.contentError = valid ? '' : 'Title is required.';
        return valid;
    }

    private valid(): boolean {
        const validContent = this.validContent();
        const validTitle = this.validTitle();
        return validContent && validTitle;
    }

    private checkForm(event: Event): void {
        if (this.showLoading) {
            return;
        }

        if (this.valid()) {
            this.addNote(
                {
                    title: this.title,
                    content: this.content,
                    status: NoteStatus.New,
                },
                () => this.close(),
            );
        }
    }

    private addNote(noteContent: NoteContent, cb: () => void): void {
        this.showLoading = true;
        this.$store.dispatch('addNote', noteContent).finally(() => {
            this.showLoading = false;
            cb();
        });
    }

    private resetErrors(): void {
        this.titleError = '';
        this.contentError = '';
    }

    private resetInputs(): void {
        this.title = '';
        this.content = '';
    }

    private close(): void {
        this.$emit('input', false);
        this.reset();
    }
}
</script>