d3={}
var d3_arraySlice = [].slice, d3_array = function(list) {
  return d3_arraySlice.call(list);
};

var d3_document = {}, d3_documentElement ={}, d3_window = {};

try {
  d3_array(d3_documentElement.childNodes)[0].nodeType;
} catch (e) {
  d3_array = function(list) {
    var i = list.length, array = new Array(i);
    while (i--) array[i] = list[i];
    return array;
  };
}

d3.rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
  return target;
};

function d3_rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}

function d3_vendorSymbol(object, name) {
  if (name in object) return name;
  name = name.charAt(0).toUpperCase() + name.substring(1);
  for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
    var prefixName = d3_vendorPrefixes[i] + name;
    if (prefixName in object) return prefixName;
  }
}

var d3_vendorPrefixes = [ "webkit", "ms", "moz", "Moz", "o", "O" ];

function d3_class(ctor, properties) {
  try {
    for (var key in properties) {
      Object.defineProperty(ctor.prototype, key, {
        value: properties[key],
        enumerable: false
      });
    }
  } catch (e) {
    ctor.prototype = properties;
  }
}

d3.map = function(object) {
  var map = new d3_Map();
  if (object instanceof d3_Map) object.forEach(function(key, value) {
    map.set(key, value);
  }); else for (var key in object) map.set(key, object[key]);
  return map;
};

function d3_Map() {}

d3_class(d3_Map, {
  has: d3_map_has,
  get: function(key) {
    return this[d3_map_prefix + key];
  },
  set: function(key, value) {
    return this[d3_map_prefix + key] = value;
  },
  remove: d3_map_remove,
  keys: d3_map_keys,
  values: function() {
    var values = [];
    this.forEach(function(key, value) {
      values.push(value);
    });
    return values;
  },
  entries: function() {
    var entries = [];
    this.forEach(function(key, value) {
      entries.push({
        key: key,
        value: value
      });
    });
    return entries;
  },
  size: d3_map_size,
  empty: d3_map_empty,
  forEach: function(f) {
    for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) f.call(this, key.substring(1), this[key]);
  }
});

var d3_map_prefix = "\x00", d3_map_prefixCode = d3_map_prefix.charCodeAt(0);

function d3_map_has(key) {
  return d3_map_prefix + key in this;
}

function d3_map_remove(key) {
  key = d3_map_prefix + key;
  return key in this && delete this[key];
}

function d3_map_keys() {
  var keys = [];
  this.forEach(function(key) {
    keys.push(key);
  });
  return keys;
}

function d3_map_size() {
  var size = 0;
  for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) ++size;
  return size;
}

function d3_map_empty() {
  for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) return false;
  return true;
}

function d3_noop() {}

d3.dispatch = function() {
  var dispatch = new d3_dispatch(), i = -1, n = arguments.length;
  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
  return dispatch;
};

function d3_dispatch() {}

d3_dispatch.prototype.on = function(type, listener) {
  var i = type.indexOf("."), name = "";
  if (i >= 0) {
    name = type.substring(i + 1);
    type = type.substring(0, i);
  }
  if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
  if (arguments.length === 2) {
    if (listener == null) for (type in this) {
      if (this.hasOwnProperty(type)) this[type].on(name, null);
    }
    return this;
  }
};

function d3_dispatch_event(dispatch) {
  var listeners = [], listenerByName = new d3_Map();
  function event() {
    var z = listeners, i = -1, n = z.length, l;
    while (++i < n) if (l = z[i].on) l.apply(this, arguments);
    return dispatch;
  }
  event.on = function(name, listener) {
    var l = listenerByName.get(name), i;
    if (arguments.length < 2) return l && l.on;
    if (l) {
      l.on = null;
      listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
      listenerByName.remove(name);
    }
    if (listener) listeners.push(listenerByName.set(name, {
      on: listener
    }));
    return dispatch;
  };
  return event;
}

d3.event = null;

function d3_eventPreventDefault() {
  d3.event.preventDefault();
}

function d3_eventSource() {
  var e = d3.event, s;
  while (s = e.sourceEvent) e = s;
  return e;
}

function d3_eventDispatch(target) {
  var dispatch = new d3_dispatch(), i = 0, n = arguments.length;
  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
  dispatch.of = function(thiz, argumentz) {
    return function(e1) {
      try {
        var e0 = e1.sourceEvent = d3.event;
        e1.target = target;
        d3.event = e1;
        dispatch[e1.type].apply(thiz, argumentz);
      } finally {
        d3.event = e0;
      }
    };
  };
  return dispatch;
}

