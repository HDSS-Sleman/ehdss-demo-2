(function() {
    angular.module('ehdss')
        .controller('HrnCtrl', HrnCtrl);

    HrnCtrl.$inject = ['$scope', '$rootScope', 'AppService', '$state', '$timeout', '$ionicPopup', '$http'];

    function HrnCtrl($scope, $rootScope, AppService, $state, $timeout, $ionicPopup, $http) {
        
        AppService.getDataRandom().then(function(data) {
            $scope.dataRandom = data;
            $scope.currentPage = 0;
            $scope.pageSize = 10;
            $scope.numberOfPages=function(){
                return Math.ceil($scope.dataRandom.length/$scope.pageSize);                
            }
        });

        // An alert dialog
        $scope.showAlert = function(title, msg) {
            $ionicPopup.alert({
                title: title || 'Upload Data',
                template: msg || 'Berhasil Menyimpan Data'
            });
        };

        $scope.uploadDataRand = function(dataART) {
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: 'Upload Data Random',
                template: 'Yakin akan meng-upload data Random berikut ke Server?<br>' +
                    'ID RT : <b>' + dataART.idrt + '</b><br>' +
                    'Nama : <b><span class="nama">' + dataART._nama + '</span></b>'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    $rootScope.$broadcast('loading:show');
                    AppService.getDataRandom(dataART.idrt).then(function(data) {
                        data.jk = data._jk;
                        data.nama = data._nama;
                        delete data._jk;
                        delete data._nama;
                        var postData = {
                            idrt: dataART.idrt,
                            hash: md5(JSON.stringify(data)),
                            data: data
                        };
                        var config = {
                            headers : {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                            }
                        }
                        
                        $http.post($rootScope.serverUrlUpload + '?module=data&method=upload_data_random', postData, config)
                        .then(
                            function successCallback(resp) {
                                 $rootScope.$broadcast('loading:hide');
                                if (resp.data.success) {
                                    $scope.showAlert();
                                } else {
                                    $scope.showAlert('', resp.data.msg);
                                }
                            },
                            function errorCallback(resp) {
                                $rootScope.$broadcast('loading:hide');
                            });
                    });
                } else {
                    $rootScope.$broadcast('loading:hide');
                    // console.log('Upload Canceled');
                }
            });
        };

    }
})();
