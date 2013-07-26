app.service('DictionaryService', function ($http, $rootScope, localStorageService) {
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

    this.getRandomWord = function() {
        initDictionary();
        var word = '';
        while(word.length < 6) {
            var index = Math.floor(Math.random() * dict.length);
            word = dict[index];
        }
        return word;
    };

    if (!this.isLocalStorageLoaded()) {
        this.loadDict();
    }
});
