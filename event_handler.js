function EventHandler() {
  var events = {};
  var self = this;
  this.events = events;
  
  this.log_events = false;
  
  function bind(key, callback) {
    
    // handle multiple events: event_handler.bind(['first_event', 'seccond_event'], callback)
    if (typeof(key) == 'object') {
      for (var e in key) {
        events[key[e]] = events[key[e]] || [];
        events[key[e]].push(callback);
      }
    }
    // handle events identified by strings: event_handler.bind('an_event', callback)
    else {
      events[key] = events[key] || [];
      events[key].push(callback);
    }
  };
  this.bind = bind;

  function unbind(key, callback){
    for (var i in events[key]) {
      if (callback == undefined || events[key][i] == callback) {
        events[key].splice(i, 1);
      }
    }
  };
  this.unbind = unbind;

  function fire() {
    var args = Utils.arrayify_arguments(arguments);
    var key = args.shift();
    
    if (self.log_events) console.log({
      call_stack: get_call_stack(20),
      object: self, 
      key: key, 
      arguments: args,
      events: events[key]
    });
    
    if (!(args instanceof Array)) { args = [args]; }
    
    if (events[key] && events[key].length > 0) {
      for (var i in events[key]) {
        var func = events[key][i];
        func.apply(self, args);
      }
    }
  };
  this.fire = fire;
  
  function get_call_stack(length) {
    var stack = [];
    var _caller = arguments.callee;
    while (_caller.caller && length > 0) {
      _caller = _caller.caller;
      length = length-1;
      stack.push([_caller, _caller.arguments]);
    }
    return stack;
  }
};

window.event_handler = new EventHandler();