d3.requote = function(s) {
  return s.replace(d3_requote_re, "\\$&");
};

var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

var d3_subclass = {}.__proto__ ? function(object, prototype) {
  object.__proto__ = prototype;
} : function(object, prototype) {
  for (var property in prototype) object[property] = prototype[property];
};

function d3_selection(groups) {
  d3_subclass(groups, d3_selectionPrototype);
  return groups;
}

var d3_select = function(s, n) {
  return n.querySelector(s);
}, d3_selectAll = function(s, n) {
  return n.querySelectorAll(s);
}, d3_selectMatcher = d3_documentElement[d3_vendorSymbol(d3_documentElement, "matchesSelector")], d3_selectMatches = function(n, s) {
  return d3_selectMatcher.call(n, s);
};

if (typeof Sizzle === "function") {
  d3_select = function(s, n) {
    return Sizzle(s, n)[0] || null;
  };
  d3_selectAll = function(s, n) {
    return Sizzle.uniqueSort(Sizzle(s, n));
  };
  d3_selectMatches = Sizzle.matchesSelector;
}

d3.selection = function() {
  return d3_selectionRoot;
};

var d3_selectionPrototype = d3.selection.prototype = [];

d3_selectionPrototype.select = function(selector) {
  var subgroups = [], subgroup, subnode, group, node;
  selector = d3_selection_selector(selector);
  for (var j = -1, m = this.length; ++j < m; ) {
    subgroups.push(subgroup = []);
    subgroup.parentNode = (group = this[j]).parentNode;
    for (var i = -1, n = group.length; ++i < n; ) {
      if (node = group[i]) {
        subgroup.push(subnode = selector.call(node, node.__data__, i, j));
        if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
      } else {
        subgroup.push(null);
      }
    }
  }
  return d3_selection(subgroups);
};

function d3_selection_selector(selector) {
  return typeof selector === "function" ? selector : function() {
    return d3_select(selector, this);
  };
}

d3_selectionPrototype.selectAll = function(selector) {
  var subgroups = [], subgroup, node;
  selector = d3_selection_selectorAll(selector);
  for (var j = -1, m = this.length; ++j < m; ) {
    for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
      if (node = group[i]) {
        subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
        subgroup.parentNode = node;
      }
    }
  }
  return d3_selection(subgroups);
};

function d3_selection_selectorAll(selector) {
  return typeof selector === "function" ? selector : function() {
    return d3_selectAll(selector, this);
  };
}

var d3_nsPrefix = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: "http://www.w3.org/1999/xhtml",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

d3.ns = {
  prefix: d3_nsPrefix,
  qualify: function(name) {
    var i = name.indexOf(":"), prefix = name;
    if (i >= 0) {
      prefix = name.substring(0, i);
      name = name.substring(i + 1);
    }
    return d3_nsPrefix.hasOwnProperty(prefix) ? {
      space: d3_nsPrefix[prefix],
      local: name
    } : name;
  }
};

d3_selectionPrototype.attr = function(name, value) {
  if (arguments.length < 2) {
    if (typeof name === "string") {
      var node = this.node();
      name = d3.ns.qualify(name);
      return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);
    }
    for (value in name) this.each(d3_selection_attr(value, name[value]));
    return this;
  }
  return this.each(d3_selection_attr(name, value));
};

function d3_selection_attr(name, value) {
  name = d3.ns.qualify(name);
  function attrNull() {
    this.removeAttribute(name);
  }
  function attrNullNS() {
    this.removeAttributeNS(name.space, name.local);
  }
  function attrConstant() {
    this.setAttribute(name, value);
  }
  function attrConstantNS() {
    this.setAttributeNS(name.space, name.local, value);
  }
  function attrFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);
  }
  function attrFunctionNS() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);
  }
  return value == null ? name.local ? attrNullNS : attrNull : typeof value === "function" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;
}

function d3_collapse(s) {
  return s.trim().replace(/\s+/g, " ");
}

d3_selectionPrototype.classed = function(name, value) {
  if (arguments.length < 2) {
    if (typeof name === "string") {
      var node = this.node(), n = (name = d3_selection_classes(name)).length, i = -1;
      if (value = node.classList) {
        while (++i < n) if (!value.contains(name[i])) return false;
      } else {
        value = node.getAttribute("class");
        while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
      }
      return true;
    }
    for (value in name) this.each(d3_selection_classed(value, name[value]));
    return this;
  }
  return this.each(d3_selection_classed(name, value));
};

function d3_selection_classedRe(name) {
  return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
}

