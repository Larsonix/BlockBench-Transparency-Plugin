(function() {

let fixEnabled = false;
let originalRenderOrders = new Map();

// Check if an element uses a transparent texture
function hasTransparentTexture(cube) {
    if (!cube.faces) return false;

    for (let face in cube.faces) {
        let faceData = cube.faces[face];
        if (faceData.texture !== null && faceData.texture !== undefined) {
            let tex = Texture.all.find(t => t.uuid === faceData.texture || t.id == faceData.texture);
            if (tex && tex.ctx) {
                try {
                    let canvas = tex.ctx.canvas || tex.canvas;
                    if (canvas) {
                        let ctx = canvas.getContext('2d');
                        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        for (let i = 3; i < imgData.data.length; i += 4) {
                            if (imgData.data[i] < 250 && imgData.data[i] > 0) {
                                return true;
                            }
                        }
                    }
                } catch (e) {}
            }
        }
    }
    return false;
}

function isGlassByName(name) {
    let n = name.toLowerCase();
    return n.includes('glass') || n.includes('window') || n.includes('transparent') ||
           n.includes('crystal') || n.includes('ice') || n.includes('water');
}

function isInnerByName(name) {
    let n = name.toLowerCase();
    return n.includes('liquid') || n.includes('glow') || n.includes('inner') ||
           n.includes('potion') || n.includes('contents') || n.includes('fill');
}

function isInsideOther(cube, allCubes) {
    let from1 = cube.from || [0,0,0];
    let to1 = cube.to || [0,0,0];

    for (let other of allCubes) {
        if (other.uuid === cube.uuid) continue;

        let from2 = other.from || [0,0,0];
        let to2 = other.to || [0,0,0];

        if (from1[0] >= from2[0] && to1[0] <= to2[0] &&
            from1[1] >= from2[1] && to1[1] <= to2[1] &&
            from1[2] >= from2[2] && to1[2] <= to2[2]) {
            if (hasTransparentTexture(other) || isGlassByName(other.name)) {
                return true;
            }
        }
    }
    return false;
}

function applyTransparencyFix() {
    if (typeof Cube === 'undefined' || !Cube.all) return;

    let allCubes = Cube.all;
    let transparentCubes = [];
    let innerCubes = [];

    allCubes.forEach(cube => {
        if (!cube.mesh) return;

        if (!originalRenderOrders.has(cube.uuid)) {
            originalRenderOrders.set(cube.uuid, cube.mesh.renderOrder);
        }

        let isTransparent = hasTransparentTexture(cube) || isGlassByName(cube.name);
        let isInner = isInnerByName(cube.name);

        if (isTransparent && !isInner) {
            transparentCubes.push(cube);
        } else if (isInner || isInsideOther(cube, allCubes)) {
            innerCubes.push(cube);
        }
    });

    innerCubes.forEach(cube => {
        cube.mesh.renderOrder = -100;
    });

    transparentCubes.forEach(cube => {
        cube.mesh.renderOrder = 100;
    });

    if (typeof Canvas !== 'undefined' && Canvas.updateAll) {
        Canvas.updateAll();
    }
    if (typeof Preview !== 'undefined' && Preview.all) {
        Preview.all.forEach(p => p.render && p.render());
    }
}

function removeTransparencyFix() {
    if (typeof Cube !== 'undefined' && Cube.all) {
        Cube.all.forEach(cube => {
            if (!cube.mesh) return;
            cube.mesh.renderOrder = originalRenderOrders.get(cube.uuid) || 0;
        });
    }

    originalRenderOrders.clear();

    if (typeof Canvas !== 'undefined' && Canvas.updateAll) {
        Canvas.updateAll();
    }
    if (typeof Preview !== 'undefined' && Preview.all) {
        Preview.all.forEach(p => p.render && p.render());
    }
}

Plugin.register('transparency_fix', {
    title: 'Transparency Fix',
    author: 'Larsonix',
    description: 'Shows objects inside transparent containers by adjusting render order. Auto-detects transparent textures and elements inside them.',
    icon: 'visibility',
    version: '2.0.0',
    variant: 'both',

    onload() {
        new Action('toggle_transparency_fix', {
            name: 'Toggle Transparency Fix',
            description: 'See objects inside transparent cubes (glass, windows, etc.)',
            icon: 'visibility',
            click: function() {
                fixEnabled = !fixEnabled;
                if (fixEnabled) {
                    applyTransparencyFix();
                    Blockbench.showQuickMessage('Transparency Fix: ON', 1500);
                } else {
                    removeTransparencyFix();
                    Blockbench.showQuickMessage('Transparency Fix: OFF', 1500);
                }
            }
        });

        MenuBar.addAction('toggle_transparency_fix', 'view');

        Blockbench.on('select_project', () => {
            if (fixEnabled) {
                originalRenderOrders.clear();
                setTimeout(applyTransparencyFix, 200);
            }
        });

        Blockbench.on('load_project', () => {
            if (fixEnabled) {
                originalRenderOrders.clear();
                setTimeout(applyTransparencyFix, 200);
            }
        });

        Blockbench.on('update_texture', () => {
            if (fixEnabled) setTimeout(applyTransparencyFix, 100);
        });
    },

    onunload() {
        if (fixEnabled) removeTransparencyFix();
        MenuBar.removeAction('view.toggle_transparency_fix');
    }
});

})();
