import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase.config/config";
import { collection, getDocs, query, where } from "firebase/firestore";

const myContext = createContext();
function Context({children}) {
    const [isAuth,setIsAuth] = useState(true);
    const [userData,setUserData] = useState({});
    const [roomName,setRoomName] = useState(null);


    useEffect(()=>{
      // for know if the user is logout or not
        const unScribe = auth.onAuthStateChanged(async user =>{
          if(user){
            const myCollection = collection(db,'users');
            setIsAuth(true);
            try {
                const q = query(myCollection,where('id','==',user.uid))
                const data = await getDocs(q);
                setUserData(data.docs[0].data())
            } catch (error) {
                console.log(error);
            }
          }else{
            setIsAuth(false);
            setRoomName(null);
          }
        })
        return ()=> unScribe();
      },[])


  return (
    <myContext.Provider value={{isAuth,userData,setRoomName,roomName}}>
        {children}
    </myContext.Provider>
  )
}

export const useGlobalContext =  ()=>{
  return useContext(myContext);
}

export default Context;