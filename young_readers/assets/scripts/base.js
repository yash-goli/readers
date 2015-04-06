mainApp.constant("appConstants", {
    'homePath': '/',
    'loginPath': '/login/',
    'apiPath' : '/api/',
    'templateDir' : 'partials/',
    'imageDir' : 'images/'
});

/* Partial Routes */
mainApp.constant("urlRoutes", [
    {'path': '/', 'templatePath': 'home.html', 'controller': 'homeController'},
    {'path': '/account/', 'templatePath': 'account.html', 'controller': 'accountController'},
    // {'path': '/books/', 'templatePath': 'books_list.html', 'controller': 'booksListController'},
    {'path': '/book_detail/:book_id/', 'templatePath': 'books_detail.html', 'controller': 'booksDetailController'},
    {'path': '/books/rentlist/', 'templatePath': 'books_rentlist.html', 'controller': 'booksRentlistController'},
    {'path': '/books/checkout/', 'templatePath': 'books_checkout.html', 'controller': 'booksCheckoutController'},
    {'path': '/books/add/', 'templatePath': 'books_add.html', 'controller': 'booksAddController'},
    {'path': '/books/barcodes/', 'templatePath': 'barcode_add.html', 'controller': 'barcodesAddController'},
    {'path': '/books/delete/', 'templatePath': 'books_delete.html', 'controller': 'booksDeleteController'},
    {'path': '/books/dispatch/', 'templatePath': 'books_dispatch.html', 'controller': 'booksDispatchController'},
    {'path': '/books/collect/', 'templatePath': 'books_collect.html', 'controller': 'booksCollectController'},
]);

/** External plugins configuration **/
mainApp.config(['growlProvider', function (growlProvider) {
    growlProvider.globalTimeToLive(10000);
    growlProvider.globalPosition('top-center');
}]);

mainApp.filter('trimTitleName', function() {
    return function(arg,count) {
        if(arg.length > count){
            arg = arg.substring(0,count) + "...";
        }
        return arg;
    };
});

// Base Controller
mainApp.controller('baseController', ['$scope', 'Constants', '$location', 'growl', '$http', '$timeout', 'wishlist', '$location',
    function ($scope, Constants, $location, growl, $http, $timeout, wishlist, $location) {
        $scope.noty_bell = 0;
        $scope.look_up = Constants.get('userSiteObj')['lookup'];
        $scope.is_super = Constants.get('userSiteObj')['is_superuser'];
        // $scope.noty_wish = 0;
        $scope.noty_cart = 0;
        $scope.wishlist = [];
        $scope.checkout = false;
        if ($scope.look_up !== -1 && !$scope.is_super) {
            wishlist.read({
                'params': {
                    'user_id': Constants.get('userSiteObj')['lookup'],
                    'status' : 'order'
                },
            }).then(function (data) {
                $scope.noty_cart = data.length;
                data.forEach(function(val) {
                    $scope.wishlist.push(val);
                });
                
            }, function (data) {
                
            });
        }
        
        $scope.redirect = function (path) {
            window.location.href = path;
        };
        $scope.ng_redirect = function (path) {
            $location.path(path);
        };
        $scope.reload = function () {
            window.location.reload();
        };
        $scope.logout = function () {
            var options = {
                'method': 'GET',
                'url': '/logout/'
            };
            $http(options).success(function (data) {
                if (data.message === "success") {
                    $scope.redirect("/");
                }
            }).error(function (data) {
            });
        };

        $scope.rent_it = function (obj) {
            $scope.wishlist.push(obj);
            obj.add_cart = true;
            $scope.noty_cart = $scope.noty_cart + 1;
            wishlist.create({
                'user_id': Constants.get('userSiteObj')['lookup'],
                'book_id': obj.book_id,
                'audit_dttm': new Date(),
                'book_name': obj.title,
                'status': 'order',
            }).then(function (data) {
        
            }, function (data) {
                
            });
        };
        $scope.remove_it = function (id) {
            $scope.noty_cart = $scope.noty_cart - 1;
        };
    }]);

