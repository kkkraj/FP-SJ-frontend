import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import api from '../services/api';

export default function MoodsChart({ currentUserId }) {
    const [moodList, setMoodList] = useState([]);
    const [userMoodData, setUserMoodData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const svgRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both moods list and user mood data
                const [moodsListData, userMoodData] = await Promise.all([
                    api.moods.getAll(),
                    currentUserId ? api.moods.getUserMoodsForMonth(currentUserId) : Promise.resolve([])
                ]);
                
                setMoodList(moodsListData);
                setUserMoodData(userMoodData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching mood data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUserId]);

    // Process user mood data to count occurrences of each mood
    const processMoodData = () => {
        if (!userMoodData || userMoodData.length === 0) {
            // Use mock data if no real data
            return moodList.map((mood, index) => ({
                ...mood,
                count: Math.floor(Math.random() * 30) + 1
            }));
        }

        // Count occurrences of each mood
        const moodCounts = {};
        moodList.forEach(mood => {
            moodCounts[mood.id] = 0;
        });

        userMoodData.forEach(userMood => {
            if (moodCounts.hasOwnProperty(userMood.mood_id)) {
                moodCounts[userMood.mood_id]++;
            }
        });

        // Convert to array with counts
        return moodList.map(mood => ({
            ...mood,
            count: moodCounts[mood.id] || 0
        }));
    };

    useEffect(() => {
        if (!loading && moodList.length > 0) {
            createBubbleChart();
        }
    }, [loading, moodList, userMoodData]);

    const createBubbleChart = () => {
        const data = processMoodData();
        
        // Clear previous chart
        d3.select(svgRef.current).selectAll("*").remove();

        // Set up dimensions
        const margin = { top: 20, right: 20, bottom: 60, left: 20 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Create SVG
        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create color scale
        const colorScale = d3.scaleOrdinal()
            .domain(data.map(d => d.id))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length));

        // Create size scale
        const sizeScale = d3.scaleSqrt()
            .domain([0, d3.max(data, d => d.count)])
            .range([12, 35]);

        // Create simulation
        const simulation = d3.forceSimulation(data)
            .force("charge", d3.forceManyBody().strength(5))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(d => sizeScale(d.count) + 5));

        // Create bubbles
        const bubbles = svg.selectAll(".bubble")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bubble")
            .style("cursor", "pointer");

        // Add bubble circles
        bubbles.append("circle")
            .attr("r", d => sizeScale(d.count))
            .style("fill", d => colorScale(d.id))
            .style("opacity", 0.7)
            .style("stroke", d => d3.color(colorScale(d.id)).darker(0.3))
            .style("stroke-width", 2)
            .on("mouseover", function(event, d) {
                console.log("Mouse over bubble:", d.mood_name, "count:", d.count);
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke-width", 3);
                
                // Show tooltip
                showTooltip(event, d);
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .style("opacity", 0.7)
                    .style("stroke-width", 2);
                
                // Hide tooltip
                hideTooltip();
            })
            .on("click", function(event, d) {
                // Add click animation
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", sizeScale(d.count) * 1.2)
                    .transition()
                    .duration(200)
                    .attr("r", sizeScale(d.count));
            });

        // Add mood images inside bubbles
        bubbles.append("image")
            .attr("xlink:href", d => d.mood_url)
            .attr("x", d => -sizeScale(d.count) * 0.4)
            .attr("y", d => -sizeScale(d.count) * 0.4)
            .attr("width", d => sizeScale(d.count) * 0.8)
            .attr("height", d => sizeScale(d.count) * 0.8)
            .style("pointer-events", "none");



        // Update positions on simulation tick
        simulation.on("tick", () => {
            bubbles.attr("transform", d => `translate(${d.x},${d.y})`);
        });


    };

    // Tooltip functions
    const showTooltip = (event, d) => {
        console.log("Creating tooltip for:", d.mood_name, "count:", d.count);
        
        // Remove any existing tooltips first
        d3.selectAll(".tooltip").remove();
        
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "fixed")
            .style("background", "WhiteSmoke")
            .style("color", "#878f99")
            .style("padding", "8px 12px")
            .style("border-radius", "15px")
            .style("font-family", "Raleway, sans-serif")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("letter-spacing", "1px")
            .style("pointer-events", "none")
            .style("z-index", "99999")
            .style("box-shadow", "0 2px 8px rgba(0,0,0,0.2)")
            .style("min-width", "100px")
            .style("text-align", "center")
            .style("opacity", "1");

        tooltip.html(`
            <div style="margin-bottom: 4px; font-size: 12px; font-weight: bold;">${d.mood_name}</div>
            <div style="font-size: 11px;">Selected ${d.count} time${d.count !== 1 ? 's' : ''}</div>
        `);

        tooltip.style("left", (event.clientX + 20) + "px")
            .style("top", (event.clientY - 20) + "px");
            
        console.log("Tooltip created and positioned");
    };

    const hideTooltip = () => {
        d3.selectAll(".tooltip").remove();
    };

    if (loading) {
        return <div>Loading moods chart...</div>;
    }

    if (error) {
        return <div>Error loading moods chart: {error}</div>;
    }

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ 
                    color: 'rgb(98, 104, 110)', 
                    fontSize: '14px',
                    fontFamily: 'Raleway, sans-serif'
                }}>
                    Bubble size represents how often you selected each mood
                </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg ref={svgRef}></svg>
            </div>
        </div>
    );
}
