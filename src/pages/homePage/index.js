import {useState} from "react";
import {Box, Collapsible, Layer, ResponsiveContext, Text} from "grommet";
import {Upload} from "grommet-icons";
import UploadsPdf from "./uploadsPdf";

const AppBar = (props) => (
    <Box
        tag='header'
        direction='row'
        align='center'
        justify='between'
        background='green'
        pad={{left: 'medium', right: 'small', vertical: 'small'}}
        elevation='medium'
        style={{zIndex: '1000'}}
        {...props}
    />
);

export default function HomePage(){
    const [showSidebar, setShowSidebar] = useState(true);
    const handleClick=() => setShowSidebar(!showSidebar);
    return <ResponsiveContext.Consumer>
        {size => (
            <Box fill>
                <AppBar gap='none'>
                    <Text size='large' weight='bold'>文档列表</Text>
                    <Upload size='24' onClick={handleClick} style={{cursor:'pointer'}}/>
                </AppBar>
                <Box direction='row' flex overflow={{horizontal: 'hidden'}}>
                    <Box flex align='center' justify='center'>
                        <UploadsPdf />
                    </Box>
                    {(!showSidebar || size !== 'small') ? (
                        <Collapsible direction="horizontal" open={showSidebar}>
                            <Box
                                pad='medium'
                                fill='vertical'
                                width='medium'
                                background='light-2'
                            >文档列表</Box>
                        </Collapsible>
                    ) : (
                        <Layer>
                            <Box
                                margin={{top: 'large'}}
                                background='light-2'
                            >
                            </Box>
                        </Layer>
                    )}
                </Box>
            </Box>
        )}
    </ResponsiveContext.Consumer>
}