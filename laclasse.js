/* 
 * LaClasse.js for ES 5.1+
 * @author Aurélien Lheureux
 * @see on http://ejohn.org/blog/simple-javascript-inheritance/
 * @licence MIT Licensed
 */
(function(scope,baseClassName,baseMethods){

	'use strict';

	var findClassName = function(func){ return func.name || func.toString().match(/function\s*(\w*)\s*\(/)[1] || null }
  var reg = /\bthis\.parent\b/;

	/**
	 * Main function to be used with a child class
	 */
	var extend = function(_class){
		
		if('function' !== typeof _class)
			throw 'Type "function" waited for extend';
		
    /**
     * Find a class name
     */
    var function_name = findClassName(_class) || "anonymous";
    
    /**
     * Prevent static vars adding an empty object or existing object for static
     */
    _class.prototype.static = this.prototype.static || {};

    /**
     * Build the new prototype
     */
    var proto = _class;
    var props = new (this.className === baseClassName ? function(){} : this)();
    var vars = {};

    function traverse(props){
    
      if("function" === typeof props.__parent__)
        props = traverse(new props.__parent__);
      
      for(var name in props){
        if(!props.hasOwnProperty(name) 
            || "function" === typeof props[name])
        {
          proto[name] = proto.__parent__ 
          && typeof proto.__parent__[name] == "function" 
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
    proto.__parent__ = this.className === baseClassName ? null : this.prototype;

    //now store the last datas
    traverse(new _class());
  
    
    //create a constructor
    var newclass = 'function' ===  typeof proto.construct 
    ? function(){
        for(var name in vars) this[name] = vars[name]; 
        proto.construct.apply(this,arguments); 
    }
    : function (){
        for(var name in vars) this[name] = vars[name];
    };

    
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
      return clone;
    };

    //enriched the proto with new functions and properties from user
    baseMethods = "object" === typeof LaClasse.baseMethods
    ? LaClasse.baseMethods 
      : "object" === typeof baseMethods
      ? baseMethods
    : {};
    for(var i in baseMethods){
      if(baseMethods.hasOwnProperty(i))
        proto[i] = baseMethods[i];
    }

    proto.constructor = _class;
    newclass.prototype = proto;    
    newclass.className = proto.className;
    newclass.extend = this.extend;
    
		return scope[newclass.className] = newclass;
	}

  /**
   * LaClasse BaseClass
   */
  function LaClasse(){
      if(baseClassName === this.className)
        throw baseClassName+' can not be instantiate. Use "'+baseClassName+'.extend()" instead.';
  };
  LaClasse.className = baseClassName;
  LaClasse.constructor = LaClasse;
	LaClasse.extend = extend;
	return window[baseClassName] = LaClasse;

})(window,'LaClasse',{});



// //events and listener
// var addListener = function(type, listener){
 //        //console.log("ADDLISTENER",this)
 //        if (typeof this.listeners[type] == "undefined"){
 //            this.listeners[type] = [];
 //        }
 //        this.listeners[type].push(listener);
 //    }

 //    var fireEvent =function(event){
 //        if (typeof event == "string")
 //            event = { type: event };
 //        if (!event.target)
 //            event.target = this;
 //        if (!event.type)  //falsy
 //            throw "Event object require 'type' property.";

 //        if (this.listeners[event.type] instanceof Array){
 //            var listeners = this.listeners[event.type];
 //            for (var i=0, len=listeners.length; i < len; i++){
 //                listeners[i].call(this, event);
 //            }
 //        }
 //    }

  //a prototype function