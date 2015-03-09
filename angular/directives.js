'use strict';

angular.module('dlDirectives', [])

.directive('dlFocus', ['$timeout', function($timeout) {
    return {
        scope: {
            dlFocus: '@'
        },
        link: function(scope, element) {
            function doFocus() {
                $timeout(function() {
                    element[0].focus();
                });
            }

            if (scope.dlFocus != null) {
                if (scope.dlFocus !== 'false') {
                    doFocus();
                }

                scope.$watch('dlFocus', function(value) {
                    if (value === 'true') {
                        doFocus();
                    }
                });
            }
            else {
                doFocus();
            }
        }
    };
}])

.directive('dlDisabling', ['Events', function(Events) {
    return {
        link: function(scope, element) {
            scope.$on('disableViewEvent', function(e, val) {
                var isAnchor = (element[0].localName === 'a');
                if (val === true) {
                    if (isAnchor) {
                        element.removeAttr("href");
                    } else {
                        element.attr("disabled", "disabled");
                    }
                } else {
                    if (isAnchor) {
                        element.attr("href", "");
                    } else {
                        element.removeAttr("disabled");
                    }
                }
            });
        }
    };
}])

.directive('dlCompareTo', function() {
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: '=dlCompareTo'
        },
        link: function(scope, element, attrs, ngModel) {
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch('otherModelValue', function() {
                ngModel.$validate();
            });
        }
    };
})
/*
EXAMPLE:
<fieldset class="form-group">
    <label class="form-label" for="newPassword">New Password</label>
    <input id="newPassword" name="newPassword" ng-model="password.new" class="form-element password" type="password" ng-class="{'has-error': changePassForm.newPassword.$invalid && changePassForm.newPassword.$touched}" id-disabling required>
</fieldset>

<fieldset class="form-group">
    <label class="form-label" for="confirmPassword">Confirm</label>
    <input id="confirmPassword" name="confirmPassword" ng-model="password.confirm" class="form-element password" type="password" ng-class="{'has-error': changePassForm.confirmPassword.$invalid && changePassForm.confirmPassword.$touched}" id-disabling required id-compare-to="password.new">
    <span class="error-msg-inline" ng-show="changePassForm.confirmPassword.$invalid && changePassForm.confirmPassword.$touched">passwords much match</span>
</fieldset>
*/

.directive('dlAutoSize', ['$timeout', function($timeout) {
    return {
        link: function(scope, element) {
            function resize() {
                if (element[0].scrollHeight < 1) {
                    return;
                }
                while(element[0].clientHeight >= element[0].scrollHeight) {
                    element[0].style.height = parseInt(getComputedStyle(element[0]).getPropertyValue('height'), 10) - 1 + "px";
                }
                while(element[0].clientHeight < element[0].scrollHeight) {
                    element[0].style.height = parseInt(getComputedStyle(element[0]).getPropertyValue('height'), 10) + 1 + "px";
                }
            }

            element.css('overflow', 'hidden');
            element.bind('keyup', function() {resize()});

            $timeout(function() {
                resize();
            });
        }
    };
}]);