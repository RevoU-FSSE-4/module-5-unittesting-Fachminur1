// useCounter.test.js
import { renderHook, act } from "@testing-library/react-hooks";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  test("increments count correctly", () => {
    // Render the hook
    const { result } = renderHook(() => useCounter());

    // Ensure initial count is 0
    expect(result.current.count).toBe(0);

    // Increment the count
    act(() => {
      result.current.increment();
    });

    // Verify that count is incremented to 1
    expect(result.current.count).toBe(1);
  });

  test("decrements count correctly", () => {
    // Render the hook
    const { result } = renderHook(() => useCounter());

    // Ensure initial count is 0
    expect(result.current.count).toBe(0);

    // Decrement the count
    act(() => {
      result.current.decrement();
    });

    // Verify that count is decremented to -1
    expect(result.current.count).toBe(-1);
  });
});
