# @bytekit/throttle

A simple, type-safe, and efficient throttling utility for managing execution rate limits in JavaScript/TypeScript.

## Features

- ✅ Supports both void and promise-returning tasks
- ⏳ Enforces throttling using token-bucket-style logic
- 🔥 Simple, performant, and dependency-free
- 🧪 100% test and mutation coverage
- 💥 Throws when queue is full

## Installation

```bash
npm install @bytekit/throttle
```

or

```bash
yarn add @bytekit/throttle
```

## Usage

### ThrottledQueue

```ts
import {ThrottledQueue} from "@bytekit/throttle";

const queue = new ThrottledQueue(5, 1000); // 5 tasks per 1000ms

queue.enqueue(() => {
  console.log("Task executed");
});
```

### ThrottledPromiseQueue

```ts
import {ThrottledPromiseQueue} from "@bytekit/throttle";

const queue = new ThrottledPromiseQueue(2, 1000);

const result = await queue.submit(async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return "Hello, throttling!";
});

console.log(result); // "Hello, throttling!"
```

## License

ISC
