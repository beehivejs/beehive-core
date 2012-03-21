
run_test(function stuff_should_behave_like_stuff() {
  Beehive.Behaviours.Animal = function Animal() {
    this.can_breathe = true;
  };
  Beehive.Behaviours.StupidAnimal = function StupidAnimal(params) {
    Beehive.make(this).behave_like_an('animal');

    this.attributes = params.attributes;
    this.iq = 3;
  };

  function Dog() {
    Beehive.make(this).behave_like_a('stupid animal', {
      attributes: {
        fur_color: 'pink',
        dribble_rate: '1l'
      }
    });
  };

  var tilly = new Dog();

  this.assert_hash_equal(tilly.attributes, {
      fur_color: 'pink',
      dribble_rate: '1l'
    });
  this.assert_equal(tilly.iq, 3);
  this.assert_equal(tilly.can_breathe, true);
});



