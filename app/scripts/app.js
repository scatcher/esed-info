'use strict';

function fakeNgModel(initValue) {
    return {
        $setViewValue: function (value) {
            this.$viewValue = value;
        },
        $viewValue: initValue
    };
}

navigator.sayswho = (function(){
    var ua= navigator.userAgent, tem,
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/)
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

// Declare app level module which depends on filters, and services
angular.module('esedInfo', [ 'ngSanitize', 'firebase', 'ui.bootstrap', 'textAngular'])
    .controller('chatController', function ($scope, $timeout, $firebase, $sce) {

        var appVersion = '0.1.2';

        $scope.state = {
            message: '',
            userName: '',
            userCount: '?'
        };

        $scope.trustHTML = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.reverse = function (items) {
            return items.reverse();
        };

        var ref = new Firebase('https://esed-info.firebaseio.com/discussion').limit(50);

        $scope.messages = $firebase(ref);

        $scope.addMessage = function () {
            var userName = $scope.state.userName.length > 0 ? $scope.state.userName : 'Anonymous';
            $scope.messages.$add({user: userName, message: $scope.state.message, time: new Date()});
            $scope.state.message = '';
        };

        var postRef = new Firebase('https://esed-info.firebaseio.com/posts');
        $scope.posts = $firebase(postRef);

        var linksRef = new Firebase('https://esed-info.firebaseio.com/links');
        $scope.links = $firebase(linksRef);


        var listRef = new Firebase("https://esed-info.firebaseio.com/presence/");
        var userRef = listRef.push();

        // Add ourselves to presence list when online.
        var presenceRef = new Firebase("https://esed-info.firebaseio.com/.info/connected");
        presenceRef.on("value", function (snap) {
            if (snap.val()) {
                userRef.set({
                    version: appVersion,
                    connected: new Date().getTime(),
                    browser: navigator.sayswho
                });
                // Remove ourselves when we disconnect.
                userRef.onDisconnect().remove();
            }
        });

        // Allows us to manually refresh browser for all users
        var reloadRef = new Firebase("https://esed-info.firebaseio.com/utility/reloadtrigger");
        $scope.reloadTrigger = $firebase(reloadRef);

        var reloadTriggerInitialized = false;

        $scope.reloadTrigger.$on('change', function () {
            if(!reloadTriggerInitialized) {
                reloadTriggerInitialized = true;
            } else {
                location.reload();
            }
        });

        // Number of online users is the number of objects in the presence list.
        listRef.on("value", function (snap) {
            $timeout(function () {
                $scope.state.userCount = snap.numChildren();
                console.log("Online " + snap.numChildren());
            }, 10);
        });
    })
    .controller('adminController', function ($scope, $timeout, $firebase, $sce, $modal, $log) {

        $scope.state = {
            message: '',
            userName: '',
            userCount: '?'
        };

        $scope.trustHTML = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.reverse = function (items) {
            return items.reverse();
        };

        var ref = new Firebase('https://esed-info.firebaseio.com/discussion').limit(50);

        $scope.messages = $firebase(ref);

        $scope.addMessage = function () {
            var userName = $scope.state.userName.length > 0 ? $scope.state.userName : 'Anonymous';
            $scope.messages.$add({user: userName, message: $scope.state.message, time: new Date()});
            $scope.state.message = '';
        };

        var postRef = new Firebase('https://esed-info.firebaseio.com/posts');
        $scope.posts = $firebase(postRef);


        var listRef = new Firebase("https://esed-info.firebaseio.com/presence/");
        var userRef = listRef.push();

        // Add ourselves to presence list when online.
        var presenceRef = new Firebase("https://esed-info.firebaseio.com/.info/connected");
        presenceRef.on("value", function (snap) {
            if (snap.val()) {
                userRef.set(true);
                // Remove ourselves when we disconnect.
                userRef.onDisconnect().remove();
            }
        });

        // Number of online users is the number of objects in the presence list.
        listRef.on("value", function (snap) {
            $timeout(function () {
                $scope.state.userCount = snap.numChildren();
                console.log("# of online users = " + snap.numChildren());
            }, 10);
        });

        $scope.openModal = function (post) {

            var modalInstance = $modal.open({
                templateUrl: 'views/post_modal_view.html',
                controller: 'postEditModal',
                size: 'lg',
                resolve: {
                    post: function () {
                        return post;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    })
    .controller('postEditModal', function ($scope, $modalInstance, $firebase, $sce, post) {

        var defaults = {
            date: new Date(),
            contents: '',
            order: 0,
            publish: false
        };

        if (post) {
            $scope.post = post;
//            $scope.post = _.extend({}, defaults, post);
        } else {
            $scope.post = defaults;
        }

        console.log(post);
        $scope.save = function () {
            _.extend(post, $scope.post);
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    })
    .directive('shakeCounter', function ($timeout) {
        return {
            restrict: "A",
            replace: false,
            template: '<span class="label label-danger rotate" ng-bind="count"></span> ',
            scope: {
                count: "="
            },
            link: function (scope, element, attrs) {

                scope.$watch('count', function () {
                    $(element).effect({
                        effect: 'bounce',
                        duration: 800
                    });
                });
            }
        }
    })
    .directive('scrollGlue', function () {
        return {
            priority: 1,
            require: ['?ngModel'],
            restrict: 'A',
            link: function (scope, $el, attrs, ctrls) {
                var el = $el[0],
                    ngModel = ctrls[0] || fakeNgModel(true);

                function scrollToBottom() {
                    el.scrollTop = el.scrollHeight;
                }

                function shouldActivateAutoScroll() {
                    // + 1 catches off by one errors in chrome
                    return el.scrollTop + el.clientHeight + 1 >= el.scrollHeight;
                }

                scope.$watch(function () {
                    if (ngModel.$viewValue) {
                        scrollToBottom();
                    }
                });

                $el.bind('scroll', function () {
                    var activate = shouldActivateAutoScroll();
                    if (activate !== ngModel.$viewValue) {
                        scope.$apply(ngModel.$setViewValue.bind(ngModel, activate));
                    }
                });
            }
        };
    })
    .filter('reverse', function () {
        return function (items) {
            if (items instanceof Array) {
                return items.slice().reverse();
            }
        };
    });
