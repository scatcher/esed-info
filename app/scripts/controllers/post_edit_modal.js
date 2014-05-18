angular.module('esedInfo')
    .controller('postEditModal', function ($scope, $modalInstance, $firebase, $sce, posts, post) {

        var defaults = {
            date: new Date(),
            contents: '',
            order: 0,
            publish: true,
            timestamp: new Date().toISOString()
        };

        if (post) {
            $scope.post = angular.copy(post);
        } else {
            var maxOrder = 0;
            _.each(posts, function(p) {
                if(p.order && _.isNumber(p.order) && p.order > maxOrder) {
                    maxOrder = p.order;
                }
            });
            defaults.order = maxOrder + 1;
            $scope.post = defaults;
        }

        console.log($scope.post);
        $scope.save = function () {
            if(post) {
                /** Update existing object */
                _.extend(post, $scope.post);
                posts.$save(post.$id);
            } else {
                /** Create new object */
                posts.$add($scope.post);
            }
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });