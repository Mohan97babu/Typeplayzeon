import { Col, Row, Form, Button, Offcanvas, Table, Spinner ,Badge } from "react-bootstrap";
import { Icon } from "@iconify/react";
import React, { useState, ChangeEvent, useEffect } from "react";
import Select from 'react-select';
import { BookingType } from "../../utils/Data";
import { Time, Days, TableAddPlayers, TablePricing } from "../../utils/Data";
import Moment from "react-moment";
import moment from "moment";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { eachDayOfInterval, getDay } from 'date-fns';
import "../../assets/Css/App.css";
import { Formik } from "formik";
import * as yup from "yup";


interface bookingDetails {
    bookingType: string;
    facilityType: string;
    bookingOccurence: string;
    frequency: string;
    startDate: Date | null;
    endDate: Date | null;
    startTime: string;
    endTime: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    pricingRule: string,
    facilities: string,
    notes: string;
    facilityCheck: string;
    pricingRuleCheck: string;
    selectedDays: any[];
}
interface calendarDetails {
    facilityType: string;
    facilities: string;
    date: Date;
    sportsId: any
}
interface apiResponse {
    facilityType: any[];
    facilities: any;
    pricingrule: [];
    calendarDetails: [];
    checkFacility:[];
}
const CustomDayView = ({ date, events }) => {
    return (
        <div>
            <h2>Fixed Header</h2>
            <h2>{date.toLocaleDateString()}</h2>
            {/* Render events or any other content */}
            {events.map((event) => (
                <div key={event.id}>{event.title}</div>
            ))}
        </div>
    );
};
const CustomDayHeader = ({ date }) => {
    return (
        <div>
            <h2>Custom Header</h2>
            <h2>{date.toLocaleDateString()}</h2>
        </div>
    );
};

