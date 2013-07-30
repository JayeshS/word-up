describe('Superset anagram searcher', function() {
    it('should find that hello contains hell', function() {
        expect("Hello".isSupersetAnagram('hell')).toEqual(true);
    });
    it('should find that hello does not contain help', function() {
        expect("Hello".isSupersetAnagram('help')).toEqual(false);
    });
    it('should find that procrastinate contains ate', function() {
        expect("PROCRASTINATE".isSupersetAnagram('ate')).toEqual(true);
    });
});