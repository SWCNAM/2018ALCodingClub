//
//Define an array of integers
//
let intArray = [5, 10, 15, 20];

//
//Define an array of strings
//
let stringArray = ["car", "truck", "bus", "plane", "boat"];

//
//Print the first item in an array (zero-based index)
//
print(intArray[0]);
print(stringArray[0]);

//
//Print the 2nd, 3rd, 4th item in an array
//
print(intArray[1]);
print(intArray[2]);
print(intArray[3]);
print(intArray[4]);

//
//Print the length of both int and string arrays
//
print(intArray.length);
print(stringArray.length);
divider();

//
//Write a basic for loop and print out the index
//
for(let i = 0; i < 10; i++) {
  print(i);
}

divider();

//
//Print the elements in an array
//
for(let i = 0; i < intArray.length; i++) {
  print(intArray[i]);
}

divider();

for(let i = 0; i < stringArray.length; i++) {
  print(stringArray[i]);
}