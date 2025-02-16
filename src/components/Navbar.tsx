import { useRecoilValue, useSetRecoilState } from "recoil";
import { user } from "./store/items/user";

const Navbar = () => {
    const setUserData = useSetRecoilState(user);
    const userData = useRecoilValue(user);

    

    if (userData.isLoding) {
        <div>
                Loding...
        </div>
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <button>
                        Login
                    </button>
                    <button>    
                        Register    
                    </button>
                </div>
              </div> 
        );
    }

    return (
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Chat Application</h1>
            <div className="flex items-center gap-4">
                {/* <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg">
                    <LogOut className="w-5 h-5 text-gray-500" />
                </button> */}
            </div>
        </header>
    );
}

export default Navbar;