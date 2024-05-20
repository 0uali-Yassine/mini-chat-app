import { useEffect, useState, useRef } from 'react';
import { useGlobalContext } from '../Context';
import { auth, db } from '../firebase.config/config';
import {signOut } from "firebase/auth"
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';



function Chat() {
    const {userData,roomName} = useGlobalContext();
    const [message,setMessage] = useState('');
    const [dataMsg,setDataMsg] = useState([]);

    const myCollection = collection(db,'messages');

    const end_msgRef = useRef(null);
    // for scrolling to the last messages
    useEffect(()=>{
      end_msgRef.current?.scrollIntoView({behavior:"smooth"});
    },[JSON.stringify(dataMsg)])
  

    const signout = async()=>{
        await signOut(auth);
    }

    const handlMessage = async e =>{
      e.preventDefault();
      setMessage('');
      if(message){
        try {
          await addDoc(myCollection,{
            message,
            time:serverTimestamp(),
            room:roomName,
            id:auth.currentUser.uid,
          })
          
        } catch (error) {
          console.error(error);
        }
      }
    }

    useEffect(()=>{
      //to get realtime data
      const queryMessage = query(myCollection,where('room','==',roomName));
      const unSub = onSnapshot(queryMessage, (doc) => {
        const data = doc.docs.map(msg =>{
          const msgData = msg.data();
          return {...msg.data(),id:msgData.id};
        })
        const sortedData =data.sort((a,b)=> a.time - b.time); 
        setDataMsg(sortedData);
      });
      //cleaning
      return ()=> unSub();
    },[])
   

    
  return (
    <div className='w-[350px] flex flex-col gap-[20px] h-auto  p-[10px] bg-[rgba(71,71,71,0.75)] backdrop-blur-[19px] backdrop-saturate-[180%]'>
        <div className='flex  gap-[15px] items-center'>
          <img src={userData.imgUrl} alt="avatar" className='border border-green-400 w-[30px] h-[30px] rounded-[50%] object-cover'/>
          <p className='font-medium'>{userData.username} </p>
        </div>
        <div className='border  px-[10px] h-[240px]  overflow-auto  flex flex-col gap-[3px] border-blue-500'>
          {
            dataMsg.map(msg =>{
              const {message,id,time} = msg;
              let formattedTime = 'Sending...';
                        if (time?.seconds) {
                            const messageTime = new Date(time.seconds * 1000);
                            formattedTime = formatDistanceToNow(messageTime, { addSuffix: true });
                        }
              return <div key={time} className='flex flex-col relative '>
                        <p  className={`text-[14px] border w-max py-[2px] pr-[10px] pl-[5px] bg-blue-400 rounded-md  font-medium text-black-500 ${id === auth.currentUser.uid ? 'self-end':'self-start'}`}>{message}</p>
                        <span className={`text-[9px] font-mono  text-gray-400 ${id === auth.currentUser.uid ? 'self-end':'self-start'}`}>{formattedTime}</span>
                        <div className={`triangle-up absolute ${id === auth.currentUser.uid ? 'self-end top-[17px] right-[-4px]':'self-start top-[17px] left-[-4px]'}`}></div>
                      </div> 
            })
          }
          <div ref={end_msgRef}></div>
        </div>
        <form onSubmit={handlMessage} className='flex justify-evenly relative'>
          <input onChange={e => setMessage(e.target.value)} value={message} type="text" className='border-blue-500 border-[1px] bg-transparent px-[10px] outline-none' placeholder='add message' />
          <button  className='px-[10px] rounded-md bg-blue-500 hover:bg-blue-400'>send</button>
        </form>

        <button onClick={signout} className='border bg-red-400 hover:bg-red-500 font-bold'>Sing Out</button>
    </div>
  )
}

export default Chat;