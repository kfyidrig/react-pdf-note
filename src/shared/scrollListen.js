import {handlePosition} from "./handleScroll";

let listener=null;
const callbacks= {};
const lastStatus={};

const handlePositionMid=changList=>{
    handlePosition(changList,callbacks,lastStatus);
}

const initScrollListener=container=>{
    if(listener) throw new Error('滚动监听已经存在');
    listener = new IntersectionObserver(handlePositionMid,{
        root: container,
        rootMargin: '0px',
        threshold: [0, 0.1,0.2,0.3,0.4,0.5,1]
    });
    console.log('滚动监听已初始化');
}

const addListenTarget=(element,pageNum,callback)=>{
    if(!listener) throw new TypeError('滚动监听实例listener为空');
    listener.observe(element);
    callbacks[pageNum]=callback;
    lastStatus[pageNum]='hidden';
}

const removeAllTarget=()=>{
    if(listener){
        listener.disconnect();
    }
}

export {addListenTarget,initScrollListener,removeAllTarget};