const Reservation: React.FC<{ bookingDetails: bookingDetails, setBookingDetails: React.Dispatch<React.SetStateAction<bookingDetails>> }> = ({ bookingDetails, setBookingDetails }) => {
    const [show, setShow] = useState(false);
    const [addShow, setAddShow] = useState(false)
    const [bookShow, setBookShow] = useState(false);
    const [appearForm,setAppearForm] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [perCost, setPerCost] = useState("");
    const [disable, setDisable] = useState(false);
    const [sportsId, setSportsId] = useState(0);
    const [spinner, setSpinner] = useState(true);
    const [nameDisClose,setNameDisclose] = useState(false)
    const [time, setTime] = useState({
        start: "",
        end: "",
    })
    const [eventData, setEventData] = useState([]);
    const [addPlayers, setAddPlayers] = useState({
        firstName: "" || "Name Not Disclosed",
        lastName: "" || "Name Not Disclosed",
        nameDiscloseCheck: false,
        sameAsPrimary: false,
        addFacilityCheck: "",
        addPricingCheck: "",
        cost: "",
    })
    const [editAddPlayer,setEditAddPlayer] = useState({
        check:false,
        index :"",
    })
    const [addPlayersData, setAddPlayersData] = useState<any>([]);
    // const [facilityType,setFacilityType] = useState([]);
    const [calendarDetails, setCalendarDetails] = useState<calendarDetails>({
        facilityType: "",
        facilities: "",
        date: new Date(),
        sportsId: ""
    })
    console.log(addPlayers.nameDiscloseCheck, "457")

    const [apiResponse, setApiResponse] = useState<apiResponse>({
        facilityType: [],
        facilities: {},
        pricingrule: [],
        calendarDetails: [],
        checkFacility :[],
        
    })
    const centerId = localStorage.getItem("centerId");
    const schema = yup.object().shape({
        firstName: yup.string().required("firstName is a Required Field"),
        lastName: yup.string().required("lastName is a Required Field"),
        emailAddress: yup.string().email().required("emailAddress is a Required Field"),
        phoneNumber: yup.string().required("phoneNumber is a Required Field"),
        facility: yup.string().required('Facility selection is required'), // Validation for the radio button group
        // Define the pricingRule field with conditional validation
        pricingRule: yup.string().required(),
    })


    const handleAddPlayerOpen = () => { setAddShow(true) }
    const handleAddPlayerClose = () => { setAddShow(false); clearState() }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleOpenBookPreview = () => setBookShow(true);
    const handleCloseBookPreview = () => { setBookShow(false); };

    const tempURL = process.env.REACT_APP_BASEURLTEMP;
    const orgURL = process.env.REACT_APP_BASEURLORG;
    const [errors, setErrors] = useState({});
    const handleToggleDisable = () => {
        setDisable(prevDisable => !prevDisable);
    };
    const handleFormikSubmit = (event: any) => {
        console.log(bookingDetails, event, "details");
         setBookingDetails({ ...bookingDetails, firstName: event.firstName, lastName: event.lastName, emailAddress: event.emailAddress, phoneNumber: event.phoneNumber, pricingRuleCheck: event.pricingRule, facilityCheck: event.facility })
        //     event.preventDefault(); // Prevent default form submission

        // try {
        //     await schema.validate(bookingDetails, { abortEarly: false });
        //     // Validation passed, reset errors state
        //     setErrors({});
        //     // Proceed with form submission
        //     console.log("Form submitted successfully:", bookingDetails);
        // } catch (validationErrors) {
        //     // Validation failed, set errors state
        //     const errorsObj = {};
        //     validationErrors.inner.forEach(error => {
        //         errorsObj[error.path] = error.message;
        //     });
        //     setErrors(errorsObj);
        // }
        //  setDisable(true);
        handleToggleDisable();
        // setSubmitting(false);
    }
    // console.log(bookingDetails,"out")
    console.log(disable, "disable");

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        //   const { name, value } = e.target;
        console.log(e.target.name, e.target.value, "value");
        setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
        if (e.target.name === "bookingOccurence") {
            setBookingDetails({ ...bookingDetails, startDate: null, endDate: null, startTime: "", endTime: "", bookingOccurence: e.target.value });
            setStartTime(null);
            setEndTime(null);
        }
        console.log("edited")
    }
    const handleRadioAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddPlayers({ ...addPlayers, [e.target.name]: e.target.value });
        //      clearState();

    }
    const clearState = () => {
        setAddPlayers({ firstName: "", lastName: "", nameDiscloseCheck: false, sameAsPrimary: false, addFacilityCheck: "", addPricingCheck: "", cost: "" });
    }
    const deleteRow = (index) => {
        const dataRow = [...addPlayersData];
        dataRow.splice(index, 1);
        setAddPlayersData(dataRow);

    }
    const handleBookingCost = (pricing: any) => {
        console.log(pricing?.pricingRule, "cost");
        setPerCost(pricing?.pricingRule?.cost);
        
            setAddPlayers({ ...addPlayers, cost: pricing?.pricingRule?.cost });
        
    }
   
    const handleAddPlayer = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log(e.target.checked, "datacheck");
        if (e.target.name === "nameDiscloseCheck" || e.target.name === "sameAsPrimary") {
            setAddPlayers({ ...addPlayers, [e.target.name]: e.target.checked });
        }
        else {

            console.log(e.target.value, "vaal");
            setAddPlayers({ ...addPlayers, [e.target.name]: e.target.value });
        }

    }
    //  console.log(addPlayers, "addplayers")
    const listFacilities = async (sportsId: any) => {
        setSportsId(sportsId)
        await axios.get(`${tempURL}/api/v1/facilities?sportId.equals=${sportsId}&centerId.equals=${centerId}`)
            .then((response) => setApiResponse((prev) => ({ ...prev, facilities: response.data })))
            .catch((err) => console.log(err))
    }
    const handleCalendarChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>, sportsId: any) => {
        console.log(e.target.value, "valuetarget");

        const selectedFacilityTitle = e.target.value;
        const selectedFacility = apiResponse.facilityType.find((facility) => facility.title === selectedFacilityTitle);
        sportsId = selectedFacility ? selectedFacility.sport.id : null;

        setCalendarDetails({
            ...calendarDetails,
            facilityType: selectedFacilityTitle,
            sportsId: sportsId
        });

        listFacilities(sportsId);

    }
    const handleDateCalendar = (selectedDate: any) => {
        setCalendarDetails({ ...calendarDetails, date: selectedDate })
    }
    useEffect(() => {
        if (bookingDetails.bookingOccurence === "Single Booking") {

            setBookingDetails({ ...bookingDetails, endDate: bookingDetails.startDate });
        }


    }, [bookingDetails.startDate])
    useEffect(() => {
        const listSports = async () => {
            await axios.get(`${tempURL}/api/v1/sport-photos`)
                .then((response) => {
                    setApiResponse({ ...apiResponse, facilityType: response.data });
                    setSpinner(false);
                    listFacilities(1)
                })
                .catch((err) => console.log(err));
        }
        listSports();
        fetchEventData();
    }, []);


    const handleBookFacility = async (type: any) => {
        setBookingDetails({ ...bookingDetails, facilities: type.name });
        console.log(type.id, "type")
        await axios.get(`${tempURL}/api/v1/pricing-rules?centerId=${centerId}&facilityIds=${type?.id}`)
            .then((response) => { setApiResponse({ ...apiResponse, pricingrule: response.data }) })
            .catch(err => console.log(err))
    }
    const handleReactSelectChange = (selectedOption: any, actionMeta: any) => {
        const name = actionMeta.name || 'defaultName';
        const value = selectedOption.value;
        if (name === 'startTime') {
            setStartTime(value);
        } else if (name === 'endTime') {
            setEndTime(value);
        }
        setBookingDetails({ ...bookingDetails, [name]: value });
    }
    const handleDateChange = (selectedDate: Date | null) => {

        if (bookingDetails.startDate === null) {

            setBookingDetails({ ...bookingDetails, startDate: selectedDate });
        }
        else {
            setBookingDetails({ ...bookingDetails, endDate: selectedDate })
        }

    };
    // const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // const handleDateChange = (selectedDate) => {
    //     const interval = 13; // Example: 2 weeks minus 1 day
    //     const days = [];
    //     if (bookingDetails.startDate === null) {
    //       setBookingDetails(prevState => ({
    //         ...prevState,
    //         startDate: selectedDate,
    //         selectedDays: []
    //       }));
    //     } else {
    //       const startDate = new Date(bookingDetails.startDate);
    //       const endDate = new Date(selectedDate);
    //       endDate.setDate(startDate.getDate() + interval - 1); // Set end date based on start date and interval
    //       for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    //         days.push(daysOfWeek[date.getDay()]);
    //       }
    //       setBookingDetails(prevState => ({
    //         ...prevState,
    //         endDate: selectedDate,
    //         selectedDays: days
    //       }));
    //     }
    //   };
    // const getDatesBetween = (startDate, endDate) => {
    //     return eachDayOfInterval({ start: startDate, end: endDate });
    // };
    // const datesInRange = bookingDetails.startDate && bookingDetails.endDate ?
    //     getDatesBetween(new Date(bookingDetails.startDate), new Date(bookingDetails.endDate)) :
    //     [];
    // const getDatesBetween = (startDate, endDate) => {
    //     return eachDayOfInterval({ start: startDate, end: endDate });
    // };

    // const getSelectedDays = (startDate, endDate) => {
    //     const datesInRange = getDatesBetween(startDate, endDate);
    //     return datesInRange.map(date => daysOfWeek[getDay(date)]);
    // };


    // const selectedDays = datesInRange.map(date => daysOfWeek[getDay(date)]);
    // const handleCheckboxChange = (day) => {
    //     const index = selectedDays.indexOf(day);
    //     if (index === -1) {
    //         setBookingDetails({
    //             ...bookingDetails,
    //             startDate: null, // Reset startDate and endDate when selecting individual days
    //             endDate: null
    //         });
    //         setBookingDetails(prevState => ({
    //             ...prevState,
    //             selectedDays: [...prevState.selectedDays, day]
    //         }));
    //     } else {
    //         setBookingDetails(prevState => ({
    //             ...prevState,
    //             selectedDays: prevState.selectedDays.filter(d => d !== day)
    //         }));
    //     }
    // };
    const daysOfWeek = Days;


    // const handleCheckboxChange = (dayAbbreviation) => {
    //     const updatedSelectedDays = [...bookingDetails.selectedDays]; // Create a copy of the current selectedDays array

    //     // Find the corresponding full day name for the abbreviation
    //     const fullDayName = dayOptions.find(option => option.label === dayAbbreviation)?.value;

    //     if (fullDayName) {
    //         const dayIndex = updatedSelectedDays.indexOf(fullDayName); // Check if the full day name is already in the array

    //         if (dayIndex === -1) {
    //             // If the day is not in the array, add it
    //             updatedSelectedDays.push(fullDayName);
    //         } else {
    //             // If the day is already in the array, remove it
    //             updatedSelectedDays.splice(dayIndex, 1);
    //         }

    //         // Update the state with the new array
    //         setBookingDetails(prevState => ({
    //             ...prevState,
    //             selectedDays: updatedSelectedDays
    //         }));
    //     }
    // };
    const handleCheckboxChange = (dayOfWeek) => {
        const updatedSelectedDays = [...bookingDetails.selectedDays]; // Create a copy of the current selectedDays array

        // Find the corresponding full day name for the abbreviation
        const fullDayName = dayOptions.find(option => option.label === dayOfWeek)?.value;

        if (fullDayName) {
            const dayIndex = updatedSelectedDays.indexOf(fullDayName); // Check if the full day name is already in the array

            if (dayIndex === -1) {
                // If the day is not in the array, add it
                updatedSelectedDays.push(fullDayName);
            } else {
                // If the day is already in the array, remove it
                updatedSelectedDays.splice(dayIndex, 1);
            }

            // Update the state with the new array
            setBookingDetails(prevState => ({
                ...prevState,
                selectedDays: updatedSelectedDays
            }));
        }
    };

    const dayOptions = [
        { value: 'Sunday', label: 'Sun' },
        { value: 'Monday', label: 'Mon' },
        { value: 'Tuesday', label: 'Tue' },
        { value: 'Wednesday', label: 'Wed' },
        { value: 'Thursday', label: 'Thu' },
        { value: 'Friday', label: 'Fri' },
        { value: 'Saturday', label: 'Sat' },
    ];

    // const renderDaysOfWeek = (startDate, endDate) => {
    //     const daysBetween = eachDayOfInterval({ start: startDate, end: endDate });
    //     const renderedDays = [];

    //     // Iterate over each day in the date range
    //     daysBetween.forEach(day => {
    //         const dayIndex = getDay(day);
    //         const dayOfWeek = daysOfWeek[dayIndex]; // Get the day of the week (e.g., "Monday", "Tuesday")
    //         const dayAbbreviation = dayOptions.find(option => option.value === dayOfWeek)?.label; // Find the corresponding abbreviation (e.g., "Mon", "Tue")
    //         const isSelected = bookingDetails.selectedDays.includes(dayOfWeek);
    //         console.log("Day of week:", dayOfWeek);
    //         console.log("Abbreviation:", dayIndex);

    //         // Render the checkbox for the day
    //         renderedDays.push(
    //             <div key={dayOfWeek} className="form-check-inline">
    //                 <input
    //                     type="checkbox"
    //                     onChange={() => handleCheckboxChange(dayOfWeek)}
    //                     checked={isSelected}
    //                 />
    //                 <label>{dayOfWeek}</label>
    //             </div>
    //         );
    //     });

    //     return renderedDays;
    // };
    // console.log(addPlayersData, "data")
    const renderDaysOfWeek = (startDate, endDate) => {
        const daysBetween = eachDayOfInterval({ start: startDate, end: endDate });
        const renderedDays = [];
        const renderedDayNames = []; // Array to keep track of already rendered day names

        // Iterate over each day in the date range
        daysBetween.forEach(day => {
            const dayIndex = getDay(day);
            const dayOfWeek = daysOfWeek[dayIndex]; // Get the day of the week (e.g., "Monday", "Tuesday")
            const dayAbbreviation = dayOptions.find(option => option.value === dayOfWeek)?.label; // Find the corresponding abbreviation (e.g., "Mon", "Tue")

            console.log("Day of week:", dayOfWeek);
            console.log("Abbreviation:", dayAbbreviation);

            if (!renderedDayNames.includes(dayOfWeek)) {
                // Check if the day has already been rendered
                renderedDayNames.push(dayOfWeek); // Add the day to the list of rendered days

                // Determine if the day is selected
                const isChecked = bookingDetails.selectedDays.some(fullDayName => {
                    return fullDayName.includes(dayOfWeek);
                });
                // Render the checkbox for the day
                renderedDays.push(
                    <div key={dayOfWeek} className="form-check-inline">
                        <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(dayOfWeek)}
                            checked={isChecked}
                        />
                        <label>{dayOfWeek}</label>
                    </div>
                );
            }
        });

        return renderedDays;
    };

    console.log(bookingDetails.selectedDays, "dayarr")
    const handleSearchCalendar = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // axios.get(`${tempURL}/api/v1/reservations?centerId.equals=${centerId}&start.greaterThanOrEqual=${currentMoment.format()}&end.lessThanOrEqual=${nextDayMoment.format()}&Id.in=${facilityItemIds}`)
        // .then((response) => console.log(response))
        // .catch((err) => console.log(err))
        fetchEventData();
    }
    const moment = require('moment');

    const currentMoment = moment.utc();


    const nextDayMoment = currentMoment.clone().add(1, 'day').subtract(1, 'second').subtract(1, 'minute');


    // console.log("Current Moment (UTC):", currentMoment.format());
    // console.log("Next Day Moment with 1 second subtracted (UTC):", nextDayMoment.format());
    //  console.log(bookingDetails, "book");
    const localizer = momentLocalizer(moment)
    const handleCheckDays = () => {

    }
 //   console.log(bookingDetails.startDate?.getDay(), bookingDetails.endDate, "startend")
    const handlePlayerSubmit = () => {
        if(!editAddPlayer.check){

            setAddPlayersData([...addPlayersData, addPlayers]);
        }
        else{
            const data=[...addPlayersData];
            data[editAddPlayer.index] = addPlayers;
            setAddPlayersData(data);
        }
    }
    //   console.log(addPlayersData, "addpalyers")

    let facilityItemIds = [];
    //  console.log(facilityItemIds,"ids")
    let title = [];
    const fetchEventData = async () => {
        try {
            const response = await axios.get(`${tempURL}/api/v1/reservations?centerId.equals=${centerId}&start.greaterThanOrEqual=${currentMoment.format()}&end.lessThanOrEqual=${nextDayMoment.format()}&Id.in=${facilityItemIds}`);
            const responseData = response.data;
            console.log('responseData:', responseData);
            // Extract resource data and timings
            //  const events = responseData.events;
            const resources = responseData.myresources;
            const timings = responseData.timings;
            console.log(resources, "resorces");
            console.log(timings, "timings");
            // console.log("events",events)
            setTime({ ...time, start: timings.start, end: timings.end })
            if (Array.isArray(resources)) {

                const eventsWithDynamicTitles = resources.map((resource) => {
                    title.push(resource?.title)
                    return {
                        id: resource.id,
                        title: resource.title,
                    };
                });

                console.log('eventsWithDynamicTitles:', eventsWithDynamicTitles);

                console.log(title, "title")
                setEventData(eventsWithDynamicTitles);
            } else {
                console.log('Invalid data structure or missing timing information.');
            }

            // Set the event data in state
        } catch (error) {
            console.error('Error fetching event data:', error);
        }
    };
    //console.log(eventData, "evtdata");
    const events = [
        { id: 1, title: 'Event 1', start: new Date(), end: new Date() },
        { id: 2, title: 'Event 2', start: new Date(), end: new Date() }
    ];
    // const startDate1 =bookingDetails.startDate?.getUTCFullYear();
    // const endDate1 = bookingDetails.endDate ?.toISOString();
    // console.log(startDate1,"init",endDate1);
    // const startDateTimeUTC = new Date(`${startDate1}T${bookingDetails.startTime}:00Z`);
    // const endDateTimeUTC = new Date(`${endDate1}T${bookingDetails.endTime}:00Z`);
    // console.log(startDateTimeUTC,"to",endDateTimeUTC)

    const startTimeMoment = moment(bookingDetails.startTime, 'hh:mm A');
