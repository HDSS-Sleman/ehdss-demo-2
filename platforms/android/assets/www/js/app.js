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
            name: 'ehdss-ichc-2022'
        });
        // Set URL server 'index.php' untuk aplikasi atau browser
        // integra9: 'http://hdss.integra9.com/server/index.php',
        // localhost: 'http://localhost/ehdss/www/server/index.php',
        // https://hdss.ikm.fk.ugm.ac.id/e-hdss/server/index.php untuk upload ke server
        if (ionic.Platform.isWebView() || ionic.Platform.isCrosswalk()) {
            $rootScope.serverUrl = 'http://slemanhdss.id/ichc_2022/server/index.php';
            $rootScope.serverUrlUpload = 'https://slemanhdss.id/ichc_2022/server/index.php';
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

    .state('app.setting', {
        url: '/setting',
        views: {
            'menuContent': {
                templateUrl: 'templates/setting.html',
                controller: 'SettingCtrl'
            }
        }
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

    .state('app.art', {
        cache: false,
        url: '/art',
        views: {
            'menuContent': {
                templateUrl: 'templates/list_art.html',
                controller: 'ArtCtrl'
            }
        }
    })    

    .state('app.rt', {
        cache: false,
        url: '/rt',
        views: {
            'menuContent': {
                templateUrl: 'templates/rt.html',
                controller: 'RtCtrl'
            }
        }
    })

    .state('app.art_kart', {
        cache: false,
        url: '/art_kart',
        views: {
            'menuContent': {
                templateUrl: 'templates/art_kart.html',
                controller: 'ArtKartCtrl'
            }
        }
    })
    
    .state('app.icf', {
        cache: false,
        url: '/icf',
        views: {
            'menuContent': {
                templateUrl: 'templates/icf.html',
                controller: 'IcfCtrl'
            }
        }
    })

    .state('app.pm', {
        cache: false,
        url: '/pm',
        views: {
            'menuContent': {
                templateUrl: 'templates/pm.html',
                controller: 'PmnCtrl'
            }
        }
    })

    .state('app.ptm', {
        cache: false,
        url: '/ptm',
        views: {
            'menuContent': {
                templateUrl: 'templates/ptm.html',
                controller: 'PtmCtrl'
            }
        }
    })
    
    .state('app.mch',{
        cache: false,
        url: '/mch',
        views: {
            'menuContent': {
                templateUrl: 'templates/mch.html',
                controller: 'MchCtrl'
            }
        }
    })
    .state('app.ichc',{
        cache: false,
        url: '/ichc',
        views: {
            'menuContent': {
                templateUrl: 'templates/ichc.html',
                controller: 'IchcCtrl'
            }
        }
    })
    .state('app.ir',{
        cache: false,
        url: '/ir',
        views: {
            'menuContent': {
                templateUrl: 'templates/ir.html',
                controller: 'IrCtrl'
            }
        }
    })
    .state('app.png',{
        cache: false,
        url: '/png',
        views: {
            'menuContent': {
                templateUrl: 'templates/png.html',
                controller: 'PngCtrl'
            }
        }
    })
    .state('app.prk',{
        cache: false,
        url: '/prk',
        views: {
            'menuContent': {
                templateUrl: 'templates/prk.html',
                controller: 'PrkCtrl'
            }
        }
    })
    .state('app.bkia',{
        cache: false,
        url: '/bkia',
        views: {
            'menuContent': {
                templateUrl: 'templates/bkia.html',
                controller: 'BkiaCtrl'
            }
        }
    })
    .state('app.ichcp',{
        cache: false,
        url: '/ichcp',
        views: {
            'menuContent': {
                templateUrl: 'templates/ichcp.html',
                controller: 'IchcpCtrl'
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