describe('Controllers', function () {
    var ctrlScope, ctrl, dictService;
    beforeEach(module('Word-Up'));
    beforeEach(function () {
        dictService = {
            containsWord: function (letters) {
                return ['HELP', 'HELL', 'HELLO'].indexOf(letters) >= 0;
            },
            getRandomWord: function() { return 'HELLO'; }
        };
    });
    beforeEach(inject(function ($rootScope, $controller) {
        ctrlScope = $rootScope.$new();
        spyOn(ctrlScope, '$emit');
        ctrl = $controller('DictCtrl', {
            $scope: ctrlScope,
            DictionaryService: dictService
        });
    }));
    describe('DictCtrl', function () {
        it('should report hell is a correct guess for baseword Hello', function () {
            ctrlScope.inputWord = 'hell';
            ctrlScope.checkWord();
            expect(ctrlScope.$emit).toHaveBeenCalledWith('correctGuess', jasmine.any(Object));
            expect(ctrlScope.attempt.containsCorrectGuess('HELL')).toEqual(true);
        });
        it('should correctly keep score for 4-letter guess', function () {
            ctrlScope.inputWord = 'hell';
            ctrlScope.checkWord();
            expect(ctrlScope.attempt.score()).toEqual(8);
        });

        it('should generate an event with 8 points for a 4-letter word', function () {
            ctrlScope.inputWord = 'hell';
            ctrlScope.checkWord();
            expect(ctrlScope.$emit).toHaveBeenCalledWith('correctGuess', {score: 8, points: 8});
        });

        it('should report help is a wrong guess for baseword Hello', function () {
            ctrlScope.inputWord = 'HELP';
            ctrlScope.checkWord();
            expect(ctrlScope.$emit).toHaveBeenCalledWith('wrongGuess');
            expect(ctrlScope.attempt.containsWrongGuess('HELP')).toEqual(true);
        });
        it('should not count too-short words as guesses', function () {
            ctrlScope.inputWord = 'HI';
            ctrlScope.checkWord();
            expect(ctrlScope.attempt.containsCorrectGuess('HI')).toEqual(false);
            expect(ctrlScope.attempt.containsWrongGuess('HI')).toEqual(false);
        });
        it('should not count duplicate guesses', function () {
            ctrlScope.inputWord = 'hell';
            ctrlScope.checkWord();
            expect(ctrlScope.attempt.containsCorrectGuess('HELL')).toEqual(true);
            ctrlScope.checkWord();
            expect(ctrlScope.attempt.containsCorrectGuess('HELL')).toEqual(true);
        });
    });
});