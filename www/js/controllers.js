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

    .controller('notificacoesCtrl', function ($scope, $firebaseArray,buscarUsuario) {
        var ref = firebase.database().ref('notifications');
        $scope.notifications = $firebaseArray(ref);
        $scope.lista=[];
        buscarUsuario.get().then(function(data){
            $scope.lista=data;
        })
    })



    .controller('configuracoesCtrl', function ($scope, $ionicAuth, $state) {
        $scope.logout = function () {
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
            }, function (error) {
                // An error happened.
            });
        }

    })

    .controller('menuCtrl', function ($scope, buscarUsuario) {
        buscarUsuario.get();
    })

    .controller('loginCtrl', function ($scope, $stateParams, $ionicAuth, $state, $ionicLoading, ionicSuperPopup, userService) {
        $scope.user = {
            email: "",
            password: ""
        }
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $state.go('tabsController.camera');
            } else {
                $state.go('login');
            }
        });
        $scope.login = function () {
            $ionicLoading.show({
                template: 'Carregando...',
                duration: 30000
            })
        };

    })



    .controller('cadastroCtrl', function ($scope, $ionicAuth, $ionicUser, $state, $ionicLoading, ionicSuperPopup, userService) {
        $scope.user = {
            email: "",
            nome: "",
            cidade: ""
        }

        $scope.tipo = {
            status: ""
        };

        $scope.lista =
            [
                { id: 1, cidade: 'São José do Rio Preto' },
                { id: 2, cidade: 'Olimpia' },
                { id: 3, cidade: 'SP' }
            ]

        $scope.Cadastrar = function (nome, senha) {
            $scope.user.nome = nome;
            var senha1 = document.getElementById('cadastro-input5').value;
            console.log(senha1);
            if (senha1 == senha) {
                var promise = userService.createLogin($scope.user.email, senha1);
                promise.then(function () {
                    $ionicLoading.hide();
                    var promise2 = userService.createUser($scope.user);
                    promise2.then(function () {
                        var user = firebase.auth().currentUser;
                        user.updateProfile({ displayName: nome, photoURL: "" }).then(function () {
                        });
                        if ($scope.tipo.status == 1) {
                            var promise3 = userService.createAdmin();
                            promise3.then(function () {
                                $state.go('tabsController.notificacoes');
                                console.log('ooo')
                            })
                        } else $state.go('tabsController.camera');
                    })
                })
                promise.catch(function (error) {
                    if (error.code == 'auth/email-already-in-use')
                        console.log("msgEmailexistente");
                    if (error.code == 'auth/invalid-email')
                        console.log("msgEmailinvalido");
                    if (error.code == "auth/weak-password")
                        console.log('senha fraca')
                })
            } else console.log('difente')
        }

        $scope.login = function () {
            $ionicLoading.show({
                template: 'Carregando...',
                duration: 30000
            })

        };

    })

    .controller('alterarSenhaCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams) {


        }])

    .controller('CameraCtrl', function ($scope, $cordovaCamera, $rootScope, $state, $ionicModal, solicitacaoPoda) {
        $scope.voltarLocalizacao = function () {
            $state.go('tabsController.localizacao');
        };
        $scope.camera = { cidade: $rootScope.formatted_address };
        $scope.pictureUrl = 'http://placehold.it/600x400?text=Inserir+Imagem';
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
        // ModalImage
        $scope.showImages = function (index) {
            $scope.activeSlide = index;
            $scope.showModal('templates/imagemmodal.html');
        }

        $scope.showModal = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }

        // Close the modal
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove()
        };
        $scope.obj = {
            detalhes: ""
        }
        $scope.salvar = function (cidade) {
            var user = firebase.auth().currentUser;
            var obj = {
                endereco: cidade,
                img:$scope.pictureUrl,
                uid: user.uid,
                detalhes: $scope.obj.detalhes
            }
           var promise=solicitacaoPoda.createSolicitacao(obj);
           promise.then(function(){
               console.log('cadastrou foda')
           })
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


    .controller('MapCtrl', function ($scope, $ionicLoading, $cordovaGeolocation, $window, $rootScope, $state) {

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
                var infowindow = new google.maps.InfoWindow;
                var latlng = new google.maps.LatLng(lat, lng);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {

                            $scope.cidade = Object;
                            $rootScope.formatted_address = results[0].address_components[1].long_name + ", " + results[1].formatted_address;


                            console.log($rootScope.formatted_address);

                            if (results[0].types[0] == 'street_address' && results[0].address_components[1]) {
                                streetname = results[0].address_components[1].long_name;
                            }
                            else if (results[0].types[0] == 'route') {
                                streetname = results[0].address_components[0].long_name;
                            }

                            var markerAddress = results[0].address_components[1].long_name;
                            console.log(markerAddress);
                        }
                    }
                    $scope.pegarLocalizacao = function () {
                        $state.go('tabsController.camera');
                    };

                });
            })


    });



