import { Col, Row, Form, Button, Offcanvas, Table, Spinner, Badge,Alert } from "react-bootstrap";
import { Icon } from "@iconify/react";
import React, { useState, ChangeEvent, useEffect, useRef, ReactNode } from "react";
import Select from 'react-select';
import { BookingType } from "../../utils/Data";
import { Time, Days, TableAddPlayers, TablePricing } from "../../utils/Data";
import Moment from "react-moment";
//import moment from "moment";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { eachDayOfInterval, getDay } from 'date-fns';
import "../../assets/Css/App.css";
import { Formik } from "formik";
import * as yup from "yup";
import EventColors from "../components/SplitComponents/EventColors";
import Swal from "sweetalert2";
import moments from "moment-timezone";



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
    costPrimary: string,
    daysValues: any[];
    sportsId: any;
}
interface calendarDetails {
    facilityType: string;
    facilities: string;
    date: Date;
    sportsId: any
    facilityId:any
}
interface apiResponse {
    facilityType: any[];
    facilities: any;
    pricingrule: any[];
    calendarDetails: any[];
    checkFacility: any;
}
interface SpinnerState {
    loginSpinner: boolean;
    centerSpinner: boolean;
    calendarSpinner: boolean;
    facilitySpinner: boolean;
    sportSpinner: boolean;
    checkAvialabilitySpinner: boolean;
    pricingRuleSpinner:boolean;
  }

