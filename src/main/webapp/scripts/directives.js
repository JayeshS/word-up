app.directive('wordupInput', ['$rootScope', function ($rootScope) {
    return {
        link: function (scope, element) {
            $rootScope.$on('correctGuess', function () {
                $(element).effect('highlight');
            });
            $rootScope.$on('wrongGuess', function () {
                $(element).effect({effect: 'shake', duration: 250});
            });

            element.bind("keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.checkWord();
                        scope.inputWord = null;
                    })
                }

            });
            element[0].focus();
        }
    };
}]);

app.directive('wordupScoreboard', ['$rootScope', function ($rootScope) {
    return {
        link: function (scope, element) {
            $rootScope.$on('correctGuess', function (event, scoreBoard) {
                function callback() {
                    setTimeout(function () {
                        element.text(scoreBoard.score);
                        element.removeAttr("style").hide().removeClass('incrementScore').fadeIn();
                    }, 400);
                };
                element.text('+' + scoreBoard.points)
                    .removeAttr("style")
                    .hide()
                    .addClass('incrementScore')
                    .fadeIn(650, callback);
            });
        }
    };
}]);