// Home Controller
mainApp.controller('homeController', ['$scope', 'Constants', '$timeout', 'books', 'growl', '$http',
    function ($scope, Constants, $timeout, books, growl, $http) {
        books.read().then(function (data) {
            $scope.wishlist = $scope.$parent.wishlist || [];
            data.result.forEach(function(obj) {
                if ($scope.wishlist.length === 0) {
                    obj['add_cart'] = false;
                }
                else {
                    $scope.wishlist.forEach(function (val) {
                        if (obj.book_id === val.book_id) {
                            obj['add_cart'] = true;
                        }
                    });
                }
            });
            $scope.books = data.result;
        }, function (data) {

        });
    }]);

// Accounts Controller
mainApp.controller('accountsController', ['$scope', 'Constants', '$timeout', '$http', 'growl', 'djangoConstants', 'transformRequestAsFormPost',
    function ($scope, Constants, $timeout, $http, growl, djangoConstants, transformRequestAsFormPost) {
        $scope.re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        $scope.is_registered = false;
        $scope.login = function ($event, lemail, lpwd) {
            var el = $event.target,
                options = {
                    'transformRequest': transformRequestAsFormPost,
                    'method': 'POST',
                    'url': '/login/',
                    'data' : {
                        'csrfmiddlewaretoken' : djangoConstants.csrfToken,
                        'email' : lemail,
                        'password' : lpwd
                    }
                };
            el.setAttribute('disabled', 'disabled');
            el.innerText = "";
            el.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
            
            if ($scope.re.test(lemail)) {
                $http(options).success(function (data) {
                    if (data.message === "success") {
                        $scope.redirect("/");
                    }
                }).error(function (data) {
                    el.removeAttribute("disabled");
                    el.innerHTML = '';
                    el.innerText = "Login";
                });
            } else {
                growl.error("Invaild Email");
            }
        };
        
        $scope.register = function ($event, rname, remail, rpwd) {
            var el = $event.target,
                options = {
                    'transformRequest': transformRequestAsFormPost,
                    'method': 'POST',
                    'url': '/register/',
                    'data' : {
                        'csrfmiddlewaretoken' : djangoConstants.csrfToken,
                        'username': rname,
                        'email': remail,
                        'password' : rpwd
                    }
                };
            el.setAttribute('disabled', 'disabled');
            el.innerText = "";
            el.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
            if ($scope.re.test(remail)) {
                $http(options).success(function (data) {
                    if (data.message === "success") {
                        $scope.is_registered = true;
                    }
                }).error(function (data) {
                    el.removeAttribute("disabled");
                    el.innerHTML = '';
                    el.innerText = "Login";
                });
            } else {
                growl.error("Invaild Email");
            }
        };
    }]);

//Account Countroller
mainApp.controller('accountController', ['$scope', 'Constants', '$timeout', '$http', 'growl', 'djangoConstants', 'transformRequestAsFormPost', 'profile', 'addresses',
    function ($scope, Constants, $timeout, $http, growl, djangoConstants, transformRequestAsFormPost, profile, addresses) {
        $scope.state = "Telangana";
        $scope.country = "India";
        $scope.is_paid = false;
        profile.read(Constants.get('userSiteObj')['lookup']).then(function (data) {
            $scope.first_name = data.first_name;
            $scope.last_name = data.last_name;
            $scope.mobile_no = data.mobile_no;
            $scope.gender = data.gender;
        }, function (data) {
        });
        addresses.read(Constants.get('userSiteObj')['lookup']).then(function (data) {
            
        }, function (data) {
        });
        $scope.save_chg = {
            prl_info: function () {
                var data = {
                    'first_name': $scope.first_name,
                    'last_name': $scope.last_name,
                    'mobile_no': '+91' + $scope.mobile_no,
                    'gender': $scope.gender
                };
                profile.update(Constants.get('userSiteObj')['lookup'],data).then(function (data) {
                }, function (data) {
                });
            },
            chg_pwd: function () {
                var data = {
                    'old_password': $scope.old_pwd,
                    'password': $scope.password
                };
                if ($scope.password === $scope.cnf_pwd) {
                    profile.update(Constants.get('userSiteObj')['lookup'],data).then(function (data) {
                    }, function (data) {
                    });
                }
            },
            addr: function () {
                var data = {
                    'user': Constants.get('userSiteObj')['lookup'],
                    'addr_name': $scope.name,
                    'address': $scope.address,
                    'landmark': $scope.landmark,
                    'state': $scope.state,
                    'city': $scope.country,
                    'pincode': $scope.pincode,
                    'modile_no': $scope.address_mobile
                };
                addresses.create(data).then(function (data) {
                    
                }, function (data) {
                });
            }
        };
    }]);

