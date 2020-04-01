/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'ko',
    'jquery',
    'uiComponent',
    'Codazon_OneStepCheckout/js/model/agreements-modal',
    'Magento_Customer/js/model/customer',
    'Magento_Checkout/js/model/quote'
], function (ko, $, Component, agreementsModal, customer, quote) {
    'use strict';

    var checkoutConfig = window.checkoutConfig,
        agreementManualMode = 1,
        agreementsConfig = checkoutConfig ? checkoutConfig.checkoutAgreements : {};

    return Component.extend({
        defaults: {
            template: 'Codazon_OneStepCheckout/checkout/checkout-agreements'
        },
        isVisible: agreementsConfig.isEnabled,
        agreements: agreementsConfig.agreements,
        modalTitle: ko.observable(null),
        modalContent: ko.observable(null),
        modalWindow: null,

        /**
         * Checks if agreement required
         *
         * @param {Object} element
         */
        isAgreementRequired: function (element) {
            return element.mode == agreementManualMode; //eslint-disable-line eqeqeq
        },

        /**
         * Show agreement content in modal
         *
         * @param {Object} element
         */
        showContent: function (element) {
            this.modalTitle(element.checkboxText);
            this.modalContent(element.content);
            agreementsModal.showModal();
        },

        /**
         * build a unique id for the term checkbox
         *
         * @param {Object} context - the ko context
         * @param {Number} agreementId
         */
        getCheckboxId: function (context, agreementId) {
            var paymentMethodName = '',
                paymentMethodRenderer = context.$parents[1];

            // corresponding payment method fetched from parent context
            if (paymentMethodRenderer) {
                // item looks like this: {title: "Check / Money order", method: "checkmo"}
                paymentMethodName = paymentMethodRenderer.item ?
                  paymentMethodRenderer.item.method : '';
            }

            return 'agreement_' + paymentMethodName + '_' + agreementId;
        },

        /**
         * Init modal window for rendered element
         *
         * @param {Object} element
         */
        initModal: function (element) {
            agreementsModal.createModal(element);
        },

        changeHandler: function(data, event){
            $("#checkout-payment-method-load input[name='agreement[" + data.agreementId + "]']").click();
            $(event.target).next().click();
            return true;
        },
        validateForm: function (form) {
            return $(form).validation() && $(form).validation('isValid');
        },
        placeOrder: function(){
            if(this.validateForm('#checkout_agreements_block')){
                //$("#co-payment-form ._active button[type='submit']").click();
                
                if($('#submit-shipping-method').length){//if not virtual product
                    //block select shipping method update price function.
                    customer.placeorder = true;
                    //=== fake next click to get total update ===
                    $('#submit-shipping-method').click();
                }else{
                    if($("#co-payment-form ._active input[name='billing-address-same-as-shipping']:first").is(':checked')){
                        quote.billingAddress = quote.shippingAddress;
                    }
                    $("#co-payment-form ._active button[type='submit']").click();
                }
            }
        },
    });
});
