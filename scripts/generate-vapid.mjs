// Creates the key pair that lets the reminder service prove to Apple that it may notify your phone.
//   public key  -> goes into the app (.env.production) and the Worker config (wrangler.toml); not secret
//   private key -> stays in workers/push/.vapid-private.json (git-ignored); you upload it to Cloudflare as a secret
import { webcrypto as crypto } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const privatePath = 'workers/push/.vapid-private.json'
if (existsSync(privatePath) && !process.argv.includes('--force')) {
  console.log('Keys already exist, nothing changed. (Use --force to replace them; that turns off existing reminders.)')
  process.exit(0)
}

const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])
const jwk = await crypto.subtle.exportKey('jwk', pair.privateKey)
const publicKey = Buffer.from(await crypto.subtle.exportKey('raw', pair.publicKey)).toString('base64url')

writeFileSync(privatePath, JSON.stringify(jwk))
writeFileSync('workers/push/.dev.vars', `VAPID_PRIVATE_JWK='${JSON.stringify(jwk)}'\n`) // for testing the Worker locally

const toml = readFileSync('workers/push/wrangler.toml', 'utf8').replace(/VAPID_PUBLIC = ".*"/, `VAPID_PUBLIC = "${publicKey}"`)
writeFileSync('workers/push/wrangler.toml', toml)

const envPath = '.env.production'
const rest = existsSync(envPath) ? readFileSync(envPath, 'utf8').split('\n').filter((l) => l && !l.startsWith('VITE_VAPID_PUBLIC_KEY=')) : []
writeFileSync(envPath, [...rest, `VITE_VAPID_PUBLIC_KEY=${publicKey}`].join('\n') + '\n')

console.log('Done. Public key:', publicKey)
