export async function safeAwait<T, E = Error>(
  promise: Promise<T>
): Promise<[null, T] | [E, null]> {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    if (error instanceof Error) {
      return [error as E, null];
    } else if (typeof error === 'string') {
      return [new Error(error) as E, null];
    } else if (
      error !== null &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return [new Error(error.message) as E, null];
    } else {
      return [new Error('Unknown error') as E, null];
    }
  }
}

// Example usage

// async function mightFail() {
//   const random = Math.random();
//   if (random > 0.5) {
//     throw new Error('value too high');
//   }
//   return "success";
// }

// async function main() {
//   const [error, result] = await safeAwait(mightFail());
//   console.log(error, result);
// }

// main();
