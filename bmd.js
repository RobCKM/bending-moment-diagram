var svg = d3.select("#chart")
  .append("svg");

// Information about the point
var mass_radius = 10;
var border_top = 100;
var shear_from_top = border_top + mass_radius +100;
var bending_from_top = border_top + mass_radius + 200;
var bound_left = 100;
var length = 400
var bound_right = (bound_left + length);
var P_x = 150
var P_m = 100
var scaler = 100
var P_a = function(){return P_x - bound_left}
var P_b = function(){return bound_right - P_x}
var R_1 = function(){return(((P_m)*P_b())/length)}
var R_2 = function(){return(((P_m)*P_a())/length)}
var V_x = function(x){if(x<P_x){return R_1()}else{return -R_2()}}
var M_x = function(x){if(x<P_x){return ((P_m/scaler) * (x - bound_left) * P_b())/length}else{return ((P_m/scaler) * (bound_right - x) * P_a())/length}}

// var M_x = function()


var data = [{cx: P_x, cy: (border_top + mass_radius), radius: mass_radius}];


// Code to drag the point
var drag = d3.behavior.drag().origin(function(d) { return d; });

drag.on('drag', function(d,i){
  d3.select(this)
  .attr("cx", function(d){
    window.P_x =  Math.max(bound_left,Math.min(bound_right,(+d3.select(this).attr("cx") + d3.event.dx)))
    return P_x})
  .attr('cy', (border_top + mass_radius));
  // Remove the old shear line
  svg.selectAll('path')
                        .data(data_shear)
                        .remove();

  // Create the new shear line
svg.append("svg:path").attr("d", s_line(data_shear)).attr("id", "shear_area").attr("class", "shear_area");;

svg.append("svg:path").attr("d", b_line(data_bend)).attr("id", "bending_area").attr("class", "bending_area");


  // left_bound_s = [ { "x": bound_left,   "y": shear_from_top},  { "x": bound_left,  "y":  shear_from_top + R_1()}]
  // svg.append("svg:path").attr("d", line_l_s(left_bound_s));

  // right_bound_s = [ { "x": bound_right,   "y": shear_from_top},  { "x": bound_right,  "y":  shear_from_top - R_2()}]
  // svg.append("svg:path").attr("d", line_r_s(right_bound_s));

});




// Code to Base line
// Code for left join line
// var line_l_s = d3.svg.line()
//                         .x(function(d) { return d.x; })
//                         .y(function(d) { if(bound_left<P_x){return d.y;}else{return shear_from_top} })
//                         .interpolate("linear");
// var left_bound_s = [ { "x": bound_left,   "y": shear_from_top},  { "x": bound_left,  "y":  shear_from_top + R_1()}]
// // Code for right join line
// var line_r_s = d3.svg.line()
//                         .x(function(d) { return d.x; })
//                         .y(function(d) { if(bound_right>P_x){return d.y;}else{return shear_from_top} })
//                         .interpolate("linear");
// var right_bound_s = [ { "x": bound_right,   "y": shear_from_top},  { "x": bound_right,  "y":  shear_from_top - R_2()}]
// Append the lines
// svg.append("svg:path").attr("d", line_l_s(left_bound_s));
// svg.append("svg:path").attr("d", line_r_s(right_bound_s));



// Code to create shear diagram
var data_shear = [];
for (var i = bound_left; i != bound_right; ++i) data_shear.push(i)

var s_line = d3.svg.area()
    .x(function(d,i) { return d; })
    .y0(shear_from_top)
    .y1(function(d,i) { return V_x(d) + shear_from_top; })

svg.append("svg:path").attr("d", s_line(data_shear)).attr("id", "shear_area").attr("class", "shear_area");;


// Code to create bending diagram
var data_bend = [];
for (var i = bound_left; i != bound_right; ++i) data_bend.push(i)

var b_line = d3.svg.area()
    .x(function(d,i) { return d; })
    .y0(bending_from_top)
    .y1(function(d,i) { return M_x(d) + bending_from_top; })

svg.append("svg:path").attr("d", b_line(data_bend)).attr("id", "bending_area").attr("class", "bending_area");



//  Code to create the point
var blobs = svg.selectAll('.blob').data(data)
  .enter()
  .append('circle')
  .attr('class', 'blob')
  .attr('r', function(d){return d.radius;})
  .attr('cx', function(d){return d.cx;})
.attr('cy', function(d){return d.cy;}).on('contextmenu', function(){d3.event.preventDefault()}).call(drag);



