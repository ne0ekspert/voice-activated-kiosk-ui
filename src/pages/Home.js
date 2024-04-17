import { Link } from "react-router-dom";
import logo from '../res/logo.png';

function Home() {
    return (
        <Link to="/order">
            <div className="flex w-full h-full">
                <div className="w-3/4 overflow-hidden">
                    <img src={logo} alt="logo" className="h-full" />
                </div>
                <div className="w-1/4">
                    터치해서 시작해주세요
                </div>
            </div>
        </Link>
    )
}

export default Home;