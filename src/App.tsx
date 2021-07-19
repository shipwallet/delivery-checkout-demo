/* eslint-disable */
import React, { CSSProperties } from "react";
import { Button, Card, Col, Row, Space, Statistic, Typography } from "antd";
import ReactJson from "react-json-view";

import {
  createSession,
  updateSession,
  completeSession,
  getSession,
} from "./api";
import { replaceScriptNode, setupGeneralJSListeners } from "./utils";
import { SIWSessionDTO } from "./types";
import "./styles.css";

const localStorageSessionIDKey = "ingrid-session-id";

export default function App() {
  // This is where the Delivery Checkout will get injected
  const widgetWrapperRef = React.useRef<HTMLDivElement>(null);
  // Used to show the shipping price in 'total cost' section
  const [shippingPrice, setShippingPrice] = React.useState<null | number>(null);
  // Used to show the 'cart value' in 'total cost' for the user,
  const [session, setSession] = React.useState<SIWSessionDTO | null>(null);
  // Used to show the final result after session is completed
  const [sessionResult, setSessionResult] = React.useState<
    SIWSessionDTO["result"] | null
  >(null);
  // Just to lock the buttons while requests are pending
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    initDeliveryCheckout();
  }, []);

  const initDeliveryCheckout = async () => {
    // The user might leave the checkout page and come back again after some time
    // In that case, want to restore the previous session instead of creating a new one
    const existingSessionID = window.localStorage.getItem(
      localStorageSessionIDKey
    );
    if (existingSessionID) {
      setIsLoading(true);
      try {
        const getSessionResponse = await getSession(existingSessionID);
        handleIngridInitialize(
          getSessionResponse.data.session,
          getSessionResponse.data.html_snippet
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      handleCreateSession();
    }
  };

  const handleIngridInitialize = (
    session: SIWSessionDTO,
    HTMLSnippet: string
  ) => {
    setSession(session);
    // Injecting the HTMLSnippet into the dom will setup the app via iframes
    // and secure channels of communication between the iframes and the page
    widgetWrapperRef.current!.innerHTML = HTMLSnippet;

    // Most browsers will not automatically run an injected script
    // We have to clone it, to trick the browser into runing it
    replaceScriptNode(document.getElementById("shipwallet-container"));

    // Whenever the user selects a different shipping option,
    // we want to update the shipping price in the 'total cost' section
    window._sw!((api) => {
      api.on("shipping_option_changed", (option) => {
        setShippingPrice(option.price);
      });
    });

    // The function below will setup listeners that just console log the received values
    // The events include, for example, address changes or courier instructions change
    setupGeneralJSListeners();
  };

  const handleCreateSession = async () => {
    setIsLoading(true);
    try {
      const sessionResponse = await createSession();
      handleIngridInitialize(
        sessionResponse.data.session,
        sessionResponse.data.html_snippet
      );
      // Save session ID in case user leaves the checkout without finishing the purchase
      // We will use it on next checkout init to GET session instead of CREATING a new one
      window.localStorage.setItem(
        localStorageSessionIDKey,
        sessionResponse.data.session.id
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSession = async () => {
    setIsLoading(true);
    try {
      // We need to suspend the widget, so the user cannot change anything while we're updating the session
      window._sw!((api) => api.suspend());

      // We update the session by simply adding another item to the cart and bumping the price
      const updateSessionResponse = await updateSession(session!.id);
      setSession(updateSessionResponse.data.session);

      // Resuming the widget will make it interactive again
      // And cause it to sync with our backend, So that whatever changes you made
      // via `session.update`are visible on the widget now
      window._sw!((api) => api.resume());
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSession = async () => {
    setIsLoading(true);
    try {
      const sessionCompleteResponse = await completeSession(session!.id);
      // If session is completed, we need to clear the sessionID in localstorage
      // As we will need a new session on the next checkout visit
      window.localStorage.removeItem(localStorageSessionIDKey);
      widgetWrapperRef.current!.innerHTML = "";
      // For demo purposes only - we render the result of the session from JSON
      setSessionResult(sessionCompleteResponse.data.session.result);
      setSession(sessionCompleteResponse.data.session);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSession = () => {
    // For demo purposes only
    // There's usually no use case for clearing the session once it's created and not completed
    window.localStorage.removeItem(localStorageSessionIDKey);
    setShippingPrice(null);
    widgetWrapperRef.current!.innerHTML = "";
    setSession(null);
    setSessionResult(null);
  };

  return (
    <div
      style={{
        textAlign: "center",
        width: "100vw",
        maxWidth: "610px",
        margin: "auto",
        paddingBottom: "30px",
        paddingTop: "15px",
      }}
    >
      <h1>Delivery Checkout Demo</h1>
      <Typography.Text>
        As we're a Swedish company, the demo is also set up to work in Sweden.
        <br />
        Here's a postal code from Stockholm that you could use to play around:
        <b> 112 34</b>
      </Typography.Text>
      <Space direction="vertical" align="center" size="middle">
        <Card
          title="Session control"
          style={{ maxWidth: 610, width: "100vw" }}
          headStyle={cardHeaderStyle}
        >
          <Space size="middle" align="start" direction="horizontal">
            <Button
              type="primary"
              onClick={handleCreateSession}
              size="middle"
              loading={isLoading}
              disabled={!!session}
              className="custom-button"
            >
              Create session
            </Button>

            <Button
              size="middle"
              loading={isLoading}
              type="primary"
              onClick={handleUpdateSession}
              disabled={!!!session || session.status === "COMPLETE"}
              className="custom-button"
            >
              Update session
            </Button>

            <Button
              size="middle"
              loading={isLoading}
              type="primary"
              onClick={handleClearSession}
              disabled={!!!session}
              className="custom-button"
            >
              Clear session
            </Button>
          </Space>
        </Card>

        <div
          ref={widgetWrapperRef}
          style={{ width: "100vw", maxWidth: "610px" }}
        />
        {/* Note that all prices in Ingrid are handled in cents, meaning price '20000' represents $200.00 */}
        <Card
          title="Summary"
          style={{ maxWidth: 610, width: "100vw" }}
          headStyle={cardHeaderStyle}
          extra={
            <Button
              type="primary"
              onClick={handleCompleteSession}
              disabled={!!!session || session.status === "COMPLETE"}
              size="middle"
              loading={isLoading}
              className="custom-button"
            >
              Complete session
            </Button>
          }
        >
          <Row>
            <Col span={8}>
              <Statistic
                title="Subtotal"
                suffix={session?.cart.currency}
                value={
                  session?.cart.total_value
                    ? session?.cart.total_value / 100
                    : "-"
                }
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Shipping fee"
                suffix={session?.cart.currency}
                value={shippingPrice === null ? "-" : shippingPrice / 100}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Total"
                suffix={session?.cart.currency}
                value={
                  session?.cart.total_value && shippingPrice !== null
                    ? (session?.cart.total_value + shippingPrice) / 100
                    : "-"
                }
              />
            </Col>
          </Row>
        </Card>
        {sessionResult && (
          <Card
            title="Session result"
            style={cardStyle}
            headStyle={cardHeaderStyle}
          >
            <ReactJson
              collapsed={1}
              src={sessionResult}
              theme="grayscale:inverted"
              style={{ textAlign: "left" }}
            />
          </Card>
        )}
      </Space>
    </div>
  );
}

const cardStyle = { maxWidth: 610, width: "100vw" };
const cardHeaderStyle: CSSProperties = {
  textAlign: "left",
  fontWeight: 500,
};
