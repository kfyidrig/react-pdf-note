const handlePosition=(changList,callbacks,lastStatus)=>{
    changList.forEach(item=>{
        const {page}=item.target.dataset;
        const {intersectionRatio} =item;
        if(!isNaN(+page)){
            if(intersectionRatio===0 && lastStatus[page]==='show'){
                lastStatus[page]='hidden';
                callbacks[page]?.('hidden');
            } else if(intersectionRatio>0.1 && lastStatus[page]==='hidden'){
                lastStatus[page]='show';
                callbacks[page]?.('show');
            }
        } else {
            console.warn('滚动监听发生错误');
        }
    })
}

export {handlePosition};