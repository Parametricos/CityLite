import React, {FunctionComponent, useState} from 'react'
import Color from "../viewer/layers/Color";
import {ColorResult, SketchPicker} from "react-color";
import {Box, Typography} from "@material-ui/core";
import FlatPaper from "./FlatPaper";

interface ColorPickerProps {
    value: Color,
    onChange: (color: Color) => any
}


const ColorPicker : FunctionComponent<ColorPickerProps> = (props) => {

    const { value, onChange } = props;

    const [showPicker, setShowPicker] = useState(false)

    const handleShowPicker = () => {
        setShowPicker(true)
    }

    const handleClosePicker = () => {
        setShowPicker(false)
    }

    const handleChange = (color: ColorResult) => {
        onChange(new Color(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a))
    }

    return (
        <>
            <div>
                <Box component={FlatPaper} p={0.8} onClick={handleShowPicker} minWidth={0} display='flex' alignItems="center" style={{ cursor: "pointer" }}>
                    <Box bgcolor={value.hex} width={52} height={20} borderRadius={2} />
                    <Box flexGrow={1} ml={2}>
                        <Typography variant="subtitle1" color='textSecondary'>{value.hex.toUpperCase()}</Typography>
                    </Box>
                </Box>
                {showPicker && (
                    <Box position="absolute" zIndex={2}>
                        <Box position="fixed" top={0} left={0} right={0} bottom={0} onClick={handleClosePicker}/>
                        <SketchPicker color={value.hex} onChange={handleChange} />
                    </Box>
                )}
            </div>
        </>
    )
}

export default ColorPicker;