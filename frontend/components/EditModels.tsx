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
import ModelManager from "../viewer/models/ModelManager";

interface EditModelsProps {
    manager: ModelManager
}

const EditModels : FunctionComponent<EditModelsProps> = observer((props) => {

    const { manager } = props;

    return (
        <Box my={1} display='flex' flexDirection="column" flexGrow={1}>
            {manager.models.length === 0 && (
                <Box display="flex" alignItems="center" justifyContent="center" height="100%" flexGrow={1}>
                    <Typography variant="subtitle2" color="textSecondary">Add some models to get started</Typography>
                </Box>
            )}
            {manager.models.map((model) => (
                <Accordion key={model.id} variant="outlined" defaultExpanded >
                    <AccordionSummary expandIcon={model.enabled ? <ExpandMoreIcon /> : null} >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2">{model.name}</Typography>
                            <Box ml={1}>
                                <Switch
                                    size="small"
                                    checked={model.enabled}
                                    onClick={(event) => {
                                        event.stopPropagation()
                                    }}
                                    onChange={(event) => {
                                        event.stopPropagation()
                                        model.enabled = event.target.checked
                                        manager.viewer.map.update()

                                    }}
                                />
                            </Box>
                        </Box>
                    </AccordionSummary>
                    {model.enabled && (
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box mt={2} mb={2} display="flex" alignItems="center" justifyContent="space-between">
                                        <Typography variant="subtitle2">Location</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        label='Latitude'
                                        value={model.latitude}
                                        inputProps={{
                                            step: 0.00001
                                        }}
                                        type="number"
                                        onChange={(e) => {
                                            model.latitude = Number(e.target.value)
                                            manager.viewer.map.update()
                                        }}
                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        label='Longitude'
                                        inputProps={{
                                            step: 0.00001
                                        }}
                                        value={model.longitude}
                                        type="number"
                                        onChange={(e) => {
                                            model.longitude = Number(e.target.value)
                                            manager.viewer.map.update()
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    )}
                </Accordion>
            ))}
        </Box>
    )
})

export default EditModels;