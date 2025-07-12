import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('solarSvg') solarSvg!: ElementRef<SVGSVGElement>;

//datas for planets
  private planets = [
    { name: 'Mercure', distance: 1.0, radius: 6, period: 88, color: '#a9a9a9' }, 
    { name: 'Vénus', distance: 2.3, radius: 8, period: 225, color: '#f4a261' }, 
    { name: 'Terre', distance: 3.2, radius: 10, period: 365.25, color: '#4682b4' }, 
    { name: 'Mars', distance: 5.5, radius: 7, period: 687, color: '#ff4500' }, 
    { name: 'Jupiter', distance: 8.2, radius: 15, period: 4333, color: '#f0c05a' }, 
    { name: 'Saturne', distance: 9.58, radius: 12, period: 10759, color: '#d4a017' }, 
    { name: 'Uranus', distance: 19.18, radius: 10, period: 30688, color: '#87ceeb' }, 
    { name: 'Neptune', distance: 30.07, radius: 9, period: 59800, color: '#4169e1' } 
  ];

  private asteroidBelt = {
    distance: 6.5, 
    count: 100, 
    radius: 1, 
    period: 1825 
  };

  private asteroidIce = {
    distance: 35, 
    count: 1000  , 
    radius: 5,
    period: 1825*3 
  };
  ngAfterViewInit(): void {
    this.drawSolarSystem();
    this.animateSolarSystem();
  }

  private drawSolarSystem(): void {
    const svg = d3.select(this.solarSvg.nativeElement);
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const centerX = width / 2;
    const centerY = height / 2;

    const distanceScale = d3.scaleLinear()
      .domain([0, 30]) 
      .range([0, width / 3]); 

  
    svg.append('rect')
       .attr('width', width)
       .attr('height', height)
       .attr('fill', 'black');

//stars
       for (let i = 0; i < 150; i++) {
      svg.append('circle')
         .attr('cx', Math.random() * width)
         .attr('cy', Math.random() * height)
         .attr('r', Math.random() * 1.5)
         .attr('fill', 'white');
    }

//planet orbit
    this.planets.forEach(planet => {
      svg.append('ellipse')
         .attr('class', `orbit-${planet.name}`)
         .attr('cx', centerX)
         .attr('cy', centerY)
         .attr('rx', distanceScale(planet.distance))
         .attr('ry', distanceScale(planet.distance) * 0.8) 
         .attr('fill', 'none')
         .attr('stroke', '#444')
         .attr('stroke-width', 0.3);
    });

    svg.append('ellipse')
       .attr('class', 'orbit-asteroids')
       .attr('cx', centerX)
       .attr('cy', centerY)
       .attr('rx', distanceScale(this.asteroidBelt.distance))
       .attr('ry', distanceScale(this.asteroidBelt.distance) * 0.8)
       .attr('fill', 'none')
       .attr('stroke', '#666')
       .attr('stroke-width', 0.3);

    svg.append('ellipse')
       .attr('class', 'orbit-asteroids')
       .attr('cx', centerX)
       .attr('cy', centerY)
       .attr('rx', distanceScale(this.asteroidIce.distance))
       .attr('ry', distanceScale(this.asteroidIce.distance) * 0.8)
       .attr('fill', 'none')
       .attr('stroke', '#666')
       .attr('stroke-width', 0.3);

//Draw sun
       svg.append('circle')
       .attr('class', 'sun')
       .attr('cx', centerX)
       .attr('cy', centerY)
       .attr('r', 10) 
       .attr('fill', 'yellow');

    this.planets.forEach(planet => {
      const angle = Math.random() * 2 * Math.PI; 
      svg.append('circle')
         .attr('class', `planet planet-${planet.name}`)
         .attr('r', planet.radius) 
         .attr('fill', planet.color)
         .attr('cx', centerX + distanceScale(planet.distance) * Math.cos(angle))
         .attr('cy', centerY + distanceScale(planet.distance) * 0.8 * Math.sin(angle));
    });

    for (let i = 0; i < this.asteroidBelt.count; i++) {
      const angle = (i / this.asteroidBelt.count) * 2 * Math.PI;
      svg.append('circle')
         .attr('class', 'asteroid')
         .attr('r', this.asteroidBelt.radius)
         .attr('fill', '#b0b0b0')
         .attr('cx', centerX + distanceScale(this.asteroidBelt.distance) * Math.cos(angle))
         .attr('cy', centerY + distanceScale(this.asteroidBelt.distance) * 0.8 * Math.sin(angle));
    }
  }

  private animateSolarSystem(): void {
    const svg = d3.select(this.solarSvg.nativeElement);
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const centerX = width / 2;
    const centerY = height / 2;
    const distanceScale = d3.scaleLinear().domain([0, 30]).range([0, width / 3]);

    const sun = svg.select('.sun');
    const pulse = () => {
      sun.transition()
         .duration(2000)
         .attr('r', 12)
         .transition()
         .duration(2000)
         .attr('r', 10)
         .on('end', pulse);
    };
    pulse();

    this.planets.forEach(planet => {
      const planetElement = svg.select(`.planet-${planet.name}`);
      const initialAngle = Math.random() * 2 * Math.PI;
      const animatePlanet = () => {
        planetElement.transition()
          .duration(planet.period * 100)
          .ease(d3.easeLinear)
          .attrTween('cx', () => {
            return (t: number) => (centerX + distanceScale(planet.distance) * Math.cos(t * 2 * Math.PI + initialAngle)).toString();
          })
          .attrTween('cy', () => {
            return (t: number) => (centerY + distanceScale(planet.distance) * 0.8 * Math.sin(t * 2 * Math.PI + initialAngle)).toString();
          })
          .on('end', animatePlanet);
      };
      animatePlanet();
    });

    const self = this;
    svg.selectAll('.asteroid').each(function(d, i) {
      const asteroid = d3.select(this);
      const offset = (i / self.asteroidBelt.count) * 2 * Math.PI;
      const animateAsteroid = () => {
        asteroid.transition()
          .duration(self.asteroidBelt.period * 100)
          .ease(d3.easeLinear)
          .attrTween('cx', () => {
            return (t: number) => (centerX + distanceScale(self.asteroidBelt.distance) * Math.cos(t * 2 * Math.PI + offset)).toString();
          })
          .attrTween('cy', () => {
            return (t: number) => (centerY + distanceScale(self.asteroidBelt.distance) * 0.8 * Math.sin(t * 2 * Math.PI + offset)).toString();
          })
          .on('end', animateAsteroid);
      };
      animateAsteroid();
    });
  }
}