Beehive.Behaviours.Model = function Model(params) {
  Beehive.make(this).have_an('event handler');
  Beehive.make(this).have('attributes');

  var self = this;
  self.relationships = {};

  function has_relationship(rel_name) {
    self.relationships[rel_name] = Beehive.EArray();
    self[rel_name] = function() {
      return self.relationships[rel_name];
    }
    self['set_'+rel_name] = function(new_arr) {
      self.relationships[rel_name].set(new_arr);
    }

    //Bind Event Passdowns
    self.relationships[rel_name].bind('changed', function(new_arr) {
      self.fire(rel_name+'.changed', new_arr);
    });
    self.relationships[rel_name].bind('added', function(added_arr) {
      self.fire(rel_name+'.added', added_arr);
    });
    self.relationships[rel_name].bind('removed', function(removed_arr) {
      self.fire(rel_name+'.changed', removed_arr);
    });
  }
  self.has_relationship = has_relationship;

  self.to_hash = function to_hash() {
    return_hash = {};
    for (var attr in self.attributes) {
      return_hash[attr] = self[attr]();
    }
    return return_hash;
  }
};
