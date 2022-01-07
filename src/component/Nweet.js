import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import React, { useState } from "react";

const Nweet = ({ attachmentUrl,nweetObj, isOwner }) => {

    const [edit, setEdit] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async () => {
    const ok = window.confirm("are you sure?");
        //리터럴
    
        if (ok) {
            //삭제
            await deleteDoc(doc(dbService, "nweets", nweetObj.id));
            await deleteObject(ref(storageService,nweetObj.attachmentUrl));
        }
    }
    const toggleEdit = () => {
        setEdit(prev => !prev);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        const nweetUpdateText = doc(dbService, "nweets", nweetObj.id);
        await updateDoc(nweetUpdateText, {text : newNweet});
        setEdit(false);
    }
    const onChange = ({ target: { value } }) => {
        setNewNweet(value);
    }
    return (
        <div>
            <div>
                {
                    edit
                        ? <><form onSubmit={onSubmit}>
                            <input value={newNweet} onChange={onChange} type="text" required="required" />
                            <input type="submit" value="update Nweet" />
                        </form>
                            <button onClick={toggleEdit}>Cancel</button></>
                        : <>
                            <h4>{nweetObj.text}</h4>
                            {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} style={{width:"250px", height:"250px"}} alt={nweetObj.text}/>}
                            {isOwner && (
                                <>
                                    <button onClick={onDeleteClick}>Delete Nweet</button>
                                    <button onClick={toggleEdit}>Edit Nweet</button>
                                </>
                            )
                            }
                        </>
                }
            </div>
        </div>
    );
}

export default Nweet;