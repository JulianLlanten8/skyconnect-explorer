import { render, screen } from "@testing-library/react";
import { AirportCard } from "@/components/client/airport/AirportCard";
import type { Airport } from "@/types/airport";
import "@testing-library/jest-dom";

describe("AirportCard Component", () => {
  const mockAirport: Airport = {
    id: "BOG",
    airport_name: "El Nuevo Dorado International",
    iata_code: "BOG",
    icao_code: "SKBO",
    city_iata_code: "Bogotá",
    country_name: "Colombia",
    latitude: 4.7016,
    longitude: -74.1469,
    timezone: "America/Bogota",
    gmt: "-5",
    geoname_id: "3688689",
    country_iso2: "CO",
    phone_number: "+57(0)91 425 1000",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders airport information correctly", () => {
    render(<AirportCard airport={mockAirport} />);

    // Check if airport name is rendered
    expect(
      screen.getByText("El Nuevo Dorado International"),
    ).toBeInTheDocument();

    // Check if city and country are rendered
    expect(screen.getByText("Bogotá, Colombia")).toBeInTheDocument();

    // Check if IATA code is rendered
    expect(screen.getByText("BOG")).toBeInTheDocument();
  });

  it("renders a link to airport details page", () => {
    render(<AirportCard airport={mockAirport} />);

    // Find the link by its href attribute
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/airport/BOG");
  });

  it("navigates to correct URL when clicked", () => {
    render(<AirportCard airport={mockAirport} />);

    const link = screen.getByRole("link");

    // Verify the link has the correct href
    expect(link).toHaveAttribute("href", "/airport/BOG");
  });

  it("renders with ICAO code when IATA code is not available", () => {
    const airportWithoutIATA = {
      ...mockAirport,
      iata_code: null as any,
    };

    render(<AirportCard airport={airportWithoutIATA} />);

    // Should use ICAO code for the link
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/airport/SKBO");
  });
});
