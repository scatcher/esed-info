//app.controller('navbarCtrl', function ($scope, $timeout, $firebase, $firebaseSimpleLogin, $modal, FIREBASE_URI, appVersion, loginService) {
app.controller('navbarCtrl', function ($scope, $timeout, $firebaseArray, $modal, FIREBASE_URI, appVersion, loginService) {

    $scope.state = {
        loginMode: false,
        email: '',
        password: '',
        userCount: '?'
    };

    $scope.currentUser = loginService.currentUser;


    var listRef = new Firebase(FIREBASE_URI + 'presence/');
    var userRef = listRef.push();

    $scope.cancelLogin = function () {
        $scope.state.email = '';
        $scope.state.password = '';
        $scope.state.loginMode = false;
    };
    
    $scope.login = function () {
        loginService.login($scope.state.email, $scope.state.password)
            .then(function (error, user) {
                window.console.log(error);
                window.console.log(user);
            })
    };

    // Add ourselves to presence list when online.
    var presenceRef = new Firebase(FIREBASE_URI + '.info/connected');
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
    var reloadRef = new Firebase(FIREBASE_URI + 'utility/reloadtrigger');
    $scope.reloadTrigger = $firebaseArray(reloadRef);

    var reloadTriggerInitialized = false;

    $scope.reloadTrigger.$watch(function () {
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



});
