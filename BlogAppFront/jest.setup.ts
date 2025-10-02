import "@testing-library/jest-dom";

// Polyfill TextEncoder / TextDecoder for Jest (Node environment)
import { TextEncoder, TextDecoder } from "util";

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder as any;

// Mock Vite's import.meta.env
(global as any).import = {
  meta: {
    env: {
      VITE_API_URL: "http://localhost:5000"
    }
  }
};
