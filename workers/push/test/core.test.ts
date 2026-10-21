import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cleanItems, isPushEndpoint, isSendTime, localParts, vapidHeaders } from '../src/core.ts'

// 24 Oct 2026 is a Saturday.
test('sends on Saturday at noon local time, per timezone', () => {
  assert.equal(isSendTime(new Date('2026-10-24T19:00:00Z'), 'America/Los_Angeles'), true) // 12:00 PDT
  assert.equal(isSendTime(new Date('2026-10-24T03:00:00Z'), 'Asia/Tokyo'), true) // 12:00 JST
  assert.equal(isSendTime(new Date('2026-10-24T12:00:00Z'), 'Europe/London'), true) // 13:00 BST, inside the retry window
})

test('does not send at other times', () => {
  assert.equal(isSendTime(new Date('2026-10-24T18:00:00Z'), 'America/Los_Angeles'), false) // 11:00
  assert.equal(isSendTime(new Date('2026-10-24T21:00:00Z'), 'America/Los_Angeles'), false) // 14:00, too late
  assert.equal(isSendTime(new Date('2026-10-23T19:00:00Z'), 'America/Los_Angeles'), false) // Friday noon
  assert.equal(isSendTime(new Date('2026-10-25T19:00:00Z'), 'America/Los_Angeles'), false) // Sunday noon
})

test('sends only once per Saturday', () => {
  const now = new Date('2026-10-24T19:30:00Z')
  assert.equal(isSendTime(now, 'America/Los_Angeles', '2026-10-24'), false)
  assert.equal(isSendTime(now, 'America/Los_Angeles', '2026-10-17'), true)
})

test('an unknown timezone never sends', () => {
  assert.equal(isSendTime(new Date('2026-10-24T19:00:00Z'), 'Mars/Olympus'), false)
})

test('localParts handles the date line', () => {
  assert.deepEqual(localParts(new Date('2026-10-24T23:30:00Z'), 'Pacific/Auckland'), { weekday: 'Sun', hour: 12, date: '2026-10-25' })
})

test('VAPID header carries a valid ES256 signature', async () => {
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])
  const jwk = await crypto.subtle.exportKey('jwk', pair.privateKey)
  const pub = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey))
  const pubB64 = Buffer.from(pub).toString('base64url')
  const h = await vapidHeaders('https://web.push.apple.com/abc123', pubB64, jwk, 'https://example.github.io', Date.UTC(2026, 9, 24))

  const m = /^vapid t=([^.]+)\.([^.]+)\.([^,]+), k=(.+)$/.exec(h.Authorization)!
  assert.ok(m, 'header format')
  assert.equal(m[4], pubB64)
  assert.deepEqual(JSON.parse(Buffer.from(m[1], 'base64url').toString()), { typ: 'JWT', alg: 'ES256' })
  const claims = JSON.parse(Buffer.from(m[2], 'base64url').toString())
  assert.equal(claims.aud, 'https://web.push.apple.com')
  assert.equal(claims.sub, 'https://example.github.io')
  assert.ok(claims.exp - Date.UTC(2026, 9, 24) / 1000 <= 24 * 3600, 'expires within 24h (Apple limit)')
  const sig = Buffer.from(m[3], 'base64url')
  assert.equal(sig.length, 64)
  const ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, pair.publicKey, sig, new TextEncoder().encode(`${m[1]}.${m[2]}`))
  assert.equal(ok, true)
})

test('only real push services are accepted as endpoints', () => {
  assert.equal(isPushEndpoint('https://web.push.apple.com/xyz'), true)
  assert.equal(isPushEndpoint('https://fcm.googleapis.com/fcm/send/xyz'), true)
  assert.equal(isPushEndpoint('http://web.push.apple.com/xyz'), false)
  assert.equal(isPushEndpoint('https://evil.example.com/web.push.apple.com'), false)
  assert.equal(isPushEndpoint('https://web.push.apple.com.evil.com/x'), false)
  assert.equal(isPushEndpoint(undefined), false)
})

test('cleanItems limits and sanitises the list', () => {
  assert.deepEqual(cleanItems(['2 eggs', 5, null, 'x'.repeat(500)]).map((s) => s.length), [6, 120])
  assert.equal(cleanItems(Array.from({ length: 400 }, () => 'a')).length, 150)
  assert.deepEqual(cleanItems('nope'), [])
})
