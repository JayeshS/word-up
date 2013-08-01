describe('DictionaryService initialisation', function () {
    var LOCAL_STORAGE_DICT_KEY = 'wordup.dict';
    var http, mockLocalStorageService, rootScope, dictService;

    beforeEach(module('Word-Up'));
    beforeEach(module('LocalStorageModule'));

    beforeEach(inject(function ($rootScope, localStorageService, $httpBackend, DictionaryService) {
        mockLocalStorageService = localStorageService;
        spyOn(mockLocalStorageService, 'add');
        rootScope = $rootScope.$new();
        http = $httpBackend;
        dictService = DictionaryService;
    }));

    it('should load dictionary from server', function () {
        spyOn(mockLocalStorageService, 'get').andReturn(false);

        var initialiseResult;
        http.whenGET('/dict.json').respond(201, JSON.stringify({"dict": ["aaa", "zzz"]}));

        dictService.initialise().then(function (result) {
            initialiseResult = result;
        });
        http.flush();

        waitsFor(function () {
            return initialiseResult;
        }, 300);

        runs(function () {
            expect(dictService.dictionary).toEqual(["aaa", "zzz"]);
        }, 'checks dictionary was set');
    });

    it('should not load dict from http service if already loaded', function () {
        spyOn(mockLocalStorageService, 'get').andReturn(true);

    });
});

describe('DictionaryService', function () {
    var dictService, scope;
    beforeEach(module('Word-Up'));
    beforeEach(module('LocalStorageModule'));

    beforeEach(inject(function (DictionaryService, $rootScope) {
        scope = $rootScope.$new();
        dictService = DictionaryService;
    }));

    it('should return true when word is in dictionary', function () {
        dictService.dictionary = ["AA", "SP"];
        var containsWord = dictService.containsWord('AA');
        expect(containsWord).toEqual(true);
    });

    it('should return false when word is not in dictionary', function () {
        dictService.dictionary = ["AA", "SP"];
        var val = dictService.containsWord('not-in-dictionary');
        expect(val).toBe(false);
    });

    it('should return space if asked for subset anagrams of spaced', function () {
        dictService.dictionary = ["SP", "ZZZ", "SPACE", "SPACED"];
        var resolvedCands;

        dictService.findSubsetAnagramsFor('spaced').then(function (result) {
            resolvedCands = result.answers;
        });
        scope.$apply();

        waitsFor(function () {
            return resolvedCands;
        }, 300);

        runs(function () {
            expect(resolvedCands).toEqual(['SPACE', 'SPACED']);
        }, 'calling dictionary serice for subsetanagrams for spaced');

    });
});
