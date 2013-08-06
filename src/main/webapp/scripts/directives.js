app.directive('wordupInput', ['$rootScope', function () {
    return {
        link: function (scope, element) {
            scope.$on('correctGuess', function () {
                $(element).effect('highlight');
            });
            scope.$on('wrongGuess', function () {
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
            var focus = function() {
                element[0].focus();
            };

            ['correctGuess', 'wrongGuess', 'shuffle', 'reset'].each(function(event) {
                scope.$on(event, focus);
            });
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
                element.text(0).hide().fadeIn();
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

app.directive('wordupBaseword', function () {
    return {
        link: function (scope, element) {
            scope.$on('reset', function () {
                element.toggle("slide").toggle("slide");
            });
            scope.$on('shuffle', function() {
                $(element).effect({effect: 'shake', duration: 300});
            });
        }
    }
});