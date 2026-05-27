const { app } = require("aftereffects");

function getActiveComp() {
    app.activeViewer.setActive();
    const comp = app.project.activeItem;
    if (comp && comp.typeName === "Composition") return comp;
    alert("Open an active composition first!");
    return null;
}

// 1. ANALOG HALFTONE PIPELINE
document.getElementById("btnHalftone").addEventListener("click", () => {
    const comp = getActiveComp();
    if (!comp) return;

    app.beginUndoGroup("Sprinkle Halftone");
    const adjLayer = comp.layers.addAdjustmentLayer();
    adjLayer.name = "✨ HALFTONE SPRINKLER";
    
    const ballAction = adjLayer.effect.addProperty("CC Ball Action");
    ballAction.property("Grid Spacing").setValue(4);
    ballAction.property("Ball Size").setValue(45);
    
    const levels = adjLayer.effect.addProperty("Levels");
    levels.property("Alpha Input Black").setValue(0.4);
    levels.property("Alpha Input White").setValue(0.6);
    
    const posterizeTime = adjLayer.effect.addProperty("Posterize Time");
    posterizeTime.property("Frame Rate").setValue(12); // High friction 12fps
    app.endUndoGroup();
});

// 2. LIQUID GLASS PIPELINE
document.getElementById("btnGlass").addEventListener("click", () => {
    const comp = getActiveComp();
    if (!comp) return;

    app.beginUndoGroup("Liquid Glass");
    const glassLayer = comp.layers.addAdjustmentLayer();
    glassLayer.name = "💎 LIQUID GLASS RIG";
    
    const blur = glassLayer.effect.addProperty("Fast Box Blur");
    blur.property("Blur Radius").setValue(40);
    blur.property("Repeat Edge Pixels").setValue(true);
    
    const displace = glassLayer.effect.addProperty("Turbulent Displace");
    displace.property("Amount").setValue(35);
    displace.property("Size").setValue(120);
    displace.property("Evolution").expression = "time * 150;";
    app.endUndoGroup();
});

// 3. RED HOT SAUCE AUDIO-REACTIVE ENGINE
document.getElementById("btnHotSauce").addEventListener("click", () => {
    const comp = getActiveComp();
    if (!comp) return;

    app.beginUndoGroup("Red Hot Sauce Engine");

    // Convert audio layer values natively
    app.executeCommand(app.findMenuCommandId("Convert Audio to Keyframes"));
    
    const audioLayer = comp.layer("Audio Amplitude");
    if (!audioLayer) {
        alert("Select your audio track layer first!");
        app.endUndoGroup();
        return;
    }

    const gridLayer = comp.layers.addAdjustmentLayer();
    gridLayer.name = "🔥 RED HOT SAUCE GRID";
    
    const gridEffect = gridLayer.effect.addProperty("Grid");
    gridEffect.property("Size From").setValue(4); 
    gridEffect.property("Width").setValue(60);
    gridEffect.property("Height").setValue(60);
    gridEffect.property("Border").setValue(2);
    gridEffect.property("Color").setValue([1, 0.13, 0, 1]); // Hot Neon Orange/Red

    const glowEffect = gridLayer.effect.addProperty("Glow");
    glowEffect.property("Glow Radius").setValue(30);
    glowEffect.property("Glow Intensity").expression = `
        try {
            const audio = thisComp.layer("Audio Amplitude").effect("Both Channels")("Slider");
            linear(audio, 5, 25, 0.2, 4.0);
        } catch(err) {
            1.0;
        }
    `;

    const displaceEffect = gridLayer.effect.addProperty("Turbulent Displace");
    displaceEffect.property("Amount").setValue(50);
    displaceEffect.property("Size").setValue(40);
    displaceEffect.property("Amount").expression = `
        try {
            const audio = thisComp.layer("Audio Amplitude").effect("Both Channels")("Slider");
            linear(audio, 0, 30, 10, 90);
        } catch(err) {
            30;
        }
    `;
    displaceEffect.property("Evolution").expression = "time * 250;";

    app.endUndoGroup();
});
