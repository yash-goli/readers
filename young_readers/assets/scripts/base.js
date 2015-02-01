mainApp.constant("appConstants", {
    'homePath': '/',
    'loginPath': '/login/',
    'apiPath' : '/api/',
    'templateDir' : 'partials/',
    'imageDir' : 'images/',
});

/* Partial Routes */
mainApp.constant("urlRoutes", [
    {'path':'/','templatePath':'home.html','controller':'homeController'},
    {'path':'/test/','templatePath':'test.html','controller':'testController'},
]);

// Base Controller
mainApp.controller('baseController',['$scope','Constants','$location','growl','$http','$timeout',
    function($scope,Constants,$location,growl,$http,$timeout){        
}]);

// Home Controller
mainApp.controller('homeController',['$scope','Constants','$timeout','$http','growl',
    function($scope,Constants,$timeout,$http,growl){
    	var options = {
                'method': 'GET',
                'url': '/api/books/'
            };
            $http(options).success(function(data){
                $scope.books = data;
                console.log(data);
            }).error(function(data){

            });
}]);

// Test Controller
mainApp.controller('testController',['$scope','Constants','$timeout','$http','growl',
    function($scope,Constants,$timeout,$http,growl){
      
}]);


