app.controller('DictCtrl', ['$scope', 'DictionaryService', function ($scope, DictionaryService) {
    $scope.checkWord = function () {
        function tooShort(inputWord) {
            return inputWord.length < 3;
        }

        function alreadyGuessed(inputWord) {
            return $scope.attempt.containsCorrectGuess(inputWord);
        }

        if (!$scope.inputWord ||
            !$scope.baseWord ||
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
    };

    function createNewAttempt() {
        var correctGuesses = [], wrongGuesses = [], score = 0;
        function containsGuess(word, guesses) {
            return guesses.indexOf(word.toUpperCase()) >= 0;
        }
        function pushGuess(word, guesses) {
            if (!containsGuess(word, guesses)) {
                guesses.push(word.toUpperCase());
            }
        }
        return {
            pushCorrectGuess: function(word) {
                pushGuess(word, correctGuesses);
                $scope.$emit('animateSuccess');
                score += Math.floor(Math.pow(word.length, 1.5));
            },
            pushWrongGuess: function(word) {
                pushGuess(word, wrongGuesses);
                $scope.$emit('animateFailure');
            },
            containsCorrectGuess: function(word) {
                return containsGuess(word, correctGuesses);
            },
            containsWrongGuess: function(word) {
                return containsGuess(word, wrongGuesses);
            },
            score: function() {
                return score;
            }
        };
    }

    $scope.startOver = function() {
        $scope.baseWord = DictionaryService.getRandomWord().shuffle();
        $scope.baseArr = $scope.baseWord.arrayise();
        $scope.inputWord = '';
        $scope.attempt = createNewAttempt()

    };

    $scope.startOver();
}]);