Beehive.Behaviours.Model = function Model(params) {
  Beehive.make(this).have_an('event handler');

  var self = this;
  var attributes = {}

  for (var i=0; i<(params.attributes || []).length; i++) {
    create_attribute(params.attributes[i]);
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
        self.fire(attr_name + '.changed');
      }
    }
  };
}
