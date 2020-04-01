var cc_activate_flags = [];
function cc_m2_c2a(){
	/**
	 * wait for form to exist before continuing
	 * (needed on sites that load page elements
	 * via multiple ajax requests)
	 */
	if (jQuery('[name="postcode"]').length == 0) {
		return;
	}

	jQuery('[name="postcode"]').each(function(index,elem){
		if(jQuery(elem).data('cc_attach') != '1'){
			jQuery(elem).data('cc_attach','1');
			var form = jQuery(elem).closest('form');

			var custom_id = '';
			if(c2a_config.advanced.search_elem_id !== null){
				custom_id = ' id="'+ c2a_config.advanced.search_elem_id +'"'
			}

			// null fix for m2_1.1.16
			if (c2a_config.texts.search_label == null) c2a_config.texts.search_label = '';

			var tmp_html = '<div class="field"'+custom_id+'><label class="label">' +
							c2a_config.texts.search_label+'</label>' +
							'<div class="control"><input class="cc_search_input" type="text"/></div></div>';

			if (!c2a_config.advanced.use_first_line) {
				form.find('#street_1').closest('.field').before( tmp_html );
			} else {
				form.find('#street_1').addClass('cc_search_input');
			}
			if (c2a_config.advanced.lock_country_to_dropdown) {
				form.find('.cc_search_input').closest('div.field').before(form.find('[name="country_id"]').closest('div.field'));
			}

			var config = {
				accessToken: c2a_config.key,
				dom: {
					search:		form.find('.cc_search_input')[0],
					company:	form.find('[name="company"]')[0],
					line_1:		form.find('#street_1')[0],
					line_2:		form.find('#street_2')[0],
					postcode:	form.find('[name="postcode"]')[0],
					town:		form.find('[name="city"]')[0],
					county:		{
						input:	form.find('[name="region"]'),
						list:	form.find('[name="region_id"]')
					},
					country:	form.find('[name="country_id"]')[0]
				},
				onSetCounty: function(c2a, elements, county){
					return
				},
				domMode: 'object',
				gfxMode: c2a_config.gfx_mode,
				style: {
					ambient: c2a_config.gfx_ambient,
					accent: c2a_config.gfx_accent
				},
				showLogo: false,
				texts: c2a_config.texts,
				onResultSelected: function(c2a, elements, address){
					switch(address.country_name) {
						case 'Jersey':
							jQuery(elements.country).val('JE')
							break;
						case 'Guernsey':
							jQuery(elements.country).val('GG')
							break;
						case 'Isle of Man':
							jQuery(elements.country).val('IM')
							break;
						default:
							jQuery(elements.country).val(address.country.iso_3166_1_alpha_2);
					}
					// var event = new Event('change')
					if (typeof elements.country != 'undefined') { triggerEvent('change', elements.country)}

					var county = {
						preferred: address.province,
						code: address.province_code,
						name: address.province_name
					};

					if(elements.county.list.length == 1){
						c2a.setCounty(elements.county.list[0], county);
					}
					if(elements.county.input.length == 1){
						c2a.setCounty(elements.county.input[0], county);
					}

					if (typeof elements.county.input[0] != 'undefined') triggerEvent('change', elements.county.input[0]);
					if (typeof elements.county.list[0] != 'undefined') triggerEvent('change', elements.county.list[0]);
					if (typeof elements.company != 'undefined') triggerEvent('change', elements.company);
					if (typeof elements.line_1 != 'undefined') triggerEvent('change', elements.line_1);
					if (typeof elements.line_2 != 'undefined') triggerEvent('change', elements.line_2);
					if (typeof elements.postcode != 'undefined') triggerEvent('change', elements.postcode);
					if (typeof elements.town != 'undefined') triggerEvent('change', elements.town);
				},
				transliterate: c2a_config.advanced.transliterate,
				debug: c2a_config.advanced.debug,
				cssPath: false,
				tag: 'Magento 2'
			};
			if(typeof c2a_config.enabled_countries !== 'undefined'){
				config.countryMatchWith = 'iso_2';
				config.enabledCountries = c2a_config.enabled_countries;
			}
			if(c2a_config.advanced.lock_country_to_dropdown){
				config.countrySelector = false;
				config.onSearchFocus = function(c2a, dom){
					var currentCountry = dom.country.options[dom.country.selectedIndex].value;
					if(currentCountry !== ''){
						var countryCode = getCountryCode(c2a, currentCountry, 'iso_2');
						c2a.selectCountry(countryCode);
					}
				};
			}

			new clickToAddress(config);
		}
	});
}
requirejs(['jquery'], function( $ ) {
	jQuery( document ).ready(function() {
		if(c2a_config.enabled && c2a_config.key != null){
			setInterval(cc_m2_c2a,200);
		}

		if(c2a_config.enabled && c2a_config.key == null){
			console.warn('ClickToAddress: Incorrect token format supplied');
		}
	});
});

function triggerEvent(eventName, target){
	var event;
	if (typeof(Event) === 'function') {
		 event = new Event(eventName);
	} else {
		 event = document.createEvent('Event');
		 event.initEvent(eventName, true, true);
	}
	target.dispatchEvent(event);
}