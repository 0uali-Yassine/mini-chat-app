import {auth,db,googleProvider} from '../firebase.config/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import {  useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { toast } from 'react-toastify';
import avatar from '../asset/avatar.png';

function Auth() {
    const [singInOrSingUp,setSignInOrSignUp] = useState(true); 
    const [avatarFile,setAvatarFile] = useState(null);
    const [lodingForms,setLoadingForms] = useState(false);

    const handlAvatar = e =>{
        const file = e.target.files[0];
        file &&  setAvatarFile(URL.createObjectURL(file));
    }

    const singUpWithEmailPassword = async e =>{
        e.preventDefault();
        const dataForm = new FormData(e.target);
        const {email,username,password} = Object.fromEntries(dataForm);
        try {
            setLoadingForms(true);
            const response =  await createUserWithEmailAndPassword(auth,email,password);
            await setDoc(doc(db,'users',response.user.uid),{
                username,
                email,
                id:response.user.uid,
                imgUrl:avatarFile,
            })
            setLoadingForms(false);
            toast.success("You Sign Up Correct !");
        } catch (error) {
            toast.warning(error.code);
            setLoadingForms(false);
        }
        
    }

    
    const signInWithGoogle = async ()=>{
        try {
           const response =  await signInWithPopup(auth,googleProvider);
           setLoadingForms(true);

            await setDoc(doc(db,'users',response.user.uid),{
                username:response.user.displayName,
                email:response.user.email,
                id:response.user.uid,
                imgUrl:response.user.photoURL,
            })
            setLoadingForms(false);
            toast.success("You Sign Up Correct !");

        } catch (error) {
            toast.warning(error.code);
            setLoadingForms(false);
        }
    }

    const signUpWithEmailPassword = async e =>{
        e.preventDefault();
        const formData = new FormData(e.target);
        const {Email,Password} = Object.fromEntries(formData);
        try {
            setLoadingForms(true);
            await signInWithEmailAndPassword(auth,Email,Password);
            toast.success("You Sign Up Correct !");
            setLoadingForms(false);
        } catch (error) {
            toast.warning(error.code);
            setLoadingForms(false);
        }
    }


  return (
    <div className=" rounded-md flex flex-col gap-[20px]  w-[300px] h-auto p-[10px] transition-all bg-[rgba(71,71,71,0.75)] backdrop-blur-[19px] backdrop-saturate-[180%]">
        {
            singInOrSingUp ? (
                <>
                    <form onSubmit={singUpWithEmailPassword} className="flex flex-col gap-[10px]">
                        <h1 className='self-center text-[26px] font-bold'>Sign In</h1>
                        <p className='text-gray-800 text-[13px] text-center'>Don't have any account? <br /> Sing Up now!</p>
                        <div className='flex items-center gap-[10px]'>
                            <img src={avatarFile || avatar} alt="avatar" className='w-[40px] h-[40px] rounded-[50%] object-cover' />
                            <input onChange={handlAvatar}   id='file' type="file" className='hidden' />
                            <label   htmlFor="file" className='cursor-pointer font-medium  underline'>Upload en avatar</label>
                        </div>
                        <div className='flex flex-col gap-[5px]'>
                            <label htmlFor="username" className='font-medium'>Username</label>
                            <input id='username' name='username' className='outline-none w-[80%] bg-transparent focus:border-blue-500 focus:border focus:rounded-md transition-all  border-b-[1px] border-b-blue-500 text-blue-500  text-[14px] px-[10px] py-[5px]' type="text" placeholder="UserName..." required/>
                        </div>
                        <div className='flex flex-col gap-[5px]'>
                            <label htmlFor="email" className='font-medium'>Email</label>
                            <input id="email" name='email' className='outline-none w-[80%] bg-transparent focus:border-blue-500 focus:border focus:rounded-md transition-all  border-b-[1px] border-b-blue-500 text-blue-500  text-[14px] px-[10px] py-[5px]' type="email" placeholder="Email..." required/>
                        </div>
                        <div className='flex flex-col gap-[5px] '>
                            <label htmlFor="password" className='font-medium'>Password</label>
                            <input id="password" name='password' className='outline-none w-[80%] bg-transparent focus:border-blue-500 focus:border focus:rounded-md transition-all  border-b-[1px] border-b-blue-500 text-blue-500  text-[14px] px-[10px] py-[5px]' type="password" placeholder="Password..." required/>
                        </div>
                        <button className='bg-blue-500 w-full rounded-md text-white py-[5px] self-center font-medium hover:bg-blue-400'>{lodingForms ? <div class="loader"></div> : 'Sign Up'}</button>
                    </form>
                    <p className='text-center text-[13px] mt-[10px]'>you have an account? <button onClick={()=> setSignInOrSignUp(false)} className='text-blue-500 underline'>Sign In</button></p>
                </>
                
            ): (
                <div className='flex flex-col gap-[10px]'>
                    <h1 className='self-center text-[26px] font-bold'>Sign Up</h1>
                    <form onSubmit={signUpWithEmailPassword} className="flex flex-col gap-[10px]">
                        <div className='flex flex-col gap-[5px]'>
                            <label htmlFor="email" className='font-medium'>Email</label>
                            <input id="email" name='Email' className='outline-none w-[80%] bg-transparent focus:border-blue-500 focus:border focus:rounded-md transition-all  border-b-[1px] border-b-blue-500 text-blue-500  text-[14px] px-[10px] py-[5px]' type="email" placeholder="Email..." required/>
                        </div>
                        <div className='flex flex-col gap-[5px] '>
                            <label htmlFor="password" className='font-medium'>Password</label>
                            <input id="password" name='Password' className='outline-none w-[80%] bg-transparent focus:border-blue-500 focus:border focus:rounded-md transition-all  border-b-[1px] border-b-blue-500 text-blue-500  text-[14px] px-[10px] py-[5px]' type="password" placeholder="Password..." required/>
                        </div>

                        <button className='bg-blue-500 w-full rounded-md text-white py-[5px] self-center font-medium hover:bg-blue-400'>{lodingForms ? <div class="loader"></div> : 'Sign In'}</button>
                    </form>
                    <div className='flex self-center text-gray-800  items-center gap-[3px]'>
                        <div className='w-[70px] h-[1px] bg-gray-800'></div>
                        <span className='text-[12px]'>Or sign in using </span>
                        <div className='w-[70px] h-[1px] bg-gray-800'></div>
                    </div>
                    <div onClick={signInWithGoogle} className="w-[30px] self-center cursor-pointer">
                        <FcGoogle size={30}/>
                    </div>
                    <p className='text-center text-[13px] mt-[10px]'>do not have an account? <button onClick={()=> setSignInOrSignUp(true)} className='text-blue-500 underline'>Sign Up</button></p>
                </div>
            )
        }
    </div>
  )
}

export default Auth;