const startTime24HourFormat = startTimeMoment.format('HH:mm:ss');

// Parse the end time to 24-hour format using Moment.js
const endTimeMoment = moment(bookingDetails.endTime, 'hh:mm A');
const endTime24HourFormat = endTimeMoment.format('HH:mm:ss');

// Format the start and end dates
const startDate = moment(bookingDetails.startDate).format('YYYY-MM-DD');
const endDate = moment(bookingDetails.endDate).format('YYYY-MM-DD');

// Combine start date and time in UTC format
const startDateTime = moment.utc(`${startDate}T${startTime24HourFormat}Z`).add(7, 'hours').format();

// Combine end date and time in UTC format
const endDateTime = moment.utc(`${endDate}T${endTime24HourFormat}Z`).add(7, 'hours').format();

console.log('Start Date Time:', startDateTime);
console.log('End Date Time:', endDateTime);

    const handleCheckAvialability = async () => {
        await axios.get(`${tempURL}/api/v1/facility/getAvailability?centerId.equals=${centerId}&sportId.equals=${sportsId}&startTime=${startDateTime}&endTime=${endDateTime}&isMultiple=${bookingDetails.bookingOccurence === "Single Booking"? false : true}&days=${bookingDetails.bookingOccurence === "Single Booking"?"":bookingDetails.selectedDays}`)
        .then((response) =>{ setApiResponse({...apiResponse,checkFacility:response.data}); console.log(response.data); setAppearForm(true)})
        .catch((err) => console.log(err))
    }
    const handleEdit =(index) =>{
        setEditAddPlayer({check:true,index:index});
        setAddShow(true);
    }

    return (
        <div className="bg-white mt-2 rounded-2 ">
            <Row className="p-3 mx-0">

                <Row className=" w-100" sm={12} md={10} lg={12} xl={12}>
                    <Col sm={12} md={12} lg={9} xl={7} className="d-lg-flex justify-content-lg-between justify-content-md-around" >
                        <div ><Icon icon="material-symbols:square" style={{ color: " #fc9403" }} /><span>Player/Not paid</span></div>
                        <div> <Icon icon="material-symbols:square" style={{ color: "yellow" }} /><span>Coach</span></div>
                        <div>  <Icon icon="material-symbols:square" style={{ color: "purple" }} /><span>Admin</span></div>
                        <div>  <Icon icon="material-symbols:square" style={{ color: "grey" }} /><span>Maintenance</span></div>
                        <div> <Icon icon="material-symbols:square" style={{ color: "alice" }} /><span>Tournament</span></div>
                        <div> <Icon icon="material-symbols:square" style={{ color: "green" }} /><span>Player/Paid</span> </div>
                    </Col>
                    <Col sm={12} lg={3} xl={5}>
                        <div className="fw-medium fs-5 text-lg-end">Booking Schedules</div>
                    </Col>
                </Row>
            </Row>
            <hr className="my-1" />

            <Row className="p-3 mx-0">
                <div className="d-md-flex justify-content-between">

                    <Col sm={12} md={2} lg={2} xl={3}>
                        <div>Facility Type {spinner ? <Spinner animation="border" variant="danger" size="sm" /> : null}</div>
                        <Form.Select aria-label="Default select example" className="mt-2" value={calendarDetails.facilityType} name="facilityType" onChange={(e) => handleCalendarChange(e)}>
                            {Array.isArray(apiResponse.facilityType) && apiResponse.facilityType.map((facility: any) => {

                                const sportsId = facility.sport.id;
                                return (
                                    <option value={facility.title} onClick={(e) => handleCalendarChange(e, sportsId)}>
                                        {facility.title}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Col>
                    <Col sm={12} md={2} lg={2} xl={3}>
                        <label>Facilities</label>
                        <Form.Select aria-label="Default select example" className="mt-2">
                            <option value={""}>All Court</option>
                            {Object.entries(apiResponse.facilities).map(([courtName, courtArray]) => (
                                courtArray.map((facilityItem: { id: any; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }, index: any) => {
                                    facilityItemIds.push(facilityItem.id);
                                    return (

                                        <option key={`${courtName}-${index}`} value={facilityItem.name}>
                                            {facilityItem.name}
                                        </option>
                                    )
                                })))}
                        </Form.Select>
                    </Col>
                    <Col sm={12} md={2} lg={2} xl={2} className="mt-2 ">
                        <label className="mb-2">Date</label>
                        <DatePicker className="form-control  " onChange={(e: any) => handleDateCalendar(e)} selected={calendarDetails.date} minDate={new Date()} showIcon />
                    </Col>
                    <div className="mt-3">
                        <Col className="mt-3 ">

                            <div className="mt-3  " >

                                <Button variant="primary" onClick={handleSearchCalendar}> <Icon icon="ic:baseline-search" height={21} />Search </Button>
                                <Button variant="danger" className="ms-4" onClick={handleShow}>
                                    Add Booking
                                </Button>
                            </div>

                        </Col>
                    </div>
                </div>
            </Row>

            <Row className="p-2 mx-0">
                <Calendar
                    localizer={localizer}
                    events={events}
                    views={{
                        day: true,
                        week: true,
                        month: true
                    }}
                    components={{
                        day: {
                            header: CustomDayHeader,
                            body: CustomDayView
                        }
                    }}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView={Views.DAY}
                    titleAccessor="title"
                    style={{ height: 550 }}


                />
            </Row>
            <Offcanvas show={show} onHide={handleClose} backdrop="static" placement="end" className=" w-75">
                <Offcanvas.Header className="bg-gainsboro" closeButton>
                    <Offcanvas.Title >Booking</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body >
                    <Row>
                        <Col sm={12} md={12} lg={8} xl={8}>
                            <Row>
                                <Col sm={12} xl={6}>
                                    <Form.Label className="fw-medium">Booking Type<span className="text-danger ms-1">*</span></Form.Label>
                                    <Form.Select aria-label="Default select example" name="bookingType" value={bookingDetails.bookingType} onChange={handleChange}>
                                        {BookingType.map((booking) => {
                                            return (
                                                <option value={booking.value}>{booking.label}</option>
                                            )
                                        })}
                                    </Form.Select>
                                </Col>
                                <Col sm={12} xl={6}>
                                    <Form.Label>Facility Type<span className="text-danger ms-1">*</span></Form.Label>
                                    <Form.Select aria-label="Default select example" name="facilityType" value={bookingDetails.facilityType} onChange={handleChange}>
                                        {apiResponse.facilityType.map((facility) => {
                                            return (
                                                <option value={facility.title} >{facility.title}</option>
                                            );
                                        })

                                        }
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <Form.Label className="fw-medium ">Booking Occurence</Form.Label>
                                    <div className="mt-2">
                                        <Form.Check
                                            inline
                                            label="Single Booking"
                                            name="bookingOccurence"
                                            type={"radio"}
                                            id={`inline-1`}
                                            checked={bookingDetails.bookingOccurence === "Single Booking" && true}
                                            value={"Single Booking"}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <Form.Check
                                            inline
                                            label="Multiple Booking"
                                            name="bookingOccurence"
                                            type={"radio"}
                                            id={`inline-2`}
                                            value={"Multiple Booking"}
                                            onChange={handleChange}
                                            checked={bookingDetails.bookingOccurence === "Multiple Booking" && true}
                                        />
                                    </div>
                                </Col>
                                {bookingDetails.bookingOccurence === "Multiple Booking" && <Col>
                                    <Form.Label>Frequency</Form.Label>
                                    <Form.Select aria-label="Default select example" name="frequency" value={bookingDetails.frequency} onChange={handleChange}>
                                        <option value={"Weekly"}>Weekly</option>
                                    </Form.Select>
                                </Col>}

                            </Row>
                            <Row className="mt-4">
                                <Col sm={12} md={6} lg={3} xl={3}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label className="mb-0">Start Date<span className="text-danger ms-1">*</span></Form.Label>
                                        {/* <Form.Control type="date" placeholder="Enter email" className="mt-2 " name="startDate"   value={bookingDetails.startDate} max={today} onChange={handleChange}/> */}
                                        <DatePicker className="form-control mt-2" minDate={new Date()} selected={bookingDetails.startDate || ""} onChange={handleDateChange} placeholderText="mm/dd/yyyy" />
                                    </Form.Group>
                                </Col>
                                <Col sm={12} md={6} lg={3} xl={3}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label className="mb-0">End Date<span className="text-danger ms-1">*</span></Form.Label>
                                        <DatePicker className="form-control mt-2" selected={bookingDetails.endDate || ""} onChange={handleDateChange} disabled={bookingDetails.bookingOccurence === "Single Booking"} minDate={bookingDetails.startDate} placeholderText="mm/dd/yyyy" excludeDates={[bookingDetails.startDate]} />
                                    </Form.Group>
                                </Col>
                                <Col sm={12} md={6} lg={3} xl={3}>
                                    <Form.Label className="mb-2">Start Time<span className="text-danger ms-1">*</span></Form.Label>

                                    <Select
                                        value={Time.find(option => option.value === startTime) || startTime}
                                        onChange={(selectedOption, actionMeta) => handleReactSelectChange(selectedOption, actionMeta)}
                                        options={Time}
                                        placeholder="hh:mm"
                                        name="startTime"
                                        isDisabled={bookingDetails.startDate === null && bookingDetails.endDate === null}
                                    />

                                </Col>
                                <Col sm={12} md={6} lg={3} xl={3}>
                                    <Form.Label className="mb-2 ">End Time<span className="text-danger ms-1">*</span></Form.Label>
                                    <Select
                                        value={Time.find(option => option.value === endTime) || endTime}
                                        onChange={(selectedOption, actionMeta) => handleReactSelectChange(selectedOption, actionMeta)}
                                        options={Time}
                                        placeholder="hh:mm"
                                        name="endTime"
                                        isDisabled={bookingDetails.startDate === null && bookingDetails.endDate === null}
                                    />
                                    {/* <input type="time" className="form-control " id="timePicker" placeholder="hh:mm" /> */}
                                </Col>
                            </Row>
                            {bookingDetails.bookingOccurence === "Multiple Booking" && <div>
                                <div className="fw-medium my-2">Select Days</div>
                                {/* <Moment format="ddd">{bookingDetails.startDate}</Moment> */}
                            </div>}
                            {/* {datesInRange.map((day, index) => (
                                <div key={index}>
                                    <input type="checkbox" onChange={() => handleCheckboxChange(day)} checked={selectedDays.includes(day)} />
                                    <label>{format(day, 'EEE')}</label>
                                </div>
                            ))} */}
                            {/* {bookingDetails.startDate && bookingDetails.endDate && getSelectedDays(bookingDetails.startDate, bookingDetails.endDate).map((day, index) => (
                                <div key={index}>
                                    <input type="checkbox" onChange={() => handleCheckboxChange(day)} checked={bookingDetails.selectedDays.includes(day)} />
                                    <label>{day}</label>
                                </div>
                            ))} */}
                            {bookingDetails.startDate && bookingDetails.endDate && (
                                <div>
                                    {renderDaysOfWeek(bookingDetails.startDate, bookingDetails.endDate)}
                                </div>
                            )}

                            <div className="mt-5">
                                <Button variant="danger" className="" onClick={handleCheckAvialability}>Check Availability</Button>
                            </div>
                          { appearForm && <>
                          
                         <div className="fw-medium">Available Facility</div>
                             { apiResponse?.checkFacility?.map((facilities) =>
                              {                                
                                return (
                                    <Badge bg="success" className="mt-2 me-2 ">{facilities?.title}</Badge>
                                )
                              })}
                              {apiResponse?.checkFacility?.message ? <p>{apiResponse?.checkFacility?.message}</p> : null}
                            <Row >
                               
                                <div className="my-2 fw-medium">Player Details</div>
                                <Formik
                                    validationSchema={schema}
                                    onSubmit={handleFormikSubmit}
                                    initialValues={{
                                        firstName: "",
                                        lastName: "",
                                        emailAddress: "",
                                        phoneNumber: "",
                                        pricingRule: "",
                                        facility: "",
                                    }}
                                >
                                    {({ handleSubmit, handleChange, values, errors, isValid }) => (
                                        <Form onSubmit={handleSubmit}>
                                            {/* {console.log(values,"values")} */}
                                            {/* {console.log(bookingDetails,"books")} */}
                                            {/* { console.log(facility,"facility")}  */}
                                            <Row className="mt-2">
                                                <Col sm={12} lg={6} xl={6}>
                                                    <Form.Label>First Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter First Name" className="mt-1" name="firstName" value={values.firstName} onChange={handleChange} isInvalid={!!errors.firstName} disabled={disable} />
                                                    <Form.Control.Feedback type={"invalid"} >{errors.firstName}</Form.Control.Feedback>

                                                </Col>
                                                <Col sm={12} lg={6} xl={6}>
                                                    <Form.Label>Last Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Last Name" className="mt-1" name="lastName" value={values.lastName} onChange={handleChange} isInvalid={!!errors.lastName} disabled={disable} />
                                                    {errors.lastName && <Form.Control.Feedback type={"invalid"} >{errors.lastName}</Form.Control.Feedback>}
                                                </Col>
                                            </Row>
                                            <Row className="mt-2">
                                                <Col>
                                                    <Form.Label>Phone Number</Form.Label>
                                                    <Form.Control type="number" placeholder="Enter Phone Number" className="mt-1" name="phoneNumber" value={values.phoneNumber} onChange={handleChange} isInvalid={!!errors.phoneNumber} disabled={disable} />
                                                    {errors.phoneNumber && <Form.Control.Feedback type={"invalid"} >{errors.phoneNumber}</Form.Control.Feedback>}
                                                </Col>
                                                <Col>
                                                    <Form.Label>Email address</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Email address" className="mt-1" name="emailAddress" value={values.emailAddress} onChange={handleChange} isInvalid={!!errors.emailAddress} disabled={disable} />
                                                    <Form.Control.Feedback type={"invalid"} >{errors.emailAddress}</Form.Control.Feedback>
                                                </Col>
                                            </Row>
                                            <Row className="mt-3 d-flex justify-content-between ">
                                                <Col xs={6} className="">
                                                    <Form.Label className="px-0 fw-medium">Facility</Form.Label>
                                                    <div className="h-35 border p-2" >
                                                        {Object.values(apiResponse.facilities).map((type: any, index: any) => {

                                                            return (
                                                                <div key={index}>
                                                                    {type.map((facilities: any) => {
                                                                        //    console.log(facility,"inmap")
                                                                        //    console.log(values.facility,"valinmap")
                                                                        return (
                                                                            <Form.Check
                                                                                type={"radio"}
                                                                                // id={`${type}`}
                                                                                label={`${facilities?.name}`}
                                                                                value={`${facilities?.name}`}
                                                                                //  value={values.facility}
                                                                                name={"facility"}
                                                                                onClick={() => handleBookFacility(facilities)}
                                                                                onChange={() => handleChange({ target: { name: 'facility', value: facilities?.name } })}
                                                                                defaultChecked={values.facility === `${facilities?.name}`}
                                                                                isInvalid={!!errors.facility}
                                                                                disabled={disable}
                                                                            />)
                                                                    })}

                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    {values.facility === "" && <span className="text-danger" >{errors.facility}</span>}
                                                </Col>
                                                <Col xs={6} className="">
                                                    <Form.Label className="px-0 fw-medium">Pricing Rule</Form.Label>
                                                    <div className="h-35 border p-2">

                                                        <div className="fw-medium">{bookingDetails.facilityCheck}</div>
                                                        {Object.values(apiResponse.pricingrule).map((pricing, index) => {

                                                            return (
                                                                <div key={index}>
                                                                    <Form.Check
                                                                        type={"radio"}
                                                                        // id={`${type}`}
                                                                        label={`${pricing?.pricingRule?.ruleName}`}
                                                                        value={`${pricing?.pricingRule?.ruleName}`}
                                                                        // value={values.pricingRule}
                                                                        name={"pricingRule"}
                                                                        onChange={() => handleChange({ target: { name: 'pricingRule', value: pricing?.pricingRule?.ruleName } })}
                                                                        defaultChecked={values.pricingRule === `${pricing?.pricingRule?.ruleName}`}
                                                                        isInvalid={!!errors.pricingRule}
                                                                        onClick={() => handleBookingCost(pricing)}
                                                                        disabled={disable}
                                                                    />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <span className="text-danger">{errors.pricingRule}</span>
                                                </Col>
                                            </Row>
                                            {disable ? (
                                                <Button variant="warning" onClick={handleToggleDisable} type="button">Edit</Button>
                                            ) : (
                                                <Button variant="success" type="submit" >Save</Button>
                                            )}
                                        </Form>

                                    )}
                                </Formik>
                            </Row>
                            <div><Button variant="danger" onClick={handleAddPlayerOpen}>Add Player</Button></div>
                            <Table responsive bordered hover striped className="mt-2">
                                <thead className="border">

                                    {Array.isArray(TableAddPlayers) && TableAddPlayers.map((head) => {
                                        return (

                                            <th className="border p-2">{head.label}</th>
                                        )
                                    })}
                                </thead>
                                <tbody>

                                    {addPlayersData.map((data: { firstName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; lastName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; addFacilityCheck: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; addPricingCheck: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; cost: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => {
                                       
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{data.firstName}</td>
                                                <td>{data.lastName}</td>
                                                <td>{data.addFacilityCheck}</td>
                                                <td>{data.addPricingCheck}</td>
                                                <td>${data.cost}</td>
                                                <td><div className="bg-warning w-50 px-2 mx-auto rounded-2 mt-1"onClick={() =>handleEdit(index)}><Icon icon="uil:edit" /></div><div className="bg-danger w-50 px-2 mx-auto  mt-1 rounded-2" onClick={() => deleteRow(index)}><Icon icon="mi:delete" /></div></td>
                                            </tr>
                                        )
                                    })
                                    }

                                </tbody>
                            </Table>
                            <Offcanvas show={addShow} onHide={handleAddPlayerClose} placement="end">
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>Add Player</Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <Form.Check
                                        inline
                                        label="Name not disclosed"
                                        name="nameDiscloseCheck"
                                        type={"checkbox"}
                                        className="mt-2 "
                                        checked={addPlayers.nameDiscloseCheck}
                                        value={addPlayers.nameDiscloseCheck}
                                        onChange={(e) => handleAddPlayer(e)}
                                    //  onClick={() =>setAddPlayers({...addPlayers,nameDiscloseCheck:true})}
                                    />
                                    <Row className="mt-2">
                                        <Col>
                                            <Form.Label className="fw-medium">firstName</Form.Label>
                                            <Form.Control type="text" placeholder="Enter firstName" value={editAddPlayer.check === false ? !nameDisClose ? addPlayers.firstName : "Name Not Disclosed":addPlayersData[editAddPlayer.index].firstName} name="firstName" onChange={(e) => handleAddPlayer(e)} disabled={addPlayers.nameDiscloseCheck} />
                                        </Col>
                                        <Col>
                                            <Form.Label className="fw-medium">lastName</Form.Label>
                                            <Form.Control type="text" placeholder="Enter lastName" value={editAddPlayer.check === false ? !nameDisClose ? addPlayers.lastName : "Name Not Disclosed":addPlayersData[editAddPlayer.index].lastName} name="lastName" onChange={(e) => handleAddPlayer(e)} disabled={addPlayers.nameDiscloseCheck} />
                                        </Col>
                                    </Row>
                                    <Form.Check
                                        inline
                                        label="Same as Primary"
                                        name="sameAsPrimary"
                                        type={"checkbox"}
                                        className="mt-2"
                                        value={addPlayers.sameAsPrimary}
                                        // onClick={(e) => handleAddPlayer(e)}
                                        checked={addPlayers.sameAsPrimary === true}
                                        onChange={(e) => handleAddPlayer(e)}

                                    />
                                    <Row className="mt-3 d-flex justify-content-between ">
                                        <Col xs={6} className="">
                                            <Form.Label className="px-0 fw-medium">Facility</Form.Label>
                                            <div className="h-35 border p-2">
                                                {Object.values(apiResponse.facilities).map((type: any, index: any) => {

                                                    return (
                                                        <div key={index}>
                                                            {type.map((facility: any) => {
                                                                return (
                                                                    <Form.Check
                                                                        type={"radio"}
                                                                        // id={`${type}`}
                                                                        label={`${facility?.name}`}
                                                                        value={`${facility?.name}`}
                                                                        name="addFacilityCheck"
                                                                        disabled={addPlayers.sameAsPrimary === true}
                                                                        onClick={() => handleBookFacility(facility)}
                                                                        onChange={(e) => handleRadioAdd(e)}
                                                                    />)
                                                            })}

                                                        </div>
                                                    )
                                                })}
                                            </div>

                                        </Col>
                                        <Col xs={6} className="">
                                            <Form.Label className="px-0 fw-medium">Pricing Rule</Form.Label>
                                            <div className="h-35 border p-2">

                                                <div className="fw-medium">{bookingDetails.facilityCheck}</div>
                                                {Object.values(apiResponse.pricingrule).map((pricing, index) => {
                                                    //   console.log(pricing.pricingRule[index]?.cost, "pricein")
                                                    console.log(index, "index")
                                                    return (
                                                        <div key={index}>
                                                            <Form.Check
                                                                type={"radio"}
                                                                // id={`${type}`}
                                                                label={`${pricing?.pricingRule?.ruleName}`}
                                                                value={`${pricing?.pricingRule?.ruleName}`}
                                                                name="addPricingCheck"
                                                                disabled={addPlayers.sameAsPrimary === true}
                                                                onClick={() => handleBookingCost(pricing)}
                                                                onChange={(e) => handleRadioAdd(e)}
                                                            />

                                                        </div>
                                                    )
                                                })}
                                            </div>

                                        </Col>
                                    </Row>
                                    <div className="text-center mt-2 ">

                                        <Button variant="success" className="w-75" onClick={handlePlayerSubmit}>Add</Button>
                                    </div>
                                    <div className="text-center mt-2">

                                        <Button variant="danger" className="w-75" onClick={handleAddPlayerClose}>Close</Button>
                                    </div>
                                </Offcanvas.Body>
                            </Offcanvas>
                            </>}
                            <Row className="mt-4 mx-1">
                                <Form.Label className="px-0 fw-medium">Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Leave a comment here"
                                    style={{ height: '100px' }}
                                    name="notes"
                                    value={bookingDetails.notes}
                                    onChange={(e) => handleChange(e)}
                                />
                            </Row>

                        </Col>
                        <Col sm={12} md={12} lg={4} xl={4} className="border border-2  m-md-3 m-lg-0 p-3">
                            <div>Booking Type</div>
                            <div className="fw-bold mt-2">{bookingDetails.bookingType}</div>
                            <hr />
                            <div>Start date and Time</div>
                            {bookingDetails.startDate && <div className="fw-medium"><Moment format="MMMM DD YYYY ">{bookingDetails.startDate}</Moment>{bookingDetails.startTime} </div>}
                            <div>End date and Time</div>
                            {bookingDetails.endDate && <div className="fw-medium"><Moment format="MMMM DD YYYY ">{bookingDetails.endDate}</Moment>{bookingDetails.endTime}</div>}
                            <hr />
                            <div>Facility Type</div>
                            <div className="fw-bold mt-2">{bookingDetails.facilityType}</div>
                            <hr />
                            <div className="fw-bold">Player's Facility and Pricing Details</div>
                            <Table responsive bordered hover striped className="mt-2">
                                <thead>
                                    {/* <tr>

                                        <th>S.no</th>
                                        <th> Name</th>
                                        <th>Facility </th>
                                        <th>Pricing Rule</th>
                                        <th>Per Hour</th>

                                    </tr> */}



                                    {Array.isArray(TablePricing) && TablePricing.map((head) => {
                                        //console.log(head.label,"head")
                                        return (

                                            <th className="p-2 border">{head.label}</th>

                                        )
                                    })}
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>{bookingDetails.firstName}</td>
                                        <td>{bookingDetails.facilityCheck}</td>
                                        <td>{bookingDetails.pricingRuleCheck}</td>
                                        <td>${perCost}</td>
                                    </tr>
                                    {addPlayersData.map((data: { firstName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; addFacilityCheck: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; addPricingCheck: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; cost: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined | number) => {
                                        let serialnumber:any = index + 2 ;
                                        console.log(data,"data")
                                       return (
                                            <tr key={index}>
                                                <td>{serialnumber}</td>
                                                <td>{data.firstName}</td>
                                                <td>{data.addFacilityCheck}</td>
                                                <td>{data.addPricingCheck}</td>
                                                <td>{data.cost}</td>
                                            </tr>
                                        )
                                    })}
                                    <tr>
                                        {/* <td>2</td> */}
                                        <td colSpan={4}>Total Price</td>
                                        <td><span className="bg-dark text-white p-1 rounded-2">${perCost}</span></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                </Offcanvas.Body>
                <div className="bg-gainsboro text-end p-2">
                    <Button variant="danger" onClick={handleOpenBookPreview}>Proceed to Book</Button>
                </div>
                <Offcanvas show={bookShow} onHide={handleCloseBookPreview} placement="end" className="w-75">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Booking Preview</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Row>
                            <Col sm={12} md={8} lg={8} xl={8} className=" border-end ">
                                <div className="text-center">
                                    <img src={apiResponse?.facilityType[sportsId]?.url}></img>
                                    <div>{apiResponse?.facilityType?.title}</div>
                                    {console.log(apiResponse?.facilityType[sportsId], "type")}

                                </div>
                                <div className="border rounded-2 ">
                                    <Row className="d-flex justify-content-between p-3">
                                        <Col xs={4}>
                                            <div>Booking Type</div>
                                            <div>{bookingDetails.bookingType}</div>
                                        </Col>
                                        <Col xs={4}>
                                            <div>Facility Type</div>
                                            <div>{bookingDetails.facilities}</div>
                                        </Col>
                                        <Col xs={4}>
                                            <div>Booking Occurence</div>
                                            <div>{bookingDetails.bookingOccurence}</div>
                                        </Col>

                                    </Row>
                                    <Row className="d-flex justify-content-between p-3">
                                        <Col xs={4}>
                                            <div>Start Date and Time</div>
                                            {bookingDetails.startDate && <div className="fw-medium"><Moment format="MMMM DD YYYY ">{bookingDetails.startDate}</Moment>{bookingDetails.startTime} </div>}
                                        </Col>
                                        <Col xs={4}>
                                            <div>End Date and Time</div>
                                            {bookingDetails.endDate && <div className="fw-medium"><Moment format="MMMM DD YYYY ">{bookingDetails.endDate}</Moment>{bookingDetails.startTime} </div>}
                                        </Col>
                                        <Col xs={4}>
                                            <div>Notes</div>
                                            <div>{bookingDetails.notes}</div>
                                        </Col>

                                    </Row>
                                    <div className="p-2">


                                        <div className="fw-bold">Player's Facility and Pricing Details</div>
                                        <Table responsive bordered hover striped className="mt-2">
                                            <thead>
                                                {/* <tr>

                                        <th>S.no</th>
                                        <th> Name</th>
                                        <th>Facility </th>
                                        <th>Pricing Rule</th>
                                        <th>Per Hour</th>

                                    </tr> */}
                                                {Array.isArray(TablePricing) && TablePricing.map((head) => {
                                                    //console.log(head.label,"head")
                                                    return (
                                                        <th className="p-2 border">{head.label}</th>
                                                    )
                                                })}
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>{bookingDetails.firstName}</td>
                                                    <td>{bookingDetails.facilityCheck}</td>
                                                    <td>{bookingDetails.pricingRuleCheck}</td>
                                                    <td>${perCost}</td>
                                                </tr>
                                                {addPlayersData.map((data: { firstName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; addFacilityCheck: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; addPricingCheck: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; cost: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined | number) => {
                                                   
                                                  //  console.log(serialnumber,index,data.cost,"index78");
                                                    
                                                    return (
                                                        <tr key={index}>
                                                            {/* <td>{serialnumber}</td> */}
                                                            <td>{data.firstName}</td>
                                                            <td>{data.addFacilityCheck}</td>
                                                            <td>{data.addPricingCheck}</td>
                                                            <td>{data.cost}</td>
                                                        </tr>
                                                    )
                                                })}
                                                <tr>
                                                    {/* <td>2</td> */}
                                                    <td colSpan={4}>Total Price</td>
                                                    <td><span className="bg-dark text-white p-1 rounded-2">${perCost}</span></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>

                                </div>
                            </Col>
                            <Col sm={12} md={4} lg={4} xl={4}>
                                <h5>Mode of Payment</h5>
                                <div className="p-3 border rounded-2 ">
                                    <div className="d-flex justify-content-between border p-2 my-3 rounded-2"><div><Icon icon="zmdi:card" style={{ color: "black" }} /><span className="ms-2">Card Payment</span></div>
                                        <Form.Check
                                            type={"radio"}
                                            label={` `}
                                            id={`disabled-default`}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between border p-2 my-3 rounded-2"><div><Icon icon="bi:clock" style={{ color: "black" }} /><span className="ms-2">Pay Later</span></div>
                                        <Form.Check
                                            type={"radio"}
                                            label={` `}
                                            id={`disabled-default`}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between border p-2 my-3 rounded-2"><div><Icon icon="iconoir:no-credit-card" style={{ color: "black" }} /><span className="ms-2">No Payment</span></div>
                                        <Form.Check
                                            type={"radio"}
                                            label={` `}
                                            id={`disabled-default`}
                                        />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <Button variant="danger" className="mt-4">Book Now</Button>
                                </div>
                            </Col>
                        </Row>

                    </Offcanvas.Body>
                    <div className="bg-gainsboro text-end p-2">
                        <Button className="bg-dark" >Back</Button>
                    </div>
                </Offcanvas>

            </Offcanvas>
        </div>
    );
}
export default Reservation;


