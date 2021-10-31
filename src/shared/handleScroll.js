const handlePosition=(changList,callbacks,laststate)=>{
    changList.forEach(item=>{
        const {page}=item.target.dataset;
        const {intersectionRatio} =item;
        if(!isNaN(+page)){
            if(intersectionRatio<0.01 && laststate[page]==='show'){
                laststate[page]='hidden';
                callbacks[page]?.('hidden');
            } else if(intersectionRatio>0 && laststate[page]==='hidden'){
                laststate[page]='show';
                callbacks[page]?.('show');
            }
        } else {
            console.warn('滚动监听发生错误');
        }
    })
}

export {handlePosition};