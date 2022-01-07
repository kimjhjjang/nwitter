import { dbService, storageService } from "fbase";
import { addDoc, collection} from "firebase/firestore";
import React, { useState } from "react";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
        }
        event.preventDefault();
        let attachmentUrl = "";

        if (attachment !== "") {
            //파일 경로 참조 만들기
            const attachmenRef = ref(storageService, `${userObj.uid}/${v4()}`);
            //storage 참조 경로로 파일 업로드 하기
            const uploadFile = await uploadString(attachmenRef, attachment, "data_url");
            //storage에 있는 파일 URL로 다운로드 받기
            attachmentUrl = await getDownloadURL(uploadFile.ref);

        }
        const nweetSend = {
            text: nweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        };
        try {
            const docRef = await addDoc(
                collection(dbService, "nweets"),
                nweetSend
            );
            console.log("Document written with ID : ", docRef.id);
        } catch (error) {
            console.log("Error adding document : ", error);
        }
        setAttachment("");
        setNweet("");

    };

    const onChange = ({ target: {
        value
    } }) => {
        setNweet(value);
    };

    const onFileChange = (event) => {
        const { target: {
            files
        } } = event;

        const thefile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            console.log(finishedEvent);
            const { currentTarget: {
                result
            } } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(thefile);
    }
    const onClearAttachment = () => {
        setAttachment("");
    }

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label for="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}

        </form>
    );
}

export default NweetFactory;