import { createClient } from "graphql-ws";

const CODEX_API_KEY = '__KEY_GOES_HERE__';
if (!CODEX_API_KEY) {
  throw new Error("Please set `CODEX_API_KEY` env variable");
}

const client = createClient({
  url: "wss://graph.codex.io/graphql",
  connectionParams: {
    Authorization: CODEX_API_KEY,
  },
});

let counter = 0;

client.subscribe(
  {
    query: `
subscription onPriceUpdate {
  onPricesUpdated(input: [{networkId: 1399811149, address:"So11111111111111111111111111111111111111112"}]) {
    address
    confidence
    networkId
    poolAddress
    priceUsd
    timestamp
  }
}
  `,
  },
  {
    next(value) {
      if (value.errors) {
        console.error("Codex.subscription.error", value.errors);
        return;
      }

      console.log(++counter, value);
    },
    error(error) {
      console.error("error", error);
    },
    complete() {
      console.log("done");
    },
  }
);
