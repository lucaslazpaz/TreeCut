angular.module('app.controllers', ['ngCordova'])

    .controller('cameraCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams) {


        }])

    .controller('localizacaoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams) {


        }])

    .controller('notificacoesCtrl', function ($scope, $firebaseArray) {
        var ref = firebase.database().ref('notifications');
        $scope.notifications = $firebaseArray(ref);
    })



    .controller('configuracoesCtrl', function ($scope, $ionicAuth, $state) {
        $scope.logout = function () {
            $ionicAuth.logout();
            $state.go('login')
        }

    })

    .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams) {


        }])

    .controller('loginCtrl', function ($scope, $stateParams, $ionicAuth, $state, $ionicLoading, ionicSuperPopup) {
        $scope.user = {
            email: "",
            password: ""
        }



        if ($ionicAuth.isAuthenticated()) {
            $state.go('tabsController.camera')
        }




        $scope.login = function () {


            $ionicLoading.show({

                template: 'Carregando...',
                duration: 30000
            })
            $ionicAuth.login('basic', $scope.user).then(function () {
                $ionicLoading.hide();
                console.log('foi');
                $state.go('tabsController.camera')
            })
        };

    })



    .controller('cadastroCtrl', function ($scope, $ionicAuth, $ionicUser, $state, $ionicLoading, ionicSuperPopup) {
        $scope.user = {
            email: "",
            password: ""
        }


        $scope.Cadastrar = function (nome, senha) {

            if ($scope.user.password == senha) {
                $ionicAuth.signup($scope.user).then(function () {

                    $ionicAuth.login('basic', $scope.user).then(function () {
                        $ionicUser.set('nome', nome);
                        $ionicUser.save();
                        $state.go('login')
                        console.log('foi');
                    })

                }).catch(function (e) {
                    console.log(e);
                })
            } else {
                ionicSuperPopup.show("Erro!", "As senhas não se correspondem!", "error");
                console.log('erro');
            }
        }

        $scope.login = function () {
            $ionicLoading.show({
                template: 'Carregando...',
                duration: 30000
            })
            $ionicAuth.login('basic', $scope.user).then(function () {
                $ionicLoading.hide();
                console.log('foi');
                $state.go('tabsController.camera')
            })
        };

    })

    .controller('alterarSenhaCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams) {


        }])

    .controller('CameraCtrl', function ($scope, $cordovaCamera) {

        $scope.pictureUrl = 'http://placehold.it/300?text=Inserir+Imagem';

        $scope.fotografar = function () {

            $cordovaCamera.getPicture({
                destinationType: Camera.DestinationType.DATA_URL,
                encodingType: Camera.EncodingType.JPEG,
                saveToPhotoAlbum: true
            })
                .then(function (data) {
                    $scope.pictureUrl = 'data:image/jpeg;base64,' + data;
                });
        }

        $scope.abrirgaleria = function () {

            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            };

            $cordovaCamera.getPicture(options).then(function (data) {
                $scope.pictureUrl = data;
            }, function (err) {
                // error
            });
        }

    })


    .controller('MapCtrl', function ($scope, $ionicLoading, $cordovaGeolocation, $window) {

        $ionicLoading.show({

            template: 'Carregando...',
            duration: 300
        })


        $scope.mapCreated = function (map) {

            $scope.map = map;
        };

        $scope.centerOnMe = function () {

            console.log("Centering");

            if (!$scope.map) {
                return;
            }

            $scope.loading = $ionicLoading.show({
                content: 'Capturando localização atual...',
                showBackdrop: false,
                duration: 3000
            });

            navigator.geolocation.getCurrentPosition(function (pos) {

                console.log('Got pos', pos);
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                $scope.loading.hide();
            }, function (error) {
                alert('Impossivel carregar localização: ' + error.message);



            });
        };

        var marker;
        var watchOptions = {
            timeout: 3000,
            enableHighAccuracy: false
        };

        var watch = $cordovaGeolocation.watchPosition(watchOptions, $scope);


        watch.then(null,
            function (err) { },
            function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                $scope.map.setCenter(new google.maps.LatLng(lat, lng));

                google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                    if (marker)
                        marker.setMap(null);

                    marker = new google.maps.Marker({
                        map: $scope.map,
                        animation: google.maps.Animation.DROP,
                        position: new google.maps.LatLng(lat, lng)
                    });


                });

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(lat, lng);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    console.log(results[1]);
                    $scope.cidade = Object;
                console.log($scope.cidade);    
                });
                      

            })


    });