const Reservation: React.FC<{ bookingDetails: bookingDetails, setBookingDetails: React.Dispatch<React.SetStateAction<bookingDetails>>;spinner:SpinnerState;setSpinner:React.Dispatch<React.SetStateAction<SpinnerState>> }> = ({ bookingDetails, setBookingDetails, orgDetails, spinner, setSpinner }) => {
    const [show, setShow] = useState(false);
    const [addShow, setAddShow] = useState(false)
    const [bookShow, setBookShow] = useState(false);
    const [appearForm, setAppearForm] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [perCost, setPerCost] = useState("");
    const [disable, setDisable] = useState(false);
    const [sportsId, setSportsId] = useState(0);
    const [showAlert,setShowAlert] = useState(false);
    //  const [spinner, setSpinner] = useState(true);
    const [showEvent,setShowEvent] =useState(false)
    const [selectedEvent,setSelectedEvent] = useState<any>({});
    const [nameDisClose, setNameDisclose] = useState(false)
    const [pricingId, setPricingId] = useState("");
    const [buttonText, setButtonText] = useState('Save')
    const [totalPrice, setTotalPrice] = useState("")
    const pricingRuleIdsRef = useRef<string[]>([]);
    const [time, setTime] = useState({
        start: "",
        end: "",
    })
    const [eventData, setEventData] = useState([]);
    const [addPlayers, setAddPlayers] = useState({
        firstName: "",
        lastName: "",
        nameDiscloseCheck: false,
        sameAsPrimary: false,
        addFacilityCheck: "",
        addPricingCheck: "",
        cost: "",
    })
    console.log(orgDetails, "vsf")
    const [editAddPlayer, setEditAddPlayer] = useState({
        check: false,
        index: "",
        pricingId: "",
    })
    const [addPlayersData, setAddPlayersData] = useState<any>([]);
    const [calendarDetails, setCalendarDetails] = useState<calendarDetails>({
        facilityType: "",
        facilities: "",
        date: "" || new Date(),
        sportsId: "",
        facilityId: "",
    })
    console.log(calendarDetails, "457")
    let reservationPlayers;
    const [apiResponse, setApiResponse] = useState<apiResponse>({
        facilityType: [],
        facilities: {},
        pricingrule: [],
        calendarDetails: [],
        checkFacility: [],

    })
    const data = addPlayersData.map((player) => ({
        firstName: player.firstName,
        lastName: player.lastName,
        sameAsPrimary: player.sameAsPrimary === true ? true : false,
        ...(player.sameAsPrimary === false && {
            facility: { id: player?.facilityId.toString() },
            pricingRule: { id: player?.pricingRuleId.toString() }
        })
    }));
    //   console.log(data, "playdata");
    useEffect(() => {
        if (addPlayersData) {
            const data = addPlayersData.map(player => ({
                firstName: player.firstName,
                lastName: player.lastName,
                sameAsPrimary: player.sameAsPrimary === true ? true : false,
                ...(player.sameAsPrimary === false && {
                    facility: { id: "456" },
                    pricingRule: { id: "789" }
                })
            }));

            reservationPlayers = data

        }
    }, [addPlayersData]);


    const centerId = localStorage.getItem("centerId");
    const schema = yup.object().shape({
        firstName: yup.string().required("FirstName is a Required Field"),
        lastName: yup.string().required("LastName is a Required Field"),
        emailAddress: yup.string().email().required("EmailAddress is a Required Field"),
        phoneNumber: yup.string().required("PhoneNumber is a Required Field"),
        facility: yup.string().required('Facility selection is a required'),
        pricingRule: yup.string().required(),
    })
    const schemae = yup.object().shape({
        firstName: yup.string().required("FirstName is a Required Field"),
        lastName: yup.string().required("LastName is a Required Field"),
        facilityType: yup.string().required("Facility selection is a Required Field"),
        pricingRule: yup.string().required("PricingRule selection is a Required Field "),
        sameAsPrimary: yup.boolean(),
        nameDisClose: yup.boolean(),
        cost: yup.string(),
        facilityId: yup.string(),
    })
    const handleAddPlayerOpen = () => { setAddShow(true) }
    const handleAddPlayerClose = () => { setAddShow(false); clearState(); setNameDisclose(false); setEditAddPlayer({ pricingId: "", check: false, index: "" });setShowAlert(false); }
    const handleClose = () => { setShow(false); localStorage.removeItem("error"); resetBookDetails(); }
    const handleShow = () => { setShow(true); };
    const handleOpenBookPreview = () => setBookShow(true)
    const handleCloseBookPreview = () => { setBookShow(false); };
    const tempURL = process.env.REACT_APP_BASEURLTEMP;
    const orgURL = process.env.REACT_APP_BASEURLORG;
    const [errorsMessage, setErrorsMessage] = useState("");

    const handleFormikSubmit = (event: any) => {
        console.log(event, pricingId, "E");


        setBookingDetails({ ...bookingDetails, firstName: event.firstName, lastName: event.lastName, emailAddress: event.emailAddress, phoneNumber: event.phoneNumber, pricingRuleCheck: event.pricingRule, facilityCheck: event.facility, pricingRule: pricingId })
        if (buttonText === 'Save') {
            setButtonText('Edit');
        }
        else {
            setButtonText('Save');
        }

        pricingRuleIdsRef.current.push(pricingId)
        handleCostPricing();
    }
    const resetBookDetails = () => {
        setBookingDetails({ ...bookingDetails, bookingType: "Player Booking", facilityType: "Tennis Court", bookingOccurence: "Single Booking", frequency: "", startDate: null, endDate: null, startTime: "", endTime: "", firstName: "", lastName: "", emailAddress: "", phoneNumber: "", pricingRule: "", facilities: "", notes: "", facilityCheck: "", pricingRuleCheck: "", selectedDays: [], daysValues: [], costPrimary: "", sportsId: 1 })
        setAddPlayersData([]);
        setButtonText('Save');
        setErrorsMessage("");
        setApiResponse({ ...apiResponse, checkFacility: [], pricingrule: [] });
    }

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        // console.log(e.target.name, e.target.value, e, e.target.value, e.target?.options.selectedIndex + 1, "value");
        setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
        if (e.target.name === "bookingOccurence") {
            setBookingDetails({ ...bookingDetails, startDate: null, endDate: null, startTime: "", endTime: "", bookingOccurence: e.target.value });
            setErrorsMessage("");
            setApiResponse({ ...apiResponse, checkFacility: [], pricingrule: [] });
            setAppearForm(false);
            setButtonText("Save");
            setStartTime(null);
            setEndTime(null);
        }
        if (e.target.name === "facilityType") {
            setBookingDetails({ ...bookingDetails, sportsId: e.target?.options.selectedIndex + 1, facilityType: e.target.value });
        }
        //  console.log("edited")
    }
    const clearState = () => {
        setAddPlayers({ firstName: "", lastName: "", nameDiscloseCheck: false, sameAsPrimary: false, addFacilityCheck: "", addPricingCheck: "", cost: "" });
    }
    const deleteRow = (index, data) => {
        const dataRow = [...addPlayersData];
        dataRow.splice(index, 1);
        setAddPlayersData(dataRow);
        pricingRuleIdsRef.current.splice(pricingRuleIdsRef.current.indexOf(data.pricingRuleId), 1)
        handleCostPricing();
    }
    const handleBookingCost = (pricing: any) => {
        setBookingDetails({ ...bookingDetails, costPrimary: pricing?.pricingRule?.cost })
        const newPricingId: any = pricing?.pricingRule?.id;
        setPricingId(newPricingId);
    }
    const handleAddPlayerCost = (pricing) => {
        const newPricingId: any = pricing?.pricingRule?.id;
        setPricingId(newPricingId);
    }
    const listFacilities = async (sportsId: any) => {
        setSportsId(sportsId)
        await axios.get(`${tempURL}/api/v1/facilities?sportId.equals=${sportsId}&centerId.equals=${centerId}`)
            .then((response) => { setApiResponse((prev) => ({ ...prev, facilities: response.data })); setSpinner({ ...spinner, facilitySpinner: false ,sportSpinner:false}); })
            .catch((err) => console.log(err))
    }
    const handleCalendarChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>, sportsId?: any | null) => {
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
    const handleIds = (e) => {
        console.log(e.target.value, e, e.target.selectedOptions[0].outerText, "eid");
        setCalendarDetails({ ...calendarDetails, facilityId: e.target.value, facilities: e.target.selectedOptions[0].outerText });

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
                .then((response) => { setApiResponse({ ...apiResponse, facilityType: response.data }); setSpinner({ ...spinner, sportSpinner: false }); listFacilities(1) })
                .catch((err) => console.log(err));
        }
        listSports();
        fetchEventData();
    }, []);
    // const handleBookFacility = async (type: any) => {
    //     setBookingDetails({ ...bookingDetails, facilities: type.name, facilityCheck: type.id });
    //     setSpinner({...spinner,pricingRuleSpinner:true})
    //     await axios.get(`${tempURL}/api/v1/pricing-rules?centerId=${centerId}&facilityIds=${type?.id}`)
    //         .then((response) => { setApiResponse({ ...apiResponse, pricingrule: response.data });setSpinner({...spinner,pricingRuleSpinner:false}) })
    //         .catch(err => console.log(err))
    // }
    const handleBookFacility = async (type: any) => {
        console.log(type,"typedff");
        
        setBookingDetails({ ...bookingDetails, facilities: type.title, facilityCheck: type.id });
        setSpinner({...spinner,pricingRuleSpinner:true})
        await axios.get(`${tempURL}/api/v1/pricing-rules?centerId=${centerId}&facilityIds=${type?.id}`)
            .then((response) => { setApiResponse({ ...apiResponse, pricingrule: response.data });setSpinner({...spinner,pricingRuleSpinner:false}) })
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

    const daysOfWeek = Days;

    const dayOptions = [
        { value: '1', label: 'Sun', fulldayname: "Sunday" },
        { value: '2', label: 'Mon', fulldayname: "Monday" },
        { value: '3', label: 'Tue', fulldayname: "Tuesday" },
        { value: '4', label: 'Wed', fulldayname: "Wednesday" },
        { value: '5', label: 'Thu', fulldayname: "Thursday" },
        { value: '6', label: 'Fri', fulldayname: "Friday" },
        { value: '7', label: 'Sat', fulldayname: "Saturday" },
    ];

    const handleCheckboxChange = (value, fulldayname) => {
        const isSelected = bookingDetails.selectedDays.find(day => day.value === value);

        let updatedSelectedDays;
        let updatedDaysValues;

        if (isSelected) {
            updatedSelectedDays = bookingDetails.selectedDays.filter(day => day.value !== value);
        } else {
            updatedSelectedDays = [...bookingDetails.selectedDays, fulldayname];
            updatedDaysValues = [...bookingDetails.daysValues, value]
        }
        setBookingDetails(prevState => ({
            ...prevState,
            selectedDays: updatedSelectedDays,
            daysValues: updatedDaysValues,
        }));
    };

    const renderDaysOfWeek = (startDate, endDate) => {
        const daysBetween = eachDayOfInterval({ start: startDate, end: endDate });
        const renderedDays: any[] = [];

        daysBetween.forEach(day => {
            const dayIndex = getDay(day);
            const dayOfWeek = daysOfWeek[dayIndex];

            if (!renderedDays.some(renderedDay => renderedDay.value === dayOfWeek)) {
                const dayOption = dayOptions.find(option => option.label === dayOfWeek);

                if (dayOption) {
                    const isSelected = bookingDetails.selectedDays.find(selectedDay => selectedDay.value === dayOption.value);

                    renderedDays.push({
                        label: dayOfWeek,
                        value: dayOption.value,
                        fulldayname: dayOption.fulldayname,
                        isChecked: isSelected
                    });
                }
            }
        });

        return renderedDays.map(day => (
            <div key={day.value} className="form-check-inline">
                <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(day.value, day.fulldayname)}
                    checked={day.isChecked}
                />
                <label>{day.label}</label>
            </div>
        ));
    };
    let sportID = bookingDetails.sportsId;


    const handleSearchCalendar = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        fetchEventData();
        setSpinner({...spinner,calendarSpinner:true});
    }
    const moment = require('moment');
    const currentMoment = moment.utc();
    const nextDayMoment = currentMoment.clone().add(1, 'day').subtract(1, 'second').subtract(1, 'minute');

    const localizer = momentLocalizer(moment)

    const handlePlayerSubmit = (values) => {
        console.log("Submitting values:", values);
        setAddShow(false);
        if (!editAddPlayer.check) {
            setAddPlayersData([...addPlayersData, values]);
            pricingRuleIdsRef.current.push(pricingId)
            setShowAlert(true);
            console.log("Adding new player:", values);
        }
        else {
            console.log("Editing existing player at index:", editAddPlayer.index);
            const data = [...addPlayersData];
            data[editAddPlayer.index] = values;
            setAddPlayersData(data);
            console.log(values.pricingRuleId, editAddPlayer.pricingId, "idcheck");
            if (editAddPlayer.pricingId !== values.pricingRuleId) {
                console.log("Updating pricing rule ID for edited player:", values.pricingRuleId);
                pricingRuleIdsRef.current.splice(pricingRuleIdsRef.current.indexOf(values.pricingRuleId), 1, values.pricingRuleId)
            }
            console.log("Updated player:", values);
            setEditAddPlayer({ pricingId: "", check: false, index: "" })
        }
        handleCostPricing();
    }
    // console.log(addPlayersData, "addpalyers")

    let facilityItemIds = [];
    let title = [];
    console.log(facilityItemIds, "ids");
     
    let moments = require('moment-timezone');
    const [eventsListing, setEventsListing] = useState([])
    const modifyDate = calendarDetails.date;
    const dateOf1 = moment(modifyDate).utc();
    console.log(dateOf1.format(),"datty");
    const dateOf = dateOf1.clone().add(1, 'day').subtract(1, 'second').subtract(1, 'minute').utc();
    console.log(dateOf.format(),"datecal");
    
   // currentMoment.clone().add(1, 'day').subtract(1, 'second').subtract(1, 'minute')
    const fetchEventData = async () => {
        try {
            const response = await axios.get(`${tempURL}/api/v1/reservations?centerId.equals=${centerId}&start.greaterThanOrEqual=${dateOf1.format()}&end.lessThanOrEqual=${dateOf.format()}&Id.in=${calendarDetails.facilities === "" ? facilityItemIds : calendarDetails.facilityId}`);
            const responseData = response.data;
            const resources = responseData.myresources;
            const timings = responseData.timings;
            console.log(resources, "resou");
             

            setTime({ ...time, start: timings.start, end: timings.end })
            setSpinner({...spinner,calendarSpinner:false});
            const eventList = responseData.events.map((evente) => {
                console.log(evente, "evein");

                return {
                    //  id: evente.id,
                    title: evente.reservation.title,
                    start: moments(evente?.start).tz(response?.data?.timezone?.name).utc()._d,
                    end: moments(evente?.end).tz(response?.data?.timezone?.name).utc()._d,
                    resourceId: evente.resourceId,
                    bgColor: evente.bgColor,
                    // firstName:evente.reservation.booking.firstName,
                    // lastName:evente.reservation.booking.lastName,
                    startTime:evente.reservation.booking.startTime,
                    endTime:evente.reservation.booking.endTime,
                    totalPrice:evente.reservation.booking.total,
                    rate:evente.reservation.ratePerSession,
                    revNumber:evente.reservation.booking.reservationNumber,
                    bookingStatus:evente.reservation.booking.bookingStatus,
                    facility:evente.reservation.facility.title,
                    createdAt:evente.reservation.booking.createdAt,
                    // start:new Date(evente.start),
                    // end:new Date(evente.end),
                    // color: evente.bgColor,
                }
            });
            setEventsListing(eventList);
            //console.log(eventlist,"fullevent");
            if (Array.isArray(resources)) {
                const eventsWithDynamicTitles: any = resources.map((resource) => {
                    title.push(resource?.title)
                    return {
                        id: resource.id,
                        title: resource.title,
                    };
                });
                setEventData(eventsWithDynamicTitles);
            } else {
                //  console.log('Invalid data structure or missing timing information.');
            }
        } catch (error) {
            console.error('Error fetching event data:', error);
        }
    };
    console.log(eventsListing, "listtt");

    // const events = [
    //     { id: 1, title: 'Event 1', start: new Date(), end: new Date() },
    //     { id: 2, title: 'Event 2', start: new Date(), end: new Date() }
    // ];
    // const resources = [
    //     { id :"res1" , title :"first"},
    //     { id : "res2" , title:"second"},
    // ]  
    // console.log(eventsListing,"evets");

    const startTimeMoment = moment(bookingDetails.startTime, 'hh:mm A');
    const startTime24HourFormat = startTimeMoment.format('HH:mm:ss');
    const endTimeMoment = moment(bookingDetails.endTime, 'hh:mm A');
    const endTime24HourFormat = endTimeMoment.format('HH:mm:ss');
    const startDate = moment(bookingDetails.startDate).format('YYYY-MM-DD');
    const endDate = moment(bookingDetails.endDate).format('YYYY-MM-DD');
    const startDateTime = moment.utc(`${startDate}T${startTime24HourFormat}Z`).add(7, 'hours').format();
    const endDateTime = moment.utc(`${endDate}T${endTime24HourFormat}Z`).add(7, 'hours').format();
    const handleCheckAvialability = () => {
        //console.log(bookingDetails.sportsId,"hjy");
        setSpinner({...spinner,checkAvialabilitySpinner:true});
        axios.get(`${tempURL}/api/v1/facility/getAvailability?centerId.equals=${centerId}&sportId.equals=${bookingDetails.sportsId}&startTime=${startDateTime}&endTime=${endDateTime}&isMultiple=${bookingDetails.bookingOccurence === "Single Booking" ? false : true}&days=${bookingDetails.bookingOccurence === "Single Booking" ? "" : bookingDetails.selectedDays}`)
            .then((response: any) => {
                if (response?.status === 200) { setAppearForm(true); setApiResponse({ ...apiResponse, checkFacility: response.data }); setErrorsMessage(""); setSpinner({...spinner,checkAvialabilitySpinner:false}); }
                else { setErrorsMessage(response); setSpinner({...spinner,checkAvialabilitySpinner:false});} 
            })
            .catch((err) => console.log(err, "response"))
    }
    const handleEdit = (index, data) => {
        setEditAddPlayer({ pricingId: data.pricingRuleId, check: true, index: index });
        setAddShow(true);
        console.log("Edit icon clicked");
        handleCostPricing();
    }
    console.log(bookingDetails.sportsId, "idsf");
    const handleCostPricing = () => {
        axios.get(`${tempURL}/api/v1/costByPricingRule?ids=${pricingRuleIdsRef.current}&startTime=${startDateTime}&endTime=${endDateTime}&isMultiple=${bookingDetails.bookingOccurence === "Single Booking" ? false : true}&daysList=${bookingDetails.bookingOccurence === "Single Booking" ? "" : bookingDetails.daysValues}`)
            .then((response) => { setTotalPrice(response.data); })
            .catch((err) => console.log(err))
    }
    const resourceClassName = 'custom-resource';
    const resourceStyle = (resource, _idx, _isSelected) => {
        //    console.log("inresou")
        return {
            backgroundColor: 'red',
            color: 'white',
        };
    };
    //   console.log(eventData, "timi")
    const startTimeString = time.start;
    const endTimeString = time.end;


    const startTimeParts = startTimeString.split(":").map(part => parseInt(part));
    const endTimeParts = endTimeString.split(":").map(part => parseInt(part));


    const CalendarStartTime = new Date();
    CalendarStartTime.setHours(startTimeParts[0], startTimeParts[1], startTimeParts[2], 0);

    const CalendarEndTime = new Date();
    CalendarEndTime.setHours(endTimeParts[0], endTimeParts[1], endTimeParts[2], 0);
    const bookId = localStorage.getItem("bookid");
    const bookReservation = {
        start: startDateTime,
        end: endDateTime,
        "reservation": {
            "desc": "Test description",
            "type": `${bookingDetails.bookingType}`,
            "notes": `${bookingDetails.notes}`,
            "title": `${bookingDetails.facilityType} - ${bookingDetails.firstName}`,
            "bgColour": "#fffff",
            "isCancelled": false,
            "booking": {
                "firstName": `${bookingDetails.firstName}`,
                "lastName": `${bookingDetails.lastName}`,
                "email": `${bookingDetails.emailAddress}`,
                "phoneNumber": `${bookingDetails.phoneNumber}`,
                "facilityId": parseInt(bookingDetails.facilityCheck),
                "facilityName": bookingDetails.facilityType,
                "pricingRuleName": bookingDetails.pricingRuleCheck,
                "pricingRule": parseInt(bookingDetails.pricingRule),
                "price": bookingDetails.costPrimary,
                "bookingSource": "Card",
                "bookingStatus": "PENDING",
                "createdAt": "2023-11-29T05:56:44.171333Z",
                "createdBy": bookId,
                "paymentStatus": "CREATED",
                "rateplan": "3",
                "updatedAt": "2023-12-26T10:19:18.785Z",
                "updatedBy": bookId
            }
        },
        "day": [],
        "isSingleBooking": bookingDetails.bookingOccurence === "Single Booking" ? "Single Booking" : "Multiple Booking",
        "facilityPricingDTO": {
            "facility": {
                "id": parseInt(bookingDetails.facilityCheck)
            },
            "pricingRule": {
                "id": parseInt(bookingDetails.pricingRule)
            }
        },
        "reservationPlayers": data
    }

    //    console.log(bookReservation,addPlayersData,"ffd")
    //  console.log("Rendering form component");
    // useEffect(() => {
    //     console.log("Component mounted or updated");
    // }, [editAddPlayer.index, addPlayersData]);
    const handleBookReservation = () => {
        axios.post(`${tempURL}/api/v1/reservations`, bookReservation)
            .then((response) => {
                console.log(response); Swal.fire({
                    icon: 'success',
                    title: 'Booked Successfully',
                });
            })
            .catch((err) => {
                console.log(err); Swal.fire({
                    icon: 'error',
                    title: 'Booking Failed',
                });
            })
    }
    const handleFacility = (id) => {
        console.log(id, "idoff");

        setBookingDetails({ ...bookingDetails, sportsId: id });
    }
    console.log(addPlayersData, "addpalye");
    const handleSelectEvent = (event) => {
        console.log(event, "jiooo");
        setSelectedEvent(event);
        setShowEvent(true);
    }
    const handleEventClose =() =>{
        setShowEvent(false);
    }
    const eventStyleGetter = (event) => {
        let style = {
            backgroundColor: event.bgColor,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: 'none',
            display: 'block'
        };

        return {
            style: style
        };
    }

    console.log(bookingDetails,selectedEvent, "bookrev")
    console.log(spinner,"apifac");
    
    
    return (
        
        <div className="bg-white mt-2 rounded-2 ">
            <Row className="p-3 mx-0">
                <EventColors />
            </Row>
            <hr className="my-1" />
            <Row className="p-3 mx-0">
                <div className="d-md-flex justify-content-between">
                    <Col sm={12} md={2} lg={2} xl={3}>
                        <div>Facility Type {spinner.sportSpinner ? <Spinner animation="border" variant="danger" size="sm" /> : null}</div>
                        <Form.Select aria-label="Default select example" className="mt-2" value={calendarDetails.facilityType} name="facilityType" onChange={(e) => handleCalendarChange(e)}>
                            {Array.isArray(apiResponse.facilityType) && apiResponse.facilityType.map((facility: any) => {
                                const sportsId = facility.sport.id;
                                return (
                                    <option value={facility.title} onClick={(e) => handleCalendarChange(e, sportsId)}>{facility.title}</option>
                                );
                            })}
                        </Form.Select>
                    </Col>
                    <Col sm={12} md={2} lg={2} xl={3}>
                        <label>Facilities {spinner.facilitySpinner ? <Spinner animation="border" variant="danger" size="sm" /> : null}</label>
                        <Form.Select aria-label="Default select example" className="mt-2" value={calendarDetails.facilityId} onChange={handleIds}>
                            <option value={""}>All Court</option>
                            {Object.entries(apiResponse.facilities).map(([courtName, courtArray]) => (
                                courtArray.map((facilityItem: { id: any; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }, index: any) => {
                                    facilityItemIds.push(facilityItem.id);
                                    return (
                                        <option key={`${courtName}-${index}`} value={facilityItem.id}> {facilityItem.name}</option>
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
                                <Button variant="danger" className="ms-4" onClick={handleShow}> Add Booking </Button>
                            </div>
                        </Col>
                    </div>
                </div>
            </Row>
            <Row className="p-2 mx-0 w-100">
               {spinner.calendarSpinner ?<div className="d-flex justify-content-center align-items-center mt-3"> <Spinner animation="border" variant="danger"   /> </div> : <Calendar
                    localizer={localizer}
                    events={eventsListing}
                    views={{ day: true, week: true, month: true }}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView={Views.DAY}
                    titleAccessor="title"
                    style={{ height: 550 }}
                    resources={eventData}
                    min={CalendarStartTime}
                    max={CalendarEndTime}
                    resourceIdAccessor="id"
                    resourceTitleAccessor="title"
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventStyleGetter}
                />}
                {selectedEvent && 
                <Offcanvas show={showEvent} onHide={handleEventClose} placement="end" >
                  <Offcanvas.Header className="bg-gainsboro fw-medium" closeButton>Booking Preview</Offcanvas.Header> 
                  <Offcanvas.Body>
                    <Row>
                        <Col>
                        <div className="fw-medium text-secondary">Payment method</div>
                        <div className="fw-bold">Online Payment</div>
                        </Col>
                        <Col>
                        <div  className="fw-medium text-secondary">Rate per session</div>
                        <div className="fw-bold">${selectedEvent?.rate}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <div  className="fw-medium text-secondary">Start Time</div>
                        <div className="fw-bold">{moment(selectedEvent?.startTime).format('YYYY-MM-DD h:mm a')}</div>
                        </Col>
                        <Col>
                        <div  className="fw-medium text-secondary">End Time</div>
                        <div className="fw-bold">{moment(selectedEvent?.endTime).format('YYYY-MM-DD h:mm a')}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <div  className="fw-medium text-secondary">Total Price</div>
                        <div className="fw-bold">${selectedEvent?.totalPrice}</div>
                        </Col>
                        <Col>
                        <div  className="fw-medium text-secondary">Created at</div>
                        <div className="fw-bold">{moment(selectedEvent?.createdAt).format('YYYY-MM-DD h:mm a')}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <div  className="fw-medium text-secondary">Reservation number</div>
                        <div className="fw-bold">{selectedEvent?.revNumber}</div>
                        </Col>
                        <Col>
                        <div  className="fw-medium text-secondary">Booking status</div>
                        <div className="fw-bold">{selectedEvent?.bookingStatus}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <div  className="fw-medium text-secondary">Facility</div>
                        <div className="fw-bold">{selectedEvent?.facility}</div>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                 
                    </Offcanvas.Body> 
                    
                </Offcanvas>}
            </Row>
            <Offcanvas show={show} onHide={handleClose} backdrop="static" placement="end" className="w-75">
                <Offcanvas.Header className="bg-gainsboro" closeButton>
                    <Offcanvas.Title >Booking</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Row>
                        <Col sm={12} md={12} lg={8} xl={8}>
                            <Row>
                                <Col sm={12} xl={6}>
                                    <Form.Label className="fw-medium">Booking Type<span className="text-danger ms-1">*</span></Form.Label>
                                    <Form.Select aria-label="Default select example" name="bookingType" value={bookingDetails.bookingType} onChange={handleChange}>
                                        {BookingType.map((booking) => {
                                            return (
                                                <option value={booking.value}>{booking.label}</option>)
                                        })}
                                    </Form.Select>
                                </Col>
                                <Col sm={12} xl={6}>
                                    <Form.Label>Facility Type<span className="text-danger ms-1">*</span></Form.Label>
                                    {/* <Form.Select aria-label="Default select example" name="facilityType" value={bookingDetails.facilityType} onChange={handleChange}>
                                        {apiResponse.facilityType.map((facility) => {
                                            return (
                                                <option value={facility.title} onClick={() =>handleFacility(facility.sport.id)} >{facility.title}</option>
                                            );
                                        })}
                                    </Form.Select> */}
                                    <Form.Select aria-label="Default select example" name="facilityType" value={bookingDetails.facilityType} onChange={handleChange}>
                                        {apiResponse.facilityType.map((facility) => {
                                            return (
                                                <option key={facility.sport.id} value={facility.title}>
                                                    {facility.title}
                                                </option>
                                            );
                                        })}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <Form.Label className="fw-medium ">Booking Occurence</Form.Label>
                                    <div className="mt-2">
                                        <Form.Check inline label="Single Booking" name="bookingOccurence" type={"radio"} id={`inline-1`} checked={bookingDetails.bookingOccurence === "Single Booking" && true} value={"Single Booking"} onChange={(e) => handleChange(e)} />
                                        <Form.Check inline label="Multiple Booking" name="bookingOccurence" type={"radio"} id={`inline-2`} value={"Multiple Booking"} onChange={handleChange} checked={bookingDetails.bookingOccurence === "Multiple Booking" && true} />
                                    </div>
                                </Col>
                                {bookingDetails.bookingOccurence === "Multiple Booking" &&
                                    <Col>
                                        <Form.Label>Frequency</Form.Label>
                                        <Form.Select aria-label="Default select example" name="frequency" value={bookingDetails.frequency} onChange={handleChange} disabled>
                                            <option value={"Weekly"}>Weekly</option>
                                        </Form.Select>
                                    </Col>}
                            </Row>
                            <Row className="mt-4">
                                <Col sm={12} md={6} lg={3} xl={3}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label className="mb-0">Start Date<span className="text-danger ms-1">*</span></Form.Label>
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
                                    <Select value={Time.find(option => option.value === startTime) || startTime} onChange={(selectedOption, actionMeta) => handleReactSelectChange(selectedOption, actionMeta)} options={Time} placeholder="hh:mm" name="startTime" isDisabled={bookingDetails.startDate === null && bookingDetails.endDate === null} />
                                </Col>
                                <Col sm={12} md={6} lg={3} xl={3}>
                                    <Form.Label className="mb-2 ">End Time<span className="text-danger ms-1">*</span></Form.Label>
                                    <Select value={Time.find(option => option.value === endTime) || endTime} onChange={(selectedOption, actionMeta) => handleReactSelectChange(selectedOption, actionMeta)} options={Time} placeholder="hh:mm" name="endTime" isDisabled={bookingDetails.startDate === null && bookingDetails.endDate === null} />
                                </Col>
                            </Row>
                            {bookingDetails.bookingOccurence === "Multiple Booking" && <div>
                                <div className="fw-medium my-2">Select Days</div>
                            </div>}
                            {bookingDetails.bookingOccurence === "Multiple Booking" && bookingDetails.startDate && bookingDetails.endDate && (
                                <div>{renderDaysOfWeek(bookingDetails.startDate, bookingDetails.endDate)} </div>)}

                            <div className="mt-5">
                                <Button variant="danger" className="" onClick={handleCheckAvialability} disabled={bookingDetails.startDate === null || bookingDetails.endDate === null || startTime === null || endTime === null || spinner.checkAvialabilitySpinner === true}>Check Availability {spinner.checkAvialabilitySpinner ? <Spinner animation="border" variant="light" size="sm" className="ms-1" /> : null}</Button>
                                <p className="text-danger">{errorsMessage}</p>
                            </div>
                            {appearForm && <>

                            <div className="fw-medium">Available Facility</div>
                            {apiResponse?.checkFacility?.map((facilities) => {
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
                                        cost: "",
                                    }}
                                >
                                    {({ handleSubmit, handleChange, values, errors, isValid }) => (
                                        <Form onSubmit={handleSubmit}>
                                            <Row className="mt-2">
                                                <Col sm={12} lg={6} xl={6}>
                                                    <Form.Label>First Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter First Name" className="mt-1" name="firstName" value={values.firstName} onChange={handleChange} isInvalid={!!errors.firstName} disabled={buttonText === 'Edit'} />
                                                    <Form.Control.Feedback type={"invalid"} >{errors.firstName}</Form.Control.Feedback>
                                                </Col>
                                                <Col sm={12} lg={6} xl={6}>
                                                    <Form.Label>Last Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Last Name" className="mt-1" name="lastName" value={values.lastName} onChange={handleChange} isInvalid={!!errors.lastName} disabled={buttonText === 'Edit'} />
                                                    {errors.lastName && <Form.Control.Feedback type={"invalid"} >{errors.lastName}</Form.Control.Feedback>}
                                                </Col>
                                            </Row>
                                            <Row className="mt-2">
                                                <Col sm={12} lg={6} xl={6}>
                                                    <Form.Label>Phone Number</Form.Label>
                                                    <Form.Control type="number" placeholder="Enter Phone Number" className="mt-1" name="phoneNumber" value={values.phoneNumber} onChange={handleChange} isInvalid={!!errors.phoneNumber} disabled={buttonText === 'Edit'} />
                                                    {errors.phoneNumber && <Form.Control.Feedback type={"invalid"} >{errors.phoneNumber}</Form.Control.Feedback>}
                                                </Col>
                                                <Col sm={12} lg={6} xl={6}>
                                                    <Form.Label>Email address</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Email address" className="mt-1" name="emailAddress" value={values.emailAddress} onChange={handleChange} isInvalid={!!errors.emailAddress} disabled={buttonText === 'Edit'} />
                                                    <Form.Control.Feedback type={"invalid"} >{errors.emailAddress}</Form.Control.Feedback>
                                                </Col>
                                            </Row>
                                            <Row className="mt-3 d-flex justify-content-between ">
                                                <Col sm={12} lg={6} xl={6} className="">
                                                    <Form.Label className="px-0 fw-medium">Facility</Form.Label>
                                                    <div className="h-35 border p-2" >
                                                        {/* {Object.values(apiResponse.facilities).map((type: any, index: any) => {
                                                            return (
                                                                <div key={index}>
                                                                    {type.map((facilities: any) => {
                                                                        return (
                                                                            <Form.Check
                                                                                type={"radio"}
                                                                                label={`${facilities?.name}`}
                                                                                value={`${facilities?.name}`}
                                                                                name={"facility"}
                                                                                onClick={() => handleBookFacility(facilities)}
                                                                                onChange={() => handleChange({ target: { name: 'facility', value: facilities?.name } })}
                                                                                defaultChecked={values.facility === `${facilities?.name}`}
                                                                                isInvalid={!!errors.facility}
                                                                                disabled={buttonText === 'Edit'}
                                                                            />)
                                                                    })}
                                                                </div>
                                                            )
                                                        })} */}
                                                        {/* {Object.values(apiResponse.facilities).map((type: any, index: any) => {
                                                            return (
                                                                <div key={index}> */}
                                                                    {apiResponse?.checkFacility?.map((facilities: any) => {
                                                                        return (
                                                                            <Form.Check
                                                                                type={"radio"}
                                                                                label={`${facilities?.title}`}
                                                                                value={`${facilities?.title}`}
                                                                                name={"facility"}
                                                                                onClick={() => handleBookFacility(facilities)}
                                                                                onChange={() => handleChange({ target: { name: 'facility', value: facilities?.title } })}
                                                                                defaultChecked={values.facility === `${facilities?.title}`}
                                                                                isInvalid={!!errors.facility}
                                                                                disabled={buttonText === 'Edit'}
                                                                            />)
                                                                    })}
                                                                {/* </div>
                                                            )
                                                        })} */}
                                                    </div>
                                                    {values.facility === "" && <span className="text-danger" >{errors.facility}</span>}
                                                </Col>
                                                <Col sm={12} lg={6} xl={6} className="">
                                                    <Form.Label className="px-0 fw-medium">Pricing Rule</Form.Label>
                                                    <div className="h-35 border p-2">
                                                        <div className="fw-medium">{bookingDetails.facilities}</div>
                                                        {spinner.checkAvialabilitySpinner ? <Spinner animation="border" variant="danger"   /> : Object.values(apiResponse.pricingrule).map((pricing, index) => {
                                                            //    console.log(pricing?.pricingRuleId,"pricein");

                                                            return (
                                                                <div key={index}>
                                                                    <Form.Check
                                                                        type={"radio"}
                                                                        label={`${pricing?.pricingRule?.ruleName}`}
                                                                        value={`${pricing?.pricingRule?.ruleName}`}
                                                                        name={"pricingRule"}
                                                                        onChange={() => handleChange({ target: { name: 'pricingRule', value: pricing?.pricingRule?.ruleName } })}
                                                                        defaultChecked={values.pricingRule === `${pricing?.pricingRule?.ruleName}`}
                                                                        isInvalid={!!errors.pricingRule}
                                                                        onClick={() => handleBookingCost(pricing)}
                                                                        disabled={buttonText === 'Edit'}
                                                                    />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <span className="text-danger">{errors.pricingRule}</span>
                                                </Col>
                                            </Row>
                                            <div className="text-end">
                                                <Button variant={buttonText === 'Edit' ? "warning" : "success"} type="submit" className="mt-2 ">{buttonText}</Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </Row>
                            {buttonText === "Edit" && 
                            <div><Button variant="danger" onClick={handleAddPlayerOpen}>Add Player</Button></div>
                            }
                            {addPlayersData.length > 0 && <Table responsive bordered hover striped className="mt-2">
                                <thead className="border">
                                    {Array.isArray(TableAddPlayers) && TableAddPlayers.map((head) => {
                                        return (
                                            <th className="border p-2">{head.label}</th>
                                        )
                                    })}
                                </thead>
                                <tbody>
                                    {Array.isArray(addPlayersData) && addPlayersData.map((data: {pricingRule: ReactNode; facilityType: ReactNode; firstName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; lastName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; addFacilityCheck: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; addPricingCheck: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; cost: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: number) => {
                                        // console.log(addPlayersData, "addpalydata");
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{data.firstName}</td>
                                                <td>{data.lastName}</td>
                                                <td>{data.facilityType}</td>
                                                <td>{data.pricingRule}</td>
                                                <td>{data.cost ? data.cost : bookingDetails.costPrimary}</td>
                                                <td><div className="bg-warning w-50 px-2 mx-auto rounded-2 mt-1" onClick={() => handleEdit(index, data)}><Icon icon="uil:edit" /></div><div className="bg-danger w-50 px-2 mx-auto  mt-1 rounded-2" onClick={() => deleteRow(index, data)}><Icon icon="mi:delete" /></div></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>}
                            <Offcanvas show={addShow} onHide={handleAddPlayerClose} placement="end">
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>{editAddPlayer.check === false ? "Add" : "Edit"} Player</Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <Formik
                                        validationSchema={schemae}
                                        onSubmit={handlePlayerSubmit}
                                        initialValues={{
                                            firstName: editAddPlayer.index !== null && addPlayersData[editAddPlayer.index]?.firstName ? addPlayersData[editAddPlayer.index].firstName : "",
                                            lastName: editAddPlayer.index !== null && addPlayersData[editAddPlayer.index]?.lastName ? addPlayersData[editAddPlayer.index].lastName : "",
                                            facilityType: editAddPlayer.index !== null && addPlayersData[editAddPlayer.index]?.facilityType ? addPlayersData[editAddPlayer.index].facilityType : "",
                                            pricingRule: editAddPlayer.index !== null && addPlayersData[editAddPlayer.index]?.pricingRule ? addPlayersData[editAddPlayer.index].pricingRule : "",
                                            sameAsPrimary: editAddPlayer.index !== null && addPlayersData[editAddPlayer.index]?.sameAsPrimary ? addPlayersData[editAddPlayer.index].sameAsPrimary : false,
                                            nameDisClose: editAddPlayer.index !== null && addPlayersData[editAddPlayer.index]?.nameDisClose ? addPlayersData[editAddPlayer.index].nameDisClose : false,
                                            cost: editAddPlayer.index !== null && addPlayersData[editAddPlayer.index]?.cost ? addPlayersData[editAddPlayer.index].cost : "",
                                            pricingRuleId: editAddPlayer.index !== null && addPlayersData[editAddPlayer.index]?.pricingRuleId ? addPlayersData[editAddPlayer.index].pricingRuleId : "",
                                            facilityId: editAddPlayer.index !== null && addPlayersData[editAddPlayer.index]?.facilityId ? addPlayersData[editAddPlayer.index].facilityId : "",
                                        }}
                                    //  enableReinitialize={true}
                                    >
                                        {/* {({ initialValues }) => {
                                            console.log("Initial Values:", initialValues);
                                            // Rest of your Formik code
                                        }} */}
                                        {({ handleSubmit, handleChange, values, errors, setFieldValue, touched }) => (
                                            <Form onSubmit={handleSubmit}>
                                                <Form.Check
                                                    inline
                                                    label="Name not disclosed"
                                                    name="nameDisClose"
                                                    type={"checkbox"}
                                                    className="mt-2 "
                                                    checked={values.nameDisClose}
                                                    onClick={(e:any) => {
                                                        console.log("Changing field:", e.target.name, "New value:", e.target.value, e.target.checked);
                                                        setFieldValue('nameDisClose', e.target.checked);
                                                        setFieldValue('firstName', e.target.checked === true ? "Name not disclosed" : "");
                                                        setFieldValue('lastName', e.target.checked === true ? "Name not disclosed" : "");
                                                        setFieldValue('touched.firstName', e.target.checked);
                                                        setFieldValue('touched.lastName', e.target.checked);
                                                    }}
                                                />
                                                <Row className="mt-2">
                                                    <Col>
                                                        <Form.Label className="fw-medium">FirstName</Form.Label>
                                                        <Form.Control type="text" placeholder="Enter firstName"
                                                            //  value={!editAddPlayer.check ? values.nameDisClose ? "Name not disclosed" : values.firstName : (addPlayersData[editAddPlayer.index]?.firstName || "")}
                                                            value={values.firstName}
                                                            name="firstName"
                                                            onChange={(e) => { console.log("Changing field:", e.target.name, "New value:", e.target.value); setFieldValue(e.target.name, e.target.value) }}
                                                            disabled={values.nameDisClose === true} isInvalid={touched.firstName && !!errors.firstName}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                                                    </Col>
                                                    <Col>
                                                        <Form.Label className="fw-medium">LastName</Form.Label>
                                                        <Form.Control type="text" placeholder="Enter lastName"
                                                            //  value={!editAddPlayer.check ? values.nameDisClose ? "Name not disclosed" : values.lastName : addPlayersData[editAddPlayer.index].lastName}
                                                            value={values.lastName}
                                                            name="lastName"
                                                            onChange={(e) => { console.log("Changing field:", e.target.name, "New value:", e.target.value); setFieldValue("lastName", e.target.value) }}
                                                            disabled={values.nameDisClose === true} isInvalid={touched.firstName && !!errors.lastName}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors.lastName} </Form.Control.Feedback>
                                                    </Col>
                                                </Row>
                                                <Form.Check
                                                    inline label="Same as Primary" name="sameAsPrimary" type={"checkbox"} className="mt-2" value={values.sameAsPrimary}
                                                    onChange={(e) => {
                                                        setFieldValue('sameAsPrimary', e.target.checked);
                                                        setFieldValue('pricingRule', bookingDetails.pricingRuleCheck);
                                                        setFieldValue('facilityType', bookingDetails.facilityCheck);
                                                        setFieldValue('cost', addPlayers.cost);
                                                        console.log("Changing field:", e.target.name, "New value:", e.target.value);
                                                    }}

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
                                                                                    label={`${facility?.name}`}
                                                                                    value={!editAddPlayer.check ? values.sameAsPrimary ? bookingDetails.facilityCheck : `${facility?.name}` : addPlayersData[editAddPlayer.index].facilityType}
                                                                                    name="facilityType"
                                                                                    disabled={values.sameAsPrimary === true}
                                                                                    onClick={() => handleBookFacility(facility)}
                                                                                    onChange={() => { handleChange({ target: { name: 'facilityType', value: facility?.name } }); setFieldValue('facilityId', facility?.id) }}
                                                                                    checked={values.facilityType === facility?.name}
                                                                                    isInvalid={!!errors.facilityType && touched.facilityType}

                                                                                />)
                                                                        })}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        {touched.facilityType && <span className="text-danger" >{errors.facilityType}</span>}
                                                    </Col>
                                                    <Col xs={6} className="">
                                                        <Form.Label className="px-0 fw-medium">Pricing Rule</Form.Label>
                                                        <div className="h-35 border p-2">
                                                            <div className="fw-medium">{values.facilityType}</div>
                                                            {Object.values(apiResponse.pricingrule).map((pricing, index) => {
                                                                //  console.log(pricing?.pricingRuleId,"ki");

                                                                return (
                                                                    <div key={index}>
                                                                        <Form.Check
                                                                            type={"radio"}
                                                                            label={`${pricing?.pricingRule?.ruleName}`}
                                                                            value={!editAddPlayer.check ? values.sameAsPrimary ? bookingDetails.pricingRuleCheck : `${pricing?.pricingRule?.ruleName}` : addPlayersData[editAddPlayer.index].pricingRule}
                                                                            name="pricingRule"
                                                                            disabled={values.sameAsPrimary === true}
                                                                            onClick={() => handleAddPlayerCost(pricing)}
                                                                            onChange={() => { handleChange({ target: { name: 'pricingRule', value: pricing?.pricingRule?.ruleName } }); setFieldValue("cost", pricing?.pricingRule?.cost); setFieldValue("pricingRuleId", pricing?.pricingRuleId); }}
                                                                            isInvalid={!!errors.pricingRule && touched.pricingRule}
                                                                            checked={values.pricingRule === pricing?.pricingRule?.ruleName}

                                                                        />
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        {touched.pricingRule && <span className="text-danger">{errors.pricingRule}</span>}
                                                    </Col>
                                                </Row>
                                              {showAlert &&  <Alert variant="success"  className="mt-2">
                                                    Player {editAddPlayer.check === true ? "Updated":"Added"} SuccessFully
                                                </Alert>}
                                                <div className="text-center mt-2 "> <Button variant={editAddPlayer.check === false ? "success" : "warning"} type="submit" className="w-75" >{editAddPlayer.check === false ? "Add" : "Update"}</Button> </div>
                                                <div className="text-center mt-2"> <Button variant="danger" type="button" className="w-75" onClick={handleAddPlayerClose}>Close</Button> </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </Offcanvas.Body>
                            </Offcanvas>
                            </>}
                            <Row className="mt-4 mx-1 ">
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
                        <Col sm={12} md={12} lg={4} xl={4} className="border border-2 mt-2 mt-md-0 m-md-3 m-lg-0 p-3">
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
                            {buttonText === "Edit" && <>
                                <div className="fw-bold">Player's Facility and Pricing Details<span className="bg-danger text-white px-1 rounded-1 ms-1">{addPlayersData.length + 1}</span></div>
                                <Table responsive bordered hover striped className="mt-2">
                                    <thead>
                                        {Array.isArray(TablePricing) && TablePricing.map((head) => {
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
                                            <td className="fw-bold">${bookingDetails.costPrimary}</td>
                                        </tr>
                                        {Array.isArray(addPlayersData) && addPlayersData.map((data: { pricingRule: ReactNode;facilityType: ReactNode; firstName: ReactNode | string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; addFacilityCheck: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; addPricingCheck: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; cost: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: number) => {
                                            let serialnumber: any = index + 2;
                                            return (
                                                <tr key={index}>
                                                    <td>{serialnumber}</td>
                                                    <td>{data.firstName}</td>
                                                    <td>{data.facilityType}</td>
                                                    <td>{data.pricingRule}</td>
                                                    <td className="fw-bold">${data.cost ? data.cost : bookingDetails.costPrimary}</td>
                                                </tr>
                                            )
                                        })}
                                        <tr>
                                            <td colSpan={4}>Total Price</td>
                                            <td><span className="bg-dark text-white p-1 rounded-2">${totalPrice}</span></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </>}
                        </Col>
                    </Row>
                </Offcanvas.Body>
                <div className="bg-gainsboro text-end p-2"><Button variant="danger" onClick={handleOpenBookPreview} disabled={buttonText === 'Save'}>Proceed to Book</Button></div>
                <Offcanvas show={bookShow} onHide={handleCloseBookPreview} placement="end" className="w-75">
                    <Offcanvas.Header >
                        <Offcanvas.Title>Booking Preview</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Row>

                            <Col sm={12} md={8} lg={8} xl={8} className=" border-end ">
                                <div className="text-center">
                                    <img src={apiResponse?.facilityType[sportID - 1]?.url}></img>
                                    <div className="fw-medium mb-2">{bookingDetails.facilityType}</div>
                                </div>
                                <div className="border rounded-2 ">
                                    <Row className="d-flex justify-content-between p-3">
                                        <Col xs={4}>
                                            <div className="text-secondary">Booking Type</div>
                                            <div className="fw-bold">{bookingDetails.bookingType}</div>
                                        </Col>
                                        <Col xs={4}>
                                            <div className="text-secondary">Facility Type</div>
                                            <div className="fw-bold">{bookingDetails.facilities}</div>
                                        </Col>
                                        <Col xs={4}>
                                            <div className="text-secondary">Booking Occurence</div>
                                            <div className="fw-bold">{bookingDetails.bookingOccurence}</div>
                                        </Col>
                                    </Row>
                                    <Row className="d-flex justify-content-between p-3">
                                        <Col xs={4}>
                                            <div className="text-secondary">Start Date and Time</div>
                                            {bookingDetails.startDate && <div className="fw-bold"><Moment format="MMMM DD YYYY ">{bookingDetails.startDate}</Moment>{bookingDetails.startTime} </div>}
                                        </Col>
                                        <Col xs={4}>
                                            <div className="text-secondary">End Date and Time</div>
                                            {bookingDetails.endDate && <div className="fw-bold"><Moment format="MMMM DD YYYY ">{bookingDetails.endDate}</Moment>{bookingDetails.endTime} </div>}
                                        </Col>
                                        <Col xs={4}>
                                            <div className="text-secondary">Notes</div>
                                            <div className="fw-bold text-truncate">{bookingDetails.notes}</div>
                                        </Col>
                                    </Row>
                                    <div className="p-2">
                                        <div className="fw-bold">Player's Facility and Pricing Details <span className="bg-danger text-white px-1 rounded-1 ms-1">{addPlayersData.length + 1}</span></div>
                                        <Table responsive bordered hover striped className="mt-2">
                                            <thead>
                                                {Array.isArray(TablePricing) && TablePricing.map((head) => {
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
                                                    <td className="fw-bold">${bookingDetails.costPrimary}</td>
                                                </tr>
                                                {Array.isArray(addPlayersData) && addPlayersData.map((data: { pricingRule: ReactNode; facilityType: ReactNode; firstName: ReactNode | string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; addFacilityCheck: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; addPricingCheck: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; cost: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: number) => {
                                                    const serialNo = index + 2;
                                                    return (
                                                        <tr key={index}>
                                                            <td>{serialNo}</td>
                                                            <td>{data.firstName}</td>
                                                            <td>{data.facilityType}</td>
                                                            <td>{data.pricingRule}</td>
                                                            <td className="fw-bold">${data.cost ? data.cost : bookingDetails.costPrimary}</td>
                                                        </tr>
                                                    )
                                                })}
                                                <tr>
                                                    <td colSpan={4} className="fw-bold">Total Price</td>
                                                    <td><span className="bg-dark text-white p-1 rounded-2">${totalPrice}</span></td>
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
                                            name="group1"
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between border p-2 my-3 rounded-2"><div><Icon icon="bi:clock" style={{ color: "black" }} /><span className="ms-2">Pay Later</span></div>
                                        <Form.Check
                                            type={"radio"}
                                            label={` `}
                                            id={`disabled-default`}
                                            name="group1"
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between border p-2 my-3 rounded-2"><div><Icon icon="iconoir:no-credit-card" style={{ color: "black" }} /><span className="ms-2">No Payment</span></div>
                                        <Form.Check
                                            type={"radio"}
                                            label={` `}
                                            id={`disabled-default`}
                                            name="group1"
                                        />
                                    </div>
                                </div>
                                <div className="text-center"> <Button variant="danger" className="mt-4" onClick={handleBookReservation} >Book Now</Button> </div>
                            </Col>
                        </Row>
                    </Offcanvas.Body>
                    <div className="bg-gainsboro text-end p-2"><Button className="bg-dark" onClick={handleCloseBookPreview}>Back</Button></div>
                </Offcanvas>
            </Offcanvas>
        </div>
    );
}
export default Reservation;


