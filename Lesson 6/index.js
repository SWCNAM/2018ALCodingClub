//
//Number
//

//Functions

//Functions are a way to store a set of operations that we can reuse later
//Define a function using the function key word
function myFunction()
{
	print("Hello from a function");
}

//Note that while we have created our function, we need to "call" our function in order to actually see our message

//To call a function, type the function name followed by parentheses
myFunction();

//We can also use functions to compute and "return" a value for us
function addTwoPlusTwo()
{
	//Assign a variable to the value of 2 + 2  
	var x = 2 + 2;
	
	//The return statement is used to return a value to the code that calls the function
	//In this case our function returns 4, the value of 2+2
	return x;
}

//By using the = operator, we can assign the value returned by the function to a new variable
var result1 = addTwoPlusTwo();
print(result1)


//We can also take in "parameters", which are values that we want our function to use
//This is very powerful in situations where we don't know what the valu we are using will be (for example, user input)
function addTwo(num)
{
	//We can now use the number we have passed to our function as a regular variable
	var x = num + 2;
	
	//Return the value of the new number
	return x;
}

var result2 = addTwo(6);

print(result2);

//You can also pass several parameters 
function times(num1, num2)
{
	//Here we can multiple both parameters and return the results
	var x = num1 * num2;

	return x;
}

var result3 = times(5,2);
print(result3);

//We can also pass in strings
function sayHello(userName)
{
    var greating = "Hello, " + userName;

    return greating
}

var greatingResult = sayHello("Ryan")
print(greatingResult)
