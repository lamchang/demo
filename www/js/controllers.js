angular.module('starter.controllers', [])

.controller('ConfigCtrl', function($scope) {})
.controller('ConfigAddCtrl', function($scope) {})
.controller('MyfeedCtrl', function($scope) {})
.controller('GroupsCtrl', function($scope) {})
.controller('PerfilCtrl', function($scope) {})
.controller('SimpleCtrl', function($scope) {})

.controller('MainCtrl', function($scope,$cookies,$cookieStore, $rootScope, Auth ){
	var url ='http://legixapp.abardev.net';
	$scope.$on('$ionicView.enter', function(e) {
		if(window.localStorage.getItem('user')&&window.localStorage.getItem('user').length>4){
		$rootScope.user_data = JSON.parse(window.localStorage.getItem('user'));
		$rootScope.user_data.src_img= url+$rootScope.user_data.src_img;
		}
	});  
})

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, Auth, $rootScope) {
    $scope.data = {};
	$scope.logout = function() {
		Auth.logout();
		$state.go("login");
	};
    $scope.login = function() {
		  console.log("LOGIN user: " + $scope.data.username + " - PW: ********");
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
			$scope.user=data.user;
			$rootScope.user_data =data.user;
			 if (data.message=="logged") {
				Auth.setUser({
				  username: $scope.user.id+'-'+$scope.user.first_name+'-'+$scope.user.last_name
				});
				if(data.user.temas.length>0)
					$state.go('tab.tema_feeds');
				if(data.user.temas.length==0)
					$state.go('tab.configfeeds');
			 }else{
				 $scope.logout = function() {
					Auth.logout();
					$state.go("login");
				};
			 }
        }).error(function(data) {
			console.log(data)
            var alertPopup = $ionicPopup.alert({
                title: 'Error al iniciar sesión',
                template: data.message, //'¡Por favor revisa tu correo y/o contraseña!',
				okText: 'Aceptar'
            });
        });
    }
})
.controller('RegistroCtrl', function($scope, Registerservice, LoginService, $ionicPopup, $state, Auth) {
	$scope.data={};
	$scope.register = function(){

	  if($scope.data.terms==true){
		  
        Registerservice.newUser($scope.data.legix_id, $scope.data.first_name, $scope.data.last_name, $scope.data.email, $scope.data.password).success(function(data) {
			$scope.user=data.user;
			 if (data.message=="Creada") {
				    LoginService.loginUser($scope.data.email, $scope.data.password).success(function(data) {
						$scope.user=data.user;
						 if (data.message=="logged") {
							Auth.setUser({
							  username: $scope.user.id+'-'+$scope.user.first_name+'-'+$scope.user.last_name
							});
							if(data.user.temas.length>0)
								$state.go('tab.tema_feeds');
							if(data.user.temas.length==0)
								$state.go('tab.configfeeds');
						 }else{
							 $scope.logout = function() {
								Auth.logout();
								$state.go("login");
							};
						 }
					}).error(function(data) {
						console.log(data)
						$scope.logout = function() {
								Auth.logout();
								$state.go("login");
						};
					});
			 }else{
				var alertPopup = $ionicPopup.alert({
                title: 'Error de conexion',
                template: '¡Por favor intenta mas tarde!', //'¡Por favor revisa tu correo y/o contraseña!',
				okText: 'Aceptar'
            });
			 }
        }).error(function(data) {
			console.log(data)
            var alertPopup = $ionicPopup.alert({
                title: 'Error al iniciar sesión',
                template: data.message, //'¡Por favor revisa tu correo y/o contraseña!',
				okText: 'Aceptar'
            });
        });
	  }else{
		  var alertPopup = $ionicPopup.alert({
                title: 'Registro',
                template: 'Debes aceptar los Términos y condiciones', //'¡Por favor revisa tu correo y/o contraseña!',
				okText: 'Aceptar'
            });
	  }
    }
})
 
 // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
.controller('ConfigfeedCtrl', function($scope, Themes) {
   	
	$scope.$on('$ionicView.enter', function(e) {
		Themes.all().success(function(data){
			
			$scope.themes = data;
		});
		$scope.remove = function(theme) {
			Themes.remove(theme);
		}
	});  
})

.controller('FeedsCtrl', function($scope, Feeds_all, Auth) {
	
	$scope.data={}
	
	$scope.$on('$ionicView.enter', function(e) { console.log(Auth.isLoggedIn())
		if(Auth.isLoggedIn()){
		$scope.load = Feeds_all.all(-1,$scope.data.busqueda).success(function(data){
			console.log($scope.data.busqueda)
			angular.forEach(data, function(val, key){
				data[key].content=val.content+' <a href="'+val.url+'" target="_blank"> '+val.url+'</a>';
			});
			$scope.feeds = data;
		
		}).error(function(){
			$scope.feeds = "";
		});
		$scope.remove = function(feed) {
			Feeds_all.remove(feed);
		}
		} else $state.go('login');
	});  
})

