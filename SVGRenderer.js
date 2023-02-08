/* A skeleton of this file was written by Duncan Levear in Spring 2023 for CS3333 at Boston College */

export class SVGRenderer {
    constructor(sceneInfo, image) {
        this.scene = sceneInfo;
        this.image = image;
        // clear image all white
        for (let i = 0; i < image.data.length; i++) {
            image.data[i] = 255;
        }
    }

    putPixel(row, col, r, g, b) { 
        //input needs to be in canvas coordinates not world
     
        /*
        Update one pixel in the image array. (r,g,b) are 0-255 color values.
        */
        if (Math.round(row) != row) {
            console.error("Cannot put pixel in fractional row");
            return;
        }
        if (Math.round(col) != col) {
            console.error("Cannot put pixel in fractional col");
            return;
        }
        if (row < 0 || row >= this.image.height) {
            return;
        }
        if (col < 0 || col >= this.image.width) {
            return;
        }

        const index = 4 * (this.image.width * row + col);
        this.image.data[index + 0] = Math.round(r);
        this.image.data[index + 1] = Math.round(g);
        this.image.data[index + 2] = Math.round(b);
        this.image.data[index + 3] = 255;
        // Do not modify the putPixel() function!
    }

    closestPixelTo(x, y) {
        /*
        Return the [row, col] of the canvas pixel closest to the point (x,y) where (x,y) are in world coordinates
        
        Use the convention that the point (minX, minY) is the center of the pixel in row 0 column 0
        The point (maxX, maxY) is the center of the pixel in the last row and the last column
        */
        
        // TODO
        
        var minx, miny, worldWidth, worldHeight
        [minx, miny, worldWidth, worldHeight] = this.scene.viewBox.split(" ")
        minx = Number(minx)
        miny = Number(miny)
        worldWidth = Number(worldWidth)
        worldHeight = Number(worldHeight)
       
        
       
        var colWidth = ((this.scene.width-1)/worldWidth)

        var rowHeight =((this.scene.height-1)/worldHeight)
        
//        console.log("world with and height", worldWidth, worldHeight)
//        console.log("viewbox", [minx, miny, worldWidth, worldHeight])
//
//        console.log("col width and row height", colWidth, rowHeight)
//        console.log("x,y given", x,y)
 //       console.log("pts plotted", (Math.round((y)*rowHeight))-(miny*rowHeight), (Math.round((x)*colWidth))-(minx*colWidth))


        
        return [Math.round((y*rowHeight)-(miny*rowHeight)), Math.round((x*colWidth)-(minx*colWidth))]
    }
    
