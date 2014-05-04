describe('declutter', function() {

  var addItemFn = function(title) {
    browser.get('/');
    element(by.name('add')).click();
    expect(element(by.name('editform'))).toBeDefined();
    element(by.name('title')).sendKeys(title);
    element(by.name('save')).click();
  };

  afterEach(function() {
    browser.executeScript('localStorage.clear();');
    // browser.executeScript('angular.element(document.body).injector().get(\'$localStorage\').$reset();');
  });

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

  it('should remove an item', function() {
    addItemFn('item one');
    addItemFn('item two');
    browser.get('/');
    element.all(by.repeater('thing in things.items')).then(function(els) {
      expect(els.length).toEqual(2);
      expect(els[0].findElement(by.css('h2')).getText()).toEqual('item one');
      els[0].click();
      element(by.css('.button-action-delete')).click();
      element(by.buttonText('OK')).click();
      element.all(by.repeater('thing in things.items')).then(function(els) {
        expect(els.length).toEqual(1);
        expect(els[0].findElement(by.css('h2')).getText()).toEqual('item two');
      });
    });
  });
});