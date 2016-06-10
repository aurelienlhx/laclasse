# LaClasse.js


## What is it ?

This a simple class based on the simple javascript inheritance and enhanced with a new approach inspired by Php class.
Create your own class with an easier synthax without care about the using of ```prototype```.
Make available private , public and static variables or methods for each class inheriting from ```LaClasse``` base class.


## How it works ?

### Manual installation

Download and extract the latest zip package from this repository and copy the files laclasse.js or laclasse.min.js into your project. Then include the file into your ```<head>```. 

### Implements it

```LaClasse``` is an abstract class that can not be instantiated. But it provides a ```define()``` method that allow you to write your own class.

#### Class definition

```javascript
LaClasse.define(function Animal(){});
var myAnimal = new Animal();
```

Define a function class. The function name is the class name and is accessible via a ```className``` property on each instance.

```LaClasse``` use UMD approach so you can retrieve the object in the window scope. 

```javascript
var Animal = LaClasse.define(function Animal(){});
var myAnimal = new Animal();
```
The ```myAnimal.className``` will still be "Animal"

Some methods are already available when you create a class.

- ```instanceOf()``` method
    ```javascript
    myAnimal.instanceOf('Animal'); //return true
    myAnimal.instanceOf('Human'); //return false
    ```

- ```clone()``` method
    ```javascript
    var yourAnimal = myAnimal.clone();
    (myAnimal === yourAnimal) //return false
    ```

@todo 
 - instance.hasStaticProperty
 - instance.hasProperty
 - instance.hasMethod
 - namespace


#### Class variables and properties

All declared properties with ```this.property``` is a public variable specific to an instance.

All declared properties with ```this.static.property``` is a static variable shared by all instances of the same class.

All declared variables with ```var``` is a private variable specific to an instance.

```javascript
LaClasse.define(function Animal(){

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

With ```LaClasse```, all methods can be directly declared with ```this.method = function(){}```. Don't care about ```prototype``` cause all methods become a function of ```prototype```.

```javascript
LaClasse.define(function Animal(){

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

To pass some parameters to the constructor, you need to use the ```this.construct()``` method

```javascript
LaClasse.define(function Animal(){

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

#### Event listening

@todo
 - instance.on
 - instance.fire
 - instance.once
 - instance.off


#### Class inheritance

Classes can inherit from each others using the ```extend()``` method.
Children classes retrieve parent methods and parent properties unless they have been overriden in the child class. In this case, for methods, it is possible to call the parent method with ```this.parent()```

```javascript
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

@todo
 - LaClasse.config

Enjoy ! 




