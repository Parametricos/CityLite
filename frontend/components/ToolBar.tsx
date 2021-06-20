import React, { FunctionComponent } from 'react'
import {Box, Grid, IconButton, Tooltip} from "@material-ui/core";
import LayersIcon from '@material-ui/icons/Layers';
import StorageIcon from '@material-ui/icons/Storage';
import ApartmentIcon from '@material-ui/icons/Apartment';
import FlatPaper from "./FlatPaper";
import Viewer from "../viewer/viewer";
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import SatelliteIcon from '@material-ui/icons/Satellite';

interface ToolBarProps {
    viewer: Viewer
}

const ToolBar : FunctionComponent<ToolBarProps> = (props) => {

    const { viewer } = props;

    return (
        <Box
            component={FlatPaper}
            p={1}
            px={2}
            position="fixed"
            bottom={10}
            left="50%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{
                transform: "translate(-50%)",
                // opacity: 0.75
            }}
        >
            <Grid container spacing={2} justify="center">
                <Grid item>
                    <Tooltip title="Layers">
                         <span>
                            <IconButton onClick={() => viewer.tab = 0}>
                                <LayersIcon/>
                            </IconButton>
                         </span>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title="Data sources">
                         <span>
                            <IconButton onClick={() => viewer.dataSourcesOpen = true}>
                                <StorageIcon/>
                            </IconButton>
                         </span>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title="3D Models">
                         <span>
                            <IconButton onClick={() => {
                                viewer.modelsOpen = true;
                                viewer.tab = 1;
                            }}>
                                <ApartmentIcon/>
                            </IconButton>
                         </span>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title="IoT Devices">
                         <span>
                            <IconButton disabled>
                                <DeviceHubIcon/>
                            </IconButton>
                        </span>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title="Satellites">
                         <span>
                            <IconButton disabled>
                                <SatelliteIcon/>
                            </IconButton>
                        </span>
                    </Tooltip>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ToolBar;