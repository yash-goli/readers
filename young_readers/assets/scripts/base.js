mainApp.constant("appConstants", {
    'homePath': '/',
    'loginPath': '/login/',
    'apiPath' : '/webservices/api/1/',
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
    	
}]);

// Test Controller
mainApp.controller('testController',['$scope','Constants','$timeout','$http','growl',
    function($scope,Constants,$timeout,$http,growl){
      
}]);


