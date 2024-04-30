import { Link } from "react-router-dom";

function Item({ item, addItem }) {
    return (
        <div className="border border-black rounded-md p-6 flex flex-col justify-center" onClick={() => addItem({name: item.name, count: 1})}>
            <img src={item.image} alt="product"/>
            <div className="flex flex-col">
                <span>{item.name}</span>
                <span>{item.price}원</span>
            </div>
            <div className="grow"></div>
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
            <div className="flex flex-col bg-white h-full w-full text-black">
                <img src={product.image} alt="product" />
                <span>{product.name}</span>
                <div className="flex flex-row justify-evenly border text-center">
                    <div className="h-6 w-6 cursor-pointer" onClick={decrease}>-</div>
                    <div className="grow">{item.count}</div>
                    <div className="h-6 w-6 cursor-pointer" onClick={increase}>+</div>
                </div>
                <span>{product.price * item.count}원</span>
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
                <Link to='/payment'><button>결제하기</button></Link>
            </nav>
            <div className="h-3/4 grid grid-cols-4 gap-4 p-8">
                {
                    props.products.map((v, i) => <Item item={v} key={i} addItem={props.addItem} />)
                }
            </div>
            <div className="bg-slate-800 text-white h-1/4 flex flex-row overflow-x-scroll w-screen overflow-y-hidden">
                <div className="flex flex-row">
                    {props.list.length === 0 ?
                    (<span>장바구니에 음식을 추가해주세요</span>)
                    : props.list.map((v, i) => (
                        <CartItem item={v} key={i} products={props.products} updateItem={props.updateItem} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Order;