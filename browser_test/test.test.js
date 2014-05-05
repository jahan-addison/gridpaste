describe("A test suite", function() {
  beforeEach(function() {
  });
  afterEach(function() {
  });
  it('should find jquery', function() {
    expect($).to.exist;
    expect(jQuery).to.exist;
  });
  it('should find JXG', function() {
    expect(JXG).to.exist;
  });
  it('should find RxJS', function() {
    expect(Rx).to.exist;
  });
});
