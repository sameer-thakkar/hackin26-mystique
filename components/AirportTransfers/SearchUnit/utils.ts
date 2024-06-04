export function animateSwapLocationFields(
  firstLocationFieldRef: React.RefObject<HTMLDivElement>,
  secondLocationFieldRef: React.RefObject<HTMLDivElement>
): void {
  const locationFields = [
    firstLocationFieldRef.current,
    secondLocationFieldRef.current,
  ].filter((field) => field !== null) as HTMLElement[];

  if (locationFields.length < 2) {
    return;
  }

  const [locationFieldA, locationFieldB] = locationFields;

  // Calculate the distances for the transformation
  const deltaX: number =
    locationFieldB.getBoundingClientRect().left -
    locationFieldA.getBoundingClientRect().left;
  const deltaY: number =
    locationFieldB.getBoundingClientRect().top -
    locationFieldA.getBoundingClientRect().top;

  const clearTransforms = (): void => {
    [locationFieldA, locationFieldB].forEach((field) => {
      field.style.transform = '';
      field.style.transition = '';
      field.removeEventListener('transitionend', clearTransforms);
    });

    swapOrder(locationFieldA, locationFieldB);
  };

  // Attach event listeners before starting the animation
  [locationFieldA, locationFieldB].forEach((field) => {
    // Ensure we don't attach duplicate listeners
    field.removeEventListener('transitionend', clearTransforms);
    field.addEventListener('transitionend', clearTransforms);

    field.style.transition = 'transform 0.35s cubic-bezier(0.7, 0, 0.3, 1)';
  });

  // Start the animations
  locationFieldA.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  locationFieldB.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;
}

export function swapOrder(element1: HTMLElement, element2: HTMLElement) {
  const style1 = window.getComputedStyle(element1);
  const style2 = window.getComputedStyle(element2);

  const order1 = style1.order;
  const order2 = style2.order;

  element1.style.order = order2;
  element2.style.order = order1;
}
