<template>
    <button
        v-scroll="handleWindowScroll"
        :class="classObject"
        @click="handleClick"
    >
        <MaterialDesignIcon
            class="icon"
            :icon="mdiChevronUp"
        />
    </button>
</template>

<script lang="ts">
import { mdiChevronUp } from "@mdi/js";
import { computed, defineComponent, ref } from "@vue/composition-api";

import MaterialDesignIcon from "./MaterialDesignIcon.vue";

function handleClick(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export default defineComponent({
    components: { MaterialDesignIcon },
    props: {},
    setup() {
        const isActive = ref(false);
        const classObject = computed(() => ({ "is-active": isActive.value }));

        function handleWindowScroll(): void {
            // eslint-disable-next-line compat/compat
            isActive.value = window.scrollY > 150;
        }

        return {
            isActive,
            mdiChevronUp,
            classObject,
            handleClick,
            handleWindowScroll
        };
    }
});
</script>

<style lang="postcss" scoped>
button {
    background: var(--color-peral);
    border: 2px solid var(--color-melbourne-cup);
    border-radius: 50%;
    color: var(--color-melbourne-cup);
    cursor: pointer;
    height: 50px;
    inset-block-end: 40px;
    inset-inline-end: 50px;
    opacity: 0;
    outline: none;
    pointer-events: none;
    position: fixed;
    transition: opacity 0.3s ease;
    width: 50px;

    &.is-active {
        opacity: 1;
        pointer-events: initial;
    }
}

@media screen and (prefers-reduced-motion) {
    button {
        transition: none;
    }
}

@media screen and (max-width: 450px) {
    button {
        display: none;
    }
}
</style>
