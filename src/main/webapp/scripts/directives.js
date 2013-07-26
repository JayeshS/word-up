app.directive('wordupInput', ['$rootScope', function ($rootScope) {
    return {
        link: function (scope, element, attrs) {
            $rootScope.$on('animateSuccess', function () {
                $(element).effect('highlight');
            });
            $rootScope.$on('animateFailure', function () {
                $(element).effect({effect: 'shake', duration: 250});
            });

            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.checkWord();
                        scope.inputWord = null;
                    })
                }

            });
            element[0].focus();
        }
    };
}]);