function d3_selection_classes(name) {
  return name.trim().split(/^|\s+/);
}

function d3_selection_classed(name, value) {
  name = d3_selection_classes(name).map(d3_selection_classedName);
  var n = name.length;
  function classedConstant() {
    var i = -1;
    while (++i < n) name[i](this, value);
  }
  function classedFunction() {
    var i = -1, x = value.apply(this, arguments);
    while (++i < n) name[i](this, x);
  }
  return typeof value === "function" ? classedFunction : classedConstant;
}

function d3_selection_classedName(name) {
  var re = d3_selection_classedRe(name);
  return function(node, value) {
    if (c = node.classList) return value ? c.add(name) : c.remove(name);
    var c = node.getAttribute("class") || "";
    if (value) {
      re.lastIndex = 0;
      if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
    } else {
      node.setAttribute("class", d3_collapse(c.replace(re, " ")));
    }
  };
}

d3_selectionPrototype.style = function(name, value, priority) {
  var n = arguments.length;
  if (n < 3) {
    if (typeof name !== "string") {
      if (n < 2) value = "";
      for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
      return this;
    }
    if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);
    priority = "";
  }
  return this.each(d3_selection_style(name, value, priority));
};

function d3_selection_style(name, value, priority) {
  function styleNull() {
    this.style.removeProperty(name);
  }
  function styleConstant() {
    this.style.setProperty(name, value, priority);
  }
  function styleFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);
  }
  return value == null ? styleNull : typeof value === "function" ? styleFunction : styleConstant;
}

d3_selectionPrototype.property = function(name, value) {
  if (arguments.length < 2) {
    if (typeof name === "string") return this.node()[name];
    for (value in name) this.each(d3_selection_property(value, name[value]));
    return this;
  }
  return this.each(d3_selection_property(name, value));
};

function d3_selection_property(name, value) {
  function propertyNull() {
    delete this[name];
  }
  function propertyConstant() {
    this[name] = value;
  }
  function propertyFunction() {
    var x = value.apply(this, arguments);
    if (x == null) delete this[name]; else this[name] = x;
  }
  return value == null ? propertyNull : typeof value === "function" ? propertyFunction : propertyConstant;
}

d3_selectionPrototype.text = function(value) {
  return arguments.length ? this.each(typeof value === "function" ? function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  } : value == null ? function() {
    this.textContent = "";
  } : function() {
    this.textContent = value;
  }) : this.node().textContent;
};

d3_selectionPrototype.html = function(value) {
  return arguments.length ? this.each(typeof value === "function" ? function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  } : value == null ? function() {
    this.innerHTML = "";
  } : function() {
    this.innerHTML = value;
  }) : this.node().innerHTML;
};

d3_selectionPrototype.append = function(name) {
  name = d3_selection_creator(name);
  return this.select(function() {
    return this.appendChild(name.apply(this, arguments));
  });
};

function d3_selection_creator(name) {
  return typeof name === "function" ? name : (name = d3.ns.qualify(name)).local ? function() {
    return this.ownerDocument.createElementNS(name.space, name.local);
  } : function() {
    return this.ownerDocument.createElementNS(this.namespaceURI, name);
  };
}

d3_selectionPrototype.insert = function(name, before) {
  name = d3_selection_creator(name);
  before = d3_selection_selector(before);
  return this.select(function() {
    return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
  });
};

d3_selectionPrototype.remove = function() {
  return this.each(function() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  });
};

