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
    {'path':'/books/delete/','templatePath':'books_delete.html','controller':'booksDeleteController'},
    {'path':'/books/dispatch/','templatePath':'books_dispatch.html','controller':'booksDispatchController'},
    {'path':'/books/collect/','templatePath':'books_collect.html','controller':'booksCollectController'},
]);

mainApp.constant("getBookDetails", function (obj) {
    console.log(obj)
    var vendor, item, book_details, description = '',
        data = {
            'img_links' : [],
            'title' : '',
            'publisher' : '',
            'isbn_10' : '',
            'isbn_13' : '',
            'description' : '',
            'author' : '',
        },
        amazon_img = ['LargeImage', 'MediumImage', 'SmallImage'],
        getImageData = function (img_objs, vendor) {
            var img_obj;
            if (vendor === "amazon") {
                if (img_objs.hasOwnProperty("URL")) {
                    data.img_links.push(img_objs.URL);
                }
            }
            if (vendor === "google") {
                for (img_obj in img_objs) {
                    data.img_links.push(img_objs[img_obj]);
                }
            }
        },
        getBookData = function (book_data, vendor) {
            var img_obj, content;
            if (vendor === "amazon") {
                for (img_obj in amazon_img) {
                    if (book_data.hasOwnProperty(amazon_img[img_obj])) {
                        getImageData(book_data[amazon_img[img_obj]], vendor);
                    }
                }

                if (book_data.hasOwnProperty("ItemAttributes")) {
                    data.title = book_data.ItemAttributes.Title;
                    data.publisher = book_data.ItemAttributes.Publisher;
                    data.isbn_10 = book_data.ItemAttributes.EAN;
                    data.isbn_13 = book_data.ItemAttributes.ISBN;
                    data.author = book_data.ItemAttributes.Author;
                }

                if (book_data.hasOwnProperty("EditorialReviews")) {
                    if (book_data.EditorialReviews.EditorialReview instanceof Array) {
                        for (content in book_data.EditorialReviews.EditorialReview) {
                            description = description + book_data.EditorialReviews.EditorialReview[content].Content + "<br>";
                        }
                    }
                    console.log(data.description)
                    if (typeof(book_data.EditorialReviews.EditorialReview) === "object") {
                        data.description = book_data.EditorialReviews.EditorialReview.Content;
                    }
                }
            }
            data.description = description;
        };

    for (vendor in obj) {
        if (vendor === "isbndb") {
            if (!obj[vendor].hasOwnProperty("error")) {

            }
        }

        if (vendor === "google") {
            if (obj[vendor].totalItems !== 0) {
                book_details = obj[vendor].items[0].volumeInfo;
                if (book_details.hasOwnProperty("imageLinks")) {
                    getImageData(book_details.imageLinks, vendor);
                }
            }
        }

        if (vendor === "amazon") {
            if (!obj[vendor].ItemLookupResponse.Items.hasOwnProperty("Errors")) {
                book_details = obj[vendor].ItemLookupResponse.Items.Item;
                if (book_details instanceof Array) {
                    for (item in book_details) {
                        getBookData(book_details[item], vendor);
                    }
                }
                if (typeof(book_details) === "object") {
                    getBookData(book_details, vendor);
                }
            }
        }
    }

    return {
        'data' : data
    }
});

// Base Controller
mainApp.controller('baseController',['$scope','Constants','$location','growl','$http','$timeout',
    function($scope,Constants,$location,growl,$http,$timeout){        
}]);

// Home Controller
mainApp.controller('homeController',['$scope','Constants','$timeout','books','growl','getBookDetails','$http',
    function($scope,Constants,$timeout,books,growl,getBookDetails,$http){

        // books.read(1).then(function(data){
        //     if(data.status == 'success'){
        //         $scope.books = data.result;
        //     }
        // }); 

        $scope.book_meta = ['ISBN','title','author','subject','publisher','item_type','cover_type','image'];
        $scope.images = {}
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
                $scope.data = getBookDetails(data).data;
                $scope.images = $scope.data.img_links;
                books.create($scope.data);
            }).error(function(data){
                console.log(data)
                alert()
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
mainApp.controller('booksAddController',['$scope','Constants','$timeout','$http','growl',
    function($scope,Constants,$timeout,$http,growl){

        $scope.addBook = function(){

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