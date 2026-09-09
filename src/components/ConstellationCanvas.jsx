import React, { useRef, useEffect, useState } from 'react';

const ConstellationCanvas = () => {
  const canvasRef = useRef(null);
  
  // Store placed dots/nodes
  const dotsRef = useRef([]);
  const [dotCount, setDotCount] = useState(0);

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
      
      if (dots.length > 2) {
        for(let i = 1; i < dots.length - 1; i++) {
            const pointA = dots[i-1];
            const pointB = dots[i];
            const pointC = dots[i+1];

            var angleBA = Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
            var angleBC = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x);

            var angleDiff = angleBC - angleBA;

            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            while (angleDiff > Math.PI)  angleDiff -= 2 * Math.PI;

            var degrees = Math.abs(angleDiff) * (180 / Math.PI);

            var arcRadius = 25;

            ctx.beginPath();
            const counnterClockwise = angleDiff < 0;
            var startArc = Math.min(angleBA, angleBC);
            var endArc   = Math.max(angleBA, angleBC);
            // ctx.arc(pointB.x, pointB.y, arcRadius, startArc, endArc);
            ctx.arc(pointB.x, pointB.y, arcRadius, angleBA, angleBC, counnterClockwise);
            ctx.strokeStyle = "#a855f7";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // var midAngle = (angleBA + angleBC) / 2;
            var midAngle = (angleBA) + (angleDiff / 2);

            var labelOffset = 35;
            var labelX = pointB.x + Math.cos(midAngle) * labelOffset;
            var labelY = pointB.y + Math.sin(midAngle) * labelOffset;
            ctx.fillStyle = "#ffffff";
            ctx.font = "12px sans-serif";
            ctx.fillText(Math.round(degrees) + '°', labelX, labelY);
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

  return (
    <div style={{ width: '100%', height: '450px', position: 'relative', overflow: 'hidden' }}>
      {/* UI Overlay Controls */}
      <div style={uiOverlayStyles.container}>
        <span style={uiOverlayStyles.text}>
          Nodes Placed: <strong style={{ color: '#00d2ff' }}>{dotCount}</strong>
        </span>
        <button onClick={handleClear} style={uiOverlayStyles.clearBtn}>
          Clear Canvas
        </button>
        <span style={uiOverlayStyles.text}>
            Just start clicking below
        </span>
      </div>

      <canvas 
        ref={canvasRef} 
        style={{ display: 'block', cursor: 'crosshair', borderRadius: '12px', border: '1px solid #33333d' }}
      />
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

export default ConstellationCanvas;
