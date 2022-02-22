
var app = angular.module('myApp', ['ngRoute']);


app.controller('signin',function ($window,$scope,$http) {
    
    $scope.log=function(admin){
        $http({
            method:"POST",
            url:'https://signalements.herokuapp.com/frontLogin',
            data:admin,
            dataType:'application/json'
        }).then(
            function (res){
                if (res.data.status==200){
                    $window.localStorage.setItem("token",res.data.datas);
                    $window.location.href = 'ListeSignal.html';
                }
                else{
                    alert('Login incorrect   '+res.data.message);
                }
            },
            function (res){
                alert('Login incorrect   '+res.data.message);
            }
        );
    }
});  




app.controller('out',function($window,$scope){
    $scope.logout=function(){
        $scope.token = $window.localStorage.removeItem("token");
        $window.location.href = 'index.html';
    }
});




app.controller('andrana',function($window,$scope,$http){    
            $scope.token = $window.localStorage.getItem("token");
            $scope.signal=[];
            $scope.statuts=[];
            $scope.types=[];
            $scope.data={};
           
            var config = {headers: {              
                'Authorization': "Bearer"+$scope.token
                }
            };
            
            $http.get("https://signalements.herokuapp.com/signalements",config).then(function(response) {
                $scope.signal = response.data.data;
                //console.log(response.data.data);
            });
            $http.get("https://signalements.herokuapp.com/status",config).then(function(response) {
              $scope.statuts = response.data.data;
              //console.log(response.data.data);
            });
            $http.get("https://signalements.herokuapp.com/types",config).then(function(response) {
              $scope.types= response.data.data;
              //console.log(response.data.data);
            });

          $scope.filter = {};

          // reset the filter
          $scope.resetFilter = function() {
            // set filter object as blank
            $scope.filter = {}; 
          }

            $scope.nomregion=[];
            $scope.nbregion=[];
            
            $scope.signale=function(signe){
               
              $scope.data=signe;
                
                $http.get("https://signalements.herokuapp.com/region/"+$scope.data.idregion,config).then(function(response) {
                  $scope.data.nomregion = response.data;
                  
                  $http.get("https://signalements.herokuapp.com/statut/"+$scope.data.idstatut,config).then(function(response) {
                    $scope.data.nomstatut = response.data;
                    
                    $http.get("https://signalements.herokuapp.com/type/"+$scope.data.idtypesignalement,config).then(function(response) {
                      $scope.data.nomtype = response.data;
                      
                      
                    });
                  });
                });
                
                return $scope.data;
            }

            $scope.recherche=function(newR){
              //console.log(JSON.stringify(newR));
              $http.get("https://signalements.herokuapp.com/recherche/"+JSON.stringify(newR),config).then(function(response) {
                $scope.signal = response.data.data;   
                  console.log($scope.signal);                 
                }); 
            }




           
          
            
           
});


    
  


