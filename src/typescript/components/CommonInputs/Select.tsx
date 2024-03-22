import { Form } from "react-bootstrap";
import React from "react";

interface SelectProps {
  SelectTitle: string;
  Options: React.ReactNode; 
  className?: string;
  value: string;
  name: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({SelectTitle,Options,className,value,name,handleChange}) => {
    return (
        <>
        <label>{SelectTitle}</label>
        <Form.Select aria-label="Default select example" className={className} value={value} name={name} onChange={handleChange}>
          {Options}
        </Form.Select> 
        </>      
      
    )
}
export default Select