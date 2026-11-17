import * as HDSLib from 'hds-lib';

// 1. Platform: develop on DEMO, switch to PROD when your app is ready.
//    Demo accounts are free, instant and throwaway: create one from the sign-in popup.
const SERVICE_INFO_URL = 'https://demo.datasafe.dev/reg/service/info';
//    Production (real accounts, real health data): comment the line above, uncomment this one.
// const SERVICE_INFO_URL = 'https://reg.api.datasafe.dev/service/info';

// 2. Your app's name, shown on the consent screen and recorded on every event it writes.
const APP_ID = 'hds-weight-quickstart';

// 3. The data your app uses, as data-model item keys (browse them at https://model-browser.datasafe.dev).
//    Streams, event types and permissions all derive from this list: never hardcode them.
const APP_ITEM_KEYS = ['body-weight'];

let connection = null;
let weightItem = null;

const $ = (id) => document.getElementById(id);

async function start () {
  HDSLib.settings.setServiceInfoURL(SERVICE_INFO_URL);
  await HDSLib.initHDSModel();
  const model = HDSLib.getHDSModel();
  weightItem = model.itemsDefs.forKey('body-weight');

  HDSLib.pryv.Browser.setupAuth({
    spanButtonID: 'login-button',
    authRequest: {
      requestingAppId: APP_ID,
      // Built from the item keys: [{ streamId: 'body-weight', defaultName: 'Body Weight', level: 'contribute' }]
      // 'contribute' = read + add + modify events. On consent, HDS creates the streams the items need.
      requestedPermissions: model.authorizations.forItemKeys(APP_ITEM_KEYS, { defaultLevel: 'contribute' })
    },
    onStateChange
  }, SERVICE_INFO_URL);
}

async function onStateChange (state) {
  const { AuthStates } = HDSLib.pryv.Browser;
  if (state.id === AuthStates.AUTHORIZED) {
    try {
      // A fresh sign-in hands over a one-time key; a page reload restores the endpoint from a cookie.
      // The apiEndpoint carries the access token: never log it or send it anywhere else.
      connection = state.key
        ? await HDSLib.pryv.connectFromKey(state.key, SERVICE_INFO_URL)
        : new HDSLib.pryv.Connection(state.apiEndpoint);
      $('app').hidden = false;
      await showWeights();
    } catch (e) {
      showError(e);
    }
  }
  if (state.id === AuthStates.SIGNOUT) {
    connection = null;
    $('app').hidden = true;
    $('weights').replaceChildren();
  }
}

// WRITE: the event shape (stream + type) comes from the item. body-weight can be stored in kg or lb,
// so the unit is chosen explicitly: { streamIds: ['body-weight'], type: 'mass/kg' }.
async function saveWeight (kg) {
  const [result] = await connection.api([{
    method: 'events.create',
    params: { ...weightItem.eventTemplate({ eventType: 'mass/kg' }), content: kg }
  }]);
  if (result.error) throw new Error(result.error.message);
}

// READ: the last 20 weights (kg or lb, whichever app wrote them), filtered by the same item.
async function showWeights () {
  const [result] = await connection.api([{
    method: 'events.get',
    params: { streams: [weightItem.data.streamId], types: weightItem.eventTypes, limit: 20 }
  }]);
  if (result.error) throw new Error(result.error.message);
  $('weights').replaceChildren(...result.events.map((event) => {
    const li = document.createElement('li');
    li.textContent = `${new Date(event.time * 1000).toLocaleString()}: ${HDSLib.eventToShortText(event)}`;
    return li;
  }));
}

function showError (e) {
  $('message').textContent = e.message ?? String(e);
}

$('weight-form').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  $('message').textContent = '';
  try {
    await saveWeight(Number($('weight').value));
    $('weight').value = '';
    await showWeights();
  } catch (e) {
    showError(e);
  }
});

start().catch(showError);
