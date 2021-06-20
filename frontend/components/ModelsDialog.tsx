import React, {FunctionComponent, useCallback, useState} from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle, Grid,
    Typography
} from "@material-ui/core";
import { GridColDef } from '@material-ui/data-grid';
import {useDropzone} from "react-dropzone";
import {observer} from "mobx-react-lite";
import Model, {ModelType} from "../viewer/models/Model";
import ModelManager from "../viewer/models/ModelManager";
import {GeoCoordinates} from "@here/harp-geoutils";
import Image from 'next/image'
import LoadingBackdrop from "./LoadingBackdrop";

interface ModelsDialogProps {
    modelManager: ModelManager,
    onModelCreated: Function
}

const ModelsDialog : FunctionComponent<ModelsDialogProps & DialogProps> = observer((props) => {

    const { modelManager, onClose, onModelCreated, ...rest} = props;

    const [loading, setLoading] = useState(false)


    const handleClose = (event: any) => {
        if (onClose) {
            onClose(event, "backdropClick")
        }
    }

    const loadFromUrl = useCallback(async (name: string, type: ModelType, url: string) => {
        setLoading(true);
        const model = new Model(name, modelManager.viewer.referencePosition)
        await model.loadData(url, type);
        modelManager.addModel(model)
        setLoading(false);
        onModelCreated()
    }, [modelManager, onModelCreated])
    
    const onDrop = useCallback(async (acceptedFiles) => {

        let type: ModelType = "ifc"

        const file = acceptedFiles[0];
        const extension = file.name.split(".").pop()

        switch (extension){
            case "ifc":
            {
                type = "ifc"
                break;
            }
            case "glb": {
                type = "glb"
            }
        }

        const url = window.URL.createObjectURL(file)
        await loadFromUrl(file.name, type, url)
    }, [loadFromUrl])

    const {getInputProps, open: openFileInput } = useDropzone({onDrop, accept: ".ifc"})

    return (
        <>
            <input {...getInputProps()} />

            <LoadingBackdrop open={loading}/>

            <Dialog maxWidth="md" fullWidth {...rest}>
                <DialogTitle>3D Models</DialogTitle>
                <DialogContent>

                    <Grid container justify="space-around" spacing={2}>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="space-between" pb={2} alignItems="center">
                                <Typography variant="subtitle1">Try one of our demo models or select your own</Typography>
                                <Button variant="outlined" onClick={openFileInput}>Select from file</Button>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <DemoModelBox
                                name="Cassini Hackathon Tower"
                                image={`${modelManager.viewer.resource_url}/images/cassini_hackathon_tower.png`}
                                model_url={`${modelManager.viewer.resource_url}/models/cassini_hackathon_tower.ifc`}
                                onLoad={(url: string) => loadFromUrl("Cassini Hackathon Tower", "ifc", url)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <DemoModelBox
                                name="Basic Revit House"
                                image={`${modelManager.viewer.resource_url}/images/basic_revit_house_2022.png`}
                                model_url={`${modelManager.viewer.resource_url}/models/basic_revit_house_2022.ifc`}
                                onLoad={(url: string) => loadFromUrl("Basic Revit House", "ifc", url)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <DemoModelBox
                                name="Modern Design House"
                                image={`${modelManager.viewer.resource_url}/images/modern_house.png`}
                                model_url={`${modelManager.viewer.resource_url}/models/modern_house.ifc`}
                                onLoad={(url: string) => loadFromUrl("Modern Design House", "ifc", url)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>

    )
});

interface DemoModelBoxProps {
    name: string,
    image: string,
    model_url: string,
    onLoad: Function
}

const DemoModelBox : FunctionComponent<DemoModelBoxProps> = (props) => {

    const handleClick = () => {
        props.onLoad(props.model_url)
    }

    return (
        <>
            <Typography variant="subtitle1" align="center" color="textSecondary">{props.name}</Typography>
            <Box
                height={290}
                bgcolor="white"
                overflow="hidden"
                style={{ cursor: "pointer" }}
                onClick={handleClick}
            >
                <Image
                    src={props.image}
                    height={300}
                    width={300}
                    quality={80}
                    alt={props.name}
                />
            </Box>
        </>
    )
}

export default ModelsDialog;