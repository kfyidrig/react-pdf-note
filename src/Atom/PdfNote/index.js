import {Component} from "react";
import PdfPageLayer from '../PdfPageLayer';
import ScrollOptimize from "../ScrollOptimize";

export default class PdfNote extends Component{
    state={
        viewport: null,
        styleScale: 0
    }

    componentDidMount(){
        this.props.docStore.setViewport(this.props.pageSize.width).then(viewport=>{
            this.setState({
                viewport,
                styleScale:viewport.height / viewport.width / devicePixelRatio
            });
        });
    }

    render() {
        if(!this.state.viewport) return null;
        const {width: pWidth} = this.props.pageSize;

        const pdfPageSize={
            width: pWidth/ devicePixelRatio,
            height: pWidth * this.state.styleScale
        };

        return <ScrollOptimize
            nodeSize={pdfPageSize}
            nodeCount={this.props.docStore.numPages}
            params={{docStore: this.props.docStore}}
        >
            {PdfPageLayer}
        </ScrollOptimize>
    }
}