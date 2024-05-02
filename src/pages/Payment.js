import { useEffect, useState } from "react";
import { CiCreditCard1, CiMoneyBill } from "react-icons/ci"; 

function Payment({ list, products, updateItem, removeItem }) {
    const [ totalPrice, setTotalPrice ] = useState(0);

    useEffect(() => {
        let total = 0;
        list.forEach((v) => {
            const price = products.filter((p) => p.name === v.name)[0].price;
            const count = v.count;

            total += price * count;
        });

        setTotalPrice(total);
    }, [list, products]);

    return (
        <div className='flex flex-row w-full h-full'>
            <table className="w-1/2">
                <thead>
                    <tr>
                        <th>상품명</th>
                        <th>수량</th>
                        <th>금액</th>
                        <th className="w-10">삭제</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {
                        list.map((v, i) => 
                            <tr className="h-3 border-b">
                                <td>{v.name}</td>
                                <td>{v.count}</td>
                                <td>{products.filter((p) => p.name === v.name)[0].price * v.count}</td>
                                <td onClick={() => removeItem(v.id)} className="text-red-600 font-bold">X</td>
                            </tr>
                        )
                    }
                    <tr className="h-3">
                        <td colSpan={2} className="font-bold">
                            최종 가격
                        </td>
                        <td>{totalPrice}</td>
                    </tr>
                    <div className="grow"></div>
                </tbody>
            </table>
            <div className="bg-slate-800 text-white flex flex-col w-1/2 h-screen">
                <h1 className="mt-40 ml-auto mr-auto text-5xl">결제방식을 선택해주세요</h1>

                <div className="mt-32 mr-auto ml-auto">
                    <button className="bg-white text-blue-800 text-3xl rounded-lg p-6 m-6">
                        <CiCreditCard1 className="ml-auto mr-auto" size={72} />
                        카드결제
                    </button>
                    <button className="bg-white text-blue-800 text-3xl rounded-lg p-6 m-6">
                        <CiMoneyBill className="ml-auto mr-auto" size={72} />
                        현금결제
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Payment;