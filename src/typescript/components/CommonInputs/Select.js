import { Form } from "react-bootstrap"

const Select = ({SelectTitle,Options,className,value,name,handleChange,Mandatory}) => {
    return (
        <>
        <div>{SelectTitle}{Mandatory}</div>
        <Form.Select aria-label="Default select example" className={className} value={value} name={name} onChange={handleChange}>
          {Options}
        </Form.Select>       
        </>
    )
}
export default Select