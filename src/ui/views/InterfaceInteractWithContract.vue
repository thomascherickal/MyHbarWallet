<template>
    <div class="interact-with-contract">
        <InterfaceForm :title="$t('interfaceInteractWithContract.title')">
            <TextInput
                v-model.trim="contractId"
                :label="$t('common.contract')"
                :placeholder="$t('common.accountSyntax')"
                show-validation
                :valid="isIdValid"
            />
            <TextInput
                v-model.trim="abi"
                :label="'ABI/JSON' + $t('common.interface')"
                can-copy
                can-clear
                multiline
                show-validation
                :valid="isJsonValid"
            />

            <template v-slot:footer>
                <Button
                    :label="$t('common.continue')"
                    :trailing-icon="arrowRight"
                    :disabled="!isFormValid"
                />
            </template>
        </InterfaceForm>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "@vue/composition-api";
import { mdiArrowRight } from "@mdi/js";

import InterfaceForm from "../components/InterfaceForm.vue";
import TextInput from "../components/TextInput.vue";
import Button from "../components/Button.vue";

export default defineComponent({
    components: {
        InterfaceForm,
        TextInput,
        Button
    },
    props: {},
    setup() {
        const arrowRight = mdiArrowRight;
        const idRegex = /^\d+\.\d+\.\d+$/;

        const state = reactive({
            contractId: "",
            abi: ""
        });

        const isIdValid = computed(() => idRegex.test(state.contractId));

        const isJsonValid = computed(() => {
            try {
                JSON.parse(state.abi);
                return true;
            } catch (error) {
                return false;
            }
        });
        const isFormValid = computed(() => isIdValid.value && isJsonValid.value);

        return {
            arrowRight,
            state,
            isIdValid,
            isJsonValid,
            isFormValid
        };
    }
});
</script>
