<template>
    <transition name="slide-fade">
        <div v-if="show" class="actionbar">
            <div>
                <i class="fas fa-exclamation-triangle"></i>
                <span>
                    <slot />
                </span>
            </div>
            <div>
                <button
                    type="submit"
                    class="btn btn-warning"
                    :disabled="showLoading"
                    @click="clearSelected"
                >No</button>
                <button
                    type="submit"
                    class="btn btn-warning-primary"
                    :disabled="showLoading"
                    @click="deleteSelected"
                >
                    <i v-if="showLoading" class="fas fa-sync fa-spin"></i>Yes
                </button>
            </div>
        </div>
    </transition>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Note } from '../Note';

@Component
export default class Actionbar extends Vue {
    @Prop({ required: true })
    private show!: boolean;

    @Prop({ required: false, default: false })
    private showLoading!: boolean;

    private close(): void {
        this.$emit('close');
    }

    private clearSelected(): void {
        this.close();
        this.$emit('clear');
    }

    private deleteSelected(): void {
        this.$emit('delete');
    }
}
</script>