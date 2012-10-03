Beehive.Behaviours.View = function View(template) {
  var self = this;
  Beehive.make(this).have_an('event handler');
  Beehive.make(this).have('attributes');

  self.root_node = $(template);

  self.append_to = function append_to(_node) {
    _node.append(self.root_node);
  };

  self.has_linked_attribute = function has_linked_attribute(attr_name, initial_value) {
    self.has_attribute(attr_name, initial_value);

    var node = $('.'+attr_name+', *[name='+attr_name+']', self.root_node);

    if (node.length == 0) {
      throw ('Could not find a node with class or name of '+attr_name);
    }
    
    if (typeof node[0].value != undefined) {
      handle_attribute_linked_to_field(attr_name, node);
    }
    else {
      handle_attribute_linked_to_normal_node(attr_name, node);
    }

    function handle_attribute_linked_to_field(attr_name, node) {
      self.bind(attr_name+'.changed', update_field_from_attribute);
      node.change(update_attribute_from_field);
      node.keyup(update_attribute_from_field);
      node.click(update_attribute_from_field);

      function update_field_from_attribute() {
        node.val(self[attr_name]());
      }
      function update_attribute_from_field() {
        self['set_'+attr_name](node.val());
      }
    }

    function handle_attribute_linked_to_normal_node(attr_name, node) {
      
    }
  };

  self.has_linked_model = function has_linked_model(attr_name, model) {
    self.has_attribute(attr_name, model);
    self['set_'+attr_name] = function() { throw('Linked view model cannot be assigned to.'); }

    for (var attr in model.attributes) {
      bind_model_attr(attr);
    }

    function bind_model_attr(attr_name) {
      var node = $('.'+attr_name+', *[name='+attr_name+']', self.root_node);
      if (node.length > 0) {
        if (typeof node[0].value != 'undefined') 
          handle_model_attribute_linked_to_field(node, attr_name);
        else
          handle_model_attribute_linked_to_normal_node(node, attr_name);
      }
    }

    function handle_model_attribute_linked_to_field(node, attr_name) {
      model.bind(attr_name+'.changed', update_field_from_attribute);
      node.change(update_attribute_from_field);
      node.keyup(update_attribute_from_field);
      node.click(update_attribute_from_field);

      function update_field_from_attribute() {
        node.val(model[attr_name]());
      }
      function update_attribute_from_field() {
        model['set_'+attr_name](node.val());
      }
    }
    function handle_model_attribute_linked_to_normal_node(node, attr_name) {

    }
  };

  self.hooks_form_submit = function hooks_form_submit() {
    $('form', self.root_node).submit(function(e) {
      e.preventDefault();
      self.fire('submit');
    });
  };
}
