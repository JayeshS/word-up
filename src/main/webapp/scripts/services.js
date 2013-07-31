app.service('DictionaryService', function ($http, $rootScope, localStorageService, $q) {
    var LOCAL_STORAGE_DICT_KEY = 'wordup.dict';
    var dictionary = [];
    var storage = localStorageService;

    this.getRandomWord = function () {
        var word = '';
        while (word.length < 6) {
            var index = Math.floor(Math.random() * dictionary.length);
            word = dictionary[index];
        }
        return word;
    };

    function initDictionary() {
        if (dictionary.length === 0)
            dictionary = storage.get(LOCAL_STORAGE_DICT_KEY).split(',');
    }

    this.containsWord = function (letters) {
        initDictionary();
        console.info("Checking storage for: " + letters);
        return storage.get(LOCAL_STORAGE_DICT_KEY).indexOf(letters) > -1;
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

        findAllSubsetAnagrams({ "word": baseWord, "dict": dictionary });

        return deferred.promise;
    };

    this.initialise = function () {
        var deferred = $q.defer();
        if (!(storage.get(LOCAL_STORAGE_DICT_KEY))) {
            $http.get('/dict.json').success(function (data, status, headers, config) {
                console.log("Got dict.json, size: " + data.dict.length);
                storage.add(LOCAL_STORAGE_DICT_KEY, data.dict);
                dictionary = data.dict;
                deferred.resolve({});
            }).error(function (data, status, headers, config) {
                    $rootScope.error = data;
                }
            );
        } else {
            console.info("loading dictionary from storage...");
            dictionary = storage.get(LOCAL_STORAGE_DICT_KEY).split(',');
            deferred.resolve({});
        }
        return deferred.promise;
    };

});
