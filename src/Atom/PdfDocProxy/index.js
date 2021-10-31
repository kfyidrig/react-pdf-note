import {Component} from "react";
import ControlLayer from "../ControlLayer";

class DocStore{
    constructor(rawProxy) {
        this.proxy=rawProxy;
        this.numPages=rawProxy.numPages;
        this.viewport=null;
        this.defaultPage=null;
        this.defaultViewport=null;
    }
    destructor(){
        this.proxy.destroy();
        this.proxy.cleanup();
        this.proxy=null;
    }

    _setViewport(idealWidth){
        if(!this.defaultViewport || !this.defaultPage) throw new TypeError('默认page或viewport为空');
        this.viewport= this.defaultPage.getViewport({
            scale: idealWidth/(this.defaultViewport.width)
        });
        return Promise.resolve(this.viewport);
    }

    setViewport(width){
        if(width){
            if(this.defaultViewport){
                return this._setViewport(width);
            } else {
                return this._getPageProxy(1).then(page=>{
                    this.defaultViewport = page.getViewport({scale: 1.0});
                    this.defaultPage=page;
                    return width;
                }).then(this._setViewport.bind(this));
            }
        } else {
            throw new TypeError('缺少必须参数width');
        }
    }
    _getPageProxy(pageNum){
        if(this.numPages<1) throw new RangeError(`pdf文档页数为${this.numPages}`);
        else if(pageNum<1 || pageNum>this.numPages) throw new RangeError(`加载第${pageNum}页，超出当前pdf文档页数范围`);
        return this.proxy.getPage(pageNum);
    }
    getCanvasData(pageNum){
        return this._getPageProxy(pageNum).then(pageProxy=>{
            if(!this.viewport) throw new TypeError('docStore未初始化viewport')
            const canvas=document.createElement('canvas');
            canvas.width=this.viewport.width;
            canvas.height=this.viewport.height;
            const context=canvas.getContext('2d');
            return new Promise(resolve => {
                pageProxy.render({
                    viewport: this.viewport,
                    canvasContext: context
                }).promise.then(()=>{
                    pageProxy.cleanup();
                    resolve(canvas);
                });
            })
        });
    }
}

export default class PdfDocProxy extends Component{
    state={
        docStore: null
    }

    static getDerivedStateFromProps(props,state){
        if(props.rawProxy===state.docStore?.proxy){
            return null;
        } else {
            return {
                docStore: new DocStore(props.rawProxy)
            };
        }
    }

    render() {
        return <ControlLayer docStore={this.state.docStore}/>
    }
}