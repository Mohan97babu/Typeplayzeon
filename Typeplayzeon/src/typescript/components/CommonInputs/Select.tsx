const Select = ({SelectTitle,Options,className,value,name,handleChange}) => {
    return (
        <>
        <div>{SelectTitle}</div>
        <Form.Select aria-label="Default select example" className={className} value={value} name={name} onChange={handleChange}>
          {Options}
        </Form.Select>       
        </>
    )
}
export default Select