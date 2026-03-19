{/* ========================================================== */}
      {/* FIXED MAGNIFIER (Positioned at the Root for full movement) */}
      {/* ========================================================== */}
      {inspectorActive && (() => {
        const skin = MAGNIFIER_SKINS[equippedSkin];
        const isFinding = hoveredIoC || foundIoCs.includes(hoveredIoC?.id || "");
        
        return (
          <motion.div
            className="magnifier"
            animate={{ 
              x: mousePos.x - 120, 
              y: mousePos.y - 120,
              borderColor: skin.isAnimated && !isFinding ? ["#0df0d4", "#ff00ff", "#fbbf24", "#0df0d4"] : (isFinding ? "#ff7b00" : skin.color)
            }}
            transition={skin.isAnimated && !isFinding ? { duration: 2, repeat: Infinity } : { type: "tween", duration: 0 }}
            style={{
              pointerEvents: "none",
              position: "fixed",  // Anchors to the whole browser window
              top: 0,
              left: 0,
              zIndex: 9999,       // Forces it on top of the sidebar and email
              borderWidth: "6px",
              borderStyle: "solid",
              overflow: "visible", 
              boxShadow: isFinding
                ? `0 0 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(255,123,0,0.4)`
                : `0 0 60px rgba(0,0,0,0.6), inset 0 0 40px ${skin.shadow}`,
              backdropFilter: skin.filter,
            }}
          >
            {/* THE HANDLE */}
            <motion.div
              style={{
                position: "absolute",
                top: "82%", 
                left: "82%",
                width: "26px",
                height: "130px",
                borderRadius: "13px",
                transformOrigin: "top center",
                transform: "rotate(-45deg)", 
                border: `3px solid ${isFinding ? "#ff7b00" : skin.color}`,
                zIndex: -1, 
              }}
              animate={{
                backgroundColor: skin.isAnimated && !isFinding ? ["#ffffff", "#0df0d4", "#ff00ff", "#ffffff"] : (isFinding ? "#9a3412" : skin.handleColor),
                boxShadow: skin.isAnimated && !isFinding ? ["0 0 30px #ffffff", "0 0 30px #0df0d4", "0 0 30px #ff00ff", "0 0 30px #ffffff"] : (isFinding ? "0 0 20px #ff7b00" : skin.handleGlow)
              }}
              transition={skin.isAnimated && !isFinding ? { duration: 2, repeat: Infinity } : { type: "tween", duration: 0 }}
            />

            {/* LENS CONTENT */}
            <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
              {hoveredIoC ? (
                <div style={{ padding: "20px", textAlign: "left" }}>
                  <div style={{ color: "#ff7b00", fontWeight: 900, marginBottom: "10px", fontSize: "14px", textAlign: "center", textTransform: "uppercase" }}>
                    <Fingerprint size={18} style={{ verticalAlign: "middle", marginRight: "5px" }} /> EVIDENCE DETECTED
                  </div>
                  <div style={{ background: "#000", padding: "10px", borderRadius: "4px", border: "1px solid #10b981", color: "#10b981", fontSize: "11px", fontFamily: "monospace", lineHeight: "1.4", fontWeight: 700 }}>
                    {hoveredIoC.text}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "11px", fontWeight: 900, color: skin.color, textTransform: "uppercase", textShadow: `0 0 10px ${skin.color}` }}>
                  <Search size={24} style={{ marginBottom: "8px" }} />
                  <br /> Scanning...
                </div>
              )}
            </div>
          </motion.div>
        );
      })()}
