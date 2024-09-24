import { useEffect, useState, useRef } from "react";
import { FaCreditCard, FaMoneyBillAlt } from "react-icons/fa"; 
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

function PaymentOverlay({ reset }) {
    const [ cardData, setCardData ] = useState("");

    const ws_nfc = useRef();

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        ws_nfc.current = new WebSocket(`ws://${window.location.host}/ws/nfc`);
        
        ws_nfc.current.onopen = () => {
            console.log("NFC ws ready");
        };

        ws_nfc.current.onclose = () => {
            console.log("NFC ws closed");
        };

        ws_nfc.current.onerror = (error) => {
            console.error(error.code, error.message);
        };

        ws_nfc.current.onmessage = (event) => {
            console.log(event);
            setCardData(event.data);
        };

        return () => {
            ws_nfc.current?.close();
        };
    }, []);

    function card_mask(card_number) {
        return card_number.slice(0, 9) + "********";
    }

    switch (params.method) {
        case "card":
            if (cardData === "") {
                return (
                    <div className="fixed flex top-12 h-screen w-screen bg-opacity-80 bg-black items-center justify-center">
                        <div className="flex flex-col bg-white rounded-lg h-1/2 w-1/2 p-6">
                            <nav className="border-b border-gray-700 w-9/12 text-3xl mb-8">BMT페이 - 결제 대기</nav>
                            <div className="w-full text-xl">
                                학생증을 리더기에 대주세요: {cardData}
                            </div>
                            <div className="grow"></div>
                            <div className="w-full flex justify-end">
                                <button className="border-2 border-cyan-500 pt-3 pb-3 pr-6 pl-6 rounded-lg" onClick={() => navigate('/payment')}>
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="fixed flex top-12 h-screen w-screen bg-opacity-80 bg-black items-center justify-center">
                        <div className="flex flex-col bg-white rounded-lg h-1/2 w-1/2 p-6">
                            <nav className="border-b border-gray-700 w-9/12 text-3xl mb-8">BMT페이 - 결제 완료</nav>
                            <div className="w-full text-xl">
                                결제가 완료되었습니다! 결제 ID: {card_mask(cardData)}
                            </div>
                            <div className="w-full flex justify-end">
                                <button className="border-2 border-cyan-500 pt-3 pb-3 pr-6 pl-6 rounded-lg" onClick={reset}>
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }
            break;
        case "cash":
            return (
                <div className="fixed flex top-12 h-screen w-screen bg-opacity-80 bg-black items-center justify-center">
                    <div className="flex flex-col bg-white rounded-lg h-1/2 w-1/2 p-6">
                        <nav className="border-b border-gray-700 w-9/12 text-3xl mb-8">BMT페이</nav>
                        <div className="w-full text-xl">
                            주문이 접수되었습니다. 결제는 카운터에서 진행해주세요.
                        </div>
                        <div className="grow"></div>
                        <div className="w-full flex justify-end">
                            <button className="border-2 border-cyan-500 pt-3 pb-3 pr-6 pl-6 rounded-lg" onClick={reset}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            );
        default:
            return (
                <div>

                </div>
            );
    }
}

function Payment({ list, products, removeItem, ws_nfc, reset }) {
    const [ totalPrice, setTotalPrice ] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        let total = 0;
        Object.entries(list).forEach((v) => {
            const price = products.filter((p) => p.name === v[0])[0].price;
            const count = v[1];

            total += price * count;
        });

        setTotalPrice(total);
    }, [list, products]);

    return (
        <motion.div className='flex flex-row w-full pt-8'>
            <div className="flex flex-col w-1/2 p-8">
                <h1 className="text-4xl">주문표</h1>
                <table className="w-full h-5/6 text-xl">
                    <thead>
                        <tr>
                            <th>상품명</th>
                            <th className="w-20">수량</th>
                            <th>금액</th>
                            <th className="w-12">삭제</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {
                            Object.entries(list).map((v, i) => 
                                <tr className="h-12 border-t border-gray-800" key={i}>
                                    <td>{v[0]}</td>
                                    <td>{v[1]}</td>
                                    <td>{products.filter((p) => p.name === v[0])[0].price * v[1]}</td>
                                    <td onClick={() => removeItem(v.id)} className="text-red-600 font-bold">X</td>
                                </tr>
                            )
                        }
                        <tr className="grow"></tr>
                        <tr className="h-12 border-t border-gray-800 text-3xl">
                            <td colSpan={2} className="font-bold text-left pl-32">
                                최종 가격
                            </td>
                            <td>{totalPrice.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="bg-slate-800 text-white flex flex-col w-1/2 h-screen">
                <h1 className="mt-40 ml-auto mr-auto text-5xl">결제방식을 선택해주세요</h1>

                <div className="mt-32 mr-auto ml-auto">
                    <button className="bg-white text-blue-800 text-3xl rounded-lg p-6 m-6"
                            onClick={() => navigate("/payment/card")}>
                        <FaCreditCard className="ml-auto mr-auto" size={72} />
                        카드결제
                    </button>
                    <button className="bg-white text-blue-800 text-3xl rounded-lg p-6 m-6"
                            onClick={() => navigate("/payment/cash")}>
                        <FaMoneyBillAlt className="ml-auto mr-auto" size={72} />
                        현금결제
                    </button>
                </div>
            </div>

            <PaymentOverlay reset={reset} />
        </motion.div>
    );
}

export default Payment;