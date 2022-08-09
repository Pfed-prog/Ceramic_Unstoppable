import { useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useEffect, useState } from "react";
import CeramicClient from "@ceramicnetwork/http-client";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect";
import { DID } from "dids";

import "./css/App.css";
import DataModels from "./DataModels";
import connectors from "./connectors";

const API_URL = "https://ceramic-clay.3boxlabs.com";

function App() {
  const { active, account, activate } = useWeb3React();
  const [ceramic, setCeramic] = useState();
  const [ethAddresses, setEthAddresses] = useState();
  const [ethereum, setEthereum] = useState();
  const [appStarted, setAppStarted] = useState(false);

  function createConnectHandler(connectorId) {
    return async () => {
      try {
        const connector = connectors[connectorId];

        if (
          connector instanceof WalletConnectConnector &&
          connector.walletConnectProvider?.wc?.uri
        ) {
          connector.walletConnectProvider = undefined;
        }

        await activate(connector);
      } catch (error) {
        console.error(error);
      }
    };
  }

  function buttons() {
    return (
      <>
        <button onClick={createConnectHandler(Object.keys(connectors)[0])}>
          <span>Login with Metamask</span>
        </button>

        <button onClick={createConnectHandler(Object.keys(connectors)[1])}>
          <span>Login with WalletConnect</span>
        </button>

        <button
          className="unst"
          onClick={createConnectHandler(Object.keys(connectors)[2])}
        ></button>
      </>
    );
  }

  useEffect(() => {
    if (active) {
      setEthereum(window.ethereum);
      (async () => {
        try {
          const addresses = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setEthAddresses(addresses);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [active]);

  const condition = ethereum !== undefined && ethAddresses !== undefined;
  useEffect(() => {
    if (condition) {
      (async () => {
        const newCeramic = new CeramicClient(API_URL);

        const resolver = {
          ...ThreeIdResolver.getResolver(newCeramic),
        };
        const did = new DID({ resolver });
        newCeramic.did = did;
        const threeIdConnect = new ThreeIdConnect();
        const authProvider = new EthereumAuthProvider(
          ethereum,
          ethAddresses[0]
        );
        await threeIdConnect.connect(authProvider);

        const provider = await threeIdConnect.getDidProvider();
        newCeramic.did.setProvider(provider);
        await newCeramic.did.authenticate();

        setCeramic(newCeramic);
      })();
    }
  }, [condition]);

  function getWaitingForDIDPanel() {
    return (
      <div>
        <h2> Waiting for a decentralized ID :{account}</h2>
      </div>
    );
  }

  function getLandingPage() {
    return (
      <div className="Init">
        <h1>Take Control of Your Data with T+D</h1>

        {active ? (
          ceramic ? (
            <button onClick={() => setAppStarted(true)}>
              Let&apos;s go !!
            </button>
          ) : (
            getWaitingForDIDPanel()
          )
        ) : (
          buttons()
        )}
      </div>
    );
  }

  function getSkillsPage() {
    return <DataModels ceramic={ceramic} setAppStarted={setAppStarted} />;
  }

  return (
    <div>{ceramic && appStarted ? getSkillsPage() : getLandingPage()}</div>
  );
}

export default App;
