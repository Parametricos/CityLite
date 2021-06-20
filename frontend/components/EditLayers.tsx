import React, {FunctionComponent} from 'react'
import LayerManager from "../viewer/layers/LayerManager";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box,
    Grid,
    Switch,
    TextField, Typography
} from "@material-ui/core";
import {observer} from "mobx-react-lite";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ColorPicker from "./ColorPicker";

interface EditLayersProps {
    manager: LayerManager
}

const EditLayers : FunctionComponent<EditLayersProps> = observer((props) => {

    const { manager } = props;

    return (
        <Box my={1} display='flex' flexDirection="column" flexGrow={1}>
            {manager.layers.length === 0 && (
                <Box display="flex" alignItems="center" justifyContent="center" flexGrow={1}>
                    <Typography variant="subtitle2" color="textSecondary">Create some layers to get started</Typography>
                </Box>
            )}
            {manager.layers.map((layer) => (
                <>
                    <Accordion key={layer.id} variant="outlined" defaultExpanded >
                        <AccordionSummary expandIcon={layer.enabled ? <ExpandMoreIcon /> : null} >
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography variant="subtitle2">{layer.name}</Typography>
                                <Box ml={1}>
                                    <Switch
                                        size="small"
                                        checked={layer.enabled}
                                        onClick={(event) => {
                                            event.stopPropagation()
                                        }}
                                        onChange={(event) => {
                                            event.stopPropagation()
                                            layer.enabled = event.target.checked
                                        }}
                                    />
                                </Box>
                            </Box>
                        </AccordionSummary>
                        {layer.enabled && (
                            <AccordionDetails>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Box mt={2} mb={2} display="flex" alignItems="center" justifyContent="space-between">
                                            <Typography variant="subtitle2">Stroke</Typography>
                                            <Box ml={1} >
                                                <Switch
                                                    size="small"
                                                    checked={layer.stroke}
                                                    onChange={(v) => layer.stroke = v.target.checked}
                                                />
                                            </Box>
                                        </Box>
                                    </Grid>
                                    {layer.stroke && (
                                        <>
                                            <Grid item xs={12}>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    label='Width'
                                                    value={layer.stroke_width}
                                                    type="number"
                                                    onChange={(e) => layer.stroke_width = Number(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <ColorPicker value={layer.stroke_color} onChange={(c) => layer.stroke_color = c} />
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item xs={12}>
                                        <Box mt={2} mb={2} display="flex" alignItems="center" justifyContent="space-between">
                                            <Typography variant="subtitle2">Fill</Typography>
                                            <Box ml={1}>
                                                <Switch
                                                    size="small"
                                                    checked={layer.fill}
                                                    onChange={(v) => layer.fill = v.target.checked}
                                                />
                                            </Box>
                                        </Box>
                                    </Grid>
                                    {layer.fill && (
                                        <>
                                            <Grid item xs={12}>
                                                <ColorPicker value={layer.fill_color} onChange={(c) => layer.fill_color = c} />
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item xs={12}>
                                        <Box mt={2} mb={2} display="flex" alignItems="center" justifyContent="space-between">
                                            <Typography variant="subtitle2">Points</Typography>
                                            <Box ml={1}>
                                                <Switch
                                                    size="small"
                                                    checked={layer.points}
                                                    onChange={(v) => layer.points = v.target.checked}
                                                />
                                            </Box>
                                        </Box>
                                    </Grid>
                                    {layer.points && (
                                        <>
                                            <Grid item xs={12}>
                                                <ColorPicker value={layer.point_color} onChange={(c) => layer.point_color = c} />
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </AccordionDetails>
                        )}
                    </Accordion>
                </>
            ))}
        </Box>
    )
})

export default EditLayers;