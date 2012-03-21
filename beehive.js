var Beehive = new function() {
  this.Behaviours = {};

  var Utils = {
    constantize: function constantize(string) {
      var words = string.split(/[\W_]/);
      for (var i=0; i<words.length; i++) {
        words[i] = words[i].substr(0, 1).toUpperCase() + words[i].substr(1);
      }
      return words.join('');
    },

    arrayify_arguments: function arrayify_arguments(args) {
      var return_arr = [];
      for (var i=0; i<args.length; i++) {
        return_arr.push(args[i]);
      }
      return return_arr;
    }
  };
  this.Utils = Utils;

  this.make = function make(target) {
    function behave_like_a(behaviour_type, params) {
      var behaviour_func = Beehive.Behaviours[Utils.constantize(behaviour_type)];
      if (!behaviour_func) {
        throw('Couldn\'t find a behaviour called "'+Utils.constantize(behaviour_type)+'".')
      }
      behaviour_func.call(target, params);
    };
    return {
      behave_like_a: behave_like_a,
      behave_like_an: behave_like_a,
      have_a: behave_like_a,
      have_an: behave_like_a
    };
  };
};
