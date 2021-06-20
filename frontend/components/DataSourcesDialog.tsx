import React, {FunctionComponent, useCallback, useState} from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle, Grid,
} from "@material-ui/core";
import LayerManager from "../viewer/layers/LayerManager";
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import {toJS} from "mobx";
import {DataSourceTypes} from "../viewer/layers/DataSourceTypes";
import {nanoid} from "nanoid";
import DataSource from "../viewer/layers/DataSource";
import {useDropzone} from "react-dropzone";
import {observer} from "mobx-react-lite";
import CreateLayerDialog from "./CreateLayerDialog";
import GeoJsonLayer from "../viewer/layers/GeoJsonLayer";

interface DataSourcesDialogProps {
    layerManager: LayerManager,
    onLayerCreated: Function
}

const DataSourcesDialog : FunctionComponent<DataSourcesDialogProps & DialogProps> = observer((props) => {

    const { layerManager, onClose, onLayerCreated, ...rest} = props;

    const [createNewLayer, setCreateNewLayer] = useState(false);
    const [selectedDataSource, setSelectedDataSource] = useState<DataSource>()

    const handleCreateLayer = (id: string) => {
        const dataSource = layerManager.getDatasource(id);
        setSelectedDataSource(dataSource);
        setCreateNewLayer(true);
    }

    const handleDeleteDataSource = async (id: string) => {
        await layerManager.deleteDataSource(id);
    }

    const handleNewLayerCreated = (layer: GeoJsonLayer) => {
        setCreateNewLayer(false);
        setSelectedDataSource(undefined);
        onLayerCreated()
    }

    const handleCancelNewLayer = () => {
        setCreateNewLayer(false)
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 140 },
        {
            field: 'name',
            headerName: 'Name',
            width: 250,
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 150,
        },
        {
            field: 'demo',
            headerName: 'Demo',
            width: 150,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            headerAlign: "right",
            align: "right",
            flex: 1,
            // eslint-disable-next-line react/display-name
            renderCell: (cell) => {
                return (
                    <Grid container spacing={2} justify="flex-end">
                        <Grid item>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    handleCreateLayer(cell.row.id)
                                }}
                            >
                                Create layer
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                size="small"
                                disabled={cell.row.demo}
                                variant="outlined"
                                onClick={async (event) => {
                                    event.stopPropagation()
                                    await handleDeleteDataSource(cell.row.id)
                                }}
                            >
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                )
            }
        }
    ];

    const handleClose = (event: any) => {
        if (onClose) {
            onClose(event, "backdropClick")
        }
    }

    const onDrop = useCallback(async (acceptedFiles) => {

        let type: DataSourceTypes = "geojson"

        const file = acceptedFiles[0];
        const extension = file.name.split(".").pop()

        switch (extension){
            case "geojson":
            case "json":
            {
                type = "geojson"
                break;
            }
            case "shp": {
                type = "shp"
            }
        }

        const id = nanoid();
        const datasource = new DataSource(id, file.name, type)
        await datasource.setData(file);

        layerManager.dataSources.push(datasource);
    }, [layerManager.dataSources])

    const {getInputProps, open: openFileInput } = useDropzone({onDrop, accept:".json, .geojson"})

    return (
        <>
            <input {...getInputProps()} />

            {selectedDataSource && (
                <CreateLayerDialog
                    open={createNewLayer}
                    dataSource={selectedDataSource}
                    onCreated={handleNewLayerCreated}
                    onClose={handleCancelNewLayer}
                    layerManager={layerManager}
                />
            )}

            <Dialog maxWidth="md" fullWidth {...rest}>
                <DialogTitle>Data Sources</DialogTitle>
                <DialogContent>
                    <Box display="flex" justifyContent="flex-end" pb={1}>
                        <Button variant="outlined" onClick={openFileInput}>Add</Button>
                    </Box>
                    <Box minHeight={500} display='flex' flexDirection="column">
                        <DataGrid
                            rows={layerManager.dataSources.map((x) => ({
                                ...toJS(x),
                                "actions": null
                            }))}
                            columns={columns}
                            pageSize={5}
                            disableColumnSelector
                            disableDensitySelector
                            disableExtendRowFullWidth
                            disableColumnMenu
                            disableSelectionOnClick
                            isRowSelectable={() => false}
                        />
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>

    )
});

export default DataSourcesDialog;