import { useState } from "react";
import { Link } from "react-router-dom";

const products = [
    {name: '신라면', price: 1500, image: null},
    {name: '진라면', price: 99999, image: null},
    {name: '육개장', price: 99999, image: null}
]

function Item({ item }) {
    return (
        <div className="shadow-sm border rounded-md flex flex-col h-1/4">
            <img/>
            <div className="flex flex-col">
                <span>{item.name}</span>
                <span>{item.price}원</span>
            </div>
            <div className="grow"></div>
            <button className='bg-red-500 text-white'>추가하기</button>
        </div>
    )
}

function Order(props) {
    return (
        <div className='flex flex-col w-full h-full'>
            <nav className="w-full flex justify-center bg-slate-600 text-white">
                <button className="transition mr-10">고양이 조아요</button>
                <Link to='/payment'><button>결제하기</button></Link>
            </nav>
            <div className="h-3/4 grid grid-cols-4 gap-4">
                {
                    products.map((v, i) => <Item item={v} key={i} />)
                }
            </div>
        </div>
    );
}

export default Order;