// Books Controller
mainApp.controller('barcodesAddController', ['$scope', 'Constants', '$timeout', '$http', 'growl',
    function ($scope, Constants, $timeout, $http, growl) {
        $scope.barcodes = [];
        $scope.generateCodes = function () {
            var options = {
                'method': 'GET',
                'url': '/generate_codes/',
                'params': {
                    'codes': $scope.codes
                }
            };
            $http(options).success(function (data) {
                data.forEach(function (val) {
                    $scope.barcodes.push($scope.loadImage("barcode/" + val + ".png"));
                });
            }).error(function (data) {
            });
        };

        $scope.loadImage = function (assetPath) {
            return Constants.get('staticLink') + Constants.get('imageDir') + assetPath;
        };
     }]);

// Books Controller
mainApp.controller('booksAddController', ['$scope', 'Constants', '$timeout', '$http', 'growl', 'books', '$q', 'books_list',
    function ($scope, Constants, $timeout, $http, growl, books, $q, books_list) {
        $scope.is_book = false;
        $scope.book_data = {
            'ISBN_10': '',
            'ISBN_13': '',
            'title': '',
            'author': '',
            'cover_type': '',
            'image': '',
            'publisher': '',
            'description': '',
            'subject': '',
            'book_penalty': '',
            'total_count': ''
        };
        $scope.cover_types = [
            {'name': 'Paperback', 'value': 'Paperback'}, 
            {'name': 'Hardcover', 'value': 'Hardcover'}
        ];
        
        $scope.book_ids = [];

        $scope.tags = [];
        $scope.$watch('book_data.total_count',function(new_val,old_val){
            $scope.book_ids = [];
            for (var i = 0; i < new_val; i++) {
                $scope.book_ids.push({
                    'barcode_id' : '',
                });
            };
        });
        $scope.getBookData = function () {
            var url,
                options = {
                    'method': 'GET',
                    'url': '/get_book_data/',
                    'params': {
                        'isbn': $scope.isbn
                    }
                };
        
            $http(options).success(function (data) {
                console.log(data)
                $scope.is_book = true;
                $scope.book_data.ISBN_10 = data.isbn_10;
                $scope.book_data.ISBN_13 = data.isbn_13;
                $scope.book_data.title = data.title;
                $scope.book_data.author = data.author;
                $scope.book_data.image = data.image;
                $scope.book_data.publisher = data.publisher;
                $scope.book_data.description = data.description;
                $scope.book_data.cover_type = data.binding;
                $scope.book_data.pages = data.pages;
                $scope.more = data.more;
                data.subject.forEach(function (val) {
                    val.split("-").forEach(function (tag) {
                        if ($scope.tags.indexOf(tag) === -1) {
                            $scope.tags.push(tag);
                        }
                    });
                });
            }).error(function (data) {
                $scope.is_book = false;
            });
        };

        $scope.save_book = function () {
            var vaild = 0;
            var deferer = $q.defer();
            var promise = deferer.promise;
            $scope.book_data.subject = "";
            $scope.tags.forEach(function (val) {
                $scope.book_data.subject = $scope.book_data.subject + "-" + val;
            });
            $scope.book_ids.forEach(function (val) {
                if (val.barcode_id.length !== 11 || parseInt(val.barcode_id) === NaN) {
                    vaild = vaild + 1;
                }
            });
            if (vaild === 0) {
                books.create($scope.book_data).then(function (data) {
                    deferer.resolve(data);
                }, function (data) {
                    deferer.reject(data);
                });

                promise.then(function (data) {
                    $scope.book_ids.forEach(function (val) {
                        val.book_id = data.result.book_id;
                        val.available = true;
                        val.status = 'in_stock';
                        val.cover_type = data.result.cover_type;
                        val.item_type = 'book';
                        delete val.$$hashKey;
                        books_list.create(val).then(function (data) {
                            console.log(data);
                        }, function (data) {
                            console.log(data);
                        });
                    });
                }, function (data) {
                    console.log(data);
                });
            }
            
        };
     }]);

