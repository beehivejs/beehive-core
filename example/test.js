var Testies = {};

Testies.Matchers = function Matchers() {
  var self = this;

  self.assert_equal = function asser_equal(a, b) {
    if (a != b) self.fail_with_message('Expected '+a+' to equal '+b, a, b);
  };

  self.assert_hash_equal = function assert_hash_equal(a, b) {
    for (var i in a) {
      if (b[i] != a[i]) fail_with_message('Expected '+a+' to equal '+b, a, b);
    }
    for (var i in b) {
      if (a[i] != b[i]) fail_with_message('Expected '+a+' to equal '+b, a, b);
    }
  };

  self.assert_true = function assert_true(obj) {
    if (!obj) fail_with_message('Expected to be true', obj);
  }
  self.assert_false = function assert_true(obj) {
    if (!!obj) fail_with_message('Expected to be false', obj);
  }
}

Testies.TestFrame = function TestFrame() {
  Testies.Matchers.apply(this);

  this.fail_with_message = function fail_with_message(message) {
    console.log(arguments);
    throw('Expectation not met');
  }
}

Testies.run_test = function run_test(example) {
  var test_frame = new Testies.TestFrame();
  example.apply(test_frame);
}
