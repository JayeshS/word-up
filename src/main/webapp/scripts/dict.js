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
        var correctGuesses = [], wrongGuesses = [], unsolvedWords = [], internalScore = 0;

        function containsGuess(word, guesses) {
            return guesses.indexOf(word.toUpperCase()) >= 0;
        }

        function pushGuess(word, guesses) {
            if (!containsGuess(word, guesses)) {
                guesses.push(word.toUpperCase());
            }
        }

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
            score: function() {
                return internalScore;
            },
            solve: function () {
                var solution = DictionaryService.findSubsetAnagramsFor(baseWord);
                for (var i = 0; i < solution.length; i++) {
                    if (correctGuesses.indexOf(solution[i]) < 0) {
                        unsolvedWords.push(solution[i]);
                    }
                }
                return unsolvedWords;
            },
            reset: function() {
                correctGuesses = [];
                wrongGuesses = [];
                unsolvedWords = [];
                internalScore = 0;
                $scope.$emit('reset');
            }
        };
    }

    $scope.start = function () {
        DictionaryService.initialise().then(function () {
            console.info("Initialised application.  Creating attempt.");
            $scope.reset();
        });
    };

    $scope.reset = function() {
        $scope.baseWord = DictionaryService.getRandomWord().shuffle();
        $scope.inputWord = '';
        if ($scope.attempt) {
            $scope.attempt.reset();
        } else {
            $scope.attempt = createNewAttempt($scope.baseWord);
        }
    };

    $scope.start();
}]);