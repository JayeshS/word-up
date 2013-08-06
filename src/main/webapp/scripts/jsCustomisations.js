String.prototype.arrayise = function() {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        arr.push(this.charAt(i));
    }
    return arr;
};

String.prototype.shuffle = function() {
    var arr = this.arrayise();
    for (var i = arr.length - 1; i > 0; i--) {
        var randIndex = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[randIndex];
        arr[randIndex] = temp;
    }
    return arr.join('');
};

String.prototype.isSupersetAnagram = function(sub) {
    var subArr = sub.toUpperCase().arrayise();
    var thisArray = this.toUpperCase().arrayise();

    for (var i = 0; i < subArr.length; i++) {
        if (thisArray.indexOf(subArr[i]) < 0) {
            return false;
        } else {
            thisArray[thisArray.indexOf(subArr[i])] = '';
        }
    }
    return true;
};

Array.prototype.each = function(clos) {
    for (var i = 0; i < this.length; i++) {
        clos(this[i]);
    }
};