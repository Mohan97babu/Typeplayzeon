import { Form } from "react-bootstrap"
import React from "react";

interface InputFieldProps {
    labelClassName: string;
    label: string;
    type: string;
    placeholder: string;
    name: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    errors: string;
  }
const InputField: React.FC<InputFieldProps> = ({labelClassName,label,type,placeholder,name,onChange,value,errors}) => {
   // console.log(label,"lab");
    return (
        <Form.Group className="mb-3" >
            <Form.Label className={labelClassName}>{label}</Form.Label>
            <Form.Control type={type} placeholder={placeholder} name={name} onChange={onChange} value={value}  />
            <p className="text-danger">{errors}</p>
        </Form.Group>
    )
}
export default InputField