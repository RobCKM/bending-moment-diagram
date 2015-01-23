var svg = d3.select("#chart")
  .append("svg");

// Information about the point
var mass_radius = 10;
var border_top = 50;
var shear_from_top = border_top + mass_radius +100;
var bending_from_top = border_top + mass_radius + 200;
var diff_from_top = border_top + mass_radius + 350;
var bound_left = 100;
var length = 400
var bound_right = (bound_left + length);
var P_x = 150
var P_m = 100
var bend_scaler = 100
var diff_scaler = 100

var P_a = function(){return P_x - bound_left}
var P_b = function(){return bound_right - P_x}
var R_1 = function(){return(((P_m)*P_b())/length)}
var R_2 = function(){return(((P_m)*P_a())/length)}
var V_x = function(x){if(x<P_x){return R_1()}else{return -R_2()}}
var M_x = function(x){if(x<P_x){return ((P_m/bend_scaler) * (x - bound_left) * P_b())/length}else{return ((P_m/bend_scaler) * (bound_right - x) * P_a())/length}}
var D_x = function(x){if(x<=P_x){return (((P_m) * (x - bound_left) * P_b()) / (6 * E * I() * length))*(Math.pow(length,2)-Math.pow(P_b(),2)-Math.pow((x - bound_left),2))} else
                                {return (((P_m) * (bound_right - x) * P_a()) / (6 * E * I() * length))*(Math.pow(length,2)-Math.pow(P_a(),2)-Math.pow((bound_right - x),2))}}


var beam_loc_x = 600
var beam_loc_y = 300
var beam_scale = 10
var beam_d = 100
var beam_w = 100
var I = function(){return (beam_w/beam_scale * Math.pow(beam_d/beam_scale , 3) / 12)}
var E = 10000
var beam_bound_x = 400
var beam_bound_y = 300
var beam_bound_max_y = 500




var data = [{cx: P_x, cy: (border_top + mass_radius), radius: mass_radius}];


// Code to drag the point
var drag = d3.behavior.drag().origin(function(d) { return d; });

drag.on('drag', function(d,i){
  d3.select(this)
  .attr("cx", function(d){
    window.P_x =  Math.max(bound_left,Math.min(bound_right,(+d3.select(this).attr("cx") + d3.event.dx)))
    return P_x})
  .attr('cy', (border_top + mass_radius));


s_app.attr("d", s_line(data_shear)).attr("id", "shear_area")
b_app.attr("d", b_line(data_bend))
d_app.attr("d", d_line(data_diff))
sampleText.text(P_b())

});





// Code to create shear diagram
var data_shear = [];
for (var i = bound_left; i != bound_right; ++i) data_shear.push(i)

var s_line = d3.svg.area()
    .x(function(d,i) { return d; })
    .y0(shear_from_top)
    .y1(function(d,i) { return V_x(d) + shear_from_top; })

var s_app = svg.append("svg:path").attr("d", s_line(data_shear)).attr("id", "shear_area").attr("class", "shear_area");;


// Code to create bending diagram
var data_bend = [];
for (var i = bound_left; i != bound_right; ++i) data_bend.push(i)

var b_line = d3.svg.area()
    .x(function(d,i) { return d; })
    .y0(bending_from_top)
    .y1(function(d,i) { return M_x(d) + bending_from_top; })

var b_app = svg.append("svg:path").attr("d", b_line(data_bend)).attr("id", "bending_area").attr("class", "bending_area");



// Code to create diff shape
var data_diff = [];
for (var i = bound_left; i != bound_right; ++i) data_diff.push(i)

var d_line = d3.svg.line()
    .x(function(d,i) { return d; })
    .y(function(d,i) { return D_x(d) + diff_from_top; })

var d_app = svg.append("svg:path").attr("d", d_line(data_diff)).attr("id", "diff_line").attr("class", "diff_line");;



//  Code to create the point
var blobs = svg.selectAll('.blob').data(data)
  .enter()
  .append('circle')
  .attr('class', 'blob')
  .attr('r', function(d){return d.radius;})
  .attr('cx', function(d){return d.cx;})
.attr('cy', function(d){return d.cy;}).on('contextmenu', function(){d3.event.preventDefault()}).call(drag);


// Code to create cross section of beam

var beam = [{x: beam_loc_x, y: beam_loc_y, height: beam_d, width: beam_w}];


var resize = d3.behavior.drag().origin(function(d) { return d; });

resize.on('drag', function(d,i){
  d3.select(this)
  .attr("width", function(d){
    window.beam_w =  Math.min(Math.max((+d3.select(this).attr("width") + d3.event.dx), 1), 300)
    return beam_w})
  .attr("height", function(d){
    window.beam_d =  Math.min(Math.max((+d3.select(this).attr("height") + d3.event.dy), 1),300)
    return beam_d})
  .attr("x", function(d){
    window.beam_loc_x =  Math.max((+d3.select(this).attr("x") + (-d3.event.dx/2)), 500)
    return beam_loc_x})
  .attr("y", function(d){
        window.beam_loc_y =  Math.max((+d3.select(this).attr("y") + (-d3.event.dy/2)), 200)
    // window.beam_loc_y =  Math.min(Math.max((+d3.select(this).attr("y") + (-d3.event.dy/2)), 100), beam_bound_y + Math.max(((((beam_bound_max_y - beam_bound_y))/2) - (beam_d/2)),0))
    return beam_loc_y})

s_app.attr("d", s_line(data_shear)).attr("id", "shear_area")
b_app.attr("d", b_line(data_bend))
d_app.attr("d", d_line(data_diff))
sampleText.text(P_b())

  });


var cross_section = svg.selectAll('.cross_section').data(beam)
  .enter()
  .append('rect')
  .attr('class', 'cross_section')
  .attr('x', function(d){return d.x;})
  .attr('y', function(d){return d.y;})
  .attr('height', function(d){return d.height;})
.attr('width', function(d){return d.width;}).on('contextmenu', function(){d3.event.preventDefault()}).call(resize);


// Include the formulas being calculated
var sampleText = svg.append("text")
    .text(P_b())
    .attr("x", 150)
    .attr("y", 150)



