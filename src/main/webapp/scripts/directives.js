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

app.directive('wordupScoreboard', function () {
    return {
        link: function (scope, element) {
            scope.$on('correctGuess', function (event, scoreBoard) {
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
            scope.$on('reset', function () {
                element.text(0);
            })
        }
    };
});

app.directive('wordupSolution', function () {
    return {
        link: function (scope, element) {
            element.hide();
            scope.$on('showSolution', function (event, data) {
                console.info('showing soln, unsolved words: ' + data.unsolvedWords.length);
                element.text(data.unsolvedWords.join(', ').toLowerCase()).dialog({
                    height: $(window).height() - 180,
                    width: $(window).width() - 180
                });
            });
        }
    }
});