    app.controller('mainController', function ($scope, $timeout, $firebase, $firebaseSimpleLogin, $sce, $modal, $log, $location, FIREBASE_URI) {


        $scope.state = {
            adminMode: false,
            message: '',
            showPicDetails: false
        };

        if($location.$$search['scatcher']) {
            $scope.state.adminMode = true;
        }

        $scope.trustHTML = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.reverse = function (items) {
            return items.reverse();
        };

        $scope.$watch('loginstate',function (newval,oldval) {
            if(newval){
                $scope.loginstatus = 'user '+ $scope.data.userInfo.username+' logged in'
            } else {
                $scope.loginstatus = 'not logged in'
            }
        });


        var ref = new Firebase(FIREBASE_URI + 'discussion').limit(20);

        $scope.messages = $firebase(ref);

        $scope.addMessage = function () {
            var userName = $scope.state.userName.length > 0 ? $scope.state.userName : 'Anonymous';
            $scope.messages.$add({user: userName, message: $scope.state.message, time: new Date()});
            $scope.state.message = '';
        };

        var postRef = new Firebase(FIREBASE_URI + 'posts');
        $scope.posts = $firebase(postRef);

        var linksRef = new Firebase(FIREBASE_URI + 'links');
        $scope.links = $firebase(linksRef);



        $scope.openModal = function (post) {

            var modalInstance = $modal.open({
                templateUrl: 'views/post_modal_view.html',
                controller: 'postEditModal',
                size: 'lg',
                resolve: {
                    posts: function() {
                        return $scope.posts;
                    },
                    post: function() {
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

    });
