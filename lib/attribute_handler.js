function AttributeHandler() {
  var self = this;
  EventHandler.apply(self);
  
  for (var attr_name in self.attributes ) {
    if ( self.attributes[attr_name] instanceof Array ) {
      make_relationship(attr_name);
    }
    else {
      generate_attr_methods(attr_name);
    }
  }
  
  self.to_hash = function to_hash() {
    var hash = {};
    for ( var attr_name in self.attributes ) {
      if ( self.attributes[attr_name] && typeof(self.attributes[attr_name].to_hash) == 'function') {
        hash[attr_name] = self.attributes[attr_name].to_hash();
      }
      else if ( self.attributes[attr_name] && typeof(self.attributes[attr_name].hashify_members) == 'function') {
        hash[attr_name] = self.attributes[attr_name].hashify_members();
      }
      else {
        hash[attr_name] = self.attributes[attr_name];
      }
    }
    return hash;
  };
  
  function generate_attr_methods(attr_name) {
    self[attr_name] = function() {
      return self.attributes[attr_name];
    };
    self["set_" + attr_name] = function(_val) {
      if (_val != self.attributes[attr_name]) {
        self.attributes[attr_name] = _val;
        self.fire(attr_name + '.changed', _val);
      }
    };
  }
  
  function make_relationship(attr_name) {
    self.attributes[attr_name] = EArray(self.attributes[attr_name]);
    self.attributes[attr_name];
    
    self[attr_name] = function() {
      return self.attributes[attr_name];
    };
    self["set_" + attr_name] = function(arr) {
      self.attributes[attr_name].set(arr);
      bind_event_passdowns();
      self.fire(attr_name + '.changed', self.attributes[attr_name]);
    };
    
    bind_event_passdowns();
    
    function bind_event_passdowns() {
      self.attributes[attr_name].bind('changed', function(arr) { self.fire(attr_name + '.changed', arr); });
      self.attributes[attr_name].bind('added',   function(arr) { self.fire(attr_name + '.added',   arr); });
      self.attributes[attr_name].bind('removed', function(arr) { self.fire(attr_name + '.removed', arr); });
    }
  }
}

