import AppRouter from "./Router";
import { useState, useEffect } from "react";
import { authService } from "fbase";
import { updateProfile } from "@firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect( () => {
    
    authService.onAuthStateChanged((user) => {
      if(user){
        if(user.displayName==null){
          const ind = user.email.indexOf("@")
          const end = user.email.substring(0,ind)
          updateProfile(user,{displayName:end});
         }
         
         setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
          });
      }else{
        setUserObj(null);
      }
      setInit(true);
    })
  }, []);

  const refreshUser = () =>{
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
      });
  };

  return (
    <>
      { init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser}/> : "Initializing..."}
      <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
