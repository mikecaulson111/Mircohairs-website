import React, { useRef, useEffect, useState } from 'react';

const NewConstellationCanvas = () => {
  const canvasRef = useRef(null);
  
  // Store placed dots/nodes
  const dotsRef = useRef([]);
  const [dotCount, setDotCount] = useState(0);

  // This tells if it should be a game
  const [isGame, setIsGame] = useState(true);

  const [countCorrect, setCountCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [showNext, setShowNext] = useState(true);
  const [texter, setTexter] = useState("Try to make a 90° angle");
  const anglerRef = useRef(90);
  const updateRef = useRef(true);

  const [isAssistOn, setIsAssistOn] = useState(false);
  const assistRef = useRef(false);
  const [isProjectionsOn, setIsProjectionsOn] = useState(false);
  const projectionsRef = useRef(false);

  // Secret physics and cursor tracking
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isMoving: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const createArc = (pointA, pointB, pointC) => {
        var angleBA = Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
        var angleBC = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x);

        var angleDiff = angleBC - angleBA;

        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        while (angleDiff > Math.PI)  angleDiff -= 2 * Math.PI;

        var degrees = Math.abs(angleDiff) * (180 / Math.PI);

        var arcRadius = 25;

        ctx.beginPath();
        const counnterClockwise = angleDiff < 0;
        ctx.arc(pointB.x, pointB.y, arcRadius, angleBA, angleBC, counnterClockwise);
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        var midAngle = (angleBA) + (angleDiff / 2);

        var labelOffset = 35;
        var labelX = pointB.x + Math.cos(midAngle) * labelOffset;
        var labelY = pointB.y + Math.sin(midAngle) * labelOffset;
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px sans-serif";
        ctx.fillText(Math.round(degrees) + '°', labelX, labelY);

        if (degrees > 180) {
            degrees = 360 - degrees;
        }
        if (dotsRef.current.length === 3) {
            if (updateRef.current && Math.abs(degrees - anglerRef.current) <= 6) {
                setTotal(total => total + 1);
                setCountCorrect(countCorrect => countCorrect + 1);
                setShowNext(true);
                setTexter("CORRECT!! " + anglerRef.current + "°");
                updateRef.current = false;
            } else if (updateRef.current) {
                setTotal(total => total + 1);
                setTexter("Incorrect :( " + anglerRef.current + "°");;
                updateRef.current = false;
                setShowNext(true);
            }
        }
    }

    // 1. Handle Responsive Canvas Sizing
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight || 450;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 2. Track Mouse Movement
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = event.clientX - rect.left;
      mouseRef.current.targetY = event.clientY - rect.top;
      mouseRef.current.isMoving = true;
    };

    // 3. Add Dot on Click
    const handleCanvasClick = (event) => {
      if(dotsRef.current.length >= 3 || !updateRef.current) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      dotsRef.current.push({ x, y });
      setDotCount(dotsRef.current.length);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleCanvasClick);

    // 4. Render & Animation Loop
    const renderLoop = () => {
      // Clear background completely each frame to avoid ghosting trails on static dots
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const dots = dotsRef.current;
      const mouse = mouseRef.current;

      if (typeof mouse.x !== 'number') mouse.x = mouse.targetX || 0;
      if (typeof mouse.y !== 'number') mouse.y = mouse.targetY || 0;

      // Mouse position easing math (smooth catch-up)
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      // --- DRAW CONNECTING LINES ---
      if (dots.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(dots[0].x, dots[0].y);
        for (let i = 1; i < dots.length; i++) {
          ctx.lineTo(dots[i].x, dots[i].y);
        }
        ctx.strokeStyle = '#00d2ff'; // Bright cyan lines
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00d2ff';
        ctx.stroke();
      }
      
      if (dots.length === 3) {
        for(let i = 1; i < dots.length - 1; i++) {
            const pointA = dots[i-1];
            const pointB = dots[i];
            const pointC = dots[i+1];

            createArc(pointA, pointB, pointC);

        }
      }

      // --- DRAW PLACED DOTS ---
      dots.forEach((dot, index) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#00d2ff';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00d2ff';
        ctx.fill();

        // Optional dot index number
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.fillText(`${index + 1}`, dot.x + 10, dot.y - 10);
      });

      // --- DRAW MOUSE CURSOR & CROSSHAIR ---
      if (mouse.isMoving) {
        // Glowing purple cursor center
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#a855f7';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#a855f7';
        ctx.fill();

        // Crosshairs pointing to cursor position
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(mouse.x, 0);
        ctx.lineTo(mouse.x, canvas.height);
        ctx.moveTo(0, mouse.y);
        ctx.lineTo(canvas.width, mouse.y);
        ctx.stroke();

        // Line connecting mouse to last placed dot (preview line)
        if (dots.length > 0) {
          const lastDot = dots[dots.length - 1];
          ctx.beginPath();
          ctx.moveTo(lastDot.x, lastDot.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(0, 210, 255, 0.4)';
          ctx.setLineDash([4, 4]); // Dashed line preview
          ctx.stroke();
          ctx.setLineDash([]); // Reset line style
        }
        if (dots.length === 2) {
            if (assistRef.current) {
                const mouseDot = {x: mouse.x, y: mouse.y};
                createArc(dots[0], dots[1], mouseDot);
            }
            if (projectionsRef.current && dots.length >= 2) {
                const pointO = dots[1];
                const pointA = dots[0];
                const pointB = { x: mouse.x, y: mouse.y };

                // Vector OA
                const distOA = { dx: pointA.x - pointO.x, dy: pointA.y - pointO.y };
                const lenOA = Math.sqrt(distOA.dx * distOA.dx + distOA.dy * distOA.dy);

                // Guard against division by zero if dots overlap or coordinates are invalid
                if (lenOA > 0 && !isNaN(lenOA)) {
                  // Vector OB
                  const distOB = { dx: pointB.x - pointO.x, dy: pointB.y - pointO.y };

                  // Scalar projection via Dot Product: (OB · OA) / |OA|
                  const dotProduct = distOB.dx * distOA.dx + distOB.dy * distOA.dy;
                  const projLength = dotProduct / lenOA;

                  if (projLength >= 0 && !isNaN(projLength)) {
                    // Unit vector along OA
                    const dirOA = { x: distOA.dx / lenOA, y: distOA.dy / lenOA };

                    // Project point along ray OA starting from pointO
                    const startPoint = {
                      x: pointO.x + dirOA.x * projLength,
                      y: pointO.y + dirOA.y * projLength
                    };

                    const pointToPlace = {
                        x: startPoint.x - (-dirOA.y * 10),
                        y: startPoint.y - (dirOA.x * 10)
                    };

                    ctx.beginPath();
                    ctx.moveTo(pointO.x - (-dirOA.y * 10), pointO.y - (dirOA.x * 10));
                    ctx.lineTo(pointToPlace.x, pointToPlace.y);
                    ctx.strokeStyle = '#f59e0b';
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([4,4]);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(pointToPlace.x + (-dirOA.y * 25), pointToPlace.y + (dirOA.x * 25));
                    ctx.lineTo(pointB.x, pointB.y);
                    ctx.strokeStyle = '#f59e0b';
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // length from projection end to pointB (sin)
                    var angleOA = Math.atan2(pointA.y - pointO.y, pointA.x - pointO.x);
                    var angleOB = Math.atan2(pointB.y - pointO.y, pointB.x - pointO.x);

                    var angleDiff = angleOB - angleOA;
                    const lenProjB = Math.sin(angleDiff) * Math.sqrt(((pointB.x-pointO.x)*(pointB.x-pointO.x)) + ((pointB.y-pointO.y)*(pointB.y-pointO.y)));
                    const pointHalfwayOpp = {
                        x: ((pointB.x - startPoint.x) / 2),
                        y: ((pointB.y - startPoint.y) / 2)
                    };
                    const pointHalfwayAdj = {
                        x: ((startPoint.x - pointO.x) / 2),
                        y: ((startPoint.y - pointO.y) / 2)
                    };

                    ctx.fillStyle = '#ffffff';
                    ctx.font = '12px sans-serif';
                    // ctx.fillText(Math.round(projLength), pointToPlace.x, pointToPlace.y);
                    ctx.fillText(Math.round(projLength), startPoint.x - pointHalfwayAdj.x - (-dirOA.y * 25), startPoint.y - pointHalfwayAdj.y - (dirOA.x * 25));

                    // ctx.fillText(Math.round(lenProjB), pointHalfwayOpp.x + (dirOA.x * 25), pointHalfwayOpp.y + (dirOA.y * 25));
                    ctx.fillText(Math.round(lenProjB), startPoint.x + pointHalfwayOpp.x, startPoint.y + pointHalfwayOpp.y);
                  }
                }
            }
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // 5. Cleanup Event Listeners
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleClear = () => {
    dotsRef.current = [];
    setDotCount(0);
  };

  const handleNext = () => {
    dotsRef.current = [];
    setDotCount(0);
    updateRef.current = true;
    var newAng = Math.floor(Math.random() * 180 + 1);
    setTexter("Try to make a " + newAng + "° angle");
    anglerRef.current = newAng;
    setShowNext(false);
  }

  const handleAssistChange = () => {
    assistRef.current = !assistRef.current;
    setIsAssistOn(current => !current);
  }
  
  const handleProjectionsChange = () => {
    projectionsRef.current = !projectionsRef.current;
    setIsProjectionsOn(current => !current);
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ width: '100%', height: '450px', position: 'relative', overflow: 'hidden' }}>
          {/* UI Overlay Controls */}
          <div style={uiOverlayStyles.container}>
            {isGame ?
                <>
                    <span style={uiOverlayStyles.text}>
                        Number Correct: {countCorrect} ({countCorrect}/{total}, {total > 0 ? ((countCorrect / total) * 100).toFixed(2) : 0}% )
                    </span>
                    {showNext ? <button onClick={handleNext} style={uiOverlayStyles.clearBtn}>
                        Next
                    </button> : <></>}
                    <span style={uiOverlayStyles.text}>
                        {texter}
                    </span>
                    
                </>
                :
                <>
                    <span style={uiOverlayStyles.text}>
                      Nodes Placed: <strong style={{ color: '#00d2ff' }}>{dotCount}</strong>
                    </span>
                    <button onClick={handleClear} style={uiOverlayStyles.clearBtn}>
                      Clear Canvas
                    </button>
                    <span style={uiOverlayStyles.text}>
                        Just start clicking below
                    </span>
                </>
            }
          </div>

          <canvas 
            ref={canvasRef} 
            style={{ display: 'block', cursor: 'crosshair', borderRadius: '12px', border: '1px solid #33333d' }}
          />
        </div>
        <label>
            Use assist (only works on desktop)
            <input
                type="checkbox"
                checked={isAssistOn}
                onChange={handleAssistChange}
            />
        </label>
        <label>
            Show Projections (distance)
            <input
                type="checkbox"
                checked={isProjectionsOn}
                onChange={handleProjectionsChange}
            />
        </label>
    </div>
  );
};

// Controls Overlay Styling
const uiOverlayStyles = {
  container: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    backgroundColor: 'rgba(26, 26, 30, 0.85)',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #33333d',
    backdropFilter: 'blur(4px)',
  },
  text: {
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'sans-serif',
  },
  clearBtn: {
    backgroundColor: '#ff2a6d',
    color: '#ffffff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '12px',
  },
};

export default NewConstellationCanvas;
