describe('Services', function () {
    var LOCAL_STORAGE_DICT_KEY = 'wordup.dict';
    var http, mockLocalStorageService, rootScope;

    beforeEach(module('Word-Up'));
    beforeEach(module('LocalStorageModule'));

    beforeEach(inject(function (localStorageService) {
        mockLocalStorageService = localStorageService;
        spyOn(mockLocalStorageService, 'add');
    }));


    beforeEach(inject(function ($rootScope) {
        rootScope = $rootScope;
    }));

    beforeEach(inject(function ($httpBackend) {
        http = $httpBackend;
    }));

    describe('DictionaryService initialisation', function () {
        it('should load dict from http service if not already loaded', function () {
            spyOn(mockLocalStorageService, 'get').andReturn(false);
            http.whenGET('/dict.json').respond(201, "{\"dict\": [\"aa\", \"zzz\"]}");
            inject(function (DictionaryService) {
                http.flush();
                expect(mockLocalStorageService.add).toHaveBeenCalledWith(LOCAL_STORAGE_DICT_KEY, ["aa", "zzz"]);
            });
        });
        it('should not load dict from http service if already loaded', function () {
            spyOn(mockLocalStorageService, 'get').andReturn(true);
            inject(function (DictionaryService) {
            });
        });
        it('should report error from http service in rootScope', function () {
            spyOn(mockLocalStorageService, 'get').andReturn(false);
            http.whenGET('/dict.json').respond(404, "Not Found");
            inject(function (DictionaryService) {
            });
            http.flush();
            expect(rootScope.error).toEqual('Not Found');
        });
    });
});

describe('Services', function () {
    var dictService, http, mockLocalStorageService, mockLocalStorageGet, scope, q;
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

        it('should assume localStorage is loaded if the key wordup.dict.AAH exists', function () {
            mockLocalStorageGet.andReturn(null);
            var isLoaded = dictService.isLocalStorageLoaded();
            expect(isLoaded).toBe(false);
            expect(mockLocalStorageService.get).toHaveBeenCalledWith(LOCAL_STORAGE_DICT_KEY);
        });
    });
});