app.controller('carte',function($window,$scope,$http){
    $scope.token = $window.localStorage.getItem("token");
    $scope.signal=[];
    $scope.typee = [] ;
    $scope.data={};
    var config = {headers: {
        'Authorization': "Bearer"+$scope.token
        }
    };

    $http.get("https://signalements.herokuapp.com/status",config).then(function(response) {
              $scope.statuts = response.data.data;
              //console.log(response.data.data);
            });
            $http.get("https://signalements.herokuapp.com/types",config).then(function(response) {
              $scope.types= response.data.data;
              //console.log(response.data.data);
            });
     
    function determineColor(rating) {
      if ( rating === 1) {
        return new L.Icon({
          iconUrl: '../frontOffice/img/marker-icon-2x-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });
      } else if ( rating === 2 ) {
        return new L.Icon({
          iconUrl: '../frontOffice/img/marker-icon-2x-orange.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });
      } else if ( rating === 3 ) {
        return new L.Icon({
          iconUrl: '../frontOffice/img/marker-icon-2x-yellow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });
      } else if ( rating === 4 ) {
        return new L.Icon({
          iconUrl: '../frontOffice/img/marker-icon-2x-black.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });
      } else if ( rating === 5 ) {
        return new L.Icon({
          iconUrl: '../frontOffice/img/marker-icon-2x-violet.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });
      }
       else if ( rating === 6 ) {
        return new L.Icon({
          iconUrl: '../frontOffice/img/marker-icon-2x-gold.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });
      } else {
        return new L.Icon({
          iconUrl: '../frontOffice/img/marker-icon-2x-blue.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });
      }
    };


    
    $http.get("https://signalements.herokuapp.com/signalements",config).then(function(response) {
        
        $scope.signal = response.data.data;
        $scope.latregion;
        $scope.longregion;

        $http.get("https://signalements.herokuapp.com/types").then(function(response) {
            $scope.typee = response.data.data;
                function determineType(type){
                    for(let k=0;k<$scope.typee.length;k++){
                        if($scope.typee[k].id === type.idtypesignalement){
                            return $scope.typee[k].typesignalement;
                        }
                    }
                }
            
            $http.get("https://signalements.herokuapp.com/status").then(function(response) {
                $scope.statuee = response.data.data;
                function determineStatut(statut){
                    for(let k=0;k<$scope.statuee.length;k++){
                        if($scope.statuee[k].id === statut.idstatut){
                            return $scope.statuee[k].nomstatut;
                        }
                    }
                }
                $http.get("https://signalements.herokuapp.com/region",config).then(function(response) {
                    $scope.latregion = response.data.data["latitude"];
                    $scope.longregion = response.data.data["longitude"];
                    $scope.nomregion = response.data.data["nom"];
                    var map = L.map('map').setView([$scope.latregion, $scope.longregion], 10);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);

                    for(let i=0 ; i < $scope.signal.length; i++){
                        var marker = L.marker([$scope.signal[i].latitude, $scope.signal[i].longitude], {icon: determineColor($scope.signal[i].idtypesignalement)}).addTo(map);
                        

                        marker.bindPopup('<p>Designation:'+$scope.signal[i].designation+'</p><p>Region:'+$scope.nomregion+'</p><p>Statut:'+determineStatut($scope.signal[i])+'</p><p>'+JSON.stringify(determineType($scope.signal[i]))+'</p><p><a href="Apropos.html?idsigne='+$scope.signal[i].id+'">a propos </a></p>');
                        marker.on('mouseover', function (e) {
                            this.openPopup();
                        });
                    }
                });
            });
         });
    });



});



app.controller('details',function($window,$location,$scope,$http){
    $scope.token = $window.localStorage.getItem("token");
    var config = {headers: {
        'Authorization': "Bearer"+$scope.token
        }
    };

    var paramValue = $location.search().idsigne;
    $http.get("https://signalements.herokuapp.com/signe/"+paramValue,config).then(function(response) {
        $scope.data = response.data.data;
        $http.get("https://signalements.herokuapp.com/region/"+$scope.data.idregion,config).then(function(response) {
          $scope.data.nomregion = response.data;
          $http.get("https://signalements.herokuapp.com/statut/"+$scope.data.idstatut,config).then(function(response) {
            $scope.data.nomstatut = response.data;
            $http.get("https://signalements.herokuapp.com/type/"+$scope.data.idtypesignalement,config).then(function(response) {
              $scope.data.nomtype = response.data;
            });
          });
        });
    });
      
});

app.config(['$routeProvider','$locationProvider', ($routeProvider, $locationProvider) => {
    $routeProvider
        .when('/', {
            templateUrl: 'index.html',
            controller: 'Login'
        })
        .when('/stat', {
            templateUrl: 'stat.html',
            controller: 'stat'
        })
         .otherwise({       
                redirectTo: '/helloworld.html'
        })
         $locationProvider.html5Mode(true); 
}]);