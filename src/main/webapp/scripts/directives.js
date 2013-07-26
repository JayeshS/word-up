app.directive('wordupInput', ['$rootScope', function ($rootScope) {
    return {
        link: function (scope, element, attrs) {
            $rootScope.$on('animateSuccess', function () {
                $(element).effect('highlight');
            });
            $rootScope.$on('animateFailure', function () {
                $(element).effect({effect: 'shake', duration: 250});
            });

            $(element).keydown(function (event) {
                if (event.which == 13) {
                    event.preventDefault();
                    scope.containsWord();
                    event.target.value = '';
                }
            });
            element[0].focus();
        }
    };
}]);
