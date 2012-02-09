var Beehive = new function() {
  this.Behaviours = {};
  
  this.make = function make(target) {
    function behave_like_a(behaviour_type, params) {
      var behaviour_func = Beehive.Behaviours[constantize(behaviour_type)];
      behaviour_func.call(target, params);
    };
    return {
      behave_like_a: behave_like_a,
      behave_like_an: behave_like_a
    };
  };
};



function constantize(string) {
  var words = string.split(/[\W_]/);
  for (var i=0; i<words.length; i++) {
    words[i] = words[i].substr(0, 1).toUpperCase() + words[i].substr(1);
  }
  return words.join('');
};