<template>
    <div class="create-account">
        <div class="wrap">
            <PageTitle title="Create A New Account">
                {{ $t("createAccount.alreadyHaveOne") }}
                <router-link :to="{ name: 'access-my-account' }">
                    {{ $t("common.accessMyAccount") }}
                </router-link>
            </PageTitle>
            <AccountTileButtons @click="handleClickTiles" />
        </div>

        <FAQs />

        <ModalAccessByHardware
            v-model="state.modalCreateByHardwareState"
            @submit="handleCreateByHardwareSubmit"
        />

        <ModalCreateBySoftware
            v-model="state.modalCreateBySoftwareState.isOpen"
            @submit="handleCreateBySoftwareSubmit"
        />

        <ModalCreateByPhrase
            v-model="state.modalCreateByPhraseState.isOpen"
            @submit="handleCreateByPhraseSubmit"
        />

        <ModalCreateByKeystore
            v-model="state.modalCreateByKeystoreState"
            @submit="handleCreateByKeystoreSubmit"
        />

        <ModalDownloadKeystore
            v-model="state.modalDownloadKeystoreState"
            @continue="handleDownloadKeystoreContinue"
            @submit="handleDownloadKeystoreSubmit"
        />

        <ModalEnterAccountId
            v-model="state.modalEnterAccountIdState"
            @network="handleNetworkChange"
            @noAccount="handleDoesntHaveAccount"
            @submit="handleAccountIdSubmit"
            @close="handleAccountIdClose"
        />

        <ModalRequestToCreateAccount
            v-model="state.modalRequestToCreateAccountState.isOpen"
            :public-key="state.publicKey"
            @hasAccount="handleHasAccount"
        />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { defineComponent, reactive, ref, Ref, SetupContext } from "@vue/composition-api";

import FAQs from "../components/FAQs.vue";
import AccountTileButtons from "../components/AccountTileButtons.vue";
import ModalAccessByHardware, { AccessHardwareOption } from "../components/ModalAccessByHardware.vue";
import PageTitle from "../components/PageTitle.vue";
import ModalCreateByPhrase from "../components/ModalCreateByPhrase.vue";
import ModalCreateByKeystore from "../components/ModalCreateByKeystore.vue";
import ModalDownloadKeystore from "../components/ModalDownloadKeystore.vue";
import ModalEnterAccountId, { ModalEnterAccountIdElement } from "../components/ModalEnterAccountId.vue";
import ModalRequestToCreateAccount from "../components/ModalRequestToCreateAccount.vue";
import ModalCreateBySoftware, { CreateSoftwareOption } from "../components/ModalCreateBySoftware.vue";
import SoftwareWallet from "../../domain/wallets/software/SoftwareWallet";
import { HederaStatusErrorTuple, LedgerErrorTuple } from "../store/modules/errors";
import Wallet, { LoginMethod } from "../../domain/wallets/Wallet";
import { actions, getters, mutations } from "../store";
import { CreateAccountDTO } from "../store/modules/account";
import { NetworkSettings, NetworkName } from "../../domain/network";

declare const MHW_ENV: string;

interface State {
    loginMethod: LoginMethod | null;
    wallet: Wallet | null;
}

