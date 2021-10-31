import {Component,forwardRef} from "react";
import {FixedSizeList} from 'react-window';
import PdfPageLayer from '../PdfPageLayer';

class RawPdfNote extends Component{
    state={
        viewport: null,
        styleScale: 0
    }

    _lastStyleSize={
        styleWidth: 0,
        styleHeight: 0,
    }

    componentDidMount(){
        this.props.docStore.setViewport(this.props.pageSize.width).then(viewport=>{
            this.setState({
                viewport,
                styleScale:viewport.height / viewport.width / devicePixelRatio
            });
        });
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if(prevProps.pageSize.width!==this.props.pageSize.width){
    //         const preHeight=prevProps.pageSize.width*this.state.styleScale;
    //         const curHeight=this.props.pageSize.width*this.state.styleScale;
    //         const curScroll=this.props.parentRef.current?._outerRef.scrollTop;
    //         if(curScroll){
    //             this.props.parentRef.current.scrollTo(curScroll*curHeight/preHeight)
    //         }
    //     }
    // }

    render() {
        if(!this.state.viewport) return null;
        const {width: pWidth} = this.props.pageSize;
        const {width: wWidth, height: wHeight} = this.props.wrapSize;
        const itemData={
            docStore: this.props.docStore,
            styleWidth: pWidth/ devicePixelRatio,
            styleHeight: pWidth * this.state.viewport.height / this.state.viewport.width / devicePixelRatio
        };
        // if(this._lastStyleSize.styleHeight&&this._lastStyleSize.styleHeight!==itemData.styleHeight){
        //     const preHeight=this._lastStyleSize.styleHeight;
        //     const curScroll=this.props.parentRef.current._outerRef.scrollTop;
        //     const curHeight=itemData.styleHeight
        //     console.log(2333)
        //     this.props.parentRef.current._outerRef.scrollTop=(curScroll*curHeight/preHeight)
        // }
        this._lastStyleSize=itemData;
        return <FixedSizeList
            ref={this.props.parentRef}
            height={wHeight-1}
            itemSize={itemData.styleHeight}
            width={wWidth}
            itemData={itemData}
            scrollTop={70}
            itemCount={this.props.docStore.numPages}
        >
            {PdfPageLayer}
        </FixedSizeList>
    }
}

export default forwardRef(function PdfNote(props,ref) {
    return <RawPdfNote {...props} parentRef={ref} />
});