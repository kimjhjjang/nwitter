import { dbService, storageService } from "fbase";
import { addDoc, collection} from "firebase/firestore";
import React, { useState } from "react";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";

import { v4 } from "uuid";

const NweetFactory = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
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

    return(
        <form onSubmit={onSubmit}>
                <input
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What on your mind"
                    maxLength={120} />

                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="nweet" /> {
                    attachment && (
                        <div>
                            <img
                                src={attachment}
                                alt="img"
                                style={{
                                    width: "50px",
                                    height: "50px"
                                }} />
                            <button onClick={onClearAttachment}>취소</button>
                        </div>
                    )
                }

            </form>
    );
}

export default NweetFactory;