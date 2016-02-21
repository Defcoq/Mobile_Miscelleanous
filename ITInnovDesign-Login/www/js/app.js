// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','firebase', 'ngCordova'])
.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('login', {
        url: '/',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })
    .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'LoginCtrl'
    })
    .state('signin', {
        url: '/signin',
        templateUrl: 'templates/signin.html',
        controller: 'LoginCtrl'
    });

    $urlRouterProvider.otherwise("/");

})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('LoginCtrl', function ($scope, $state, $cordovaFacebook, $cordovaToast) {

    $scope.data = {};

    $scope.signupEmail = function () {

        var ref = new Firebase("https://ionicjpebook.firebaseio.com");

        ref.createUser({
            email: $scope.data.email,
            password: $scope.data.password
        }, function (error, userData) {
            if (error) {
                $cordovaToast.show("Error creating user:" + error, 'long', 'center')
                .then(function (success) {
                    // success
                }, function (error) {
                    // error
                });

                alert("error " + error);
                console.log("Login Failed!", error);
            } else {
                alert("sucesssss");
                $cordovaToast.show("Successfully created user account with uid:" + userData.uid, 'long', 'center')
                .then(function (success) {
                    // success
                }, function (error) {
                    // error
                });
                console.log("Successfully created user account with uid:", userData.uid);
            }
        });

    };

    $scope.loginEmail = function () {

        var ref = new Firebase("https://ionicjpebook.firebaseio.com");

        ref.authWithPassword({
            email: $scope.data.email,
            password: $scope.data.password
        }, function (error, authData) {
            if (error) {
                alert("error " + error);
                console.log("Login Failed!", error);
            } else {
                alert("sucesssss");
                $cordovaToast.show("Authenticated successfully with payload:" + authData, 'long', 'center')
               .then(function (success) {
                   // success
               }, function (error) {
                   // error
               });
                console.log("Authenticated successfully with payload:", authData);
            }
        });

    };

    $scope.loginFacebook = function () {

        var ref = new Firebase("https://ionicjpebook.firebaseio.com");
        alert("is outside web view");

        if (ionic.Platform.isWebView()) {
            alert("is inside web view");
            $cordovaFacebook.login(["public_profile", "email"]).then(function (success) {
                alert("is success");
                console.log(success);

                ref.authWithOAuthToken("facebook", success.authResponse.accessToken, function (error, authData) {
                    if (error) {
                        alert("error " + error);
                        console.log("Login Failed!", error);
                    } else {
                        alert("sucesssss");
                        $cordovaToast.show("Authenticated successfully with payload:" + authData, 'long', 'center')
                      .then(function (success) {
                          // success
                      }, function (error) {
                          // error
                      });
                        console.log('Authenticated successfully with payload:', authData);
                    }
                });

            }, function (error) {
                console.log(error);
            });

        }
        else {

            ref.authWithOAuthPopup("facebook", function (error, authData) {
                if (error) {
                    alert("error " + error);
                    console.log("Login Failed!", error);
                } else {
                    alert("sucesssss");
                    $cordovaToast.show("Authenticated successfully with payload:" + authData, 'long', 'center')
                      .then(function (success) {
                          // success
                      }, function (error) {
                          // error
                      });
                    console.log("Authenticated successfully with payload:", authData);
                }
            });

        }

    };

});
