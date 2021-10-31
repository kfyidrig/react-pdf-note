import {Component,createRef} from "react";

export default class PdfPageLayer extends Component{
    _canvasRef=createRef()
    componentDidMount() {
        const {docStore}=this.props.data;
        if(!docStore) throw new TypeError('缺少必须参数docStore');
        docStore.getCanvasData(this.props.index+1).then(imageData=>{
            if(this._canvasRef.current){
                this._canvasRef.current.width=imageData.width;
                this._canvasRef.current.height=imageData.height;
                const context=this._canvasRef.current.getContext("2d");
                context.drawImage(imageData,0,0);
            } else {

            }
        });
    }

    componentWillUnmount() {
        console.log('即将卸载第',this.props.index+1,'页')
    }

    render() {
        const {styleWidth,styleHeight}=this.props.data;
        const cssStyle={
            ...this.props.style,
            width: styleWidth,
            height: styleHeight
        };
        return <canvas style={cssStyle} ref={this._canvasRef}/>
    }
}