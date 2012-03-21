run_test(function test_event_bindings_and_fireings() {
  function Lion() {
    Beehive.make(this).have_an('event handler');
  }

  var nasty_nasty_lion = new Lion();

  var is_legging_it = false;
  function leg_it() {
    is_legging_it = true;
  }

  nasty_nasty_lion.bind('roar', leg_it);
  nasty_nasty_lion.fire('roar');

  this.assert_true(is_legging_it);
});

run_test(function test_event_unbinding() {
  function Lion() {
    Beehive.make(this).have_an('event handler');
  }

  var wimpy_lion = new Lion();

  var is_legging_it = false;
  function leg_it() {
    is_legging_it = true;
  }

  wimpy_lion.bind('roar', leg_it);
  wimpy_lion.unbind('roar', leg_it);
  wimpy_lion.fire('roar');

  this.assert_false(is_legging_it);
});
