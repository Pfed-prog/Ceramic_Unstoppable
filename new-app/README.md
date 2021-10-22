# Overview of the Tutorial

In this tutorial we set up the application to interact with JS HTTP Client with a public Ceramic node. In addition to creating a determenistic Ceramic Tile and resolving an unstoppable domain.

## Requirements
Following https://developers.ceramic.network/build/javascript/http/
the requirements are Node.js v14 and npm v6.

## Tutorial

First we create a react app and cd into directory

`
npx create-react-app new-app
cd new-app
`

Then we install the dependencies:
`npm install @ceramicnetwork/http-client @ceramicnetwork/3id-did-resolver dids @3id/connect @ceramicnetwork/stream-tile near-api-js @unstoppabledomains/resolution`

After the dependencies are installed we move into the src folder via `cd src` and create a new file where after successful login we can access ceramic DID Datastore and update the data. This file we name as DataModels.js:

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
    const [ImageURL, setImageURL] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Loading...');
    const [entryTab, setEntryTab] = useState('simple');
    const [document, setDocument] = useState();
    const [decode, setDecoded] = useState();

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
                if(doc.content.description || doc.content.name || doc.content.id ||  doc.content.image){
                    setData(
                        {name: Name, id: ID, description: Desc, image: ImageURL}
                    )
                }
                
                setDocument(doc)
                setLoadingMessage('');
            })();
        }
    }, [ceramic]);

    function getSome(input){
        var promise = new Promise((resolve, reject) => {
            if (true) {
                resolve(resolution.addr(input, 'ETH'));
            } else {
                reject("promise failed");
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
                <div className={styles.csnSkillName}>
                    Name : {Name}
                </div>
                <div className={styles.csnSkillDesc}>
                    {Desc}
                </div>
                <div className={styles.csnSkillDesc}>
                    {ID}
                </div>
                <div className={styles.csnSkillDesc}>
                    {decode}
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

        let Data = {
            name: Name,
            id: ID,
            description: Desc,
            image: ImageURL
        }
        
        setData(Data)

        if(Data) {
            (async() => {

                await document.update( Data);////
                setLoadingMessage('');
                clearTimeout(t);
            })();
        }
        if (ID){
            getSome(ID)
        }

        e.preventDefault();
    }

    var img = new Image();
    img.src = "https://www.google.com/images/srpr/logo4w.png";

    function getSimpleSkillForm() {
        return <form onSubmit={e => handleSubmit(e)}>
        <div className={styles.csnFormRow}>
            <div className={styles.csnFormLabel}>
            Name
            </div>
            <div className={styles.csnFormInput}>
            <input type="text" name="skill-name" value={Name} onChange={e => setName(e.target.value)} />
            </div>
        </div>
        <div className={styles.csnFormRow}>
            <div className={styles.csnFormLabel}>
            ID
            </div>
            <div className={styles.csnFormInput}>
            <input type="text" name="skill-id" value={ID} onChange={e => setID(e.target.value)} />
            </div>
        </div>
        <div className={styles.csnFormRow}>
            <div className={styles.csnFormLabel}>
            Description
            </div>
            <div className={styles.csnFormInput}>
            <textarea name="skill-desc" value={Desc} onChange={e => setDesc(e.target.value)} rows={4}>
            </textarea>
            </div>
        </div>
        <div className={styles.csnFormRow}>
            <div className={styles.csnFormInput}>
                <div className={styles.csnFormLabel}>
                Image Url
                </div>
            <input type="text" name="skill-image-url" value={ImageURL} onChange={e => setImageURL(e.target.value)} />
            </div>
        </div>
        <div className={styles.csnFormRow}>
            <input type="submit" name="submit" value="submit" />
        </div>
        </form>
    }

    function getSkillsPage() {

        let skillsContent = 
        <div className={styles.csnSkillsPage}>
            <div className={styles.csnSkillsPageHeadingRow}>
                <div onClick={() => setAppStarted(false)}>
                
                </div>
            </div>
            <div className={styles.csnSkillsPageMainRow}>
                { loadingMessage &&
                    <div className={styles.csnOverlay}>
                        <div className={styles.csnOverlayContent}>
                            <div className={styles.csnOverlayTextUpper}>
                                <h3>{loadingMessage}</h3>
                            </div>
                        </div>
                    </div>
                }

                <div className={styles.csnSkillsFormContainer }>
                    <div className={styles.csnSkillsFormContainerContent}>
                        <div>
                            <div className={styles.csnSkillsEntryTabs}>
                                <div onClick={() => setEntryTab('simple')} className={styles.csnSkillsEntryTab + ' ' + (entryTab === 'simple' && styles.csnSkillsEntryTabActive)}>
                                    Enter Skill
                                </div>
                            </div>

                            <div style={{display: entryTab === 'simple' ? 'block' : 'none'}}>
                                {getSimpleSkillForm()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.csnSkillsContainer }>
                    <div className={styles.csnSkillsContainerHeading}>
                    </div>
                    <div className={styles.csnSkillsContainerContent}>
                        <div className="data-models">
                            <div>
                                { (Data)  ?
                                    display(Data) :
                                    <h3>You need to add some data!</h3>
                                }
                            </div>
                            <img src={ImageURL} alt="new" width="200" height="200"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        return skillsContent;
    }

    return getSkillsPage();
}

export default DataModels;
```

Within this file we pass the intialised identifiers of the user and query the determenstic Tile whether there is an instance or not. 

We also Changed App.js:
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
        You need wallet
        <a href="https://metamask.io/" target="_blank" rel="noreferrer">
          Try MetaMask
        </a>
      </div>;
    }
  
    function getWaitingForEthPanel() {
      return <div>
        Waiting for Ethereum accounts...
      </div>;
    }
  
    function getWaitingForDIDPanel() {
      return <div>
        Waiting for a decentralized ID...
      </div>
    }
  
    function getLandingPage() {
      return (
        <div>
              <h1>
                We got your app 
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

In this file we initialise the user and connect via 3id-connect, where we access ethereum address and create or update the ceramic instance uniquely connected to the user.

Finally, we have also added Appp.module.css file

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
