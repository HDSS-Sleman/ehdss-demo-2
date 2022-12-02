(function() {
    angular.module('ehdss')
        .controller('EndCtrl', EndCtrl);

    EndCtrl.$inject = ['$scope', '$state', '$rootScope', 'AppService', '$ionicHistory', '$ionicModal', '$ionicPopup', '$http', '$timeout'];

    function EndCtrl($scope, $state, $rootScope, AppService, $ionicHistory, $ionicModal, $ionicPopup, $http, $timeout) {

        // An alert dialog
        $scope.showAlert = function(title, msg) {
            $ionicPopup.alert({
                title: title || 'Unggah Data',
                template: msg || 'Berhasil Menyimpan Data'
            });
        };

        $scope.uploadDataKel = function() {
            if (!$rootScope.dataRT || !$rootScope.dataRT.idrt) {
                $state.go('app.home'); // jika tidak ada idrt kembali ke home
                return false;
            }
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: 'Unggah Data',
                template: 'Simpan dan unggah data?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    if (!$rootScope.dataRT || !$rootScope.dataRT.idrt) {
                        $state.go('app.home'); // jika tidak ada idrt kembali ke home
                    }else{
                        $rootScope.$broadcast('loading:show');
                        AppService.getDataKel($rootScope.dataRT.idrt).then(function(data) {
                            
                            var obj = {};
                            if(data != ""){
                                data = data;
                            }else{
                                //jika data kosong, data dibuat object supaya bisa diupload
                                data = {};
                            }
                            var postData = {
                                idrt: $rootScope.dataRT.idrt,
                                hash: md5(JSON.stringify(data)),
                                data: data
                            };
                            var config = {
                                headers : {
                                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                                }
                            };
                            /*upload data all*/
                            $http.post($rootScope.serverUrlUpload + '?module=data', postData, config)
                            .then(
                                function successCallback(resp) {
                                    $rootScope.$broadcast('loading:hide');
                                    if (resp.data.success) {
                                        $scope.showAlert('Berhasil',resp.data.msg);
                                    } else {
                                        $scope.showAlert('', resp.data.msg);
                                    }
                                },
                                function errorCallback(resp) {
                                    $rootScope.$broadcast('loading:hide');
                                });
                        });
                    }
                        
                } else {
                    $rootScope.$broadcast('loading:hide');
                    // console.log('Upload Canceled');
                }
            });
        };

    }
})();