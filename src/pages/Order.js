import { Link } from "react-router-dom";

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

function CartItem({ item, products, updateItem }) {
    const product = products.filter((v) => item.name === v.name)[0];

    function increase() {
        updateItem(item.id, { count: ++item.count });
    }

    function decrease() {
        if (item.count <= 1)
            return;

        updateItem(item.id, { count: --item.count });
    }

    return (
        <div className="w-56 h-56 p-6">
            <div className="flex flex-col bg-white h-full w-full text-black p-3">
                <div className="flex flex-row justify-between text-lg">
                    <span>{product.name}</span>
                    <span>{product.price * item.count}원</span>
                </div>
                <div className="flex flex-row justify-evenly border-t border-b border-gray-700 text-center">
                    <div className="h-8 w-8 cursor-pointer" onClick={decrease}>-</div>
                    <div className="grow">{item.count}</div>
                    <div className="h-8 w-8 cursor-pointer" onClick={increase}>+</div>
                </div>
                <div className="grow"></div>
                <button className="text-red-600">주문 취소</button>
            </div>
        </div>
    );
}

function Order(props) {
    return (
        <div className='flex flex-col w-full h-full'>
            <nav className="w-full flex flex-col justify-center bg-slate-600 text-white">
                <button className="transition mr-10">탭 1</button>
                <button className="transition mr-10">탭 2</button>
            </nav>
            <div className="h-3/4 grid grid-cols-4 gap-4 p-8 mb-80">
                {
                    props.products.map((v, i) => <Item item={v} key={i} addItem={props.addItem} />)
                }
            </div>
            .
            <div className="fixed bottom-0 bg-slate-800 text-white h-1/4 flex flex-row w-screen">
                <div className="flex flex-row overflow-x-scroll overflow-y-hidden grow">
                    {props.list.length === 0 ?
                    (<span>장바구니에 음식을 추가해주세요</span>)
                    : props.list.map((v, i) => (
                        <CartItem item={v} key={i} products={props.products} updateItem={props.updateItem} />
                    ))}
                </div>
                <Link to='/payment'>
                    <div className="flex flex-col justify-center aspect-square h-full text-center">
                        <button className="bg-white h-full">
                            <h1 className="text-slate-800 text-3xl font-bold">결제하기</h1>
                            <span className="text-slate-800 text-3xl">(화살표 아이콘)</span>
                        </button>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Order;