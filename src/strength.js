/*!
 * strength.js
 * Original author: @aaronlumsden
 * Further changes, comments: @aaronlumsden
 * Licensed under the MIT license
 */
;(function ($, window, document, undefined) {

    var pluginName = 'strength',
        defaults = {
            strengthClass: 'strength',
            strengthMeterClass: 'strength_meter',
            strengthButtonClass: 'button_strength',
            strengthButtonText: 'Show Password',
            strengthButtonTextToggle: 'Hide Password',
            veryWeakLevelText: 'very weak',
            weakLevelText: 'weak',
            mediumLevelText: 'medium',
            strongLevelText: 'strong',
            strengthMeterText: 'Strength'
        };

    function Plugin(element, options) {
        this.element = element;
        this.$elem = $(this.element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function () {
            const upperCase = new RegExp('[A-Z]');
            const numbers = new RegExp('[0-9]');
            const specialchars = new RegExp('[!,%,&,@,#,$,^,*,?,_,~]');
            const disallowedCharacters = /[^0-9a-zA-Z!"#$%&\'()*+\-./:;<=>?@[\]^_`{|}~]/;

            const options = this.options;

            function checkStrength(thisval, thisid) {
                const passwordStrength = calculatePasswordStrength(thisval);
                updateThisMeter(passwordStrength, thisid);
            }

            function calculatePasswordStrength(value) {
                if (!value.length) {
                    return -1;
                }
                if (value.match(disallowedCharacters)) {
                    return -1;
                }

                const length = +(value.length >= 8);
                const capitalLetters = value.match(upperCase) ? 1 : 0;
                const number = value.match(numbers) ? 1 : 0;
                const special = value.match(specialchars) ? 1 : 0;

                return length + capitalLetters + number + special;
            }

            function updateThisMeter(total, thisId) {
                var thisMeter = $(`div[data-meter="${thisId}"]`);
                if (total == -1) {
                    thisMeter.removeClass().html(options.strengthMeterText);
                } else if (total <= 1) {
                    thisMeter.removeClass();
                    thisMeter.addClass('veryweak').html(options.veryWeakLevelText);
                } else if (total == 2) {
                    thisMeter.removeClass();
                    thisMeter.addClass('weak').html(options.weakLevelText);
                } else if (total == 3) {
                    thisMeter.removeClass();
                    thisMeter.addClass('medium').html(options.mediumLevelText);
                } else {
                    thisMeter.removeClass();
                    thisMeter.addClass('strong').html(options.strongLevelText);
                }
            }

            var isShown = false;
            var strengthButtonText = options.strengthButtonText;
            var strengthButtonTextToggle = options.strengthButtonTextToggle;

            thisid = this.$elem.attr('id');

            this.$elem.addClass(options.strengthClass).attr('data-password', thisid)
                .after(`<input style="display:none" class="${this.options.strengthClass}" data-password="${thisid}" type="text" name="" value=""><a data-password-button="${thisid}" href="" class="${options.strengthButtonClass}">${options.strengthButtonText}</a><div class="${options.strengthMeterClass}"><div data-meter="${thisid}">${options.strengthMeterText}</div></div>`);

            this.$elem.bind('keyup keydown', function (event) {
                thisval = $('#' + thisid).val();
                $(`input[type="text"][data-password="${thisid}"]`).val(thisval);
                checkStrength(thisval, thisid);
            });

            $(`input[type="text"][data-password="${thisid}"]`).bind('keyup keydown', function (event) {
                thisval = $(`input[type="text"][data-password="${thisid}"]`).val();
                $(`input[type="password"][data-password="${thisid}"]`).val(thisval);
                checkStrength(thisval, thisid);
            });

            $(document.body).on('click', '.' + options.strengthButtonClass, function (e) {
                e.preventDefault();

                thisclass = 'hide_' + $(this).attr('class');

                if (isShown) {
                    $(`input[type="text"][data-password="${thisid}"]`).hide();
                    $(`input[type="password"][data-password="${thisid}"]`).show().focus();
                    $(`a[data-password-button="${thisid}"]`).removeClass(thisclass).html(strengthButtonText);
                    isShown = false;
                } else {
                    $(`input[type="text"][data-password="${thisid}"]`).show().focus();
                    $(`input[type="password"][data-password="${thisid}"]`).hide();
                    $(`a[data-password-button="${thisid}"]`).addClass(thisclass).html(strengthButtonTextToggle);
                    isShown = true;
                }
            });
        },
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
