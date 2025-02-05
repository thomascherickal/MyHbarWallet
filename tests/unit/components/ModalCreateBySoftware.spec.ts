import { createLocalVue, mount } from "@vue/test-utils";
import VueCompositionApi from "@vue/composition-api";
import VueRouter from "vue-router";
import VueI18n from "vue-i18n";

import ModalCreateWithSoftware from "../../../src/ui/components/ModalCreateBySoftware.vue";
import router from "../../../src/ui/router";
import i18n from "../../../src/service/i18n";

describe("ModalCreateWithSoftware.vue", (): void => {
    const localVue = createLocalVue();
    localVue.use(VueCompositionApi);
    localVue.use(VueRouter);
    localVue.use(VueI18n);

    it("renders open", async (): Promise<void> => {
        expect.assertions(1);

        const onChange = jest.fn();
        const wrapper = mount(ModalCreateWithSoftware, {
            localVue,
            i18n,
            router,
            propsData: { isOpen: true },
            listeners: { change: onChange }
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const modal = wrapper.vm.$children.find(
            child => child.$options.name === "Modal"
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        modal!.showModal();
        await localVue.nextTick();

        expect(wrapper).toMatchInlineSnapshot(`
            <transition-stub name="fade">
              <div role="dialog" aria-modal="true" class="modal-background">
                <transition-stub name="slidefade">
                  <div class="modal">
                    <header><span class="title">Create with Software</span> <svg width="24" height="24" viewBox="0 0 24 24" class="close">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
                      </svg></header>
                    <!---->
                    <div class="main">
                      <div class="content-container">
                        <form class="modal-access-by-software">
                          <div class="radio-button-group">
                            <div><label for="file" class="radio-button"><img alt="" src="" class="icon"> <input id="file" type="radio" name="software-access-option" class="input" value="file"> <span class="label">Keystore File</span>
                                <!---->
                              </label></div>
                            <div><label for="phrase" class="radio-button"><img alt="" src="" class="icon"> <input id="phrase" type="radio" name="software-access-option" class="input" value="phrase"> <span class="label">Mnemonic Phrase</span>
                                <!---->
                              </label></div>
                          </div>
                          <div class="hardware-link"><a href="/hardware-wallet-affiliates" class="">
                              Purchase a hardware wallet
                            </a>
                            for the highest security when accessing your crypto.
                          </div> <button type="submit" disabled="disabled" class="">
                            <!----> <span>Continue</span>
                            <!---->
                          </button>
                          <div class="customer-support-link support-link">
                            <div class="customer-support-container"><img alt="" src="">Customer Support
                            </div>
                            <modal title="Issue Information">
                              <form class="modal-issue-information">
                                <!---->
                                <!---->
                                <div class="text-input issue-item"><label class="label-container">
                                    <!----> <span class="input-container"><!----> <span class="input-wrapper"><div class="flex-container"><div class="text-flex-item"><input placeholder="Device/Wallet type (if any)" type="text" autocomplete="on" spellcheck="true"></div> <div class="deco-flex-item"><!----></div></div></span>
                                    <!----></span>
                                  </label>
                                  <!---->
                                  <!---->
                                </div>
                                <div class="text-input issue-item"><label class="label-container">
                                    <!----> <span class="input-container"><!----> <span class="input-wrapper"><div class="flex-container"><div class="text-flex-item"><input placeholder="Account ID (if any)" type="text" autocomplete="on" spellcheck="true"></div> <div class="deco-flex-item"><!----></div></div></span>
                                    <!----></span>
                                  </label>
                                  <!---->
                                  <!---->
                                </div>
                                <!---->
                                <div class="text-input issue-item is-multiline"><label class="label-container">
                                    <!----> <span class="input-container"><!----> <span class="input-wrapper"><div class="flex-container"><div class="text-flex-item"><textarea placeholder="Describe the issue" rows="8" class="text-area resize"></textarea></div> <div class="deco-flex-item"><!----></div></div></span>
                                    <!----></span>
                                  </label>
                                  <!---->
                                  <!---->
                                </div> <button type="submit" class="send-button compact">
                                  <!----> <span>Send</span>
                                  <!---->
                                </button>
                              </form>
                            </modal>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </transition-stub>
              </div>
            </transition-stub>
        `);
    });
});
