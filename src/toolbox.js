import "./toolbox_styles.css";
import React, { useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsBrush, BsEraser, BsSquare , BsSquareFill ,BsCircle, BsCircleFill } from "react-icons/bs";
import { GiArrowCursor } from "react-icons/gi";
import { CgFormatText } from "react-icons/cg";

import { CirclePicker } from 'react-color';
import 'rc-slider/assets/index.css';

const BrushToolbox = (props) => {
    const [radius, setRadius] = useState("5");
    const [color, setColor] = useState("black");
    useEffect(() => {
        props.onToolSettingChange({ name: "brush", radius: radius, color: color });
        // eslint-disable-next-line
    }, [radius, color]); 
    
    return (
        <div className={"icon dropdown" + (props.current_tool === "brush" ? " active" : "")}
            onClick={() => {
                props.onToolSettingChange({ name: "brush", radius: radius, color: color });
            }}
        >
            <BsBrush />
            <div className="dropdown-content">
                radius <br />
                <input type="range" min="1" max="100" value={radius} onChange={evt => setRadius(evt.target.value)} /><br />
                color <br />
                <CirclePicker onChangeComplete={value => setColor(value.hex)} />
            </div>
        </div>

    );
}

const EraserToolbox = (props) => {
    const [radius, setRadius] = useState("5");
    useEffect(() => {
        props.onToolSettingChange({ name: "eraser", radius: radius});
        // eslint-disable-next-line
    }, [radius]);

    return (
        <div className={"icon dropdown" + (props.current_tool === "eraser" ? " active" : "")}
            onClick={() => {
                props.onToolSettingChange({ name: "eraser", radius: radius});
            }}
        >
            <BsEraser />
            <div className="dropdown-content">
                radius <br />
                <input type="range" min="1" max="100" value={radius} onChange={evt => setRadius(evt.target.value)} /><br />
            </div>
        </div>

    );
}

const ShapesToolbox = (props) => {
    const [radius, setRadius] = useState("5");
    const [color, setColor] = useState("black");
    const [type, setType] = useState("rect");

    useEffect(() => {
        props.onToolSettingChange({ name: "shapes", radius: radius, color: color , type: type});
        // eslint-disable-next-line
    }, [radius, color, type]);

    return (
        <div className={"icon dropdown" + (props.current_tool === "shapes" ? " active" : "")}
            onClick={() => {
                props.onToolSettingChange({ name: "shapes", radius: radius, color: color ,type: type});
            }}
        >
            <BsSquare />
            <div className="dropdown-content">
                <div className="hicon-container">
                    
                        <div className="hicon" >
                            <BsSquareFill onClick={() => setType("fill rect")} />
                        </div>
                        <div className="hicon" >
                            <BsCircle onClick={() => setType("circle")} />
                        </div>
                        <div className="hicon">
                            <BsCircleFill onClick={() => setType("fill circle")} />
                        </div>


                    
                </div>
                
                
                <br />
                radius <br />
                <input type="range" min="1" max="100" value={radius} onChange={evt => setRadius(evt.target.value)} /><br />
                color <br />
                <CirclePicker onChangeComplete={value => setColor(value.hex)} />
            </div>
        </div>
    );
}

export default function Toolbox(props) {

    const [tool, setTool] = useState({ name: "pencil", color: "black" });


    useEffect(() => {
        props.onToolChangeHandler(tool);
    }, [tool, props]);

    return (
        <div className="tool-box">
            <div className="icon-bar">
                <BrushToolbox current_tool={tool.name} onToolSettingChange={t=>setTool(t) }/>

                <EraserToolbox current_tool={tool.name} onToolSettingChange={t => setTool(t)} />
                
                <ShapesToolbox current_tool={tool.name} onToolSettingChange={t => setTool(t)} />
                
                <div className={"icon" + (tool.name === "select" ? " active" : "")}
                    onClick={() => {
                        setTool({ name: "select" });
                    }}
                >
                    <GiArrowCursor />
                </div>
                <div className={"icon" + (tool.name === "text" ? " active" : "")}
                    onClick={() => {
                        setTool({ name: "text", color: "black" });
                    }}
                >
                    <CgFormatText />
                </div>
            </div>
        </div>
    );
}