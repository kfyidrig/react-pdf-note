import {Component,Fragment} from "react";
import {getPdfDoc} from "../../shared/pdf2png";
import PdfProgress from "../PdfProgress";
import PdfDocProxy from "../PdfDocProxy";

export default class PdfLoadTask extends Component{
    constructor(props) {
        super(props);
        this.state={
            task: null,
            rawProxy: null,
            pdfUrl: 'undefined'
        };
    }

    static getDerivedStateFromProps(props, state){
        if(props.pdfUrl===state.pdfUrl) {
            return null;
        } else {
            return {
                pdfUrl: props.pdfUrl,
                task: getPdfDoc(props.pdfUrl)
            }
        }
    }

    handleNewUrl(task){
        task.promise.then(proxy=>{
            this.setState({
                task: null,
                rawProxy: proxy
            });
        });
    }

    render() {
        const {task,rawProxy}=this.state;
        if(task) {
            this.handleNewUrl(task);
            return <PdfProgress task={task}/>
        }
        return <PdfDocProxy rawProxy={rawProxy}/>
    }
}