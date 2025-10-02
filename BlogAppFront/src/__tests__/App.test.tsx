
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import App from "../App";

// 👇 mock the problematic component so Jest doesn't load import.meta.env
jest.mock("../components/CreateBlog", () => () => <div>CreateBlog Mock</div>);

test("renders app without crashing", () => {
  render(<App />);
  // Check for text that is actually rendered by default
  expect(screen.getByText(/Create Your Account/i)).toBeInTheDocument();
});