    polyline(e) {
        const pointsArray = parsePoints(e.points);
                const triangles = triangulate(pointsArray);
                // TODO
                
                console.log(triangles)
                
                const color_poly = parseRGB(e.fill)
                const stroke_color = parseRGB(e.stroke)
              //  const fill_opacity = e['fill-opacity']
                
                if (e['fill-opacity'] >= 0) {
                    console.log("if fill")
                    var fill_opacity = e['fill-opacity']
                    console.log(fill_opacity)
                    
                }
                else {
                    console.log("else")
                     var fill_opacity = 1
                     
                }
                
                
                if (e['stroke-opacity'] >= 0) {
                    console.log("if")
                    var stroke_opacity = e['stroke-opacity']
                    console.log(stroke_opacity)
                    
                }
                else {
                    console.log("else")
                     var stroke_opacity = 1
                }
                
                console.log("stroke", stroke_opacity)
                                 
                for (var tri =0; tri < triangles.length; tri++){ //each triangle
                
                    var x0 = triangles[tri][0][0]
                    var y0 = triangles[tri][0][1]
                    var x1 = triangles[tri][1][0]
                    var y1 = triangles[tri][1][1]
                    var x2 = triangles[tri][2][0]
                    var y2 = triangles[tri][2][1]
                
                    
                     //sort 
                    if (y1 < y0 ){
                        const old_x0 = x0
                        const old_y0 = y0
                        x0 = x1
                        x1 = old_x0
                        y0 = y1
                        y1 = old_y0
                    }
                    if (y2 < y0 ){
                        const old_x0 = x0
                        const old_y0 = y0
                        x0 = x2
                        x2 = old_x0
                        y0 = y2
                        y2 = old_y0
                    }
                    if (y2 < y1 ){
                        const old_x1 = x1
                        const old_y1 = y1
                        x1 = x2
                        x2 = old_x1
                        y1 = y2
                        y2 = old_y1
                    }
    

                    //convert to canvas
                    const new_first = this.closestPixelTo(x0,y0)
                    y0 = new_first[0]
                    x0 = new_first[1]
                    const new_second = this.closestPixelTo(x1,y1)
                    y1 = new_second[0]
                    x1 = new_second[1]

                    const new_third = this.closestPixelTo(x2,y2)
                    y2 = new_third[0]
                    x2 = new_third[1]

                    //computer x coordinates of triangle edges
                    var x01 = this.lerp(y0, x0, y1, x1)
                    var x12 = this.lerp(y1, x1, y2, x2)
                    var x02 = this.lerp(y0, x0, y2, x2)
        

                    //concatenate short sides
                    x01.pop()
                    var x012 = x01.concat(x12)

                    //determine which is left and right
                    const m = Math.floor(x02.length / 2)
                    if (x02[m] < x012[m]) {
                        var x_left = x02
                        var x_right = x012
                    } else {
                        var x_left = x012
                        var x_right = x02
                    }

                    //draw horizontal segments
                    for (var y = y0; y <= y2; y++) {
                        for(var x = x_left[y-y0]; x <= x_right[y-y0]; x++) {
                            this.blendPixel(Math.round(y),Math.round(x), color_poly[0], color_poly[1], color_poly[2], fill_opacity)
                            }
                    }  
                }
                
               
                for (var i=0; i < pointsArray.length-1; i++){
                   
                   var x0 = pointsArray[i][0]
                   var y0 = pointsArray[i][1]
                   var x1 = pointsArray[i+1][0]
                   var y1 = pointsArray[i+1][1]
        
                   this.DrawLine(x0,y0,x1,y1, stroke_color, stroke_opacity)
                }

                var x0 = pointsArray[0][0]
                var y0 = pointsArray[0][1]
                var x1 = pointsArray[pointsArray.length-1][0]
                var y1 = pointsArray[pointsArray.length-1][1]
                console.log("stroke color",stroke_color)
                this.DrawLine(x0,y0,x1,y1, stroke_color, stroke_opacity)
                    
    }
    blendPixel(row, col, r, g, b, alpha) {
        
         
        //input needs to be in canvas coordinates not world
     
        /*
        Update one pixel in the image array. (r,g,b) are 0-255 color values.
        */
        if (Math.round(row) != row) {
            console.error("Cannot put pixel in fractional row");
            return;
        }
        if (Math.round(col) != col) {
            console.error("Cannot put pixel in fractional col");
            return;
        }
        if (row < 0 || row >= this.image.height) {
            return;
        }
        if (col < 0 || col >= this.image.width) {
            return;
        }

        //find background colors
        const index = 4 * (this.image.width * row + col);
        var bg_r = this.image.data[index + 0]
        var bg_g = this.image.data[index + 1]
        var bg_b = this.image.data[index + 2]
        this.image.data[index + 3] = 255;
        
        //compute fg value
        var blend_r = alpha*r + (1-alpha)*bg_r
        var blend_g = alpha*g + (1-alpha)*bg_g
        var blend_b = alpha*b + (1-alpha)*bg_b
        

        //set pixel value to fg value 
        this.image.data[index + 0] = Math.round(blend_r);
        this.image.data[index + 1] = Math.round(blend_g);
        this.image.data[index + 2] = Math.round(blend_b);
        this.image.data[index + 3] = 255; //might just be 255
        
        
    }


