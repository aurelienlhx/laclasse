# LaClasse.js


## What is it ?

This a simple class based on the simple javascript inheritance and enriched with a new approach inspired by Php class.
Create your own class with an easier synthax without care about what is prototype and what is not.
Make availables privates , publics and statics variables or methods for each class inheriting from the ```LaClasse``` base class.


## How it's work ?

### Manual installation

Download and extract the latest zip package from this repository and copy the files laclasse.js or laclasse.min.js into your project. Then include it into your <head>. 

### Implements it

```LaClasse``` is an abstract class which can not be instantiated. But it provides an ```extend()``` method which allow you to extend it.

#### Class definition
```
LaClasse.extend(function Animal(){});
var myAnimal = new Animal();
```

Define a function which extends the ```LaClasse``` base class. The function name is the class name and is accessible via a ```className``` property on each instance.

By default, the ```LaClasse``` base class attach automatically the new class to the window object. For use a class definition into a private scope, use the returned class as below or the first parameter of the script call (see ```LaClasse``` enhancement at the end of this file).

```
var Animal2 = LaClasse.extend(function Animal(){});
var myAnimal = new Animal2();
```
The ```myAnimal.className``` will still be "Animal"

Some methods are already availables inherited from the ```LaClasse``` base class.

- ```instanceOf()``` method
    ```
    myAnimal.instanceOf('Animal'); //return true
    myAnimal.instanceOf('Human'); //return false
    ```

- ```clone()``` method
    ```
    var yourAnimal = myAnimal.clone();
    (myAnimal === yourAnimal) //return false
    ```


#### Class variables and properties

All declared properties with ```this.property``` is a public var specific to an instance.

All declared properties with ```this.static.property``` is a static var shared by all instances of the same class.

All declared variables with ```var``` is a private var specific to an instance.

```
LaClasse.extend(function Animal(){
    this.stomach = []; //public var
    this.static.breed = ['Mammal','Fish']; //public static var
    var has_eaten = false; //private var
});
var myAnimal = new Animal();
myAnimal.stomach; // return []
myAnimal.static.breed; // return ['Mammal','Fish']
myAnimal.has_eaten; //return undefined
```

#### Class methods

With ```LaClasse```, all methods can be directly declared with ```this.method = function(){}```. Don't care about prototype cause all methods become a prototype function.

```
LaClasse.extend(function Animal(){
    this.stomach = []; //public var
    this.static.breed = ['Mammal','Fish']; //public static var
    var has_eaten = false; //private var
    
    this.eat = function(food){
       this.stomach.push(food);
       has_eaten = true;
    }
});
var myAnimal = new Animal();
myAnimal.eat("salad");
```

To pass some parameters class is instanciated, it necessary to use the ```this.construct()``` method

```
LaClasse.extend(function Animal(){
    this.surname = null;
    this.stomach = []; //public var
    this.static.breed = ['Mammal','Fish']; //public static var
    var has_eaten = false; //private var
    
    this.construct = function(surname){
        this.surname = surname;
    }
    
    this.eat = function(food){
       this.stomach.push(food);
       has_eaten = true;
    }
});
var myAnimal = new Animal("Max");
myAnimal.eat("salad");
```

#### Class Inheritance

Classes can inherit from each others in the same way that the ```extend()``` base class method.
Chidlren classes retrieve parent methods and parent properties unless they have been overriden in the child class. In this case, for methods, it is possible to call the parent method with ```this.parent()```

```
Animal.extend(function Mamal(){
    
    this.construct = function(surname){
       this.parent(surname);
    }
});

Mamal.extend(function Dog(){
    
    this.construct = function(surname){
       this.parent(surname);
    }
});
var myDog = new Dog("Max");
myDog.eat("bone");
myDog.stomach //return ["bone"]
```

#### ```LaClasse``` enhancement

The ```LaClasse``` base class can be enriched by modifying script call parameters.
```
/**
 * end of the script
 */
 })(window,'LaClasse',{});
//     1.       2.     3.
``` 

1. First parameter is the scope parameter, it can be changed by any other object. Default is ```window```
2. Second parameter is the name of the base class. "LaClasse" can be changed to prevent names conflicts.
3. Third parameter allow to adding some others methods that can be found in each protoype of inherited class.

    Use the third ```{}``` object parameter in the script call
  
    ```
    /**
    * end of the script
    */
    })(window,'LaClasse',{
        myMethod:function(){}
    });
     myDog.myMethod();
    ``` 
   
    Or the ```LaClasse.baseMethods``` property as an object of functions.
    ```
    LaClasse.baseMethods = {
        myMethod:function(){}
    }
    myDog.myMethod();
   ```

Enjoy ! 




