const handlePosition=(changList,callbacks,lastStatus)=>{
    changList.forEach(item=>{
        const {page}=item.target.dataset;
        const {intersectionRatio} =item;
        if(typeof (+page)==='number'){
            if(intersectionRatio===0 && lastStatus[page]==='show'){
                lastStatus[page]='hidden';
                callbacks[page]?.('hidden');
            } else if(intersectionRatio>0.1 && lastStatus[page]==='hidden'){
                lastStatus[page]='show';
                callbacks[page]?.('show');
            }
        }
    })
}

export {handlePosition};