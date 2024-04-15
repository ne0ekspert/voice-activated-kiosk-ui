function Item({v}) {
    return (
        <div className="flex border">
            <span>{v.name}</span>
            <span>{v.price}</span>
        </div>
    )
}

function Payment({ list }) {
    return (
        <div className="flex flex-col h-screen">
            <div className="border-b-2 border-b-black flex flex-col ">
                <span className="text-5xl font-bold mb-3">주문내역</span>
                <span className="text-xl mb-3">대충 글 넣으시오</span>
            </div>
            <div className="grow">
                {list?.map((v, i) => (
                    <Item info={v} />
                ))}
            </div>
            <div>
                <span className="text-xl mr-2">총액</span>
                <span className="text-3xl font-bold">{list?.reduce((a, b) => a.price * a.count + b.price * b.count) ?? 0}</span>
            </div>
        </div>
    );
}

export default Payment;