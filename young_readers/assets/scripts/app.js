
var mainApp = angular.module('mainApp', [
    'ngRoute',
    'ngCookies',
    'ngResource',
    'xeditable',
    'ui.bootstrap',
    'ngAnimate',
    'ngSanitize',
    'angular-growl',
    'ngAnimate',
]);


/* mainApp Module Configuration */
mainApp.config(['$interpolateProvider','$httpProvider',
    function($interpolateProvider,$httpProvider) {
        $interpolateProvider.startSymbol('{[');
        $interpolateProvider.endSymbol(']}');
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json'; //required for json web services
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);

mainApp.run(['$http','$cookies','editableOptions',
    function($http, $cookies,editableOptions) {
        $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
        $http.defaults.xsrfCookieName = 'csrftoken';
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        editableOptions.theme = 'bs3';
}]);

/* mainApp Generic Constants */
mainApp.constant("exInObj", function(exkey,obj){
    for(var key in obj){
        if(key===exkey){
            return true;
        }
    }
    return false;
});

mainApp.constant("loadTemplate", function(staticLink,templateDir,templatePath){
    return staticLink+templateDir+templatePath;
});

mainApp.constant("waitForResponse", function(data){
    if(data['type'] == "add"){
        //add loading symbol
        document.getElementById('loading').className += " active";
        document.getElementsByTagName('body')[0].className+= " loading";        
    }
    if(data['type'] == "remove"){
        //remove loading symbol
        if(data['status'] == "success"){
            document.getElementById("loading").classList.remove("active");
            document.getElementsByTagName('body')[0].classList.remove("loading");
        }
        else{
            document.getElementById("loading").classList.remove("active");
            document.getElementsByTagName('body')[0].classList.remove("loading");
        }
    }
});


mainApp.directive('ngScript',['djangoConstants','loadTemplate',
    function(djangoConstants,loadTemplate) {
        return {
            restrict: 'E',
            scope: false,
            link: function(scope, elem, attr){
                if (attr.type==='text/javascript'){
                    var s = document.createElement("script");
                    s.type = "text/javascript";
                    var src = elem.attr('src');
                    var script = djangoConstants['staticLink']+src;
                    if(src!==undefined){
                        s.src = script;
                    }
                    else{
                        var code = elem.text();
                        s.text = code;
                    }
                    document.head.appendChild(s);
                    elem.remove();
                }
            }
        };
}]);


/* mainApp Generic Services */
mainApp.provider('dynamicRoutes',['appConstants','djangoConstants','urlRoutes','loadTemplate','exInObj','loadTemplate',
    function(appConstants,djangoConstants,urlRoutes,loadTemplate,exInObj,loadTemplate){
        var staticLink=djangoConstants['staticLink'];
        var templateDir=appConstants['templateDir'];
        this.$get=function(){
            return {
                resolveRoutes : function(){
                    var resolvedRoutes=[];
                    angular.forEach(urlRoutes,function(route){
                        if(exInObj('templatePath',route)){
                            route['templatePath'] = loadTemplate(staticLink,templateDir,route['templatePath']);
                        }
                        resolvedRoutes.push(route);
                    });
                    return resolvedRoutes;
                }
            }
        };
}]);


mainApp.factory('Constants',['djangoConstants','appConstants',
    function(djangoConstants,appConstants){
        var constants = {};
        angular.extend(constants, appConstants);
        angular.extend(constants, djangoConstants); 
        return {
            get: function(key) {
                return constants[key];
            },
            all: function() {
                return constants;
            }
        };
}]);

mainApp.factory('Template',['Constants','loadTemplate',
    function(Constants){
        var staticLink = Constants.get('staticLink');
        var templateDir = Constants.get('templateDir');
        return {
            get: function(templatePath) {
                return loadTemplate(staticLink,templateDir,templatePath);
            }
        };
}]);

mainApp.factory('transformRequestAsFormPost',[
    function(djangoConstants,appConstants){
        function transformRequest( data, getHeaders ) {
            var headers = getHeaders();
            if("Content-Type" in headers){
                headers["Content-Type"] = null;
                delete headers["Content-Type"];
            }
            headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";             
            return(serializeData(data));         
        }
        return(transformRequest);
        function serializeData( data ) {         
            if (!angular.isObject(data)) {             
                return((data == null) ? "" : data.toString() );             
            }         
            var buffer = [];             
            for (var name in data) {             
                if (!data.hasOwnProperty(name)) {                 
                    continue;             
                }         
                var value = data[name];         
                buffer.push(encodeURIComponent(name) +"=" +encodeURIComponent((value == null) ? "" : value ));         
            }
            var source = buffer.join("&").replace(/%20/g, "+" );         
            return(source);         
        }
}]);

mainApp.factory('transactions',['$http', '$q', 'Constants', 
    function($http, $q, Constants){
        var transactions = {};
        transactions.create = function (data) {
            var options = {
                'method': 'POST',
                'url': '/api/transactions/',
                'data' : data,
            };
            return transactions.core(options);
        };
        transactions.read = function(data){
            var options = {
                'method': 'GET',
                'url': '/api/transactions/'
            };
            if (data.hasOwnProperty('ID')) {
                options.url = options.url+ID;
            }
            if (data.hasOwnProperty('params')) {
                options.params = data.params
            }
            return transactions.core(options);
        };
        transactions.update = function(ID, data){
            var options = {
                'method': 'PATCH',
                'url': '/api/transactions/'+ID,
                'data' : data,
            };
            return transactions.core(options);
        };
        transactions.delete = function(ID){
            var options = {
                'method': 'DELETE',
                'url': '/api/transactions/'+ID,
            };
            return transactions.core(options);
        };
        transactions.core = function (options) {
            var deferer = $q.defer();
            var promise = deferer.promise;
            $http(options).success(function(data){
                deferer.resolve(data);
            }).error(function(data){
                var out = {};
                out.status = 'error';
                out.result = data;
                deferer.reject(data);
            });
            return promise;
        }
        return{
            'create' : transactions.create,
            'read'   : transactions.read,
            'update' : transactions.update,
            'delete' : transactions.delete
        };
    }]);

mainApp.factory('wishlist',['$http', '$q', 'Constants', 
    function($http, $q, Constants){
        var wishlist = {};
        wishlist.create = function (data) {
            var options = {
                'method': 'POST',
                'url': '/api/wishlist/',
                'data' : data,
            };
            return wishlist.core(options);
        };
        wishlist.read = function(data){
            var options = {
                'method': 'GET',
                'url': '/api/wishlist/'
            };
            if (data.hasOwnProperty('ID')) {
                options.url = options.url+ID;
            }
            if (data.hasOwnProperty('params')) {
                options.params = data.params
            }
            return wishlist.core(options);
        };
        wishlist.update = function(ID, data){
            var options = {
                'method': 'PATCH',
                'url': '/api/wishlist/'+ID,
                'data' : data,
            };
            return wishlist.core(options);
        };
        wishlist.delete = function(ID){
            var options = {
                'method': 'DELETE',
                'url': '/api/wishlist/'+ID,
            };
            return wishlist.core(options);
        };
        wishlist.core = function (options) {
            var deferer = $q.defer();
            var promise = deferer.promise;
            $http(options).success(function(data){
                deferer.resolve(data);
            }).error(function(data){
                var out = {};
                out.status = 'error';
                out.result = data;
                deferer.reject(data);
            });
            return promise;
        }
        return{
            'create':wishlist.create,
            'read':wishlist.read,
            'update':wishlist.update,
            'delete':wishlist.delete
        };
    }]);

mainApp.factory('addresses',['$http', '$q', 'Constants', 
    function($http, $q, Constants){
        var address = {};
        address.create = function (data) {
            var options = {
                'method': 'POST',
                'url': '/api/addresses/',
                'data' : data,
            };
            return address.core(options);
        };
        address.read = function(data){
            var options = {
                'method': 'GET',
                'url': '/api/addresses/'
            };
            if (data.hasOwnProperty('ID')) {
                options.url = options.url+ID;
            }
            if (data.hasOwnProperty('params')) {
                options.params = data.params
            }
            return address.core(options);
        };
        address.update = function(ID, data){
            var options = {
                'method': 'PATCH',
                'url': '/api/addresses/'+ID,
                'data' : data,
            };
            return address.core(options);
        };
        address.core = function (options) {
            var deferer = $q.defer();
            var promise = deferer.promise;
            $http(options).success(function(data){
                deferer.resolve(data);
            }).error(function(data){
                var out = {};
                out.status = 'error';
                out.result = data;
                deferer.reject(data);
            });
            return promise;
        }
        return{
            'create':address.create,
            'read':address.read,
            'update':address.update
        };
    }]);

mainApp.factory('profile',['$http', '$q', 'Constants', function($http, $q, Constants){
    var profile = {};
    profile.read = function(ID){
        var deferer = $q.defer();
        var promise = deferer.promise;
        var options = {
            'method': 'GET',
            'url': '/api/profile/'+ID,
        };
        $http(options).success(function(data){
            deferer.resolve(data);
        }).error(function(data){
            var out = {};
            out.status = 'error';
            out.result = data;
            deferer.reject(data);
        });
        return promise;
    };
    profile.update = function(ID, data){
        var deferer = $q.defer();
        var promise = deferer.promise;
        var options = {
            'method': 'PATCH',
            'url': '/api/profile/'+ID,
            'data' : data,
        };
        $http(options).success(function(data){
            deferer.resolve(data);
        }).error(function(data){
            var out = {};
            out.status = 'error';
            out.result = data;
            deferer.reject(data);
        });
        return promise;
    };
    return{
        'read':profile.read,
        'update':profile.update
    };
    }]);


mainApp.factory('books', ['$http', '$q', 'Constants', function($http, $q, Constants){
    var books = {};
    books.create = function (data) {
        var deferer = $q.defer();
        var promise = deferer.promise;
        var options = {
            'method': 'POST',
            'url': '/api/books/',
            'data' : data,
        };
        $http(options).success(function(data){
            deferer.resolve(data);
        }).error(function(data){
            var out = {};
            out.status = 'error';
            out.result = data;
            deferer.reject(data);
        });
        return promise;
    };
    books.read = function(ID){
        var deferer = $q.defer();
        var promise = deferer.promise;
        var options = {
            'method': 'GET',
            'url': '/api/books/'
        };
        if(ID){
            options.url = options.url + ID + "/";
        }
        $http(options).success(function(data){
            var out = {};
            out.status = 'success';
            if(data.length)
                out.result = data;
            else{
                out.result = [data];
            }

            deferer.resolve(out);
        }).error(function(data){
            var out = {};
            out.status = 'error';
            out.result = data;
            deferer.reject(data);
        });
        return promise;
    };

    books.update = function(ID, data){

    };

    books.delete = function(ID){

    };

    books.search = function(params){

    };

    return{
        'read':books.read,
        'update':books.update,
        'delete':books.delete,
        'search':books.search,
        'create':books.create,
    }

}]);

mainApp.factory('books_list',['$http', '$q', 'Constants', 
    function($http, $q, Constants){
        var books_list = {};
        books_list.create = function (data) {
            var options = {
                'method': 'POST',
                'url': '/api/books_list/',
                'data' : data,
            };
            return books_list.core(options);
        };
        books_list.read = function(data){
            var options = {
                'method': 'GET',
                'url': '/api/books_list/'
            };
            if (data.hasOwnProperty('ID')) {
                options.url = options.url+ID;
            }
            if (data.hasOwnProperty('params')) {
                options.params = data.params
            }
            return books_list.core(options);
        };
        books_list.update = function(ID, data){
            var options = {
                'method': 'PATCH',
                'url': '/api/books_list/'+ID,
                'data' : data,
            };
            return books_list.core(options);
        };
        books_list.core = function (options) {
            var deferer = $q.defer();
            var promise = deferer.promise;
            $http(options).success(function(data){
                deferer.resolve(data);
            }).error(function(data){
                var out = {};
                out.status = 'error';
                out.result = data;
                deferer.reject(data);
            });
            return promise;
        }
        return{
            'create':books_list.create,
            'read':books_list.read,
            'update':books_list.update
        };
    }]);




/* mainApp Generic Controller */
mainApp.controller('mainController',['$scope','Constants',
    function($scope,Constants){
        $scope.staticPath = Constants.get('staticLink');
        $scope.loadStatic = function(assetPath){
            return Constants.get('staticLink')+assetPath;
        };
        $scope.loadImage = function(assetPath){
            return Constants.get('staticLink')+Constants.get('imageDir')+assetPath;
        };
}]);


/* mainApp Generic Router */
mainApp.config(['$injector','$routeProvider','$locationProvider','dynamicRoutesProvider','exInObj',
    function($injector,$routeProvider,$locationProvider,dynamicRoutes,exInObj) {
        var routes=dynamicRoutes.$get().resolveRoutes();
        angular.forEach(routes,function(dynamicRoute){
            if(exInObj('redirectTo',dynamicRoute)){
                $routeProvider.when(dynamicRoute['path'],{
                    redirectTo : dynamicRoute['redirectTo']
                });
            }
            else if(exInObj('templatePath',dynamicRoute)){
                if(exInObj('controller',dynamicRoute)){
                    $routeProvider.when(dynamicRoute['path'],{
                        templateUrl : dynamicRoute['templatePath'],
                        controller : dynamicRoute['controller']
                    });
                }
                else{
                    $routeProvider.when(dynamicRoute['path'],{
                        templateUrl : dynamicRoute['templatePath']
                    });
                }
            }
        });
        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.hashPrefix('!');
        $locationProvider.html5Mode(true);
}]);