d3_selectionPrototype.data = function(value, key) {
  var i = -1, n = this.length, group, node;
  if (!arguments.length) {
    value = new Array(n = (group = this[0]).length);
    while (++i < n) {
      if (node = group[i]) {
        value[i] = node.__data__;
      }
    }
    return value;
  }
  function bind(group, groupData) {
    var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;
    if (key) {
      var nodeByKeyValue = new d3_Map(), dataByKeyValue = new d3_Map(), keyValues = [], keyValue;
      for (i = -1; ++i < n; ) {
        keyValue = key.call(node = group[i], node.__data__, i);
        if (nodeByKeyValue.has(keyValue)) {
          exitNodes[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
        keyValues.push(keyValue);
      }
      for (i = -1; ++i < m; ) {
        keyValue = key.call(groupData, nodeData = groupData[i], i);
        if (node = nodeByKeyValue.get(keyValue)) {
          updateNodes[i] = node;
          node.__data__ = nodeData;
        } else if (!dataByKeyValue.has(keyValue)) {
          enterNodes[i] = d3_selection_dataNode(nodeData);
        }
        dataByKeyValue.set(keyValue, nodeData);
        nodeByKeyValue.remove(keyValue);
      }
      for (i = -1; ++i < n; ) {
        if (nodeByKeyValue.has(keyValues[i])) {
          exitNodes[i] = group[i];
        }
      }
    } else {
      for (i = -1; ++i < n0; ) {
        node = group[i];
        nodeData = groupData[i];
        if (node) {
          node.__data__ = nodeData;
          updateNodes[i] = node;
        } else {
          enterNodes[i] = d3_selection_dataNode(nodeData);
        }
      }
      for (;i < m; ++i) {
        enterNodes[i] = d3_selection_dataNode(groupData[i]);
      }
      for (;i < n; ++i) {
        exitNodes[i] = group[i];
      }
    }
    enterNodes.update = updateNodes;
    enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;
    enter.push(enterNodes);
    update.push(updateNodes);
    exit.push(exitNodes);
  }
  var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);
  if (typeof value === "function") {
    while (++i < n) {
      bind(group = this[i], value.call(group, group.parentNode.__data__, i));
    }
  } else {
    while (++i < n) {
      bind(group = this[i], value);
    }
  }
  update.enter = function() {
    return enter;
  };
  update.exit = function() {
    return exit;
  };
  return update;
};

function d3_selection_dataNode(data) {
  return {
    __data__: data
  };
}

d3_selectionPrototype.datum = function(value) {
  return arguments.length ? this.property("__data__", value) : this.property("__data__");
};

d3_selectionPrototype.filter = function(filter) {
  var subgroups = [], subgroup, group, node;
  if (typeof filter !== "function") filter = d3_selection_filter(filter);
  for (var j = 0, m = this.length; j < m; j++) {
    subgroups.push(subgroup = []);
    subgroup.parentNode = (group = this[j]).parentNode;
    for (var i = 0, n = group.length; i < n; i++) {
      if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
        subgroup.push(node);
      }
    }
  }
  return d3_selection(subgroups);
};

function d3_selection_filter(selector) {
  return function() {
    return d3_selectMatches(this, selector);
  };
}

d3_selectionPrototype.order = function() {
  for (var j = -1, m = this.length; ++j < m; ) {
    for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
      if (node = group[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
};

d3.ascending = function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

d3_selectionPrototype.sort = function(comparator) {
  comparator = d3_selection_sortComparator.apply(this, arguments);
  for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);
  return this.order();
};

function d3_selection_sortComparator(comparator) {
  if (!arguments.length) comparator = d3.ascending;
  return function(a, b) {
    return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
  };
}

d3_selectionPrototype.each = function(callback) {
  return d3_selection_each(this, function(node, i, j) {
    callback.call(node, node.__data__, i, j);
  });
};

function d3_selection_each(groups, callback) {
  for (var j = 0, m = groups.length; j < m; j++) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
      if (node = group[i]) callback(node, i, j);
    }
  }
  return groups;
}

d3_selectionPrototype.call = function(callback) {
  var args = d3_array(arguments);
  callback.apply(args[0] = this, args);
  return this;
};

d3_selectionPrototype.empty = function() {
  return !this.node();
};

d3_selectionPrototype.node = function() {
  for (var j = 0, m = this.length; j < m; j++) {
    for (var group = this[j], i = 0, n = group.length; i < n; i++) {
      var node = group[i];
      if (node) return node;
    }
  }
  return null;
};

d3_selectionPrototype.size = function() {
  var n = 0;
  this.each(function() {
    ++n;
  });
  return n;
};

function d3_selection_enter(selection) {
  d3_subclass(selection, d3_selection_enterPrototype);
  return selection;
}

var d3_selection_enterPrototype = [];

d3.selection.enter = d3_selection_enter;

d3.selection.enter.prototype = d3_selection_enterPrototype;

d3_selection_enterPrototype.append = d3_selectionPrototype.append;

d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;

d3_selection_enterPrototype.node = d3_selectionPrototype.node;

d3_selection_enterPrototype.call = d3_selectionPrototype.call;

d3_selection_enterPrototype.size = d3_selectionPrototype.size;

d3_selection_enterPrototype.select = function(selector) {
  var subgroups = [], subgroup, subnode, upgroup, group, node;
  for (var j = -1, m = this.length; ++j < m; ) {
    upgroup = (group = this[j]).update;
    subgroups.push(subgroup = []);
    subgroup.parentNode = group.parentNode;
    for (var i = -1, n = group.length; ++i < n; ) {
      if (node = group[i]) {
        subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
        subnode.__data__ = node.__data__;
      } else {
        subgroup.push(null);
      }
    }
  }
  return d3_selection(subgroups);
};

