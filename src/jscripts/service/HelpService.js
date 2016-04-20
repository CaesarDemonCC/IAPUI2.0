app.factory('Help', function ($document, $http) {
    var testEntries = {
        'networks-name' : 'Name (SSID) for this Network.',
        'aps-name': 'Name of this Access Point.'
    };

    var helpAdviceInfo = 'For help, click any text in',
        helpAdviceInfoGreen = 'green italics';

    var helpAdviceHtml = '<div class="help-advice-dialog" id="help-advice-dialog">'
                            + '<span class="help-advice-info">' + helpAdviceInfo + '</span>'
                            + '<span class="help-advice-info-green help-mode">'+ helpAdviceInfoGreen +'</span>'
                            + '</div>';
                            var helpPickerHtml = '<div class="help-content" id="help-text"></div>';
    var body = $document.find('body');

    function calcAbsPosition (el) {
        var top = 0;
        var left = 0;
        while (el && el.tagName != 'body') {
            if (el.offsetTop) {
                
                left += parseInt(el.offsetLeft, 10);
                top += parseInt(el.offsetTop, 10);

            }
            if (el.offsetParent) {
                el = el.offsetParent;
            } else {
                break;
            }
        }
        return [left, top];
    }

    function bindClick (id, el, scope) {
        el.onclick = function () {
            var text = scope.strings_[id];
            scope.show(id, text);
        };
    }

    function Helper () {
        this.on = false;
        this.helpPicker = null;
        this.dialog = null;
        this.strings_ = null;
        this.helpEls = [];
        this.init();
    };

    Helper.prototype.init = function () {
        this.strings_ = testEntries;
    };
    Helper.prototype.initHelpElements = function () {
        if (this.on) {
            if (this.strings_) {
                var self = this;

                for (var helpId in this.strings_) {
                    var el = document.getElementById(helpId);
                    if (el) {
                        angular.element(el).addClass('help-mode');

                        bindClick(helpId, el, self);
                        
                        this.helpEls.push(el);
                    }
                }
            }
        }
    };
    Helper.prototype.switchOnOff = function (on) {
        this.on = on;
        if (on) {
            this.showAdvice();
            this.initHelpElements();
        } else {
            this.hideAdvice();
        }
        
    };
    Helper.prototype.showAdvice = function () {
        if (this.on) {
            if (!this.dialog) {
                body.append(helpAdviceHtml);
                this.dialog = document.getElementById('help-advice-dialog');
            } else {
                this.dialog.style.display = 'block';
            }
            
        }
    };
    Helper.prototype.hideAdvice = function () {
        for (var i = 0; i < this.helpEls.length; i++) {
            var el = this.helpEls.pop();
            el.onclick = null;
            angular.element(el).removeClass('help-mode');
        }

        this.destory();
    };

    Helper.prototype.show = function (el_id, text) {
        var el = document.getElementById(el_id);
        var self = this;
        if (!this.helpPicker) {
            body.append(helpPickerHtml);
            this.helpPicker = document.getElementById('help-text');
        } else {
            this.hide();
        }
        angular.element(this.helpPicker).append(text);

        var topLeft = calcAbsPosition(el);
        
        this.helpPicker.style.left = (topLeft[0] + 10) + 'px';
        this.helpPicker.style.top =  (topLeft[1] - 30) + 'px';
        this.helpPicker.style.display = '';
        this.helpPicker.onclick = function () {
            self.hide();
        }
    };
    Helper.prototype.hide = function () {
        if (this.helpPicker) {
            this.helpPicker.onclick = null;
            angular.element(this.helpPicker).empty();
            this.helpPicker.style.display = 'none';
        }
    };

    Helper.prototype.destory = function () {

        if (this.helpPicker) {
            this.hide();
            this.helpPicker.remove();
            this.helpPicker = null;
        }

        if (this.dialog) {
            this.dialog.style.display = 'none';
            
            this.dialog.remove();
            this.dialog = null;
        }
    };

    return new Helper();
});