
Beehive.Behaviours.Fobble = function Test(params) {
  this.foo = params;
  this.bar = 'blob';
};




function Book() {
  Beehive.attach('Fobble').with_paramaters('miaaaaao').to(this);
};

world.hitch_hikers_guide = new Book();

