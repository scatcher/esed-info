angular.module('esedInfo')
    .filter('reverse', function () {
        return function (items) {
            if (items instanceof Array) {
                return items.slice().reverse();
            }
        };
    });
