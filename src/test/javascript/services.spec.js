describe('DictionaryService initialisation', function () {
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
        http.expectGET('dict.json').respond({"dict": ["aaa", "zzz"]});

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
        spyOn(mockLocalStorageService, 'get').andReturn("aaa,zzz");

        var promiseFulfilled = false;

        rootScope.$apply(function () {
            dictService.initialise().then(function () {
                promiseFulfilled = true;
            });
        });

        waitsFor(function () {
            return promiseFulfilled;
        }, 300);

        runs(function () {
            expect(dictService.dictionary).toEqual(["aaa", "zzz"]);
        }, 'checks dictionary was set');

    });
});

describe('Dictionary Service Definitions', function () {
    var http, dictService;
    beforeEach(module('Word-Up'));
    beforeEach(inject(function ($httpBackend, DictionaryService) {
        http = $httpBackend;
        dictService = DictionaryService;
    }));

    it('should make http request to retrieve a definition', function () {
        var httpResult;
        http.expectGET('/wordup-service/define/java.json').respond({
            "word": "java",
            "definitions": [
                {
                    "pos": "Noun",
                    "explanation": "a blend of coffee imported from the island of Java."
                },
                {
                    "pos": "Noun",
                    "explanation": "[alternative spelling of|Java]"
                },
                {
                    "pos": "Noun",
                    "explanation": "[US|colloquial] Coffee in general."
                }
            ],
            "error": null
        });
        dictService.define('java')
            .then(function (result) {
                httpResult = result;
            });
        http.flush();

        waitsFor(function () {
            return httpResult;
        }, 200);

        runs(function () {
            expect(httpResult.definitions[0].explanation).toEqual('a blend of coffee imported from the island of Java.');
            expect(httpResult.definitions[1].explanation).toEqual('[alternative spelling of|Java]');
            expect(httpResult.definitions[2].explanation).toEqual('[US|colloquial] Coffee in general.');
            expect(httpResult.error).toBeNull();
        })

    });

    it('should handle errors', function () {
        var httpResult;
        http.expectGET('/wordup-service/define/java.json').respond(500, 'Error handling the request');

        dictService.define('java')
            .then(function (result) {
                httpResult = result;
            });
        http.flush();

        waitsFor(function () {
            return httpResult;
        }, 200);

        runs(function() {
            expect(httpResult.error).toBe('Could not load definition.');
        })
    })

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
