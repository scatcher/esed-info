angular.module('esedInfo')
    .controller('adminController', function ($scope, $timeout, $firebase, $sce, $modal, $log) {

        var appVersion = '0.1.4';

    $scope.state = {
        message: '',
            showPicDetails: false,
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

    // Number of online users is the number of objects in the presence list.
    listRef.on("value", function (snap) {
        $timeout(function () {
            $scope.state.userCount = snap.numChildren();
            console.log("# of online users = " + snap.numChildren());
        }, 10);
    });

    $scope.openModal = function (posts, id) {

        var modalInstance = $modal.open({
            templateUrl: 'views/post_modal_view.html',
            controller: 'postEditModal',
            size: 'lg',
            resolve: {
                posts: function() {
                    return posts;
                },
                id: function() {
                    return id;
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
