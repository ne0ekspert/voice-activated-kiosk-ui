import { Link } from "react-router-dom";
import logo from '../res/logo.png';

function Home() {
    return (
        <Link to="/order">
            <div className="flex w-full h-full">
                <div className="w-3/4 overflow-hidden">
                    <img src={logo} alt="logo" className="h-full" />
                </div>
                <div className="w-1/4 h-full text-4xl font-bold flex justify-center align-bottom items-end pb-64">
                    <span className="bg-yellow-300 rounded-full p-3 pl-7 pr-7">화면을 터치해 주세요</span>
                </div>
            </div>
        </Link>
    )
}

export default Home;