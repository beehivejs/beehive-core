Beehive.Behaviours.Attributes = function Attributes() {
  var self = this;

  self.attributes = {};

  function has_attribute(attr_name, initial_value) {
    self.attributes[attr_name] = initial_value;
    self[attr_name] = function() {
      return self.attributes[attr_name];
    };
    self['set_'+attr_name] = function(value) {
      if (self.attributes[attr_name] != value) {
        self.attributes[attr_name] = value;
        self.fire(attr_name + '.changed', self, value);
      }
    }
  }
  self.has_attribute = has_attribute;
};