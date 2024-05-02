import { CiCreditCard1, CiMoneyBill } from "react-icons/ci"; 

function Payment({ list, products, updateItem }) {
    return (
        <div className='flex flex-row w-full h-full'>
            <table className="w-1/2">
                <thead>
                    <tr>
                        <th>상품명</th>
                        <th>수량</th>
                        <th>금액</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        list.map((v, i) => 
                            <tr className="h-3">
                                <td>{v.name}</td>
                                <td>{v.count}</td>
                                <td>{products.filter((p) => p.name === v.name)[0].price * v.count}</td>
                            </tr>
                        )
                    }
                    <div className="grow"></div>
                </tbody>
            </table>
            <div className="bg-slate-800 text-white flex flex-col w-1/2 h-screen">
                <h1 className="mt-20 ml-auto mr-auto text-4xl">결제방식을 선택해주세요</h1>

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