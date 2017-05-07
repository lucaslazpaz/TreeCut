angular.module('app.services', [])

    .service("userService", function ($ionicLoading, $state) {
        this.createLogin = function (email, password, obj, tipo) {
            var promise = firebase.auth().createUserWithEmailAndPassword(email, password);
            return promise;
        }
        this.createUser = function (obj) {
            var user = firebase.auth().currentUser;
            var promise = firebase.database().ref('user/' + user.uid).set(obj);
            return promise;
        }
        this.createAdmin = function () {
            var user = firebase.auth().currentUser;
            var obj = {
                uid: user.uid,
                status: false,
                msgStatus: false
            }
            var promise = firebase.database().ref('solicitacaoAdm/' + user.uid).set(obj);
            return promise;
        }

        

    })

    .service('solicitacaoPoda',function(){
        this.createSolicitacao=function(obj){
            var promise=firebase.database().ref('solicitacaoPoda').push(obj);
            return promise;
        }
    })

    .factory('buscarUsuario', function ($q, ionicSuperPopup) {
        return {
            get: function () {
                var defer = $q.defer();
                var user = firebase.auth().currentUser;
                firebase.database().ref('solicitacaoAdm/' + user.uid).on('value', function (data) {
                    if (data.val() != null) {
                        if (data.val().status == true && data.val().msgStatus == false) {
                            ionicSuperPopup.show('Aprovado', 'Você foi aprovado com administrador', 'success')
                            var obj = {
                                uid: user.uid,
                                status: true,
                                msgStatus: true
                            }
                            firebase.database().ref('solicitacaoAdm/' + user.uid).set(obj).then(function () {
                                console.log('msgalterada')
                            })
                        }
                    }
                })
            }
        }
    })

    .factory('buscarUsuario', function ($q, ionicSuperPopup) {
        return {
            get: function () {
                var defer = $q.defer();
                var user = firebase.auth().currentUser;
                var lista=[]
                firebase.database().ref('solicitacaoPoda').orderByChild('uid').equalTo(user.uid).on('child_added',function(data){
                    lista.push(data.val());
                    defer.resolve(lista);
                })
                return defer.promise;
            }
        }
    })