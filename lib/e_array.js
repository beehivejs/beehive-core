function EArray(array) {
  array = array || [];
  if (array.to_real_array) array = array.to_real_array();
  EventHandler.apply(array);
  
    
  // Non-destructive functions
  array.set = function set(_array) {
    array.empty();
    for (var i=0; i<_array.length; i++) {
      array.push(_array[i]);
    }
  };
  
  array.first = function first() {
    return array[0];
  }
  
  array.last = function last(number) {
    return array[array.length-1];
  };
  
  array.each = function each(func) {
    for (var i=0; i<array.length; i++) {
      var return_val = func.call(this, array[i], i);
      if (typeof(return_val) != 'undefined') {
        return return_val;
      }
    }
    return undefined;
  };
  
  array.index_of = function index_of(search_object) {
    var search_func = (typeof search_object == 'function') ? search_object : function() {return this == search_object; };
    
    for (var i=0; i<array.length; i++) {
      if (search_func.apply(array[i])) {
        return i;
      }
    }
    return -1;
  };
  
  array.find = function find(search_func) {
    return array[array.index_of(search_func)];
  };
  
  array.find_all = function find_all(search_object) {
    var search_func = (typeof search_object == 'function') ? search_object : function() {return this == search_object; };
    
    var return_arr = EArray();
    for (var i=0; i<array.length; i++) {
      if (search_func.apply(array[i])) {
        return_arr.push(array[i]);
      }
    }
    return return_arr;
  };
  
  array.includes = function includes(search_object) {
    var search_func = (typeof search_object == 'function') ? search_object : function() {return this == search_object; };
    
    for (var i=0; i<array.length; i++) {
      if (search_func.apply(array[i])) {
        return true;
      }
    }
    return false;
  };
  
  array.includes_one_of = function includes_one_of(search_arr) {
    for (var i=0; i<search_arr.length; i++) {
      if (array.includes(search_arr[i])) return true;
    }
    return false;
  };
  
  array.count = function count(search_object) {
    return array.find_all(search_object).length;
  };
  
  array.collect = function collect(_collect_func) {
    var collect_func;
    if ( typeof(_collect_func) == 'string' ) {
      collect_func = function () {
        if ( typeof(this[_collect_func] == 'function') ) return this[_collect_func]();
        else                                             return this[_collect_func];
      };
    }
    else collect_func = _collect_func;
    
    var return_arr = EArray();
    for (var i=0; i<array.length; i++) {
      return_arr.push(collect_func.apply(array[i]));
    }
    return return_arr;
  };
  
  array.map = array.collect;
  
  array.group = function group(group_func, collect_func) {
    collect_func = collect_func || function() { return this; };
    var return_hash = {};
    var group_name;
    for (var i=0; i<array.length; i++) {
      group_name = group_func.apply(array[i]);
      if (!return_hash[group_name]) return_hash[group_name] = EArray();
      return_hash[group_name].push(collect_func.apply(array[i]));
    }
    return return_hash;
  };
  
  array.hashify_members = function hashify_members() {
    var return_arr = [];
    array.each(function(item) {
      if ( item && typeof(item.to_hash) == 'function' ) {
        return_arr.push(item.to_hash());
      }
      else if ( item && typeof(item.hashify_members) == 'function' ) {
        return_arr.push(item.hashify_members());
      }
      else {
        return_arr.push(item);
      }
    });
    return return_arr;
  };
  
  array.to_real_array = function to_real_array() {
    return _slice.apply(array);
  };
  
  
  //Destructive functions
  array.empty = function empty() {
    array.splice(0);
  };
  
  array.remove = function remove(match_object) {
    var match_func = (typeof match_object == 'function') ? match_object : function() {return this == match_object; };
    
    var removed_members = EArray();
    for(var i=0; i<array.length; i++) {
      if (match_func.apply(array[i])) {
        removed_members.push(array.splice(i, 1)[0]);
      }
    }
    array.fire('removed', removed_members);
    array.fire('changed', array);
    return removed_members;
  };
  
  
  //Native function wrappers
  //Destructive
  
  //TODO: overriding native functions causes events to fire twice.
  // Refactor this section.
  var _push = array.push;
  array.push = function push() {
    var ret = _push.apply(array, arguments);
    array.fire('added', EArray(Utils.arrayify_arguments(arguments)));
    array.fire('changed', array);
    return ret;
  };
  
  var _pop = array.pop;
  array.pop = function pop() {
    var ret = _pop.apply(array);
    array.fire('removed', EArray([ret]));
    array.fire('changed', array);
    return ret;
  };
  
  var _unshift = array.unshift;
  array.unshift = function unshift() {
    var ret = _unshift.apply(array, arguments);
    array.fire('added', EArray(Utils.arrayify_arguments(arguments)));
    array.fire('changed', array);
    return ret;
  };
  
  var _shift = array.shift;
  array.shift = function shift() {
    var ret = _shift.apply(array);
    array.fire('removed', EArray([ret]));
    array.fire('changed', array);
    return ret;
  };
  
  var _splice = array.splice;
  array.splice = function splice() {
    //TODO: Implement events here.array.collect
    return EArray(_splice.apply(array, arguments));
  };
  
  var _sort = array.sort;
  array.sort = function sort() {
    array.fire('changed', array);
    return _sort.apply(array, arguments);
  };
  
  //Non-destructive
  var _slice = array.slice;
  array.slice = function slice() {
    return EArray(_slice.apply(array, arguments));
  };

  var _concat = array.concat;
  array.concat = function concat() {
    return EArray(_concat.apply(array, arguments));
  };
  
  return array;
}