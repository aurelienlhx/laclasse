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
  
  /**
   * LaClasse BaseClass
   */
  function LaClasse(){
    throw new Error('LaClasse is not a constructor. Use LaClasse.create() instead.');
  };
  LaClasse.className = 'LaClasse';
  LaClasse.constructor = LaClasse;
  LaClasse.baseMethods = {}

  var findClassName = function(func){ return func.name || func.toString().match(/function\s*(\w*)\s*\(/)[1] || null }
  var reg = /\bthis\.parent\b/;

  /**
   * Main function to be used with a child class
   */
  var extend = function(_class){
    
    if('function' !== typeof _class)
      throw new Error('Type function expected for extend');
    
    /**
     * Find a class name
     */
    var function_name = findClassName(_class) || 'anonymous';
    
    /**
     * Prevent static vars adding an empty object or existing object for static
     */
    _class.prototype.static = this.prototype.static || {};

    /**
     * Build the new prototype
     */
    var proto = _class;
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

    //now store the last datas
    traverse(new _class());
  
    
    //create a constructor
    var newclass = function(){
        for(var name in vars) 
        	this[name] = vars[name]; 

        if('function' ===  typeof proto.construct)
          proto.construct.apply(this,arguments); 

      	this.fire('created');
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

    var listeners = [];

    proto.listen = function(type,handler,data){
    	if('undefined' === typeof listeners[type])
    		listeners[type] = [];
    	if('function' === typeof handler){
    		listeners[type].push({handler:handler,data:data});
    	}
    };

    proto.fire = function(type,extra){
    	var event = {
    		type:type,
    		target:this,
    		timestamp:new Date().getTime(),
    	}
    	var extra = ('object' === typeof extra) ? extra : {};
    	for(var i in extra){
    		if(undefined === event[i])
    			event[i] = extra[i];
    	}

    	if(listeners[event.type] instanceof Array){
    		var length = listeners[event.type].length;
    		for(var i=0; i < length; i++){
    			if('object' === typeof listeners[event.type][i].data)
    				event.data = listeners[event.type][i].data;
    			listeners[event.type][i].handler.call(this,event);
    		}
    	}

    };

    //enriched the proto with new functions and properties from user
    var baseMethods = 'object' === typeof LaClasse.baseMethods ? LaClasse.baseMethods : {};
    for(var i in baseMethods){
      if(baseMethods.hasOwnProperty(i))
        proto[i] = baseMethods[i];
    }

    proto.constructor = _class;
    newclass.prototype = proto;    
    newclass.className = proto.className;
    newclass.extend = extend;
    
    if('object' === typeof root)
    	root[newclass.className] = newclass;
    
    return newclass;
  }

 
  LaClasse.create = extend;  
  return LaClasse;

});

