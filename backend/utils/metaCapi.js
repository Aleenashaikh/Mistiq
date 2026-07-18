/**
 * metaCapi.js
 * Sends server-side events to Meta Conversions API (CAPI).
 * • If FB_PIXEL_ID or FB_CAPI_ACCESS_TOKEN is missing → one-line warning, then no-op.
 * • Never throws — a CAPI failure must never block the order response.
 */

import { createHash } from 'crypto';

// ----- Config guards ---------------------------------------------------------
const PIXEL_ID = process.env.FB_PIXEL_ID;
const ACCESS_TOKEN = process.env.FB_CAPI_ACCESS_TOKEN;

let _warnedOnce = false;

function ensureConfig() {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    if (!_warnedOnce) {
      console.warn('[MetaCAPI] FB_PIXEL_ID or FB_CAPI_ACCESS_TOKEN not set — server events disabled.');
      _warnedOnce = true;
    }
    return false;
  }
  return true;
}

// ----- SHA-256 hash helper (required by Meta for PII) -----------------------
function sha256(value) {
  if (!value) return undefined;
  return createHash('sha256').update(String(value).toLowerCase().trim()).digest('hex');
}

// ----- Main export -----------------------------------------------------------
/**
 * Send a server-side event to Meta CAPI.
 *
 * @param {string} eventName   Standard or custom event name, e.g. 'Purchase'
 * @param {string} eventId     UUID matching the browser pixel event (dedup key)
 * @param {object} userData    Customer PII — will be hashed before sending
 *   { email, phone, firstName, lastName, city, state, zip, country }
 * @param {object} customData  Event-specific data, e.g. { value, currency, content_ids }
 * @param {string} [sourceUrl] Page URL where the event originated
 */
export async function sendServerEvent(
  eventName,
  eventId,
  userData = {},
  customData = {},
  sourceUrl = 'https://www.mistiq-perfumeries.com'
) {
  if (!ensureConfig()) return;

  try {
    const { default: bizSdk } = await import('facebook-nodejs-business-sdk');
    const { ServerEvent, EventRequest, UserData, CustomData } = bizSdk;

    // Build hashed user data
    const ud = new UserData();
    if (userData.email)     ud.setEmail(sha256(userData.email));
    if (userData.phone)     ud.setPhone(sha256(userData.phone));
    if (userData.firstName) ud.setFirstName(sha256(userData.firstName));
    if (userData.lastName)  ud.setLastName(sha256(userData.lastName));
    if (userData.city)      ud.setCity(sha256(userData.city));
    if (userData.state)     ud.setState(sha256(userData.state));
    if (userData.zip)       ud.setZip(sha256(userData.zip));
    if (userData.country)   ud.setCountryCode(sha256(userData.country || 'pk'));

    // Build custom data
    const cd = new CustomData();
    if (customData.value)        cd.setValue(customData.value);
    if (customData.currency)     cd.setCurrency(customData.currency);
    if (customData.content_ids)  cd.setContentIds(customData.content_ids);
    if (customData.content_type) cd.setContentType(customData.content_type);
    if (customData.num_items)    cd.setNumItems(customData.num_items);

    const serverEvent = new ServerEvent()
      .setEventName(eventName)
      .setEventTime(Math.floor(Date.now() / 1000))
      .setEventId(eventId)
      .setEventSourceUrl(sourceUrl)
      .setActionSource('website')
      .setUserData(ud)
      .setCustomData(cd);

    const api = bizSdk.FacebookAdsApi.init(ACCESS_TOKEN);
    const eventRequest = new EventRequest(ACCESS_TOKEN, PIXEL_ID)
      .setEvents([serverEvent]);

    await eventRequest.execute();
  } catch (err) {
    // Log but never propagate — CAPI failure must not affect order flow
    console.error('[MetaCAPI] Failed to send server event:', err?.message || err);
  }
}
