export function calculateScaleFactor(
  mouseX: number,
  itemCenterX: number,
  maxDistance = 450,
  minScale = 1,
  maxScale = 2
): number {
  const distance = Math.abs(mouseX - itemCenterX);
  if (distance >= maxDistance) {
    return minScale;
  }
  return minScale + (maxScale - minScale) * (1 - distance / maxDistance);
}

export function isMouseInsideRect(
  mouseX: number,
  mouseY: number,
  rect: DOMRect
): boolean {
  return (
    mouseX >= rect.left &&
    mouseX <= rect.right &&
    mouseY >= rect.top &&
    mouseY <= rect.bottom
  );
}
