var Beehive = new function() {
  this.Behaviours = {};
  
  this.attach = function attach(behaviuor_name) {
    var behaviour_func = Beehive.Behaviours[behaviuor_name];
    var params;
    
    function _with(_params) {
      params = _params;
      return {to: to};
    }
    function to(target) {
      behaviour_func.apply(target, params);
    }
    
    return {
      'with': _width,
      'to': to
    };
  };
};

  
