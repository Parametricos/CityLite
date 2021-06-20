import React, { FunctionComponent } from 'react'
import {Backdrop, BackdropProps, CircularProgress, Typography} from "@material-ui/core";
import styled from "styled-components";
import {ErrorOutlined} from "@material-ui/icons";

const BackdropFlex = styled(Backdrop)`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  flex-direction: column;
  backdrop-filter: blur(2px);
  color: white;
`;

interface LoadingBackdropProps {
    error?: boolean,
    customErrorMessage?: string
}

const LoadingBackdrop : FunctionComponent<LoadingBackdropProps & BackdropProps> = (props) => {

    const { open, error, customErrorMessage } = props;

    const errorMessage = customErrorMessage || "An unexpected error has occurred!"

    return (
        <BackdropFlex open={open} style={{ zIndex: 2000 }}>
            {!error && (
                <>
                    <CircularProgress/>
                    <Typography align="center" variant="h6">Loading</Typography>
                </>
            )}
            {error && (
                <>
                    <ErrorOutlined color="error" fontSize="large"/>
                    <Typography align="center" variant="h6">{errorMessage}</Typography>
                </>
            )}
        </BackdropFlex>
    )
}

export default LoadingBackdrop;