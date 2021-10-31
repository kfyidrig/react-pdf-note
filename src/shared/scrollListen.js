import {handlePosition} from "./handleScroll";

let listener=null;
const callbacks= {};
const laststate={};

const handlePositionMid=changList=>{
    handlePosition(changList,callbacks,laststate);
}

const initScrollListener=container=>{
    if(listener) throw new Error('滚动监听已经存在');
    listener = new IntersectionObserver(handlePositionMid,{
        root: container,
        rootMargin: '0px',
        threshold: [0.1,0.9]
    });
    console.log('滚动监听已初始化');
}

const addListenTarget=(element,pageNum,callback)=>{
    if(!listener) throw new TypeError('滚动监听实例listener为空');
    listener.observe(element);
    callbacks[pageNum]=callback;
    laststate[pageNum]='hidden';
}

const removeTarget=target=>{
    if(listener){
        listener.unobserve(target);
    }
}

export {addListenTarget,initScrollListener,removeTarget};