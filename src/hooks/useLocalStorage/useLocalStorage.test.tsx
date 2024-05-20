import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-test-renderer"; // Import act from 'react-test-renderer' instead of 'react-dom/test-utils'
import useLocalStorage from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear(); // Clear local storage before each test
  });

  test("should initialize with initial value", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  test("should update stored value", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
  });

  test("should persist value in local storage", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(localStorage.getItem("testKey")).toBe(JSON.stringify("updated"));
  });

  test("should retrieve value from local storage", () => {
    localStorage.setItem("testKey", JSON.stringify("stored"));

    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));
    expect(result.current[0]).toBe("stored");
  });
});
