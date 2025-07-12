import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('solarSvg') solarSvg!: ElementRef<SVGSVGElement>;

  ngAfterViewInit(): void {
    this.drawSolarSystem();
  }

  private drawSolarSystem(): void {
    const svg = d3.select(this.solarSvg.nativeElement);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    // Dessiner le fond noir
    svg.append('rect')
       .attr('width', width)
       .attr('height', height)
       .attr('fill', 'black');

    // Ajouter des étoiles aléatoires
    for (let i = 0; i < 100; i++) {
      svg.append('circle')
         .attr('cx', Math.random() * width)
         .attr('cy', Math.random() * height)
         .attr('r', Math.random() * 2)
         .attr('fill', 'white');
    }

    // Dessiner le Soleil au centre
    svg.append('circle')
       .attr('cx', width / 2)
       .attr('cy', height / 2)
       .attr('r', 20)
       .attr('fill', 'yellow');
  }
}