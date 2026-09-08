/**
 * Canonical seed data for the 3 initial LLD problems.
 * Used by scripts/seed.js. expectedClasses/expectedMethods drive RuleBasedEvaluator checks.
 */
const problems = [
  {
    title: "Parking Lot",
    slug: "parking-lot",
    difficulty: "Medium",
    description:
      "Design a parking lot system for a multi-floor parking garage that supports multiple vehicle types and spot types, handles vehicle entry/exit, allocates spots, generates tickets, and calculates fees.",
    requirements: [
      "Support multiple floors, each with multiple parking spots",
      "Support different spot types (e.g. compact, large, handicapped, motorcycle)",
      "Support different vehicle types (e.g. car, bike, truck)",
      "Handle vehicle entry: allocate an appropriate free spot and issue a ticket",
      "Handle vehicle exit: free the spot and calculate the parking fee",
      "Fee calculation should depend on duration and vehicle/spot type",
      "The system should be extensible to new vehicle types or pricing strategies",
    ],
    constraints: [
      "No need to persist to a real database inside the design (in-memory model is fine)",
      "No UI/hardware integration required (e.g. gate sensors)",
    ],
    expectedConcepts: [
      "single responsibility",
      "strategy pattern",
      "encapsulation",
      "open/closed principle",
    ],
    expectedClasses: ["ParkingLot", "ParkingFloor", "ParkingSpot", "Vehicle", "Ticket"],
    expectedMethods: ["parkVehicle", "exitVehicle", "calculateFee", "allocateSpot"],
  },
  {
    title: "Elevator System",
    slug: "elevator-system",
    difficulty: "Hard",
    description:
      "Design the control system for a bank of elevators in a building. The system must handle external floor requests (hall calls) and internal requests (from inside the elevator cabin), decide which elevator services which request, and manage elevator movement and direction.",
    requirements: [
      "Support multiple elevators operating independently within one building",
      "Handle external floor requests (up/down button pressed on a floor)",
      "Handle internal requests (a passenger selects a destination floor)",
      "Track elevator direction (up, down, idle) and current floor",
      "Implement a request assignment strategy that picks the best elevator for a request",
      "Elevator movement should process requests in a sensible order (e.g. SCAN-like behavior)",
    ],
    constraints: [
      "No need to simulate real-time physics or exact timing",
      "Assume a single building with a fixed number of floors",
    ],
    expectedConcepts: [
      "state pattern",
      "strategy pattern",
      "encapsulation",
      "separation of concerns",
    ],
    expectedClasses: ["Elevator", "ElevatorController", "Floor", "Request", "ElevatorSystem"],
    expectedMethods: ["requestElevator", "moveToFloor", "assignRequest", "addInternalRequest"],
  },
  {
    title: "Vending Machine",
    slug: "vending-machine",
    difficulty: "Easy",
    description:
      "Design a vending machine that manages a set of products with inventory counts, accepts payment, dispenses the selected product, calculates and returns change, and supports cancelling a transaction.",
    requirements: [
      "Maintain a catalog of products with price and available quantity",
      "Allow a user to select a product",
      "Accept payment (coins/notes) and track the amount inserted",
      "Calculate and dispense change if the amount inserted exceeds the price",
      "Update inventory after a successful purchase",
      "Handle out-of-stock products gracefully",
      "Support cancelling/refunding an in-progress transaction",
    ],
    constraints: [
      "No need to model physical coin mechanics precisely",
      "Single vending machine instance is sufficient (no networked fleet management)",
    ],
    expectedConcepts: [
      "state pattern",
      "single responsibility",
      "encapsulation",
    ],
    expectedClasses: ["VendingMachine", "Product", "Inventory", "Payment"],
    expectedMethods: ["selectProduct", "insertPayment", "dispenseProduct", "calculateChange", "cancelTransaction"],
  },
];

module.exports = problems;
