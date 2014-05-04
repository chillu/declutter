describe('declutter', function() {

  it('should show an introduction when no items exist', function() {
    browser.get('/');
    expect($('.intro')).toBeDefined();
    element.all(by.repeater('thing in things.items')).then(function(els) {
    	expect(els.length).toEqual(0);
    });
  });

  it('should add an item', function() {
    browser.get('/');
    element(by.name('add')).click();
    expect(element(by.name('editform'))).toBeDefined();
    element(by.name('title')).sendKeys('item one');
    element(by.name('save')).click();
    element.all(by.repeater('thing in things.items')).then(function(els) {
    	expect(els.length).toEqual(1);
    });
  });
});