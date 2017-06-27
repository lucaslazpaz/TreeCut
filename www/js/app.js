// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.services', 'ngCordova', 'ionic.cloud', 'cera.ionicSuperPopup', 'firebase'])



  .config(function ($stateProvider, $urlRouterProvider) {

    
    $stateProvider



      .state('tabsController.camera', {
        url: '/page2',
        cache: false,
        views: {
          'tab1': {
            templateUrl: 'templates/camera.html',
            controller: 'cameraCtrl'
          }
        }
      })

      .state('tabsController.localizacao', {
        url: '/page3',
        views: {
          'tab2': {
            templateUrl: 'templates/localizacao.html',
            controller: 'MapCtrl'
          }
        }
      })

      .state('tabsController.notificacoes', {
        url: '/page4',
        views: {
          'tab3': {
            templateUrl: 'templates/notificacoes.html',
            controller: 'notificacoesCtrl'
          }
        }
      })

      .state('tabsController.configuracoes', {
        url: '/pageconfig',
        views: {
          'tab4': {
            templateUrl: 'templates/configuracao.html',
            controller: 'configuracoesCtrl'
          }
        }
      })


      .state('tabsController', {
        url: '/page1',
        templateUrl: 'templates/tabsController.html',
        abstract: true,
        controller: 'menuCtrl'
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })

      .state('cadastro', {
        url: '/page6',
        templateUrl: 'templates/cadastro.html',
        controller: 'cadastroCtrl'
      })

      .state('alterarSenha', {
        url: '/page7',
        templateUrl: 'templates/alterarSenha.html',
        controller: 'alterarSenhaCtrl'
      })

      .state('gerenciarFuncionario', {
        url: '/page14',
        templateUrl: 'templates/gerenciarFuncionario.html',
        controller: 'gerenciarFuncCtrl'
      })

      .state('cadastrarFuncionario', {
        url: '/page15',
        templateUrl: 'templates/cadastrarFuncionario.html',
        controller: 'cadastroFunc'

      })



    $urlRouterProvider.otherwise('/login')


  })

  .run(function ($ionicPlatform, $rootScope, $ionicViewSwitcher, $ionicHistory) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      $rootScope.goBackState = function () {
        $ionicViewSwitcher.nextDirection('Voltar');
        $ionicHistory.goBack();
      }
    });
  })





  .directive('map', function () {
    return {
      restrict: 'E',
      scope: {
        onCreate: '&'
      },
      link: function ($scope, $element, $attr) {
        function initialize() {
          var mapOptions = {
            center: new google.maps.LatLng(-20.7936919, -49.4000742, 20),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          var map = new google.maps.Map($element[0], mapOptions);

          $scope.onCreate({ map: map });

          // Stop the side bar from dragging when mousedown/tapdown on the map
          google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
            e.preventDefault();
            return false;
          });
        }

        if (document.readyState === "complete") {
          initialize();


        } else {
          google.maps.event.addDomListener(window, 'load', initialize);
        }
      }
    }
  })



