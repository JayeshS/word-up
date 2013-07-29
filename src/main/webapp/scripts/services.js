app.service('DictionaryService', function ($http, $rootScope, localStorageService, $q) {
    var LOCAL_STORAGE_DICT_KEY = 'wordup.dict';
    var dict = [];
    var storage = localStorageService;

    function initDictionary() {
        if (dict.length === 0)
            dict = storage.get(LOCAL_STORAGE_DICT_KEY).split(',');
    }

    this.containsWord = function (letters) {
        initDictionary();
        console.info("Checking storage for: " + letters);
        return storage.get(LOCAL_STORAGE_DICT_KEY).indexOf(letters) > -1;
    };

    this.isLocalStorageLoaded = function () {
        return storage.get(LOCAL_STORAGE_DICT_KEY) ? true : false;
    };

    this.loadDict = function () {
        var that = this;
        $http.get('/dict.json').success(function (data, status, headers, config) {
            var dict = data.dict;
            console.log("Got dict.json, size: " + dict.length);
            storage.add(LOCAL_STORAGE_DICT_KEY, dict);
        }).error(function (data, status, headers, config) {
                $rootScope.error = data;
            }
        );
    };

    this.getRandomWord = function () {
        initDictionary();
        var word = '';
        while (word.length < 6) {
            var index = Math.floor(Math.random() * dict.length);
            word = dict[index];
        }
        return word;
    };

    this.findSubsetAnagramsFor = function (baseWord) {
        initDictionary();
        var deferred = $q.defer();
        var startTime = new Date();

        function findAllSubsetAnagrams(event) {
            var word = event.word;
            var dictionary = event.dict;

            var wordsForCurrCand = [];
            for (var i = 0, n = dictionary.length; i < n; i++) {
                var currWord = dictionary[i];
                if ((currWord.length > 2) && word.isSupersetAnagram(currWord)) {
                    wordsForCurrCand.push(currWord);
                }
            }
            $rootScope.$apply(function () {
                deferred.resolve({
                    answers: wordsForCurrCand,
                    timeTaken: (new Date() - startTime) / 1000
                });
            });
        }

        findAllSubsetAnagrams({ "word": baseWord, "dict": dict });

        return deferred.promise;
    };

    if (!this.isLocalStorageLoaded()) {
        this.loadDict();
    }
});
