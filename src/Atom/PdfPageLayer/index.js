import {Component,createRef} from "react";

export default class PdfPageLayer extends Component{
    _canvasRef=createRef()

    _renderTaskId=0

    _2dContext=null

    static renderCanvasContext(self){
        const {docStore,index}=self.props;
        if(!docStore || typeof index!=="number") throw new TypeError('缺少必须参数docStore或者index');
        docStore.getCanvasData(self.props.index+1).then(imageData=>{
            if(self._canvasRef.current){
                self._canvasRef.current.width=imageData.width;
                self._canvasRef.current.height=imageData.height;
                if(self._2dContext){
                    self._2dContext.drawImage(imageData,0,0);
                } else {
                    const context=self._canvasRef.current.getContext("2d");
                    self._2dContext=context;
                    context.drawImage(imageData,0,0);
                }
            }
        });
    }

    static cancelAsyncTask(self){
        clearTimeout(self._renderTaskId);
        self._renderTaskId=0;
    }

    static createAsyncTask(self,delay){
        self._renderTaskId=setTimeout(PdfPageLayer.renderCanvasContext.bind(null,self),delay);
    }

    componentDidMount() {
        PdfPageLayer.createAsyncTask(this,0);
    }

    componentDidUpdate() {
        PdfPageLayer.cancelAsyncTask(this);
        PdfPageLayer.createAsyncTask(this,200);
    }

    shouldComponentUpdate(prevProps) {
        return prevProps.style !== this.props.style;
    }

    componentWillUnmount() {
        PdfPageLayer.cancelAsyncTask(this);
    }

    render() {
        return <canvas style={this.props.style} ref={this._canvasRef}/>
    }
}