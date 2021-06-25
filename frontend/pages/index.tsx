import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useEffect, useRef, useState} from "react";
import {TimeOfDay} from "../components/TimeOfDay";
import {Box, Tab, Tabs} from "@material-ui/core";
import EditLayers from "../components/EditLayers";
import Viewer from "../viewer/viewer";
import FlatPaper from "../components/FlatPaper";
import ToolBar from "../components/ToolBar";
import DataSourcesDialog from "../components/DataSourcesDialog";
import {NextPage} from "next";
import {observer} from "mobx-react-lite";
import ModelsDialog from "../components/ModelsDialog";
import EditModels from "../components/EditModels";


const Home: NextPage = observer(() => {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [viewer, setViewer] = useState<Viewer>()

    useEffect(() => {
        if (viewer) return;
        const x = new Viewer(canvasRef.current!);
        x.init().then(() => {
            setViewer(x);
        })
    }, [viewer])

    return (
        <div className={styles.container}>
            <Head>
                <title>CityLite by Parametricos</title>
                <meta name="description" content="Created by Parametricos ltd."/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <a className={styles.logo} href="https://parametricos.com" target="_blank" rel="noreferrer">
                <Image width={30} height={30} src="/parametricos.svg" alt="Parametricos Logo" />
            </a>

            <canvas id="map" ref={canvasRef} className={styles.canvas}/>
            <div id="copyright-notice" className={styles.copyright}/>

            {viewer && (
                <>
                    <Box
                        component={FlatPaper}
                        position="absolute"
                        left={10}
                        top={10}
                        width={360}
                        minHeight={600}
                        p={2}
                        display="flex"
                        flexDirection="column"
                    >
                        <Tabs
                            variant="scrollable"
                            textColor="primary"
                            value={viewer.tab}
                            onChange={(e, v) => viewer.tab = v}
                        >
                            <Tab label="Layers"/>
                            <Tab label="Models"/>
                        </Tabs>
                        {viewer.tab === 0 && (
                            <EditLayers manager={viewer.layer_manager}/>
                        )}
                        {viewer.tab === 1 && (
                            <EditModels manager={viewer.model_manager}/>
                        )}
                        <TimeOfDay sun={viewer.sun}/>
                    </Box>
                    <DataSourcesDialog
                        layerManager={viewer.layer_manager}
                        open={viewer.dataSourcesOpen}
                        onClose={() => viewer.dataSourcesOpen = false}
                        onLayerCreated={() => viewer.dataSourcesOpen = false}
                    />
                    <ModelsDialog
                        modelManager={viewer.model_manager}
                        open={viewer.modelsOpen}
                        onClose={() => viewer.modelsOpen = false}
                        onModelCreated={() => viewer.modelsOpen = false}
                    />
                    <ToolBar viewer={viewer}/>
                </>
            )}
        </div>
    )
})

export default Home;
