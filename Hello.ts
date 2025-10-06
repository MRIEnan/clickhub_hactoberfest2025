// 1. Define an Interface (the blueprint for a data structure)
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  role?: 'admin' | 'editor' | 'guest'; // The '?' makes the property optional
}

// 2. Create an object that adheres to the interface
// TypeScript will throw an error if you miss a required property (like 'name')
const currentUser: User = {
  id: 101,
  name: "Alice",
  email: "alice@example.com",
  isActive: true,
  role: 'admin' // Optional property included
};

// 3. Define a function that strictly accepts the interface type
function greetUser(user: User): string {
  if (user.isActive) {
    return `Hello, ${user.name}! Your ID is ${user.id}.`;
  } else {
    return `${user.name} is currently inactive.`;
  }
}

// 4. Run the function
console.log(greetUser(currentUser)); 

// Output (in JavaScript):
// Hello, Alice! Your ID is 101.
