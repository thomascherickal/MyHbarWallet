import { createLocalVue, mount } from "@vue/test-utils";
import VueCompositionApi from "@vue/composition-api";
import VueI18n from "vue-i18n";

import ModalAccessByPrivateKey from "../../../src/ui/components/ModalAccessByPrivateKey.vue";
import i18n from "../../../src/service/i18n";

describe("ModalAccessByPrivateKey.vue", (): void => {
    const localVue = createLocalVue();
    localVue.use(VueCompositionApi);
    localVue.use(VueI18n);

    const PRIVATE_KEY =
        "302e020100300506032b657004220420aff973d1405b55398a3e7edec946ae9a2d86870c82babb04624c92e2be8c6e38";

    it("renders open, not busy", async (): Promise<void> => {
        expect.assertions(1);

        const onChange = jest.fn();
        const wrapper = mount(ModalAccessByPrivateKey, {
            localVue,
            i18n,
            propsData: {
                state: {
                    isOpen: true,
                    rawPrivateKey: PRIVATE_KEY,
                    isBusy: false
                }
            },
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
                    <header><span class="title">Access by Private Key</span> <svg width="24" height="24" viewBox="0 0 24 24" class="close">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
                      </svg></header>
                    <!---->
                    <div class="main">
                      <div class="content-container">
                        <form class="modal-access-by-private-key">
                          <div class="text-input"><label class="label-container">
                              <!----> <span class="input-container"><!----> <span class="input-wrapper"><div class="flex-container"><div class="text-flex-item"><input placeholder="Enter Private Key" type="text" autocomplete="on" spellcheck="false"></div> <div class="deco-flex-item"><span class="decorations"><svg width="24" height="24" viewBox="0 0 24 24" class="checkmark"><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"></path></svg></span></div>
                      </div></span>
                      <!----></span></label>
                      <!---->
                      <!---->
                    </div> <button type="submit" disabled="disabled" class="button-access-wallet">
                      <!----> <span>Access Account</span>
                      <!---->
                    </button>
                    <div class="customer-support-link">
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
                          <div class="text-input issue-item"><label class="label-container">
                              <!----> <span class="input-container"><!----> <span class="input-wrapper"><div class="flex-container"><div class="text-flex-item"><input placeholder="URL" type="text" autocomplete="on" spellcheck="true"></div> <div class="deco-flex-item"><!----></div></div></span>
                              <!----></span>
                            </label>
                            <!---->
                            <!---->
                          </div>
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

    it("renders open, busy", async (): Promise<void> => {
        expect.assertions(1);

        const onChange = jest.fn();
        const wrapper = mount(ModalAccessByPrivateKey, {
            localVue,
            i18n,
            propsData: {
                state: {
                    isOpen: true,
                    rawPrivateKey: PRIVATE_KEY,
                    isBusy: true
                }
            },
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
                    <header><span class="title">Access by Private Key</span> <svg width="24" height="24" viewBox="0 0 24 24" class="close">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
                      </svg></header>
                    <!---->
                    <div class="main">
                      <div class="content-container">
                        <form class="modal-access-by-private-key">
                          <div class="text-input"><label class="label-container">
                              <!----> <span class="input-container"><!----> <span class="input-wrapper"><div class="flex-container"><div class="text-flex-item"><input placeholder="Enter Private Key" type="text" autocomplete="on" spellcheck="false"></div> <div class="deco-flex-item"><span class="decorations"><svg width="24" height="24" viewBox="0 0 24 24" class="checkmark"><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"></path></svg></span></div>
                      </div></span>
                      <!----></span></label>
                      <!---->
                      <!---->
                    </div> <button type="submit" disabled="disabled" class="button-access-wallet busy"><svg width="24" height="24" viewBox="0 0 24 24" class="spinner mdi-spin">
                        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"></path>
                      </svg>
                      <!---->
                      <!---->
                    </button>
                    <div class="customer-support-link">
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
                          <div class="text-input issue-item"><label class="label-container">
                              <!----> <span class="input-container"><!----> <span class="input-wrapper"><div class="flex-container"><div class="text-flex-item"><input placeholder="URL" type="text" autocomplete="on" spellcheck="true"></div> <div class="deco-flex-item"><!----></div></div></span>
                              <!----></span>
                            </label>
                            <!---->
                            <!---->
                          </div>
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