d3_selection_enterPrototype.insert = function(name, before) {
  if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
  return d3_selectionPrototype.insert.call(this, name, before);
};

function d3_selection_enterInsertBefore(enter) {
  var i0, j0;
  return function(d, i, j) {
    var group = enter[j].update, n = group.length, node;
    if (j != j0) j0 = j, i0 = 0;
    if (i >= i0) i0 = i + 1;
    while (!(node = group[i0]) && ++i0 < n) ;
    return node;
  };
}

d3_selectionPrototype.transition = function() {
  var id = d3_transitionInheritId || ++d3_transitionId, subgroups = [], subgroup, node, transition = d3_transitionInherit || {
    time: Date.now(),
    ease: d3_ease_cubicInOut,
    delay: 0,
    duration: 250
  };
  for (var j = -1, m = this.length; ++j < m; ) {
    subgroups.push(subgroup = []);
    for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
      if (node = group[i]) d3_transitionNode(node, i, id, transition);
      subgroup.push(node);
    }
  }
  return d3_transition(subgroups, id);
};

d3_selectionPrototype.interrupt = function() {
  return this.each(d3_selection_interrupt);
};

function d3_selection_interrupt() {
  var lock = this.__transition__;
  if (lock) ++lock.active;
}

d3.select = function(node) {
  var group = [ typeof node === "string" ? d3_select(node, d3_document) : node ];
  group.parentNode = d3_documentElement;
  return d3_selection([ group ]);
};

d3.selectAll = function(nodes) {
  var group = d3_array(typeof nodes === "string" ? d3_selectAll(nodes, d3_document) : nodes);
  group.parentNode = d3_documentElement;
  return d3_selection([ group ]);
};

var d3_selectionRoot = d3.select(d3_documentElement);

d3_selectionPrototype.on = function(type, listener, capture) {
  var n = arguments.length;
  if (n < 3) {
    if (typeof type !== "string") {
      if (n < 2) listener = false;
      for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
      return this;
    }
    if (n < 2) return (n = this.node()["__on" + type]) && n._;
    capture = false;
  }
  return this.each(d3_selection_on(type, listener, capture));
};

function d3_selection_on(type, listener, capture) {
  var name = "__on" + type, i = type.indexOf("."), wrap = d3_selection_onListener;
  if (i > 0) type = type.substring(0, i);
  var filter = d3_selection_onFilters.get(type);
  if (filter) type = filter, wrap = d3_selection_onFilter;
  function onRemove() {
    var l = this[name];
    if (l) {
      this.removeEventListener(type, l, l.$);
      delete this[name];
    }
  }
  function onAdd() {
    var l = wrap(listener, d3_array(arguments));
    onRemove.call(this);
    this.addEventListener(type, this[name] = l, l.$ = capture);
    l._ = listener;
  }
  function removeAll() {
    var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"), match;
    for (var name in this) {
      if (match = name.match(re)) {
        var l = this[name];
        this.removeEventListener(match[1], l, l.$);
        delete this[name];
      }
    }
  }
  return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;
}

var d3_selection_onFilters = d3.map({
  mouseenter: "mouseover",
  mouseleave: "mouseout"
});

d3_selection_onFilters.forEach(function(k) {
  if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
});

function d3_selection_onListener(listener, argumentz) {
  return function(e) {
    var o = d3.event;
    d3.event = e;
    argumentz[0] = this.__data__;
    try {
      listener.apply(this, argumentz);
    } finally {
      d3.event = o;
    }
  };
}

function d3_selection_onFilter(listener, argumentz) {
  var l = d3_selection_onListener(listener, argumentz);
  return function(e) {
    var target = this, related = e.relatedTarget;
    if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
      l.call(target, e);
    }
  };
}


d3.mouse = function(container) {
  return d3_mousePoint(container, d3_eventSource());
};

function d3_mousePoint(container, e) {
  if (e.changedTouches) e = e.changedTouches[0];
  var svg = container.ownerSVGElement || container;
  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    if (d3_mouse_bug44083 < 0 && (d3_window.scrollX || d3_window.scrollY)) {
      svg = d3.select("body").append("svg").style({
        position: "absolute",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        border: "none"
      }, "important");
      var ctm = svg[0][0].getScreenCTM();
      d3_mouse_bug44083 = !(ctm.f || ctm.e);
      svg.remove();
    }
    if (d3_mouse_bug44083) point.x = e.pageX, point.y = e.pageY; else point.x = e.clientX, 
    point.y = e.clientY;
    point = point.matrixTransform(container.getScreenCTM().inverse());
    return [ point.x, point.y ];
  }
  var rect = container.getBoundingClientRect();
  return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
}

