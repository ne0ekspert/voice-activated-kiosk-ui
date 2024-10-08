import { Link } from "react-router-dom";
import { IoArrowForwardOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

function Item({ item, addItem }) {
    return (
        <div className="border border-black rounded-md p-5 flex flex-col justify-between" onClick={() => addItem({name: item.name, count: 1})}>
            <img src={item.image} alt="product" className="aspect-43 object-cover" />
            <div className="pt-5 mr-auto ml-auto text-xl">
                <span>{item.name} </span>
                <span>{item.price}원</span>
            </div>
        </div>
    );
}

function CartItem({ item, products, updateItem, removeItem }) {
    const product = products.filter((v) => item[0] === v.name)[0];
    console.log(item);

    function increase() {
        console.log(item);

        updateItem(item[0], item[1] + 1);
    }

    function decrease() {
        console.log(item);

        if (item[1]<= 1)
            return;

        updateItem(item[0], item[1] - 1);
    }

    return (
        <div className="w-56 h-56 p-6 aspect-square">
            <div className="flex flex-col bg-white h-full w-full text-black p-3">
                <div className="flex flex-row justify-between text-lg">
                    <span>{product.name}</span>
                    <span>{product.price * item[1]}원</span>
                </div>
                <div className="flex flex-row justify-evenly border-t border-b border-gray-700 text-center">
                    <div className="h-8 w-8 cursor-pointer" onClick={decrease}>-</div>
                    <div className="grow">{item[1]}</div>
                    <div className="h-8 w-8 cursor-pointer" onClick={increase}>+</div>
                </div>
                <div className="grow"></div>
                <button className="text-red-600" onClick={() => removeItem(item[0])}>주문 취소</button>
            </div>
        </div>
    );
}

function Order(props) {
    const [ total, setTotal ] = useState(0);

    useEffect(() => {
        let t = 0;

        Object.entries(props.list).forEach((v) => {
            const product = props.products.filter((p) => v[0] === p.name)[0];
            t += product.price * v[1];
        });

        setTotal(t);
    }, [props.list, props.products]);

    return (
        <div className='flex flex-col w-full h-full'>
            <div className="h-3/4 grid grid-cols-4 gap-4 p-8 mb-80 pt-12">
                {
                    props.products.map((v, i) => <Item item={v} key={i} addItem={props.addItem} />)
                }
            </div>
            .
            <div className="fixed bottom-0 bg-slate-800 text-white h-1/4 flex flex-row w-screen">
                <div className="flex flex-row overflow-x-scroll overflow-y-hidden grow">
                    {Object.keys(props.list).length === 0 ?
                    (<span className="m-auto text-5xl font-bold opacity-30">장바구니에 음식을 추가해주세요</span>)
                    : Object.entries(props.list).map((v, i) => 
                        <CartItem item={v} key={i} products={props.products} updateItem={props.updateItem} removeItem={props.removeItem} />
                    )}
                </div>
                <Link to='/payment'>
                    <div className={"flex flex-col justify-center h-full transition overflow-hidden aspect-square " + (Object.keys(props.list).length > 0 ? "" : "translate-x-full")}>
                        <button className="flex flex-col items-center justify-center bg-white h-full text-slate-800 text-4xl font-bold">
                            <h1>{total}원</h1>
                            <div className="flex flex-row justify-center">
                                <h1>결제하기</h1>
                                <IoArrowForwardOutline />
                            </div>
                        </button>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Order;