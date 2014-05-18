app.service('loginService', function ($firebaseSimpleLogin, $firebase, $rootScope, $log, FIREBASE_URI) {
    var self = this;

    var auth = $firebaseSimpleLogin(new Firebase(FIREBASE_URI));

    self.currentUser = null;

    self.getCurrentUser = function () {
        auth.$getCurrentUser()
            .then(function (user) {
                self.currentUser = user;
                console.log(user);
            });
    };

    self.getCurrentUser();
    
    self.logout = function () {
        auth.$logout();
        self.currentUser = null;
    };

    self.login = function (email, password) {
        return auth.$login('password', {email: email, password: password})
            .then(function (user) {
                self.currentUser = user;
            });
    };
    
//    var config = {
//        dataLocation:'data',
//        userData:'user',
//        userLoggedIn: false
//    };
//    
//    // create data scope 
//    $rootScope[config.dataLocation] = {};
//    $rootScope[config.dataLocation].userLoggedIn = false;
//
//    // Possible events broadcasted by this service
//    this.USER_CREATED_EVENT = 'LoginService:user_created';
//    this.LOGIN_EVENT = 'LoginService:login';
//    this.LOGIN_ERROR_EVENT = 'LoginService:login_error';
//    this.LOGOUT_EVENT = 'LoginService:logout';
//    this.USER_DATA_CHANGED_EVENT = 'LoginService:data_changed';
//    this.USER_DATA_LOADED_EVENT = 'LoginService:data_loaded';
//    this.USER_CREATION_ERROR_EVENT = 'LoginService:user_creation_error';
//
//
//    // kickoff the authentication call (fires events $firebaseAuth:* events)
//
//    var auth = $firebaseSimpleLogin(new Firebase(FIREBASE_URI));
//    var self = this;
//    var unbind = null;
//
//    $rootScope.$on('$firebaseSimpleLogin:logout', function() {
//        $rootScope[config.dataLocation].userLoggedIn = false;
//
//        $rootScope.$broadcast(self.LOGOUT_EVENT);
//    });
//
//    $rootScope.$on('$firebaseSimpleLogin:error', function(error) {
//        $rootScope.$broadcast(self.LOGIN_ERROR_EVENT,error);
//        $log.info('There was an error during authentication.', error);
//    });
//
//    $rootScope.$on('$firebaseSimpleLogin:login', function(evt, user) {
//
//        var FirebaseUrl = new Firebase(FIREBASE_URI + config.dataLocation + '/' + user.id);
//
//        var _angularFireRef = $firebase(FirebaseUrl);
//
//        var userDataLocation = config.dataLocation+'.'+config.userData;
//
//        _angularFireRef.$bind($rootScope, userDataLocation).then(function(unb) {
//            unbind = unb;
//        });
//
//        $rootScope[config.dataLocation].userInfo = user;
//        $rootScope[config.dataLocation].userLoggedIn = true;
//
//        _angularFireRef.$on('loaded', function(data) {
//            $rootScope.$broadcast(self.USER_DATA_LOADED_EVENT, data);
//        });
//
//        _angularFireRef.$on('change', function(data) {
//            $rootScope.$broadcast(self.USER_DATA_CHANGED_EVENT, data);
//        });
//
//        $rootScope.$broadcast(self.LOGIN_EVENT, user);
//    });
//
//    this.createUser = function (user) {
//
//        var userCreationSuccess = function () {
//            $rootScope.$broadcast(self.USER_CREATED_EVENT, user);
//            $log.info('User created - User Id: ' + user.id + ', Email: ' + user.email);
//        };
//
//        var userCreationError = function (error) {
//            $rootScope.$broadcast(self.USER_CREATION_ERROR_EVENT,error);
//            $log.error(error);
//        };
//
//        var createUser = auth.$createUser(user.email, user.password)
//            .then(userCreationSuccess, userCreationError);
//
//        return createUser;
//    };
//
//    this.login = function(type, user) {
//        if(type === 'password'){
//            auth.$login('password',{
//                email: user.email,
//                password: user.password
//            }).then(function(user) {
//                console.log('Logged in as: ', user.uid);
//            }, function(error) {
//                console.error('Login failed: ', error);
//            });
//        } else {
//            auth.$login(type);
//        }
//    };
//    
//    this.logout = function() {
//        $rootScope[config.dataLocation].userLoggedIn = false;
//        unbind();
//        auth.$logout();
//    };
//
//    this.changePassword = function (email, oldPassword, newPassword,callback) {
//        auth.changePassword(email, oldPassword, newPassword, callback);
//    };
//
//    this.sendPasswordResetEmail =function ( email, callback ) {
//        auth.sendPasswordResetEmail(email,callback);
//    };

    return this;

});