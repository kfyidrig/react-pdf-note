import {Component, createRef,PureComponent} from "react";
import css from './index.module.css';
import PdfNote from "../PdfNote";

export default class ControlLayer extends Component {
    _wrapRef = createRef()
    _listRef=createRef()

    state = {
        pageSize: {
            width: 0,
            height: 0
        }
    }

    handleScroll = (function (event) {
        if (event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();
            const {width} = this.state.pageSize,
                newWidth = width - event.deltaY;
            if (newWidth < 300 || newWidth > 1.5 * window.innerWidth) return;
            this.setState({
                pageSize: {
                    width: newWidth,
                    height: 0
                }
            });
        }
    }).bind(this)

    componentDidMount() {
        this._wrapRef.current.addEventListener('wheel', this.handleScroll, {
            passive: false,
            capture: true
        });
        const {clientWidth}=this._wrapRef.current;
        this.setState({
            pageSize: {
                width: clientWidth>1200? clientWidth * 0.75 : clientWidth,
                height: 0
            }
        })
    }

    componentWillUnmount() {
        this._wrapRef.current.removeEventListener('wheel', this.handleScroll, {
            passive: false,
            capture: true
        });
    }

    render() {
        const wrapNode = this._wrapRef.current;
        const wrapSize={
            width: wrapNode?.clientWidth || 0,
            height: wrapNode?.clientHeight || 0
        };
        return <div className={css.wrap} ref={this._wrapRef}>
            {this.state.pageSize.width ?
                <PdfNote
                    pageSize={this.state.pageSize}
                    docStore={this.props.docStore}
                    wrapSize={wrapSize}
                    ref={this._listRef}
                />
                :
                null
            }
        </div>
    }
}