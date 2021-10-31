import "./whiteboard_styles.css";
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import { ConstraintLayout } from "react-constraint-layout";
import Toolbox from "./toolbox.js";

const drawFree = (context, points, radius, color) => {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = radius;
  context.strokeStyle = color;
  context.beginPath();
  var i = 0;
  while (i < points.length) {
    const p = points[i++];
    context.lineTo(p.x, p.y);
  }
  context.stroke();
  context.closePath();
}

const drawShape = (context, points, radius, color, type) => {
  if (points.length === 2) {
    context.beginPath();
    context.lineWidth = radius;
    context.strokeStyle = color;
    const { x: startX, y: startY } = points[0];
    const { x: toX, y: toY } = points[1];
    switch (type) {
      case "rect":
        context.rect(startX, startY, toX - startX, toY - startY);
        break;
      case "fill rect":
        context.rect(startX, startY, toX - startX, toY - startY);
        context.fillStyle = color;
        context.fill();
        break;
      case "circle":
        context.arc(startX, startY, Math.hypot(toX - startX,toY-startY), 0, 2 * Math.PI);
        break;
      case "fill circle":
        context.arc(startX, startY, Math.hypot(toX - startX, toY - startY), 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
        break;
      default:

    }
    
    context.stroke();
    context.closePath();
  }
}

const eraseFree = (context, points, radius) => {
  if (points.length>1) {
    const p = points[points.length-1];
    context.clearRect(p.x-radius/2,p.y-radius/2,radius,radius);
  }
  context.closePath();
}

export default function Whiteboard() {

  const [tool, setTool] = useState({ name: "pencil", color: "black" });
  const [canvasCursor, setCanvasCursor] = useState("pointer");
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const canvasref = useRef(null);
  const canvasref2 = useRef(null);
  useEffect(() => {
    switch (tool.name) {
      case "shapes":
        setCanvasCursor("crosshair");
        break;
      default:
        setCanvasCursor("crosshair");
    }
  }, [tool]);

 
  const draw = (evt) => {
    if (isDrawing) {
      const canvas = canvasref.current;
      const context = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect(); // abs. size of element
      const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
      const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y
      const OL = rect.left;
      const OT = rect.top;


      switch (tool.name) {

        case "pencil":
          setPoints(points.concat([{
            x: (evt.clientX - OL) * scaleX,
            y: (evt.clientY - OT) * scaleY
          }]));
          drawFree(context, points, 1, tool.color);
          break;

        case "brush":
          setPoints(points.concat([{
            x: (evt.clientX - OL) * scaleX,
            y: (evt.clientY - OT) * scaleY
          }]));
          drawFree(context, points, tool.radius, tool.color);
          break;

        case "eraser":
          setPoints(points.concat([{
            x: (evt.clientX - OL) * scaleX,
            y: (evt.clientY - OT) * scaleY
          }]));
          eraseFree(context, points, tool.radius);
          break;

        case "shapes":

          const canvas2 = canvasref2.current;
          const context2 = canvas2.getContext("2d");
          context2.clearRect(0, 0, canvas2.width, canvas2.height);
          const new_points = points.concat([{
            x: (evt.clientX - OL) * scaleX,
            y: (evt.clientY - OT) * scaleY
          }]);
          //console.log("before move: " + new_points.length);
          drawShape(context2, new_points, tool.radius, tool.color, tool.type);
          break;
        default:
      }
    }

  };

  const onMouseDown = (evt) => {
    setIsDrawing(true);
    const canvas = canvasref.current;
    //const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect(); // abs. size of element
    const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
    const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y
    const OL = rect.left;
    const OT = rect.top;
    switch (tool.name) {
      case "pencil":
        setPoints([{
          x: (evt.clientX - OL) * scaleX,
          y: (evt.clientY - OT) * scaleY
        }]);
        break;
      case "brush":
        setPoints([{
          x: (evt.clientX - OL) * scaleX,
          y: (evt.clientY - OT) * scaleY
        }]);
        break;
      case "eraser":
        setPoints([{
          x: (evt.clientX - OL) * scaleX,
          y: (evt.clientY - OT) * scaleY
        }]);
        break;
      case "shapes":
        setPoints([{
          x: (evt.clientX - OL) * scaleX,
          y: (evt.clientY - OT) * scaleY
        }]);
        //console.log("after down: " + points.length);
        break;
      default:
    }
  };

  const onMouseUp = (evt) => {
    setIsDrawing(false);
    const canvas = canvasref.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect(); // abs. size of element
    const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
    const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y
    const OL = rect.left;
    const OT = rect.top;
    switch (tool.name) {
      case "shapes":
        const canvas2 = canvasref2.current;
        const context2 = canvas2.getContext("2d");
        context2.clearRect(0, 0, canvas2.width, canvas2.height);
        //console.log("before: " + points.length);
        setPoints(points.concat([{
          x: (evt.clientX - OL) * scaleX,
          y: (evt.clientY - OT) * scaleY
        }]));
        //console.log("up: " + points.length);

        drawShape(context, points.concat([{
          x: (evt.clientX - OL) * scaleX,
          y: (evt.clientY - OT) * scaleY
        }]), tool.radius, tool.color, tool.type);
        //console.log("up");
        break;
      default:
    }
  };

  return (
    <div id="container">
      <div id="toolbox">
        <Toolbox onToolChangeHandler={(t) => setTool(t)} />
      </div>
      <div id="boardcanvas">
        <div id="canvas2">
          <canvas
            className="white-board"
            ref={canvasref2}
            width="1600"
            height="1200"
            style={{ cursor: canvasCursor }}
          />
        </div>
        <div id="canvas">
          <canvas
            className="white-board"
            ref={canvasref}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={draw}
            width="1600"
            height="1200"
            style={{ cursor: canvasCursor }}
          />
        </div>
      </div>
    </div>
  );
}