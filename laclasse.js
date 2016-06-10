/* 
 * LaClasse.js for ES 5.1+
 * @author Aurélien Lheureux
 * @see http://ejohn.org/blog/simple-javascript-inheritance/
 * @see http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/
 * @licence MIT Licensed
 */

//UMD approach
(function (root, factory) {
  
  if(typeof define === "function" && define.amd) {
    //AMD
    define(factory);
  } else if(typeof module === "object" && module.exports) {
    //CommonsJS
    module.exports = factory(root);
  } else {
    //Browser globals
    var module = factory(root);
    root[module.className] = module;
  }

}) (typeof window !== "undefined" ? window : this, function(root){

  'use strict';

  var _config = {
    baseMethods:{},
  }

  var isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document);
  var findClassName = function(func){ return func.name || func.toString().match(/^function\s+(\w+)\s*\(/)[1] || null }
  var findArgs = function(func){var m = func.toString().match(/^function(?:\s+\w+\s*)?\((.+)\)/); return m ? m[1].split(',').map(function(s){ return s.trim()}) : null; }
  var fetchArgsFromRoot = function(args){
    var resolved = {};
    for(var i in args)
      if(undefined != root[args[i]])
        resolved[args[i]] = root[args[i]];
    return resolved;
  }
  var reg = /\bthis\.parent\b/;
  
  var resolveDependencies = function(proto, callback){
      
    var args = findArgs(proto);
    var deps = [];

    for(var i in args){
        deps.push(root[args[i]]);
    }

    if('function' === typeof callback){
      //pass deps object to dept array
      deps = Object.keys(deps).map(function(k) { return deps[k] });
      callback(deps);
    }
  }

  /**
   * LaClasse BaseClass
   */
  function LaClasse(){
    throw new Error('LaClasse is not a constructor. Use LaClasse.define() instead.');
  };

  LaClasse.className = 'LaClasse';
  LaClasse.constructor = LaClasse;

  /**
   * Main function to be used with a child class
   */
  var extend = function(namespace,proto){

    var args = Array.prototype.slice.call(arguments);

    if(1 === args.length){
      namespace = null;
      proto = args[0];
    }else{
      namespace = args[0];
      proto = args[1];
    }

    //Define a namespace
    var space = root;
    if(null !== namespace)
      var namespaces = namespace.split('.');
      for(var i in namespaces){
        if(space[namespaces[i]] === undefined){
          space[namespaces[i]] = {};
          space = space[namespaces[i]];
        }
      }

    if('function' !== typeof proto)
      throw new Error('Type function expected for extend');

    /**
     * Find a class name
     */
    var function_name = findClassName(proto) || 'anonymous';
    
    /**
     * Prevent static vars adding an empty object or existing object for static
     */
    proto.prototype.static = this.prototype.static || {};

    /**
     * Build the new prototype
     */
    var props = new (this.className === LaClasse.className ? function(){} : this)();
    var vars = {};

    function traverse(props){
    
      if('function' === typeof props.__parent__)
        props = traverse(new props.__parent__);
      
      for(var name in props){
        if(!props.hasOwnProperty(name) 
            || 'function' === typeof props[name])
        {
          proto[name] = proto.__parent__ 
          && 'function' === typeof proto.__parent__[name] 
          && reg.test(props[name].toString())
          ? (function(name, fn){

                return function() {
                  var save = this.parent;

                  // Add a new .parent() method that is the same method but on the super-class
                  this.parent = proto.__parent__[name];

                  // The method only need to be bound temporarily, so we
                  // remove it when we're done executing
                  var ret = fn.apply(this, arguments);        
                  this.parent = save;
                  return ret;
                };
              })(name, props[name])
          : props[name];
        }else{
            vars[name] = props[name];
        }
      }
    }
    
    //store parents datas
    traverse(props);
    
    proto.className = function_name;
    proto.__parent__ = this.className === LaClasse.className ? null : this.prototype;

    resolveDependencies(proto,function(deps){
      //once dependencies are resolved
      //we can instantiate the proto to get some datas
      //and store them inside the proto
      deps = [null].concat(deps);
      var instance = new (Function.prototype.bind.apply(proto, deps));
      traverse( instance );
    });

    //define a constructor
    var _class = function(){
        
        for(var name in vars) 
          this[name] = vars[name]; 

        if('function' ===  typeof proto.construct)
          proto.construct.apply(this,arguments); 

        this.fire('defined');
    }
   
    
    proto.instanceOf = function(className){
      var elem = this;
      while(elem){
        if(elem.className === className)  return true;
        else elem = this.__parent__;
      }
      return false;
    };

    proto.clone = function(){
      var clone = new this.constructor();
      for (var attr in this) 
          if (this.hasOwnProperty(attr)) clone[attr] = this[attr];
      clone.__proto__ = this.__proto__;

      this.fire('cloned');

      return clone;
    };

    proto.hasProperty = function(prop){
      return this.hasOwnProperty(prop);
    }

    proto.hasStaticProperty = function(prop){
      return this.static[prop] !== undefined;
    }

    proto.hasMethod = function(method){
      return this[method] !== undefined && 'function' === typeof this[method];
    }


    proto.on = function(type,handler,data,once){

      this.events = this.events || [];
      var once = once != undefined ? once : false;

      type = type.split(/\s+/);
      for(var i in type){
        if('undefined' === typeof this.events[type[i]])
           this.events[type[i]] = [];
        if('function' === typeof handler){
          this.events[type[i]].push({handler:handler,data:data || {},once:once});
        }
      }
    };

    proto.once = function(type,handler,data){
        this.on(type,handler,data,true);
    }

    proto.fire = function(type,extra){

      type = type.split(/\s+/);
     
      for(var i in type){

        var event = {
          type: type[i],
          target:this,
          timestamp:new Date().getTime(),
        }
        var extra = ('object' === typeof extra) ? extra : {};
        for(var j in extra){
          if(undefined === event[j])
            event[j] = extra[j];
        }

        if(this.events && this.events[event.type] instanceof Array){
          var length = this.events[event.type].length;
          for(var k=0; k < length; k++){
            var cur = this.events[event.type][k];
            
            if('object' === typeof cur.data)
              event.data = cur.data;
            cur.handler.call(this,event);
            
            if(cur.once)
              delete this.events[event.type][k];
          }
        }

      }

    };

    //enriched the proto with new functions and properties from user
    var baseMethods = 'object' === typeof _config.baseMethods ? _config.baseMethods : {};
    for(var i in baseMethods){
      if(baseMethods.hasOwnProperty(i))
        proto[i] = baseMethods[i];
    }

    _class.prototype = proto;    
    _class.prototype.constructor = proto;
    _class.className = proto.className;
    _class.extend = extend;
    
    if('object' === typeof space)
      space[_class.className] = _class;
    
    return _class;
  }

  /**
   * Set a config to LaClasse
   */
  var config = function(params){
    for(var i in params)
      if(undefined !== _config[i])
        _config[i] = params[i];
  }

  LaClasse.define = extend;
  LaClasse.config = config;
  return LaClasse;

});