d3.touches = function(container, touches) {
  if (arguments.length < 2) touches = d3_eventSource().touches;
  return touches ? d3_array(touches).map(function(touch) {
    var point = d3_mousePoint(container, touch);
    point.identifier = touch.identifier;
    return point;
  }) : [];
};

d3.behavior = {};


function d3_identity(d) {
  return d;
}

var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_active, d3_timer_frame = d3_window[d3_vendorSymbol(d3_window, "requestAnimationFrame")] || function(callback) {
  setTimeout(callback, 17);
};

d3.timer = function(callback, delay, then) {
  var n = arguments.length;
  if (n < 2) delay = 0;
  if (n < 3) then = Date.now();
  var time = then + delay, timer = {
    c: callback,
    t: time,
    f: false,
    n: null
  };
  if (d3_timer_queueTail) d3_timer_queueTail.n = timer; else d3_timer_queueHead = timer;
  d3_timer_queueTail = timer;
  if (!d3_timer_interval) {
    d3_timer_timeout = clearTimeout(d3_timer_timeout);
    d3_timer_interval = 1;
    d3_timer_frame(d3_timer_step);
  }
};

function d3_timer_step() {
  var now = d3_timer_mark(), delay = d3_timer_sweep() - now;
  if (delay > 24) {
    if (isFinite(delay)) {
      clearTimeout(d3_timer_timeout);
      d3_timer_timeout = setTimeout(d3_timer_step, delay);
    }
    d3_timer_interval = 0;
  } else {
    d3_timer_interval = 1;
    d3_timer_frame(d3_timer_step);
  }
}

d3.timer.flush = function() {
  d3_timer_mark();
  d3_timer_sweep();
};

function d3_timer_mark() {
  var now = Date.now();
  d3_timer_active = d3_timer_queueHead;
  while (d3_timer_active) {
    if (now >= d3_timer_active.t) d3_timer_active.f = d3_timer_active.c(now - d3_timer_active.t);
    d3_timer_active = d3_timer_active.n;
  }
  return now;
}

function d3_timer_sweep() {
  var t0, t1 = d3_timer_queueHead, time = Infinity;
  while (t1) {
    if (t1.f) {
      t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;
    } else {
      if (t1.t < time) time = t1.t;
      t1 = (t0 = t1).n;
    }
  }
  d3_timer_queueTail = t0;
  return time;
}

function d3_functor(v) {
  return typeof v === "function" ? v : function() {
    return v;
  };
}

d3.functor = d3_functor;

var abs = Math.abs;

d3.geom = {};

function d3_geom_pointX(d) {
  return d[0];
}

function d3_geom_pointY(d) {
  return d[1];
}

d3.geom.quadtree = function(points, x1, y1, x2, y2) {
  var x = d3_geom_pointX, y = d3_geom_pointY, compat;
  if (compat = arguments.length) {
    x = d3_geom_quadtreeCompatX;
    y = d3_geom_quadtreeCompatY;
    if (compat === 3) {
      y2 = y1;
      x2 = x1;
      y1 = x1 = 0;
    }
    return quadtree(points);
  }
  function quadtree(data) {
    var d, fx = d3_functor(x), fy = d3_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_;
    if (x1 != null) {
      x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;
    } else {
      x2_ = y2_ = -(x1_ = y1_ = Infinity);
      xs = [], ys = [];
      n = data.length;
      if (compat) for (i = 0; i < n; ++i) {
        d = data[i];
        if (d.x < x1_) x1_ = d.x;
        if (d.y < y1_) y1_ = d.y;
        if (d.x > x2_) x2_ = d.x;
        if (d.y > y2_) y2_ = d.y;
        xs.push(d.x);
        ys.push(d.y);
      } else for (i = 0; i < n; ++i) {
        var x_ = +fx(d = data[i], i), y_ = +fy(d, i);
        if (x_ < x1_) x1_ = x_;
        if (y_ < y1_) y1_ = y_;
        if (x_ > x2_) x2_ = x_;
        if (y_ > y2_) y2_ = y_;
        xs.push(x_);
        ys.push(y_);
      }
    }
    var dx = x2_ - x1_, dy = y2_ - y1_;
    if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;
    function insert(n, d, x, y, x1, y1, x2, y2) {
      if (isNaN(x) || isNaN(y)) return;
      if (n.leaf) {
        var nx = n.x, ny = n.y;
        if (nx != null) {
          if (abs(nx - x) + abs(ny - y) < .01) {
            insertChild(n, d, x, y, x1, y1, x2, y2);
          } else {
            var nPoint = n.point;
            n.x = n.y = n.point = null;
            insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);
            insertChild(n, d, x, y, x1, y1, x2, y2);
          }
        } else {
          n.x = x, n.y = y, n.point = d;
        }
      } else {
        insertChild(n, d, x, y, x1, y1, x2, y2);
      }
    }
    function insertChild(n, d, x, y, x1, y1, x2, y2) {
      var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, right = x >= sx, bottom = y >= sy, i = (bottom << 1) + right;
      n.leaf = false;
      n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());
      if (right) x1 = sx; else x2 = sx;
      if (bottom) y1 = sy; else y2 = sy;
      insert(n, d, x, y, x1, y1, x2, y2);
    }
    var root = d3_geom_quadtreeNode();
    root.add = function(d) {
      insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);
    };
    root.visit = function(f) {
      d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);
    };
    i = -1;
    if (x1 == null) {
      while (++i < n) {
        insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);
      }
      --i;
    } else data.forEach(root.add);
    xs = ys = data = d = null;
    return root;
  }
  quadtree.x = function(_) {
    return arguments.length ? (x = _, quadtree) : x;
  };
  quadtree.y = function(_) {
    return arguments.length ? (y = _, quadtree) : y;
  };
  quadtree.extent = function(_) {
    if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ];
    if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], 
    y2 = +_[1][1];
    return quadtree;
  };
  quadtree.size = function(_) {
    if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ];
    if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];
    return quadtree;
  };
  return quadtree;
};

