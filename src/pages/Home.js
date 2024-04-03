import { Link } from "react-router-dom";

function Home() {
    return (
        <Link to="/order">
            <div className="flex w-full h-full">
                <span>터치해서 시작해주세요</span>
            </div>
        </Link>
    )
}

export default Home;