describe('Controllers', function () {
    var ctrlScope, ctrl, dictService;
    beforeEach(module('Word-Up'));
    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        dictService = {
            containsWord: function (letters) {
                return ['HELP', 'HELL', 'HELLO'].indexOf(letters) >= 0;
            },
            getRandomWord: function() { return 'HELLO'; }
        };
    });
    beforeEach(inject(function ($rootScope, $controller) {
        ctrlScope = $rootScope.$new();
        ctrl = $controller('DictCtrl', {
            $scope: ctrlScope,
            DictionaryService: dictService
        });
    }));
    describe('DictCtrl', function () {
        it('should contain the word hell when baseword is Hello', function () {
            ctrlScope.inputWord = 'hell';
            ctrlScope.containsWord();
            expect(ctrlScope.isGuessCorrect).toEqual(true);
        });
        it('should not contain the word HELP when the base word is HELLO', function () {
            ctrlScope.inputWord = 'HELP';
            ctrlScope.containsWord();
            expect(ctrlScope.isGuessCorrect).toEqual(false);
        });
    });
});