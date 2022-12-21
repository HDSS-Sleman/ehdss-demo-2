(function() {
    angular.module('ehdss')
        .controller('UserOtoritasCtrl', UserOtoritasCtrl);

    UserOtoritasCtrl.$inject = ['$scope', '$rootScope', 'AppService', '$state', '$http', '$q', '$ionicPopup', '$ionicModal', '$timeout'];

    function UserOtoritasCtrl($scope, $rootScope, AppService, $state, $http, $q, $ionicPopup, $ionicModal, $timeout) {
        $scope.userOtorized = false;
        $scope.userParams = '';
        $scope.curUser = {};
        $scope.curUserOrg = {};
        $scope.showAddRT = false;
        $scope.showAddUser = false;
        $scope.editMode = '';
        $scope.RTAvailable = [];
        $scope.idrtSearch = '';
        var httpCfg = {
            timeout : 7000
        };
        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });
        // Proses Login apakah user berhak akses modul atau tidak
        $scope.login = function(username, password) {
            $scope.username = username;
            var deferred = $q.defer();
            $rootScope.$broadcast('loading:show');
            $http({
                method: 'GET',
                url: $rootScope.serverUrl,
                timeout: 7000,
                params: {
                    module: 'user',
                    method: 'login',
                    username: username,
                    password: password ? md5(password) : ''
                }
            }).then(function(resp) {
                $rootScope.$broadcast('loading:hide');
                deferred.resolve(resp.data);
                if (!resp.data.success) {
                    $ionicPopup.alert({
                        title: 'User not Authorized',
                        template: resp.data.msg
                    });
                } else {
                    $scope.userOtorized = true;
                    $scope.userRole = resp.data.role;
                    $scope.userParams = '&username=' + username + '&password=' + md5(password);
                    loadUserRT();
                }
            }, function errorCallback(response) {
                $rootScope.$broadcast('loading:hide');
                deferred.reject(response);
            });

            return deferred.promise;
        };

        $scope.downloadExport = function(type) {
            window.open($rootScope.serverUrl + '?module=user&method=download_export' +
            $scope.userParams, '_system');
        };

        $ionicModal.fromTemplateUrl('templates/user-edit.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        var loadUserRT = function() {
            var deferred = $q.defer();
            var param = $scope.userParams || '';
            $rootScope.$broadcast('loading:show');
            $http.get($rootScope.serverUrl + '?module=user&method=list_user_rt' +
                param, httpCfg).then(
                function successCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                    if (resp.data && resp.data.success === false) {
                        $ionicPopup.alert({
                            title: 'Ada Kesalahan',
                            template: resp.data.msg
                        });
                    } else {
                        $scope.listUserRT = resp.data;
                    }
                    deferred.resolve(resp.data);
                },
                function errorCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                    deferred.reject('Ada error call user list');
                });
            return deferred.promise;
        };

        var listRT = function() {
            var deferred = $q.defer();
            $rootScope.$broadcast('loading:show');
            $http.get($rootScope.serverUrl + '?module=user&method=list_rt' +
                $scope.userParams + '&user_edit=' + $scope.curUser.user, httpCfg).then(
                function successCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                    if (resp.data && resp.data.success === false) {
                        $ionicPopup.alert({
                            title: 'Ada Kesalahan',
                            template: resp.data.msg
                        });
                    } else {
                        $scope.listRT = resp.data;
                        // paginasi listRT
                        $scope.currentPage = 0;
                        $scope.pageSize = 10;
                        $scope.numberOfPages=function(){
                            return Math.ceil($scope.listRT.length/$scope.pageSize);                
                        }
                    }
                    deferred.resolve(resp.data);
                },
                function errorCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                    deferred.reject('Ada error call user list');
                });
            return deferred.promise;
        };

        var listUserEnum = function() {
            var deferred = $q.defer();
            $rootScope.$broadcast('loading:show');
            $http.get($rootScope.serverUrl + '?module=user&method=list_user_enum' +
                $scope.userParams + '&user_super=' + $scope.curUser.user, httpCfg).then(
                function successCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                    if (resp.data && resp.data.success === false) {
                        $ionicPopup.alert({
                            title: 'Ada Kesalahan',
                            template: resp.data.msg
                        });
                    } else {
                        $scope.listUserEnum = resp.data;
                    }
                    deferred.resolve(resp.data);
                },
                function errorCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                    deferred.reject('Ada error call user list');
                });
            return deferred.promise;
        };

        $scope.refreshPage = function() {
            if ($scope.userOtorized) {
                loadUserRT().then(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
        };

        $scope.detail = function(u) {
            $scope.curUser = angular.copy(u);
            $scope.modalTitle = 'Informasi Detail Data User';
            if (u.role == 'enum') {
                $scope.modalTitle += ' Enumerator (' + u.user + ')';
            }
            $scope.editMode = 'list';
            listRT().then(function() {
                $scope.modal.show();
            });
        };

        $scope.edit = function(u) {
            // copy agar tidak mengubah model di daftar
            $scope.curUser = angular.copy(u);
            $scope.curUserOrg = angular.copy(u);
            $scope.modalTitle = 'Edit Data User';
            $scope.editMode = 'edit';
            if (u.role == 'enum') {
                $scope.modalTitle += ' Enumerator (' + u.user + ')';
                listRT().then(function() {
                    $scope.modal.show();
                });
            } else if (u.role == 'supervisor' || u.role == 'admin') {
                // listUserAvailable();
                // listUserEnum().then(function() {
                //     $scope.modal.show();
                // });
                $scope.modal.show();
            }
        };

        $scope.addUser = function() {
            $scope.curUser = {};
            $scope.curUserOrg = {};
            $scope.modalTitle = 'Tambah User Baru';
            $scope.editMode = 'add';
            $scope.modal.show();
        };

        $scope.deleteUser = function(u) {
            // A confirm dialog
            $ionicPopup.confirm({
                title: 'Hapus User',
                template: 'Yakin akan menghapus User "' + u.user + '"?'
            }).then(function(res) {
                if (res) {
                    $http.get($rootScope.serverUrl + '?module=user&method=del_user' +
                        $scope.userParams + '&user_del=' + u.user, httpCfg).then(
                        function successCallback(resp) {
                            $rootScope.$broadcast('loading:hide');
                            if (resp.data && resp.data.success === false) {
                                $ionicPopup.alert({
                                    title: 'Ada Kesalahan',
                                    template: resp.data.msg
                                });
                            } else {
                                loadUserRT();
                            }
                        },
                        function errorCallback(resp) {
                            $rootScope.$broadcast('loading:hide');
                        });
                }
            });
        };

        $scope.editUser = function(user) {
            var params = '';

            if (!user.user) {
                $ionicPopup.alert({
                    title: 'Kesalahan',
                    template: 'Nama user tidak boleh kosong'
                });
                return 0;
            } else {
                params += '&user_edit=' + user.user;
                params += '&user_old=' + ($scope.curUserOrg.user || '');
                params += '&id_user=' + (user.id_user || '');
                params += '&edit_mode=' + $scope.editMode;
            }

            if (user.paswd1) {
                if (user.paswd1 !== user.paswd2) {
                    $ionicPopup.alert({
                        title: 'Kesalahan',
                        template: 'Password baru yang dimasukkan tidak sama'
                    });
                    return 0;
                } else {
                    params += '&pwd=' + md5(user.paswd1);
                }
            } else {
                if ($scope.editMode == 'add') {
                    $ionicPopup.alert({
                        title: 'Kesalahan',
                        template: 'Password belum diisikan, silahkan diulangi'
                    });
                    return 0;
                }
            }

            if ($scope.editMode == 'add' && !user.role) {
                $ionicPopup.alert({
                    title: 'Kesalahan',
                    template: 'Role User belum diisikan, silahkan diulangi'
                });
                return 0;
            }

            params += '&role=' + user.role;
            $http.get($rootScope.serverUrl + '?module=user&method=user_save' +
                $scope.userParams + params, httpCfg).then(
                function successCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                    if (resp.data && resp.data.success === false) {
                        $ionicPopup.alert({
                            title: 'Ada Kesalahan',
                            template: resp.data.msg
                        });
                    } else {
                        $ionicPopup.alert({
                            title: 'Sukses',
                            template: resp.data.msg
                        });
                        if ($scope.editMode == 'edit') { // jika edit mode update param berdasarkan data yg diinput
                            $scope.userParams = '&username=' + user.user + '&password=' + md5(user.paswd1);
                        }
                        
                        location.reload();
                    }
                },
                function errorCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                });
        };

        $scope.addRT = function() {
            $scope.showAddRT = !$scope.showAddRT;
        };

        var _listRTAvailable = function(idrt) {
            if (idrt && idrt.toString().length > 2) {
                $rootScope.$broadcast('loading:show');
                $scope.RTAvailable = [];
                $http.get($rootScope.serverUrl + '?module=user&method=list_rt_available' +
                    $scope.userParams + '&idrt=' + idrt, httpCfg).then(
                    function successCallback(resp) {
                        $rootScope.$broadcast('loading:hide');
                        if (resp.data && resp.data.success === false) {
                            $ionicPopup.alert({
                                title: 'Ada Kesalahan',
                                template: resp.data.msg
                            });
                        } else {
                            $scope.RTAvailable = resp.data;
                        }
                    },
                    function errorCallback(resp) {
                        $rootScope.$broadcast('loading:hide');
                    });
            } else {
                $scope.RTAvailable = [];
            }
        };

        $scope.listRTAvailable = function(idrt) {
            _listRTAvailable(idrt);
        };

        $scope.addRTtoUser = function(rt, idx) {
            $http.get($rootScope.serverUrl + '?module=user&method=add_rt_to_user' +
                $scope.userParams + '&idrt=' + rt.idrt + '&user_edit=' +
                $scope.curUser.user, httpCfg).then(
                function successCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                    if (resp.data && resp.data.success === false) {
                        $ionicPopup.alert({
                            title: 'Ada Kesalahan',
                            template: resp.data.msg
                        });
                    } else {
                        $scope.RTAvailable.splice(idx, 1);
                        loadUserRT();
                    }
                },
                function errorCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                });
        };

        $scope.deleteRT = function(rt) {
            // A confirm dialog
            $ionicPopup.confirm({
                title: 'Hapus RT dari Enum',
                template: 'Yakin akan menghapus Rumah Tangga berikut?<br/>' +
                    'IDRT : <b>' + rt.idrt + '</b><br>' +
                    'Nama Kepala RT : <b class="nama">' + rt.kep_rt + '</b><br>' +
                    'Dari user Enumerator <b>' + $scope.curUser.user + '</b>'
            }).then(function(res) {
                if (res) {
                    $rootScope.$broadcast('loading:show');
                    $http.get($rootScope.serverUrl + '?module=user&method=del_rt' +
                        $scope.userParams + '&idrt=' + rt.idrt, httpCfg).then(
                        function successCallback(resp) {
                            $rootScope.$broadcast('loading:hide');
                            if (resp.data && resp.data.success === false) {
                                $ionicPopup.alert({
                                    title: 'Ada Kesalahan',
                                    template: resp.data.msg
                                });
                            } else {
                                listRT();
                            }
                        },
                        function errorCallback(resp) {
                            $rootScope.$broadcast('loading:hide');
                        });
                }
            });
        };

        var listUserAvailable = function() {
            $rootScope.$broadcast('loading:show');
            $scope.UserAvailable = [];
            $http.get($rootScope.serverUrl + '?module=user&method=list_user_available' +
                $scope.userParams, httpCfg).then(
                function successCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                    if (resp.data && resp.data.success === false) {
                        $ionicPopup.alert({
                            title: 'Ada Kesalahan',
                            template: resp.data.msg
                        });
                    } else {
                        $scope.UserAvailable = resp.data;
                    }
                },
                function errorCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                });
        };

        $scope.addUsertoUser = function(u,idx) {
            $http.get($rootScope.serverUrl + '?module=user&method=add_user_to_user' +
                $scope.userParams + '&user_enum=' + u.user + '&user_super=' +
                $scope.curUser.user, httpCfg).then(
                function successCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                    if (resp.data && resp.data.success === false) {
                        $ionicPopup.alert({
                            title: 'Ada Kesalahan',
                            template: resp.data.msg
                        });
                    } else {
                        $scope.UserAvailable.splice(idx, 1);
                        listUserEnum();
                    }
                },
                function errorCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                });
        };

        $scope.deleteUserEnum = function(u) {
            // A confirm dialog
            $ionicPopup.confirm({
                title: 'Hapus User dari supervisor',
                template: 'Yakin akan menghapus User berikut?<br/>' +
                    'User Enumerator : <b>' + u.enum + '</b><br>' +
                    'Dari Supervisor : <b>' + $scope.curUser.user + '</b>'
            }).then(function(res) {
                if (res) {
                    $rootScope.$broadcast('loading:show');
                    $http.get($rootScope.serverUrl + '?module=user&method=del_user_enum' +
                        $scope.userParams + '&user_enum=' + u.enum + '&user_super=' +
                        $scope.curUser.user, httpCfg).then(
                        function successCallback(resp) {
                            $rootScope.$broadcast('loading:hide');
                            if (resp.data && resp.data.success === false) {
                                $ionicPopup.alert({
                                    title: 'Ada Kesalahan',
                                    template: resp.data.msg
                                });
                            } else {
                                listUserEnum();
                                listUserAvailable();
                            }
                        },
                        function errorCallback(resp) {
                            $rootScope.$broadcast('loading:hide');
                        });
                }
            });
        };
        // An alert dialog
        $scope.showAlert = function(title, msg) {
            $ionicPopup.alert({
                title: title || 'Upload Data',
                template: msg || 'Berhasil Menyimpan Data'
            });
        };
        $scope.uploadCatatan = function(cspv) {
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: 'Upload Data Random',
                template: 'Yakin akan meng-upload data Catatan berikut ke Server?<br>' +
                    'ID RT : <b>' + cspv.idrt + '</b><br>'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    $rootScope.$broadcast('loading:show');
                        AppService.normalisasiData_(cspv).then(function(data) {
                            data.spv = $scope.username;
                            var postData = {
                                idrt: data.idrt,
                                hash: md5(JSON.stringify(data)),
                                data: data
                            };
                            var config = {
                                headers : {
                                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                                }
                            }
                            $http.post($rootScope.serverUrlUpload + '?module=data&method=upload_catatan_spv', postData, config)
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
