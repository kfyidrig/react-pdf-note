import {Component} from "react";

export default class PdfProgress extends Component{
    state={
        progress: 0,
        mbSize: ''
    }

    handleProgress({total,loaded}){
        const newState={};
        if(!this.state.mbSize){
            newState.mbSize=`${(total / 1024 /1024).toFixed(2)} MB`;
        }
        newState.progress=`${(100* loaded / total).toFixed(1)}%`;
        this.setState(newState);
    }

    componentDidMount() {
        const {task}=this.props;
        if(task?.onProgress) throw new TypeError('缺少必要参数');
        task.onProgress=this.handleProgress.bind(this);
    }

    render() {
        const {progress,mbSize}=this.state;
        return <div>
            {progress} {mbSize}
        </div>
    }
}