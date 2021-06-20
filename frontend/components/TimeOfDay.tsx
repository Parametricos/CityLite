import {FunctionComponent, MutableRefObject, useRef, useState} from "react";
import Sun from "../viewer/Sun";
import {observer} from "mobx-react-lite";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {DateTimePicker} from "@material-ui/pickers";
import {Box, Typography} from "@material-ui/core";
import FlatPaper from "./FlatPaper"; // choose your lib

export interface TimeOfDayProps {
    sun: Sun
}

export const TimeOfDay: FunctionComponent<TimeOfDayProps> = observer((props) => {

    const {sun} = props;

    const [open, setOpen] = useState(false)

    const handleChangeDate = (date: MaterialUiPickersDate) => {
        if(!date) return;
        sun.date = date.toDate();
    }

    return (
        <>
            <Box position='fixed' right={10} top={10} >
                <Box component={FlatPaper} display="flex" alignItems="center" justifyContent="center" flexDirection="column" p={2}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                        onClick={() => setOpen(true)}
                        style={{ cursor: "pointer" }}
                    >
                        <Typography variant="subtitle1" color="textSecondary">
                            Time/Date
                        </Typography>
                       <Typography variant="h3">
                           {sun.date.toLocaleTimeString()}
                       </Typography>
                       <Typography variant="h5" paragraph>
                           {sun.date.toDateString()}
                       </Typography>
                    </Box>
                    <Typography variant="subtitle1" color="textSecondary">
                        Location
                    </Typography>
                    <Typography variant="h6">
                        {sun.viewer.referencePosition.latitude.toFixed(7)}
                    </Typography>
                    <Typography variant="h6">
                        {sun.viewer.referencePosition.longitude.toFixed(7)}
                    </Typography>
                </Box>
                <DateTimePicker
                    style={{
                        opacity: 0,
                        position: "absolute"
                    }}
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    variant="inline"
                    value={sun.date}
                    onChange={handleChangeDate}
                />
            </Box>

        </>


    )
});