.controller('MyfeedsCtrl', function($scope, Feeds,$rootScope, $state, $stateParams, Auth) {
	
	 var user = $rootScope.user_data;
	
	$scope.data = {};
	console.log(user.temas.length);
	if(user.temas.length==0)
		$state.go('tab.configfeeds');
	$scope.$on('$ionicView.enter', function(e) {
		 if(Auth.isLoggedIn()){
		$scope.temas = user.temas;
		 var noread=0;
		// Feeds.all(-1,'send_data','','',$scope.data.origin_id, $scope.data.theme_id,'').success(function(data){
		$scope.changeLocation= Feeds.all(-1,'send_data','','','', $state.params.origin_id, $state.params.theme_id,'').success(function(data){
			angular.forEach(data, function(val, key){
				data[key].content=val.content+' <a href="'+val.url+'" target="_blank"> '+val.url+'</a>';
				if(val.read==0)
					noread++;
			});
			$scope.feeds = data;
			$scope.noread = noread;
		
		});
		$scope.tema_name=$state.params.name;
		
		$scope.remove = function(feed) {
			Feeds.remove(feed);
		}
		}else $state.go('login');
	});  
	
})
.controller('MyfeedCtrl', function($stateParams, $scope,Feeds,$state){
	$scope.noread=0;
	$scope.$on('$ionicView.enter', function(e) {
			Feeds.all(-1,'send_data','','','',$state.params.origin_id, $state.params.theme_id,'').success(function(data){
			$scope.feeds = data;
			angular.forEach(data, function(val, key){
				$scope.noread= $scope.noread++;
			});
		});  
		$scope.remove = function(feed) {
			Feeds.remove(feed);
		}
	});  
})

.controller('FollowingCtrl', function($scope, Feeds, $rootScope) {
	var user = $rootScope.user_data;
	var asuntos = user.follow?user.follow:'0,0';
	console.log(asuntos);
	$scope.$on('$ionicView.enter', function(e) {
		Feeds.all(-1,'','send_data','',asuntos).success(function(data){
			$scope.feeds = data;
		});
		$scope.remove = function(feed) {
			Feeds.remove(feed);
		}
	});  
})
.controller('GroupsCtrl', function($scope, Feeds, $rootScope) {
//	var user = $rootScope.user_data;
	$scope.grupos=$rootScope.user_data.grupos;
	//console.log("favoritos: "+fav_feeds);
	$scope.$on('$ionicView.enter', function(e) {
	/*	Feeds.all(-1,'','', 'send_data','','','','',fav_feeds).success(function(data){
			$scope.feeds = data;
		});*/
		$scope.remove = function(feed) {
			Feeds.remove(feed);
		}
	});  
})
.controller('FavoritesCtrl', function($scope, Feeds, $rootScope, $state) {
	
	var fav_feeds = [];
	$scope.favorites=$rootScope.user_data?$rootScope.user_data.favfolder:"";
	angular.forEach($scope.favorites, function(val, key){
			fav_feeds.push(val.id);
		});
	console.log("favoritos: "+fav_feeds);
	$scope.favfolder=$state.params.favfolder?$state.params.favfolder:'';
	//console.log("folder: "+$scope.favfolder);
	$scope.flag=false;
	$scope.folder_name=$state.params.foldername?$state.params.foldername:'Feeds Favoritos';
	$scope.$on('$ionicView.enter', function(e) {
		if($state.params.favfolder){
			Feeds.all(-1,'','', 'send_data','','','','',fav_feeds).success(function(data){
					angular.forEach(data, function(val, key){
					angular.forEach(val.favfolder, function(dato, index){
					if($state.params.favfolder==dato.folder_id){
						data[key].folder=true;
						$scope.flag=true;
					}else
						data[key].folder=false;
					});
				});
				$scope.feeds = data;
			});
		}
		$scope.remove = function(feed) {
			Feeds.remove(feed);
		}
	});  
	$scope.update_folder=function(){
	 console.log("datosupdate: "+$scope.data.folder_id+" "+$scope.data.title)	
	}
})

.controller('PerfilCtrl', function($scope,$rootScope) {
	$scope.$on('$ionicView.enter', function(e) {
		$scope.data={};
		$scope.data.first_name=$rootScope.user_data.first_name;
		$scope.data.last_name=$rootScope.user_data.last_name;
	});
})
.controller('ConfigCtrl', function($scope,$rootScope) {
	$scope.$on('$ionicView.enter', function(e) {
		$scope.user={};
	});
})
.controller('ConfigAddCtrl', function($scope,$rootScope) {
	$scope.$on('$ionicView.enter', function(e) {
		$scope.user={};
	});
});
/*
.controller('UsuariosCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})*/


