import { useEffect, useState } from "react";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import Resolution from "@unstoppabledomains/resolution";
import styles from "./css/App.module.css";

const resolution = new Resolution();

function DataModels(props) {
  const [Data, setData] = useState();
  const ceramic = props.ceramic;
  const setAppStarted = props.setAppStarted;
  const [Name, setName] = useState();
  const [ID, setID] = useState();
  const [Desc, setDesc] = useState();
  const [ImageURL, setImageURL] = useState();
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [document, setDocument] = useState();
  const [Decode, setDecoded] = useState();

  useEffect(() => {
    if (ceramic) {
      setLoadingMessage("Loading your skills...");

      (async () => {
        const doc = await TileDocument.create(
          ceramic,
          null,
          {
            controllers: [ceramic.did.id],
            deterministic: true,
          },
          { anchor: false, publish: false }
        );
        if (doc.content.description) {
          setDesc(doc.content.description);
        }
        if (doc.content.name) {
          setName(doc.content.name);
        }
        if (doc.content.image) {
          setImageURL(doc.content.image);
        }
        if (doc.content.id) {
          setID(doc.content.id);
          await setDecoded(getResolution(doc.content.id));
        }
        if (doc.content.decode) {
          setDecoded(doc.content.decode);
        }
        if (
          doc.content.description ||
          doc.content.name ||
          doc.content.id ||
          doc.content.image
        ) {
          setData({
            name: Name,
            id: ID,
            description: Desc,
            decode: Decode,
            image: ImageURL,
          });
        }

        setDocument(doc);
        setLoadingMessage("");
      })();
    }
  }, [ceramic]);

  function getResolution(input) {
    var promise = new Promise((resolve) => {
      if (true) {
        resolve(resolution.addr(input, "ETH"));
      }
    });

    promise.then(
      (result) => {
        setDecoded(result);
      },
      function (error) {
        setDecoded("");
      }
    );
  }

  function display() {
    let Panel = (
      <div className={styles.csnSkillRecord}>
        <div className={styles.csnSkillRecordRight}>
          <img
            src={ImageURL}
            alt="value"
            className="image1"
            width="200"
            height="200"
          />
          <div className={styles.csnSkillName}>
            <h1>{Name}</h1>
          </div>
          <div className={styles.csnSkillDesc}>
            <h2> {ID} </h2>
          </div>
          <div className={styles.csnSkillDesc}>
            <h2> {Decode} </h2>
          </div>
          <div className={styles.csnSkillDesc}>
            <h2> {Desc} </h2>
          </div>
        </div>
      </div>
    );

    return Panel;
  }

  function handleSubmit(e) {
    setLoadingMessage("Updating...");
    let t = setTimeout(() => {
      setLoadingMessage("");
    }, 20000);

    if (ID) {
      getResolution(ID);
    }

    let Data = {
      name: Name,
      id: ID,
      description: Desc,
      decode: Decode,
      image: ImageURL,
    };

    setData(Data);

    if (Data) {
      (async () => {
        await document.update(Data);
        setLoadingMessage("");
        clearTimeout(t);
      })();
    }

    e.preventDefault();
  }

  function getSimpleSkillForm() {
    return (
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className={styles.csnFormLabel}>
          <h2>Name</h2>
        </div>
        <div className={styles.csnFormInput}>
          <input
            type="text"
            name="skill-name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.csnFormLabel}>
          <h2>ID:Eth</h2>
        </div>
        <div className={styles.csnFormInput}>
          <input
            type="text"
            name="skill-id"
            value={ID}
            onChange={(e) => setID(e.target.value)}
          />
        </div>

        <div className={styles.csnFormLabel}>
          <h2>Description</h2>
        </div>
        <div className={styles.csnFormInput}>
          <input
            name="skill-desc"
            value={Desc}
            onChange={(e) => setDesc(e.target.value)}
          ></input>
        </div>

        <div className={styles.csnFormInput}>
          <div className={styles.csnFormLabel}>
            <h2>Image Url</h2>
          </div>
          <input
            type="text"
            name="skill-image-url"
            value={ImageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
        </div>

        <input type="submit" name="submit" value="submit" />
      </form>
    );
  }

  function getSkillsPage() {
    let skillsContent = (
      <div className={styles.csnSkillsPage}>
        <h1> Take Control of Your Data with TtD </h1>
        <div className={styles.csnSkillsPageHeadingRow}>
          <div onClick={() => setAppStarted(false)}></div>
        </div>
        <div className={styles.csnSkillsPageMainRow}>
          {loadingMessage && (
            <div className={styles.csnOverlay}>
              <div className={styles.csnOverlayContent}>
                <div className={styles.csnOverlayTextUpper}>
                  <h2>{loadingMessage}</h2>
                </div>
              </div>
            </div>
          )}

          <div className={styles.csnSkillsFormContainer}>
            <div className={styles.csnSkillsFormContainerContent}>
              <div>
                <div>{getSimpleSkillForm()}</div>
              </div>
            </div>
          </div>

          <div className={styles.csnSkillsContainer}>
            <div className="data-models">
              {Data ? display(Data) : <h1>You need to add some data!</h1>}
            </div>
          </div>
        </div>
        <div className="Footer">
          <h1>T+D</h1>
        </div>
      </div>
    );
    return skillsContent;
  }

  return getSkillsPage();
}

export default DataModels;
