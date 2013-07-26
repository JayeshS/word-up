app.directive('wordupInput', ['$rootScope', function ($rootScope) {
    return {
        link: function (scope, element, attrs) {
            $rootScope.$on('animateSuccess', function () {
                console.info('animating...');
                $(element).effect('highlight');
            });
            $rootScope.$on('animateFailure', function () {
                $(element).effect({effect: 'shake', duration: 500});
            });
        }
    };
}]);