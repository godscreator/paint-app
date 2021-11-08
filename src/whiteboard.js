import "./whiteboard_styles.css";
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Toolbox from "./toolbox.js";

const downloadCanvas = (downloadref, canvasref) => {
  if (canvasref.current !== null && downloadref.current!== null) {
    var dataURL = canvasref.current.toDataURL('image/png', 1.0);
    downloadref.current.href = dataURL;
    downloadref.current.download = "fine.png";
    downloadref.current.click();
  }
}
const drawFree = (context, points, radius, color) => {
  if (points.length >= 2) {
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = radius;
    context.strokeStyle = color;
    context.beginPath();
    var p = points[points.length - 2];
    context.moveTo(p.x, p.y);
    var q = points[points.length - 1];
    context.lineTo(q.x, q.y);
    context.stroke();
    context.closePath();
  }
  
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
      case "line":
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(toX, toY);
        break;
      default:

    }
    
    context.stroke();
    context.closePath();
  }
}

const eraseFree = (context, points, radius) => {
  if (points.length>2) {
    const o = points[points.length - 2];
    const p = points[points.length - 1];
    var t = o;
    var diff = Math.max(Math.abs(p.x - t.x), Math.abs(p.y - t.y));
    while (diff >= 1) {
      context.clearRect(t.x - radius / 2, t.y - radius / 2, radius, radius);
      if (t.x < p.x) t.x++;
      if (t.x > p.x) t.x--;
      if (t.y > p.y) t.y--;
      if (t.y < p.y) t.y++;
      diff = Math.max(Math.abs(p.x - t.x), Math.abs(p.y - t.y));
    }
    
  }
  context.closePath();
}

export default function Whiteboard() {

  const [tool, setTool] = useState({ name: "brush", color: "black" });
  const [canvasCursor, setCanvasCursor] = useState("pointer");
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const canvasref = useRef(null);
  const canvasref2 = useRef(null);
  const downloadref = useRef(null);
  const [img_array, setImgArray] = useState([]);

  const point_wrt_canvas = (pos) => {
    const canvas = canvasref.current;
    const rect = canvas.getBoundingClientRect(); // abs. size of element
    const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
    const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y
    const OL = rect.left;
    const OT = rect.top;
    return {
      x: Math.floor((pos.x - OL) * scaleX),
      y: Math.floor((pos.y - OT) * scaleY)
    }
  }

  const brush = (action, point) => {
    const canvas = canvasref.current;
    const context = canvas.getContext('2d');
    setCanvasCursor("crosshair");
    switch (action) {
     
      case "mouse_down":
        setPoints([point]);
        break;
      
      case "mouse_move":
        setPoints(points.concat([point]));
        drawFree(context, points, tool.radius, tool.color);
        break;
      
      case "mouse_up":
        setImgArray(img_array.concat([{ ...tool, points: points }]));
        setPoints([]);
        break;
      default:
    }
  }

  const eraser = (action, point) => {
    const canvas = canvasref.current;
    const context = canvas.getContext('2d');
    setCanvasCursor("crosshair");
    switch (action) {

      case "mouse_down":
        setPoints([point]);
        break;

      case "mouse_move":
        setPoints(points.concat([point]));
        eraseFree(context, points, tool.radius);
        break;

      case "mouse_up":
        setImgArray(img_array.concat([{ ...tool, points: points }]));
        setPoints([]);
        break;
      default:
    }
  };

  const shapes = (action, point) => {
    const canvas = canvasref.current;
    const context = canvas.getContext('2d');
    const canvas2 = canvasref2.current;
    const context2 = canvas2.getContext("2d");
    setCanvasCursor("crosshair");
    switch (action) {

      case "mouse_down":
        setPoints([point]);
        break;

      case "mouse_move":
        context2.clearRect(0, 0, canvas2.width, canvas2.height);
        const new_points = points.concat([point]);
        drawShape(context2, new_points, tool.radius, tool.color, tool.type);
        break;

      case "mouse_up":
        setPoints(points.concat([point]));
        drawShape(context, points.concat([point]), tool.radius, tool.color, tool.type);
        setImgArray(img_array.concat([{ ...tool, points: points.concat([point]) }]));
        setPoints([]);
        break;
      default:
    }
  };

  var fn_dict = {};
  fn_dict["brush"] = brush;
  fn_dict["eraser"] = eraser;
  fn_dict["shapes"] = shapes;

 
  

  useEffect(()=>{console.log(img_array)},[img_array]);

  return (
    <div id="container">
      <div id="toolbox">
        <Toolbox onToolChangeHandler={(t) => setTool(t)} />
      </div>
      <div id="boardcanvas">
        
        <div id="canvas">
          <canvas
            className="white-board"
            ref={canvasref}
            width="4096"
            height="2048"
            style={{ cursor: canvasCursor }}
          />
        </div>

        <div id="canvas2">
          <canvas
            className="white-board"
            ref={canvasref2}
            onMouseDown={evt => {
              setIsDrawing(true);
              const action = "mouse_down";
              const point = point_wrt_canvas({ x: evt.clientX, y: evt.clientY });
              fn_dict[tool.name](action, point);
            }}
            onMouseUp={evt => {
              setIsDrawing(false);
              const action = "mouse_up";
              const point = point_wrt_canvas({ x: evt.clientX, y: evt.clientY });
              fn_dict[tool.name](action, point);
            }}
            onMouseMove={evt => {
              if (isDrawing) {
                const action = "mouse_move";
                const point = point_wrt_canvas({ x: evt.clientX, y: evt.clientY });
                fn_dict[tool.name](action, point);
              }
            }}
            width="4096"
            height="2048"
            style={{ cursor: canvasCursor }}
          />
        </div>
        <div><a href="#empty" ref={downloadref} onClick={()=>downloadCanvas(downloadref,canvasref)}>Download</a></div>
      </div>
    </div>
  );
}