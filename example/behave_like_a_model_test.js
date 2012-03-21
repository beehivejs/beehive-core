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

Testies.run_test(function it_should_have_evented_relationships() {
  function SuperModel(params) {
    var self = this;
    Beehive.make(self).behave_like_a('model', {
      attributes: ['street_cred'],
      relationships: ['groupies'],
      initial_values: {
        street_cred: 0
      }
    });

    self.bind('groupies.added', function(added_groupies) {
      self.set_street_cred(self.street_cred() + added_groupies.length);
    });
    self.bind('groupies.removed', function(removed_groupies) {
      self.set_street_cred(self.street_cred() - removed_groupies.length);
    });
    self.bind('groupies.changed', function() {
      self.set_street_cred(self.groupies().length);
    });
  }

  var linda = new SuperModel()

  linda.groupies().push('bob', 'bert');

  this.assert_equal(linda.street_cred(), 2);

  linda.groupies().pop();

  this.assert_equal(linda.street_cred(), 1);

  linda.set_groupies(['bert', 'bill', 'a really weird creapy guy in a trench-coat']);

  this.assert_equal(linda.street_cred(), 3);
});

