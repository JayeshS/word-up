app.controller('DictCtrl', ['$scope', 'DictionaryService', function ($scope, DictionaryService) {
    $scope.checkWord = function () {
        var isValid = $scope.baseWord.isSupersetAnagram($scope.inputWord) &&
            DictionaryService.containsWord($scope.inputWord.toUpperCase());

        $scope.$emit('animate' + (isValid ? 'Success' : 'Failure'));
    };
    $scope.baseWord = DictionaryService.getRandomWord().shuffle();
    $scope.baseArr = $scope.baseWord.arrayise();
}]);