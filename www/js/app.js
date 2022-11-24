// angular.module is a global place for creating, registering and retrieving Angular modules
// the 1st parameter is the name of this angular module (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ehdss', ['ionic','ngCordova'])

.run(['$ionicPlatform', '$rootScope', '$ionicLoading', '$http', function($ionicPlatform, $rootScope, $ionicLoading, $http) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            window.StatusBar.styleDefault();
        }
        // set config localforage
        localforage.config({
            name: 'ehdss-hl-2022'
        });
        // Set URL server 'index.php' untuk aplikasi atau browser
        // integra9: 'http://hdss.integra9.com/server/index.php',
        // localhost: 'http://localhost/ehdss/www/server/index.php',
        // https://hdss.ikm.fk.ugm.ac.id/e-hdss/server/index.php untuk upload ke server
        if (ionic.Platform.isWebView() || ionic.Platform.isCrosswalk() || ionic.Platform.isAndroid()) {
            $rootScope.serverUrl = 'http://slemanhdss.id/ugm-hpu-literasi-kesehatan/server/index.php';
            $rootScope.serverUrlUpload = 'https://slemanhdss.id/ugm-hpu-literasi-kesehatan/server/index.php';
            // $rootScope.serverUrl = 'http://10.18.5.71/e-hdss/server/index.php'; // $rootScope.serverUrl = 'http://hdss.ikm.fk.ugm.ac.id/e-hdss/server/index.php';
            // $rootScope.serverUrlUpload = 'http://10.18.5.71/e-hdss/server/index.php'; // $rootScope.serverUrlUpload = 'https://hdss.ikm.fk.ugm.ac.id/e-hdss/server/index.php';
            $rootScope.iniAndroid = true;
            $rootScope.iniWeb = false;
        } else {
            $rootScope.serverUrl = './server/index.php';
            $rootScope.serverUrlUpload = './server/index.php';
            $rootScope.iniAndroid = false;
            $rootScope.iniWeb = true;
        }
        if (window.cordova && cordova.plugins.certificates) {
            cordova.plugins.certificates.trustUnsecureCerts(true);
        }
    });
    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({ template: '<ion-spinner icon="dots"></ion-spinner><p>Memuat Modul...</p>' });
    });
    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide();
    });
    $rootScope.$on('saving:show', function() {
        $ionicLoading.show({ template: '<ion-spinner icon="dots"></ion-spinner><p>Menyimpan Data...</p>' });
    });
    $rootScope.$on('saving:hide', function() {
        $ionicLoading.hide();
    });

}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })
    .state('app.user', {
        url: '/user',
        views: {
            'menuContent': {
                templateUrl: 'templates/user-otoritas.html',
                controller: 'UserOtoritasCtrl'
            }
        }
    })
    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })
    .state('app.ir', {
        cache: false,
        url: '/ir',
        views: {
            'menuContent': {
                templateUrl: 'templates/ir.html',
                controller: 'IrCtrl'
            }
        }
    })
    .state('app.klk', {
        cache: false,
        url: '/klk',
        views: {
            'menuContent': {
                templateUrl: 'templates/klk.html',
                controller: 'KlkCtrl'
            }
        }
    })
    .state('app.lkf', {
        cache: false,
        url: '/lkf',
        views: {
            'menuContent': {
                templateUrl: 'templates/lkf.html',
                controller: 'LkfCtrl'
            }
        }
    })
    .state('app.lkm', {
        cache: false,
        url: '/lkm',
        views: {
            'menuContent': {
                templateUrl: 'templates/lkm.html',
                controller: 'LkmCtrl'
            }
        }
    })
    .state('app.pkl', {
        cache: false,
        url: '/pkl',
        views: {
            'menuContent': {
                templateUrl: 'templates/pkl.html',
                controller: 'PklCtrl'
            }
        }
    })
    .state('app.pss', {
        cache: false,
        url: '/pss',
        views: {
            'menuContent': {
                templateUrl: 'templates/pss.html',
                controller: 'PssCtrl'
            }
        }
    })
    .state('app.pst', {
        cache: false,
        url: '/pst',
        views: {
            'menuContent': {
                templateUrl: 'templates/pst.html',
                controller: 'PstCtrl'
            }
        }
    })
    .state('app.kmt', {
        cache: false,
        url: '/kmt',
        views: {
            'menuContent': {
                templateUrl: 'templates/kmt.html',
                controller: 'KmtCtrl'
            }
        }
    })
    .state('app.kbt', {
        cache: false,
        url: '/kbt',
        views: {
            'menuContent': {
                templateUrl: 'templates/kbt.html',
                controller: 'KbtCtrl'
            }
        }
    })
    .state('app.end', {
        cache: false,
        url: '/end',
        views: {
            'menuContent': {
                templateUrl: 'templates/end.html',
                controller: 'EndCtrl'
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
}])

// <input type="text" name="fruitName" ng-model="data.fruitName" numbers-allowed="1-20,52,96"/>
.directive('numbersAllowed', function() {
    return {
        restrict: 'A', // limit to Attribute onlu
        require: 'ngModel',
        link: function(scope, elem, attr, ngModel) {
            var rules = [],
                r,
                tmps = attr.numbersAllowed.split(',');
            for (var i = 0; i < tmps.length; i++) {
                r = tmps[i];
                if (r.indexOf('-') !== -1) {
                    r = r.split('-');
                    // tanda + untuk mengubah string ke integer
                    for (var n = +r[0]; n <= +r[1]; n++) {
                        rules.push(n);
                    }
                } else {
                    rules.push(+r);
                }
            }

            //For DOM -> model validation
            ngModel.$parsers.unshift(function(value) {
                var valid = rules.indexOf(+value) !== -1;
                ngModel.$setValidity('rules', valid);
                return valid ? value : undefined;
            });

            //For model -> DOM validation
            ngModel.$formatters.unshift(function(value) {
                var valid = rules.indexOf(+value) !== -1;
                ngModel.$setValidity('rules', valid);
                return value;
            });
        }
    };
})

//Untuk mencegah input ketika mencapai limit karakter
.directive('block', function($parse) {
    return {
        scope: {
            blockLength: '='
        },
        link: function(scope, elm, attrs) {

            elm.bind('keypress', function(e) {

                if (elm[0].value.length >= scope.blockLength) {
                    e.preventDefault();
                    return false;
                }
            });
        }
    };
})

// untuk paginasi
.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        if (!isNaN(start)) {
            return input.slice(start);
        }
        
    }
});