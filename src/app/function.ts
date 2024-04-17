import {
  generateSecretKey,
  getPublicKey,
  nip04,
  SimplePool,
  getEventHash,
  finalizeEvent,
} from "nostr-tools";
export const sendpub =
  "54fd3172bbc4110646ddb0410dc5451bf141a47e00cbfa2e7e238d9e8f3392de";

//feedback送信用のリレー
export const feedbackRelay = [
  "wss://nos.lol",
  "wss://relay.nostr.wirednet.jp",
  "wss://relayable.org",
  "wss://relay.nostr.band/",
];

export type EventParameters = {
  created_at: number;
  content: string;
  tags: any[];
  kind: number;
  pubkey?: string;
  id?: string;
  sig?: string;
};
export type NostrEvent = {
  created_at: number;
  content: string;
  tags: any[];
  kind: number;
  pubkey: string;
  id: string;
  sig: string;
};

export async function sendMessage(message: string, pubhex: string) {
  if (!pubhex) {
    throw Error;
  }
  const sk = generateSecretKey();
  const pk = getPublicKey(sk);
  const encryptedMessage = await nip04.encrypt(sk, pubhex, message);
  const pool = new SimplePool();
  const ev = {
    kind: 4,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["p", pubhex]],

    content: encryptedMessage,
    pubkey: pk,
    sig: "",
    id: "",
  };

  ev.id = getEventHash(ev);
  const event = finalizeEvent(ev, sk);
  //サイン無しでrxnostrでやれないから
  await Promise.any(pool.publish(feedbackRelay, event));
  pool.close(feedbackRelay);
}
