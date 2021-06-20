import React, {CSSProperties} from "react";
import {Box, Grid, Switch, Typography} from "@material-ui/core";
// @ts-ignore
import { ChromePicker } from 'react-color'
import styled from 'styled-components';
import Color from "../viewer/layers/Color";


interface Props {
    name: string
    colorEnabled: boolean,
    initialColor: Color,
    onChangeColor: Function,
    onToggleColor: Function
}

interface State {
    displayColorPicker: boolean,
    color: Color
}

export default class LayerColorProperty extends React.Component<Props, State>{

    state: State = {
        displayColorPicker: false,
        color: new Color(80, 80, 80, 80)
    };

    componentDidMount(): void {
        this.setState({color: this.props.initialColor})
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleColorChange = (color: any) => {
        const newColor = new Color(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a);
        const { onChangeColor } = this.props;
        this.setState({color: newColor});
        if(onChangeColor)  onChangeColor(newColor)
    };

    handleToggleColor = () => {
        const { onToggleColor } = this.props;
        if(onToggleColor)  onToggleColor(!this.props.colorEnabled);
    };

    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { colorEnabled, name} = this.props;

        const { color } = this.state;

        const popover = {
            position: "absolute",
            zIndex: '2',
        };

        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        };

        const ColorBox = styled.div`
                width: 100px;
                height: 25px;
                borderRadius: 2px;
                background: rgba(${color.R}, ${color.G}, ${color.B}, ${color.A});
            },
        `;



        return (
            <Box my={2}>
                { this.state.displayColorPicker ?
                        <div style={popover as CSSProperties}>
                            <div style={ cover as CSSProperties} onClick={ this.handleClose }/>
                            <ChromePicker color={{ r: color.R, g: color.G, b: color.B, a: color.A}} onChangeComplete={ this.handleColorChange }/>
                        </div> : null }
                <Grid container justify='space-between' spacing={1}>
                    <Grid item>
                        <Typography variant='caption'>{name}</Typography>
                    </Grid>
                    <Grid item>
                       <Switch size="small" checked={colorEnabled} onChange={this.handleToggleColor}/>
                    </Grid>
                    <Grid item xs={12}>
                       <ColorBox onClick={this.handleClick}/>
                    </Grid>
                </Grid>
            </Box>
        )
    }
}