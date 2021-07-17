/**
 * Waits
 * @param ms Time to wait in miliseconds
 * @returns if finished
 */
async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export {sleep}