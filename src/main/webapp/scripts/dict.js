app.controller('DictCtrl', ['$scope', 'DictionaryService', function ($scope, DictionaryService) {
    $scope.containsWord = function () {
        var isValid = $scope.baseWord.isSupersetAnagram($scope.inputWord) &&
            DictionaryService.containsWord($scope.inputWord.toUpperCase());

        $scope.$emit('animate' + (isValid ? 'Success' : 'Failure'));
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

    String.prototype.isSupersetAnagram = function(sub) {
        var subArr = sub.toUpperCase().arrayise();
        var thisArray = this.toUpperCase().arrayise();

        for (var i = 0; i < subArr.length; i++) {
            if (thisArray.indexOf(subArr[i]) < 0) {
                return false;
            } else {
                thisArray[thisArray.indexOf(subArr[i])] = '';
            }
        }
        return true;
    };


    $scope.baseWord = DictionaryService.getRandomWord().shuffle();
    $scope.baseArr = $scope.baseWord.arrayise();

}]);