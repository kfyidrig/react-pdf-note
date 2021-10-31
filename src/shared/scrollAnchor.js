const docPageMarginTop = 20;

const scrollAnchor = (node, cur, nxt) => {
    console.log(cur,nxt)
    const curPage = Math.floor(node.scrollTop / cur.height);
    // 由于margin没有被缩放所以需要计算偏移量补偿
    console.log("当前页数为："+curPage)
    const offsetCompensation = (1-nxt.height/cur.height)*curPage*docPageMarginTop;
    console.log(node.scrollTop,offsetCompensation)
    node.scrollTop= node.scrollTop * nxt.height / cur.height + offsetCompensation;
    console.log(node.scrollTop)
}
export default scrollAnchor;