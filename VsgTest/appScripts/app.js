var processOrderData = function (order) {
    order.Status = order.Status + '';
    order.Date = new Date(order.Date);
    return order;
};

angular
	.module('ordersApp', [])
    .factory('orders', function ($window, $http) {
        return {
            getAll: function (success) {
                $http.get('/api/order')
                    .success(function (data) {
                        var i;
                        for (i = data.length; i--;) {
                            processOrderData(data[i]);
                        }
                        success(data);
                    })
                    .error(function (message, status) {
                        debugger;
                    });
            },

            add: function (order, success) {
                $http.post('/api/order', order)
                    .success(function (data) {
                        success(data);
                    })
                    .error(function (message, status) {
                        debugger;
                    });
            },

            remove: function (id, success) {
                $http.delete('/api/order/' + id)
                    .success(function (data) {
                        success(data);
                    })
                    .error(function (message, status) {
                        debugger;
                    });
            },

            update: function (id, data, success) {
                $http.put('/api/order/' + id, data)
                    .success(function () {
                        success();
                    })
                    .error(function (message, status) {
                        debugger;
                    });
            }
        };
    })
	.controller('OrdersCtrl', function ($scope, orders) {

	    $scope.loading = true;

	    $scope.newOrder = {};

	    $scope.statusFilter = '0';

	    $scope.getStatus = function (value) {
	        switch (value) {
	            case '1':
	                return 'Open';
	            case '2':
	                return 'Pending';
	            case '3':
	                return 'Close';
	        }
	    };

	    orders.getAll(function (data) {
	        $scope.loading = false;
	        $scope.orders = data;
	    });

	    $scope.addOrder = function () {
	        $scope.loading = true;
	        orders.add($scope.newOrder, function (data) {
	            $scope.newOrder = {};
	            $scope.orders.push(processOrderData(data));
	            $scope.loading = false;
	        });
	    };

	    $scope.isAddButtonDisabled = function () {
	        return !$scope.newOrder.Name || !$scope.newOrder.Date || !$scope.newOrder.Status;
	    };

	    $scope.removeOrder = function (id) {
	        $scope.loading = true;
	        orders.remove(id, function (data) {
	            var index;
	            for (index = $scope.orders.length; index--;) {
	                if ($scope.orders[index].Id === id) {
	                    break;
	                }
	            }
	            $scope.orders.splice(index, 1);
	            $scope.loading = false;
	        });
	    };

	    $scope.toggleEdit = function (order) {
	        var date;
	        if ($scope.editOrder && $scope.editOrder.Id === order.Id) {
	            $scope.editOrder = false;
	        } else {
	            $scope.editOrder = $.extend({}, order);
	            date = new Date($scope.editOrder.Date);
	            if (date) {
	                $scope.editOrder.Date = ('0' + date.getMonth() + 1).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();
	            }
	        }
	    };

        $scope.isEditOrder = function (id) {
            return $scope.editOrder && $scope.editOrder.Id === id;
        };

        $scope.updateOrder = function (id) {
            $scope.loading = true;
            $scope.editOrder.Date = new Date($scope.editOrder.Date);
            console.log($scope.editOrder);
            orders.update($scope.editOrder.Id, $scope.editOrder, function () {
                var i;
                for (i = $scope.orders.length; i--;) {
                    if ($scope.orders[i].Id === id) {
                        $scope.orders[i] = processOrderData($scope.editOrder);
                        $scope.toggleEdit($scope.orders[i]);
                        break;
                    }
                }
                $scope.loading = false;
            });
        };

        $scope.isSaveButtonDisabled = function () {
            return !$scope.editOrder || !$scope.editOrder.Name || !$scope.editOrder.Date || !$scope.editOrder.Status;
        };

        $scope.getOrderLength = function (value) {
            var i = 0;
            if (!value) {
                if ($scope.orders) {
                    return $scope.orders.length;
                }
                return 0;
            }
            angular.forEach($scope.orders, function (order) {
                (order.Status === value) && i++;
            });
            return i;
        };

        $scope.isShowOrder = function (order) {
            return ($scope.statusFilter === '0' || order.Status === $scope.statusFilter);
        };
	});