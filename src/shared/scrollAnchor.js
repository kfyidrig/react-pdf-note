// const docPageMarginTop=20;

const scrollAnchor=(node,cur,nxt)=>{
    console.log(node.scrollTop)
    console.log(cur,nxt)
    node.scrollTop = node.scrollTop * nxt.height/cur.height
    console.log(node.scrollTop * nxt.height/cur.height)
}
export default scrollAnchor;