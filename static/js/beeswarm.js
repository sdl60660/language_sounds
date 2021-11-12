
BeeSwarm = function(_parentElement) {
    this.parentElement = _parentElement;

    this.initVis();
};


BeeSwarm.prototype.initVis = function() {
    const vis = this;

    vis.margin = {top: 0, right: 0, bottom: 0, left: 0};

    // Set height/width of viewBox
    vis.width = 1000 - vis.margin.left - vis.margin.right;
    vis.height = 1000 - vis.margin.top - vis.margin.bottom;

    vis.defaultBubbleOpacity = 0.72;

    // Initialize SVG
    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("viewBox", [0, 0, vis.width+vis.margin.left+vis.margin.right, vis.height+vis.margin.top+vis.margin.bottom]);

    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    vis.radius = d3.scaleLinear()
        .domain([0, 1])
        .range([15, 40]);


    // vis.circles = vis.g.selectAll('circle');
    vis.circleContainer = vis.g.append("g");
    vis.plotLabelContainer = vis.g.append("g");

    vis.tip = d3.tip()
        .attr('class', 'd3-tip bubbleplot-tip')
        .html(d => {
            let tiptext = '<div style="text-align:center">';
            tiptext += '</div>';
           return tiptext;
        });
    vis.svg.call(vis.tip);

    vis.wrangleData();
};


BeeSwarm.prototype.wrangleData = function() {
    const vis = this;

    const primaryLanguage = 'English';
    const secondaryLanguage = 'Spanish';

    vis.primaryLanguagePhonemes = languageData[primaryLanguage]['agreed_phonemes']
    vis.secondaryLanguagePhonemes = languageData[secondaryLanguage]['agreed_phonemes']


    vis.chartPhonemes = segmentData.slice().filter(d => {
    	if (vis.primaryLanguagePhonemes.includes(d.name) || vis.secondaryLanguagePhonemes.includes(d.name)) {
    		return true;
    	}
    	else {
    		return false;
    	}
    })

    // console.log(vis.chartPhonemes);

    vis.tick = () => {
        vis.simulation.tick();

        vis.circleContainer.selectAll('.phoneme-bubble')
            .attr('cx', d => d.x)
            .attr("cy", d => d.y);

		vis.plotLabelContainer.selectAll('text.label')
			.attr('x', d => d.x)
            .attr("y", d => d.y + (vis.radius(d.frequency) / 2));
	};

    vis.simulation =
    	d3.forceSimulation(vis.chartPhonemes)
        .stop()
        .alpha(0.1)
        .alphaDecay(0.019)
        .force('x', d3.forceX( d => {
            if (vis.primaryLanguagePhonemes.includes(d.name) && vis.secondaryLanguagePhonemes.includes(d.name)) {
                return vis.width*0.5;
            }
            else if (vis.primaryLanguagePhonemes.includes(d.name)) {
                return vis.width*0.2;
            }
            else {
                return vis.width*0.8;
            }
        }).strength(0.95))
        .force('y', d3.forceY(vis.height / 2).strength(0.2))
        .force('repel', d3.forceManyBody().strength(-20).distanceMax(3))
        .force("charge", d3.forceCollide().radius(d => vis.radius(d.frequency)).strength(0.9).iterations(10))
        .on('tick', vis.tick)

    vis.updateVis();
};


BeeSwarm.prototype.updateVis = function() {
    const vis = this;

    vis.circles = vis.circleContainer.selectAll("circle")
        .data(vis.chartPhonemes, d => d.name)
        .join(
            enter => enter.append("circle")
                .attr('class', 'phoneme-bubble')
                .attr('cx', vis.width/2)
                .attr('cy', vis.height/2)
                .attr('r', d => vis.radius(d.frequency))
              	// .attr('r', 0)
                .style('fill', d => vis.primaryLanguagePhonemes.includes(d.name) && 
                	vis.secondaryLanguagePhonemes.includes(d.name) ? 'green' : 'red')
                .style('opacity', vis.defaultBubbleOpacity)
                .style('stroke-width', '1px')
                .style('cursor', 'pointer')
                .on('click', d => new Audio(`static/audio/${d.name}.ogg`).play())
                .style('stroke', 'black'),
                // .transition()
                // 	.duration(500)
                // 	.attr('r', d => vis.radius(d.frequency)),

            update => update
                .call(update => update
                    .transition("move-bubbles")
                    .duration(500)
                    	.style('fill', d => 
                            (vis.primaryLanguagePhonemes.includes(d.name) && vis.secondaryLanguagePhonemes.includes(d.name)) ? 
                            'green' : 'red')),

            exit => exit.remove()
            	// transition("remove-bubbles")
            	// 	.duration(500)
            	// 	.attr('r', 0)
            	// 	.remove()
        );


    vis.plotLabels = vis.plotLabelContainer.selectAll("text.label")
        .data(vis.chartPhonemes, d => d.name)
        .join(
            enter => enter.append("text")
                .attr('x', vis.width/2)
                .attr('y', vis.height/2)
                .attr("text-anchor", "middle")
                .attr("class", "label")
                .style("font-size", d => `${vis.radius(d.frequency)}px`)
                // .style("stroke-width", "2px")
                .style("opacity", 1.0)
                // .style("dx", d => vis.radius(d.frequency) + 12)
                // .text(d => d.last_name),
                .style('cursor', 'pointer')
                .text(d => d.name)
                .on('click', d => {
                    new Audio(`static/audio/${d.name}.ogg`).play()
                }),

            // update => update
            //     .call(update => update
            //         .transition("move-labels")
            //         .duration(1000)
            //             .attr('x', d => vis.x(100*d.majority_white_zipcode_pct))
            //             .attr('y', d => vis.y(100*d[vis.yAccessor]) + vis.radius(d.donor_count) + 10)),

            exit => exit.remove()
        );

    vis.simulation.restart();

};