// Books List Controller
mainApp.controller('booksListController', ['$scope', 'Constants', '$timeout', '$http', 'growl',
    function ($scope, Constants, $timeout, $http, growl) {

        $scope.getBookDetails = function () {

        };
    }]);

// Books Detail Controller
mainApp.controller('booksDetailController', ['$scope', 'Constants', '$timeout', '$http', 'growl', '$routeParams', 'books',
    function ($scope, Constants, $timeout, $http, growl, $routeParams, books) {
        $scope.book_id = $routeParams.book_id;
        books.read($scope.book_id).then(function (data) {
            $scope.book = data.result[0];

        }, function (data) {

        });
    }]);

// Books Controller
mainApp.controller('booksRentlistController', ['$scope', 'Constants', '$timeout', '$http', 'growl', 'wishlist', '$location',
    function ($scope, Constants, $timeout, $http, growl, wishlist, $location) {
        $scope.to_orders = [];
        $scope.my_wishlists = [];
        $scope.reading = [];
        $scope.history = [];
        
        wishlist.read({
            'params': {
                'user_id': Constants.get('userSiteObj')['lookup'],
                'status': 'order',
            },
        }).then(function (data) {
            $scope.to_orders = data;
        }, function (data) {
            
        });

        wishlist.read({
            'params': {
                'user_id': Constants.get('userSiteObj')['lookup'],
                'status': 'wishlist',
            },
        }).then(function (data) {
            $scope.my_wishlists = data;
        }, function (data) {
            
        });

        $scope.change_tab = function (tab) {
            $scope.orders_tab = tab;
        };

        $scope.add_to_wishlist = function (order, $index) {
            wishlist.update(order.id, {
                'status': 'wishlist',
            }).then(function (data) {
                $scope.my_wishlists.push(data);
                $scope.to_orders.splice($index, 1);
            }, function (data) {
                
            });
        };

        $scope.add_to_orders = function (order, $index) {
            wishlist.update(order.id, {
                'status': 'order',
            }).then(function (data) {
                $scope.to_orders.push(data);
                $scope.my_wishlists.splice($index, 1);
            }, function (data) {
                
            });
        };

        $scope.remove_order = function (order, $index, obj) {
            wishlist.delete(order.id).then(function (data) {
                if (obj === "order") {
                    $scope.to_orders.splice($index, 1);
                }
                if (obj === "wishlist") {
                    $scope.my_wishlists.splice($index, 1);
                }
            }, function (data) {
                
            });
        };

        $scope.quantity_chng = function (obj) {
            if (obj.quantity !== "") {
                wishlist.update(obj.id, {
                    'quantity': obj.quantity,
                });
            }
        };

        $scope.checkout = function () {
            $location.path("/books/checkout/");
        };
    }]);

