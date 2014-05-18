'use strict';

function fakeNgModel(initValue) {
    return {
        $setViewValue: function (value) {
            this.$viewValue = value;
        },
        $viewValue: initValue
    };
}

navigator.sayswho = (function () {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) return 'Opera ' + tem[1];
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

// Declare app level module which depends on filters, and services
var app = angular.module('esedInfo', [ 'ngSanitize', 'firebase', 'ui.bootstrap', 'textAngular', 'ui.router', 'toastr']);

app.constant('FIREBASE_URI', 'https://esed-info.firebaseio.com/');
app.constant('appVersion', '0.1.6');


app.config(function ($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/');

    // Now set up the states
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/main_view.html',
            controller: 'mainController'
        })

});

app.run(function ($rootScope) {
    $rootScope.loginstate = false;

    $rootScope.$on('fireuser:login',function (evt,user) {
        $rootScope.loginstate = true;
    })

    $rootScope.$on('fireuser:logout',function () {
        $rootScope.loginstate = false;

    })
})
