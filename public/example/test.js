

Beehive.Behaviours.Animal = function Animal() {
  this.can_breathe = true;
};
Beehive.Behaviours.StupidAnimal = function StupidAnimal(params) {
  Beehive.make(this).behave_like_a('animal');
  
  this.attributes = params;
  this.iq = 3;
  this.dribbles = true;
};




function Dog() {
  Beehive.make(this).behave_like_a('stupid animal', {
    attributes: ['foo', 'bar']
  });
};


var tilly = new Dog();
