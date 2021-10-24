# Overview of the Tutorial

The app is available on https://ceramic-unstoppable.vercel.app/

Ceramic allows users to have complete ownership over their data by providing decentralized technologies for authentication and data storage.

In this tutorial we set up an application to interact with JS HTTP Client with a public Ceramic node. In addition we create a determenistic Ceramic Tile and resolve an unstoppable domain which we store in the decentralized profile of the user.

![](https://i.imgur.com/6zbdC3L.jpg?1)

![](https://i.imgur.com/gcs0NJT.jpg?1)

![](https://i.imgur.com/AcxIR8R.jpg?1)

![](https://i.imgur.com/qyg4dep.jpg?1)

## Requirements

Node.js v14 and npm v6: https://developers.ceramic.network/build/javascript/http/

## Libraries

- @ceramicnetwork/http-client
- @ceramicnetwork/3id-did-resolver
- @3id/connect
- @ceramicnetwork/stream-tile
- dids
- @unstoppabledomains/resolution
- near-api-js

## Tutorial

First we create an app by using React framework and cd into the directory:

```
npx create-react-app new-app

cd new-app
```

Then we install the dependencies:
`npm install @ceramicnetwork/http-client @ceramicnetwork/3id-did-resolver dids @3id/connect @ceramicnetwork/stream-tile near-api-js @unstoppabledomains/resolution`

After the dependencies are installed we move into the src folder via `cd src` and create a new file where after a successful login we can access ceramic DID Datastore and update the data. This file we name as `DataModels.js`. We also create an additional css file for Datamodels.js that we name as `App.module.css`.

Meanwhile in App.js we import following libraries and files:
```
import './App.css';
import { useEffect, useState} from 'react';
import CeramicClient from '@ceramicnetwork/http-client';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { ThreeIdConnect,  EthereumAuthProvider } from '@3id/connect'
import { DID } from 'dids'
import DataModels from './DataModels';
```

Next we configure a public node URL:
`const API_URL = 'https://ceramic-clay.3boxlabs.com';`

The flow of the program is, first we check for availability of metamask, ask the permission of the user and store the ethereum public address:
```
useEffect(() => {
  if(window.ethereum) {
    setEthereum(window.ethereum);
    (async() => {
      try {
        const addresses = await window.ethereum.request({ method: 'eth_requestAccounts'})
        setEthAddresses(addresses);
      }
      catch(e) { 
        console.log(e);
      }
    })();
  }
}, []);
```

Then we create Ceramic instance and create a DID instance which wraps an instance of a DID resolver. It also includes a 3idConnect Provider for the DID Method for authentication.
```
useEffect(() => {
  if(ethereum && ethAddresses) {
    (async () => {
      const newCeramic = new CeramicClient(API_URL);

      const resolver = {
        ...ThreeIdResolver.getResolver(newCeramic),
      }
      const did = new DID({ resolver })
      newCeramic.did = did;
      const threeIdConnect = new ThreeIdConnect()
      const authProvider = new EthereumAuthProvider(ethereum, ethAddresses[0]);
      await threeIdConnect.connect(authProvider)

      const provider = await threeIdConnect.getDidProvider();
      newCeramic.did.setProvider(provider);
      await newCeramic.did.authenticate();

      setCeramic(newCeramic);
    })();
  }
}, [ethereum, ethAddresses]);
```

Following successful auhentification we direct user to another page where he/she can create and update personal DID profile. The file looks as:
```
import './App.css';
import { useEffect, useState} from 'react';
import CeramicClient from '@ceramicnetwork/http-client';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { ThreeIdConnect,  EthereumAuthProvider } from '@3id/connect'
import { DID } from 'dids'
import DataModels from './DataModels';

const API_URL = 'https://ceramic-clay.3boxlabs.com';


function App() {
    
    const [ceramic, setCeramic] = useState();
    const [ethAddresses, setEthAddresses] = useState();
    const [ethereum, setEthereum] = useState();
    const [appStarted, setAppStarted] = useState(false);
  
    useEffect(() => {
      if(window.ethereum) {
        setEthereum(window.ethereum);
        (async() => {
          try {
            const addresses = await window.ethereum.request({ method: 'eth_requestAccounts'})
            setEthAddresses(addresses);
          }
          catch(e) { 
            console.log(e);
          }
        })();
      }
    }, []);
  
    useEffect(() => {
      if(ethereum && ethAddresses) {
        (async () => {
          const newCeramic = new CeramicClient(API_URL);
  
          const resolver = {
            ...ThreeIdResolver.getResolver(newCeramic),
          }
          const did = new DID({ resolver })
          newCeramic.did = did;
          const threeIdConnect = new ThreeIdConnect()
          const authProvider = new EthereumAuthProvider(ethereum, ethAddresses[0]);
          await threeIdConnect.connect(authProvider)
  
          const provider = await threeIdConnect.getDidProvider();
          newCeramic.did.setProvider(provider);
          await newCeramic.did.authenticate();
  
          setCeramic(newCeramic);
        })();
      }
    }, [ethereum, ethAddresses]);
  
    function getEthNeededPanel() {
      return <div>
       <h2> You need wallet 
        <a href="https://metamask.io/" target="_blank" rel="noreferrer">
          Try MetaMask
        </a> </h2>
      </div>;
    }
  
    function getWaitingForEthPanel() {
      return <div>
        <h2>Waiting for Ethereum accounts...</h2>
      </div>;
    }
  
    function getWaitingForDIDPanel() {
      return <div>
       <h2> Waiting for a decentralized ID...</h2>
      </div>
    }
  
    function getLandingPage() {
      return (
        <div className="Init">
              <h1>
                Take Control of Your Data with TtD
              </h1>

                { 
                  ethereum ? 
                  (
                    ethAddresses ?  
                    (
                      ceramic ?
                      <button onClick={() => setAppStarted(true)}>Let&apos;s go !!</button> : 
                      getWaitingForDIDPanel()
                    ) 
                    :
                    getWaitingForEthPanel() 
                  )
                  :
                  getEthNeededPanel()
                }
              </div>
      );
    }

    function getSkillsPage() {
      return <DataModels ceramic={ceramic} setAppStarted={setAppStarted} />
    }
  
    return (
      <div>
        {
          (ceramic && appStarted) ?
            getSkillsPage() :
            getLandingPage()
        }
      </div>
   
    );
  }

export default App;
```
### Data Model

As the data model we use Ceramic deterministic Tile that can we can query without knowing StreamID. To query such data model we use:
```
const doc = await TileDocument.create(
    ceramic,
    null,
    {
      controllers: [ceramic.did.id],
      deterministic: true
    },
    { anchor: false, publish: false }
)
```

We can also use this constant to pass and store dictionary with new values. For example,
```
let Data = {
    name: "Ryan",
    id: "ryan.crypto",
    description: "This is my profile.",
}

await doc.update(Data);
```

In turn, if the values are already stored we can access the keys, for instance, the description key as `doc.content.description`.

Besides, we use Resolver from Unstoppable Domains to get the connected ethereum address to the domain:
```
function getAddress(input){
    var promise = new Promise((resolve) => {
        if (true) {
            resolve(resolution.addr(input, 'ETH'));
        }
    });

    promise.then( result => {
        setDecoded(result)
    }, function(error) {
        //setDecoded(error)
    });
}
```
To sum up, within DataModels.js we pass the intialized identifiers of the user and query the determenstic Tile connected to the DID of the user:

```
import { useEffect, useState } from 'react';
import styles from './App.module.css'
import { TileDocument } from '@ceramicnetwork/stream-tile'
import Resolution from '@unstoppabledomains/resolution'

const resolution = new Resolution();

function DataModels(props) {

    const [Data, setData] = useState();
    const ceramic = props.ceramic;
    const setAppStarted = props.setAppStarted;
    const [Name, setName] = useState();
    const [ID, setID] = useState();
    const [Desc, setDesc] = useState();
    const [ImageURL, setImageURL] = useState();
    const [loadingMessage, setLoadingMessage] = useState('Loading...');
    const [document, setDocument] = useState();
    const [Decode, setDecoded] = useState();

    useEffect(() => {
        if(ceramic) {
            setLoadingMessage('Loading your skills...');

            (async() => {
                const doc = await TileDocument.create(
                    ceramic,
                    null,
                    {
                      controllers: [ceramic.did.id],
                      deterministic: true
                    },
                    { anchor: false, publish: false }
                )
                if(doc.content.description){setDesc(doc.content.description)}
                if(doc.content.name){setName(doc.content.name)}
                if(doc.content.image){setImageURL(doc.content.image)}
                if(doc.content.id){setID(doc.content.id)}
                if(doc.content.decode){setDecoded(doc.content.decode)}
                if(doc.content.description || doc.content.name || doc.content.id ||  doc.content.image){
                    setData(
                        {name: Name, id: ID, description: Desc, decode: Decode, image: ImageURL}
                    )
                }
                
                setDocument(doc)
                setLoadingMessage('');
            })();
        }
    }, [ceramic]);

    function getAddress(input){
        var promise = new Promise((resolve) => {
            if (true) {
                resolve(resolution.addr(input, 'ETH'));
            }
        });

        promise.then( result => {
            setDecoded(result)
        }, function(error) {
            //setDecoded(error)
        });
    }

    function display() {
        
        let Panel = <div className={styles.csnSkillRecord}>
            <div className={styles.csnSkillRecordRight}>
                <img src={ImageURL} alt='value' className='image1' width="200" height="200"/>
                <div className={styles.csnSkillName}>
                <h1>{Name}</h1>
                </div>
                <div className={styles.csnSkillDesc}>
                <h2> {ID} </h2>
                </div>
                <div className={styles.csnSkillDesc}>
                <h2>  {Decode} </h2>
                </div>
                <div className={styles.csnSkillDesc}>
                <h2> {Desc} </h2>
                </div>
            </div>
        </div>;

        return Panel;
    }

    function handleSubmit(e) {
        setLoadingMessage('Updating...')
        let t = setTimeout(() => {
            setLoadingMessage('')
        }, 20000);

        if (ID){
            getSome(ID)
        }

        let Data = {
            name: Name,
            id: ID,
            description: Desc,
            decode: Decode,
            image: ImageURL
        }
        
        setData(Data)

        if(Data) {
            (async() => {
                await document.update(Data);
                setLoadingMessage('');
                clearTimeout(t);
            })();
        }

        e.preventDefault();
    }

    function getSimpleSkillForm() {
        return <form onSubmit={e => handleSubmit(e)}>
            <div className={styles.csnFormLabel}>
            <h2>Name</h2>
            </div>
            <div className={styles.csnFormInput}>
            <input type="text" name="skill-name" value={Name} onChange={e => setName(e.target.value)} />
            </div>

            <div className={styles.csnFormLabel}>
            <h2>ID</h2>
            </div>
            <div className={styles.csnFormInput}>
            <input type="text" name="skill-id" value={ID} onChange={e => setID(e.target.value)} />
            </div>

            <div className={styles.csnFormLabel}>
            <h2>Description</h2>
            </div>
            <div className={styles.csnFormInput}>
            <input name="skill-desc" value={Desc} onChange={e => setDesc(e.target.value)}>
            </input>
            </div>

            <div className={styles.csnFormInput}>
                <div className={styles.csnFormLabel}>
                <h2>Image Url</h2>
                </div>
            <input type="text" name="skill-image-url" value={ImageURL} onChange={e => setImageURL(e.target.value)} />
            </div>

            <input type="submit" name="submit" value="submit" />
        </form>
    }

    function getSkillsPage() {

        let skillsContent = 
        <div className={styles.csnSkillsPage}>
            <h1> Take Control of Your Data with TtD </h1>
            <div className={styles.csnSkillsPageHeadingRow}>
                <div onClick={() => setAppStarted(false)}>
                </div>
            </div>
            <div className={styles.csnSkillsPageMainRow}>
                { loadingMessage &&
                    <div className={styles.csnOverlay}>
                        <div className={styles.csnOverlayContent}>
                            <div className={styles.csnOverlayTextUpper}>
                                <h2>{loadingMessage}</h2>
                            </div>
                        </div>
                    </div>
                }

                <div className={styles.csnSkillsFormContainer}>
                    <div className={styles.csnSkillsFormContainerContent}>
                        <div>
                            <div>
                                {getSimpleSkillForm()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.csnSkillsContainer}>
                        <div className="data-models">
                                { (Data)  ?
                                    display(Data) :
                                    <h1>You need to add some data!</h1>
                                }  
                        </div>
                </div>
            </div>
            <div className="Footer">
            <h1>T+D</h1>
            </div>
        </div>
        return skillsContent;
    }

    return getSkillsPage();
}

export default DataModels;
```

## Additional Resources

[Unstoppable Domains Docs](https://docs.unstoppabledomains.com/)

[Ceramic Developers Quickstart](https://developers.ceramic.network/build/javascript/quick-start/)

[Ceramic Tutorials](https://blog.ceramic.network/tag/tutorials/)
