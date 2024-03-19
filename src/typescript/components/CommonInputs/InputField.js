import { Form } from "react-bootstrap"

const InputField = ({labelClassName,label,type,placeholder,name,onChange,value,errors}) => {
   // console.log(label,"lab");
    return (
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className={labelClassName}>{label}</Form.Label>
            <Form.Control type={type} placeholder={placeholder} name={name} onChange={onChange} value={value}  />
            <p className="text-danger">{errors}</p>
        </Form.Group>
    )
}
export default InputField