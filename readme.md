# LaClasse.js


## What is it ?

This a simple class based on the simple javascript inheritance and enhanced with a new approach inspired by Php class object model.
Create your own class with an easier synthax without care about the using of ```prototype```.
Make available private , public and static variables or methods for each class inheriting from ```LaClasse``` base class.


## How it works ?

### Manual installation

Download and extract the latest zip package from this repository and copy the files laclasse.js or laclasse.min.js into your project. Then include the file into your ```<head>```. 

### Implements it

```LaClasse``` is an abstract class that can not be instantiated. But it provides an ```extend()``` method that allow you to extend it.

#### Class definition

```
LaClasse.extend(function Animal(){});
var myAnimal = new Animal();
```

Define a function that extends the ```LaClasse``` base class. The function name is the class name and is accessible via a ```className``` property on each instance.

By default, the ```LaClasse``` base class attaches automatically the new class to the window object. To get a class definition into a private scope, use the returned class of the extend method or the first parameter of the script call (see ```LaClasse``` enhancement at the end of this file).

```
var Animal2 = LaClasse.extend(function Animal(){});
var myAnimal = new Animal2();
```
The ```myAnimal.className``` will still be "Animal"

Some methods are already available inherited from the ```LaClasse``` base class.

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

All declared properties with ```this.property``` is a public variable specific to an instance.

All declared properties with ```this.static.property``` is a static variable shared by all instances of the same class.

All declared variables with ```var``` is a private variable specific to an instance.

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

With ```LaClasse```, all methods can be directly declared with ```this.method = function(){}```. Don't care about ```prototype``` cause all methods become a function of ```prototype```.

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

To pass some parameters to the constructor, you need to use the ```this.construct()``` method

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

#### Class inheritance

Classes can inherit from each others using the ```extend()``` base class method.
Children classes retrieve parent methods and parent properties unless they have been overriden in the child class. In this case, for methods, it is possible to call the parent method with ```this.parent()```

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

The ```LaClasse``` base class can be enhanced by modifying script call parameters.
```
/**
 * end of the script
 */
 })(window,'LaClasse',{});
//     1.       2.     3.
``` 

1. The first parameter is the scope parameter, it can be changed by any other object. Default is ```window```
2. The second parameter is the name of the base class. "LaClasse" can be changed to prevent names conflicts.
3. The third parameter allows to add some others methods that can be found in each ```prototype``` of inherited class.

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




