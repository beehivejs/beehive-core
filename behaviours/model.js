Beehive.Behaviours.Model = function Model(params) {
  Beehive.make(this).have_an('event handler');

  var self = this;
  var attributes = {};
  var relationships = {};

  for (var i=0; i<(params.attributes || []).length; i++) {
    create_attribute(params.attributes[i]);
  }
  for (var i=0; i<(params.relationships || []).length; i++) {
    create_relationship(params.relationships[i]);
  }

  for (i in (params.initial_values || {})) {
    if (typeof(self[i]) == 'function') {
      self['set_'+i](params.initial_values[i]);
    }
  }

  function create_attribute(attr_name) {
    self[attr_name] = function() {
      return attributes[attr_name];
    };
    self['set_'+attr_name] = function(value) {
      if (attributes[attr_name] != value) {
        attributes[attr_name] = value;
        self.fire(attr_name + '.changed', self, value);
      }
    }
  }

  function create_relationship(rel_name) {
    relationships[rel_name] = Beehive.EArray();
    self[rel_name] = function() {
      return relationships[rel_name];
    }
    self['set_'+rel_name] = function(new_arr) {
      relationships[rel_name].set(new_arr);
    }

    //Bind Event Passdowns
    relationships[rel_name].bind('changed', function(new_arr) {
      self.fire(rel_name+'.changed', new_arr);
    });
    relationships[rel_name].bind('added', function(added_arr) {
      self.fire(rel_name+'.added', added_arr);
    });
    relationships[rel_name].bind('removed', function(removed_arr) {
      self.fire(rel_name+'.changed', removed_arr);
    });
  }
};
