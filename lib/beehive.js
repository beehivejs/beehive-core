var world = {};

var Beehive = {
  
};



function ActsLikeAThing() {
  this.foo = 'bar';
}

function Thing() {
  ActsLikeAThing();
}

var thing = new Thing();
console.log(thing);