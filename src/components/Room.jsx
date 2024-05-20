import React, { useRef } from 'react'
import { useGlobalContext } from '../Context';

function Room() {
  const {setRoomName} = useGlobalContext();
  const inputRef = useRef(null);

  const addRoom = e =>{
    e.preventDefault();
    if(inputRef.current.value) setRoomName(inputRef.current.value);
  }
  
   
  return (
    <form onSubmit={addRoom} className='flex flex-col gap-[10px] w-[200px]  border p-[10px]'>
      <h1 className='text-center font-medium '>Room Name</h1>
      <input ref={inputRef}  type="text" className='self-center text-center outline-none w-[80%] bg-transparent focus:border-blue-500 focus:border focus:rounded-md transition-all  border-b-[2px] border-b-blue-500 text-black font-medium text-[14px] px-[10px] py-[5px]'  placeholder='Room name..' required/>
      <button className='bg-blue-500 w-full rounded-md text-white py-[5px] self-center font-medium hover:bg-blue-400'>add room</button>
    </form>
  )
}

export default Room;