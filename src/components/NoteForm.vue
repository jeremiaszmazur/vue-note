<template>
    <form @submit.prevent="checkForm" class="note-form" :class="{'note-form--active': value}">

        <h1>News</h1>
        
        <p>
            <input
                v-model="title"
                type="text"
                placeholder="Add title"
                class="input"
                :class="{'input-error': titleError}"
                :disabled="showLoading"/>
            <span v-if="titleError" class="msg msg-error">{{ titleError }}</span>
        </p>

        <p>
            <textarea
                v-model="content"
                rows="4"
                cols="50"
                placeholder="Add content"
                class="input"
                :class="{'input-error': contentError}"
                :disabled="showLoading"/>
            <span v-if="contentError" class="msg msg-error">{{ contentError }}</span>
        </p>

        <p>
            <button type="submit" class="btn btn-primary" :disabled="showLoading">Save</button>
            <button type="button" class="btn" @click="close" :disabled="showLoading">Cancel</button>
        </p>

        </form>
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

    private checkForm(event: Event): void {
        if (this.showLoading) {
            return;
        }
        this.resetErrors();

        if (!this.title) {
            this.titleError = 'Title is required.';
        }
        if (!this.content) {
            this.contentError = 'Content is required.';
        }

        if (this.title && this.content) {
            this.addNote({
                title: this.title,
                content: this.content,
                status: NoteStatus.New,
            }, () => this.close());
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

<style lang="scss" scoped>
$margin: 30px;

.note-form {
    display: none;
    will-change: display;
    position: fixed;
    bottom: $margin;
    left: $margin;
    width: calc(90vw - #{$margin * 2});
    max-width: 400px;
    background-color: #FFF;
    &--active {
        display: block;
    }
}
</style>