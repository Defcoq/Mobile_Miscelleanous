// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var FirebaseToDoApp = angular.module('starter', ['ionic', 'firebase', 'ngCordovaOauth']);
var fb = null;
FirebaseToDoApp.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        fb = new Firebase("https://ionicjpebook.firebaseio.com");
    });
});

FirebaseToDoApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })
    .state('todo', {
        url: '/todo',
        templateUrl: 'templates/todo.html',
        controller: 'TodoController'
    });
    $urlRouterProvider.otherwise('/login');
});

FirebaseToDoApp.controller("LoginController", function ($scope, $firebaseAuth, $location, $cordovaOauth) {

    $scope.login = function (username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function (authData) {
            $location.path("/todo");
        }).catch(function (error) {
            console.error("ERROR: " + error);
        });
    }

    $scope.register = function (username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$createUser({ email: username, password: password }).then(function () {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function (authData) {
            $location.path("/todo");
        }).catch(function (error) {
            console.error("ERROR " + error);
        });
    }

   

    $scope.loginFacebook = function () {
        var auth = $firebaseAuth(fb);
       
        auth.$authWithOAuthRedirect("facebook").then(function (authData) {
            alert("Facebook correctly authenticate");
            $location.path("/todo");
        }).catch(function (error) {
            if (error.code === "TRANSPORT_UNAVAILABLE") {
                auth.$authWithOAuthPopup("facebook").then(function (authData) {
                    // User successfully logged in. We can log to the console
                    // since we’re using a popup here
                    console.log(authData);
                    alert("Facebook correctly authenticate");
                    $location.path("/todo");
                });
            } else {
                // Another error occurred
                console.log(error);
            }
        });

        //$cordovaOauth.facebook("1763741407192520", ["email"]).then(function (result) {
        //    auth.$authWithOAuthToken("facebook", result.access_token).then(function (authData) {
        //        console.log(JSON.stringify(authData));
        //    }, function (error) {
        //        console.error("ERROR: " + error);
        //    });
        //}, function (error) {
        //    console.log("ERROR: " + error);
        //});

    }



});

FirebaseToDoApp.controller("TodoController", function ($scope, $firebaseObject, $ionicPopup) {

    $scope.list = function () {
        fbAuth = fb.getAuth();
        if (fbAuth) {
            var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
            syncObject.$bindTo($scope, "data");
        }
    }


    $scope.create = function () {
        $ionicPopup.prompt({
            title: 'Enter a new TODO item',
            inputType: 'text'
        })
        .then(function (result) {
            if (result !== "") {
                if ($scope.data.hasOwnProperty("todos") !== true) {
                    $scope.data.todos = [];
                }
                $scope.data.todos.push({ title: result });
            } else {
                console.log("Action not completed");
            }
        });
    }



});






