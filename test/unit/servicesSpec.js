'use strict';

describe('declutter services', function() {
  var thingsCollection;

  beforeEach(module('declutter'));

  beforeEach(inject(function($injector) {
    thingsCollection = $injector.get('thingsCollection');
    // Only works because the $localStorage service behaves like a standard JS object,
    // with the actual window.localStorage.setItem() etc. driven by Angular watchers.
    thingsCollection.items = [
      {'id': 1, 'somekey': 'someval1'},
      {'id': 2, 'somekey': 'someval2'}
    ];
  }));

  describe('thingsCollection', function() {

    describe('findByKey', function() {
      it('should return an object on a matching key/value pair', inject(function(thingsCollection) {
        expect(thingsCollection.findByKey('id', 1)).toEqual({'id': 1, 'somekey': 'someval1'});
      }));
      it('should return undefined when not matching a key/value pair', inject(function(thingsCollection) {
        expect(thingsCollection.findByKey('id', 99)).toEqual(undefined);
      }));
    });

    describe('add', function() {
      it('should create a unique key', inject(function(thingsCollection) {
        var item1 = {'somekey': 'someval3'}, item2 = {'somekey': 'someval4'};
        thingsCollection.add(item1);
        thingsCollection.add(item2);
        expect(item1.id).toBeTruthy();
        expect(item2.id).toBeTruthy();
        expect(item1.id).not.toEqual(item2.id);
      }));
    });

  });
});
