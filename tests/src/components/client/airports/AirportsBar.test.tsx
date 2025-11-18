import { render, screen } from "@testing-library/react";
import { AirportsBar } from "@/components/client/airports/AirportsBar";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    forward: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(""),
  }),
   usePathname: () => "/airports",
}));

describe("AirportsBar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the search input", () => {
    render(<AirportsBar />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("renders the search button", () => {
    render(<AirportsBar />);

    const searchButton = screen.getByRole("button", { name: /buscar/i });
    expect(searchButton).toBeInTheDocument();
  });
});
