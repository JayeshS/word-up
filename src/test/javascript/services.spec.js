describe('Services', function () {
    var LOCAL_STORAGE_DICT_KEY = 'wordup.dict';
    var http, mockLocalStorageService, rootScope, dictService;

    beforeEach(module('Word-Up'));
    beforeEach(module('LocalStorageModule'));

    beforeEach(inject(function (localStorageService) {
        mockLocalStorageService = localStorageService;
        spyOn(mockLocalStorageService, 'add');
    }));


    beforeEach(inject(function ($rootScope) {
        rootScope = $rootScope.$new();
    }));

    beforeEach(inject(function ($httpBackend, DictionaryService) {
        http = $httpBackend;
        dictService = DictionaryService;
    }));

    describe('DictionaryService initialisation', function () {
        it('should load dictionary from server', function () {
            var initialiseResult;
            http.whenGET('/dict.json').respond(201, "{\"dict\": [\"aa\", \"zzz\"]}");
            spyOn(mockLocalStorageService, 'get').andReturn(false);

            dictService.initialise().then(function(result) {
                initialiseResult = result;
            });
            http.flush();

            waitsFor(function() {
                return initialiseResult;
            }, 300);

            runs(function() {
                expect(mockLocalStorageService.get).toHaveBeenCalledWith(LOCAL_STORAGE_DICT_KEY);
            }, 'checks localStorage was queried');
        });
        it('should not load dict from http service if already loaded', function () {
            spyOn(mockLocalStorageService, 'get').andReturn(true);

        });
    });
});

describe('Services', function () {
    var dictService, http, mockLocalStorageService, mockLocalStorageGet, scope;
    var dict = "aa,sp,zzz,space,spaced";
    var LOCAL_STORAGE_DICT_KEY = 'wordup.dict';
    beforeEach(module('Word-Up'));
    beforeEach(module('LocalStorageModule'));
    beforeEach(inject(function (localStorageService) {
        mockLocalStorageService = localStorageService;
        mockLocalStorageGet = spyOn(mockLocalStorageService, 'get');
        mockLocalStorageGet.andReturn(true);
    }));
    beforeEach(inject(function ($httpBackend, $rootScope) {
        http = $httpBackend;
        scope = $rootScope.$new();
    }));
    beforeEach(inject(function (DictionaryService) {
        dictService = DictionaryService;
    }));

    describe('DictionaryService', function () {
        it('should return true when word is in dictionary', function () {
            mockLocalStorageGet.andReturn(dict);
            var containsWord = dictService.containsWord('aa');
            expect(containsWord).toEqual(true);
        });

        it('should return false when word is not in dictionary', function () {
            mockLocalStorageGet.andReturn(dict);
            var val = dictService.containsWord('not-in-dictionary');
            expect(val).toBe(false);
        });

        it('should return space if asked for subset anagrams of spaced', function () {
            mockLocalStorageGet.andReturn(dict);
            var resolvedCands;

            dictService.findSubsetAnagramsFor('spaced').then(function(result) {
                    resolvedCands = result.answers;
            });
            scope.$apply();

            waitsFor(function() {
                return resolvedCands;
            }, 300);

            runs(function() {
                expect(resolvedCands).toEqual(['space', 'spaced']);
                expect(mockLocalStorageService.get).toHaveBeenCalledWith(LOCAL_STORAGE_DICT_KEY);
            }, 'calling dictionary serice for subsetanagrams for spaced');

        });
    });
});
