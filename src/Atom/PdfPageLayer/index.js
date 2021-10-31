import {Component,createRef} from "react";

export default class PdfPageLayer extends Component{
    _canvasRef=createRef()

    componentDidMount() {
        const {docStore,index}=this.props;
        if(!docStore || typeof index!=="number") throw new TypeError('缺少必须参数docStore或者index');
        // console.log(docStore)
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

    render() {
        return <canvas style={this.props.style} ref={this._canvasRef}/>
    }
}