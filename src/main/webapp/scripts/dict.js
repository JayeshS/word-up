app.controller('DictCtrl', ['$scope', 'DictionaryService', function ($scope, DictionaryService) {
    $scope.checkWord = function () {
        var inputWord = $scope.inputWord.toUpperCase();
        var wordIsValid = $scope.baseWord.isSupersetAnagram(inputWord) &&
            DictionaryService.containsWord(inputWord);

        if (wordIsValid) {
            $scope.correctGuesses.push(inputWord);
            $scope.$emit('animateSuccess');
        } else {
            $scope.wrongGuesses.push(inputWord);
            $scope.$emit('animateFailure');
        }
    };

    $scope.startOver = function() {
        $scope.baseWord = DictionaryService.getRandomWord().shuffle();
        $scope.baseArr = $scope.baseWord.arrayise();
        $scope.inputWord = '';
        $scope.correctGuesses = [];
        $scope.wrongGuesses = [];

    };

    $scope.startOver();
}]);