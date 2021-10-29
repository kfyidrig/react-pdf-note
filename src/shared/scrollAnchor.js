const docPageMarginTop = 20;

const scrollAnchor = (node, cur, nxt) => {
    const curPage = Math.floor(node.scrollTop / cur.height);
    // 由于margin没有被缩放所以需要计算偏移量补偿
    const offsetCompensation = (1-nxt.height/cur.height)*curPage*docPageMarginTop;
    node.scrollTop = node.scrollTop * nxt.height / cur.height + offsetCompensation;
}
export default scrollAnchor;