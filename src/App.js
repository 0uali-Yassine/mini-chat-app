import Auth from "./components/Auth";
import Chat from "./components/Chat";
import Room from "./components/Room";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGlobalContext } from "./Context";

function App() {
  const {isAuth,roomName} = useGlobalContext();

  return (
    <div className="h-[100vh] flex justify-center items-center bg-[url('./asset/original-e03834c9fc997ae84e889971b7f9400c.png')] bg-no-repeat bg-cover">
      {
        isAuth ? (
          <>
            {
                roomName ?  <Chat/> : <Room/>
            }
          </>
        ) : <Auth/>
      }
      <ToastContainer/>
    </div>
  );
}

export default App;
