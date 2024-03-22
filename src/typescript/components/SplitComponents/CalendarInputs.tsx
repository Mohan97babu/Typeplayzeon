import Select from "../CommonInputs/Select.tsx"
import {useContext} from "react"
import {data1} from "../Context/Context.ts"
import React from "react";
const CalendarInputs =({handleCalendarChange}) =>
{
    const {bookingDetails,apiResponse,calendarDetails} = useContext(data1);
    console.log(apiResponse,"apires");
   return (
       <Select SelectTitle={"Facility Type"} className={"mt-2"} value={calendarDetails.facilityType} name={"facilityType"} handleChange={handleCalendarChange} Options={Array.isArray(apiResponse.facilityType) && apiResponse.facilityType.map((facility: any) => {
        const sportsId = facility.sport.id;
        return (
            <option key={sportsId} value={facility.title}>{facility.title}</option>
        );
    })}/>
   )
}
export default CalendarInputs