// Books Checkout Controller
mainApp.controller('booksCheckoutController', ['$scope', 'Constants', '$timeout', '$http', 'growl', 'wishlist', 'addresses', '$modal', 'loadTemplate', '$routeParams', 'transactions',
    function ($scope, Constants, $timeout, $http, growl, wishlist, addresses, $modal, loadTemplate, $routeParams, transactions) {
        $scope.$parent.checkout = true;
        $scope.books = {
            head : false,
            body : true,
        };
        $scope.delivery = {
            head : false,
            body : false,
        };
        $scope.summary = {
            head : false,
            body : false,
        };
        $scope.delivery_addr = {};
        wishlist.read({
            'params': {
                'user_id': Constants.get('userSiteObj')['lookup'],
                'status': 'order',
            },
        }).then(function (data) {
            $scope.to_orders = data;
        }, function (data) {
            
        });
        addresses.read({
            'params': {
                'user': Constants.get('userSiteObj')['lookup'],
            },
        }).then(function (data) {
            $scope.my_addresses = data;
            $scope.my_addresses.forEach(function (obj) {
                obj.is_delivered = false;
            });
        }, function (data) {
            
        });

        $scope.add_address = function(game){
            var modalInstance = $modal.open({
                templateUrl: loadTemplate(Constants.get('staticLink'),Constants.get('templateDir'),'add_address.html'),
                backdrop: true,
                controller: function ($scope, $modalInstance, $http, transformRequestAsFormPost, user_id) {
                    $scope.state = "Telangana";
                    $scope.country = "India";
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                       
                    $scope.add_new_address = function () {
                        var data = {
                            'user': user_id,
                            'addr_name': $scope.name,
                            'address': $scope.address,
                            'landmark': $scope.landmark,
                            'state': $scope.state,
                            'city': $scope.country,
                            'pincode': $scope.pincode,
                            'modile_no': $scope.address_mobile
                        };
                        addresses.create(data).then(function (data) {
                            $modalInstance.close(data);
                        }, function (data) {
                        });
                    }
                },
                size: 'md',
                resolve: {
                    'user_id' : function () {
                        return Constants.get('userSiteObj')['lookup'];
                    },
                }
            });
            modalInstance.result.then(function (data) {
                data.result.is_delivered = false;
                $scope.my_addresses.shift(data.result);
            }, function () {
    
            });
        };   

        $scope.to_addresses = function () {
            var to_books = 3;
            var temp_count = 0;
            $scope.to_orders.forEach(function (obj) {
                temp_count = temp_count + parseInt(obj.quantity);
            });

            if (to_books >= temp_count) {
                $scope.books = {
                    head : true,
                    body : false,
                };
                $scope.delivery.body = true;
            } else {
                alert('fuck you have taken more')
            }
        };  

        $scope.to_be_delivered = function (addr) {
            $scope.my_addresses.forEach(function (obj) {
                if (obj.is_delivered) {
                    obj.is_delivered = false;
                }
            });
            addr.is_delivered = true;
            $scope.delivery_addr = addr;
            $scope.delivery = {
                head : true,
                body : false,
            };
            $scope.summary.body = true;
        }; 

        $scope.place_order = function () {
            var data = {};
            $scope.to_orders.forEach(function (obj) {
                data = {
                    'user_id': Constants.get('userSiteObj')['lookup'],
                    'book_id': obj.book_id,
                    'address_id': $scope.delivery_addr.id,
                    'action': 'ordered',
                    'quantity': obj.quantity,
                };
                transactions.create({data});
            });
        };
    }]);

// Books Delete Controller
mainApp.controller('booksDeleteController', ['$scope', 'Constants', '$timeout', '$http', 'growl',
    function ($scope, Constants, $timeout, $http, growl) {

        $scope.getBookDetails = function () {

        };
    }]);

// Books Controller
mainApp.controller('booksDispatchController', ['$scope', 'Constants', '$timeout', '$http', 'growl',
    function ($scope, Constants, $timeout, $http, growl) {

        $scope.dispatchBook = function () {

        };
    }]);

// Books Controller
mainApp.controller('booksCollectController', ['$scope', 'Constants', '$timeout', '$http', 'growl',
    function ($scope, Constants, $timeout, $http, growl) {

        $scope.collectBook = function () {

        };
    }]);

// Subcription Controller
mainApp.controller('subcriptionController', ['$scope', 'Constants', '$timeout', '$http', 'growl',
    function ($scope, Constants, $timeout, $http, growl) {

        $scope.collectBook = function () {

        };
    }]);