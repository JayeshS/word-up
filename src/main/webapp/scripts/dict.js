app.controller('DictCtrl', ['$scope', 'DictionaryService', function ($scope, DictionaryService) {
    $scope.containsWord = function () {
        var inputArr = $scope.inputWord.toUpperCase().arrayise();
        var baseWordArray = $scope.baseArr.slice(0);

        for (var i = 0; i < inputArr.length; i++) {
            if (baseWordArray.indexOf(inputArr[i]) < 0) {
                $scope.isGuessCorrect = false;
                return;
            } else {
                baseWordArray[baseWordArray.indexOf(inputArr[i])] = '';
            }
        }
        $scope.isGuessCorrect = DictionaryService.containsWord($scope.inputWord.toUpperCase());
        $scope.$emit('animate' + ($scope.isGuessCorrect ? 'Success' : 'Failure'));
    };

    $scope.getDict = function () {
        DictionaryService.loadDict();
    };

    String.prototype.arrayise = function() {
        var arr = [];
        for (var i = 0; i < this.length; i++) {
            arr.push(this.charAt(i));
        }
        return arr;
    };

    String.prototype.shuffle = function() {
        var arr = this.arrayise();
        for (var i = arr.length - 1; i > 0; i--) {
            var randIndex = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[randIndex];
            arr[randIndex] = temp;
        }
        return arr.join('');
    };

    $scope.baseWord = DictionaryService.getRandomWord().shuffle();
    $scope.baseArr = $scope.baseWord.arrayise();

}]);