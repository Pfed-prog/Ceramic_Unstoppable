const Ceramic = require('@ceramicnetwork/http-client').default
const { Ed25519Provider } = require('key-did-provider-ed25519')
const ThreeIdResolver = require('@ceramicnetwork/3id-did-resolver').default
const KeyDidResolver = require('key-did-resolver').default
const { Resolver } = require('did-resolver')
const { DID } = require('dids')
const { randomBytes } = require('@stablelib/random')
const { TileDocument } = require('@ceramicnetwork/stream-tile')

const CERAMIC_URL = 'http://localhost:7007'
const { default: Resolution } = require('@unstoppabledomains/resolution');
const resolution = new Resolution();


async function run() {
  // Set the 32 bytes seed
  const seed = randomBytes(32)
  // Connect to the local Ceramic node
  const ceramic = new Ceramic(CERAMIC_URL)
  // Provide the DID Resolver and Provider to Ceramic
  const resolver = new Resolver({
      ...KeyDidResolver.getResolver(),
      ...ThreeIdResolver.getResolver(ceramic) })
  const provider = new Ed25519Provider(seed)
  const did = new DID({ provider, resolver })
  await ceramic.setDID(did)
  // Authenticate the Ceramic instance with the provider
  await ceramic.did.authenticate()
  // Create a stream with input!!
  const doc = await TileDocument.create(ceramic, {eth: 'ryan.crypto'})

  //resolve
  resolution
    .addr(doc.content.eth, 'ETH')
    .then((receiverETHAddress) => {
        doc.update({eth_full: receiverETHAddress }).then(() => {
            console.log(doc.content)
    })
    .catch(console.error);
})

}

run().catch(console.error)