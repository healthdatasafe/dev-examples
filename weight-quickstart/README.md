# Weight quickstart

The smallest Health Data Safe web app: a sign-in button, a form that stores a weight, and the list of stored
weights. Plain JavaScript, two files ([`index.html`](index.html), [`main.js`](main.js)), built with
[Vite](https://vite.dev) and [`hds-lib`](https://github.com/healthdatasafe/hds-lib-js).

## Run it

Node.js 24 or later.

```bash
git clone https://github.com/healthdatasafe/dev-examples.git
cd dev-examples/weight-quickstart
npm install
npm run dev
```

Open <http://localhost:5173/>, click **Sign in**, and pick **Create account** in the popup: demo accounts are
free, instant and throwaway. Accept the request ("Add and modify Body weight"), then store a weight.

## What the code shows

- **Demo or production** — `SERVICE_INFO_URL` at the top of `main.js`. Develop on demo; switch the commented line
  to production when your app is ready for real accounts.
- **Sign-in** — `HDSLib.pryv.Browser.setupAuth` renders the button, opens the HDS sign-in popup, and restores the
  session from a cookie on reload. The button's menu offers **Log out**.
- **Permissions from item keys** — the app lists the data it uses as data-model item keys
  (`APP_ITEM_KEYS = ['body-weight']`) and asks `model.authorizations.forItemKeys` for the matching permission
  request. Nothing is hardcoded: browse other items at <https://model-browser.datasafe.dev>.
- **Write** — `itemDef.eventTemplate({ eventType: 'mass/kg' })` gives the stream and event type for a weight.
  Items that can be stored in several units ask you to choose one explicitly.
- **Read** — `events.get` on the item's stream and event types, displayed with `HDSLib.eventToShortText`.

## Going to production

- Uncomment the production `SERVICE_INFO_URL` (and comment out the demo one).
- Serve the built app (`npm run build`, then publish `dist/`) over **HTTPS**. Browsers allow
  `http://localhost` while developing, nothing else.
- Keep the requested permissions to what the app really uses: add item keys, not wildcards.
- The apiEndpoint returned by sign-in carries the access token: never log it or send it to a third party.

## Learn more

- Developer docs: <https://docs.datasafe.dev>
- Building with an AI agent: <https://agents.datasafe.dev>
- `hds-lib` reference: <https://healthdatasafe.github.io/hds-lib-js/>
