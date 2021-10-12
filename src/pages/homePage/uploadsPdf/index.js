import {Box,FileInput} from "grommet";
import pdf2svg from "../../../utils/pdf2svg";
import {useState} from "react";
import style from './index.module.css';

export default function UploadsPdf() {
    const [svgArray,setSvg]=useState([]);
    const handleProgress=res=>{
        // setSvg([...svgArray,btoa(unescape(res))]);
        console.log(res)
    }
    const handleFile=event => {
        const filesList=event.target.files;
        if(filesList?.length){
            console.log(filesList)
            const [file]=filesList;
            if(file.type==='application/pdf'){
                const buffer=new FileReader();
                buffer.onload=function (res) {
                    pdf2svg(buffer.result,handleProgress)
                }
                buffer.readAsArrayBuffer(file);
            }
        }
    }
    return <Box
        fill='vertical'
        width='100%'
        pad='medium'
        overflow={{
            vertical: 'auto'
        }
        }
        flex={false}
    >
        <FileInput
            name="file"
            messages={{
                browse: "浏览",
                dropPrompt: "拖拽到此处上传，或者",
                remove: "删除",
            }}
            multiple={false}
            onChange={handleFile}
        />
        {svgArray.map((svg,index)=>{
            return <img key={`${index}${Date.now()}`} className={style.svgWarp} src={svg}/>
        })}
    </Box>
}