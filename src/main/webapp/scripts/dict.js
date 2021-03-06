app.controller('DictCtrl', ['$scope', 'DictionaryService', function ($scope, DictionaryService) {
    $scope.checkWord = function () {
        if (!$scope.inputWord || !$scope.baseWord ||
            tooShort($scope.inputWord) ||
            alreadyGuessed($scope.inputWord)) return;

        var inputWord = $scope.inputWord.toUpperCase();
        var wordIsValid = $scope.baseWord.isSupersetAnagram(inputWord) &&
            DictionaryService.containsWord(inputWord);

        if (wordIsValid) {
            $scope.attempt.pushCorrectGuess(inputWord);
        } else {
            $scope.attempt.pushWrongGuess(inputWord);
        }

        function tooShort(inputWord) {
            return inputWord.length < 3;
        }

        function alreadyGuessed(inputWord) {
            return $scope.attempt.containsCorrectGuess(inputWord);
        }
    };

    function createNewAttempt(baseWord) {
        var correctGuesses = [], wrongGuesses = [], solution = [], unsolvedWords = [], internalScore = 0;

        function containsGuess(word, guesses) {
            return guesses.indexOf(word.toUpperCase()) >= 0;
        }

        function pushGuess(word, guesses) {
            if (!containsGuess(word, guesses)) {
                guesses.push(word.toUpperCase());
            }
        }

        function findSolution() {
            DictionaryService.findSubsetAnagramsFor(baseWord).then(function (data) {
                console.info('result from svc: ' + data.answers.length);
                solution = data.answers;
            });
        }

        findSolution();

        return {
            pushCorrectGuess: function (word) {
                pushGuess(word, correctGuesses);
                var points = Math.floor(Math.pow(word.length, 1.5));
                internalScore += points;
                $scope.$emit('correctGuess', {points: points, score: internalScore});
            },
            pushWrongGuess: function (word) {
                pushGuess(word, wrongGuesses);
                $scope.$emit('wrongGuess');
            },
            containsCorrectGuess: function (word) {
                return containsGuess(word, correctGuesses);
            },
            containsWrongGuess: function (word) {
                return containsGuess(word, wrongGuesses);
            },
            score: function () {
                return internalScore;
            },
            unsolvedWords: function () {
                return unsolvedWords
            },
            solve: function () {
                if (unsolvedWords.length === 0) {
                    for (var i = 0; i < solution.length; i++) {
                        if (correctGuesses.indexOf(solution[i]) < 0) {
                            unsolvedWords.push(solution[i]);
                        }
                    }
                }
                $scope.$emit('showSolution', {solution: solution, unsolvedWords: unsolvedWords});
            }
        };
    }

    $scope.start = function () {
        DictionaryService.initialise().then(function () {
            console.info("Initialised application.  Creating attempt.");
            $scope.reset();
        });
    };

    $scope.reset = function () {
        $scope.baseWord = DictionaryService.getRandomWord().shuffle();
        $scope.inputWord = '';
        $scope.attempt = createNewAttempt($scope.baseWord);
        $scope.$emit('reset');
    };

    $scope.shuffle = function() {
        $scope.baseWord = $scope.baseWord.shuffle();
        $scope.$emit('shuffle');
    };

    $scope.start();
}]);