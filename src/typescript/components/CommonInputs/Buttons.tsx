import { Button } from "react-bootstrap"

const Buttons = ({variant,className,handleClick,content,icon}) =>
{
    return(
        <Button variant={variant} className={className} onClick={handleClick}>{icon}{content}</Button>
    )

}
export default Buttons