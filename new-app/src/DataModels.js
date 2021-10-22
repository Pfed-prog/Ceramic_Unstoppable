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