export function after(delayInSeconds: number, callback: () => void) {
  setTimeout(callback, delayInSeconds * 1000);
}