function d3_geom_quadtreeCompatX(d) {
  return d.x;
}

function d3_geom_quadtreeCompatY(d) {
  return d.y;
}

function d3_geom_quadtreeNode() {
  return {
    leaf: true,
    nodes: [],
    point: null,
    x: null,
    y: null
  };
}

function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {
  if (!f(node, x1, y1, x2, y2)) {
    var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;
    if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);
    if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);
    if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);
    if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);
  }
}

d3.layout = {};

d3.layout.force = function() {
  var force = {}, event = d3.dispatch("start", "tick", "end"), size = [ 1, 1 ], drag, alpha, friction = .9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, chargeDistance2 = d3_layout_forceChargeDistance2, gravity = .1, theta2 = .64, nodes = [], links = [], distances, strengths, charges;
  function repulse(node) {
    return function(quad, x1, _, x2) {
      if (quad.point !== node) {
        var dx = quad.cx - node.x, dy = quad.cy - node.y, dw = x2 - x1, dn = dx * dx + dy * dy;
        if (dw * dw / theta2 < dn) {
          if (dn < chargeDistance2) {
            var k = quad.charge / dn;
            node.px -= dx * k;
            node.py -= dy * k;
          }
          return true;
        }
        if (quad.point && dn && dn < chargeDistance2) {
          var k = quad.pointCharge / dn;
          node.px -= dx * k;
          node.py -= dy * k;
        }
      }
      return !quad.charge;
    };
  }
  force.tick = function() {
    if ((alpha *= .99) < .005) {
      event.end({
        type: "end",
        alpha: alpha = 0
      });
      return true;
    }
    var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y;
    for (i = 0; i < m; ++i) {
      o = links[i];
      s = o.source;
      t = o.target;
      x = t.x - s.x;
      y = t.y - s.y;
      if (l = x * x + y * y) {
        l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
        x *= l;
        y *= l;
        t.x -= x * (k = s.weight / (t.weight + s.weight));
        t.y -= y * k;
        s.x += x * (k = 1 - k);
        s.y += y * k;
      }
    }
    if (k = alpha * gravity) {
      x = size[0] / 2;
      y = size[1] / 2;
      i = -1;
      if (k) while (++i < n) {
        o = nodes[i];
        o.x += (x - o.x) * k;
        o.y += (y - o.y) * k;
      }
    }
    if (charge) {
      d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);
      i = -1;
      while (++i < n) {
        if (!(o = nodes[i]).fixed) {
          q.visit(repulse(o));
        }
      }
    }
    i = -1;
    while (++i < n) {
      o = nodes[i];
      if (o.fixed) {
        o.x = o.px;
        o.y = o.py;
      } else {
        o.x -= (o.px - (o.px = o.x)) * friction;
        o.y -= (o.py - (o.py = o.y)) * friction;
      }
    }
    event.tick({
      type: "tick",
      alpha: alpha
    });
  };
  force.nodes = function(x) {
    if (!arguments.length) return nodes;
    nodes = x;
    return force;
  };
  force.links = function(x) {
    if (!arguments.length) return links;
    links = x;
    return force;
  };
  force.size = function(x) {
    if (!arguments.length) return size;
    size = x;
    return force;
  };
  force.linkDistance = function(x) {
    if (!arguments.length) return linkDistance;
    linkDistance = typeof x === "function" ? x : +x;
    return force;
  };
  force.distance = force.linkDistance;
  force.linkStrength = function(x) {
    if (!arguments.length) return linkStrength;
    linkStrength = typeof x === "function" ? x : +x;
    return force;
  };
  force.friction = function(x) {
    if (!arguments.length) return friction;
    friction = +x;
    return force;
  };
  force.charge = function(x) {
    if (!arguments.length) return charge;
    charge = typeof x === "function" ? x : +x;
    return force;
  };
  force.chargeDistance = function(x) {
    if (!arguments.length) return Math.sqrt(chargeDistance2);
    chargeDistance2 = x * x;
    return force;
  };
  force.gravity = function(x) {
    if (!arguments.length) return gravity;
    gravity = +x;
    return force;
  };
  force.theta = function(x) {
    if (!arguments.length) return Math.sqrt(theta2);
    theta2 = x * x;
    return force;
  };
  force.alpha = function(x) {
    if (!arguments.length) return alpha;
    x = +x;
    if (alpha) {
      if (x > 0) alpha = x; else alpha = 0;
    } else if (x > 0) {
      event.start({
        type: "start",
        alpha: alpha = x
      });
      d3.timer(force.tick);
    }
    return force;
  };
  force.start = function() {
    var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;
    for (i = 0; i < n; ++i) {
      (o = nodes[i]).index = i;
      o.weight = 0;
    }
    for (i = 0; i < m; ++i) {
      o = links[i];
      if (typeof o.source == "number") o.source = nodes[o.source];
      if (typeof o.target == "number") o.target = nodes[o.target];
      ++o.source.weight;
      ++o.target.weight;
    }
    for (i = 0; i < n; ++i) {
      o = nodes[i];
      if (isNaN(o.x)) o.x = position("x", w);
      if (isNaN(o.y)) o.y = position("y", h);
      if (isNaN(o.px)) o.px = o.x;
      if (isNaN(o.py)) o.py = o.y;
    }
    distances = [];
    if (typeof linkDistance === "function") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance;
    strengths = [];
    if (typeof linkStrength === "function") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength;
    charges = [];
    if (typeof charge === "function") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge;
    function position(dimension, size) {
      if (!neighbors) {
        neighbors = new Array(n);
        for (j = 0; j < n; ++j) {
          neighbors[j] = [];
        }
        for (j = 0; j < m; ++j) {
          var o = links[j];
          neighbors[o.source.index].push(o.target);
          neighbors[o.target.index].push(o.source);
        }
      }
      var candidates = neighbors[i], j = -1, m = candidates.length, x;
      while (++j < m) if (!isNaN(x = candidates[j][dimension])) return x;
      return Math.random() * size;
    }
    return force.resume();
  };
  force.resume = function() {
    return force.alpha(.1);
  };
  force.stop = function() {
    return force.alpha(0);
  };
  
  return d3.rebind(force, event, "on");
};



function d3_layout_forceMouseover(d) {
  d.fixed |= 4;
  d.px = d.x, d.py = d.y;
}

function d3_layout_forceMouseout(d) {
  d.fixed &= ~4;
}

function d3_layout_forceAccumulate(quad, alpha, charges) {
  var cx = 0, cy = 0;
  quad.charge = 0;
  if (!quad.leaf) {
    var nodes = quad.nodes, n = nodes.length, i = -1, c;
    while (++i < n) {
      c = nodes[i];
      if (c == null) continue;
      d3_layout_forceAccumulate(c, alpha, charges);
      quad.charge += c.charge;
      cx += c.charge * c.cx;
      cy += c.charge * c.cy;
    }
  }
  if (quad.point) {
    if (!quad.leaf) {
      quad.point.x += Math.random() - .5;
      quad.point.y += Math.random() - .5;
    }
    var k = alpha * charges[quad.point.index];
    quad.charge += quad.pointCharge = k;
    cx += k * quad.point.x;
    cy += k * quad.point.y;
  }
  quad.cx = cx / quad.charge;
  quad.cy = cy / quad.charge;
}

var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1, d3_layout_forceChargeDistance2 = Infinity;