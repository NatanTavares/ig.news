import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Async } from ".";

describe("Async component", () => {
  it("renders correctly", async () => {
    render(<Async />);
    // screen.logTestingPlaygroundURL();

    expect(screen.getByText("Hello World!")).toBeInTheDocument();

    // await waitFor(() => {
    //   return expect(screen.queryByText("Button")).not.toBeInTheDocument();
    // });
    await waitForElementToBeRemoved(screen.queryByText("Button"));

    // expect(await screen.findByText("Paraph")).toBeInTheDocument();
    await waitFor(() => {
      return expect(screen.getByText("Paraph")).toBeInTheDocument();
    });
  });
});
