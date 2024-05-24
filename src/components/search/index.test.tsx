import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Search from "../search";

describe("Search Component", () => {
  it("renders input field and search button", () => {
    const { getByPlaceholderText, getByRole } = render(<Search search="" setSearch={() => {}} handleSearch={() => {}} />);
    const inputField = getByPlaceholderText("Enter City Name");
    const searchButton = getByRole("button", { name: "Search" });

    expect(inputField).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  it("updates search value when typing", () => {
    const setSearchMock = jest.fn();
    const { getByPlaceholderText } = render(<Search search="" setSearch={setSearchMock} handleSearch={() => {}} />);
    const inputField = getByPlaceholderText("Enter City Name") as HTMLInputElement;

    fireEvent.change(inputField, { target: { value: "New York" } });

    expect(setSearchMock).toHaveBeenCalledWith("New York");
  });

  it("calls handleSearch function when search button is clicked", () => {
    const handleSearchMock = jest.fn();
    const { getByRole } = render(<Search search="" setSearch={() => {}} handleSearch={handleSearchMock} />);
    const searchButton = getByRole("button", { name: "Search" });

    fireEvent.click(searchButton);

    expect(handleSearchMock).toHaveBeenCalled();
  });
});
