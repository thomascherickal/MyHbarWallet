<template>
    <span class="download-button">
        <Tooltip :message="$t('exportKeystoreButton.message')">
            <MaterialDesignIcon
                :icon="mdiFileDownload"
                class="export-keystore-icon"
                @click="handleClick"
            />
        </Tooltip>
        <ModalExportGenerateKeystore
            v-model="state.modalExportGenerateKeystoreState"
            @submit="handleGenerateKeystoreSubmit"
        />
        <ModalExportDownloadKeystore
            v-model="state.modalExportDownloadKeystoreState"
            @submit="handleDownloadKeystoreSubmit"
        />
    </span>
</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref, SetupContext } from "@vue/composition-api";
import { mdiFileDownload } from "@mdi/js";

import { actions } from "../store";

import Tooltip from "./Tooltip.vue";
import MaterialDesignIcon from "./MaterialDesignIcon.vue";
import ModalExportGenerateKeystore, { State as ModalExportGenerateKeystoreState } from "./ModalExportGenerateKeystore.vue";
import ModalExportDownloadKeystore, { State as ModalExportDownloadKeystoreState } from "./ModalExportDownloadKeystore.vue";

declare const MHW_ENV: string;

export interface State {
    password: string;
    modalExportGenerateKeystoreState: ModalExportGenerateKeystoreState;
    modalExportDownloadKeystoreState: ModalExportDownloadKeystoreState;
}

export default defineComponent({
    components: {
        Tooltip,
        MaterialDesignIcon,
        ModalExportGenerateKeystore,
        ModalExportDownloadKeystore
    },
    props: { privateKey: String },
    setup(props: { privateKey: string }, context: SetupContext) {
        const state = reactive<State>({
            password: "",
            modalExportGenerateKeystoreState: {
                isOpen: false,
                isBusy: false
            },
            modalExportDownloadKeystoreState: {
                isOpen: false,
                isBusy: false
            }
        });

        const keyFile: Ref<Uint8Array | null> = ref(null);
        const keystoreLink: Ref<HTMLAnchorElement | null> = ref(null);

        async function handleGenerateKeystoreSubmit(password: string): Promise<void> {
            state.modalExportGenerateKeystoreState.isOpen = false;

            try {
                const { Ed25519PrivateKey } = await import(/* webpackChunkName: "hashgraph" */ "@hashgraph/sdk");
                keyFile.value = await Ed25519PrivateKey.fromString(props.privateKey).toKeystore(password);
                state.modalExportDownloadKeystoreState.isBusy = false;
                const keystoreBlob = new Blob([ keyFile.value.buffer as Uint8Array ]);
                const keystoreUrl = URL.createObjectURL(keystoreBlob);
                keystoreLink.value = document.createElement("a") as HTMLAnchorElement;
                keystoreLink.value.href = keystoreUrl;
                keystoreLink.value.download =
                    `keystore-${new Date().toISOString()}`;
            } catch (error) {
                actions.alert({
                    level: "error",
                    message: context.root
                        .$t("modalExportGenerateKeystore.couldNotGenerate")
                        .toString()
                });
                throw error;
            }

            state.modalExportDownloadKeystoreState.isOpen = true;
        }

        function handleDownloadKeystoreSubmit(): void {
            context.root.$el.append(keystoreLink.value as Node);

            try {
                if (MHW_ENV !== "test") keystoreLink.value!.click();
            } catch (error) {
                actions.alert({
                    message: context.root.$t("modalExportDownloadKeystore.couldNotDownload").toString(),
                    level: "warn"
                });
            }

            let timeoutLength = 100;
            if (MHW_ENV === "test") timeoutLength = 500;

            setTimeout(() => {
                try {
                    context.root.$el.removeChild(keystoreLink.value as HTMLAnchorElement);
                } catch {
                    // Doesn't matter
                }
            }, timeoutLength);

            state.modalExportGenerateKeystoreState.isOpen = false;
            state.modalExportDownloadKeystoreState.isOpen = false;
        }

        function handleClick(): void {
            state.modalExportGenerateKeystoreState.isOpen = true;
        }

        return {
            mdiFileDownload,
            props,
            state,
            handleClick,
            handleGenerateKeystoreSubmit,
            handleDownloadKeystoreSubmit
        };
    }
});
</script>
