import axios from "axios";
import { SIWSessionDTO } from "./types";

const serviceURL =
  "https://checkout-demo-backend-stage-qftqcdxvbq-ew.a.run.app";
// checkout-demo-backend-stage service simulates the shops backend
// It holds a mocked cart and passes requests to SIW service.
// Your actual setup should look similar - You shouldn't call SIW directly from FE in order not to expose the private keys.

// Creates a session with a basic cart, calls siw/session.create under the hood
export const createSession = () =>
  axios.post<{ session: SIWSessionDTO; html_snippet: string }>(
    `${serviceURL}/session.create`,
    {
      purchase_country: "SE",
      purchase_currency: "SEK",
      locales: ["en-US"],
    }
  );

// Returns an existing session, calls siw/session.get under the hood
export const getSession = (sessionID: string) =>
  axios.get<{ session: SIWSessionDTO; html_snippet: string }>(
    `${serviceURL}/session`,
    {
      params: {
        id: sessionID,
      },
    }
  );

// Adds a new product the the cart and bumps the price, calls siw/session.update under the hood
export const updateSession = (sessionID: string) =>
  axios.post<{ session: SIWSessionDTO; html_snippet: string }>(
    `${serviceURL}/session.update`,
    {
      id: sessionID,
    }
  );

// Completes a session, calls siw/session.complete under the hood
export const completeSession = (sessionID: string) =>
  axios.post<{ tos_id: string; session: SIWSessionDTO }>(
    `${serviceURL}/session.complete`,
    {
      id: sessionID,
      customer: {
        address: {
          name: "Ingrid Tester",
          address_lines: ["Industrigatan 1"],
          city: "Stockholm",
          postal_code: "11234",
          country: "SE",
        },
        phone: "518221",
        email: "test@ingrid.com",
      },
    }
  );
