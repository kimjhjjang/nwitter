import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {

    const [edit, setEdit] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async () => {
    const ok = window.confirm("삭제 하시겠습니까?");
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
        <div className="nweet">
            <div>
                {
                    edit
                        ? <><form onSubmit={onSubmit} className="container nweetEdit">
                            <input
                                type="text"
                                placeholder="Edit your nweet"
                                value={newNweet}
                                required
                                autoFocus
                                onChange={onChange}
                                className="formInput"
                            />
                            <input type="submit" value="update Nweet" className="formBtn"/>
                        </form>
                            <span onClick={toggleEdit} className="formBtn cancelBtn">
                                Cancel
                            </span></>
                        : <>
                               {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} alt={nweetObj.text}/>}
                            <h4>{nweetObj.text}</h4>
                            {isOwner && (
                                <div className="nweet__actions">
                                    <span onClick={onDeleteClick}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                    <span onClick={toggleEdit}>
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </span>
                                </div>
                            )
                            }
                        </>
                }
            </div>
        </div>
    );
}

export default Nweet;