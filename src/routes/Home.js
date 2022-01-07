import React, { useEffect ,useState } from "react";
import { dbService } from "fbase";
import { collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import Nweet from "component/Nweet";
import NweetFactory from "component/NweetFactory";


const Home = ({ userObj }) => {

    const [nweets, setNweets] = useState([]);
    const getNweets = async () => {
        const dbNweets = await getDocs(collection(dbService, "nweets"));
        dbNweets.forEach(document => {
            /* const nweetObject = {
                ...document.data(),
                id: document.id
            }; */
            setNweets(prev => [...prev]);

        });
    };

    useEffect(() => {

        // realtime Database
        const q = query(collection(dbService, "nweets"), orderBy("createAt", "desc"));
        onSnapshot(q, (snapshot) => {
            const nweetArr = snapshot
                .docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
            setNweets(nweetArr);
        });

        getNweets();
    }, []);

    

    return (
        <div className="container">
            <NweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {
                    nweets.map((nweet) => (
                        <Nweet
                            key={nweet.id}
                            nweetObj={nweet}
                            isOwner={nweet.creatorId === userObj.uid} />
                    ))
                }
            </div>
        </div>
    );
};

export default Home;