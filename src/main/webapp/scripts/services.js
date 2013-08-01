app.service('DictionaryService', function ($http, $rootScope, localStorageService, $q) {
    var LOCAL_STORAGE_DICT_KEY = 'wordup.dict';
    this.dictionary = [];
    var storage = localStorageService;

    this.getRandomWord = function () {
        var word = '';
        while (word.length < 6) {
            var index = Math.floor(Math.random() * this.dictionary.length);
            word = this.dictionary[index];
        }
        return word;
    };

    this.containsWord = function (letters) {
        return this.dictionary.indexOf(letters) > -1;
    };

    this.findSubsetAnagramsFor = function (baseWord) {
        var deferred = $q.defer();
        var startTime = new Date();

        function findAllSubsetAnagrams(input) {
            var word = input.word;
            var dict = input.dict;

            var wordsForCurrCand = [];
            for (var i = 0, n = dict.length; i < n; i++) {
                var currWord = dict[i];
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

        findAllSubsetAnagrams({ "word": baseWord, "dict": this.dictionary });

        return deferred.promise;
    };

    this.initialise = function () {
        var that = this;
        var deferred = $q.defer();
        if (!(storage.get(LOCAL_STORAGE_DICT_KEY))) {
            $http.get('/dict.json').success(function (data) {
                console.log("Got dict.json, size: " + data.dict.length);
                storage.add(LOCAL_STORAGE_DICT_KEY, data.dict);
                that.dictionary = data.dict;
                deferred.resolve({});
            }).error(function (data) {
                    $rootScope.error = data;
                }
            );
        } else {
            console.info("loading dictionary from storage...");
            this.dictionary = storage.get(LOCAL_STORAGE_DICT_KEY).split(',');
            deferred.resolve({});
        }
        return deferred.promise;
    };

});
