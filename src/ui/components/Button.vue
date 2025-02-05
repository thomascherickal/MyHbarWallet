<template>
    <button
        :class="{
            busy,
            outline,
            compact,
            danger
        }"
        type="submit"
        :disabled="disabled"
        v-on="disabled ? null : $listeners"
    >
        <MaterialDesignIcon
            v-if="busy"
            class="spinner"
            :icon="mdiLoading"
            spin
        />

        <span v-if="state.showProgress">{{ label }}</span>

        <MaterialDesignIcon
            v-if="trailingIcon"
            class="icon"
            :icon="trailingIcon"
        />
    </button>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "@vue/composition-api";
import { mdiLoading } from "@mdi/js";

import MaterialDesignIcon from "./MaterialDesignIcon.vue";

export default defineComponent({
    components: { MaterialDesignIcon },
    props: {
        outline: { type: Boolean },
        compact: { type: Boolean },
        label: { type: String, required: true },
        busy: { type: Boolean },
        busyProgress: { type: Boolean },
        disabled: { type: Boolean },
        danger: { type: Boolean },
        trailingIcon: {
            type: String,
            default: null
        }
    },
    setup(props) {
        const state = reactive({ showProgress: true });

        watch(
            () => props.busy,
            () => {
                if (props.busy && props.busyProgress) {
                    state.showProgress = true;
                    return;
                }

                if (props.busy) {
                    state.showProgress = false;
                    return;
                }

                state.showProgress = true;
            }
        );

        return {
            mdiLoading,
            state
        };
    }
});
</script>

<style scoped lang="postcss">
button {
    background: var(--color-melbourne-cup);
    border: 1px solid var(--color-melbourne-cup);
    border-radius: 4px;
    color: var(--color-white);
    font-size: 14px;
    font-weight: 500;
    min-width: 250px;
    outline: none;
    padding: 18px;
    position: relative;
    user-select: none;
    white-space: nowrap;

    &:disabled {
        background-color: var(--color-basalt-grey);
        border-color: var(--color-basalt-grey);
        cursor: default;
    }

    &.busy {
        padding: 8.5px;
    }

    &.busy:not(.compact) {
        padding: 16.5px;
    }

    &:not(.busy):not(:disabled) {
        cursor: pointer;
    }

    &:hover:not(.busy):not(:disabled),
    &:focus:not(.busy):not(:disabled) {
        background-color: var(--color-celestial-green);
        border-color: var(--color-celestial-green);
    }

    &:active:not(.busy):not(:disabled) {
        background-color: var(--color-green-jelly);
        border-color: var(--color-green-jelly);
    }
}

.compact {
    min-width: initial;
    padding: 10px 20px;
}

.icon {
    inset-block: 0;
    inset-inline-end: 15px;
    margin: auto 0;
    position: absolute;
}

.spinner + span {
    margin-inline-start: 10px;
}

.danger {
    &:not(:disabled) {
        background-color: var(--color-infra-red);
        border-color: var(--color-infra-red);
    }

    &:hover:not(.busy):not(:disabled),
    &:focus:not(.busy):not(:disabled) {
        background-color: var(--color-aggressive-salmon);
        border-color: var(--color-aggressive-salmon);
    }

    &:active:not(.busy):not(:disabled) {
        background-color: var(--color-warm-pink);
        border-color: var(--color-warm-pink);
    }
}

.outline {
    &:not(:disabled) {
        background-color: transparent;
        color: var(--color-melbourne-cup);
    }

    &.danger:not(:disabled) {
        background-color: transparent;
        border-color: var(--color-infra-red);
        color: var(--color-infra-red);
    }

    &:hover:not(.busy):not(:disabled),
    &:focus:not(.busy):not(:disabled) {
        background-color: transparent;
        color: var(--color-celestial-green);

        &.danger {
            color: var(--color-aggressive-salmon);
        }
    }

    &:active:not(.busy):not(:disabled) {
        background-color: var(--color-distant-horizon);
        border-color: var(--color-green-fluorite);
        color: var(--color-green-fluorite);

        &.danger {
            background-color: var(--color-distant-horizon);
            border-color: var(--color-warm-pink);
            color: var(--color-warm-pink);
        }
    }
}
</style>
