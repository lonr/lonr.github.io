// https://en.cppreference.com/w/cpp/algorithm/lower_bound
export function lowerBound<T>(
  array: T[],
  value: T,
  compareFn: (a: T, b: T) => number = (a, b) => (a < b ? -1 : a === b ? 0 : 1),
  start: number = 0,
  end: number = array.length,
): number {
  while (start < end) {
    const mid = Math.floor(start + (end - start) / 2);
    if (compareFn(value, array[mid]) <= 0) {
      end = mid;
    } else {
      start = mid + 1;
    }
  }
  return end;
}

// https://en.cppreference.com/w/cpp/algorithm/upper_bound
export function upperBound<T>(
  array: T[],
  value: T,
  compareFn: (a: T, b: T) => number = (a, b) => (a < b ? -1 : a === b ? 0 : 1),
  start: number = 0,
  end: number = array.length,
): number {
  while (start < end) {
    const mid = Math.floor(start + (end - start) / 2);
    if (compareFn(value, array[mid]) < 0) {
      end = mid;
    } else {
      start = mid + 1;
    }
  }
  return end;
}
