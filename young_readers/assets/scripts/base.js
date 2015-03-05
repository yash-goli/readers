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
    {'path':'/books/','templatePath':'books_list.html','controller':'booksListController'},
    {'path':'/books/add/','templatePath':'books_add.html','controller':'booksAddController'},
    {'path':'/books/barcodes/','templatePath':'barcode_add.html','controller':'barcodesAddController'},
    {'path':'/books/delete/','templatePath':'books_delete.html','controller':'booksDeleteController'},
    {'path':'/books/dispatch/','templatePath':'books_dispatch.html','controller':'booksDispatchController'},
    {'path':'/books/collect/','templatePath':'books_collect.html','controller':'booksCollectController'},
]);

/** External plugins configuration **/
mainApp.config(['growlProvider', function (growlProvider) {
    growlProvider.globalTimeToLive(10000);
    growlProvider.globalPosition('top-center');
}]);

// Base Controller
mainApp.controller('baseController',['$scope','Constants','$location','growl','$http','$timeout',
    function($scope,Constants,$location,growl,$http,$timeout){   
        $scope.redirect = function (path) {
            window.location.href = path;
        };
        $scope.logout = function () {
            var options = {
                'method': 'GET',
                'url': '/logout/',
            };
            $http(options).success(function (data) {
                if (data.message === "success") {
                    $scope.redirect("/");
                }
            }).error(function (data) {
            }); 
        };  
}]);

// Home Controller
mainApp.controller('homeController',['$scope','Constants','$timeout','books','growl','$http',
    function($scope,Constants,$timeout,books,growl,$http){
        books.read().then(function (data) {
            $scope.books = data.result;
        }, function (data) {

        })
}]);

// Books Controller
mainApp.controller('accountController',['$scope','Constants','$timeout','$http','growl','djangoConstants','transformRequestAsFormPost',
    function($scope,Constants,$timeout,$http,growl,djangoConstants,transformRequestAsFormPost){  
        $scope.login = function ($event){
            var el = $event.target;
            el.setAttribute('disabled','disabled');
            el.innerText = "";
            el.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test($scope.lemail)) {
                var options = {
                    'transformRequest': transformRequestAsFormPost,
                    'method': 'POST',
                    'url': '/login/',
                    'data' : {
                        'csrfmiddlewaretoken' : djangoConstants.csrfToken,
                        'username' : $scope.lemail,
                        'password' : $scope.lpwd
                    },
                };
                $http(options).success(function (data) {
                    if (data.message === "success") {
                        $scope.redirect("/");
                    }
                }).error(function (data) {
                    el.removeAttribute("disabled");
                    el.innerHTML = '';
                    el.innerText = "Login";
                });
            }
            else {
                growl.error("Invaild Email")
            }    
        };  
}]);

// Books Controller
mainApp.controller('barcodesAddController',['$scope','Constants','$timeout','$http','growl',
    function($scope,Constants,$timeout,$http,growl){
        $scope.barcodes = [];
        $scope.generateCodes = function(){
            var options = {
                'method': 'GET',
                'url': '/generate_codes/',
                'params': {
                    'codes':$scope.codes
                },
            };
            $http(options).success(function (data) {
                console.log(data)
                data.forEach(function(val) { 
                    $scope.barcodes.push($scope.loadImage("barcode/"+val+".png"));
                });
            }).error(function (data) {
            });
        };

        $scope.loadImage = function(assetPath){
            return Constants.get('staticLink')+Constants.get('imageDir')+assetPath;
        };
     
}]);

// Books Controller
mainApp.controller('booksAddController',['$scope','Constants','$timeout','$http','growl','books',
    function($scope,Constants,$timeout,$http,growl,books){
        
        $scope.is_book = false;
        $scope.book_data = {
                'ISBN_10' : '',
                'ISBN_13' : '',
                'title' : '',
                'author' : '',
                'cover_type' : '',
                'image' : '',
                'publisher' : '',
                'description' : '',
                'subject' : '',
                'book_penalty' : '',
                'total_count' : '',
            };
        $scope.tags = [];
        $scope.getBookData = function () {
            var url,
                options = {
                    'method': 'GET',
                    'url': '/get_book_data/',
                    'params': {
                        'isbn':$scope.isbn
                    },
                };
        
            $http(options).success(function(data){
                console.log(data);
                $scope.is_book = true;
                $scope.book_data.ISBN_10 = data.isbn_10;
                $scope.book_data.ISBN_13 = data.isbn_13;
                $scope.book_data.title = data.title;
                $scope.book_data.author = data.author;
                $scope.book_data.image = data.image;
                $scope.book_data.publisher = data.publisher;
                $scope.book_data.description = data.description;
                $scope.more = data.more;
                data.subject.forEach(function (val) {
                    val.split("-").forEach(function (tag) {
                        if ($scope.tags.indexOf(tag) === -1) {
                            $scope.tags.push(tag);
                        }
                    });
                });
            }).error(function(data){
                $scope.is_book = false;
                console.log(data);
            });
        };   

        $scope.save_book = function () {
            $scope.book_data.subject = "";
            $scope.tags.forEach(function (val) {
                $scope.book_data.subject = $scope.book_data.subject + "-" +val;
            });
            books.create($scope.book_data).then(function (data) {
                console.log(data);
            }, function (data) {
                console.log(data);
            });
        };
     
}]);

// Books Controller
mainApp.controller('booksListController',['$scope','Constants','$timeout','$http','growl',
    function($scope,Constants,$timeout,$http,growl){

        $scope.getBookDetails = function(){

        };
     
}]);


// Books Controller
mainApp.controller('booksDeleteController',['$scope','Constants','$timeout','$http','growl',
    function($scope,Constants,$timeout,$http,growl){

        $scope.deleteBook = function(){

        };
     
}]);

// Books Controller
mainApp.controller('booksDispatchController',['$scope','Constants','$timeout','$http','growl',
    function($scope,Constants,$timeout,$http,growl){

        $scope.dispatchBook = function(){

        };
     
}]);

// Books Controller
mainApp.controller('booksCollectController',['$scope','Constants','$timeout','$http','growl',
    function($scope,Constants,$timeout,$http,growl){

        $scope.collectBook = function(){

        };
     
}]);