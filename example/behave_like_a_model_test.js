Testies.run_test(function it_should_have_evented_attributes() {
  function SuperModel(params) {
    var self = this;
    Beehive.make(self).behave_like_a('model', {
      attributes: ['hair_state', 'mood'],
      initial_values: params
    });

    self.bind('hair_state.changed', function() {
      if(self.hair_state() == 'bad') {
        self.set_mood('pissed');
      }
    })
  }

  var leslie = new SuperModel({
    hair_state: 'good',
    mood: 'fine',
    rubbish_value: 'foooooooo'
  });

  this.assert_equal(leslie.hair_state(), 'good');
  this.assert_equal(leslie.mood(), 'fine');

  leslie.set_hair_state('bad');

  this.assert_equal(leslie.mood(), 'pissed');
});