    render() {
        /*
        Put all the pixels to light up the elements in scene.elements. 
        It will be necessary to parse the attributes of scene.elements, e.g. converting from strings to numbers.
        */
        for (const e of this.scene.elements) {
            if (e.type === 'point') {
                const x = Number(e.x);
                const y = Number(e.y);
                const color = parseRGB(e.color);
                const alpha = Number(e.opacity) || 1;
                const [row, col] = this.closestPixelTo(x, y);
                this.blendPixel(row, col, color[0], color[1], color[2], alpha);
            } else if (e.type === 'line') {
                // TODO
                const x0 = Number(e.x1)
                const y0 = Number(e.y1)
                
                const x1 = Number(e.x2)
                const y1 = Number(e.y2)
                
                const color = parseRGB(e.stroke)
                
                this.DrawLine(x0,y0,x1,y1, color)
                

            } else if (e.type === 'polyline') {
                console.log("e.type",e)
                // TODO
                const color = parseRGB(e.stroke)
                console.log(color)
        
                const points = parsePoints(e.points)
                                
                for (var i=0; i < points.length-1; i++){
                   
                   var x0 = points[i][0]
                   var y0 = points[i][1]
                   var x1 = points[i+1][0]
                   var y1 = points[i+1][1]
        
                   this.DrawLine(x0,y0,x1,y1, color)
                }

            } else if (e.type === 'polygon') {
                this.polyline(e)
                  
            }
        }
        
    }
    
    
   lerp (i0, d0, i1, d1) {
       let a = (d1 - d0) / (i1 - i0)
        const values = []
        var d = d0
        for (var i = i0; i <= i1; i++) {
            values.push(d)
            d = d + a
            
        }
        return values
   }
    
    
    
    
    DrawLine(x0,y0,x1,y1, color, alpha) { 
        console.log("stroke-opacity in drawline", alpha)
        if (typeof(alpha) == "undefined") {
            console.log("undefined")
            alpha = 1
            console.log("new alpha", alpha)
        }

        const new_first = this.closestPixelTo(x0,y0)
        y0 = new_first[0]
        x0 = new_first[1]
        const new_second = this.closestPixelTo(x1,y1)
        y1 = new_second[0]
        x1 = new_second[1]
        
        var [r,g,b] = (color)
  
        if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) {
            // Line is horizontal-ish
            // Make sure x0 < x1
            if (x0 > x1) {
                const old_x0 = x0
                const old_y0 = y0
                x0 = x1
                x1 = old_x0
                y0 = y1
                y1 = old_y0
              
            }

            var ys = this.lerp(x0, y0, x1, y1)
            for (var i = 0; i < ys.length; i++) {
           
                this.blendPixel(Math.round((ys[i])), Math.round(x0+i), r, g, b, alpha)
            }
            
//            for (var x = x0; x <= x1; x++) {
//                
//                this.putPixel(x, Math.round(ys[x-x0]), r,g,b)
//            }
           
            
        } else {
            // Line is vertical-ish
            // Make sure y0 < y1
            if (y0 > y1) {
                const old_x0 = x0
                const old_y0 = y0
                x0 = x1
                x1 = old_x0
                y0 = y1
                y1 = old_y0
            }

            var xs = this.lerp(y0, x0, y1, x1)

            for (var i = 0; i < xs.length; i++) {
                this.blendPixel(Math.round(y0+i), Math.round(xs[i]), r,g,b, alpha )
            }
            
//            for (var y = y0; y <= y1; y++) {
//                
//                this.putPixel(Math.round(xs[y-y0]), y, r,g,b)
//            }
        }
    }
    
}

function parseRGB(colorString) {
    /*
    Return arguments as array [r,g,b] from string like "rgb(255, 0, 127)".
    */
    if (colorString === undefined) {
        // Default value for all colors
        return [0, 0, 0];
    }
    if (colorString[0] === "#") {
        const r = parseInt(colorString[1] + colorString[2], 16);
        const g = parseInt(colorString[3] + colorString[4], 16);
        const b = parseInt(colorString[5] + colorString[6], 16);
        return [r,g,b];
    }
    const parsed = colorString.match(/rgb\(( *\d* *),( *\d* *),( *\d* *)\)/);
    if (parsed.length !== 4) {
        console.error(`Could not parse color string ${colorString}`);
        return [0, 0, 0];
    }
    
    return [Number(parsed[1]), Number(parsed[2]), Number(parsed[3])];
}

function triangulate(points) {
    /*
    Return an array of triangles whose union equals the polygon described by points.
    Assume that points is an array of pairs of numbers. No coordinate transforms are applied.
    Assume that the polygon is non self-intersecting.
    */
    if (points.length <= 3) {
        return [points];
    } else if (points.length === 4) {
        // rearrange into CCW order with points[0] having greatest internal angle
        function f(u,v) {
            // angle between points u and v as if v were the origin
            const ret = Math.atan2(u[1]-v[1],u[0]-v[0]);
            return ret;
        }
        function angleAt(k) {
            const v = points[k];
            const u = points[(k-1+4) % 4];
            const w = points[(k+1) % 4];
            let a = f(w,v) - f(u,v);
            if ( a < 0) {
                return a + 2*Math.PI;
            }
            return a;
        };
        const angles = [angleAt(0), angleAt(1), angleAt(2), angleAt(3)];
        // Check for CCW order
        if (angles[0] + angles[1] + angles[2] + angles[3] > 4*Math.PI) {
            return triangulate([points[3], points[2],points[1],points[0]]);
        }
        // Check for points[0] greatest internal angle
        if (angles[0] !== Math.max(...angles)) {
            return triangulate([points[1], points[2], points[3], points[0]]);
        }
        // If so, the following triangulation is correct
        return [[points[0],points[1],points[2]],[points[0],points[2],points[3]]];
        
   
    } else {
        console.error("Only 3-polygons and 4-polygons supported");
    }
}

function parsePoints(points) {
    /*
    Helper method: convert string like "5,7 100,-2" to array [[5,7], [100,-2]]
    */
    const ret = [];
    const pairs = points.split(" ");
    for (const pair of pairs) {
        if (pair !== "") {
            const [x, y] = pair.split(",");
            ret.push([Number(x), Number(y)]);
        }
    }
    return ret;
}