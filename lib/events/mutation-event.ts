const MUTATION_EVENT = "app-mutation";

export function emitMutationEvent() {
  window.dispatchEvent(new Event(MUTATION_EVENT));
}

export function subscribeToMutations(callback: () => void) {
  window.addEventListener(MUTATION_EVENT, callback);

  return () => {
    window.removeEventListener(MUTATION_EVENT, callback);
  };
}