export default defineComponent({
    components: {
        FAQs,
        AccountTileButtons,
        ModalAccessByHardware,
        ModalCreateBySoftware,
        PageTitle,
        ModalCreateByPhrase,
        ModalCreateByKeystore,
        ModalDownloadKeystore,
        ModalEnterAccountId,
        ModalRequestToCreateAccount
    },
    props: {},
    setup(props: object, context: SetupContext) {
        const state: CreateAccountDTO & State = reactive({
            privateKey: null,
            publicKey: null,
            keyFile: null,
            modalCreateByHardwareState: {
                isOpen: false,
                isBusy: false,
                optionSelected: "",
                disableButton: false
            },
            modalCreateBySoftwareState: { isOpen: false },
            modalCreateByKeystoreState: {
                isOpen: false,
                isBusy: false
            },
            modalCreateByPhraseState: { isOpen: false },
            modalKeystoreFilePasswordState: {
                isOpen: false,
                password: "",
                error: null,
                isBusy: false
            },
            modalDownloadKeystoreState: {
                isOpen: false,
                isBusy: false,
                downloadClicked: false
            },
            modalEnterAccountIdState: {
                failed: null,
                errorMessage: null,
                isOpen: false,
                isBusy: false,
                account: null,
                valid: false,
                networkValid: false,
                publicKey: null,
                nodeError: null,
                addressError: null
            },
            modalRequestToCreateAccountState: { isOpen: false },
            loginMethod: null,
            wallet: null
        });

        const keystoreFile = ref<HTMLAnchorElement | null>(null);
        const modalEnterAccountId: Ref<ModalEnterAccountIdElement | null> = ref(null);

        function setPrivateKey(newPrivateKey: import("@hashgraph/sdk").Ed25519PrivateKey): void {
            state.privateKey = newPrivateKey;
            state.publicKey = newPrivateKey.publicKey;
            state.modalEnterAccountIdState.publicKey = newPrivateKey.publicKey;
        }

        function handleNetworkChange(settings: NetworkSettings): void {
            if (
                getters.currentNetwork().name !== settings.name ||
                settings.name === NetworkName.CUSTOM
            ) {
                mutations.setCurrentNetwork(settings);
            }
        }

        function handleClickTiles(which: string): void {
            if (which === "hardware") {
                state.modalCreateByHardwareState.isOpen = true;
            } else if (which === "software") {
                state.modalCreateBySoftwareState.isOpen = true;
            }
        }

        function handleCreateBySoftwareSubmit(which: CreateSoftwareOption): void {
            state.modalCreateBySoftwareState.isOpen = false;

            if (which === CreateSoftwareOption.File) {
                state.loginMethod = LoginMethod.KeyStore;
                state.modalCreateByKeystoreState.isOpen = true;
            } else if (which === CreateSoftwareOption.Phrase) {
                state.loginMethod = LoginMethod.Mnemonic;
                state.modalCreateByPhraseState.isOpen = true;
            }
        }

        async function handleCreateByHardwareSubmit(which: AccessHardwareOption): Promise<void> {
            switch (which) {
                case AccessHardwareOption.Ledger:
                    state.loginMethod = LoginMethod.Ledger;
                    try {
                        const { Ledger } = await import(/* webpackChunkName: "hardware" */ "../../domain/wallets/hardware/Ledger");

                        state.modalCreateByHardwareState.isBusy = true;
                        state.wallet = new Ledger();
                        state.publicKey = (await state.wallet.getPublicKey()) as import("@hashgraph/sdk").Ed25519PublicKey;
                        state.modalEnterAccountIdState.publicKey = state.publicKey;
                        state.modalCreateByHardwareState.isOpen = false;
                        state.modalRequestToCreateAccountState.isOpen = true;
                    } catch (error) {
                        state.wallet = null;
                        state.loginMethod = null;

                        if (
                            error.name === "TransportStatusError" ||
                            error.name === "TransportOpenUserCancelled"
                        ) {
                            await actions.handleLedgerError({
                                error,
                                showAlert: true
                            });
                        } else {
                            throw error;
                        }
                    } finally {
                        state.modalCreateByHardwareState.isBusy = false;
                    }
                    break;
                default:
                    state.wallet = null;
                    state.loginMethod = null;
                    break;
            }
        }

        async function handleCreateByKeystoreSubmit(password: string): Promise<void> {
            state.modalCreateByKeystoreState.isOpen = false;
            state.modalDownloadKeystoreState.isOpen = true;

            try {
                const { Ed25519PrivateKey } = await import(/* webpackChunkName: "hashgraph" */ "@hashgraph/sdk");
                const privateKey = await Ed25519PrivateKey.generate();
                state.keyFile = await privateKey.toKeystore(password);
                setPrivateKey(privateKey);
                state.modalDownloadKeystoreState.isBusy = false;
                const keyStoreBlob = new Blob([ new Uint8Array(state.keyFile.buffer) ]);
                const keyStoreUrl = URL.createObjectURL(keyStoreBlob);
                keystoreFile.value = document.createElement("a") as HTMLAnchorElement;
                keystoreFile.value.href = keyStoreUrl;
                keystoreFile.value.download = `keystore-${new Date().toISOString()}`;
            } catch (error) {
                await actions.alert({
                    level: "error",
                    message: context.root
                        .$t("createAccount.unableToDownload")
                        .toString()
                });
            }
        }

        function handleDownloadKeystoreSubmit(): void {
            // eslint-disable-next-line no-console
            console.log(MHW_ENV);
            context.root.$el.append(keystoreFile.value as Node);

            try {
                if (MHW_ENV !== "test") keystoreFile.value!.click();
            } catch (error) {
                actions.alert({
                    message: context.root.$t("createAccount.noKeystore").toString(),
                    level: "warn"
                });
            }

            let timeoutLength = 100;
            if (MHW_ENV === "test") timeoutLength = 500;

            setTimeout(() => {
                try {
                    context.root.$el.removeChild(keystoreFile.value as HTMLAnchorElement);
                } catch {
                    // Doesn't matter
                }
            }, timeoutLength);
        }

        function handleDownloadKeystoreContinue(): void {
            state.modalRequestToCreateAccountState.isOpen = true;
            state.modalDownloadKeystoreState.isOpen = false;
        }

        function handleCreateByPhraseSubmit(newPrivateKey: import("@hashgraph/sdk").Ed25519PrivateKey): void {
            state.modalCreateByPhraseState.isOpen = false;

            setPrivateKey(newPrivateKey);

            state.modalRequestToCreateAccountState.isOpen = true;
        }

        async function handleAccountIdSubmit(account: import("@hashgraph/sdk").AccountId): Promise<void> {
            state.modalEnterAccountIdState.isBusy = true;

            if (state.loginMethod == null) {
                state.modalEnterAccountIdState.isBusy = false;
                throw new Error(context.root.$t("common.error.illegalState").toString());
            }

            if (state.wallet == null) {
                if (state.privateKey != null) {
                    state.wallet = new SoftwareWallet(
                        state.loginMethod,
                        state.privateKey as import("@hashgraph/sdk").Ed25519PrivateKey,
                        state.publicKey as import("@hashgraph/sdk").Ed25519PublicKey
                    );
                }
            }

            try {
                await actions.logIn(account, state.wallet!, getters.currentNetwork());
                state.modalEnterAccountIdState.isOpen = false;
                Vue.nextTick(() => mutations.navigateToInterface());
            } catch (error) {
                const { HederaStatusError } = await import(/* webpackChunkName: "hashgraph" */ "@hashgraph/sdk");
                if (error instanceof HederaStatusError) {
                    const result: HederaStatusErrorTuple = await actions.handleHederaError({ error, showAlert: false });

                    state.modalEnterAccountIdState.errorMessage =
                        result.message;

                    if (
                        error.message.includes(context.root.$t("common.error.unhandled").toString())
                    ) {
                        throw error;
                    }
                } else if (
                    error.name === "TransportStatusError" &&
                    state.loginMethod === LoginMethod.Ledger
                ) {
                    const result: LedgerErrorTuple = await actions.handleLedgerError({ error, showAlert: false });

                    state.modalEnterAccountIdState.errorMessage =
                        result.message;
                } else if (
                    error.message === "Response closed without headers" ||
                    error.message === "Response closed without grpc-status" ||
                    error.message === "404 (Not Found)" ||
                    error.stack.includes("grpc")
                ) {
                    const message = context.root
                        .$t("network.connectionFailed")
                        .toString();
                    (modalEnterAccountId.value as ModalEnterAccountIdElement).setAddressError(message);
                }
            } finally {
                state.modalEnterAccountIdState.isBusy = false;
            }
        }

        function handleAccountIdClose(): void {
            if (!state.modalRequestToCreateAccountState.isOpen) {
                state.wallet = null;
                state.loginMethod = null;
            }
        }

        function handleDoesntHaveAccount(): void {
            state.modalRequestToCreateAccountState.isOpen = true;
            state.modalEnterAccountIdState.isOpen = false;
        }

        function handleHasAccount(): void {
            state.modalRequestToCreateAccountState.isOpen = false;
            state.modalEnterAccountIdState.isOpen = true;
        }

        return {
            state,
            handleClickTiles,
            handleCreateByHardwareSubmit,
            handleCreateBySoftwareSubmit,
            handleCreateByKeystoreSubmit,
            handleDownloadKeystoreSubmit,
            handleCreateByPhraseSubmit,
            handleAccountIdSubmit,
            handleAccountIdClose,
            handleHasAccount,
            handleDoesntHaveAccount,
            handleDownloadKeystoreContinue,
            handleNetworkChange
        };
    }
});
</script>

<style lang="postcss" scoped>
a {
    color: var(--color-melbourne-cup);
    cursor: pointer;
    text-decoration: none;
}

a:hover,
a:focus {
    text-decoration: underline;
}

.create-account {
    display: flex;
    flex-direction: column;
}

.wrap {
    align-items: center;
    display: flex;
    flex-direction: column;
    padding: 80px 0;

    @media (max-width: 600px) {
        padding: 20px 0;
    }
}
</style>
