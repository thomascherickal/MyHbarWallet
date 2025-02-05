<template>
    <div :class="['alert', level]">
        <div class="message">
            <MaterialDesignIcon
                class="message-icon"
                :icon="messageIcon"
            />
            {{ message }}
        </div>
        <MaterialDesignIcon
            role="button"
            class="close"
            :icon="mdiClose"
            @click="destroyMe"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "@vue/composition-api";
import {
    mdiAlertOutline,
    mdiCheckCircleOutline,
    mdiClose,
    mdiCloseCircleOutline,
    mdiInformationOutline
} from "@mdi/js";

import { mutations } from "../store";

import MaterialDesignIcon from "./MaterialDesignIcon.vue";

interface Props {
    id: number;
    message: string;
    level: string;
}

export default defineComponent({
    components: { MaterialDesignIcon },
    props: {
        id: (Number as unknown) as PropType<number>,
        message: (String as unknown) as PropType<string>,
        level: (String as unknown) as PropType<string>
    },
    setup(props: Props) {
        const messageIcon = computed(() => {
            if (props.level === "info") {
                return mdiInformationOutline;
            } else if (props.level === "warn") {
                return mdiAlertOutline;
            } else if (props.level === "error") {
                return mdiCloseCircleOutline;
            } else if (props.level === "success") {
                return mdiCheckCircleOutline;
            }
            return mdiAlertOutline;
        });

        function destroyMe(): void {
            mutations.removeAlert(props.id);
        }

        return {
            messageIcon,
            mdiClose,
            destroyMe
        };
    }
});
</script>

<style lang="postcss" scoped>
.alert {
    align-items: center;
    background-color: var(--color-black);
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    color: var(--color-white);
    display: flex;
    font-size: 15px;
    font-weight: 300;
    justify-content: space-between;
    margin-block-start: 10px;
    min-height: 75px;
    overflow: hidden;
    padding: 6px 20px;
    user-select: none;
    width: 375px;

    @media (max-width: 1024px) {
        min-height: 50px;
        padding: 6px 10px;
        width: 200px;
    }

    @media (max-width: 425px) {
        margin-block-start: 0;
        min-height: 50px;
        padding: 6px 10px;
        width: calc(100% - 10px);
    }
}

.close {
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
    justify-content: center;
}

.message {
    align-items: center;
    display: flex;
}

.message-icon {
    flex-shrink: 0;
    margin-inline-end: 10px;
}

.error {
    background-color: var(--color-sunkist-coral);
}

.warn {
    background-color: var(--color-california-orange);
}

.info {
    background-color: var(--color-boston-blue);
}

.success {
    background-color: var(--color-fruit-salad);
}
</style>
