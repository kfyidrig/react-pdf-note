const docPageMarginTop = 20;

const scrollAnchor = (node, cur, nxt) => {
    console.log(node.scrollTop)
    console.log(cur, nxt)
    let curPage = Math.floor(node.scrollTop / cur.height);
    console.log("当前页数为：" + curPage)
    // 由于margin没有被缩放所以需要计算偏移量补偿
    let offsetCompensation = (1-nxt.height/cur.height)*curPage*docPageMarginTop;
    console.log("偏移量补偿为："+offsetCompensation)
    node.scrollTop = node.scrollTop * nxt.height / cur.height + offsetCompensation
    console.log(node.scrollTop)
}
export default scrollAnchor;