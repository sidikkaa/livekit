import React, { useState, useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { SketchPicker } from 'react-color';

const FullScreenWhiteboard = () => {
  const [drawingMode, setDrawingMode] = useState(true); // true for drawing, false for eraser
  const [tool, setTool] = useState('draw'); // Current tool
  const [undoStack, setUndoStack] = useState([]); // Stack for undo operations
  const [redoStack, setRedoStack] = useState([]); // Stack for redo operations
  const [penColor, setPenColor] = useState('#000000'); // Default pen color
  const [showColorPicker, setShowColorPicker] = useState(false); // Toggle for color picker
  const [textInputVisible, setTextInputVisible] = useState(false); // Text input visibility
  const [textInputValue, setTextInputValue] = useState(''); // Text input value
  const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0 }); // Text input position
  const canvasRef = useRef(null);

  const toggleDrawingMode = () => {
    setDrawingMode((prevMode) => !prevMode);
  };

  const brushColor = drawingMode ? penColor : '#FFFFFF'; // Pen color or white for eraser

  const clearCanvas = () => {
    canvasRef.current.clear();
    setUndoStack([]);
    setRedoStack([]);
  };

  const undoLast = () => {
    if (canvasRef.current) {
      const savedData = canvasRef.current.getSaveData();
      setUndoStack((prevStack) => [...prevStack, savedData]);
      setRedoStack((prevStack) => {
        const lastAction = prevStack[prevStack.length - 1];
        if (lastAction) {
          canvasRef.current.loadSaveData(lastAction, false);
          return prevStack.slice(0, -1);
        }
        return prevStack;
      });
      canvasRef.current.undo();
    }
  };

  const redoLast = () => {
    if (redoStack.length > 0) {
      const lastRedo = redoStack.pop();
      canvasRef.current.loadSaveData(lastRedo, false);
      setRedoStack([...redoStack]);
    }
  };

  const handleChange = () => {
    if (canvasRef.current) {
      const currentData = canvasRef.current.getSaveData();
      setUndoStack((prevStack) => [...prevStack, currentData]);
      setRedoStack([]);
    }
  };

  const handleCanvasClick = (e) => {
    if (tool === 'text') {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setTextInputPosition({ x, y });
      setTextInputVisible(true);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInputValue.trim() && canvasRef.current) {
      const context = canvasRef.current.ctx.drawing;
      context.fillStyle = penColor;
      context.font = '20px Arial';
      context.fillText(textInputValue, textInputPosition.x, textInputPosition.y);
      canvasRef.current.ctx.drawing.fillText(textInputValue, textInputPosition.x, textInputPosition.y); // Add text to the drawing context
      canvasRef.current.ctx.drawing.save(); // Save the canvas state
      setTextInputValue('');
      setTextInputVisible(false);
      handleChange(); // Capture the change in the undo stack
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#ffffff' }}>
      <CanvasDraw
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        brushColor={brushColor}
        brushRadius={drawingMode ? 2 : 10} // Pen size or eraser size
        lazyRadius={0}
        hideGrid
        hideInterface
        immediateLoading={true}
        onChange={handleChange}
        onClick={handleCanvasClick}
      />
      {textInputVisible && (
        <form
          onSubmit={handleTextSubmit}
          style={{
            position: 'absolute',
            top: textInputPosition.y,
            left: textInputPosition.x,
            backgroundColor: 'white',
            padding: '5px',
            zIndex: 10,
          }}
        >
          <input
            type="text"
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
            style={{ fontSize: '16px' }}
          />
          <button type="submit">Add</button>
        </form>
      )}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <button
          onClick={toggleDrawingMode}
          style={{
            padding: '10px',
            backgroundColor: 'black',
            color: 'white',
            border: '1px solid #000000',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {drawingMode ? 'Pen (Switch to Eraser)' : 'Eraser (Switch to Pen)'}
        </button>
        <button
          onClick={undoLast}
          style={{
            padding: '10px',
            backgroundColor: 'black',
            color: 'white',
            border: '1px solid #000000',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Undo
        </button>
        <button
          onClick={redoLast}
          style={{
            padding: '10px',
            backgroundColor: 'black',
            color: 'white',
            border: '1px solid #000000',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Redo
        </button>
        <button
          onClick={clearCanvas}
          style={{
            padding: '10px',
            backgroundColor: 'black',
            color: 'white',
            border: '1px solid #000000',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
        <button
          onClick={() => setTool('text')}
          style={{
            padding: '10px',
            backgroundColor: tool === 'text' ? 'gray' : 'black',
            color: 'white',
            border: '1px solid #000000',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20V4m8 8H4"></path>
          </svg>
          Text
        </button>
        <button
          onClick={() => setTool('draw')}
          style={{
            padding: '10px',
            backgroundColor: tool === 'draw' ? 'gray' : 'black',
            color: 'white',
            border: '1px solid #000000',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7l7-7-7-7"></path>
          </svg>
          Draw
        </button>
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          style={{
            padding: '10px',
            backgroundColor: tool === 'format' ? 'gray' : 'black',
            color: 'white',
            border: '1px solid #000000',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
          </svg>
          Format
        </button>
        {showColorPicker && (
          <div style={{ position: 'absolute', top: '60px', right: '20px', zIndex: '10' }}>
            <SketchPicker
              color={penColor}
              onChangeComplete={(color) => {
                setPenColor(color.hex);
                setShowColorPicker(false);
                setTool('draw'); // Set tool to draw after selecting color
                setDrawingMode(true); // Ensure the mode is set to drawing
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FullScreenWhiteboard;
